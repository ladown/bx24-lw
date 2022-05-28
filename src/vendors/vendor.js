import "./vendor.css";

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/*!
 * GSAP 3.10.4
 * https://greensock.com
 *
 * @license Copyright 2008-2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
},
    _defaults = {
  duration: .5,
  overwrite: false,
  delay: 0
},
    _suppressOverwrites,
    _bigNum = 1e8,
    _tinyNum = 1 / _bigNum,
    _2PI = Math.PI * 2,
    _HALF_PI = _2PI / 4,
    _gsID = 0,
    _sqrt = Math.sqrt,
    _cos = Math.cos,
    _sin = Math.sin,
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isNotFalse = function _isNotFalse(value) {
  return value !== false;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _isFuncOrString = function _isFuncOrString(value) {
  return _isFunction(value) || _isString(value);
},
    _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
    // note: IE10 has ArrayBuffer, but NOT ArrayBuffer.isView().
_isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    //only numbers (including negatives and decimals) but NOT relative values.
_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
    //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
_relExp = /[+-]=-?[.\d]+/,
    _delimitedValueExp = /[^,'"\[\]\s]+/gi,
    // previously /[#\-+.]*\b[a-z\d\-=+%.]+/gi but didn't catch special characters.
_unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
    _globalTimeline,
    _win,
    _coreInitted,
    _doc,
    _globals = {},
    _installScope = {},
    _coreReady,
    _install = function _install(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap;
},
    _missingPlugin = function _missingPlugin(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
},
    _warn = function _warn(message, suppress) {
  return !suppress && console.warn(message);
},
    _addGlobal = function _addGlobal(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
},
    _emptyFunc = function _emptyFunc() {
  return 0;
},
    _reservedProps = {},
    _lazyTweens = [],
    _lazyLookup = {},
    _lastRenderedFrame,
    _plugins = {},
    _effects = {},
    _nextGCFrame = 30,
    _harnessPlugins = [],
    _callbackNames = "",
    _harness = function _harness(targets) {
  var target = targets[0],
      harnessPlugin,
      i;
  _isObject(target) || _isFunction(target) || (targets = [targets]);

  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    // find the first target with a harness. We assume targets passed into an animation will be of similar type, meaning the same kind of harness can be used for them all (performance optimization)
    i = _harnessPlugins.length;

    while (i-- && !_harnessPlugins[i].targetTest(target)) {}

    harnessPlugin = _harnessPlugins[i];
  }

  i = targets.length;

  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }

  return targets;
},
    _getCache = function _getCache(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
},
    _getProperty = function _getProperty(target, property, v) {
  return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
},
    _forEachName = function _forEachName(names, func) {
  return (names = names.split(",")).forEach(func) || names;
},
    //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
_round = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _roundPrecise = function _roundPrecise(value) {
  return Math.round(value * 10000000) / 10000000 || 0;
},
    // increased precision mostly for timing values.
_parseRelative = function _parseRelative(start, value) {
  var operator = value.charAt(0),
      end = parseFloat(value.substr(2));
  start = parseFloat(start);
  return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
},
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
  //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
  var l = toFind.length,
      i = 0;

  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

  return i < l;
},
    _lazyRender = function _lazyRender() {
  var l = _lazyTweens.length,
      a = _lazyTweens.slice(0),
      i,
      tween;

  _lazyLookup = {};
  _lazyTweens.length = 0;

  for (i = 0; i < l; i++) {
    tween = a[i];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
},
    _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
  _lazyTweens.length && _lazyRender();
  animation.render(time, suppressEvents, force);
  _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
},
    _numericIfPossible = function _numericIfPossible(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
},
    _passThrough = function _passThrough(p) {
  return p;
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || (obj[p] = defaults[p]);
  }

  return obj;
},
    _setKeyframeDefaults = function _setKeyframeDefaults(excludeDuration) {
  return function (obj, defaults) {
    for (var p in defaults) {
      p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults[p]);
    }
  };
},
    _merge = function _merge(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }

  return base;
},
    _mergeDeep = function _mergeDeep(base, toMerge) {
  for (var p in toMerge) {
    p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
  }

  return base;
},
    _copyExcluding = function _copyExcluding(obj, excluding) {
  var copy = {},
      p;

  for (p in obj) {
    p in excluding || (copy[p] = obj[p]);
  }

  return copy;
},
    _inheritDefaults = function _inheritDefaults(vars) {
  var parent = vars.parent || _globalTimeline,
      func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;

  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent || parent._dp;
    }
  }

  return vars;
},
    _arraysMatch = function _arraysMatch(a1, a2) {
  var i = a1.length,
      match = i === a2.length;

  while (match && i-- && a1[i] === a2[i]) {}

  return i < 0;
},
    _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = parent[lastProp],
      t;

  if (sortBy) {
    t = child[sortBy];

    while (prev && prev[sortBy] > t) {
      prev = prev._prev;
    }
  }

  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }

  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }

  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
},
    _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = child._prev,
      next = child._next;

  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }

  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }

  child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
},
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
  child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child);
  child._act = 0;
},
    _uncache = function _uncache(animation, child) {
  if (animation && (!child || child._end > animation._dur || child._start < 0)) {
    // performance optimization: if a child animation is passed in we should only uncache if that child EXTENDS the animation (its end time is beyond the end)
    var a = animation;

    while (a) {
      a._dirty = 1;
      a = a.parent;
    }
  }

  return animation;
},
    _recacheAncestors = function _recacheAncestors(animation) {
  var parent = animation.parent;

  while (parent && parent.parent) {
    //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }

  return animation;
},
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
},
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
},
    // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
_animationCycle = function _animationCycle(tTime, cycleDuration) {
  var whole = Math.floor(tTime /= cycleDuration);
  return tTime && whole === tTime ? whole - 1 : whole;
},
    _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
},
    _setEnd = function _setEnd(animation) {
  return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
},
    _alignPlayhead = function _alignPlayhead(animation, totalTime) {
  // adjusts the animation's _start and _end according to the provided totalTime (only if the parent's smoothChildTiming is true and the animation isn't paused). It doesn't do any rendering or forcing things back into parent timelines, etc. - that's what totalTime() is for.
  var parent = animation._dp;

  if (parent && parent.smoothChildTiming && animation._ts) {
    animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));

    _setEnd(animation);

    parent._dirty || _uncache(parent, animation); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
  }

  return animation;
},

/*
_totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
	let cycleDuration = duration + repeatDelay,
		time = _round(clampedTotalTime % cycleDuration);
	if (time > duration) {
		time = duration;
	}
	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
},
*/
_postAddChecks = function _postAddChecks(timeline, child) {
  var t;

  if (child._time || child._initted && !child._dur) {
    //in case, for example, the _start is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
    t = _parentToChildTotalTime(timeline.rawTime(), child);

    if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.


  if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
    //in case any of the ancestors had completed but should now be enabled...
    if (timeline._dur < timeline.duration()) {
      t = timeline;

      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

        t = t._dp;
      }
    }

    timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
  }
},
    _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _roundPrecise((_isNumber(position) ? position : position || timeline !== _globalTimeline ? _parsePosition(timeline, position, child) : timeline._time) + child._delay);
  child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

  _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

  _isFromOrFromStart(child) || (timeline._recent = child);
  skipChecks || _postAddChecks(timeline, child);
  return timeline;
},
    _scrollTrigger = function _scrollTrigger(animation, trigger) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
},
    _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
  _initTween(tween, totalTime);

  if (!tween._initted) {
    return 1;
  }

  if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);

    tween._lazy = [totalTime, suppressEvents];
    return 1;
  }
},
    _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
  var parent = _ref.parent;
  return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
},
    // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0
_isFromOrFromStart = function _isFromOrFromStart(_ref2) {
  var data = _ref2.data;
  return data === "isFromStart" || data === "isStart";
},
    _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio,
      ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1,
      // if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0. Edge case: if a from() or fromTo() stagger tween is placed later in a timeline, the "startAt" zero-duration tween could initially render at a time when the parent timeline's playhead is technically BEFORE where this tween is, so make sure that any "from" and "fromTo" startAt tweens are rendered the first time at a ratio of 1.
  repeatDelay = tween._rDelay,
      tTime = 0,
      pt,
      iteration,
      prevIteration;

  if (repeatDelay && tween._repeat) {
    // in case there's a zero-duration tween that has a repeat with a repeatDelay
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    tween._yoyo && iteration & 1 && (ratio = 1 - ratio);

    if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
      // if iteration changed
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }

  if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
      // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
      return;
    }

    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

    suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.

    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    pt = tween._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }

    tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
    tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");

    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);

      if (!suppressEvents) {
        _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);

        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
},
    _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
  var child;

  if (time > prevTime) {
    child = animation._first;

    while (child && child._start <= time) {
      if (child.data === "isPause" && child._start > prevTime) {
        return child;
      }

      child = child._next;
    }
  } else {
    child = animation._last;

    while (child && child._start >= time) {
      if (child.data === "isPause" && child._start < prevTime) {
        return child;
      }

      child = child._prev;
    }
  }
},
    _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
  var repeat = animation._repeat,
      dur = _roundPrecise(duration) || 0,
      totalProgress = animation._tTime / animation._tDur;
  totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
  totalProgress > 0 && !leavePlayhead ? _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress) : animation.parent && _setEnd(animation);
  skipUncache || _uncache(animation.parent, animation);
  return animation;
},
    _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
},
    _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc,
  totalDuration: _emptyFunc
},
    _parsePosition = function _parsePosition(animation, position, percentAnimation) {
  var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
      //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
  i,
      offset,
      isPercent;

  if (_isString(position) && (isNaN(position) || position in labels)) {
    //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
    offset = position.charAt(0);
    isPercent = position.substr(-1) === "%";
    i = position.indexOf("=");

    if (offset === "<" || offset === ">") {
      i >= 0 && (position = position.replace(/=/, ""));
      return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
    }

    if (i < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }

    offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));

    if (isPercent && percentAnimation) {
      offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
    }

    return i > 1 ? _parsePosition(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
  }

  return position == null ? clippedDuration : +position;
},
    _createTweenType = function _createTweenType(type, params, timeline) {
  var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars,
      parent;

  isLegacy && (vars.duration = params[1]);
  vars.parent = timeline;

  if (type) {
    irVars = vars;
    parent = timeline;

    while (parent && !("immediateRender" in irVars)) {
      // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }

    vars.immediateRender = _isNotFalse(irVars.immediateRender);
    type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1]; // "from" vars
  }

  return new Tween(params[0], vars, params[varsIndex + 1]);
},
    _conditionalReturn = function _conditionalReturn(value, func) {
  return value || value === 0 ? func(value) : func;
},
    _clamp = function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
},
    getUnit = function getUnit(value, v) {
  return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
},
    // note: protect against padded numbers as strings, like "100.100". That shouldn't return "00" as the unit. If it's numeric, return no unit.
clamp = function clamp(min, max, value) {
  return _conditionalReturn(value, function (v) {
    return _clamp(min, max, v);
  });
},
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
},
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }

  return ar.forEach(function (value) {
    var _accumulator;

    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
},
    //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
toArray = function toArray(value, scope, leaveStrings) {
  return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
},
    selector = function selector(value) {
  value = toArray(value)[0] || _warn("Invalid scope") || {};
  return function (v) {
    var el = value.current || value.nativeElement || value;
    return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
  };
},
    shuffle = function shuffle(a) {
  return a.sort(function () {
    return .5 - Math.random();
  });
},
    // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = Math.floor(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
distribute = function distribute(v) {
  if (_isFunction(v)) {
    return v;
  }

  var vars = _isObject(v) ? v : {
    each: v
  },
      //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
  ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;

  if (_isString(from)) {
    ratioX = ratioY = {
      center: .5,
      edges: .5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }

  return function (i, target, a) {
    var l = (a || vars).length,
        distances = cache[l],
        originX,
        originY,
        x,
        y,
        d,
        j,
        max,
        min,
        wrapAt;

    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

      if (!wrapAt) {
        max = -_bigNum;

        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

        wrapAt--;
      }

      distances = cache[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
      originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum;

      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
        d > max && (max = d);
        d < min && (min = d);
      }

      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0; //unit

      ease = ease && l < 0 ? _invertEase(ease) : ease;
    }

    l = (distances[i] - distances.min) / distances.max || 0;
    return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
  };
},
    _roundModifier = function _roundModifier(v) {
  //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
  var p = Math.pow(10, ((v + "").split(".")[1] || "").length); //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed())

  return function (raw) {
    var n = Math.round(parseFloat(raw) / v) * v * p;
    return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw)); // n - n % 1 replaces Math.floor() in order to handle negative values properly. For example, Math.floor(-150.00000000000003) is 151!
  };
},
    snap = function snap(snapTo, value) {
  var isArray = _isArray(snapTo),
      radius,
      is2D;

  if (!isArray && _isObject(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum;

    if (snapTo.values) {
      snapTo = toArray(snapTo.values);

      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }

  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function (raw) {
    var x = parseFloat(is2D ? raw.x : raw),
        y = parseFloat(is2D ? raw.y : 0),
        min = _bigNum,
        closest = 0,
        i = snapTo.length,
        dx,
        dy;

    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }

      if (dx < min) {
        min = dx;
        closest = i;
      }
    }

    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
  });
},
    random = function random(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
},
    pipe = function pipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (value) {
    return functions.reduce(function (v, f) {
      return f(v);
    }, value);
  };
},
    unitize = function unitize(func, unit) {
  return function (value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
},
    normalize = function normalize(min, max, value) {
  return mapRange(min, max, 0, 1, value);
},
    _wrapArray = function _wrapArray(a, wrapper, value) {
  return _conditionalReturn(value, function (index) {
    return a[~~wrapper(index)];
  });
},
    wrap = function wrap(min, max, value) {
  // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
    return (range + (value - min) % range) % range + min;
  });
},
    wrapYoyo = function wrapYoyo(min, max, value) {
  var range = max - min,
      total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
    value = (total + (value - min) % total) % total || 0;
    return min + (value > range ? total - value : value);
  });
},
    _replaceRandom = function _replaceRandom(value) {
  //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
  var prev = 0,
      s = "",
      i,
      nums,
      end,
      isArray;

  while (~(i = value.indexOf("random(", prev))) {
    end = value.indexOf(")", i);
    isArray = value.charAt(i + 7) === "[";
    nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
    s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
    prev = end + 1;
  }

  return s + value.substr(prev, value.length - prev);
},
    mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin,
      outRange = outMax - outMin;
  return _conditionalReturn(value, function (value) {
    return outMin + ((value - inMin) / inRange * outRange || 0);
  });
},
    interpolate = function interpolate(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function (p) {
    return (1 - p) * start + p * end;
  };

  if (!func) {
    var isString = _isString(start),
        master = {},
        p,
        i,
        interpolators,
        l,
        il;

    progress === true && (mutate = 1) && (progress = null);

    if (isString) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l = start.length;
      il = l - 2;

      for (i = 1; i < l; i++) {
        interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
      }

      l--;

      func = function func(p) {
        p *= l;
        var i = Math.min(il, ~~p);
        return interpolators[i](p - i);
      };

      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }

    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master, start, p, "get", end[p]);
      }

      func = function func(p) {
        return _renderPropTweens(p, master) || (isString ? start.p : start);
      };
    }
  }

  return _conditionalReturn(progress, func);
},
    _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
  //used for nextLabel() and previousLabel()
  var labels = timeline.labels,
      min = _bigNum,
      p,
      distance,
      label;

  for (p in labels) {
    distance = labels[p] - fromTime;

    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }

  return label;
},
    _callback = function _callback(animation, type, executeLazyFirst) {
  var v = animation.vars,
      callback = v[type],
      params,
      scope;

  if (!callback) {
    return;
  }

  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

  return params ? callback.apply(scope, params) : callback.call(scope);
},
    _interrupt = function _interrupt(animation) {
  _removeFromParent(animation);

  animation.scrollTrigger && animation.scrollTrigger.kill(false);
  animation.progress() < 1 && _callback(animation, "onInterrupt");
  return animation;
},
    _quickTween,
    _createPlugin = function _createPlugin(config) {
  config = !config.name && config["default"] || config; //UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

  var name = config.name,
      isFunc = _isFunction(config),
      Plugin = name && !isFunc && config.init ? function () {
    this._props = [];
  } : config,
      //in case someone passes in an object that's not a plugin, like CustomEase
  instanceDefaults = {
    init: _emptyFunc,
    render: _renderPropTweens,
    add: _addPropTween,
    kill: _killPropTweensOf,
    modifier: _addPluginModifier,
    rawVars: 0
  },
      statics = {
    targetTest: 0,
    get: 0,
    getSetter: _getSetter,
    aliases: {},
    register: 0
  };

  _wake();

  if (config !== Plugin) {
    if (_plugins[name]) {
      return;
    }

    _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods


    _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods


    _plugins[Plugin.prop = name] = Plugin;

    if (config.targetTest) {
      _harnessPlugins.push(Plugin);

      _reservedProps[name] = 1;
    }

    name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
  }

  _addGlobal(name, Plugin);

  config.register && config.register(gsap, Plugin, PropTween);
},

/*
 * --------------------------------------------------------------------------------------
 * COLORS
 * --------------------------------------------------------------------------------------
 */
_255 = 255,
    _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
},
    // possible future idea to replace the hard-coded color name values - put this in the ticker.wake() where we set the _doc:
// let ctx = _doc.createElement("canvas").getContext("2d");
// _forEachName("aqua,lime,silver,black,maroon,teal,blue,navy,white,olive,yellow,orange,gray,purple,green,red,pink,cyan", color => {ctx.fillStyle = color; _colorLookup[color] = splitColor(ctx.fillStyle)});
_hue = function _hue(h, m1, m2) {
  h += h < 0 ? 1 : h > 1 ? -1 : 0;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
},
    splitColor = function splitColor(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
      r,
      g,
      b,
      h,
      s,
      l,
      max,
      min,
      d,
      wasHSL;

  if (!a) {
    if (v.substr(-1) === ",") {
      //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
      v = v.substr(0, v.length - 1);
    }

    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length < 6) {
        //for shorthand like #9F0 or #9F0F (could have alpha)
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
      }

      if (v.length === 9) {
        // hex with alpha, like #fd5e53ff
        a = parseInt(v.substr(1, 6), 16);
        return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
      }

      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);

      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= .5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;
        a.length > 3 && (a[3] *= 1); //cast as number

        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        //if relative values are found, just return the raw strings with the relative prefixes in place.
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }

    a = a.map(Number);
  }

  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }

    a[0] = ~~(h + .5);
    a[1] = ~~(s * 100 + .5);
    a[2] = ~~(l * 100 + .5);
  }

  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
},
    _colorOrderData = function _colorOrderData(v) {
  // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
  var values = [],
      c = [],
      i = -1;
  v.split(_colorExp).forEach(function (v) {
    var a = v.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
},
    _formatColors = function _formatColors(s, toHSL, orderMatchData) {
  var result = "",
      colors = (s + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i = 0,
      c,
      shell,
      d,
      l;

  if (!colors) {
    return s;
  }

  colors = colors.map(function (color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });

  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;

    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }

  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;

    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }

  return result + shell[l];
},
    _colorExp = function () {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
  p;

  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }

  return new RegExp(s + ")", "gi");
}(),
    _hslExp = /hsl[a]?\(/,
    _colorStringFilter = function _colorStringFilter(a) {
  var combined = a.join(" "),
      toHSL;
  _colorExp.lastIndex = 0;

  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

    return true;
  }
},

/*
 * --------------------------------------------------------------------------------------
 * TICKER
 * --------------------------------------------------------------------------------------
 */
_tickerActive,
    _ticker = function () {
  var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1000 / 240,
      _nextTime = _gap,
      _listeners = [],
      _id,
      _req,
      _raf,
      _self,
      _delta,
      _i,
      _tick = function _tick(v) {
    var elapsed = _getTime() - _lastUpdate,
        manual = v === true,
        overlap,
        dispatch,
        time,
        frame;

    elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;

    if (overlap > 0 || manual) {
      frame = ++_self.frame;
      _delta = time - _self.time * 1000;
      _self.time = time = time / 1000;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }

    manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.

    if (dispatch) {
      for (_i = 0; _i < _listeners.length; _i++) {
        // use _i and check _listeners.length instead of a variable because a listener could get removed during the loop, and if that happens to an element less than the current index, it'd throw things off in the loop.
        _listeners[_i](time, _delta, frame, v);
      }
    }
  };

  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    deltaRatio: function deltaRatio(fps) {
      return _delta / (1000 / (fps || 60));
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted && _windowExists()) {
          _win = _coreInitted = window;
          _doc = _win.document || {};
          _globals.gsap = gsap;
          (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

          _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

          _raf = _win.requestAnimationFrame;
        }

        _id && _self.sleep();

        _req = _raf || function (f) {
          return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
        };

        _tickerActive = 1;

        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || 1 / _tinyNum; //zero should be interpreted as basically unlimited

      _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
    },
    fps: function fps(_fps) {
      _gap = 1000 / (_fps || 240);
      _nextTime = _self.time * 1000 + _gap;
    },
    add: function add(callback, once, prioritize) {
      var func = once ? function (t, d, f, v) {
        callback(t, d, f, v);

        _self.remove(func);
      } : callback;

      _self.remove(callback);

      _listeners[prioritize ? "unshift" : "push"](func);

      _wake();

      return func;
    },
    remove: function remove(callback, i) {
      ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
    },
    _listeners: _listeners
  };
  return _self;
}(),
    _wake = function _wake() {
  return !_tickerActive && _ticker.wake();
},
    //also ensures the core classes are initialized.

/*
* -------------------------------------------------
* EASING
* -------------------------------------------------
*/
_easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
  //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
  var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i = 1,
      l = split.length,
      index,
      val,
      parsedVal;

  for (; i < l; i++) {
    val = split[i];
    index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index + 1).trim();
  }

  return obj;
},
    _valueInParentheses = function _valueInParentheses(value) {
  var open = value.indexOf("(") + 1,
      close = value.indexOf(")"),
      nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
},
    _configEaseFromString = function _configEaseFromString(name) {
  //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
  var split = (name + "").split("("),
      ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
},
    _invertEase = function _invertEase(ease) {
  return function (p) {
    return 1 - ease(1 - p);
  };
},
    // allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
_propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
  var child = timeline._first,
      ease;

  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }

    child = child._next;
  }
},
    _parseEase = function _parseEase(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
},
    _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut(p) {
      return 1 - easeIn(1 - p);
    };
  }

  if (easeInOut === void 0) {
    easeInOut = function easeInOut(p) {
      return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }

  var ease = {
    easeIn: easeIn,
    easeOut: easeOut,
    easeInOut: easeInOut
  },
      lowercaseName;

  _forEachName(names, function (name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

    for (var p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });

  return ease;
},
    _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
  return function (p) {
    return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
  };
},
    _configElastic = function _configElastic(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1,
      //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
  p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
      p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  p2 = _2PI / p2; //precalculate to optimize

  ease.config = function (amplitude, period) {
    return _configElastic(type, amplitude, period);
  };

  return ease;
},
    _configBack = function _configBack(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }

  var easeOut = function easeOut(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  ease.config = function (overshoot) {
    return _configBack(type, overshoot);
  };

  return ease;
}; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEase = ratio => {
// 	let y = 0.5 + ratio / 2;
// 	return p => (2 * (1 - p) * p * y + p * p);
// },
// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEaseStrong = ratio => {
// 	ratio = .5 + ratio / 2;
// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
// 		b = ratio - o,
// 		c = ratio + o;
// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
// };


_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  var power = i < 5 ? i + 1 : i;

  _insertEase(name + ",Power" + (power - 1), i ? function (p) {
    return Math.pow(p, power);
  } : function (p) {
    return p;
  }, function (p) {
    return 1 - Math.pow(1 - p, power);
  }, function (p) {
    return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});

_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

(function (n, c) {
  var n1 = 1 / c,
      n2 = 2 * n1,
      n3 = 2.5 * n1,
      easeOut = function easeOut(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
  };

  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);

_insertEase("Expo", function (p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});

_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});

_insertEase("Sine", function (p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});

_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }

    var p1 = 1 / steps,
        p2 = steps + (immediateStart ? 0 : 1),
        p3 = immediateStart ? 1 : 0,
        max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];

_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
  return _callbackNames += name + "," + name + "Params,";
});
/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */


export var GSCache = function GSCache(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */

export var Animation = /*#__PURE__*/function () {
  function Animation(vars) {
    this.vars = vars;
    this._delay = +vars.delay || 0;

    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      // TODO: repeat: Infinity on a timeline's children must flag that timeline internally and affect its totalDuration, otherwise it'll stop in the negative direction when reaching the start.
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }

    this._ts = 1;

    _setDuration(this, +vars.duration, 1, 1);

    this.data = vars.data;
    _tickerActive || _ticker.wake();
  }

  var _proto = Animation.prototype;

  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }

    return this._delay;
  };

  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };

  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }

    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };

  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();

    if (!arguments.length) {
      return this._tTime;
    }

    var parent = this._dp;

    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);

      !parent._dp || parent.parent || _postAddChecks(parent, this); // edge case: if this is a child of a timeline that already completed, for example, we must re-activate the parent.
      //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.

      while (parent && parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }

        parent = parent.parent;
      }

      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }

    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      // check for _ptLookup on a Tween instance to ensure it has actually finished being instantiated, otherwise if this.reverse() gets called in the Animation constructor, it could trigger a render() here even though the _targets weren't populated, thus when _init() is called there won't be any PropTweens (it'll act like the tween is non-functional)
      this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause
      //if (!this._lock) { // avoid endless recursion (not sure we need this yet or if it's worth the performance hit)
      //   this._lock = 1;

      _lazySafeRender(this, _totalTime, suppressEvents); //   this._lock = 0;
      //}

    }

    return this;
  };

  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
  };

  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
  };

  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
  };

  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;

    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  } // potential future addition:
  // isPlayingBackwards() {
  // 	let animation = this,
  // 		orientation = 1; // 1 = forward, -1 = backward
  // 	while (animation) {
  // 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
  // 		animation = animation.parent;
  // 	}
  // 	return orientation < 0;
  // }
  ;

  _proto.timeScale = function timeScale(value) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
    }

    if (this._rts === value) {
      return this;
    }

    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
    // future addition? Up side: fast and minimal file size. Down side: only works on this animation; if a timeline is reversed, for example, its childrens' onReverse wouldn't get called.
    //(+value < 0 && this._rts >= 0) && _callback(this, "onReverse", true);
    // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.

    this.totalTime(_clamp(-this._delay, this._tDur, tTime), true);

    _setEnd(this); // if parent.smoothChildTiming was false, the end time didn't get updated in the _alignPlayhead() method, so do it here.


    return _recacheAncestors(this);
  };

  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }

    if (this._ps !== value) {
      this._ps = value;

      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

        this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
      } else {
        _wake();

        this._ts = this._rts; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum)); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
      }
    }

    return this;
  };

  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
      return this;
    }

    return this._start;
  };

  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  };

  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp; // _dp = detached parent

    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };

  _proto.globalTime = function globalTime(rawTime) {
    var animation = this,
        time = arguments.length ? rawTime : animation.rawTime();

    while (animation) {
      time = animation._start + time / (animation._ts || 1);
      animation = animation._dp;
    }

    return time;
  };

  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }

    return this._repeat === -2 ? Infinity : this._repeat;
  };

  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      var time = this._time;
      this._rDelay = value;

      _onUpdateTotalDuration(this);

      return time ? this.time(time) : this;
    }

    return this._rDelay;
  };

  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }

    return this._yoyo;
  };

  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };

  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
  };

  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };

  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };

  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };

  _proto.resume = function resume() {
    return this.paused(false);
  };

  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.

      return this;
    }

    return this._rts < 0;
  };

  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };

  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp,
        start = this._start,
        rawTime;
    return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };

  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;

    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }

      return this;
    }

    return vars[type];
  };

  _proto.then = function then(onFulfilled) {
    var self = this;
    return new Promise(function (resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
          _resolve = function _resolve() {
        var _then = self.then;
        self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

        _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
        resolve(f);
        self.then = _then;
      };

      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };

  _proto.kill = function kill() {
    _interrupt(this);
  };

  return Animation;
}();

_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */


export var Timeline = /*#__PURE__*/function (_Animation) {
  _inheritsLoose(Timeline, _Animation);

  function Timeline(vars, position) {
    var _this;

    if (vars === void 0) {
      vars = {};
    }

    _this = _Animation.call(this, vars) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
    vars.reversed && _this.reverse();
    vars.paused && _this.paused(true);
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }

  var _proto2 = Timeline.prototype;

  _proto2.to = function to(targets, vars, position) {
    _createTweenType(0, arguments, this);

    return this;
  };

  _proto2.from = function from(targets, vars, position) {
    _createTweenType(1, arguments, this);

    return this;
  };

  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    _createTweenType(2, arguments, this);

    return this;
  };

  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };

  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
  } //ONLY for backward compatibility! Maybe delete?
  ;

  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };

  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._dirty ? this.totalDuration() : this._tDur,
        dur = this._dur,
        tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime),
        // if a paused timeline is resumed (or its _start is updated for another reason...which rounds it), that could result in the playhead shifting a **tiny** amount and a zero-duration child at that spot may get rendered at a different ratio, like its totalTime in render() may be 1e-17 instead of 0, for example.
    crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
        time,
        child,
        next,
        iteration,
        cycleDuration,
        prevPaused,
        pauseTween,
        timeScale,
        prevStart,
        prevIteration,
        yoyo,
        isYoyo;
    this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);

    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }

      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;

      if (crossingStart) {
        dur || (prevTime = this._zTime); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          time > dur && (time = dur);
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://greensock.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005

        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        /*
        make sure children at the end/beginning of the timeline are rendered properly. If, for example,
        a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
        would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
        could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
        we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
        ensure that zero-duration tweens at the very beginning or end of the Timeline work.
        */


        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : dur;
          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          this._tTime = tTime; // if a user gets the iteration() inside the onRepeat, for example, it should be accurate.

          !suppressEvents && this.parent && _callback(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

          if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
            // if prevTime is 0 and we render at the very end, _time will be the end, thus won't match. So in this edge case, prevTime won't match _time but that's okay. If it gets killed in the onRepeat, eject as well.
            return this;
          }

          dur = this._dur; // in case the duration changed in the onRepeat

          tDur = this._tDur;

          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -0.0001;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }

          this._lock = 0;

          if (!this._ts && !prevPaused) {
            return this;
          } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.


          _propagateYoyoEase(this, isYoyo);
        }
      }

      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));

        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }

      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0; // upon init, the playhead should always go forward; someone could invalidate() a completed timeline and then if they restart(), that would make child tweens render in reverse order which could lock in the wrong starting values if they build on each other, like tl.to(obj, {x: 100}).to(obj, {x: 0}).
      }

      if (!prevTime && time && !suppressEvents) {
        _callback(this, "onStart");

        if (this._tTime !== tTime) {
          // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
          return this;
        }
      }

      if (time >= prevTime && totalTime >= 0) {
        child = this._first;

        while (child) {
          next = child._next;

          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

        while (child) {
          next = child._prev;

          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      }

      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

        if (this._ts) {
          //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
          this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

          _setEnd(this);

          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
        // remember, a child's callback may alter this timeline's playhead or timeScale which is why we need to add some of these checks.
        (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
          _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto2.add = function add(child, position) {
    var _this2 = this;

    _isNumber(position) || (position = _parsePosition(this, position, child));

    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return this;
      }

      if (_isString(child)) {
        return this.addLabel(child, position);
      }

      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }

    return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
  };

  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }

    if (tweens === void 0) {
      tweens = true;
    }

    if (timelines === void 0) {
      timelines = true;
    }

    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum;
    }

    var a = [],
        child = this._first;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }

      child = child._next;
    }

    return a;
  };

  _proto2.getById = function getById(id) {
    var animations = this.getChildren(1, 1, 1),
        i = animations.length;

    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };

  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }

    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }

    _removeLinkedListItem(this, child);

    if (child === this._recent) {
      this._recent = this._last;
    }

    return _uncache(this);
  };

  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }

    this._forcing = 1;

    if (!this._dp && this._ts) {
      //special case for the global timeline (or any other that has no parent or detached parent).
      this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }

    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

    this._forcing = 0;
    return this;
  };

  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };

  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };

  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };

  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);

    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }

      child = child._next;
    }
  };

  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
        i = tweens.length;

    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }

    return this;
  };

  _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
    var a = [],
        parsedTargets = toArray(targets),
        child = this._first,
        isGlobalTime = _isNumber(onlyActive),
        // a number is interpreted as a global time. If the animation spans
    children;

    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          // note: if this is for overwriting, it should only be for tweens that aren't paused and are initted.
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }

      child = child._next;
    }

    return a;
  } // potential future feature - targets() on timelines
  // targets() {
  // 	let result = [];
  // 	this.getChildren(true, true, false).forEach(t => result.push(...t.targets()));
  // 	return result.filter((v, i) => result.indexOf(v) === i);
  // }
  ;

  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};

    var tl = this,
        endTime = _parsePosition(tl, position),
        _vars = vars,
        startAt = _vars.startAt,
        _onStart = _vars.onStart,
        onStartParams = _vars.onStartParams,
        immediateRender = _vars.immediateRender,
        initted,
        tween = Tween.to(tl, _setDefaults({
      ease: vars.ease || "none",
      lazy: false,
      immediateRender: false,
      time: endTime,
      overwrite: "auto",
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl.pause();

        if (!initted) {
          var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
          tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
          initted = 1;
        }

        _onStart && _onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
      }
    }, vars));

    return immediateRender ? tween.render(0) : tween;
  };

  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };

  _proto2.recent = function recent() {
    return this._recent;
  };

  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };

  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };

  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };

  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }

    var child = this._first,
        labels = this.labels,
        p;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }

      child = child._next;
    }

    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }

    return _uncache(this);
  };

  _proto2.invalidate = function invalidate() {
    var child = this._first;
    this._lock = 0;

    while (child) {
      child.invalidate();
      child = child._next;
    }

    return _Animation.prototype.invalidate.call(this);
  };

  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }

    var child = this._first,
        next;

    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }

    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };

  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
        self = this,
        child = self._last,
        prevStart = _bigNum,
        prev,
        start,
        parent;

    if (arguments.length) {
      return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
    }

    if (self._dirty) {
      parent = self.parent;

      while (child) {
        prev = child._prev; //record it here in case the tween changes position in the sequence...

        child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.

        start = child._start;

        if (start > prevStart && self._sort && child._ts && !self._lock) {
          //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
          self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

          _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }

        if (start < 0 && child._ts) {
          //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
          max -= start;

          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += start / self._ts;
            self._time -= start;
            self._tTime -= start;
          }

          self.shiftChildren(-start, false, -1e999);
          prevStart = 0;
        }

        child._end > max && child._ts && (max = child._end);
        child = prev;
      }

      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);

      self._dirty = 0;
    }

    return self._tDur;
  };

  Timeline.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

      _lastRenderedFrame = _ticker.frame;
    }

    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
        while (child && !child._ts) {
          child = child._next;
        }

        child || _ticker.sleep();
      }
    }
  };

  return Timeline;
}(Animation);

_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});

var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
  //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }

  if (stringFilter) {
    a = [start, end];
    stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

    start = a[0];
    end = a[1];
  }

  startNums = start.match(_complexStringNumExp) || [];

  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);

    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }

    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }

  pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

  pt.fp = funcParam;

  if (_relExp.test(end) || hasRandom) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
  _isFunction(end) && (end = end(index || 0, target, targets));
  var currentValue = target[prop],
      parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
      setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
      pt;

  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (end.charAt(1) === "=") {
      pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);

      if (pt || pt === 0) {
        // to avoid isNaN, like if someone passes in a value like "!= whatever"
        end = pt;
      }
    }
  }

  if (parsedStart !== end || _forceAllPropTweens) {
    if (!isNaN(parsedStart * end) && end !== "") {
      // fun fact: any number multiplied by "" is evaluated as the number 0!
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }

    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
},
    //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
_processVars = function _processVars(vars, index, target, targets, tween) {
  _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));

  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }

  var copy = {},
      p;

  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
  }

  return copy;
},
    _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i;

  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

      i = plugin._props.length;

      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }

  return plugin;
},
    _overwritingTween,
    //store a reference temporarily so we can avoid overwriting itself.
_forceAllPropTweens,
    _initTween = function _initTween(tween, time) {
  var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      onUpdateParams = vars.onUpdateParams,
      callbackScope = vars.callbackScope,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
      autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites,
      tl = tween.timeline,
      cleanVars,
      i,
      p,
      pt,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars,
      overwritten;
  tl && (!keyframes || !ease) && (ease = "none");
  tween._ease = _parseEase(ease, _defaults.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

  if (yoyoEase && tween._yoyo && !tween._repeat) {
    //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }

  tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

  if (!tl || keyframes && !vars.stagger) {
    //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

    cleanVars = _copyExcluding(vars, _reservedProps);

    if (prevStartAt) {
      _removeFromParent(prevStartAt.render(-1, true));

      prevStartAt._lazy = 0;
    }

    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent: parent,
        immediateRender: true,
        lazy: _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate,
        onUpdateParams: onUpdateParams,
        callbackScope: callbackScope,
        stagger: 0
      }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);


      time < 0 && !immediateRender && !autoRevert && tween._startAt.render(-1, true); // rare edge case, like if a render is forced in the negative direction of a non-initted tween.

      if (immediateRender) {
        time > 0 && !autoRevert && (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.

        if (dur && time <= 0) {
          time && (tween._zTime = time);
          return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        } // if (time > 0) {
        // 	autoRevert || (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.
        // } else if (dur && !(time < 0 && prevStartAt)) {
        // 	time && (tween._zTime = time);
        // 	return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        // }

      } else if (autoRevert === false) {
        tween._startAt = 0;
      }
    } else if (runBackwards && dur) {
      //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
      if (prevStartAt) {
        !autoRevert && (tween._startAt = 0);
      } else {
        time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0

        p = _setDefaults({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && _isNotFalse(lazy),
          immediateRender: immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})

        }, cleanVars);
        harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})

        _removeFromParent(tween._startAt = Tween.set(targets, p));

        time < 0 && tween._startAt.render(-1, true); // rare edge case, like if a render is forced in the negative direction of a non-initted from() tween.

        tween._zTime = time;

        if (!immediateRender) {
          _initTween(tween._startAt, _tinyNum); //ensures that the initial values are recorded

        } else if (!time) {
          return;
        }
      }
    }

    tween._pt = tween._ptCache = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;

    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

      index = fullTargets === targets ? i : fullTargets.indexOf(target);

      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

        plugin._props.forEach(function (name) {
          ptLookup[name] = pt;
        });

        plugin.priority && (hasPriority = 1);
      }

      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }

      tween._op && tween._op[i] && tween.kill(target, tween._op[i]);

      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;

        _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time)); // make sure the overwriting doesn't overwrite THIS tween!!!


        overwritten = !tween.parent;
        _overwritingTween = 0;
      }

      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }

    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
  }

  tween._onUpdate = onUpdate;
  tween._initted = (!tween._op || tween._pt) && !overwritten; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.

  keyframes && time <= 0 && tl.render(_bigNum, true, true); // if there's a 0% keyframe, it'll render in the "before" state for any staggered/delayed animations thus when the following tween initializes, it'll use the "before" state instead of the "after" state as the initial values.
},
    _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time) {
  var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property],
      pt,
      lookup,
      i;

  if (!ptCache) {
    ptCache = tween._ptCache[property] = [];
    lookup = tween._ptLookup;
    i = tween._targets.length;

    while (i--) {
      pt = lookup[i][property];

      if (pt && pt.d && pt.d._pt) {
        // it's a plugin, so find the nested PropTween
        pt = pt.d._pt;

        while (pt && pt.p !== property) {
          pt = pt._next;
        }
      }

      if (!pt) {
        // there is no PropTween associated with that property, so we must FORCE one to be created and ditch out of this
        // if the tween has other properties that already rendered at new positions, we'd normally have to rewind to put them back like tween.render(0, true) before forcing an _initTween(), but that can create another edge case like tweening a timeline's progress would trigger onUpdates to fire which could move other things around. It's better to just inform users that .resetTo() should ONLY be used for tweens that already have that property. For example, you can't gsap.to(...{ y: 0 }) and then tween.restTo("x", 200) for example.
        _forceAllPropTweens = 1; // otherwise, when we _addPropTween() and it finds no change between the start and end values, it skips creating a PropTween (for efficiency...why tween when there's no difference?) but in this case we NEED that PropTween created so we can edit it.

        tween.vars[property] = "+=0";

        _initTween(tween, time);

        _forceAllPropTweens = 0;
        return 1;
      }

      ptCache.push(pt);
    }
  }

  i = ptCache.length;

  while (i--) {
    pt = ptCache[i];
    pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
    pt.c = value - pt.s;
    pt.e && (pt.e = _round(value) + getUnit(pt.e)); // mainly for CSSPlugin (end value)

    pt.b && (pt.b = pt.s + getUnit(pt.b)); // (beginning value)
  }
},
    _addAliasesToVars = function _addAliasesToVars(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p,
      i,
      aliases;

  if (!propertyAliases) {
    return vars;
  }

  copy = _merge({}, vars);

  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;

      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }

  return copy;
},
    // parses multiple formats, like {"0%": {x: 100}, {"50%": {x: -20}} and { x: {"0%": 100, "50%": -20} }, and an "ease" can be set on any object. We populate an "allProps" object with an Array for each property, like {x: [{}, {}], y:[{}, {}]} with data for each property tween. The objects have a "t" (time), "v", (value), and "e" (ease) property. This allows us to piece together a timeline later.
_parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
  var ease = obj.ease || easeEach || "power1.inOut",
      p,
      a;

  if (_isArray(obj)) {
    a = allProps[prop] || (allProps[prop] = []); // t = time (out of 100), v = value, e = ease

    obj.forEach(function (value, i) {
      return a.push({
        t: i / (obj.length - 1) * 100,
        v: value,
        e: ease
      });
    });
  } else {
    for (p in obj) {
      a = allProps[p] || (allProps[p] = []);
      p === "ease" || a.push({
        t: parseFloat(prop),
        v: obj[p],
        e: ease
      });
    }
  }
},
    _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
},
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
    _staggerPropsToSkip = {};

_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function (name) {
  return _staggerPropsToSkip[name] = 1;
});
/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */


export var Tween = /*#__PURE__*/function (_Animation2) {
  _inheritsLoose(Tween, _Animation2);

  function Tween(targets, vars, position, skipInherit) {
    var _this3;

    if (typeof vars === "number") {
      position.duration = vars;
      vars = position;
      position = null;
    }

    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
    var _this3$vars = _this3.vars,
        duration = _this3$vars.duration,
        delay = _this3$vars.delay,
        immediateRender = _this3$vars.immediateRender,
        stagger = _this3$vars.stagger,
        overwrite = _this3$vars.overwrite,
        keyframes = _this3$vars.keyframes,
        defaults = _this3$vars.defaults,
        scrollTrigger = _this3$vars.scrollTrigger,
        yoyoEase = _this3$vars.yoyoEase,
        parent = vars.parent || _globalTimeline,
        parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
        tl,
        i,
        copy,
        l,
        p,
        curTarget,
        staggerFunc,
        staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

    _this3._overwrite = overwrite;

    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults || {}
      });
      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;

      if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        l = parsedTargets.length;
        staggerFunc = stagger && distribute(stagger);

        if (_isObject(stagger)) {
          //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }

        for (i = 0; i < l; i++) {
          copy = _copyExcluding(vars, _staggerPropsToSkip);
          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

          if (!stagger && l === 1 && copy.delay) {
            // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }

          tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
          tl._ease = _easeMap.none;
        }

        tl.duration() ? duration = delay = 0 : _this3.timeline = 0; // if the timeline's duration is 0, we don't need a timeline internally!
      } else if (keyframes) {
        _inheritDefaults(_setDefaults(tl.vars.defaults, {
          ease: "none"
        }));

        tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
        var time = 0,
            a,
            kf,
            v;

        if (_isArray(keyframes)) {
          keyframes.forEach(function (frame) {
            return tl.to(parsedTargets, frame, ">");
          });
        } else {
          copy = {};

          for (p in keyframes) {
            p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
          }

          for (p in copy) {
            a = copy[p].sort(function (a, b) {
              return a.t - b.t;
            });
            time = 0;

            for (i = 0; i < a.length; i++) {
              kf = a[i];
              v = {
                ease: kf.e,
                duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
              };
              v[p] = kf.v;
              tl.to(parsedTargets, v, time);
              time += v.duration;
            }
          }

          tl.duration() < duration && tl.to({}, {
            duration: duration - tl.duration()
          }); // in case keyframes didn't go to 100%
        }
      }

      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
    }

    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);

      _globalTimeline.killTweensOf(parsedTargets);

      _overwritingTween = 0;
    }

    _addToTimeline(parent, _assertThisInitialized(_this3), position);

    vars.reversed && _this3.reverse();
    vars.paused && _this3.paused(true);

    if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      _this3.render(Math.max(0, -delay)); //in case delay is negative

    }

    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }

  var _proto3 = Tween.prototype;

  _proto3.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        time,
        pt,
        iteration,
        cycleDuration,
        prevIteration,
        isYoyo,
        ratio,
        timeline,
        yoyoEase;

    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== totalTime < 0) {
      //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
      time = tTime;
      timeline = this.timeline;

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          time > dur && (time = dur);
        }

        isYoyo = this._yoyo && iteration & 1;

        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);

        if (time === prevTime && !force && this._initted) {
          //could be during the repeatDelay part. No need to render and fire callbacks.
          this._tTime = tTime;
          return this;
        }

        if (iteration !== prevIteration) {
          timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo); //repeatRefresh functionality

          if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
            this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

            this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }

      if (!this._initted) {
        if (_attemptInitTween(this, totalTime < 0 ? totalTime : time, force, suppressEvents)) {
          this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

          return this;
        }

        if (prevTime !== this._time) {
          // rare edge case - during initialization, an onUpdate in the _startAt (.fromTo()) might force this tween to render at a different spot in which case we should ditch this render() call so that it doesn't revert the values.
          return this;
        }

        if (dur !== this._dur) {
          // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._tTime = tTime;
      this._time = time;

      if (!this._act && this._ts) {
        this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        this._lazy = 0;
      }

      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }

      if (time && !prevTime && !suppressEvents) {
        _callback(this, "onStart");

        if (this._tTime !== tTime) {
          // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
          return this;
        }
      }

      pt = this._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);

      if (this._onUpdate && !suppressEvents) {
        totalTime < 0 && this._startAt && this._startAt.render(totalTime, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

        _callback(this, "onUpdate");
      }

      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
          // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto3.targets = function targets() {
    return this._targets;
  };

  _proto3.invalidate = function invalidate() {
    this._pt = this._op = this._startAt = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate();
    return _Animation2.prototype.invalidate.call(this);
  };

  _proto3.resetTo = function resetTo(property, value, start, startIsRelative) {
    _tickerActive || _ticker.wake();
    this._ts || this.play();
    var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
        ratio;
    this._initted || _initTween(this, time);
    ratio = this._ease(time / this._dur); // don't just get tween.ratio because it may not have rendered yet.
    // possible future addition to allow an object with multiple values to update, like tween.resetTo({x: 100, y: 200}); At this point, it doesn't seem worth the added kb given the fact that most users will likely opt for the convenient gsap.quickTo() way of interacting with this method.
    // if (_isObject(property)) { // performance optimization
    // 	for (p in property) {
    // 		if (_updatePropTweens(this, p, property[p], value ? value[p] : null, start, ratio, time)) {
    // 			return this.resetTo(property, value, start, startIsRelative); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
    // 		}
    // 	}
    // } else {

    if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time)) {
      return this.resetTo(property, value, start, startIsRelative); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
    } //}


    _alignPlayhead(this, 0);

    this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
    return this.render(0);
  };

  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }

    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      return this.parent ? _interrupt(this) : this;
    }

    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweening, interrupt.

      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.

      return this;
    }

    var parsedTargets = this._targets,
        killingTargets = targets ? toArray(targets) : parsedTargets,
        propTweenLookup = this._ptLookup,
        firstPT = this._pt,
        overwrittenProps,
        curLookup,
        curOverwriteProps,
        props,
        p,
        pt,
        i;

    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }

    overwrittenProps = this._op = this._op || [];

    if (vars !== "all") {
      //so people can pass in a comma-delimited list of property names
      if (_isString(vars)) {
        p = {};

        _forEachName(vars, function (name) {
          return p[name] = 1;
        });

        vars = p;
      }

      vars = _addAliasesToVars(parsedTargets, vars);
    }

    i = parsedTargets.length;

    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];

        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }

        for (p in props) {
          pt = curLookup && curLookup[p];

          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }

            delete curLookup[p];
          }

          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }

    this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.

    return this;
  };

  Tween.to = function to(targets, vars) {
    return new Tween(targets, vars, arguments[2]);
  };

  Tween.from = function from(targets, vars) {
    return _createTweenType(1, arguments);
  };

  Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay: delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };

  Tween.fromTo = function fromTo(targets, fromVars, toVars) {
    return _createTweenType(2, arguments);
  };

  Tween.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween(targets, vars);
  };

  Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };

  return Tween;
}(Animation);

_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
}); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });
//for backward compatibility. Leverage the timeline calls.


_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
        params = _slice.call(arguments, 0);

    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */


var _setterPlain = function _setterPlain(target, property, value) {
  return target[property] = value;
},
    _setterFunc = function _setterFunc(target, property, value) {
  return target[property](value);
},
    _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
  return target[property](data.fp, value);
},
    _setterAttribute = function _setterAttribute(target, property, value) {
  return target.setAttribute(property, value);
},
    _getSetter = function _getSetter(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
},
    _renderPlain = function _renderPlain(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1000000) / 1000000, data);
},
    _renderBoolean = function _renderBoolean(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
},
    _renderComplexString = function _renderComplexString(ratio, data) {
  var pt = data._pt,
      s = "";

  if (!ratio && data.b) {
    //b = beginning string
    s = data.b;
  } else if (ratio === 1 && data.e) {
    //e = ending string
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

      pt = pt._next;
    }

    s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
  }

  data.set(data.t, data.p, s, data);
},
    _renderPropTweens = function _renderPropTweens(ratio, data) {
  var pt = data._pt;

  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
},
    _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
  var pt = this._pt,
      next;

  while (pt) {
    next = pt._next;
    pt.p === property && pt.modifier(modifier, tween, target);
    pt = next;
  }
},
    _killPropTweensOf = function _killPropTweensOf(property) {
  var pt = this._pt,
      hasNonDependentRemaining,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }

    pt = next;
  }

  return !hasNonDependentRemaining;
},
    _setterWithModifier = function _setterWithModifier(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
},
    _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
  var pt = parent._pt,
      next,
      pt2,
      first,
      last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

  while (pt) {
    next = pt._next;
    pt2 = first;

    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }

    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }

    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }

    pt = next;
  }

  parent._pt = first;
}; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)


export var PropTween = /*#__PURE__*/function () {
  function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;

    if (next) {
      next._prev = this;
    }
  }

  var _proto4 = PropTween.prototype;

  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target; //modifier target

    this.tween = tween;
  };

  return PropTween;
}(); //Initialization tasks

_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
  return _reservedProps[name] = 1;
});

_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */

var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (config) {
      return _createPlugin(config);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString(target) && (target = toArray(target)[0]); //in case selector text or an array is passed in

    var getter = _getCache(target || {}).get,
        format = unit ? _passThrough : _numericIfPossible;

    unit === "native" && (unit = "");
    return !target ? target : !property ? function (property, unit, uncache) {
      return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);

    if (target.length > 1) {
      var setters = target.map(function (t) {
        return gsap.quickSetter(t, property, unit);
      }),
          l = setters.length;
      return function (value) {
        var i = l;

        while (i--) {
          setters[i](value);
        }
      };
    }

    target = target[0] || {};

    var Plugin = _plugins[property],
        cache = _getCache(target),
        p = cache.harness && (cache.harness.aliases || {})[property] || property,
        // in case it's an alias, like "rotate" for "rotation".
    setter = Plugin ? function (value) {
      var p = new Plugin();
      _quickTween._pt = 0;
      p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p.render(1, p);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, p);

    return Plugin ? setter : function (value) {
      return setter(target, p, unit ? value + unit : value, cache, 1);
    };
  },
  quickTo: function quickTo(target, property, vars) {
    var _merge2;

    var tween = gsap.to(target, _merge((_merge2 = {}, _merge2[property] = "+=0.1", _merge2.paused = true, _merge2), vars || {})),
        func = function func(value, start, startIsRelative) {
      return tween.resetTo(property, value, start, startIsRelative);
    };

    func.tween = tween;
    return func;
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref3) {
    var name = _ref3.name,
        effect = _ref3.effect,
        plugins = _ref3.plugins,
        defaults = _ref3.defaults,
        extendTimeline = _ref3.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });

    _effects[name] = function (targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
    };

    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }

    var tl = new Timeline(vars),
        child,
        next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

    _globalTimeline.remove(tl);

    tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;

    while (child) {
      next = child._next;

      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }

      child = next;
    }

    _addToTimeline(_globalTimeline, tl, 0);

    return tl;
  },
  utils: {
    wrap: wrap,
    wrapYoyo: wrapYoyo,
    distribute: distribute,
    random: random,
    snap: snap,
    normalize: normalize,
    getUnit: getUnit,
    clamp: clamp,
    splitColor: splitColor,
    toArray: toArray,
    selector: selector,
    mapRange: mapRange,
    pipe: pipe,
    unitize: unitize,
    interpolate: interpolate,
    shuffle: shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween: PropTween,
    globals: _addGlobal,
    Tween: Tween,
    Timeline: Timeline,
    Animation: Animation,
    getCache: _getCache,
    _removeLinkedListItem: _removeLinkedListItem,
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites = value;
    }
  }
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return _gsap[name] = Tween[name];
});

_ticker.add(Timeline.updateRoot);

_quickTween = _gsap.to({}, {
  duration: 0
}); // ---- EXTRA PLUGINS --------------------------------------------------------

var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
  var pt = plugin._pt;

  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }

  return pt;
},
    _addModifiers = function _addModifiers(tween, modifiers) {
  var targets = tween._targets,
      p,
      i,
      pt;

  for (p in modifiers) {
    i = targets.length;

    while (i--) {
      pt = tween._ptLookup[i][p];

      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          // is a plugin
          pt = _getPluginPropTween(pt, p);
        }

        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
},
    _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
  return {
    name: name,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init(target, vars, tween) {
      tween._onInit = function (tween) {
        var temp, p;

        if (_isString(vars)) {
          temp = {};

          _forEachName(vars, function (name) {
            return temp[name] = 1;
          }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.


          vars = temp;
        }

        if (modifier) {
          temp = {};

          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }

          vars = temp;
        }

        _addModifiers(tween, vars);
      };
    }
  };
}; //register core plugins


export var gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p, pt;

    for (p in vars) {
      pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
      pt && (pt.op = p);

      this._props.push(p);
    }
  }
}, {
  name: "endArray",
  init: function init(target, value) {
    var i = value.length;

    while (i--) {
      this.add(target, i, target[i] || 0, value[i]);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.

Tween.version = Timeline.version = gsap.version = "3.10.4";
_coreReady = 1;
_windowExists() && _wake();
var Power0 = _easeMap.Power0,
    Power1 = _easeMap.Power1,
    Power2 = _easeMap.Power2,
    Power3 = _easeMap.Power3,
    Power4 = _easeMap.Power4,
    Linear = _easeMap.Linear,
    Quad = _easeMap.Quad,
    Cubic = _easeMap.Cubic,
    Quart = _easeMap.Quart,
    Quint = _easeMap.Quint,
    Strong = _easeMap.Strong,
    Elastic = _easeMap.Elastic,
    Back = _easeMap.Back,
    SteppedEase = _easeMap.SteppedEase,
    Bounce = _easeMap.Bounce,
    Sine = _easeMap.Sine,
    Expo = _easeMap.Expo,
    Circ = _easeMap.Circ;
export { Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ };
export { Tween as TweenMax, Tween as TweenLite, Timeline as TimelineMax, Timeline as TimelineLite, gsap as default, wrap, wrapYoyo, distribute, random, snap, normalize, getUnit, clamp, splitColor, toArray, selector, mapRange, pipe, unitize, interpolate, shuffle }; //export some internal methods/orojects for use in CSSPlugin so that we can externalize that file and allow custom builds that exclude it.

export { _getProperty, _numExp, _numWithUnitExp, _isString, _isUndefined, _renderComplexString, _relExp, _setDefaults, _removeLinkedListItem, _forEachName, _sortPropTweensByPriority, _colorStringFilter, _replaceRandom, _checkPlugin, _plugins, _ticker, _config, _roundModifier, _round, _missingPlugin, _getSetter, _getCache, _colorExp, _parseRelative };


/**
 * Swiper 8.1.5
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: May 16, 2022
 */

 (function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swiper = factory());
})(this, (function () { 'use strict';

	/**
	 * SSR Window 4.0.2
	 * Better handling for window object in SSR environment
	 * https://github.com/nolimits4web/ssr-window
	 *
	 * Copyright 2021, Vladimir Kharlampidi
	 *
	 * Licensed under MIT
	 *
	 * Released on: December 13, 2021
	 */

	/* eslint-disable no-param-reassign */
	function isObject$1(obj) {
		return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
	}

	function extend$1(target, src) {
		if (target === void 0) {
			target = {};
		}

		if (src === void 0) {
			src = {};
		}

		Object.keys(src).forEach(key => {
			if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
				extend$1(target[key], src[key]);
			}
		});
	}

	const ssrDocument = {
		body: {},

		addEventListener() {},

		removeEventListener() {},

		activeElement: {
			blur() {},

			nodeName: ''
		},

		querySelector() {
			return null;
		},

		querySelectorAll() {
			return [];
		},

		getElementById() {
			return null;
		},

		createEvent() {
			return {
				initEvent() {}

			};
		},

		createElement() {
			return {
				children: [],
				childNodes: [],
				style: {},

				setAttribute() {},

				getElementsByTagName() {
					return [];
				}

			};
		},

		createElementNS() {
			return {};
		},

		importNode() {
			return null;
		},

		location: {
			hash: '',
			host: '',
			hostname: '',
			href: '',
			origin: '',
			pathname: '',
			protocol: '',
			search: ''
		}
	};

	function getDocument() {
		const doc = typeof document !== 'undefined' ? document : {};
		extend$1(doc, ssrDocument);
		return doc;
	}

	const ssrWindow = {
		document: ssrDocument,
		navigator: {
			userAgent: ''
		},
		location: {
			hash: '',
			host: '',
			hostname: '',
			href: '',
			origin: '',
			pathname: '',
			protocol: '',
			search: ''
		},
		history: {
			replaceState() {},

			pushState() {},

			go() {},

			back() {}

		},
		CustomEvent: function CustomEvent() {
			return this;
		},

		addEventListener() {},

		removeEventListener() {},

		getComputedStyle() {
			return {
				getPropertyValue() {
					return '';
				}

			};
		},

		Image() {},

		Date() {},

		screen: {},

		setTimeout() {},

		clearTimeout() {},

		matchMedia() {
			return {};
		},

		requestAnimationFrame(callback) {
			if (typeof setTimeout === 'undefined') {
				callback();
				return null;
			}

			return setTimeout(callback, 0);
		},

		cancelAnimationFrame(id) {
			if (typeof setTimeout === 'undefined') {
				return;
			}

			clearTimeout(id);
		}

	};

	function getWindow() {
		const win = typeof window !== 'undefined' ? window : {};
		extend$1(win, ssrWindow);
		return win;
	}

	/**
	 * Dom7 4.0.4
	 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
	 * https://framework7.io/docs/dom7.html
	 *
	 * Copyright 2022, Vladimir Kharlampidi
	 *
	 * Licensed under MIT
	 *
	 * Released on: January 11, 2022
	 */
	/* eslint-disable no-proto */

	function makeReactive(obj) {
		const proto = obj.__proto__;
		Object.defineProperty(obj, '__proto__', {
			get() {
				return proto;
			},

			set(value) {
				proto.__proto__ = value;
			}

		});
	}

	class Dom7 extends Array {
		constructor(items) {
			if (typeof items === 'number') {
				super(items);
			} else {
				super(...(items || []));
				makeReactive(this);
			}
		}

	}

	function arrayFlat(arr) {
		if (arr === void 0) {
			arr = [];
		}

		const res = [];
		arr.forEach(el => {
			if (Array.isArray(el)) {
				res.push(...arrayFlat(el));
			} else {
				res.push(el);
			}
		});
		return res;
	}

	function arrayFilter(arr, callback) {
		return Array.prototype.filter.call(arr, callback);
	}

	function arrayUnique(arr) {
		const uniqueArray = [];

		for (let i = 0; i < arr.length; i += 1) {
			if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
		}

		return uniqueArray;
	}


	function qsa(selector, context) {
		if (typeof selector !== 'string') {
			return [selector];
		}

		const a = [];
		const res = context.querySelectorAll(selector);

		for (let i = 0; i < res.length; i += 1) {
			a.push(res[i]);
		}

		return a;
	}

	function $(selector, context) {
		const window = getWindow();
		const document = getDocument();
		let arr = [];

		if (!context && selector instanceof Dom7) {
			return selector;
		}

		if (!selector) {
			return new Dom7(arr);
		}

		if (typeof selector === 'string') {
			const html = selector.trim();

			if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
				let toCreate = 'div';
				if (html.indexOf('<li') === 0) toCreate = 'ul';
				if (html.indexOf('<tr') === 0) toCreate = 'tbody';
				if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
				if (html.indexOf('<tbody') === 0) toCreate = 'table';
				if (html.indexOf('<option') === 0) toCreate = 'select';
				const tempParent = document.createElement(toCreate);
				tempParent.innerHTML = html;

				for (let i = 0; i < tempParent.childNodes.length; i += 1) {
					arr.push(tempParent.childNodes[i]);
				}
			} else {
				arr = qsa(selector.trim(), context || document);
			} // arr = qsa(selector, document);

		} else if (selector.nodeType || selector === window || selector === document) {
			arr.push(selector);
		} else if (Array.isArray(selector)) {
			if (selector instanceof Dom7) return selector;
			arr = selector;
		}

		return new Dom7(arrayUnique(arr));
	}

	$.fn = Dom7.prototype; // eslint-disable-next-line

	function addClass() {
		for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
			classes[_key] = arguments[_key];
		}

		const classNames = arrayFlat(classes.map(c => c.split(' ')));
		this.forEach(el => {
			el.classList.add(...classNames);
		});
		return this;
	}

	function removeClass() {
		for (var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			classes[_key2] = arguments[_key2];
		}

		const classNames = arrayFlat(classes.map(c => c.split(' ')));
		this.forEach(el => {
			el.classList.remove(...classNames);
		});
		return this;
	}

	function toggleClass() {
		for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			classes[_key3] = arguments[_key3];
		}

		const classNames = arrayFlat(classes.map(c => c.split(' ')));
		this.forEach(el => {
			classNames.forEach(className => {
				el.classList.toggle(className);
			});
		});
	}

	function hasClass() {
		for (var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			classes[_key4] = arguments[_key4];
		}

		const classNames = arrayFlat(classes.map(c => c.split(' ')));
		return arrayFilter(this, el => {
			return classNames.filter(className => el.classList.contains(className)).length > 0;
		}).length > 0;
	}

	function attr(attrs, value) {
		if (arguments.length === 1 && typeof attrs === 'string') {
			// Get attr
			if (this[0]) return this[0].getAttribute(attrs);
			return undefined;
		} // Set attrs


		for (let i = 0; i < this.length; i += 1) {
			if (arguments.length === 2) {
				// String
				this[i].setAttribute(attrs, value);
			} else {
				// Object
				for (const attrName in attrs) {
					this[i][attrName] = attrs[attrName];
					this[i].setAttribute(attrName, attrs[attrName]);
				}
			}
		}

		return this;
	}

	function removeAttr(attr) {
		for (let i = 0; i < this.length; i += 1) {
			this[i].removeAttribute(attr);
		}

		return this;
	}

	function transform(transform) {
		for (let i = 0; i < this.length; i += 1) {
			this[i].style.transform = transform;
		}

		return this;
	}

	function transition$1(duration) {
		for (let i = 0; i < this.length; i += 1) {
			this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
		}

		return this;
	}

	function on() {
		for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			args[_key5] = arguments[_key5];
		}

		let [eventType, targetSelector, listener, capture] = args;

		if (typeof args[1] === 'function') {
			[eventType, listener, capture] = args;
			targetSelector = undefined;
		}

		if (!capture) capture = false;

		function handleLiveEvent(e) {
			const target = e.target;
			if (!target) return;
			const eventData = e.target.dom7EventData || [];

			if (eventData.indexOf(e) < 0) {
				eventData.unshift(e);
			}

			if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
				const parents = $(target).parents(); // eslint-disable-line

				for (let k = 0; k < parents.length; k += 1) {
					if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
				}
			}
		}

		function handleEvent(e) {
			const eventData = e && e.target ? e.target.dom7EventData || [] : [];

			if (eventData.indexOf(e) < 0) {
				eventData.unshift(e);
			}

			listener.apply(this, eventData);
		}

		const events = eventType.split(' ');
		let j;

		for (let i = 0; i < this.length; i += 1) {
			const el = this[i];

			if (!targetSelector) {
				for (j = 0; j < events.length; j += 1) {
					const event = events[j];
					if (!el.dom7Listeners) el.dom7Listeners = {};
					if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
					el.dom7Listeners[event].push({
						listener,
						proxyListener: handleEvent
					});
					el.addEventListener(event, handleEvent, capture);
				}
			} else {
				// Live events
				for (j = 0; j < events.length; j += 1) {
					const event = events[j];
					if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
					if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
					el.dom7LiveListeners[event].push({
						listener,
						proxyListener: handleLiveEvent
					});
					el.addEventListener(event, handleLiveEvent, capture);
				}
			}
		}

		return this;
	}

	function off() {
		for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
			args[_key6] = arguments[_key6];
		}

		let [eventType, targetSelector, listener, capture] = args;

		if (typeof args[1] === 'function') {
			[eventType, listener, capture] = args;
			targetSelector = undefined;
		}

		if (!capture) capture = false;
		const events = eventType.split(' ');

		for (let i = 0; i < events.length; i += 1) {
			const event = events[i];

			for (let j = 0; j < this.length; j += 1) {
				const el = this[j];
				let handlers;

				if (!targetSelector && el.dom7Listeners) {
					handlers = el.dom7Listeners[event];
				} else if (targetSelector && el.dom7LiveListeners) {
					handlers = el.dom7LiveListeners[event];
				}

				if (handlers && handlers.length) {
					for (let k = handlers.length - 1; k >= 0; k -= 1) {
						const handler = handlers[k];

						if (listener && handler.listener === listener) {
							el.removeEventListener(event, handler.proxyListener, capture);
							handlers.splice(k, 1);
						} else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
							el.removeEventListener(event, handler.proxyListener, capture);
							handlers.splice(k, 1);
						} else if (!listener) {
							el.removeEventListener(event, handler.proxyListener, capture);
							handlers.splice(k, 1);
						}
					}
				}
			}
		}

		return this;
	}

	function trigger() {
		const window = getWindow();

		for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
			args[_key9] = arguments[_key9];
		}

		const events = args[0].split(' ');
		const eventData = args[1];

		for (let i = 0; i < events.length; i += 1) {
			const event = events[i];

			for (let j = 0; j < this.length; j += 1) {
				const el = this[j];

				if (window.CustomEvent) {
					const evt = new window.CustomEvent(event, {
						detail: eventData,
						bubbles: true,
						cancelable: true
					});
					el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
					el.dispatchEvent(evt);
					el.dom7EventData = [];
					delete el.dom7EventData;
				}
			}
		}

		return this;
	}

	function transitionEnd$1(callback) {
		const dom = this;

		function fireCallBack(e) {
			if (e.target !== this) return;
			callback.call(this, e);
			dom.off('transitionend', fireCallBack);
		}

		if (callback) {
			dom.on('transitionend', fireCallBack);
		}

		return this;
	}

	function outerWidth(includeMargins) {
		if (this.length > 0) {
			if (includeMargins) {
				const styles = this.styles();
				return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
			}

			return this[0].offsetWidth;
		}

		return null;
	}

	function outerHeight(includeMargins) {
		if (this.length > 0) {
			if (includeMargins) {
				const styles = this.styles();
				return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
			}

			return this[0].offsetHeight;
		}

		return null;
	}

	function offset() {
		if (this.length > 0) {
			const window = getWindow();
			const document = getDocument();
			const el = this[0];
			const box = el.getBoundingClientRect();
			const body = document.body;
			const clientTop = el.clientTop || body.clientTop || 0;
			const clientLeft = el.clientLeft || body.clientLeft || 0;
			const scrollTop = el === window ? window.scrollY : el.scrollTop;
			const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
			return {
				top: box.top + scrollTop - clientTop,
				left: box.left + scrollLeft - clientLeft
			};
		}

		return null;
	}

	function styles() {
		const window = getWindow();
		if (this[0]) return window.getComputedStyle(this[0], null);
		return {};
	}

	function css(props, value) {
		const window = getWindow();
		let i;

		if (arguments.length === 1) {
			if (typeof props === 'string') {
				// .css('width')
				if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
			} else {
				// .css({ width: '100px' })
				for (i = 0; i < this.length; i += 1) {
					for (const prop in props) {
						this[i].style[prop] = props[prop];
					}
				}

				return this;
			}
		}

		if (arguments.length === 2 && typeof props === 'string') {
			// .css('width', '100px')
			for (i = 0; i < this.length; i += 1) {
				this[i].style[props] = value;
			}

			return this;
		}

		return this;
	}

	function each(callback) {
		if (!callback) return this;
		this.forEach((el, index) => {
			callback.apply(el, [el, index]);
		});
		return this;
	}

	function filter(callback) {
		const result = arrayFilter(this, callback);
		return $(result);
	}

	function html(html) {
		if (typeof html === 'undefined') {
			return this[0] ? this[0].innerHTML : null;
		}

		for (let i = 0; i < this.length; i += 1) {
			this[i].innerHTML = html;
		}

		return this;
	}

	function text(text) {
		if (typeof text === 'undefined') {
			return this[0] ? this[0].textContent.trim() : null;
		}

		for (let i = 0; i < this.length; i += 1) {
			this[i].textContent = text;
		}

		return this;
	}

	function is(selector) {
		const window = getWindow();
		const document = getDocument();
		const el = this[0];
		let compareWith;
		let i;
		if (!el || typeof selector === 'undefined') return false;

		if (typeof selector === 'string') {
			if (el.matches) return el.matches(selector);
			if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
			if (el.msMatchesSelector) return el.msMatchesSelector(selector);
			compareWith = $(selector);

			for (i = 0; i < compareWith.length; i += 1) {
				if (compareWith[i] === el) return true;
			}

			return false;
		}

		if (selector === document) {
			return el === document;
		}

		if (selector === window) {
			return el === window;
		}

		if (selector.nodeType || selector instanceof Dom7) {
			compareWith = selector.nodeType ? [selector] : selector;

			for (i = 0; i < compareWith.length; i += 1) {
				if (compareWith[i] === el) return true;
			}

			return false;
		}

		return false;
	}

	function index() {
		let child = this[0];
		let i;

		if (child) {
			i = 0; // eslint-disable-next-line

			while ((child = child.previousSibling) !== null) {
				if (child.nodeType === 1) i += 1;
			}

			return i;
		}

		return undefined;
	}

	function eq(index) {
		if (typeof index === 'undefined') return this;
		const length = this.length;

		if (index > length - 1) {
			return $([]);
		}

		if (index < 0) {
			const returnIndex = length + index;
			if (returnIndex < 0) return $([]);
			return $([this[returnIndex]]);
		}

		return $([this[index]]);
	}

	function append() {
		let newChild;
		const document = getDocument();

		for (let k = 0; k < arguments.length; k += 1) {
			newChild = k < 0 || arguments.length <= k ? undefined : arguments[k];

			for (let i = 0; i < this.length; i += 1) {
				if (typeof newChild === 'string') {
					const tempDiv = document.createElement('div');
					tempDiv.innerHTML = newChild;

					while (tempDiv.firstChild) {
						this[i].appendChild(tempDiv.firstChild);
					}
				} else if (newChild instanceof Dom7) {
					for (let j = 0; j < newChild.length; j += 1) {
						this[i].appendChild(newChild[j]);
					}
				} else {
					this[i].appendChild(newChild);
				}
			}
		}

		return this;
	}

	function prepend(newChild) {
		const document = getDocument();
		let i;
		let j;

		for (i = 0; i < this.length; i += 1) {
			if (typeof newChild === 'string') {
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = newChild;

				for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
					this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
				}
			} else if (newChild instanceof Dom7) {
				for (j = 0; j < newChild.length; j += 1) {
					this[i].insertBefore(newChild[j], this[i].childNodes[0]);
				}
			} else {
				this[i].insertBefore(newChild, this[i].childNodes[0]);
			}
		}

		return this;
	}

	function next(selector) {
		if (this.length > 0) {
			if (selector) {
				if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
					return $([this[0].nextElementSibling]);
				}

				return $([]);
			}

			if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
			return $([]);
		}

		return $([]);
	}

	function nextAll(selector) {
		const nextEls = [];
		let el = this[0];
		if (!el) return $([]);

		while (el.nextElementSibling) {
			const next = el.nextElementSibling; // eslint-disable-line

			if (selector) {
				if ($(next).is(selector)) nextEls.push(next);
			} else nextEls.push(next);

			el = next;
		}

		return $(nextEls);
	}

	function prev(selector) {
		if (this.length > 0) {
			const el = this[0];

			if (selector) {
				if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
					return $([el.previousElementSibling]);
				}

				return $([]);
			}

			if (el.previousElementSibling) return $([el.previousElementSibling]);
			return $([]);
		}

		return $([]);
	}

	function prevAll(selector) {
		const prevEls = [];
		let el = this[0];
		if (!el) return $([]);

		while (el.previousElementSibling) {
			const prev = el.previousElementSibling; // eslint-disable-line

			if (selector) {
				if ($(prev).is(selector)) prevEls.push(prev);
			} else prevEls.push(prev);

			el = prev;
		}

		return $(prevEls);
	}

	function parent(selector) {
		const parents = []; // eslint-disable-line

		for (let i = 0; i < this.length; i += 1) {
			if (this[i].parentNode !== null) {
				if (selector) {
					if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
				} else {
					parents.push(this[i].parentNode);
				}
			}
		}

		return $(parents);
	}

	function parents(selector) {
		const parents = []; // eslint-disable-line

		for (let i = 0; i < this.length; i += 1) {
			let parent = this[i].parentNode; // eslint-disable-line

			while (parent) {
				if (selector) {
					if ($(parent).is(selector)) parents.push(parent);
				} else {
					parents.push(parent);
				}

				parent = parent.parentNode;
			}
		}

		return $(parents);
	}

	function closest(selector) {
		let closest = this; // eslint-disable-line

		if (typeof selector === 'undefined') {
			return $([]);
		}

		if (!closest.is(selector)) {
			closest = closest.parents(selector).eq(0);
		}

		return closest;
	}

	function find(selector) {
		const foundElements = [];

		for (let i = 0; i < this.length; i += 1) {
			const found = this[i].querySelectorAll(selector);

			for (let j = 0; j < found.length; j += 1) {
				foundElements.push(found[j]);
			}
		}

		return $(foundElements);
	}

	function children(selector) {
		const children = []; // eslint-disable-line

		for (let i = 0; i < this.length; i += 1) {
			const childNodes = this[i].children;

			for (let j = 0; j < childNodes.length; j += 1) {
				if (!selector || $(childNodes[j]).is(selector)) {
					children.push(childNodes[j]);
				}
			}
		}

		return $(children);
	}

	function remove() {
		for (let i = 0; i < this.length; i += 1) {
			if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
		}

		return this;
	}

	const Methods = {
		addClass,
		removeClass,
		hasClass,
		toggleClass,
		attr,
		removeAttr,
		transform,
		transition: transition$1,
		on,
		off,
		trigger,
		transitionEnd: transitionEnd$1,
		outerWidth,
		outerHeight,
		styles,
		offset,
		css,
		each,
		html,
		text,
		is,
		index,
		eq,
		append,
		prepend,
		next,
		nextAll,
		prev,
		prevAll,
		parent,
		parents,
		closest,
		find,
		children,
		filter,
		remove
	};
	Object.keys(Methods).forEach(methodName => {
		Object.defineProperty($.fn, methodName, {
			value: Methods[methodName],
			writable: true
		});
	});

	function deleteProps(obj) {
		const object = obj;
		Object.keys(object).forEach(key => {
			try {
				object[key] = null;
			} catch (e) {// no getter for object
			}

			try {
				delete object[key];
			} catch (e) {// something got wrong
			}
		});
	}

	function nextTick(callback, delay) {
		if (delay === void 0) {
			delay = 0;
		}

		return setTimeout(callback, delay);
	}

	function now() {
		return Date.now();
	}

	function getComputedStyle$1(el) {
		const window = getWindow();
		let style;

		if (window.getComputedStyle) {
			style = window.getComputedStyle(el, null);
		}

		if (!style && el.currentStyle) {
			style = el.currentStyle;
		}

		if (!style) {
			style = el.style;
		}

		return style;
	}

	function getTranslate(el, axis) {
		if (axis === void 0) {
			axis = 'x';
		}

		const window = getWindow();
		let matrix;
		let curTransform;
		let transformMatrix;
		const curStyle = getComputedStyle$1(el);

		if (window.WebKitCSSMatrix) {
			curTransform = curStyle.transform || curStyle.webkitTransform;

			if (curTransform.split(',').length > 6) {
				curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
			} // Some old versions of Webkit choke when 'none' is passed; pass
			// empty string instead in this case


			transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
		} else {
			transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
			matrix = transformMatrix.toString().split(',');
		}

		if (axis === 'x') {
			// Latest Chrome and webkits Fix
			if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
			else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
			else curTransform = parseFloat(matrix[4]);
		}

		if (axis === 'y') {
			// Latest Chrome and webkits Fix
			if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
			else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
			else curTransform = parseFloat(matrix[5]);
		}

		return curTransform || 0;
	}

	function isObject(o) {
		return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
	}

	function isNode(node) {
		// eslint-disable-next-line
		if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
			return node instanceof HTMLElement;
		}

		return node && (node.nodeType === 1 || node.nodeType === 11);
	}

	function extend() {
		const to = Object(arguments.length <= 0 ? undefined : arguments[0]);
		const noExtend = ['__proto__', 'constructor', 'prototype'];

		for (let i = 1; i < arguments.length; i += 1) {
			const nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];

			if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
				const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

				for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
					const nextKey = keysArray[nextIndex];
					const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

					if (desc !== undefined && desc.enumerable) {
						if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
							if (nextSource[nextKey].__swiper__) {
								to[nextKey] = nextSource[nextKey];
							} else {
								extend(to[nextKey], nextSource[nextKey]);
							}
						} else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
							to[nextKey] = {};

							if (nextSource[nextKey].__swiper__) {
								to[nextKey] = nextSource[nextKey];
							} else {
								extend(to[nextKey], nextSource[nextKey]);
							}
						} else {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
		}

		return to;
	}

	function setCSSProperty(el, varName, varValue) {
		el.style.setProperty(varName, varValue);
	}

	function animateCSSModeScroll(_ref) {
		let {
			swiper,
			targetPosition,
			side
		} = _ref;
		const window = getWindow();
		const startPosition = -swiper.translate;
		let startTime = null;
		let time;
		const duration = swiper.params.speed;
		swiper.wrapperEl.style.scrollSnapType = 'none';
		window.cancelAnimationFrame(swiper.cssModeFrameID);
		const dir = targetPosition > startPosition ? 'next' : 'prev';

		const isOutOfBound = (current, target) => {
			return dir === 'next' && current >= target || dir === 'prev' && current <= target;
		};

		const animate = () => {
			time = new Date().getTime();

			if (startTime === null) {
				startTime = time;
			}

			const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
			const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
			let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

			if (isOutOfBound(currentPosition, targetPosition)) {
				currentPosition = targetPosition;
			}

			swiper.wrapperEl.scrollTo({
				[side]: currentPosition
			});

			if (isOutOfBound(currentPosition, targetPosition)) {
				swiper.wrapperEl.style.overflow = 'hidden';
				swiper.wrapperEl.style.scrollSnapType = '';
				setTimeout(() => {
					swiper.wrapperEl.style.overflow = '';
					swiper.wrapperEl.scrollTo({
						[side]: currentPosition
					});
				});
				window.cancelAnimationFrame(swiper.cssModeFrameID);
				return;
			}

			swiper.cssModeFrameID = window.requestAnimationFrame(animate);
		};

		animate();
	}

	let support;

	function calcSupport() {
		const window = getWindow();
		const document = getDocument();
		return {
			smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
			touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
			passiveListener: function checkPassiveListener() {
				let supportsPassive = false;

				try {
					const opts = Object.defineProperty({}, 'passive', {
						// eslint-disable-next-line
						get() {
							supportsPassive = true;
						}

					});
					window.addEventListener('testPassiveListener', null, opts);
				} catch (e) {// No support
				}

				return supportsPassive;
			}(),
			gestures: function checkGestures() {
				return 'ongesturestart' in window;
			}()
		};
	}

	function getSupport() {
		if (!support) {
			support = calcSupport();
		}

		return support;
	}

	let deviceCached;

	function calcDevice(_temp) {
		let {
			userAgent
		} = _temp === void 0 ? {} : _temp;
		const support = getSupport();
		const window = getWindow();
		const platform = window.navigator.platform;
		const ua = userAgent || window.navigator.userAgent;
		const device = {
			ios: false,
			android: false
		};
		const screenWidth = window.screen.width;
		const screenHeight = window.screen.height;
		const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

		let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
		const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
		const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
		const windows = platform === 'Win32';
		let macos = platform === 'MacIntel'; // iPadOs 13 fix

		const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

		if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
			ipad = ua.match(/(Version)\/([\d.]+)/);
			if (!ipad) ipad = [0, 1, '13_0_0'];
			macos = false;
		} // Android


		if (android && !windows) {
			device.os = 'android';
			device.android = true;
		}

		if (ipad || iphone || ipod) {
			device.os = 'ios';
			device.ios = true;
		} // Export object


		return device;
	}

	function getDevice(overrides) {
		if (overrides === void 0) {
			overrides = {};
		}

		if (!deviceCached) {
			deviceCached = calcDevice(overrides);
		}

		return deviceCached;
	}

	let browser;

	function calcBrowser() {
		const window = getWindow();

		function isSafari() {
			const ua = window.navigator.userAgent.toLowerCase();
			return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
		}

		return {
			isSafari: isSafari(),
			isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
		};
	}

	function getBrowser() {
		if (!browser) {
			browser = calcBrowser();
		}

		return browser;
	}

	function Resize(_ref) {
		let {
			swiper,
			on,
			emit
		} = _ref;
		const window = getWindow();
		let observer = null;
		let animationFrame = null;

		const resizeHandler = () => {
			if (!swiper || swiper.destroyed || !swiper.initialized) return;
			emit('beforeResize');
			emit('resize');
		};

		const createObserver = () => {
			if (!swiper || swiper.destroyed || !swiper.initialized) return;
			observer = new ResizeObserver(entries => {
				animationFrame = window.requestAnimationFrame(() => {
					const {
						width,
						height
					} = swiper;
					let newWidth = width;
					let newHeight = height;
					entries.forEach(_ref2 => {
						let {
							contentBoxSize,
							contentRect,
							target
						} = _ref2;
						if (target && target !== swiper.el) return;
						newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
						newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
					});

					if (newWidth !== width || newHeight !== height) {
						resizeHandler();
					}
				});
			});
			observer.observe(swiper.el);
		};

		const removeObserver = () => {
			if (animationFrame) {
				window.cancelAnimationFrame(animationFrame);
			}

			if (observer && observer.unobserve && swiper.el) {
				observer.unobserve(swiper.el);
				observer = null;
			}
		};

		const orientationChangeHandler = () => {
			if (!swiper || swiper.destroyed || !swiper.initialized) return;
			emit('orientationchange');
		};

		on('init', () => {
			if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
				createObserver();
				return;
			}

			window.addEventListener('resize', resizeHandler);
			window.addEventListener('orientationchange', orientationChangeHandler);
		});
		on('destroy', () => {
			removeObserver();
			window.removeEventListener('resize', resizeHandler);
			window.removeEventListener('orientationchange', orientationChangeHandler);
		});
	}

	function Observer(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const observers = [];
		const window = getWindow();

		const attach = function (target, options) {
			if (options === void 0) {
				options = {};
			}

			const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
			const observer = new ObserverFunc(mutations => {
				// The observerUpdate event should only be triggered
				// once despite the number of mutations.  Additional
				// triggers are redundant and are very costly
				if (mutations.length === 1) {
					emit('observerUpdate', mutations[0]);
					return;
				}

				const observerUpdate = function observerUpdate() {
					emit('observerUpdate', mutations[0]);
				};

				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(observerUpdate);
				} else {
					window.setTimeout(observerUpdate, 0);
				}
			});
			observer.observe(target, {
				attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
				childList: typeof options.childList === 'undefined' ? true : options.childList,
				characterData: typeof options.characterData === 'undefined' ? true : options.characterData
			});
			observers.push(observer);
		};

		const init = () => {
			if (!swiper.params.observer) return;

			if (swiper.params.observeParents) {
				const containerParents = swiper.$el.parents();

				for (let i = 0; i < containerParents.length; i += 1) {
					attach(containerParents[i]);
				}
			} // Observe container


			attach(swiper.$el[0], {
				childList: swiper.params.observeSlideChildren
			}); // Observe wrapper

			attach(swiper.$wrapperEl[0], {
				attributes: false
			});
		};

		const destroy = () => {
			observers.forEach(observer => {
				observer.disconnect();
			});
			observers.splice(0, observers.length);
		};

		extendParams({
			observer: false,
			observeParents: false,
			observeSlideChildren: false
		});
		on('init', init);
		on('destroy', destroy);
	}

	/* eslint-disable no-underscore-dangle */
	var eventsEmitter = {
		on(events, handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (typeof handler !== 'function') return self;
			const method = priority ? 'unshift' : 'push';
			events.split(' ').forEach(event => {
				if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
				self.eventsListeners[event][method](handler);
			});
			return self;
		},

		once(events, handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (typeof handler !== 'function') return self;

			function onceHandler() {
				self.off(events, onceHandler);

				if (onceHandler.__emitterProxy) {
					delete onceHandler.__emitterProxy;
				}

				for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				handler.apply(self, args);
			}

			onceHandler.__emitterProxy = handler;
			return self.on(events, onceHandler, priority);
		},

		onAny(handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (typeof handler !== 'function') return self;
			const method = priority ? 'unshift' : 'push';

			if (self.eventsAnyListeners.indexOf(handler) < 0) {
				self.eventsAnyListeners[method](handler);
			}

			return self;
		},

		offAny(handler) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsAnyListeners) return self;
			const index = self.eventsAnyListeners.indexOf(handler);

			if (index >= 0) {
				self.eventsAnyListeners.splice(index, 1);
			}

			return self;
		},

		off(events, handler) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsListeners) return self;
			events.split(' ').forEach(event => {
				if (typeof handler === 'undefined') {
					self.eventsListeners[event] = [];
				} else if (self.eventsListeners[event]) {
					self.eventsListeners[event].forEach((eventHandler, index) => {
						if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
							self.eventsListeners[event].splice(index, 1);
						}
					});
				}
			});
			return self;
		},

		emit() {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsListeners) return self;
			let events;
			let data;
			let context;

			for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			if (typeof args[0] === 'string' || Array.isArray(args[0])) {
				events = args[0];
				data = args.slice(1, args.length);
				context = self;
			} else {
				events = args[0].events;
				data = args[0].data;
				context = args[0].context || self;
			}

			data.unshift(context);
			const eventsArray = Array.isArray(events) ? events : events.split(' ');
			eventsArray.forEach(event => {
				if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
					self.eventsAnyListeners.forEach(eventHandler => {
						eventHandler.apply(context, [event, ...data]);
					});
				}

				if (self.eventsListeners && self.eventsListeners[event]) {
					self.eventsListeners[event].forEach(eventHandler => {
						eventHandler.apply(context, data);
					});
				}
			});
			return self;
		}

	};

	function updateSize() {
		const swiper = this;
		let width;
		let height;
		const $el = swiper.$el;

		if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
			width = swiper.params.width;
		} else {
			width = $el[0].clientWidth;
		}

		if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
			height = swiper.params.height;
		} else {
			height = $el[0].clientHeight;
		}

		if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
			return;
		} // Subtract paddings


		width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
		height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
		if (Number.isNaN(width)) width = 0;
		if (Number.isNaN(height)) height = 0;
		Object.assign(swiper, {
			width,
			height,
			size: swiper.isHorizontal() ? width : height
		});
	}

	function updateSlides() {
		const swiper = this;

		function getDirectionLabel(property) {
			if (swiper.isHorizontal()) {
				return property;
			} // prettier-ignore


			return {
				'width': 'height',
				'margin-top': 'margin-left',
				'margin-bottom ': 'margin-right',
				'margin-left': 'margin-top',
				'margin-right': 'margin-bottom',
				'padding-left': 'padding-top',
				'padding-right': 'padding-bottom',
				'marginRight': 'marginBottom'
			}[property];
		}

		function getDirectionPropertyValue(node, label) {
			return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
		}

		const params = swiper.params;
		const {
			$wrapperEl,
			size: swiperSize,
			rtlTranslate: rtl,
			wrongRTL
		} = swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
		const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
		const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
		let snapGrid = [];
		const slidesGrid = [];
		const slidesSizesGrid = [];
		let offsetBefore = params.slidesOffsetBefore;

		if (typeof offsetBefore === 'function') {
			offsetBefore = params.slidesOffsetBefore.call(swiper);
		}

		let offsetAfter = params.slidesOffsetAfter;

		if (typeof offsetAfter === 'function') {
			offsetAfter = params.slidesOffsetAfter.call(swiper);
		}

		const previousSnapGridLength = swiper.snapGrid.length;
		const previousSlidesGridLength = swiper.slidesGrid.length;
		let spaceBetween = params.spaceBetween;
		let slidePosition = -offsetBefore;
		let prevSlideSize = 0;
		let index = 0;

		if (typeof swiperSize === 'undefined') {
			return;
		}

		if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
			spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
		}

		swiper.virtualSize = -spaceBetween; // reset margins

		if (rtl) slides.css({
			marginLeft: '',
			marginBottom: '',
			marginTop: ''
		});else slides.css({
			marginRight: '',
			marginBottom: '',
			marginTop: ''
		}); // reset cssMode offsets

		if (params.centeredSlides && params.cssMode) {
			setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
			setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
		}

		const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

		if (gridEnabled) {
			swiper.grid.initSlides(slidesLength);
		} // Calc slides


		let slideSize;
		const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
			return typeof params.breakpoints[key].slidesPerView !== 'undefined';
		}).length > 0;

		for (let i = 0; i < slidesLength; i += 1) {
			slideSize = 0;
			const slide = slides.eq(i);

			if (gridEnabled) {
				swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
			}

			if (slide.css('display') === 'none') continue; // eslint-disable-line

			if (params.slidesPerView === 'auto') {
				if (shouldResetSlideSize) {
					slides[i].style[getDirectionLabel('width')] = ``;
				}

				const slideStyles = getComputedStyle(slide[0]);
				const currentTransform = slide[0].style.transform;
				const currentWebKitTransform = slide[0].style.webkitTransform;

				if (currentTransform) {
					slide[0].style.transform = 'none';
				}

				if (currentWebKitTransform) {
					slide[0].style.webkitTransform = 'none';
				}

				if (params.roundLengths) {
					slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
				} else {
					// eslint-disable-next-line
					const width = getDirectionPropertyValue(slideStyles, 'width');
					const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
					const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
					const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
					const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
					const boxSizing = slideStyles.getPropertyValue('box-sizing');

					if (boxSizing && boxSizing === 'border-box') {
						slideSize = width + marginLeft + marginRight;
					} else {
						const {
							clientWidth,
							offsetWidth
						} = slide[0];
						slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
					}
				}

				if (currentTransform) {
					slide[0].style.transform = currentTransform;
				}

				if (currentWebKitTransform) {
					slide[0].style.webkitTransform = currentWebKitTransform;
				}

				if (params.roundLengths) slideSize = Math.floor(slideSize);
			} else {
				slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
				if (params.roundLengths) slideSize = Math.floor(slideSize);

				if (slides[i]) {
					slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
				}
			}

			if (slides[i]) {
				slides[i].swiperSlideSize = slideSize;
			}

			slidesSizesGrid.push(slideSize);

			if (params.centeredSlides) {
				slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
				if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
				if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
				if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
				if (params.roundLengths) slidePosition = Math.floor(slidePosition);
				if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
				slidesGrid.push(slidePosition);
			} else {
				if (params.roundLengths) slidePosition = Math.floor(slidePosition);
				if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
				slidesGrid.push(slidePosition);
				slidePosition = slidePosition + slideSize + spaceBetween;
			}

			swiper.virtualSize += slideSize + spaceBetween;
			prevSlideSize = slideSize;
			index += 1;
		}

		swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

		if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
			$wrapperEl.css({
				width: `${swiper.virtualSize + params.spaceBetween}px`
			});
		}

		if (params.setWrapperSize) {
			$wrapperEl.css({
				[getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
			});
		}

		if (gridEnabled) {
			swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
		} // Remove last grid elements depending on width


		if (!params.centeredSlides) {
			const newSlidesGrid = [];

			for (let i = 0; i < snapGrid.length; i += 1) {
				let slidesGridItem = snapGrid[i];
				if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

				if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
					newSlidesGrid.push(slidesGridItem);
				}
			}

			snapGrid = newSlidesGrid;

			if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
				snapGrid.push(swiper.virtualSize - swiperSize);
			}
		}

		if (snapGrid.length === 0) snapGrid = [0];

		if (params.spaceBetween !== 0) {
			const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
			slides.filter((_, slideIndex) => {
				if (!params.cssMode) return true;

				if (slideIndex === slides.length - 1) {
					return false;
				}

				return true;
			}).css({
				[key]: `${spaceBetween}px`
			});
		}

		if (params.centeredSlides && params.centeredSlidesBounds) {
			let allSlidesSize = 0;
			slidesSizesGrid.forEach(slideSizeValue => {
				allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
			});
			allSlidesSize -= params.spaceBetween;
			const maxSnap = allSlidesSize - swiperSize;
			snapGrid = snapGrid.map(snap => {
				if (snap < 0) return -offsetBefore;
				if (snap > maxSnap) return maxSnap + offsetAfter;
				return snap;
			});
		}

		if (params.centerInsufficientSlides) {
			let allSlidesSize = 0;
			slidesSizesGrid.forEach(slideSizeValue => {
				allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
			});
			allSlidesSize -= params.spaceBetween;

			if (allSlidesSize < swiperSize) {
				const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
				snapGrid.forEach((snap, snapIndex) => {
					snapGrid[snapIndex] = snap - allSlidesOffset;
				});
				slidesGrid.forEach((snap, snapIndex) => {
					slidesGrid[snapIndex] = snap + allSlidesOffset;
				});
			}
		}

		Object.assign(swiper, {
			slides,
			snapGrid,
			slidesGrid,
			slidesSizesGrid
		});

		if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
			setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
			setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
			const addToSnapGrid = -swiper.snapGrid[0];
			const addToSlidesGrid = -swiper.slidesGrid[0];
			swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
			swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
		}

		if (slidesLength !== previousSlidesLength) {
			swiper.emit('slidesLengthChange');
		}

		if (snapGrid.length !== previousSnapGridLength) {
			if (swiper.params.watchOverflow) swiper.checkOverflow();
			swiper.emit('snapGridLengthChange');
		}

		if (slidesGrid.length !== previousSlidesGridLength) {
			swiper.emit('slidesGridLengthChange');
		}

		if (params.watchSlidesProgress) {
			swiper.updateSlidesOffset();
		}

		if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
			const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
			const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);

			if (slidesLength <= params.maxBackfaceHiddenSlides) {
				if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
			} else if (hasClassBackfaceClassAdded) {
				swiper.$el.removeClass(backFaceHiddenClass);
			}
		}
	}

	function updateAutoHeight(speed) {
		const swiper = this;
		const activeSlides = [];
		const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
		let newHeight = 0;
		let i;

		if (typeof speed === 'number') {
			swiper.setTransition(speed);
		} else if (speed === true) {
			swiper.setTransition(swiper.params.speed);
		}

		const getSlideByIndex = index => {
			if (isVirtual) {
				return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
			}

			return swiper.slides.eq(index)[0];
		}; // Find slides currently in view


		if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
			if (swiper.params.centeredSlides) {
				(swiper.visibleSlides || $([])).each(slide => {
					activeSlides.push(slide);
				});
			} else {
				for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
					const index = swiper.activeIndex + i;
					if (index > swiper.slides.length && !isVirtual) break;
					activeSlides.push(getSlideByIndex(index));
				}
			}
		} else {
			activeSlides.push(getSlideByIndex(swiper.activeIndex));
		} // Find new height from highest slide in view


		for (i = 0; i < activeSlides.length; i += 1) {
			if (typeof activeSlides[i] !== 'undefined') {
				const height = activeSlides[i].offsetHeight;
				newHeight = height > newHeight ? height : newHeight;
			}
		} // Update Height


		if (newHeight || newHeight === 0) swiper.$wrapperEl.css('height', `${newHeight}px`);
	}

	function updateSlidesOffset() {
		const swiper = this;
		const slides = swiper.slides;

		for (let i = 0; i < slides.length; i += 1) {
			slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
		}
	}

	function updateSlidesProgress(translate) {
		if (translate === void 0) {
			translate = this && this.translate || 0;
		}

		const swiper = this;
		const params = swiper.params;
		const {
			slides,
			rtlTranslate: rtl,
			snapGrid
		} = swiper;
		if (slides.length === 0) return;
		if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
		let offsetCenter = -translate;
		if (rtl) offsetCenter = translate; // Visible Slides

		slides.removeClass(params.slideVisibleClass);
		swiper.visibleSlidesIndexes = [];
		swiper.visibleSlides = [];

		for (let i = 0; i < slides.length; i += 1) {
			const slide = slides[i];
			let slideOffset = slide.swiperSlideOffset;

			if (params.cssMode && params.centeredSlides) {
				slideOffset -= slides[0].swiperSlideOffset;
			}

			const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
			const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
			const slideBefore = -(offsetCenter - slideOffset);
			const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
			const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

			if (isVisible) {
				swiper.visibleSlides.push(slide);
				swiper.visibleSlidesIndexes.push(i);
				slides.eq(i).addClass(params.slideVisibleClass);
			}

			slide.progress = rtl ? -slideProgress : slideProgress;
			slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
		}

		swiper.visibleSlides = $(swiper.visibleSlides);
	}

	function updateProgress(translate) {
		const swiper = this;

		if (typeof translate === 'undefined') {
			const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

			translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
		}

		const params = swiper.params;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		let {
			progress,
			isBeginning,
			isEnd
		} = swiper;
		const wasBeginning = isBeginning;
		const wasEnd = isEnd;

		if (translatesDiff === 0) {
			progress = 0;
			isBeginning = true;
			isEnd = true;
		} else {
			progress = (translate - swiper.minTranslate()) / translatesDiff;
			isBeginning = progress <= 0;
			isEnd = progress >= 1;
		}

		Object.assign(swiper, {
			progress,
			isBeginning,
			isEnd
		});
		if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

		if (isBeginning && !wasBeginning) {
			swiper.emit('reachBeginning toEdge');
		}

		if (isEnd && !wasEnd) {
			swiper.emit('reachEnd toEdge');
		}

		if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
			swiper.emit('fromEdge');
		}

		swiper.emit('progress', progress);
	}

	function updateSlidesClasses() {
		const swiper = this;
		const {
			slides,
			params,
			$wrapperEl,
			activeIndex,
			realIndex
		} = swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
		let activeSlide;

		if (isVirtual) {
			activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
		} else {
			activeSlide = slides.eq(activeIndex);
		} // Active classes


		activeSlide.addClass(params.slideActiveClass);

		if (params.loop) {
			// Duplicate to all looped slides
			if (activeSlide.hasClass(params.slideDuplicateClass)) {
				$wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
			} else {
				$wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
			}
		} // Next Slide


		let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

		if (params.loop && nextSlide.length === 0) {
			nextSlide = slides.eq(0);
			nextSlide.addClass(params.slideNextClass);
		} // Prev Slide


		let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

		if (params.loop && prevSlide.length === 0) {
			prevSlide = slides.eq(-1);
			prevSlide.addClass(params.slidePrevClass);
		}

		if (params.loop) {
			// Duplicate to all looped slides
			if (nextSlide.hasClass(params.slideDuplicateClass)) {
				$wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
			} else {
				$wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
			}

			if (prevSlide.hasClass(params.slideDuplicateClass)) {
				$wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
			} else {
				$wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
			}
		}

		swiper.emitSlidesClasses();
	}

	function updateActiveIndex(newActiveIndex) {
		const swiper = this;
		const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
		const {
			slidesGrid,
			snapGrid,
			params,
			activeIndex: previousIndex,
			realIndex: previousRealIndex,
			snapIndex: previousSnapIndex
		} = swiper;
		let activeIndex = newActiveIndex;
		let snapIndex;

		if (typeof activeIndex === 'undefined') {
			for (let i = 0; i < slidesGrid.length; i += 1) {
				if (typeof slidesGrid[i + 1] !== 'undefined') {
					if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
						activeIndex = i;
					} else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
						activeIndex = i + 1;
					}
				} else if (translate >= slidesGrid[i]) {
					activeIndex = i;
				}
			} // Normalize slideIndex


			if (params.normalizeSlideIndex) {
				if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
			}
		}

		if (snapGrid.indexOf(translate) >= 0) {
			snapIndex = snapGrid.indexOf(translate);
		} else {
			const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
			snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
		}

		if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

		if (activeIndex === previousIndex) {
			if (snapIndex !== previousSnapIndex) {
				swiper.snapIndex = snapIndex;
				swiper.emit('snapIndexChange');
			}

			return;
		} // Get real index


		const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
		Object.assign(swiper, {
			snapIndex,
			realIndex,
			previousIndex,
			activeIndex
		});
		swiper.emit('activeIndexChange');
		swiper.emit('snapIndexChange');

		if (previousRealIndex !== realIndex) {
			swiper.emit('realIndexChange');
		}

		if (swiper.initialized || swiper.params.runCallbacksOnInit) {
			swiper.emit('slideChange');
		}
	}

	function updateClickedSlide(e) {
		const swiper = this;
		const params = swiper.params;
		const slide = $(e).closest(`.${params.slideClass}`)[0];
		let slideFound = false;
		let slideIndex;

		if (slide) {
			for (let i = 0; i < swiper.slides.length; i += 1) {
				if (swiper.slides[i] === slide) {
					slideFound = true;
					slideIndex = i;
					break;
				}
			}
		}

		if (slide && slideFound) {
			swiper.clickedSlide = slide;

			if (swiper.virtual && swiper.params.virtual.enabled) {
				swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
			} else {
				swiper.clickedIndex = slideIndex;
			}
		} else {
			swiper.clickedSlide = undefined;
			swiper.clickedIndex = undefined;
			return;
		}

		if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
			swiper.slideToClickedSlide();
		}
	}

	var update = {
		updateSize,
		updateSlides,
		updateAutoHeight,
		updateSlidesOffset,
		updateSlidesProgress,
		updateProgress,
		updateSlidesClasses,
		updateActiveIndex,
		updateClickedSlide
	};

	function getSwiperTranslate(axis) {
		if (axis === void 0) {
			axis = this.isHorizontal() ? 'x' : 'y';
		}

		const swiper = this;
		const {
			params,
			rtlTranslate: rtl,
			translate,
			$wrapperEl
		} = swiper;

		if (params.virtualTranslate) {
			return rtl ? -translate : translate;
		}

		if (params.cssMode) {
			return translate;
		}

		let currentTranslate = getTranslate($wrapperEl[0], axis);
		if (rtl) currentTranslate = -currentTranslate;
		return currentTranslate || 0;
	}

	function setTranslate(translate, byController) {
		const swiper = this;
		const {
			rtlTranslate: rtl,
			params,
			$wrapperEl,
			wrapperEl,
			progress
		} = swiper;
		let x = 0;
		let y = 0;
		const z = 0;

		if (swiper.isHorizontal()) {
			x = rtl ? -translate : translate;
		} else {
			y = translate;
		}

		if (params.roundLengths) {
			x = Math.floor(x);
			y = Math.floor(y);
		}

		if (params.cssMode) {
			wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
		} else if (!params.virtualTranslate) {
			$wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
		}

		swiper.previousTranslate = swiper.translate;
		swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

		let newProgress;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

		if (translatesDiff === 0) {
			newProgress = 0;
		} else {
			newProgress = (translate - swiper.minTranslate()) / translatesDiff;
		}

		if (newProgress !== progress) {
			swiper.updateProgress(translate);
		}

		swiper.emit('setTranslate', swiper.translate, byController);
	}

	function minTranslate() {
		return -this.snapGrid[0];
	}

	function maxTranslate() {
		return -this.snapGrid[this.snapGrid.length - 1];
	}

	function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
		if (translate === void 0) {
			translate = 0;
		}

		if (speed === void 0) {
			speed = this.params.speed;
		}

		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		if (translateBounds === void 0) {
			translateBounds = true;
		}

		const swiper = this;
		const {
			params,
			wrapperEl
		} = swiper;

		if (swiper.animating && params.preventInteractionOnTransition) {
			return false;
		}

		const minTranslate = swiper.minTranslate();
		const maxTranslate = swiper.maxTranslate();
		let newTranslate;
		if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

		swiper.updateProgress(newTranslate);

		if (params.cssMode) {
			const isH = swiper.isHorizontal();

			if (speed === 0) {
				wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
			} else {
				if (!swiper.support.smoothScroll) {
					animateCSSModeScroll({
						swiper,
						targetPosition: -newTranslate,
						side: isH ? 'left' : 'top'
					});
					return true;
				}

				wrapperEl.scrollTo({
					[isH ? 'left' : 'top']: -newTranslate,
					behavior: 'smooth'
				});
			}

			return true;
		}

		if (speed === 0) {
			swiper.setTransition(0);
			swiper.setTranslate(newTranslate);

			if (runCallbacks) {
				swiper.emit('beforeTransitionStart', speed, internal);
				swiper.emit('transitionEnd');
			}
		} else {
			swiper.setTransition(speed);
			swiper.setTranslate(newTranslate);

			if (runCallbacks) {
				swiper.emit('beforeTransitionStart', speed, internal);
				swiper.emit('transitionStart');
			}

			if (!swiper.animating) {
				swiper.animating = true;

				if (!swiper.onTranslateToWrapperTransitionEnd) {
					swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
						if (!swiper || swiper.destroyed) return;
						if (e.target !== this) return;
						swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
						swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
						swiper.onTranslateToWrapperTransitionEnd = null;
						delete swiper.onTranslateToWrapperTransitionEnd;

						if (runCallbacks) {
							swiper.emit('transitionEnd');
						}
					};
				}

				swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
				swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
			}
		}

		return true;
	}

	var translate = {
		getTranslate: getSwiperTranslate,
		setTranslate,
		minTranslate,
		maxTranslate,
		translateTo
	};

	function setTransition(duration, byController) {
		const swiper = this;

		if (!swiper.params.cssMode) {
			swiper.$wrapperEl.transition(duration);
		}

		swiper.emit('setTransition', duration, byController);
	}

	function transitionEmit(_ref) {
		let {
			swiper,
			runCallbacks,
			direction,
			step
		} = _ref;
		const {
			activeIndex,
			previousIndex
		} = swiper;
		let dir = direction;

		if (!dir) {
			if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
		}

		swiper.emit(`transition${step}`);

		if (runCallbacks && activeIndex !== previousIndex) {
			if (dir === 'reset') {
				swiper.emit(`slideResetTransition${step}`);
				return;
			}

			swiper.emit(`slideChangeTransition${step}`);

			if (dir === 'next') {
				swiper.emit(`slideNextTransition${step}`);
			} else {
				swiper.emit(`slidePrevTransition${step}`);
			}
		}
	}

	function transitionStart(runCallbacks, direction) {
		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			params
		} = swiper;
		if (params.cssMode) return;

		if (params.autoHeight) {
			swiper.updateAutoHeight();
		}

		transitionEmit({
			swiper,
			runCallbacks,
			direction,
			step: 'Start'
		});
	}

	function transitionEnd(runCallbacks, direction) {
		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			params
		} = swiper;
		swiper.animating = false;
		if (params.cssMode) return;
		swiper.setTransition(0);
		transitionEmit({
			swiper,
			runCallbacks,
			direction,
			step: 'End'
		});
	}

	var transition = {
		setTransition,
		transitionStart,
		transitionEnd
	};

	function slideTo(index, speed, runCallbacks, internal, initial) {
		if (index === void 0) {
			index = 0;
		}

		if (speed === void 0) {
			speed = this.params.speed;
		}

		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		if (typeof index !== 'number' && typeof index !== 'string') {
			throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
		}

		if (typeof index === 'string') {
			/**
			 * The `index` argument converted from `string` to `number`.
			 * @type {number}
			 */
			const indexAsNumber = parseInt(index, 10);
			/**
			 * Determines whether the `index` argument is a valid `number`
			 * after being converted from the `string` type.
			 * @type {boolean}
			 */

			const isValidNumber = isFinite(indexAsNumber);

			if (!isValidNumber) {
				throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
			} // Knowing that the converted `index` is a valid number,
			// we can update the original argument's value.


			index = indexAsNumber;
		}

		const swiper = this;
		let slideIndex = index;
		if (slideIndex < 0) slideIndex = 0;
		const {
			params,
			snapGrid,
			slidesGrid,
			previousIndex,
			activeIndex,
			rtlTranslate: rtl,
			wrapperEl,
			enabled
		} = swiper;

		if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
			return false;
		}

		const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
		let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
		if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

		if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
			swiper.emit('beforeSlideChangeStart');
		}

		const translate = -snapGrid[snapIndex]; // Update progress

		swiper.updateProgress(translate); // Normalize slideIndex

		if (params.normalizeSlideIndex) {
			for (let i = 0; i < slidesGrid.length; i += 1) {
				const normalizedTranslate = -Math.floor(translate * 100);
				const normalizedGrid = Math.floor(slidesGrid[i] * 100);
				const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

				if (typeof slidesGrid[i + 1] !== 'undefined') {
					if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
						slideIndex = i;
					} else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
						slideIndex = i + 1;
					}
				} else if (normalizedTranslate >= normalizedGrid) {
					slideIndex = i;
				}
			}
		} // Directions locks


		if (swiper.initialized && slideIndex !== activeIndex) {
			if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
				return false;
			}

			if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
				if ((activeIndex || 0) !== slideIndex) return false;
			}
		}

		let direction;
		if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

		if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
			swiper.updateActiveIndex(slideIndex); // Update Height

			if (params.autoHeight) {
				swiper.updateAutoHeight();
			}

			swiper.updateSlidesClasses();

			if (params.effect !== 'slide') {
				swiper.setTranslate(translate);
			}

			if (direction !== 'reset') {
				swiper.transitionStart(runCallbacks, direction);
				swiper.transitionEnd(runCallbacks, direction);
			}

			return false;
		}

		if (params.cssMode) {
			const isH = swiper.isHorizontal();
			const t = rtl ? translate : -translate;

			if (speed === 0) {
				const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

				if (isVirtual) {
					swiper.wrapperEl.style.scrollSnapType = 'none';
					swiper._immediateVirtual = true;
				}

				wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

				if (isVirtual) {
					requestAnimationFrame(() => {
						swiper.wrapperEl.style.scrollSnapType = '';
						swiper._swiperImmediateVirtual = false;
					});
				}
			} else {
				if (!swiper.support.smoothScroll) {
					animateCSSModeScroll({
						swiper,
						targetPosition: t,
						side: isH ? 'left' : 'top'
					});
					return true;
				}

				wrapperEl.scrollTo({
					[isH ? 'left' : 'top']: t,
					behavior: 'smooth'
				});
			}

			return true;
		}

		swiper.setTransition(speed);
		swiper.setTranslate(translate);
		swiper.updateActiveIndex(slideIndex);
		swiper.updateSlidesClasses();
		swiper.emit('beforeTransitionStart', speed, internal);
		swiper.transitionStart(runCallbacks, direction);

		if (speed === 0) {
			swiper.transitionEnd(runCallbacks, direction);
		} else if (!swiper.animating) {
			swiper.animating = true;

			if (!swiper.onSlideToWrapperTransitionEnd) {
				swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
					if (!swiper || swiper.destroyed) return;
					if (e.target !== this) return;
					swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
					swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
					swiper.onSlideToWrapperTransitionEnd = null;
					delete swiper.onSlideToWrapperTransitionEnd;
					swiper.transitionEnd(runCallbacks, direction);
				};
			}

			swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
			swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
		}

		return true;
	}

	function slideToLoop(index, speed, runCallbacks, internal) {
		if (index === void 0) {
			index = 0;
		}

		if (speed === void 0) {
			speed = this.params.speed;
		}

		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		const swiper = this;
		let newIndex = index;

		if (swiper.params.loop) {
			newIndex += swiper.loopedSlides;
		}

		return swiper.slideTo(newIndex, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slideNext(speed, runCallbacks, internal) {
		if (speed === void 0) {
			speed = this.params.speed;
		}

		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			animating,
			enabled,
			params
		} = swiper;
		if (!enabled) return swiper;
		let perGroup = params.slidesPerGroup;

		if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
			perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
		}

		const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

		if (params.loop) {
			if (animating && params.loopPreventsSlide) return false;
			swiper.loopFix(); // eslint-disable-next-line

			swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
		}

		if (params.rewind && swiper.isEnd) {
			return swiper.slideTo(0, speed, runCallbacks, internal);
		}

		return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slidePrev(speed, runCallbacks, internal) {
		if (speed === void 0) {
			speed = this.params.speed;
		}

		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			params,
			animating,
			snapGrid,
			slidesGrid,
			rtlTranslate,
			enabled
		} = swiper;
		if (!enabled) return swiper;

		if (params.loop) {
			if (animating && params.loopPreventsSlide) return false;
			swiper.loopFix(); // eslint-disable-next-line

			swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
		}

		const translate = rtlTranslate ? swiper.translate : -swiper.translate;

		function normalize(val) {
			if (val < 0) return -Math.floor(Math.abs(val));
			return Math.floor(val);
		}

		const normalizedTranslate = normalize(translate);
		const normalizedSnapGrid = snapGrid.map(val => normalize(val));
		let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

		if (typeof prevSnap === 'undefined' && params.cssMode) {
			let prevSnapIndex;
			snapGrid.forEach((snap, snapIndex) => {
				if (normalizedTranslate >= snap) {
					// prevSnap = snap;
					prevSnapIndex = snapIndex;
				}
			});

			if (typeof prevSnapIndex !== 'undefined') {
				prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
			}
		}

		let prevIndex = 0;

		if (typeof prevSnap !== 'undefined') {
			prevIndex = slidesGrid.indexOf(prevSnap);
			if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

			if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
				prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
				prevIndex = Math.max(prevIndex, 0);
			}
		}

		if (params.rewind && swiper.isBeginning) {
			const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
			return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
		}

		return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slideReset(speed, runCallbacks, internal) {
		if (speed === void 0) {
			speed = this.params.speed;
		}

		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		const swiper = this;
		return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
	}

	/* eslint no-unused-vars: "off" */
	function slideToClosest(speed, runCallbacks, internal, threshold) {
		if (speed === void 0) {
			speed = this.params.speed;
		}

		if (runCallbacks === void 0) {
			runCallbacks = true;
		}

		if (threshold === void 0) {
			threshold = 0.5;
		}

		const swiper = this;
		let index = swiper.activeIndex;
		const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
		const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
		const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

		if (translate >= swiper.snapGrid[snapIndex]) {
			// The current translate is on or after the current snap index, so the choice
			// is between the current index and the one after it.
			const currentSnap = swiper.snapGrid[snapIndex];
			const nextSnap = swiper.snapGrid[snapIndex + 1];

			if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
				index += swiper.params.slidesPerGroup;
			}
		} else {
			// The current translate is before the current snap index, so the choice
			// is between the current index and the one before it.
			const prevSnap = swiper.snapGrid[snapIndex - 1];
			const currentSnap = swiper.snapGrid[snapIndex];

			if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
				index -= swiper.params.slidesPerGroup;
			}
		}

		index = Math.max(index, 0);
		index = Math.min(index, swiper.slidesGrid.length - 1);
		return swiper.slideTo(index, speed, runCallbacks, internal);
	}

	function slideToClickedSlide() {
		const swiper = this;
		const {
			params,
			$wrapperEl
		} = swiper;
		const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
		let slideToIndex = swiper.clickedIndex;
		let realIndex;

		if (params.loop) {
			if (swiper.animating) return;
			realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

			if (params.centeredSlides) {
				if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
					swiper.loopFix();
					slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
					nextTick(() => {
						swiper.slideTo(slideToIndex);
					});
				} else {
					swiper.slideTo(slideToIndex);
				}
			} else if (slideToIndex > swiper.slides.length - slidesPerView) {
				swiper.loopFix();
				slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
				nextTick(() => {
					swiper.slideTo(slideToIndex);
				});
			} else {
				swiper.slideTo(slideToIndex);
			}
		} else {
			swiper.slideTo(slideToIndex);
		}
	}

	var slide = {
		slideTo,
		slideToLoop,
		slideNext,
		slidePrev,
		slideReset,
		slideToClosest,
		slideToClickedSlide
	};

	function loopCreate() {
		const swiper = this;
		const document = getDocument();
		const {
			params,
			$wrapperEl
		} = swiper; // Remove duplicated slides

		const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
		$selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
		let slides = $selector.children(`.${params.slideClass}`);

		if (params.loopFillGroupWithBlank) {
			const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

			if (blankSlidesNum !== params.slidesPerGroup) {
				for (let i = 0; i < blankSlidesNum; i += 1) {
					const blankNode = $(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
					$selector.append(blankNode);
				}

				slides = $selector.children(`.${params.slideClass}`);
			}
		}

		if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
		swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
		swiper.loopedSlides += params.loopAdditionalSlides;

		if (swiper.loopedSlides > slides.length) {
			swiper.loopedSlides = slides.length;
		}

		const prependSlides = [];
		const appendSlides = [];
		slides.each((el, index) => {
			const slide = $(el);

			if (index < swiper.loopedSlides) {
				appendSlides.push(el);
			}

			if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
				prependSlides.push(el);
			}

			slide.attr('data-swiper-slide-index', index);
		});

		for (let i = 0; i < appendSlides.length; i += 1) {
			$selector.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
		}

		for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
			$selector.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
		}
	}

	function loopFix() {
		const swiper = this;
		swiper.emit('beforeLoopFix');
		const {
			activeIndex,
			slides,
			loopedSlides,
			allowSlidePrev,
			allowSlideNext,
			snapGrid,
			rtlTranslate: rtl
		} = swiper;
		let newIndex;
		swiper.allowSlidePrev = true;
		swiper.allowSlideNext = true;
		const snapTranslate = -snapGrid[activeIndex];
		const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

		if (activeIndex < loopedSlides) {
			newIndex = slides.length - loopedSlides * 3 + activeIndex;
			newIndex += loopedSlides;
			const slideChanged = swiper.slideTo(newIndex, 0, false, true);

			if (slideChanged && diff !== 0) {
				swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
			}
		} else if (activeIndex >= slides.length - loopedSlides) {
			// Fix For Positive Oversliding
			newIndex = -slides.length + activeIndex + loopedSlides;
			newIndex += loopedSlides;
			const slideChanged = swiper.slideTo(newIndex, 0, false, true);

			if (slideChanged && diff !== 0) {
				swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
			}
		}

		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;
		swiper.emit('loopFix');
	}

	function loopDestroy() {
		const swiper = this;
		const {
			$wrapperEl,
			params,
			slides
		} = swiper;
		$wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
		slides.removeAttr('data-swiper-slide-index');
	}

	var loop = {
		loopCreate,
		loopFix,
		loopDestroy
	};

	function setGrabCursor(moving) {
		const swiper = this;
		if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
		const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
		el.style.cursor = 'move';
		el.style.cursor = moving ? 'grabbing' : 'grab';
	}

	function unsetGrabCursor() {
		const swiper = this;

		if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
			return;
		}

		swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
	}

	var grabCursor = {
		setGrabCursor,
		unsetGrabCursor
	};

	function closestElement(selector, base) {
		if (base === void 0) {
			base = this;
		}

		function __closestFrom(el) {
			if (!el || el === getDocument() || el === getWindow()) return null;
			if (el.assignedSlot) el = el.assignedSlot;
			const found = el.closest(selector);

			if (!found && !el.getRootNode) {
				return null;
			}

			return found || __closestFrom(el.getRootNode().host);
		}

		return __closestFrom(base);
	}

	function onTouchStart(event) {
		const swiper = this;
		const document = getDocument();
		const window = getWindow();
		const data = swiper.touchEventsData;
		const {
			params,
			touches,
			enabled
		} = swiper;
		if (!enabled) return;

		if (swiper.animating && params.preventInteractionOnTransition) {
			return;
		}

		if (!swiper.animating && params.cssMode && params.loop) {
			swiper.loopFix();
		}

		let e = event;
		if (e.originalEvent) e = e.originalEvent;
		let $targetEl = $(e.target);

		if (params.touchEventsTarget === 'wrapper') {
			if (!$targetEl.closest(swiper.wrapperEl).length) return;
		}

		data.isTouchEvent = e.type === 'touchstart';
		if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
		if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
		if (data.isTouched && data.isMoved) return; // change target el for shadow root component

		const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

		if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
			$targetEl = $(event.path[0]);
		}

		const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
		const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

		if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
			swiper.allowClick = true;
			return;
		}

		if (params.swipeHandler) {
			if (!$targetEl.closest(params.swipeHandler)[0]) return;
		}

		touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
		touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
		const startX = touches.currentX;
		const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

		const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
		const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

		if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
			if (edgeSwipeDetection === 'prevent') {
				event.preventDefault();
			} else {
				return;
			}
		}

		Object.assign(data, {
			isTouched: true,
			isMoved: false,
			allowTouchCallbacks: true,
			isScrolling: undefined,
			startMoving: undefined
		});
		touches.startX = startX;
		touches.startY = startY;
		data.touchStartTime = now();
		swiper.allowClick = true;
		swiper.updateSize();
		swiper.swipeDirection = undefined;
		if (params.threshold > 0) data.allowThresholdMove = false;

		if (e.type !== 'touchstart') {
			let preventDefault = true;

			if ($targetEl.is(data.focusableElements)) {
				preventDefault = false;

				if ($targetEl[0].nodeName === 'SELECT') {
					data.isTouched = false;
				}
			}

			if (document.activeElement && $(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
				document.activeElement.blur();
			}

			const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

			if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
				e.preventDefault();
			}
		}

		if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
			swiper.freeMode.onTouchStart();
		}

		swiper.emit('touchStart', e);
	}

	function onTouchMove(event) {
		const document = getDocument();
		const swiper = this;
		const data = swiper.touchEventsData;
		const {
			params,
			touches,
			rtlTranslate: rtl,
			enabled
		} = swiper;
		if (!enabled) return;
		let e = event;
		if (e.originalEvent) e = e.originalEvent;

		if (!data.isTouched) {
			if (data.startMoving && data.isScrolling) {
				swiper.emit('touchMoveOpposite', e);
			}

			return;
		}

		if (data.isTouchEvent && e.type !== 'touchmove') return;
		const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
		const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
		const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

		if (e.preventedByNestedSwiper) {
			touches.startX = pageX;
			touches.startY = pageY;
			return;
		}

		if (!swiper.allowTouchMove) {
			if (!$(e.target).is(data.focusableElements)) {
				swiper.allowClick = false;
			}

			if (data.isTouched) {
				Object.assign(touches, {
					startX: pageX,
					startY: pageY,
					currentX: pageX,
					currentY: pageY
				});
				data.touchStartTime = now();
			}

			return;
		}

		if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
			if (swiper.isVertical()) {
				// Vertical
				if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
					data.isTouched = false;
					data.isMoved = false;
					return;
				}
			} else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
				return;
			}
		}

		if (data.isTouchEvent && document.activeElement) {
			if (e.target === document.activeElement && $(e.target).is(data.focusableElements)) {
				data.isMoved = true;
				swiper.allowClick = false;
				return;
			}
		}

		if (data.allowTouchCallbacks) {
			swiper.emit('touchMove', e);
		}

		if (e.targetTouches && e.targetTouches.length > 1) return;
		touches.currentX = pageX;
		touches.currentY = pageY;
		const diffX = touches.currentX - touches.startX;
		const diffY = touches.currentY - touches.startY;
		if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

		if (typeof data.isScrolling === 'undefined') {
			let touchAngle;

			if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
				data.isScrolling = false;
			} else {
				// eslint-disable-next-line
				if (diffX * diffX + diffY * diffY >= 25) {
					touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
					data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
				}
			}
		}

		if (data.isScrolling) {
			swiper.emit('touchMoveOpposite', e);
		}

		if (typeof data.startMoving === 'undefined') {
			if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
				data.startMoving = true;
			}
		}

		if (data.isScrolling) {
			data.isTouched = false;
			return;
		}

		if (!data.startMoving) {
			return;
		}

		swiper.allowClick = false;

		if (!params.cssMode && e.cancelable) {
			e.preventDefault();
		}

		if (params.touchMoveStopPropagation && !params.nested) {
			e.stopPropagation();
		}

		if (!data.isMoved) {
			if (params.loop && !params.cssMode) {
				swiper.loopFix();
			}

			data.startTranslate = swiper.getTranslate();
			swiper.setTransition(0);

			if (swiper.animating) {
				swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
			}

			data.allowMomentumBounce = false; // Grab Cursor

			if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
				swiper.setGrabCursor(true);
			}

			swiper.emit('sliderFirstMove', e);
		}

		swiper.emit('sliderMove', e);
		data.isMoved = true;
		let diff = swiper.isHorizontal() ? diffX : diffY;
		touches.diff = diff;
		diff *= params.touchRatio;
		if (rtl) diff = -diff;
		swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
		data.currentTranslate = diff + data.startTranslate;
		let disableParentSwiper = true;
		let resistanceRatio = params.resistanceRatio;

		if (params.touchReleaseOnEdges) {
			resistanceRatio = 0;
		}

		if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
			disableParentSwiper = false;
			if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
		} else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
			disableParentSwiper = false;
			if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
		}

		if (disableParentSwiper) {
			e.preventedByNestedSwiper = true;
		} // Directions locks


		if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
			data.currentTranslate = data.startTranslate;
		}

		if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
			data.currentTranslate = data.startTranslate;
		}

		if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
			data.currentTranslate = data.startTranslate;
		} // Threshold


		if (params.threshold > 0) {
			if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
				if (!data.allowThresholdMove) {
					data.allowThresholdMove = true;
					touches.startX = touches.currentX;
					touches.startY = touches.currentY;
					data.currentTranslate = data.startTranslate;
					touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
					return;
				}
			} else {
				data.currentTranslate = data.startTranslate;
				return;
			}
		}

		if (!params.followFinger || params.cssMode) return; // Update active index in free mode

		if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}

		if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
			swiper.freeMode.onTouchMove();
		} // Update progress


		swiper.updateProgress(data.currentTranslate); // Update translate

		swiper.setTranslate(data.currentTranslate);
	}

	function onTouchEnd(event) {
		const swiper = this;
		const data = swiper.touchEventsData;
		const {
			params,
			touches,
			rtlTranslate: rtl,
			slidesGrid,
			enabled
		} = swiper;
		if (!enabled) return;
		let e = event;
		if (e.originalEvent) e = e.originalEvent;

		if (data.allowTouchCallbacks) {
			swiper.emit('touchEnd', e);
		}

		data.allowTouchCallbacks = false;

		if (!data.isTouched) {
			if (data.isMoved && params.grabCursor) {
				swiper.setGrabCursor(false);
			}

			data.isMoved = false;
			data.startMoving = false;
			return;
		} // Return Grab Cursor


		if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
			swiper.setGrabCursor(false);
		} // Time diff


		const touchEndTime = now();
		const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

		if (swiper.allowClick) {
			const pathTree = e.path || e.composedPath && e.composedPath();
			swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
			swiper.emit('tap click', e);

			if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
				swiper.emit('doubleTap doubleClick', e);
			}
		}

		data.lastClickTime = now();
		nextTick(() => {
			if (!swiper.destroyed) swiper.allowClick = true;
		});

		if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
			data.isTouched = false;
			data.isMoved = false;
			data.startMoving = false;
			return;
		}

		data.isTouched = false;
		data.isMoved = false;
		data.startMoving = false;
		let currentPos;

		if (params.followFinger) {
			currentPos = rtl ? swiper.translate : -swiper.translate;
		} else {
			currentPos = -data.currentTranslate;
		}

		if (params.cssMode) {
			return;
		}

		if (swiper.params.freeMode && params.freeMode.enabled) {
			swiper.freeMode.onTouchEnd({
				currentPos
			});
			return;
		} // Find current slide


		let stopIndex = 0;
		let groupSize = swiper.slidesSizesGrid[0];

		for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
			const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

			if (typeof slidesGrid[i + increment] !== 'undefined') {
				if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
					stopIndex = i;
					groupSize = slidesGrid[i + increment] - slidesGrid[i];
				}
			} else if (currentPos >= slidesGrid[i]) {
				stopIndex = i;
				groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
			}
		}

		let rewindFirstIndex = null;
		let rewindLastIndex = null;

		if (params.rewind) {
			if (swiper.isBeginning) {
				rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
			} else if (swiper.isEnd) {
				rewindFirstIndex = 0;
			}
		} // Find current slide size


		const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
		const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

		if (timeDiff > params.longSwipesMs) {
			// Long touches
			if (!params.longSwipes) {
				swiper.slideTo(swiper.activeIndex);
				return;
			}

			if (swiper.swipeDirection === 'next') {
				if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
			}

			if (swiper.swipeDirection === 'prev') {
				if (ratio > 1 - params.longSwipesRatio) {
					swiper.slideTo(stopIndex + increment);
				} else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
					swiper.slideTo(rewindLastIndex);
				} else {
					swiper.slideTo(stopIndex);
				}
			}
		} else {
			// Short swipes
			if (!params.shortSwipes) {
				swiper.slideTo(swiper.activeIndex);
				return;
			}

			const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

			if (!isNavButtonTarget) {
				if (swiper.swipeDirection === 'next') {
					swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
				}

				if (swiper.swipeDirection === 'prev') {
					swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
				}
			} else if (e.target === swiper.navigation.nextEl) {
				swiper.slideTo(stopIndex + increment);
			} else {
				swiper.slideTo(stopIndex);
			}
		}
	}

	function onResize() {
		const swiper = this;
		const {
			params,
			el
		} = swiper;
		if (el && el.offsetWidth === 0) return; // Breakpoints

		if (params.breakpoints) {
			swiper.setBreakpoint();
		} // Save locks


		const {
			allowSlideNext,
			allowSlidePrev,
			snapGrid
		} = swiper; // Disable locks on resize

		swiper.allowSlideNext = true;
		swiper.allowSlidePrev = true;
		swiper.updateSize();
		swiper.updateSlides();
		swiper.updateSlidesClasses();

		if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
			swiper.slideTo(swiper.slides.length - 1, 0, false, true);
		} else {
			swiper.slideTo(swiper.activeIndex, 0, false, true);
		}

		if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
			swiper.autoplay.run();
		} // Return locks after resize


		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;

		if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
			swiper.checkOverflow();
		}
	}

	function onClick(e) {
		const swiper = this;
		if (!swiper.enabled) return;

		if (!swiper.allowClick) {
			if (swiper.params.preventClicks) e.preventDefault();

			if (swiper.params.preventClicksPropagation && swiper.animating) {
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		}
	}

	function onScroll() {
		const swiper = this;
		const {
			wrapperEl,
			rtlTranslate,
			enabled
		} = swiper;
		if (!enabled) return;
		swiper.previousTranslate = swiper.translate;

		if (swiper.isHorizontal()) {
			swiper.translate = -wrapperEl.scrollLeft;
		} else {
			swiper.translate = -wrapperEl.scrollTop;
		} // eslint-disable-next-line


		if (swiper.translate === 0) swiper.translate = 0;
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
		let newProgress;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

		if (translatesDiff === 0) {
			newProgress = 0;
		} else {
			newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
		}

		if (newProgress !== swiper.progress) {
			swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
		}

		swiper.emit('setTranslate', swiper.translate, false);
	}

	let dummyEventAttached = false;

	function dummyEventListener() {}

	const events = (swiper, method) => {
		const document = getDocument();
		const {
			params,
			touchEvents,
			el,
			wrapperEl,
			device,
			support
		} = swiper;
		const capture = !!params.nested;
		const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
		const swiperMethod = method; // Touch Events

		if (!support.touch) {
			el[domMethod](touchEvents.start, swiper.onTouchStart, false);
			document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
			document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
		} else {
			const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
				passive: true,
				capture: false
			} : false;
			el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
			el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
				passive: false,
				capture
			} : capture);
			el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

			if (touchEvents.cancel) {
				el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
			}
		} // Prevent Links Clicks


		if (params.preventClicks || params.preventClicksPropagation) {
			el[domMethod]('click', swiper.onClick, true);
		}

		if (params.cssMode) {
			wrapperEl[domMethod]('scroll', swiper.onScroll);
		} // Resize handler


		if (params.updateOnWindowResize) {
			swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
		} else {
			swiper[swiperMethod]('observerUpdate', onResize, true);
		}
	};

	function attachEvents() {
		const swiper = this;
		const document = getDocument();
		const {
			params,
			support
		} = swiper;
		swiper.onTouchStart = onTouchStart.bind(swiper);
		swiper.onTouchMove = onTouchMove.bind(swiper);
		swiper.onTouchEnd = onTouchEnd.bind(swiper);

		if (params.cssMode) {
			swiper.onScroll = onScroll.bind(swiper);
		}

		swiper.onClick = onClick.bind(swiper);

		if (support.touch && !dummyEventAttached) {
			document.addEventListener('touchstart', dummyEventListener);
			dummyEventAttached = true;
		}

		events(swiper, 'on');
	}

	function detachEvents() {
		const swiper = this;
		events(swiper, 'off');
	}

	var events$1 = {
		attachEvents,
		detachEvents
	};

	const isGridEnabled = (swiper, params) => {
		return swiper.grid && params.grid && params.grid.rows > 1;
	};

	function setBreakpoint() {
		const swiper = this;
		const {
			activeIndex,
			initialized,
			loopedSlides = 0,
			params,
			$el
		} = swiper;
		const breakpoints = params.breakpoints;
		if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

		const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
		if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
		const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
		const breakpointParams = breakpointOnlyParams || swiper.originalParams;
		const wasMultiRow = isGridEnabled(swiper, params);
		const isMultiRow = isGridEnabled(swiper, breakpointParams);
		const wasEnabled = params.enabled;

		if (wasMultiRow && !isMultiRow) {
			$el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
			swiper.emitContainerClasses();
		} else if (!wasMultiRow && isMultiRow) {
			$el.addClass(`${params.containerModifierClass}grid`);

			if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
				$el.addClass(`${params.containerModifierClass}grid-column`);
			}

			swiper.emitContainerClasses();
		}

		const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
		const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

		if (directionChanged && initialized) {
			swiper.changeDirection();
		}

		extend(swiper.params, breakpointParams);
		const isEnabled = swiper.params.enabled;
		Object.assign(swiper, {
			allowTouchMove: swiper.params.allowTouchMove,
			allowSlideNext: swiper.params.allowSlideNext,
			allowSlidePrev: swiper.params.allowSlidePrev
		});

		if (wasEnabled && !isEnabled) {
			swiper.disable();
		} else if (!wasEnabled && isEnabled) {
			swiper.enable();
		}

		swiper.currentBreakpoint = breakpoint;
		swiper.emit('_beforeBreakpoint', breakpointParams);

		if (needsReLoop && initialized) {
			swiper.loopDestroy();
			swiper.loopCreate();
			swiper.updateSlides();
			swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
		}

		swiper.emit('breakpoint', breakpointParams);
	}

	function getBreakpoint(breakpoints, base, containerEl) {
		if (base === void 0) {
			base = 'window';
		}

		if (!breakpoints || base === 'container' && !containerEl) return undefined;
		let breakpoint = false;
		const window = getWindow();
		const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
		const points = Object.keys(breakpoints).map(point => {
			if (typeof point === 'string' && point.indexOf('@') === 0) {
				const minRatio = parseFloat(point.substr(1));
				const value = currentHeight * minRatio;
				return {
					value,
					point
				};
			}

			return {
				value: point,
				point
			};
		});
		points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

		for (let i = 0; i < points.length; i += 1) {
			const {
				point,
				value
			} = points[i];

			if (base === 'window') {
				if (window.matchMedia(`(min-width: ${value}px)`).matches) {
					breakpoint = point;
				}
			} else if (value <= containerEl.clientWidth) {
				breakpoint = point;
			}
		}

		return breakpoint || 'max';
	}

	var breakpoints = {
		setBreakpoint,
		getBreakpoint
	};

	function prepareClasses(entries, prefix) {
		const resultClasses = [];
		entries.forEach(item => {
			if (typeof item === 'object') {
				Object.keys(item).forEach(classNames => {
					if (item[classNames]) {
						resultClasses.push(prefix + classNames);
					}
				});
			} else if (typeof item === 'string') {
				resultClasses.push(prefix + item);
			}
		});
		return resultClasses;
	}

	function addClasses() {
		const swiper = this;
		const {
			classNames,
			params,
			rtl,
			$el,
			device,
			support
		} = swiper; // prettier-ignore

		const suffixes = prepareClasses(['initialized', params.direction, {
			'pointer-events': !support.touch
		}, {
			'free-mode': swiper.params.freeMode && params.freeMode.enabled
		}, {
			'autoheight': params.autoHeight
		}, {
			'rtl': rtl
		}, {
			'grid': params.grid && params.grid.rows > 1
		}, {
			'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
		}, {
			'android': device.android
		}, {
			'ios': device.ios
		}, {
			'css-mode': params.cssMode
		}, {
			'centered': params.cssMode && params.centeredSlides
		}, {
			'watch-progress': params.watchSlidesProgress
		}], params.containerModifierClass);
		classNames.push(...suffixes);
		$el.addClass([...classNames].join(' '));
		swiper.emitContainerClasses();
	}

	function removeClasses() {
		const swiper = this;
		const {
			$el,
			classNames
		} = swiper;
		$el.removeClass(classNames.join(' '));
		swiper.emitContainerClasses();
	}

	var classes = {
		addClasses,
		removeClasses
	};

	function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
		const window = getWindow();
		let image;

		function onReady() {
			if (callback) callback();
		}

		const isPicture = $(imageEl).parent('picture')[0];

		if (!isPicture && (!imageEl.complete || !checkForComplete)) {
			if (src) {
				image = new window.Image();
				image.onload = onReady;
				image.onerror = onReady;

				if (sizes) {
					image.sizes = sizes;
				}

				if (srcset) {
					image.srcset = srcset;
				}

				if (src) {
					image.src = src;
				}
			} else {
				onReady();
			}
		} else {
			// image already loaded...
			onReady();
		}
	}

	function preloadImages() {
		const swiper = this;
		swiper.imagesToLoad = swiper.$el.find('img');

		function onReady() {
			if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
			if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

			if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
				if (swiper.params.updateOnImagesReady) swiper.update();
				swiper.emit('imagesReady');
			}
		}

		for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
			const imageEl = swiper.imagesToLoad[i];
			swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
		}
	}

	var images = {
		loadImage,
		preloadImages
	};

	function checkOverflow() {
		const swiper = this;
		const {
			isLocked: wasLocked,
			params
		} = swiper;
		const {
			slidesOffsetBefore
		} = params;

		if (slidesOffsetBefore) {
			const lastSlideIndex = swiper.slides.length - 1;
			const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
			swiper.isLocked = swiper.size > lastSlideRightEdge;
		} else {
			swiper.isLocked = swiper.snapGrid.length === 1;
		}

		if (params.allowSlideNext === true) {
			swiper.allowSlideNext = !swiper.isLocked;
		}

		if (params.allowSlidePrev === true) {
			swiper.allowSlidePrev = !swiper.isLocked;
		}

		if (wasLocked && wasLocked !== swiper.isLocked) {
			swiper.isEnd = false;
		}

		if (wasLocked !== swiper.isLocked) {
			swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
		}
	}

	var checkOverflow$1 = {
		checkOverflow
	};

	var defaults = {
		init: true,
		direction: 'horizontal',
		touchEventsTarget: 'wrapper',
		initialSlide: 0,
		speed: 300,
		cssMode: false,
		updateOnWindowResize: true,
		resizeObserver: true,
		nested: false,
		createElements: false,
		enabled: true,
		focusableElements: 'input, select, option, textarea, button, video, label',
		// Overrides
		width: null,
		height: null,
		//
		preventInteractionOnTransition: false,
		// ssr
		userAgent: null,
		url: null,
		// To support iOS's swipe-to-go-back gesture (when being used in-app).
		edgeSwipeDetection: false,
		edgeSwipeThreshold: 20,
		// Autoheight
		autoHeight: false,
		// Set wrapper width
		setWrapperSize: false,
		// Virtual Translate
		virtualTranslate: false,
		// Effects
		effect: 'slide',
		// 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
		// Breakpoints
		breakpoints: undefined,
		breakpointsBase: 'window',
		// Slides grid
		spaceBetween: 0,
		slidesPerView: 1,
		slidesPerGroup: 1,
		slidesPerGroupSkip: 0,
		slidesPerGroupAuto: false,
		centeredSlides: false,
		centeredSlidesBounds: false,
		slidesOffsetBefore: 0,
		// in px
		slidesOffsetAfter: 0,
		// in px
		normalizeSlideIndex: true,
		centerInsufficientSlides: false,
		// Disable swiper and hide navigation when container not overflow
		watchOverflow: true,
		// Round length
		roundLengths: false,
		// Touches
		touchRatio: 1,
		touchAngle: 45,
		simulateTouch: true,
		shortSwipes: true,
		longSwipes: true,
		longSwipesRatio: 0.5,
		longSwipesMs: 300,
		followFinger: true,
		allowTouchMove: true,
		threshold: 0,
		touchMoveStopPropagation: false,
		touchStartPreventDefault: true,
		touchStartForcePreventDefault: false,
		touchReleaseOnEdges: false,
		// Unique Navigation Elements
		uniqueNavElements: true,
		// Resistance
		resistance: true,
		resistanceRatio: 0.85,
		// Progress
		watchSlidesProgress: false,
		// Cursor
		grabCursor: false,
		// Clicks
		preventClicks: true,
		preventClicksPropagation: true,
		slideToClickedSlide: false,
		// Images
		preloadImages: true,
		updateOnImagesReady: true,
		// loop
		loop: false,
		loopAdditionalSlides: 0,
		loopedSlides: null,
		loopFillGroupWithBlank: false,
		loopPreventsSlide: true,
		// rewind
		rewind: false,
		// Swiping/no swiping
		allowSlidePrev: true,
		allowSlideNext: true,
		swipeHandler: null,
		// '.swipe-handler',
		noSwiping: true,
		noSwipingClass: 'swiper-no-swiping',
		noSwipingSelector: null,
		// Passive Listeners
		passiveListeners: true,
		maxBackfaceHiddenSlides: 10,
		// NS
		containerModifierClass: 'swiper-',
		// NEW
		slideClass: 'swiper-slide',
		slideBlankClass: 'swiper-slide-invisible-blank',
		slideActiveClass: 'swiper-slide-active',
		slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
		slideVisibleClass: 'swiper-slide-visible',
		slideDuplicateClass: 'swiper-slide-duplicate',
		slideNextClass: 'swiper-slide-next',
		slideDuplicateNextClass: 'swiper-slide-duplicate-next',
		slidePrevClass: 'swiper-slide-prev',
		slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
		wrapperClass: 'swiper-wrapper',
		// Callbacks
		runCallbacksOnInit: true,
		// Internals
		_emitClasses: false
	};

	function moduleExtendParams(params, allModulesParams) {
		return function extendParams(obj) {
			if (obj === void 0) {
				obj = {};
			}

			const moduleParamName = Object.keys(obj)[0];
			const moduleParams = obj[moduleParamName];

			if (typeof moduleParams !== 'object' || moduleParams === null) {
				extend(allModulesParams, obj);
				return;
			}

			if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
				params[moduleParamName] = {
					auto: true
				};
			}

			if (!(moduleParamName in params && 'enabled' in moduleParams)) {
				extend(allModulesParams, obj);
				return;
			}

			if (params[moduleParamName] === true) {
				params[moduleParamName] = {
					enabled: true
				};
			}

			if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
				params[moduleParamName].enabled = true;
			}

			if (!params[moduleParamName]) params[moduleParamName] = {
				enabled: false
			};
			extend(allModulesParams, obj);
		};
	}

	/* eslint no-param-reassign: "off" */
	const prototypes = {
		eventsEmitter,
		update,
		translate,
		transition,
		slide,
		loop,
		grabCursor,
		events: events$1,
		breakpoints,
		checkOverflow: checkOverflow$1,
		classes,
		images
	};
	const extendedDefaults = {};

	class Swiper {
		constructor() {
			let el;
			let params;

			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
				params = args[0];
			} else {
				[el, params] = args;
			}

			if (!params) params = {};
			params = extend({}, params);
			if (el && !params.el) params.el = el;

			if (params.el && $(params.el).length > 1) {
				const swipers = [];
				$(params.el).each(containerEl => {
					const newParams = extend({}, params, {
						el: containerEl
					});
					swipers.push(new Swiper(newParams));
				});
				return swipers;
			} // Swiper Instance


			const swiper = this;
			swiper.__swiper__ = true;
			swiper.support = getSupport();
			swiper.device = getDevice({
				userAgent: params.userAgent
			});
			swiper.browser = getBrowser();
			swiper.eventsListeners = {};
			swiper.eventsAnyListeners = [];
			swiper.modules = [...swiper.__modules__];

			if (params.modules && Array.isArray(params.modules)) {
				swiper.modules.push(...params.modules);
			}

			const allModulesParams = {};
			swiper.modules.forEach(mod => {
				mod({
					swiper,
					extendParams: moduleExtendParams(params, allModulesParams),
					on: swiper.on.bind(swiper),
					once: swiper.once.bind(swiper),
					off: swiper.off.bind(swiper),
					emit: swiper.emit.bind(swiper)
				});
			}); // Extend defaults with modules params

			const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params

			swiper.params = extend({}, swiperParams, extendedDefaults, params);
			swiper.originalParams = extend({}, swiper.params);
			swiper.passedParams = extend({}, params); // add event listeners

			if (swiper.params && swiper.params.on) {
				Object.keys(swiper.params.on).forEach(eventName => {
					swiper.on(eventName, swiper.params.on[eventName]);
				});
			}

			if (swiper.params && swiper.params.onAny) {
				swiper.onAny(swiper.params.onAny);
			} // Save Dom lib


			swiper.$ = $; // Extend Swiper

			Object.assign(swiper, {
				enabled: swiper.params.enabled,
				el,
				// Classes
				classNames: [],
				// Slides
				slides: $(),
				slidesGrid: [],
				snapGrid: [],
				slidesSizesGrid: [],

				// isDirection
				isHorizontal() {
					return swiper.params.direction === 'horizontal';
				},

				isVertical() {
					return swiper.params.direction === 'vertical';
				},

				// Indexes
				activeIndex: 0,
				realIndex: 0,
				//
				isBeginning: true,
				isEnd: false,
				// Props
				translate: 0,
				previousTranslate: 0,
				progress: 0,
				velocity: 0,
				animating: false,
				// Locks
				allowSlideNext: swiper.params.allowSlideNext,
				allowSlidePrev: swiper.params.allowSlidePrev,
				// Touch Events
				touchEvents: function touchEvents() {
					const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
					const desktop = ['pointerdown', 'pointermove', 'pointerup'];
					swiper.touchEventsTouch = {
						start: touch[0],
						move: touch[1],
						end: touch[2],
						cancel: touch[3]
					};
					swiper.touchEventsDesktop = {
						start: desktop[0],
						move: desktop[1],
						end: desktop[2]
					};
					return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
				}(),
				touchEventsData: {
					isTouched: undefined,
					isMoved: undefined,
					allowTouchCallbacks: undefined,
					touchStartTime: undefined,
					isScrolling: undefined,
					currentTranslate: undefined,
					startTranslate: undefined,
					allowThresholdMove: undefined,
					// Form elements to match
					focusableElements: swiper.params.focusableElements,
					// Last click time
					lastClickTime: now(),
					clickTimeout: undefined,
					// Velocities
					velocities: [],
					allowMomentumBounce: undefined,
					isTouchEvent: undefined,
					startMoving: undefined
				},
				// Clicks
				allowClick: true,
				// Touches
				allowTouchMove: swiper.params.allowTouchMove,
				touches: {
					startX: 0,
					startY: 0,
					currentX: 0,
					currentY: 0,
					diff: 0
				},
				// Images
				imagesToLoad: [],
				imagesLoaded: 0
			});
			swiper.emit('_swiper'); // Init

			if (swiper.params.init) {
				swiper.init();
			} // Return app instance


			return swiper;
		}

		enable() {
			const swiper = this;
			if (swiper.enabled) return;
			swiper.enabled = true;

			if (swiper.params.grabCursor) {
				swiper.setGrabCursor();
			}

			swiper.emit('enable');
		}

		disable() {
			const swiper = this;
			if (!swiper.enabled) return;
			swiper.enabled = false;

			if (swiper.params.grabCursor) {
				swiper.unsetGrabCursor();
			}

			swiper.emit('disable');
		}

		setProgress(progress, speed) {
			const swiper = this;
			progress = Math.min(Math.max(progress, 0), 1);
			const min = swiper.minTranslate();
			const max = swiper.maxTranslate();
			const current = (max - min) * progress + min;
			swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}

		emitContainerClasses() {
			const swiper = this;
			if (!swiper.params._emitClasses || !swiper.el) return;
			const cls = swiper.el.className.split(' ').filter(className => {
				return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
			});
			swiper.emit('_containerClasses', cls.join(' '));
		}

		getSlideClasses(slideEl) {
			const swiper = this;
			if (swiper.destroyed) return '';
			return slideEl.className.split(' ').filter(className => {
				return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
			}).join(' ');
		}

		emitSlidesClasses() {
			const swiper = this;
			if (!swiper.params._emitClasses || !swiper.el) return;
			const updates = [];
			swiper.slides.each(slideEl => {
				const classNames = swiper.getSlideClasses(slideEl);
				updates.push({
					slideEl,
					classNames
				});
				swiper.emit('_slideClass', slideEl, classNames);
			});
			swiper.emit('_slideClasses', updates);
		}

		slidesPerViewDynamic(view, exact) {
			if (view === void 0) {
				view = 'current';
			}

			if (exact === void 0) {
				exact = false;
			}

			const swiper = this;
			const {
				params,
				slides,
				slidesGrid,
				slidesSizesGrid,
				size: swiperSize,
				activeIndex
			} = swiper;
			let spv = 1;

			if (params.centeredSlides) {
				let slideSize = slides[activeIndex].swiperSlideSize;
				let breakLoop;

				for (let i = activeIndex + 1; i < slides.length; i += 1) {
					if (slides[i] && !breakLoop) {
						slideSize += slides[i].swiperSlideSize;
						spv += 1;
						if (slideSize > swiperSize) breakLoop = true;
					}
				}

				for (let i = activeIndex - 1; i >= 0; i -= 1) {
					if (slides[i] && !breakLoop) {
						slideSize += slides[i].swiperSlideSize;
						spv += 1;
						if (slideSize > swiperSize) breakLoop = true;
					}
				}
			} else {
				// eslint-disable-next-line
				if (view === 'current') {
					for (let i = activeIndex + 1; i < slides.length; i += 1) {
						const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

						if (slideInView) {
							spv += 1;
						}
					}
				} else {
					// previous
					for (let i = activeIndex - 1; i >= 0; i -= 1) {
						const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

						if (slideInView) {
							spv += 1;
						}
					}
				}
			}

			return spv;
		}

		update() {
			const swiper = this;
			if (!swiper || swiper.destroyed) return;
			const {
				snapGrid,
				params
			} = swiper; // Breakpoints

			if (params.breakpoints) {
				swiper.setBreakpoint();
			}

			swiper.updateSize();
			swiper.updateSlides();
			swiper.updateProgress();
			swiper.updateSlidesClasses();

			function setTranslate() {
				const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
				const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
				swiper.setTranslate(newTranslate);
				swiper.updateActiveIndex();
				swiper.updateSlidesClasses();
			}

			let translated;

			if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
				setTranslate();

				if (swiper.params.autoHeight) {
					swiper.updateAutoHeight();
				}
			} else {
				if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
					translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
				} else {
					translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
				}

				if (!translated) {
					setTranslate();
				}
			}

			if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
				swiper.checkOverflow();
			}

			swiper.emit('update');
		}

		changeDirection(newDirection, needUpdate) {
			if (needUpdate === void 0) {
				needUpdate = true;
			}

			const swiper = this;
			const currentDirection = swiper.params.direction;

			if (!newDirection) {
				// eslint-disable-next-line
				newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
			}

			if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
				return swiper;
			}

			swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
			swiper.emitContainerClasses();
			swiper.params.direction = newDirection;
			swiper.slides.each(slideEl => {
				if (newDirection === 'vertical') {
					slideEl.style.width = '';
				} else {
					slideEl.style.height = '';
				}
			});
			swiper.emit('changeDirection');
			if (needUpdate) swiper.update();
			return swiper;
		}

		mount(el) {
			const swiper = this;
			if (swiper.mounted) return true; // Find el

			const $el = $(el || swiper.params.el);
			el = $el[0];

			if (!el) {
				return false;
			}

			el.swiper = swiper;

			const getWrapperSelector = () => {
				return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
			};

			const getWrapper = () => {
				if (el && el.shadowRoot && el.shadowRoot.querySelector) {
					const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

					res.children = options => $el.children(options);

					return res;
				}

				if (!$el.children) {
					return $($el).children(getWrapperSelector());
				}

				return $el.children(getWrapperSelector());
			}; // Find Wrapper


			let $wrapperEl = getWrapper();

			if ($wrapperEl.length === 0 && swiper.params.createElements) {
				const document = getDocument();
				const wrapper = document.createElement('div');
				$wrapperEl = $(wrapper);
				wrapper.className = swiper.params.wrapperClass;
				$el.append(wrapper);
				$el.children(`.${swiper.params.slideClass}`).each(slideEl => {
					$wrapperEl.append(slideEl);
				});
			}

			Object.assign(swiper, {
				$el,
				el,
				$wrapperEl,
				wrapperEl: $wrapperEl[0],
				mounted: true,
				// RTL
				rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
				rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
				wrongRTL: $wrapperEl.css('display') === '-webkit-box'
			});
			return true;
		}

		init(el) {
			const swiper = this;
			if (swiper.initialized) return swiper;
			const mounted = swiper.mount(el);
			if (mounted === false) return swiper;
			swiper.emit('beforeInit'); // Set breakpoint

			if (swiper.params.breakpoints) {
				swiper.setBreakpoint();
			} // Add Classes


			swiper.addClasses(); // Create loop

			if (swiper.params.loop) {
				swiper.loopCreate();
			} // Update size


			swiper.updateSize(); // Update slides

			swiper.updateSlides();

			if (swiper.params.watchOverflow) {
				swiper.checkOverflow();
			} // Set Grab Cursor


			if (swiper.params.grabCursor && swiper.enabled) {
				swiper.setGrabCursor();
			}

			if (swiper.params.preloadImages) {
				swiper.preloadImages();
			} // Slide To Initial Slide


			if (swiper.params.loop) {
				swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
			} else {
				swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
			} // Attach events


			swiper.attachEvents(); // Init Flag

			swiper.initialized = true; // Emit

			swiper.emit('init');
			swiper.emit('afterInit');
			return swiper;
		}

		destroy(deleteInstance, cleanStyles) {
			if (deleteInstance === void 0) {
				deleteInstance = true;
			}

			if (cleanStyles === void 0) {
				cleanStyles = true;
			}

			const swiper = this;
			const {
				params,
				$el,
				$wrapperEl,
				slides
			} = swiper;

			if (typeof swiper.params === 'undefined' || swiper.destroyed) {
				return null;
			}

			swiper.emit('beforeDestroy'); // Init Flag

			swiper.initialized = false; // Detach events

			swiper.detachEvents(); // Destroy loop

			if (params.loop) {
				swiper.loopDestroy();
			} // Cleanup styles


			if (cleanStyles) {
				swiper.removeClasses();
				$el.removeAttr('style');
				$wrapperEl.removeAttr('style');

				if (slides && slides.length) {
					slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
				}
			}

			swiper.emit('destroy'); // Detach emitter events

			Object.keys(swiper.eventsListeners).forEach(eventName => {
				swiper.off(eventName);
			});

			if (deleteInstance !== false) {
				swiper.$el[0].swiper = null;
				deleteProps(swiper);
			}

			swiper.destroyed = true;
			return null;
		}

		static extendDefaults(newDefaults) {
			extend(extendedDefaults, newDefaults);
		}

		static get extendedDefaults() {
			return extendedDefaults;
		}

		static get defaults() {
			return defaults;
		}

		static installModule(mod) {
			if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
			const modules = Swiper.prototype.__modules__;

			if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
				modules.push(mod);
			}
		}

		static use(module) {
			if (Array.isArray(module)) {
				module.forEach(m => Swiper.installModule(m));
				return Swiper;
			}

			Swiper.installModule(module);
			return Swiper;
		}

	}

	Object.keys(prototypes).forEach(prototypeGroup => {
		Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
			Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
		});
	});
	Swiper.use([Resize, Observer]);

	function Virtual(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		extendParams({
			virtual: {
				enabled: false,
				slides: [],
				cache: true,
				renderSlide: null,
				renderExternal: null,
				renderExternalUpdate: true,
				addSlidesBefore: 0,
				addSlidesAfter: 0
			}
		});
		let cssModeTimeout;
		swiper.virtual = {
			cache: {},
			from: undefined,
			to: undefined,
			slides: [],
			offset: 0,
			slidesGrid: []
		};

		function renderSlide(slide, index) {
			const params = swiper.params.virtual;

			if (params.cache && swiper.virtual.cache[index]) {
				return swiper.virtual.cache[index];
			}

			const $slideEl = params.renderSlide ? $(params.renderSlide.call(swiper, slide, index)) : $(`<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`);
			if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
			if (params.cache) swiper.virtual.cache[index] = $slideEl;
			return $slideEl;
		}

		function update(force) {
			const {
				slidesPerView,
				slidesPerGroup,
				centeredSlides
			} = swiper.params;
			const {
				addSlidesBefore,
				addSlidesAfter
			} = swiper.params.virtual;
			const {
				from: previousFrom,
				to: previousTo,
				slides,
				slidesGrid: previousSlidesGrid,
				offset: previousOffset
			} = swiper.virtual;

			if (!swiper.params.cssMode) {
				swiper.updateActiveIndex();
			}

			const activeIndex = swiper.activeIndex || 0;
			let offsetProp;
			if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
			let slidesAfter;
			let slidesBefore;

			if (centeredSlides) {
				slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
				slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
			} else {
				slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
				slidesBefore = slidesPerGroup + addSlidesBefore;
			}

			const from = Math.max((activeIndex || 0) - slidesBefore, 0);
			const to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
			const offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
			Object.assign(swiper.virtual, {
				from,
				to,
				offset,
				slidesGrid: swiper.slidesGrid
			});

			function onRendered() {
				swiper.updateSlides();
				swiper.updateProgress();
				swiper.updateSlidesClasses();

				if (swiper.lazy && swiper.params.lazy.enabled) {
					swiper.lazy.load();
				}

				emit('virtualUpdate');
			}

			if (previousFrom === from && previousTo === to && !force) {
				if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
					swiper.slides.css(offsetProp, `${offset}px`);
				}

				swiper.updateProgress();
				emit('virtualUpdate');
				return;
			}

			if (swiper.params.virtual.renderExternal) {
				swiper.params.virtual.renderExternal.call(swiper, {
					offset,
					from,
					to,
					slides: function getSlides() {
						const slidesToRender = [];

						for (let i = from; i <= to; i += 1) {
							slidesToRender.push(slides[i]);
						}

						return slidesToRender;
					}()
				});

				if (swiper.params.virtual.renderExternalUpdate) {
					onRendered();
				} else {
					emit('virtualUpdate');
				}

				return;
			}

			const prependIndexes = [];
			const appendIndexes = [];

			if (force) {
				swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
			} else {
				for (let i = previousFrom; i <= previousTo; i += 1) {
					if (i < from || i > to) {
						swiper.$wrapperEl.find(`.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`).remove();
					}
				}
			}

			for (let i = 0; i < slides.length; i += 1) {
				if (i >= from && i <= to) {
					if (typeof previousTo === 'undefined' || force) {
						appendIndexes.push(i);
					} else {
						if (i > previousTo) appendIndexes.push(i);
						if (i < previousFrom) prependIndexes.push(i);
					}
				}
			}

			appendIndexes.forEach(index => {
				swiper.$wrapperEl.append(renderSlide(slides[index], index));
			});
			prependIndexes.sort((a, b) => b - a).forEach(index => {
				swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
			});
			swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, `${offset}px`);
			onRendered();
		}

		function appendSlide(slides) {
			if (typeof slides === 'object' && 'length' in slides) {
				for (let i = 0; i < slides.length; i += 1) {
					if (slides[i]) swiper.virtual.slides.push(slides[i]);
				}
			} else {
				swiper.virtual.slides.push(slides);
			}

			update(true);
		}

		function prependSlide(slides) {
			const activeIndex = swiper.activeIndex;
			let newActiveIndex = activeIndex + 1;
			let numberOfNewSlides = 1;

			if (Array.isArray(slides)) {
				for (let i = 0; i < slides.length; i += 1) {
					if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
				}

				newActiveIndex = activeIndex + slides.length;
				numberOfNewSlides = slides.length;
			} else {
				swiper.virtual.slides.unshift(slides);
			}

			if (swiper.params.virtual.cache) {
				const cache = swiper.virtual.cache;
				const newCache = {};
				Object.keys(cache).forEach(cachedIndex => {
					const $cachedEl = cache[cachedIndex];
					const cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

					if (cachedElIndex) {
						$cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
					}

					newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
				});
				swiper.virtual.cache = newCache;
			}

			update(true);
			swiper.slideTo(newActiveIndex, 0);
		}

		function removeSlide(slidesIndexes) {
			if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
			let activeIndex = swiper.activeIndex;

			if (Array.isArray(slidesIndexes)) {
				for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
					swiper.virtual.slides.splice(slidesIndexes[i], 1);

					if (swiper.params.virtual.cache) {
						delete swiper.virtual.cache[slidesIndexes[i]];
					}

					if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
					activeIndex = Math.max(activeIndex, 0);
				}
			} else {
				swiper.virtual.slides.splice(slidesIndexes, 1);

				if (swiper.params.virtual.cache) {
					delete swiper.virtual.cache[slidesIndexes];
				}

				if (slidesIndexes < activeIndex) activeIndex -= 1;
				activeIndex = Math.max(activeIndex, 0);
			}

			update(true);
			swiper.slideTo(activeIndex, 0);
		}

		function removeAllSlides() {
			swiper.virtual.slides = [];

			if (swiper.params.virtual.cache) {
				swiper.virtual.cache = {};
			}

			update(true);
			swiper.slideTo(0, 0);
		}

		on('beforeInit', () => {
			if (!swiper.params.virtual.enabled) return;
			swiper.virtual.slides = swiper.params.virtual.slides;
			swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
			swiper.params.watchSlidesProgress = true;
			swiper.originalParams.watchSlidesProgress = true;

			if (!swiper.params.initialSlide) {
				update();
			}
		});
		on('setTranslate', () => {
			if (!swiper.params.virtual.enabled) return;

			if (swiper.params.cssMode && !swiper._immediateVirtual) {
				clearTimeout(cssModeTimeout);
				cssModeTimeout = setTimeout(() => {
					update();
				}, 100);
			} else {
				update();
			}
		});
		on('init update resize', () => {
			if (!swiper.params.virtual.enabled) return;

			if (swiper.params.cssMode) {
				setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
			}
		});
		Object.assign(swiper.virtual, {
			appendSlide,
			prependSlide,
			removeSlide,
			removeAllSlides,
			update
		});
	}

	/* eslint-disable consistent-return */
	function Keyboard(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const document = getDocument();
		const window = getWindow();
		swiper.keyboard = {
			enabled: false
		};
		extendParams({
			keyboard: {
				enabled: false,
				onlyInViewport: true,
				pageUpDown: true
			}
		});

		function handle(event) {
			if (!swiper.enabled) return;
			const {
				rtlTranslate: rtl
			} = swiper;
			let e = event;
			if (e.originalEvent) e = e.originalEvent; // jquery fix

			const kc = e.keyCode || e.charCode;
			const pageUpDown = swiper.params.keyboard.pageUpDown;
			const isPageUp = pageUpDown && kc === 33;
			const isPageDown = pageUpDown && kc === 34;
			const isArrowLeft = kc === 37;
			const isArrowRight = kc === 39;
			const isArrowUp = kc === 38;
			const isArrowDown = kc === 40; // Directions locks

			if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
				return false;
			}

			if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
				return false;
			}

			if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
				return undefined;
			}

			if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
				return undefined;
			}

			if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
				let inView = false; // Check that swiper should be inside of visible area of window

				if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
					return undefined;
				}

				const $el = swiper.$el;
				const swiperWidth = $el[0].clientWidth;
				const swiperHeight = $el[0].clientHeight;
				const windowWidth = window.innerWidth;
				const windowHeight = window.innerHeight;
				const swiperOffset = swiper.$el.offset();
				if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
				const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

				for (let i = 0; i < swiperCoord.length; i += 1) {
					const point = swiperCoord[i];

					if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
						if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

						inView = true;
					}
				}

				if (!inView) return undefined;
			}

			if (swiper.isHorizontal()) {
				if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
					if (e.preventDefault) e.preventDefault();else e.returnValue = false;
				}

				if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
				if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
			} else {
				if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
					if (e.preventDefault) e.preventDefault();else e.returnValue = false;
				}

				if (isPageDown || isArrowDown) swiper.slideNext();
				if (isPageUp || isArrowUp) swiper.slidePrev();
			}

			emit('keyPress', kc);
			return undefined;
		}

		function enable() {
			if (swiper.keyboard.enabled) return;
			$(document).on('keydown', handle);
			swiper.keyboard.enabled = true;
		}

		function disable() {
			if (!swiper.keyboard.enabled) return;
			$(document).off('keydown', handle);
			swiper.keyboard.enabled = false;
		}

		on('init', () => {
			if (swiper.params.keyboard.enabled) {
				enable();
			}
		});
		on('destroy', () => {
			if (swiper.keyboard.enabled) {
				disable();
			}
		});
		Object.assign(swiper.keyboard, {
			enable,
			disable
		});
	}

	/* eslint-disable consistent-return */
	function Mousewheel(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const window = getWindow();
		extendParams({
			mousewheel: {
				enabled: false,
				releaseOnEdges: false,
				invert: false,
				forceToAxis: false,
				sensitivity: 1,
				eventsTarget: 'container',
				thresholdDelta: null,
				thresholdTime: null
			}
		});
		swiper.mousewheel = {
			enabled: false
		};
		let timeout;
		let lastScrollTime = now();
		let lastEventBeforeSnap;
		const recentWheelEvents = [];

		function normalize(e) {
			// Reasonable defaults
			const PIXEL_STEP = 10;
			const LINE_HEIGHT = 40;
			const PAGE_HEIGHT = 800;
			let sX = 0;
			let sY = 0; // spinX, spinY

			let pX = 0;
			let pY = 0; // pixelX, pixelY
			// Legacy

			if ('detail' in e) {
				sY = e.detail;
			}

			if ('wheelDelta' in e) {
				sY = -e.wheelDelta / 120;
			}

			if ('wheelDeltaY' in e) {
				sY = -e.wheelDeltaY / 120;
			}

			if ('wheelDeltaX' in e) {
				sX = -e.wheelDeltaX / 120;
			} // side scrolling on FF with DOMMouseScroll


			if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
				sX = sY;
				sY = 0;
			}

			pX = sX * PIXEL_STEP;
			pY = sY * PIXEL_STEP;

			if ('deltaY' in e) {
				pY = e.deltaY;
			}

			if ('deltaX' in e) {
				pX = e.deltaX;
			}

			if (e.shiftKey && !pX) {
				// if user scrolls with shift he wants horizontal scroll
				pX = pY;
				pY = 0;
			}

			if ((pX || pY) && e.deltaMode) {
				if (e.deltaMode === 1) {
					// delta in LINE units
					pX *= LINE_HEIGHT;
					pY *= LINE_HEIGHT;
				} else {
					// delta in PAGE units
					pX *= PAGE_HEIGHT;
					pY *= PAGE_HEIGHT;
				}
			} // Fall-back if spin cannot be determined


			if (pX && !sX) {
				sX = pX < 1 ? -1 : 1;
			}

			if (pY && !sY) {
				sY = pY < 1 ? -1 : 1;
			}

			return {
				spinX: sX,
				spinY: sY,
				pixelX: pX,
				pixelY: pY
			};
		}

		function handleMouseEnter() {
			if (!swiper.enabled) return;
			swiper.mouseEntered = true;
		}

		function handleMouseLeave() {
			if (!swiper.enabled) return;
			swiper.mouseEntered = false;
		}

		function animateSlider(newEvent) {
			if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
				// Prevent if delta of wheel scroll delta is below configured threshold
				return false;
			}

			if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
				// Prevent if time between scrolls is below configured threshold
				return false;
			} // If the movement is NOT big enough and
			// if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
			//   Don't go any further (avoid insignificant scroll movement).


			if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
				// Return false as a default
				return true;
			} // If user is scrolling towards the end:
			//   If the slider hasn't hit the latest slide or
			//   if the slider is a loop and
			//   if the slider isn't moving right now:
			//     Go to next slide and
			//     emit a scroll event.
			// Else (the user is scrolling towards the beginning) and
			// if the slider hasn't hit the first slide or
			// if the slider is a loop and
			// if the slider isn't moving right now:
			//   Go to prev slide and
			//   emit a scroll event.


			if (newEvent.direction < 0) {
				if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
					swiper.slideNext();
					emit('scroll', newEvent.raw);
				}
			} else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
				swiper.slidePrev();
				emit('scroll', newEvent.raw);
			} // If you got here is because an animation has been triggered so store the current time


			lastScrollTime = new window.Date().getTime(); // Return false as a default

			return false;
		}

		function releaseScroll(newEvent) {
			const params = swiper.params.mousewheel;

			if (newEvent.direction < 0) {
				if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
					// Return true to animate scroll on edges
					return true;
				}
			} else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
				// Return true to animate scroll on edges
				return true;
			}

			return false;
		}

		function handle(event) {
			let e = event;
			let disableParentSwiper = true;
			if (!swiper.enabled) return;
			const params = swiper.params.mousewheel;

			if (swiper.params.cssMode) {
				e.preventDefault();
			}

			let target = swiper.$el;

			if (swiper.params.mousewheel.eventsTarget !== 'container') {
				target = $(swiper.params.mousewheel.eventsTarget);
			}

			if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
			if (e.originalEvent) e = e.originalEvent; // jquery fix

			let delta = 0;
			const rtlFactor = swiper.rtlTranslate ? -1 : 1;
			const data = normalize(e);

			if (params.forceToAxis) {
				if (swiper.isHorizontal()) {
					if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
				} else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
			} else {
				delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
			}

			if (delta === 0) return true;
			if (params.invert) delta = -delta; // Get the scroll positions

			let positions = swiper.getTranslate() + delta * params.sensitivity;
			if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
			if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
			//     the disableParentSwiper will be true.
			// When loop is false:
			//     if the scroll positions is not on edge,
			//     then the disableParentSwiper will be true.
			//     if the scroll on edge positions,
			//     then the disableParentSwiper will be false.

			disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
			if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

			if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
				// Register the new event in a variable which stores the relevant data
				const newEvent = {
					time: now(),
					delta: Math.abs(delta),
					direction: Math.sign(delta),
					raw: event
				}; // Keep the most recent events

				if (recentWheelEvents.length >= 2) {
					recentWheelEvents.shift(); // only store the last N events
				}

				const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
				recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
				//   If direction has changed or
				//   if the scroll is quicker than the previous one:
				//     Animate the slider.
				// Else (this is the first time the wheel is moved):
				//     Animate the slider.

				if (prevEvent) {
					if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
						animateSlider(newEvent);
					}
				} else {
					animateSlider(newEvent);
				} // If it's time to release the scroll:
				//   Return now so you don't hit the preventDefault.


				if (releaseScroll(newEvent)) {
					return true;
				}
			} else {
				// Freemode or scrollContainer:
				// If we recently snapped after a momentum scroll, then ignore wheel events
				// to give time for the deceleration to finish. Stop ignoring after 500 msecs
				// or if it's a new scroll (larger delta or inverse sign as last event before
				// an end-of-momentum snap).
				const newEvent = {
					time: now(),
					delta: Math.abs(delta),
					direction: Math.sign(delta)
				};
				const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

				if (!ignoreWheelEvents) {
					lastEventBeforeSnap = undefined;

					if (swiper.params.loop) {
						swiper.loopFix();
					}

					let position = swiper.getTranslate() + delta * params.sensitivity;
					const wasBeginning = swiper.isBeginning;
					const wasEnd = swiper.isEnd;
					if (position >= swiper.minTranslate()) position = swiper.minTranslate();
					if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
					swiper.setTransition(0);
					swiper.setTranslate(position);
					swiper.updateProgress();
					swiper.updateActiveIndex();
					swiper.updateSlidesClasses();

					if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
						swiper.updateSlidesClasses();
					}

					if (swiper.params.freeMode.sticky) {
						// When wheel scrolling starts with sticky (aka snap) enabled, then detect
						// the end of a momentum scroll by storing recent (N=15?) wheel events.
						// 1. do all N events have decreasing or same (absolute value) delta?
						// 2. did all N events arrive in the last M (M=500?) msecs?
						// 3. does the earliest event have an (absolute value) delta that's
						//    at least P (P=1?) larger than the most recent event's delta?
						// 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
						// If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
						// Snap immediately and ignore remaining wheel events in this scroll.
						// See comment above for "remaining wheel events in this scroll" determination.
						// If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
						clearTimeout(timeout);
						timeout = undefined;

						if (recentWheelEvents.length >= 15) {
							recentWheelEvents.shift(); // only store the last N events
						}

						const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
						const firstEvent = recentWheelEvents[0];
						recentWheelEvents.push(newEvent);

						if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
							// Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
							recentWheelEvents.splice(0);
						} else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
							// We're at the end of the deceleration of a momentum scroll, so there's no need
							// to wait for more events. Snap ASAP on the next tick.
							// Also, because there's some remaining momentum we'll bias the snap in the
							// direction of the ongoing scroll because it's better UX for the scroll to snap
							// in the same direction as the scroll instead of reversing to snap.  Therefore,
							// if it's already scrolled more than 20% in the current direction, keep going.
							const snapToThreshold = delta > 0 ? 0.8 : 0.2;
							lastEventBeforeSnap = newEvent;
							recentWheelEvents.splice(0);
							timeout = nextTick(() => {
								swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
							}, 0); // no delay; move on next tick
						}

						if (!timeout) {
							// if we get here, then we haven't detected the end of a momentum scroll, so
							// we'll consider a scroll "complete" when there haven't been any wheel events
							// for 500ms.
							timeout = nextTick(() => {
								const snapToThreshold = 0.5;
								lastEventBeforeSnap = newEvent;
								recentWheelEvents.splice(0);
								swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
							}, 500);
						}
					} // Emit event


					if (!ignoreWheelEvents) emit('scroll', e); // Stop autoplay

					if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

					if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
				}
			}

			if (e.preventDefault) e.preventDefault();else e.returnValue = false;
			return false;
		}

		function events(method) {
			let target = swiper.$el;

			if (swiper.params.mousewheel.eventsTarget !== 'container') {
				target = $(swiper.params.mousewheel.eventsTarget);
			}

			target[method]('mouseenter', handleMouseEnter);
			target[method]('mouseleave', handleMouseLeave);
			target[method]('wheel', handle);
		}

		function enable() {
			if (swiper.params.cssMode) {
				swiper.wrapperEl.removeEventListener('wheel', handle);
				return true;
			}

			if (swiper.mousewheel.enabled) return false;
			events('on');
			swiper.mousewheel.enabled = true;
			return true;
		}

		function disable() {
			if (swiper.params.cssMode) {
				swiper.wrapperEl.addEventListener(event, handle);
				return true;
			}

			if (!swiper.mousewheel.enabled) return false;
			events('off');
			swiper.mousewheel.enabled = false;
			return true;
		}

		on('init', () => {
			if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
				disable();
			}

			if (swiper.params.mousewheel.enabled) enable();
		});
		on('destroy', () => {
			if (swiper.params.cssMode) {
				enable();
			}

			if (swiper.mousewheel.enabled) disable();
		});
		Object.assign(swiper.mousewheel, {
			enable,
			disable
		});
	}

	function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
		const document = getDocument();

		if (swiper.params.createElements) {
			Object.keys(checkProps).forEach(key => {
				if (!params[key] && params.auto === true) {
					let element = swiper.$el.children(`.${checkProps[key]}`)[0];

					if (!element) {
						element = document.createElement('div');
						element.className = checkProps[key];
						swiper.$el.append(element);
					}

					params[key] = element;
					originalParams[key] = element;
				}
			});
		}

		return params;
	}

	function Navigation(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		extendParams({
			navigation: {
				nextEl: null,
				prevEl: null,
				hideOnClick: false,
				disabledClass: 'swiper-button-disabled',
				hiddenClass: 'swiper-button-hidden',
				lockClass: 'swiper-button-lock'
			}
		});
		swiper.navigation = {
			nextEl: null,
			$nextEl: null,
			prevEl: null,
			$prevEl: null
		};

		function getEl(el) {
			let $el;

			if (el) {
				$el = $(el);

				if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
					$el = swiper.$el.find(el);
				}
			}

			return $el;
		}

		function toggleEl($el, disabled) {
			const params = swiper.params.navigation;

			if ($el && $el.length > 0) {
				$el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
				if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

				if (swiper.params.watchOverflow && swiper.enabled) {
					$el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
				}
			}
		}

		function update() {
			// Update Navigation Buttons
			if (swiper.params.loop) return;
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;
			toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
			toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
		}

		function onPrevClick(e) {
			e.preventDefault();
			if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
			swiper.slidePrev();
		}

		function onNextClick(e) {
			e.preventDefault();
			if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
			swiper.slideNext();
		}

		function init() {
			const params = swiper.params.navigation;
			swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
				nextEl: 'swiper-button-next',
				prevEl: 'swiper-button-prev'
			});
			if (!(params.nextEl || params.prevEl)) return;
			const $nextEl = getEl(params.nextEl);
			const $prevEl = getEl(params.prevEl);

			if ($nextEl && $nextEl.length > 0) {
				$nextEl.on('click', onNextClick);
			}

			if ($prevEl && $prevEl.length > 0) {
				$prevEl.on('click', onPrevClick);
			}

			Object.assign(swiper.navigation, {
				$nextEl,
				nextEl: $nextEl && $nextEl[0],
				$prevEl,
				prevEl: $prevEl && $prevEl[0]
			});

			if (!swiper.enabled) {
				if ($nextEl) $nextEl.addClass(params.lockClass);
				if ($prevEl) $prevEl.addClass(params.lockClass);
			}
		}

		function destroy() {
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;

			if ($nextEl && $nextEl.length) {
				$nextEl.off('click', onNextClick);
				$nextEl.removeClass(swiper.params.navigation.disabledClass);
			}

			if ($prevEl && $prevEl.length) {
				$prevEl.off('click', onPrevClick);
				$prevEl.removeClass(swiper.params.navigation.disabledClass);
			}
		}

		on('init', () => {
			init();
			update();
		});
		on('toEdge fromEdge lock unlock', () => {
			update();
		});
		on('destroy', () => {
			destroy();
		});
		on('enable disable', () => {
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;

			if ($nextEl) {
				$nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
			}

			if ($prevEl) {
				$prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
			}
		});
		on('click', (_s, e) => {
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;
			const targetEl = e.target;

			if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
				if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
				let isHidden;

				if ($nextEl) {
					isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
				} else if ($prevEl) {
					isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
				}

				if (isHidden === true) {
					emit('navigationShow');
				} else {
					emit('navigationHide');
				}

				if ($nextEl) {
					$nextEl.toggleClass(swiper.params.navigation.hiddenClass);
				}

				if ($prevEl) {
					$prevEl.toggleClass(swiper.params.navigation.hiddenClass);
				}
			}
		});
		Object.assign(swiper.navigation, {
			update,
			init,
			destroy
		});
	}

	function classesToSelector(classes) {
		if (classes === void 0) {
			classes = '';
		}

		return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
.replace(/ /g, '.')}`;
	}

	function Pagination(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const pfx = 'swiper-pagination';
		extendParams({
			pagination: {
				el: null,
				bulletElement: 'span',
				clickable: false,
				hideOnClick: false,
				renderBullet: null,
				renderProgressbar: null,
				renderFraction: null,
				renderCustom: null,
				progressbarOpposite: false,
				type: 'bullets',
				// 'bullets' or 'progressbar' or 'fraction' or 'custom'
				dynamicBullets: false,
				dynamicMainBullets: 1,
				formatFractionCurrent: number => number,
				formatFractionTotal: number => number,
				bulletClass: `${pfx}-bullet`,
				bulletActiveClass: `${pfx}-bullet-active`,
				modifierClass: `${pfx}-`,
				currentClass: `${pfx}-current`,
				totalClass: `${pfx}-total`,
				hiddenClass: `${pfx}-hidden`,
				progressbarFillClass: `${pfx}-progressbar-fill`,
				progressbarOppositeClass: `${pfx}-progressbar-opposite`,
				clickableClass: `${pfx}-clickable`,
				lockClass: `${pfx}-lock`,
				horizontalClass: `${pfx}-horizontal`,
				verticalClass: `${pfx}-vertical`
			}
		});
		swiper.pagination = {
			el: null,
			$el: null,
			bullets: []
		};
		let bulletSize;
		let dynamicBulletIndex = 0;

		function isPaginationDisabled() {
			return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
		}

		function setSideBullets($bulletEl, position) {
			const {
				bulletActiveClass
			} = swiper.params.pagination;
			$bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
		}

		function update() {
			// Render || Update Pagination bullets/items
			const rtl = swiper.rtl;
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
			const $el = swiper.pagination.$el; // Current/Total

			let current;
			const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

			if (swiper.params.loop) {
				current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

				if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
					current -= slidesLength - swiper.loopedSlides * 2;
				}

				if (current > total - 1) current -= total;
				if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
			} else if (typeof swiper.snapIndex !== 'undefined') {
				current = swiper.snapIndex;
			} else {
				current = swiper.activeIndex || 0;
			} // Types


			if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
				const bullets = swiper.pagination.bullets;
				let firstIndex;
				let lastIndex;
				let midIndex;

				if (params.dynamicBullets) {
					bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
					$el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

					if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
						dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);

						if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
							dynamicBulletIndex = params.dynamicMainBullets - 1;
						} else if (dynamicBulletIndex < 0) {
							dynamicBulletIndex = 0;
						}
					}

					firstIndex = Math.max(current - dynamicBulletIndex, 0);
					lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
					midIndex = (lastIndex + firstIndex) / 2;
				}

				bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

				if ($el.length > 1) {
					bullets.each(bullet => {
						const $bullet = $(bullet);
						const bulletIndex = $bullet.index();

						if (bulletIndex === current) {
							$bullet.addClass(params.bulletActiveClass);
						}

						if (params.dynamicBullets) {
							if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
								$bullet.addClass(`${params.bulletActiveClass}-main`);
							}

							if (bulletIndex === firstIndex) {
								setSideBullets($bullet, 'prev');
							}

							if (bulletIndex === lastIndex) {
								setSideBullets($bullet, 'next');
							}
						}
					});
				} else {
					const $bullet = bullets.eq(current);
					const bulletIndex = $bullet.index();
					$bullet.addClass(params.bulletActiveClass);

					if (params.dynamicBullets) {
						const $firstDisplayedBullet = bullets.eq(firstIndex);
						const $lastDisplayedBullet = bullets.eq(lastIndex);

						for (let i = firstIndex; i <= lastIndex; i += 1) {
							bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
						}

						if (swiper.params.loop) {
							if (bulletIndex >= bullets.length) {
								for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
									bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
								}

								bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
							} else {
								setSideBullets($firstDisplayedBullet, 'prev');
								setSideBullets($lastDisplayedBullet, 'next');
							}
						} else {
							setSideBullets($firstDisplayedBullet, 'prev');
							setSideBullets($lastDisplayedBullet, 'next');
						}
					}
				}

				if (params.dynamicBullets) {
					const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
					const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
					const offsetProp = rtl ? 'right' : 'left';
					bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
				}
			}

			if (params.type === 'fraction') {
				$el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
				$el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
			}

			if (params.type === 'progressbar') {
				let progressbarDirection;

				if (params.progressbarOpposite) {
					progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
				} else {
					progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
				}

				const scale = (current + 1) / total;
				let scaleX = 1;
				let scaleY = 1;

				if (progressbarDirection === 'horizontal') {
					scaleX = scale;
				} else {
					scaleY = scale;
				}

				$el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
			}

			if (params.type === 'custom' && params.renderCustom) {
				$el.html(params.renderCustom(swiper, current + 1, total));
				emit('paginationRender', $el[0]);
			} else {
				emit('paginationUpdate', $el[0]);
			}

			if (swiper.params.watchOverflow && swiper.enabled) {
				$el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
			}
		}

		function render() {
			// Render Container
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
			const $el = swiper.pagination.$el;
			let paginationHTML = '';

			if (params.type === 'bullets') {
				let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

				if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
					numberOfBullets = slidesLength;
				}

				for (let i = 0; i < numberOfBullets; i += 1) {
					if (params.renderBullet) {
						paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
					} else {
						paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
					}
				}

				$el.html(paginationHTML);
				swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
			}

			if (params.type === 'fraction') {
				if (params.renderFraction) {
					paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
				} else {
					paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
				}

				$el.html(paginationHTML);
			}

			if (params.type === 'progressbar') {
				if (params.renderProgressbar) {
					paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
				} else {
					paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
				}

				$el.html(paginationHTML);
			}

			if (params.type !== 'custom') {
				emit('paginationRender', swiper.pagination.$el[0]);
			}
		}

		function init() {
			swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
				el: 'swiper-pagination'
			});
			const params = swiper.params.pagination;
			if (!params.el) return;
			let $el = $(params.el);
			if ($el.length === 0) return;

			if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
				$el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

				if ($el.length > 1) {
					$el = $el.filter(el => {
						if ($(el).parents('.swiper')[0] !== swiper.el) return false;
						return true;
					});
				}
			}

			if (params.type === 'bullets' && params.clickable) {
				$el.addClass(params.clickableClass);
			}

			$el.addClass(params.modifierClass + params.type);
			$el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);

			if (params.type === 'bullets' && params.dynamicBullets) {
				$el.addClass(`${params.modifierClass}${params.type}-dynamic`);
				dynamicBulletIndex = 0;

				if (params.dynamicMainBullets < 1) {
					params.dynamicMainBullets = 1;
				}
			}

			if (params.type === 'progressbar' && params.progressbarOpposite) {
				$el.addClass(params.progressbarOppositeClass);
			}

			if (params.clickable) {
				$el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
					e.preventDefault();
					let index = $(this).index() * swiper.params.slidesPerGroup;
					if (swiper.params.loop) index += swiper.loopedSlides;
					swiper.slideTo(index);
				});
			}

			Object.assign(swiper.pagination, {
				$el,
				el: $el[0]
			});

			if (!swiper.enabled) {
				$el.addClass(params.lockClass);
			}
		}

		function destroy() {
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			const $el = swiper.pagination.$el;
			$el.removeClass(params.hiddenClass);
			$el.removeClass(params.modifierClass + params.type);
			$el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
			if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

			if (params.clickable) {
				$el.off('click', classesToSelector(params.bulletClass));
			}
		}

		on('init', () => {
			init();
			render();
			update();
		});
		on('activeIndexChange', () => {
			if (swiper.params.loop) {
				update();
			} else if (typeof swiper.snapIndex === 'undefined') {
				update();
			}
		});
		on('snapIndexChange', () => {
			if (!swiper.params.loop) {
				update();
			}
		});
		on('slidesLengthChange', () => {
			if (swiper.params.loop) {
				render();
				update();
			}
		});
		on('snapGridLengthChange', () => {
			if (!swiper.params.loop) {
				render();
				update();
			}
		});
		on('destroy', () => {
			destroy();
		});
		on('enable disable', () => {
			const {
				$el
			} = swiper.pagination;

			if ($el) {
				$el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
			}
		});
		on('lock unlock', () => {
			update();
		});
		on('click', (_s, e) => {
			const targetEl = e.target;
			const {
				$el
			} = swiper.pagination;

			if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
				if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
				const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

				if (isHidden === true) {
					emit('paginationShow');
				} else {
					emit('paginationHide');
				}

				$el.toggleClass(swiper.params.pagination.hiddenClass);
			}
		});
		Object.assign(swiper.pagination, {
			render,
			update,
			init,
			destroy
		});
	}

	function Scrollbar(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const document = getDocument();
		let isTouched = false;
		let timeout = null;
		let dragTimeout = null;
		let dragStartPos;
		let dragSize;
		let trackSize;
		let divider;
		extendParams({
			scrollbar: {
				el: null,
				dragSize: 'auto',
				hide: false,
				draggable: false,
				snapOnRelease: true,
				lockClass: 'swiper-scrollbar-lock',
				dragClass: 'swiper-scrollbar-drag'
			}
		});
		swiper.scrollbar = {
			el: null,
			dragEl: null,
			$el: null,
			$dragEl: null
		};

		function setTranslate() {
			if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
			const {
				scrollbar,
				rtlTranslate: rtl,
				progress
			} = swiper;
			const {
				$dragEl,
				$el
			} = scrollbar;
			const params = swiper.params.scrollbar;
			let newSize = dragSize;
			let newPos = (trackSize - dragSize) * progress;

			if (rtl) {
				newPos = -newPos;

				if (newPos > 0) {
					newSize = dragSize - newPos;
					newPos = 0;
				} else if (-newPos + dragSize > trackSize) {
					newSize = trackSize + newPos;
				}
			} else if (newPos < 0) {
				newSize = dragSize + newPos;
				newPos = 0;
			} else if (newPos + dragSize > trackSize) {
				newSize = trackSize - newPos;
			}

			if (swiper.isHorizontal()) {
				$dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
				$dragEl[0].style.width = `${newSize}px`;
			} else {
				$dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
				$dragEl[0].style.height = `${newSize}px`;
			}

			if (params.hide) {
				clearTimeout(timeout);
				$el[0].style.opacity = 1;
				timeout = setTimeout(() => {
					$el[0].style.opacity = 0;
					$el.transition(400);
				}, 1000);
			}
		}

		function setTransition(duration) {
			if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
			swiper.scrollbar.$dragEl.transition(duration);
		}

		function updateSize() {
			if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
			const {
				scrollbar
			} = swiper;
			const {
				$dragEl,
				$el
			} = scrollbar;
			$dragEl[0].style.width = '';
			$dragEl[0].style.height = '';
			trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
			divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));

			if (swiper.params.scrollbar.dragSize === 'auto') {
				dragSize = trackSize * divider;
			} else {
				dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
			}

			if (swiper.isHorizontal()) {
				$dragEl[0].style.width = `${dragSize}px`;
			} else {
				$dragEl[0].style.height = `${dragSize}px`;
			}

			if (divider >= 1) {
				$el[0].style.display = 'none';
			} else {
				$el[0].style.display = '';
			}

			if (swiper.params.scrollbar.hide) {
				$el[0].style.opacity = 0;
			}

			if (swiper.params.watchOverflow && swiper.enabled) {
				scrollbar.$el[swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
			}
		}

		function getPointerPosition(e) {
			if (swiper.isHorizontal()) {
				return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
			}

			return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
		}

		function setDragPosition(e) {
			const {
				scrollbar,
				rtlTranslate: rtl
			} = swiper;
			const {
				$el
			} = scrollbar;
			let positionRatio;
			positionRatio = (getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
			positionRatio = Math.max(Math.min(positionRatio, 1), 0);

			if (rtl) {
				positionRatio = 1 - positionRatio;
			}

			const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
			swiper.updateProgress(position);
			swiper.setTranslate(position);
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}

		function onDragStart(e) {
			const params = swiper.params.scrollbar;
			const {
				scrollbar,
				$wrapperEl
			} = swiper;
			const {
				$el,
				$dragEl
			} = scrollbar;
			isTouched = true;
			dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
			e.preventDefault();
			e.stopPropagation();
			$wrapperEl.transition(100);
			$dragEl.transition(100);
			setDragPosition(e);
			clearTimeout(dragTimeout);
			$el.transition(0);

			if (params.hide) {
				$el.css('opacity', 1);
			}

			if (swiper.params.cssMode) {
				swiper.$wrapperEl.css('scroll-snap-type', 'none');
			}

			emit('scrollbarDragStart', e);
		}

		function onDragMove(e) {
			const {
				scrollbar,
				$wrapperEl
			} = swiper;
			const {
				$el,
				$dragEl
			} = scrollbar;
			if (!isTouched) return;
			if (e.preventDefault) e.preventDefault();else e.returnValue = false;
			setDragPosition(e);
			$wrapperEl.transition(0);
			$el.transition(0);
			$dragEl.transition(0);
			emit('scrollbarDragMove', e);
		}

		function onDragEnd(e) {
			const params = swiper.params.scrollbar;
			const {
				scrollbar,
				$wrapperEl
			} = swiper;
			const {
				$el
			} = scrollbar;
			if (!isTouched) return;
			isTouched = false;

			if (swiper.params.cssMode) {
				swiper.$wrapperEl.css('scroll-snap-type', '');
				$wrapperEl.transition('');
			}

			if (params.hide) {
				clearTimeout(dragTimeout);
				dragTimeout = nextTick(() => {
					$el.css('opacity', 0);
					$el.transition(400);
				}, 1000);
			}

			emit('scrollbarDragEnd', e);

			if (params.snapOnRelease) {
				swiper.slideToClosest();
			}
		}

		function events(method) {
			const {
				scrollbar,
				touchEventsTouch,
				touchEventsDesktop,
				params,
				support
			} = swiper;
			const $el = scrollbar.$el;
			const target = $el[0];
			const activeListener = support.passiveListener && params.passiveListeners ? {
				passive: false,
				capture: false
			} : false;
			const passiveListener = support.passiveListener && params.passiveListeners ? {
				passive: true,
				capture: false
			} : false;
			if (!target) return;
			const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';

			if (!support.touch) {
				target[eventMethod](touchEventsDesktop.start, onDragStart, activeListener);
				document[eventMethod](touchEventsDesktop.move, onDragMove, activeListener);
				document[eventMethod](touchEventsDesktop.end, onDragEnd, passiveListener);
			} else {
				target[eventMethod](touchEventsTouch.start, onDragStart, activeListener);
				target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
				target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
			}
		}

		function enableDraggable() {
			if (!swiper.params.scrollbar.el) return;
			events('on');
		}

		function disableDraggable() {
			if (!swiper.params.scrollbar.el) return;
			events('off');
		}

		function init() {
			const {
				scrollbar,
				$el: $swiperEl
			} = swiper;
			swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
				el: 'swiper-scrollbar'
			});
			const params = swiper.params.scrollbar;
			if (!params.el) return;
			let $el = $(params.el);

			if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
				$el = $swiperEl.find(params.el);
			}

			let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

			if ($dragEl.length === 0) {
				$dragEl = $(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
				$el.append($dragEl);
			}

			Object.assign(scrollbar, {
				$el,
				el: $el[0],
				$dragEl,
				dragEl: $dragEl[0]
			});

			if (params.draggable) {
				enableDraggable();
			}

			if ($el) {
				$el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
			}
		}

		function destroy() {
			disableDraggable();
		}

		on('init', () => {
			init();
			updateSize();
			setTranslate();
		});
		on('update resize observerUpdate lock unlock', () => {
			updateSize();
		});
		on('setTranslate', () => {
			setTranslate();
		});
		on('setTransition', (_s, duration) => {
			setTransition(duration);
		});
		on('enable disable', () => {
			const {
				$el
			} = swiper.scrollbar;

			if ($el) {
				$el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
			}
		});
		on('destroy', () => {
			destroy();
		});
		Object.assign(swiper.scrollbar, {
			updateSize,
			setTranslate,
			init,
			destroy
		});
	}

	function Parallax(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			parallax: {
				enabled: false
			}
		});

		const setTransform = (el, progress) => {
			const {
				rtl
			} = swiper;
			const $el = $(el);
			const rtlFactor = rtl ? -1 : 1;
			const p = $el.attr('data-swiper-parallax') || '0';
			let x = $el.attr('data-swiper-parallax-x');
			let y = $el.attr('data-swiper-parallax-y');
			const scale = $el.attr('data-swiper-parallax-scale');
			const opacity = $el.attr('data-swiper-parallax-opacity');

			if (x || y) {
				x = x || '0';
				y = y || '0';
			} else if (swiper.isHorizontal()) {
				x = p;
				y = '0';
			} else {
				y = p;
				x = '0';
			}

			if (x.indexOf('%') >= 0) {
				x = `${parseInt(x, 10) * progress * rtlFactor}%`;
			} else {
				x = `${x * progress * rtlFactor}px`;
			}

			if (y.indexOf('%') >= 0) {
				y = `${parseInt(y, 10) * progress}%`;
			} else {
				y = `${y * progress}px`;
			}

			if (typeof opacity !== 'undefined' && opacity !== null) {
				const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
				$el[0].style.opacity = currentOpacity;
			}

			if (typeof scale === 'undefined' || scale === null) {
				$el.transform(`translate3d(${x}, ${y}, 0px)`);
			} else {
				const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
				$el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
			}
		};

		const setTranslate = () => {
			const {
				$el,
				slides,
				progress,
				snapGrid
			} = swiper;
			$el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
				setTransform(el, progress);
			});
			slides.each((slideEl, slideIndex) => {
				let slideProgress = slideEl.progress;

				if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
					slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
				}

				slideProgress = Math.min(Math.max(slideProgress, -1), 1);
				$(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
					setTransform(el, slideProgress);
				});
			});
		};

		const setTransition = function (duration) {
			if (duration === void 0) {
				duration = swiper.params.speed;
			}

			const {
				$el
			} = swiper;
			$el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(parallaxEl => {
				const $parallaxEl = $(parallaxEl);
				let parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
				if (duration === 0) parallaxDuration = 0;
				$parallaxEl.transition(parallaxDuration);
			});
		};

		on('beforeInit', () => {
			if (!swiper.params.parallax.enabled) return;
			swiper.params.watchSlidesProgress = true;
			swiper.originalParams.watchSlidesProgress = true;
		});
		on('init', () => {
			if (!swiper.params.parallax.enabled) return;
			setTranslate();
		});
		on('setTranslate', () => {
			if (!swiper.params.parallax.enabled) return;
			setTranslate();
		});
		on('setTransition', (_swiper, duration) => {
			if (!swiper.params.parallax.enabled) return;
			setTransition(duration);
		});
	}

	function Zoom(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const window = getWindow();
		extendParams({
			zoom: {
				enabled: false,
				maxRatio: 3,
				minRatio: 1,
				toggle: true,
				containerClass: 'swiper-zoom-container',
				zoomedSlideClass: 'swiper-slide-zoomed'
			}
		});
		swiper.zoom = {
			enabled: false
		};
		let currentScale = 1;
		let isScaling = false;
		let gesturesEnabled;
		let fakeGestureTouched;
		let fakeGestureMoved;
		const gesture = {
			$slideEl: undefined,
			slideWidth: undefined,
			slideHeight: undefined,
			$imageEl: undefined,
			$imageWrapEl: undefined,
			maxRatio: 3
		};
		const image = {
			isTouched: undefined,
			isMoved: undefined,
			currentX: undefined,
			currentY: undefined,
			minX: undefined,
			minY: undefined,
			maxX: undefined,
			maxY: undefined,
			width: undefined,
			height: undefined,
			startX: undefined,
			startY: undefined,
			touchesStart: {},
			touchesCurrent: {}
		};
		const velocity = {
			x: undefined,
			y: undefined,
			prevPositionX: undefined,
			prevPositionY: undefined,
			prevTime: undefined
		};
		let scale = 1;
		Object.defineProperty(swiper.zoom, 'scale', {
			get() {
				return scale;
			},

			set(value) {
				if (scale !== value) {
					const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
					const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : undefined;
					emit('zoomChange', value, imageEl, slideEl);
				}

				scale = value;
			}

		});

		function getDistanceBetweenTouches(e) {
			if (e.targetTouches.length < 2) return 1;
			const x1 = e.targetTouches[0].pageX;
			const y1 = e.targetTouches[0].pageY;
			const x2 = e.targetTouches[1].pageX;
			const y2 = e.targetTouches[1].pageY;
			const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
			return distance;
		} // Events


		function onGestureStart(e) {
			const support = swiper.support;
			const params = swiper.params.zoom;
			fakeGestureTouched = false;
			fakeGestureMoved = false;

			if (!support.gestures) {
				if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
					return;
				}

				fakeGestureTouched = true;
				gesture.scaleStart = getDistanceBetweenTouches(e);
			}

			if (!gesture.$slideEl || !gesture.$slideEl.length) {
				gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
				if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
				gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
				gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
				gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

				if (gesture.$imageWrapEl.length === 0) {
					gesture.$imageEl = undefined;
					return;
				}
			}

			if (gesture.$imageEl) {
				gesture.$imageEl.transition(0);
			}

			isScaling = true;
		}

		function onGestureChange(e) {
			const support = swiper.support;
			const params = swiper.params.zoom;
			const zoom = swiper.zoom;

			if (!support.gestures) {
				if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
					return;
				}

				fakeGestureMoved = true;
				gesture.scaleMove = getDistanceBetweenTouches(e);
			}

			if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
				if (e.type === 'gesturechange') onGestureStart(e);
				return;
			}

			if (support.gestures) {
				zoom.scale = e.scale * currentScale;
			} else {
				zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
			}

			if (zoom.scale > gesture.maxRatio) {
				zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
			}

			if (zoom.scale < params.minRatio) {
				zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
			}

			gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
		}

		function onGestureEnd(e) {
			const device = swiper.device;
			const support = swiper.support;
			const params = swiper.params.zoom;
			const zoom = swiper.zoom;

			if (!support.gestures) {
				if (!fakeGestureTouched || !fakeGestureMoved) {
					return;
				}

				if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
					return;
				}

				fakeGestureTouched = false;
				fakeGestureMoved = false;
			}

			if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
			zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
			gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
			currentScale = zoom.scale;
			isScaling = false;
			if (zoom.scale === 1) gesture.$slideEl = undefined;
		}

		function onTouchStart(e) {
			const device = swiper.device;
			if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
			if (image.isTouched) return;
			if (device.android && e.cancelable) e.preventDefault();
			image.isTouched = true;
			image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
			image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
		}

		function onTouchMove(e) {
			const zoom = swiper.zoom;
			if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
			swiper.allowClick = false;
			if (!image.isTouched || !gesture.$slideEl) return;

			if (!image.isMoved) {
				image.width = gesture.$imageEl[0].offsetWidth;
				image.height = gesture.$imageEl[0].offsetHeight;
				image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
				image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
				gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
				gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
				gesture.$imageWrapEl.transition(0);
			} // Define if we need image drag


			const scaledWidth = image.width * zoom.scale;
			const scaledHeight = image.height * zoom.scale;
			if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
			image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
			image.maxX = -image.minX;
			image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
			image.maxY = -image.minY;
			image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
			image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

			if (!image.isMoved && !isScaling) {
				if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
					image.isTouched = false;
					return;
				}

				if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
					image.isTouched = false;
					return;
				}
			}

			if (e.cancelable) {
				e.preventDefault();
			}

			e.stopPropagation();
			image.isMoved = true;
			image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
			image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

			if (image.currentX < image.minX) {
				image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
			}

			if (image.currentX > image.maxX) {
				image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
			}

			if (image.currentY < image.minY) {
				image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
			}

			if (image.currentY > image.maxY) {
				image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
			} // Velocity


			if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
			if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
			if (!velocity.prevTime) velocity.prevTime = Date.now();
			velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
			velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
			if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
			if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
			velocity.prevPositionX = image.touchesCurrent.x;
			velocity.prevPositionY = image.touchesCurrent.y;
			velocity.prevTime = Date.now();
			gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
		}

		function onTouchEnd() {
			const zoom = swiper.zoom;
			if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

			if (!image.isTouched || !image.isMoved) {
				image.isTouched = false;
				image.isMoved = false;
				return;
			}

			image.isTouched = false;
			image.isMoved = false;
			let momentumDurationX = 300;
			let momentumDurationY = 300;
			const momentumDistanceX = velocity.x * momentumDurationX;
			const newPositionX = image.currentX + momentumDistanceX;
			const momentumDistanceY = velocity.y * momentumDurationY;
			const newPositionY = image.currentY + momentumDistanceY; // Fix duration

			if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
			if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
			const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
			image.currentX = newPositionX;
			image.currentY = newPositionY; // Define if we need image drag

			const scaledWidth = image.width * zoom.scale;
			const scaledHeight = image.height * zoom.scale;
			image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
			image.maxX = -image.minX;
			image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
			image.maxY = -image.minY;
			image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
			image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
			gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
		}

		function onTransitionEnd() {
			const zoom = swiper.zoom;

			if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
				if (gesture.$imageEl) {
					gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
				}

				if (gesture.$imageWrapEl) {
					gesture.$imageWrapEl.transform('translate3d(0,0,0)');
				}

				zoom.scale = 1;
				currentScale = 1;
				gesture.$slideEl = undefined;
				gesture.$imageEl = undefined;
				gesture.$imageWrapEl = undefined;
			}
		}

		function zoomIn(e) {
			const zoom = swiper.zoom;
			const params = swiper.params.zoom;

			if (!gesture.$slideEl) {
				if (e && e.target) {
					gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
				}

				if (!gesture.$slideEl) {
					if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
						gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
					} else {
						gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
					}
				}

				gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
				gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
			}

			if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

			if (swiper.params.cssMode) {
				swiper.wrapperEl.style.overflow = 'hidden';
				swiper.wrapperEl.style.touchAction = 'none';
			}

			gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
			let touchX;
			let touchY;
			let offsetX;
			let offsetY;
			let diffX;
			let diffY;
			let translateX;
			let translateY;
			let imageWidth;
			let imageHeight;
			let scaledWidth;
			let scaledHeight;
			let translateMinX;
			let translateMinY;
			let translateMaxX;
			let translateMaxY;
			let slideWidth;
			let slideHeight;

			if (typeof image.touchesStart.x === 'undefined' && e) {
				touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
				touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
			} else {
				touchX = image.touchesStart.x;
				touchY = image.touchesStart.y;
			}

			zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
			currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

			if (e) {
				slideWidth = gesture.$slideEl[0].offsetWidth;
				slideHeight = gesture.$slideEl[0].offsetHeight;
				offsetX = gesture.$slideEl.offset().left + window.scrollX;
				offsetY = gesture.$slideEl.offset().top + window.scrollY;
				diffX = offsetX + slideWidth / 2 - touchX;
				diffY = offsetY + slideHeight / 2 - touchY;
				imageWidth = gesture.$imageEl[0].offsetWidth;
				imageHeight = gesture.$imageEl[0].offsetHeight;
				scaledWidth = imageWidth * zoom.scale;
				scaledHeight = imageHeight * zoom.scale;
				translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
				translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
				translateMaxX = -translateMinX;
				translateMaxY = -translateMinY;
				translateX = diffX * zoom.scale;
				translateY = diffY * zoom.scale;

				if (translateX < translateMinX) {
					translateX = translateMinX;
				}

				if (translateX > translateMaxX) {
					translateX = translateMaxX;
				}

				if (translateY < translateMinY) {
					translateY = translateMinY;
				}

				if (translateY > translateMaxY) {
					translateY = translateMaxY;
				}
			} else {
				translateX = 0;
				translateY = 0;
			}

			gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
			gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
		}

		function zoomOut() {
			const zoom = swiper.zoom;
			const params = swiper.params.zoom;

			if (!gesture.$slideEl) {
				if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
					gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
				} else {
					gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
				}

				gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
				gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
			}

			if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

			if (swiper.params.cssMode) {
				swiper.wrapperEl.style.overflow = '';
				swiper.wrapperEl.style.touchAction = '';
			}

			zoom.scale = 1;
			currentScale = 1;
			gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
			gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
			gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
			gesture.$slideEl = undefined;
		} // Toggle Zoom


		function zoomToggle(e) {
			const zoom = swiper.zoom;

			if (zoom.scale && zoom.scale !== 1) {
				// Zoom Out
				zoomOut();
			} else {
				// Zoom In
				zoomIn(e);
			}
		}

		function getListeners() {
			const support = swiper.support;
			const passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
				passive: true,
				capture: false
			} : false;
			const activeListenerWithCapture = support.passiveListener ? {
				passive: false,
				capture: true
			} : true;
			return {
				passiveListener,
				activeListenerWithCapture
			};
		}

		function getSlideSelector() {
			return `.${swiper.params.slideClass}`;
		}

		function toggleGestures(method) {
			const {
				passiveListener
			} = getListeners();
			const slideSelector = getSlideSelector();
			swiper.$wrapperEl[method]('gesturestart', slideSelector, onGestureStart, passiveListener);
			swiper.$wrapperEl[method]('gesturechange', slideSelector, onGestureChange, passiveListener);
			swiper.$wrapperEl[method]('gestureend', slideSelector, onGestureEnd, passiveListener);
		}

		function enableGestures() {
			if (gesturesEnabled) return;
			gesturesEnabled = true;
			toggleGestures('on');
		}

		function disableGestures() {
			if (!gesturesEnabled) return;
			gesturesEnabled = false;
			toggleGestures('off');
		} // Attach/Detach Events


		function enable() {
			const zoom = swiper.zoom;
			if (zoom.enabled) return;
			zoom.enabled = true;
			const support = swiper.support;
			const {
				passiveListener,
				activeListenerWithCapture
			} = getListeners();
			const slideSelector = getSlideSelector(); // Scale image

			if (support.gestures) {
				swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
				swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
			} else if (swiper.touchEvents.start === 'touchstart') {
				swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
				swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
				swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

				if (swiper.touchEvents.cancel) {
					swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
				}
			} // Move image


			swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
		}

		function disable() {
			const zoom = swiper.zoom;
			if (!zoom.enabled) return;
			const support = swiper.support;
			zoom.enabled = false;
			const {
				passiveListener,
				activeListenerWithCapture
			} = getListeners();
			const slideSelector = getSlideSelector(); // Scale image

			if (support.gestures) {
				swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
				swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
			} else if (swiper.touchEvents.start === 'touchstart') {
				swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
				swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
				swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

				if (swiper.touchEvents.cancel) {
					swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
				}
			} // Move image


			swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
		}

		on('init', () => {
			if (swiper.params.zoom.enabled) {
				enable();
			}
		});
		on('destroy', () => {
			disable();
		});
		on('touchStart', (_s, e) => {
			if (!swiper.zoom.enabled) return;
			onTouchStart(e);
		});
		on('touchEnd', (_s, e) => {
			if (!swiper.zoom.enabled) return;
			onTouchEnd();
		});
		on('doubleTap', (_s, e) => {
			if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
				zoomToggle(e);
			}
		});
		on('transitionEnd', () => {
			if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
				onTransitionEnd();
			}
		});
		on('slideChange', () => {
			if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
				onTransitionEnd();
			}
		});
		Object.assign(swiper.zoom, {
			enable,
			disable,
			in: zoomIn,
			out: zoomOut,
			toggle: zoomToggle
		});
	}

	function Lazy(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		extendParams({
			lazy: {
				checkInView: false,
				enabled: false,
				loadPrevNext: false,
				loadPrevNextAmount: 1,
				loadOnTransitionStart: false,
				scrollingElement: '',
				elementClass: 'swiper-lazy',
				loadingClass: 'swiper-lazy-loading',
				loadedClass: 'swiper-lazy-loaded',
				preloaderClass: 'swiper-lazy-preloader'
			}
		});
		swiper.lazy = {};
		let scrollHandlerAttached = false;
		let initialImageLoaded = false;

		function loadInSlide(index, loadInDuplicate) {
			if (loadInDuplicate === void 0) {
				loadInDuplicate = true;
			}

			const params = swiper.params.lazy;
			if (typeof index === 'undefined') return;
			if (swiper.slides.length === 0) return;
			const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
			const $slideEl = isVirtual ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`) : swiper.slides.eq(index);
			const $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);

			if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
				$images.push($slideEl[0]);
			}

			if ($images.length === 0) return;
			$images.each(imageEl => {
				const $imageEl = $(imageEl);
				$imageEl.addClass(params.loadingClass);
				const background = $imageEl.attr('data-background');
				const src = $imageEl.attr('data-src');
				const srcset = $imageEl.attr('data-srcset');
				const sizes = $imageEl.attr('data-sizes');
				const $pictureEl = $imageEl.parent('picture');
				swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, () => {
					if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

					if (background) {
						$imageEl.css('background-image', `url("${background}")`);
						$imageEl.removeAttr('data-background');
					} else {
						if (srcset) {
							$imageEl.attr('srcset', srcset);
							$imageEl.removeAttr('data-srcset');
						}

						if (sizes) {
							$imageEl.attr('sizes', sizes);
							$imageEl.removeAttr('data-sizes');
						}

						if ($pictureEl.length) {
							$pictureEl.children('source').each(sourceEl => {
								const $source = $(sourceEl);

								if ($source.attr('data-srcset')) {
									$source.attr('srcset', $source.attr('data-srcset'));
									$source.removeAttr('data-srcset');
								}
							});
						}

						if (src) {
							$imageEl.attr('src', src);
							$imageEl.removeAttr('data-src');
						}
					}

					$imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
					$slideEl.find(`.${params.preloaderClass}`).remove();

					if (swiper.params.loop && loadInDuplicate) {
						const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

						if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
							const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
							loadInSlide(originalSlide.index(), false);
						} else {
							const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
							loadInSlide(duplicatedSlide.index(), false);
						}
					}

					emit('lazyImageReady', $slideEl[0], $imageEl[0]);

					if (swiper.params.autoHeight) {
						swiper.updateAutoHeight();
					}
				});
				emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
			});
		}

		function load() {
			const {
				$wrapperEl,
				params: swiperParams,
				slides,
				activeIndex
			} = swiper;
			const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
			const params = swiperParams.lazy;
			let slidesPerView = swiperParams.slidesPerView;

			if (slidesPerView === 'auto') {
				slidesPerView = 0;
			}

			function slideExist(index) {
				if (isVirtual) {
					if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
						return true;
					}
				} else if (slides[index]) return true;

				return false;
			}

			function slideIndex(slideEl) {
				if (isVirtual) {
					return $(slideEl).attr('data-swiper-slide-index');
				}

				return $(slideEl).index();
			}

			if (!initialImageLoaded) initialImageLoaded = true;

			if (swiper.params.watchSlidesProgress) {
				$wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each(slideEl => {
					const index = isVirtual ? $(slideEl).attr('data-swiper-slide-index') : $(slideEl).index();
					loadInSlide(index);
				});
			} else if (slidesPerView > 1) {
				for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
					if (slideExist(i)) loadInSlide(i);
				}
			} else {
				loadInSlide(activeIndex);
			}

			if (params.loadPrevNext) {
				if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
					const amount = params.loadPrevNextAmount;
					const spv = slidesPerView;
					const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
					const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

					for (let i = activeIndex + slidesPerView; i < maxIndex; i += 1) {
						if (slideExist(i)) loadInSlide(i);
					} // Prev Slides


					for (let i = minIndex; i < activeIndex; i += 1) {
						if (slideExist(i)) loadInSlide(i);
					}
				} else {
					const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
					if (nextSlide.length > 0) loadInSlide(slideIndex(nextSlide));
					const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
					if (prevSlide.length > 0) loadInSlide(slideIndex(prevSlide));
				}
			}
		}

		function checkInViewOnLoad() {
			const window = getWindow();
			if (!swiper || swiper.destroyed) return;
			const $scrollElement = swiper.params.lazy.scrollingElement ? $(swiper.params.lazy.scrollingElement) : $(window);
			const isWindow = $scrollElement[0] === window;
			const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
			const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
			const swiperOffset = swiper.$el.offset();
			const {
				rtlTranslate: rtl
			} = swiper;
			let inView = false;
			if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
			const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

			for (let i = 0; i < swiperCoord.length; i += 1) {
				const point = swiperCoord[i];

				if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
					if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

					inView = true;
				}
			}

			const passiveListener = swiper.touchEvents.start === 'touchstart' && swiper.support.passiveListener && swiper.params.passiveListeners ? {
				passive: true,
				capture: false
			} : false;

			if (inView) {
				load();
				$scrollElement.off('scroll', checkInViewOnLoad, passiveListener);
			} else if (!scrollHandlerAttached) {
				scrollHandlerAttached = true;
				$scrollElement.on('scroll', checkInViewOnLoad, passiveListener);
			}
		}

		on('beforeInit', () => {
			if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
				swiper.params.preloadImages = false;
			}
		});
		on('init', () => {
			if (swiper.params.lazy.enabled) {
				if (swiper.params.lazy.checkInView) {
					checkInViewOnLoad();
				} else {
					load();
				}
			}
		});
		on('scroll', () => {
			if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky) {
				load();
			}
		});
		on('scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
			if (swiper.params.lazy.enabled) {
				if (swiper.params.lazy.checkInView) {
					checkInViewOnLoad();
				} else {
					load();
				}
			}
		});
		on('transitionStart', () => {
			if (swiper.params.lazy.enabled) {
				if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded) {
					if (swiper.params.lazy.checkInView) {
						checkInViewOnLoad();
					} else {
						load();
					}
				}
			}
		});
		on('transitionEnd', () => {
			if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
				if (swiper.params.lazy.checkInView) {
					checkInViewOnLoad();
				} else {
					load();
				}
			}
		});
		on('slideChange', () => {
			const {
				lazy,
				cssMode,
				watchSlidesProgress,
				touchReleaseOnEdges,
				resistanceRatio
			} = swiper.params;

			if (lazy.enabled && (cssMode || watchSlidesProgress && (touchReleaseOnEdges || resistanceRatio === 0))) {
				load();
			}
		});
		Object.assign(swiper.lazy, {
			load,
			loadInSlide
		});
	}

	/* eslint no-bitwise: ["error", { "allow": [">>"] }] */
	function Controller(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			controller: {
				control: undefined,
				inverse: false,
				by: 'slide' // or 'container'

			}
		});
		swiper.controller = {
			control: undefined
		};

		function LinearSpline(x, y) {
			const binarySearch = function search() {
				let maxIndex;
				let minIndex;
				let guess;
				return (array, val) => {
					minIndex = -1;
					maxIndex = array.length;

					while (maxIndex - minIndex > 1) {
						guess = maxIndex + minIndex >> 1;

						if (array[guess] <= val) {
							minIndex = guess;
						} else {
							maxIndex = guess;
						}
					}

					return maxIndex;
				};
			}();

			this.x = x;
			this.y = y;
			this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
			// (x1,y1) is the known point before given value,
			// (x3,y3) is the known point after given value.

			let i1;
			let i3;

			this.interpolate = function interpolate(x2) {
				if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

				i3 = binarySearch(this.x, x2);
				i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
				// y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

				return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
			};

			return this;
		} // xxx: for now i will just save one spline function to to


		function getInterpolateFunction(c) {
			if (!swiper.controller.spline) {
				swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
			}
		}

		function setTranslate(_t, byController) {
			const controlled = swiper.controller.control;
			let multiplier;
			let controlledTranslate;
			const Swiper = swiper.constructor;

			function setControlledTranslate(c) {
				// this will create an Interpolate function based on the snapGrids
				// x is the Grid of the scrolled scroller and y will be the controlled scroller
				// it makes sense to create this only once and recall it for the interpolation
				// the function does a lot of value caching for performance
				const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

				if (swiper.params.controller.by === 'slide') {
					getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
					// but it did not work out

					controlledTranslate = -swiper.controller.spline.interpolate(-translate);
				}

				if (!controlledTranslate || swiper.params.controller.by === 'container') {
					multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
					controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
				}

				if (swiper.params.controller.inverse) {
					controlledTranslate = c.maxTranslate() - controlledTranslate;
				}

				c.updateProgress(controlledTranslate);
				c.setTranslate(controlledTranslate, swiper);
				c.updateActiveIndex();
				c.updateSlidesClasses();
			}

			if (Array.isArray(controlled)) {
				for (let i = 0; i < controlled.length; i += 1) {
					if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
						setControlledTranslate(controlled[i]);
					}
				}
			} else if (controlled instanceof Swiper && byController !== controlled) {
				setControlledTranslate(controlled);
			}
		}

		function setTransition(duration, byController) {
			const Swiper = swiper.constructor;
			const controlled = swiper.controller.control;
			let i;

			function setControlledTransition(c) {
				c.setTransition(duration, swiper);

				if (duration !== 0) {
					c.transitionStart();

					if (c.params.autoHeight) {
						nextTick(() => {
							c.updateAutoHeight();
						});
					}

					c.$wrapperEl.transitionEnd(() => {
						if (!controlled) return;

						if (c.params.loop && swiper.params.controller.by === 'slide') {
							c.loopFix();
						}

						c.transitionEnd();
					});
				}
			}

			if (Array.isArray(controlled)) {
				for (i = 0; i < controlled.length; i += 1) {
					if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
						setControlledTransition(controlled[i]);
					}
				}
			} else if (controlled instanceof Swiper && byController !== controlled) {
				setControlledTransition(controlled);
			}
		}

		function removeSpline() {
			if (!swiper.controller.control) return;

			if (swiper.controller.spline) {
				swiper.controller.spline = undefined;
				delete swiper.controller.spline;
			}
		}

		on('beforeInit', () => {
			swiper.controller.control = swiper.params.controller.control;
		});
		on('update', () => {
			removeSpline();
		});
		on('resize', () => {
			removeSpline();
		});
		on('observerUpdate', () => {
			removeSpline();
		});
		on('setTranslate', (_s, translate, byController) => {
			if (!swiper.controller.control) return;
			swiper.controller.setTranslate(translate, byController);
		});
		on('setTransition', (_s, duration, byController) => {
			if (!swiper.controller.control) return;
			swiper.controller.setTransition(duration, byController);
		});
		Object.assign(swiper.controller, {
			setTranslate,
			setTransition
		});
	}

	function A11y(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			a11y: {
				enabled: true,
				notificationClass: 'swiper-notification',
				prevSlideMessage: 'Previous slide',
				nextSlideMessage: 'Next slide',
				firstSlideMessage: 'This is the first slide',
				lastSlideMessage: 'This is the last slide',
				paginationBulletMessage: 'Go to slide {{index}}',
				slideLabelMessage: '{{index}} / {{slidesLength}}',
				containerMessage: null,
				containerRoleDescriptionMessage: null,
				itemRoleDescriptionMessage: null,
				slideRole: 'group',
				id: null
			}
		});
		let liveRegion = null;

		function notify(message) {
			const notification = liveRegion;
			if (notification.length === 0) return;
			notification.html('');
			notification.html(message);
		}

		function getRandomNumber(size) {
			if (size === void 0) {
				size = 16;
			}

			const randomChar = () => Math.round(16 * Math.random()).toString(16);

			return 'x'.repeat(size).replace(/x/g, randomChar);
		}

		function makeElFocusable($el) {
			$el.attr('tabIndex', '0');
		}

		function makeElNotFocusable($el) {
			$el.attr('tabIndex', '-1');
		}

		function addElRole($el, role) {
			$el.attr('role', role);
		}

		function addElRoleDescription($el, description) {
			$el.attr('aria-roledescription', description);
		}

		function addElControls($el, controls) {
			$el.attr('aria-controls', controls);
		}

		function addElLabel($el, label) {
			$el.attr('aria-label', label);
		}

		function addElId($el, id) {
			$el.attr('id', id);
		}

		function addElLive($el, live) {
			$el.attr('aria-live', live);
		}

		function disableEl($el) {
			$el.attr('aria-disabled', true);
		}

		function enableEl($el) {
			$el.attr('aria-disabled', false);
		}

		function onEnterOrSpaceKey(e) {
			if (e.keyCode !== 13 && e.keyCode !== 32) return;
			const params = swiper.params.a11y;
			const $targetEl = $(e.target);

			if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
				if (!(swiper.isEnd && !swiper.params.loop)) {
					swiper.slideNext();
				}

				if (swiper.isEnd) {
					notify(params.lastSlideMessage);
				} else {
					notify(params.nextSlideMessage);
				}
			}

			if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
				if (!(swiper.isBeginning && !swiper.params.loop)) {
					swiper.slidePrev();
				}

				if (swiper.isBeginning) {
					notify(params.firstSlideMessage);
				} else {
					notify(params.prevSlideMessage);
				}
			}

			if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
				$targetEl[0].click();
			}
		}

		function updateNavigation() {
			if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;

			if ($prevEl && $prevEl.length > 0) {
				if (swiper.isBeginning) {
					disableEl($prevEl);
					makeElNotFocusable($prevEl);
				} else {
					enableEl($prevEl);
					makeElFocusable($prevEl);
				}
			}

			if ($nextEl && $nextEl.length > 0) {
				if (swiper.isEnd) {
					disableEl($nextEl);
					makeElNotFocusable($nextEl);
				} else {
					enableEl($nextEl);
					makeElFocusable($nextEl);
				}
			}
		}

		function hasPagination() {
			return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
		}

		function hasClickablePagination() {
			return hasPagination() && swiper.params.pagination.clickable;
		}

		function updatePagination() {
			const params = swiper.params.a11y;
			if (!hasPagination()) return;
			swiper.pagination.bullets.each(bulletEl => {
				const $bulletEl = $(bulletEl);

				if (swiper.params.pagination.clickable) {
					makeElFocusable($bulletEl);

					if (!swiper.params.pagination.renderBullet) {
						addElRole($bulletEl, 'button');
						addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
					}
				}

				if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
					$bulletEl.attr('aria-current', 'true');
				} else {
					$bulletEl.removeAttr('aria-current');
				}
			});
		}

		const initNavEl = ($el, wrapperId, message) => {
			makeElFocusable($el);

			if ($el[0].tagName !== 'BUTTON') {
				addElRole($el, 'button');
				$el.on('keydown', onEnterOrSpaceKey);
			}

			addElLabel($el, message);
			addElControls($el, wrapperId);
		};

		const handleFocus = e => {
			const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
			if (!slideEl || !swiper.slides.includes(slideEl)) return;
			const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
			const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
			if (isActive || isVisible) return;
			swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
		};

		function init() {
			const params = swiper.params.a11y;
			swiper.$el.append(liveRegion); // Container

			const $containerEl = swiper.$el;

			if (params.containerRoleDescriptionMessage) {
				addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
			}

			if (params.containerMessage) {
				addElLabel($containerEl, params.containerMessage);
			} // Wrapper


			const $wrapperEl = swiper.$wrapperEl;
			const wrapperId = params.id || $wrapperEl.attr('id') || `swiper-wrapper-${getRandomNumber(16)}`;
			const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
			addElId($wrapperEl, wrapperId);
			addElLive($wrapperEl, live); // Slide

			if (params.itemRoleDescriptionMessage) {
				addElRoleDescription($(swiper.slides), params.itemRoleDescriptionMessage);
			}

			addElRole($(swiper.slides), params.slideRole);
			const slidesLength = swiper.params.loop ? swiper.slides.filter(el => !el.classList.contains(swiper.params.slideDuplicateClass)).length : swiper.slides.length;
			swiper.slides.each((slideEl, index) => {
				const $slideEl = $(slideEl);
				const slideIndex = swiper.params.loop ? parseInt($slideEl.attr('data-swiper-slide-index'), 10) : index;
				const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
				addElLabel($slideEl, ariaLabelMessage);
			}); // Navigation

			let $nextEl;
			let $prevEl;

			if (swiper.navigation && swiper.navigation.$nextEl) {
				$nextEl = swiper.navigation.$nextEl;
			}

			if (swiper.navigation && swiper.navigation.$prevEl) {
				$prevEl = swiper.navigation.$prevEl;
			}

			if ($nextEl && $nextEl.length) {
				initNavEl($nextEl, wrapperId, params.nextSlideMessage);
			}

			if ($prevEl && $prevEl.length) {
				initNavEl($prevEl, wrapperId, params.prevSlideMessage);
			} // Pagination


			if (hasClickablePagination()) {
				swiper.pagination.$el.on('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
			} // Tab focus


			swiper.$el.on('focus', handleFocus, true);
		}

		function destroy() {
			if (liveRegion && liveRegion.length > 0) liveRegion.remove();
			let $nextEl;
			let $prevEl;

			if (swiper.navigation && swiper.navigation.$nextEl) {
				$nextEl = swiper.navigation.$nextEl;
			}

			if (swiper.navigation && swiper.navigation.$prevEl) {
				$prevEl = swiper.navigation.$prevEl;
			}

			if ($nextEl) {
				$nextEl.off('keydown', onEnterOrSpaceKey);
			}

			if ($prevEl) {
				$prevEl.off('keydown', onEnterOrSpaceKey);
			} // Pagination


			if (hasClickablePagination()) {
				swiper.pagination.$el.off('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
			} // Tab focus


			swiper.$el.off('focus', handleFocus, true);
		}

		on('beforeInit', () => {
			liveRegion = $(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
		});
		on('afterInit', () => {
			if (!swiper.params.a11y.enabled) return;
			init();
		});
		on('fromEdge toEdge afterInit lock unlock', () => {
			if (!swiper.params.a11y.enabled) return;
			updateNavigation();
		});
		on('paginationUpdate', () => {
			if (!swiper.params.a11y.enabled) return;
			updatePagination();
		});
		on('destroy', () => {
			if (!swiper.params.a11y.enabled) return;
			destroy();
		});
	}

	function History(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			history: {
				enabled: false,
				root: '',
				replaceState: false,
				key: 'slides',
				keepQuery: false
			}
		});
		let initialized = false;
		let paths = {};

		const slugify = text => {
			return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
		};

		const getPathValues = urlOverride => {
			const window = getWindow();
			let location;

			if (urlOverride) {
				location = new URL(urlOverride);
			} else {
				location = window.location;
			}

			const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
			const total = pathArray.length;
			const key = pathArray[total - 2];
			const value = pathArray[total - 1];
			return {
				key,
				value
			};
		};

		const setHistory = (key, index) => {
			const window = getWindow();
			if (!initialized || !swiper.params.history.enabled) return;
			let location;

			if (swiper.params.url) {
				location = new URL(swiper.params.url);
			} else {
				location = window.location;
			}

			const slide = swiper.slides.eq(index);
			let value = slugify(slide.attr('data-history'));

			if (swiper.params.history.root.length > 0) {
				let root = swiper.params.history.root;
				if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
				value = `${root}/${key}/${value}`;
			} else if (!location.pathname.includes(key)) {
				value = `${key}/${value}`;
			}

			if (swiper.params.history.keepQuery) {
				value += location.search;
			}

			const currentState = window.history.state;

			if (currentState && currentState.value === value) {
				return;
			}

			if (swiper.params.history.replaceState) {
				window.history.replaceState({
					value
				}, null, value);
			} else {
				window.history.pushState({
					value
				}, null, value);
			}
		};

		const scrollToSlide = (speed, value, runCallbacks) => {
			if (value) {
				for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
					const slide = swiper.slides.eq(i);
					const slideHistory = slugify(slide.attr('data-history'));

					if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
						const index = slide.index();
						swiper.slideTo(index, speed, runCallbacks);
					}
				}
			} else {
				swiper.slideTo(0, speed, runCallbacks);
			}
		};

		const setHistoryPopState = () => {
			paths = getPathValues(swiper.params.url);
			scrollToSlide(swiper.params.speed, paths.value, false);
		};

		const init = () => {
			const window = getWindow();
			if (!swiper.params.history) return;

			if (!window.history || !window.history.pushState) {
				swiper.params.history.enabled = false;
				swiper.params.hashNavigation.enabled = true;
				return;
			}

			initialized = true;
			paths = getPathValues(swiper.params.url);
			if (!paths.key && !paths.value) return;
			scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);

			if (!swiper.params.history.replaceState) {
				window.addEventListener('popstate', setHistoryPopState);
			}
		};

		const destroy = () => {
			const window = getWindow();

			if (!swiper.params.history.replaceState) {
				window.removeEventListener('popstate', setHistoryPopState);
			}
		};

		on('init', () => {
			if (swiper.params.history.enabled) {
				init();
			}
		});
		on('destroy', () => {
			if (swiper.params.history.enabled) {
				destroy();
			}
		});
		on('transitionEnd _freeModeNoMomentumRelease', () => {
			if (initialized) {
				setHistory(swiper.params.history.key, swiper.activeIndex);
			}
		});
		on('slideChange', () => {
			if (initialized && swiper.params.cssMode) {
				setHistory(swiper.params.history.key, swiper.activeIndex);
			}
		});
	}

	function HashNavigation(_ref) {
		let {
			swiper,
			extendParams,
			emit,
			on
		} = _ref;
		let initialized = false;
		const document = getDocument();
		const window = getWindow();
		extendParams({
			hashNavigation: {
				enabled: false,
				replaceState: false,
				watchState: false
			}
		});

		const onHashChange = () => {
			emit('hashChange');
			const newHash = document.location.hash.replace('#', '');
			const activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

			if (newHash !== activeSlideHash) {
				const newIndex = swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`).index();
				if (typeof newIndex === 'undefined') return;
				swiper.slideTo(newIndex);
			}
		};

		const setHash = () => {
			if (!initialized || !swiper.params.hashNavigation.enabled) return;

			if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
				window.history.replaceState(null, null, `#${swiper.slides.eq(swiper.activeIndex).attr('data-hash')}` || '');
				emit('hashSet');
			} else {
				const slide = swiper.slides.eq(swiper.activeIndex);
				const hash = slide.attr('data-hash') || slide.attr('data-history');
				document.location.hash = hash || '';
				emit('hashSet');
			}
		};

		const init = () => {
			if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
			initialized = true;
			const hash = document.location.hash.replace('#', '');

			if (hash) {
				const speed = 0;

				for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
					const slide = swiper.slides.eq(i);
					const slideHash = slide.attr('data-hash') || slide.attr('data-history');

					if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
						const index = slide.index();
						swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
					}
				}
			}

			if (swiper.params.hashNavigation.watchState) {
				$(window).on('hashchange', onHashChange);
			}
		};

		const destroy = () => {
			if (swiper.params.hashNavigation.watchState) {
				$(window).off('hashchange', onHashChange);
			}
		};

		on('init', () => {
			if (swiper.params.hashNavigation.enabled) {
				init();
			}
		});
		on('destroy', () => {
			if (swiper.params.hashNavigation.enabled) {
				destroy();
			}
		});
		on('transitionEnd _freeModeNoMomentumRelease', () => {
			if (initialized) {
				setHash();
			}
		});
		on('slideChange', () => {
			if (initialized && swiper.params.cssMode) {
				setHash();
			}
		});
	}

	/* eslint no-underscore-dangle: "off" */
	function Autoplay(_ref) {
		let {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		let timeout;
		swiper.autoplay = {
			running: false,
			paused: false
		};
		extendParams({
			autoplay: {
				enabled: false,
				delay: 3000,
				waitForTransition: true,
				disableOnInteraction: true,
				stopOnLastSlide: false,
				reverseDirection: false,
				pauseOnMouseEnter: false
			}
		});

		function run() {
			const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
			let delay = swiper.params.autoplay.delay;

			if ($activeSlideEl.attr('data-swiper-autoplay')) {
				delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
			}

			clearTimeout(timeout);
			timeout = nextTick(() => {
				let autoplayResult;

				if (swiper.params.autoplay.reverseDirection) {
					if (swiper.params.loop) {
						swiper.loopFix();
						autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
						emit('autoplay');
					} else if (!swiper.isBeginning) {
						autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
						emit('autoplay');
					} else if (!swiper.params.autoplay.stopOnLastSlide) {
						autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
						emit('autoplay');
					} else {
						stop();
					}
				} else if (swiper.params.loop) {
					swiper.loopFix();
					autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
					emit('autoplay');
				} else if (!swiper.isEnd) {
					autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
					emit('autoplay');
				} else if (!swiper.params.autoplay.stopOnLastSlide) {
					autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
					emit('autoplay');
				} else {
					stop();
				}

				if (swiper.params.cssMode && swiper.autoplay.running) run();else if (autoplayResult === false) {
					run();
				}
			}, delay);
		}

		function start() {
			if (typeof timeout !== 'undefined') return false;
			if (swiper.autoplay.running) return false;
			swiper.autoplay.running = true;
			emit('autoplayStart');
			run();
			return true;
		}

		function stop() {
			if (!swiper.autoplay.running) return false;
			if (typeof timeout === 'undefined') return false;

			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined;
			}

			swiper.autoplay.running = false;
			emit('autoplayStop');
			return true;
		}

		function pause(speed) {
			if (!swiper.autoplay.running) return;
			if (swiper.autoplay.paused) return;
			if (timeout) clearTimeout(timeout);
			swiper.autoplay.paused = true;

			if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
				swiper.autoplay.paused = false;
				run();
			} else {
				['transitionend', 'webkitTransitionEnd'].forEach(event => {
					swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
				});
			}
		}

		function onVisibilityChange() {
			const document = getDocument();

			if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
				pause();
			}

			if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
				run();
				swiper.autoplay.paused = false;
			}
		}

		function onTransitionEnd(e) {
			if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
			if (e.target !== swiper.$wrapperEl[0]) return;
			['transitionend', 'webkitTransitionEnd'].forEach(event => {
				swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
			});
			swiper.autoplay.paused = false;

			if (!swiper.autoplay.running) {
				stop();
			} else {
				run();
			}
		}

		function onMouseEnter() {
			if (swiper.params.autoplay.disableOnInteraction) {
				stop();
			} else {
				emit('autoplayPause');
				pause();
			}

			['transitionend', 'webkitTransitionEnd'].forEach(event => {
				swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
			});
		}

		function onMouseLeave() {
			if (swiper.params.autoplay.disableOnInteraction) {
				return;
			}

			swiper.autoplay.paused = false;
			emit('autoplayResume');
			run();
		}

		function attachMouseEvents() {
			if (swiper.params.autoplay.pauseOnMouseEnter) {
				swiper.$el.on('mouseenter', onMouseEnter);
				swiper.$el.on('mouseleave', onMouseLeave);
			}
		}

		function detachMouseEvents() {
			swiper.$el.off('mouseenter', onMouseEnter);
			swiper.$el.off('mouseleave', onMouseLeave);
		}

		on('init', () => {
			if (swiper.params.autoplay.enabled) {
				start();
				const document = getDocument();
				document.addEventListener('visibilitychange', onVisibilityChange);
				attachMouseEvents();
			}
		});
		on('beforeTransitionStart', (_s, speed, internal) => {
			if (swiper.autoplay.running) {
				if (internal || !swiper.params.autoplay.disableOnInteraction) {
					swiper.autoplay.pause(speed);
				} else {
					stop();
				}
			}
		});
		on('sliderFirstMove', () => {
			if (swiper.autoplay.running) {
				if (swiper.params.autoplay.disableOnInteraction) {
					stop();
				} else {
					pause();
				}
			}
		});
		on('touchEnd', () => {
			if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
				run();
			}
		});
		on('destroy', () => {
			detachMouseEvents();

			if (swiper.autoplay.running) {
				stop();
			}

			const document = getDocument();
			document.removeEventListener('visibilitychange', onVisibilityChange);
		});
		Object.assign(swiper.autoplay, {
			pause,
			run,
			start,
			stop
		});
	}

	function Thumb(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			thumbs: {
				swiper: null,
				multipleActiveThumbs: true,
				autoScrollOffset: 0,
				slideThumbActiveClass: 'swiper-slide-thumb-active',
				thumbsContainerClass: 'swiper-thumbs'
			}
		});
		let initialized = false;
		let swiperCreated = false;
		swiper.thumbs = {
			swiper: null
		};

		function onThumbClick() {
			const thumbsSwiper = swiper.thumbs.swiper;
			if (!thumbsSwiper || thumbsSwiper.destroyed) return;
			const clickedIndex = thumbsSwiper.clickedIndex;
			const clickedSlide = thumbsSwiper.clickedSlide;
			if (clickedSlide && $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
			if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
			let slideToIndex;

			if (thumbsSwiper.params.loop) {
				slideToIndex = parseInt($(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
			} else {
				slideToIndex = clickedIndex;
			}

			if (swiper.params.loop) {
				let currentIndex = swiper.activeIndex;

				if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
					swiper.loopFix(); // eslint-disable-next-line

					swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
					currentIndex = swiper.activeIndex;
				}

				const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
				const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
				if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
			}

			swiper.slideTo(slideToIndex);
		}

		function init() {
			const {
				thumbs: thumbsParams
			} = swiper.params;
			if (initialized) return false;
			initialized = true;
			const SwiperClass = swiper.constructor;

			if (thumbsParams.swiper instanceof SwiperClass) {
				swiper.thumbs.swiper = thumbsParams.swiper;
				Object.assign(swiper.thumbs.swiper.originalParams, {
					watchSlidesProgress: true,
					slideToClickedSlide: false
				});
				Object.assign(swiper.thumbs.swiper.params, {
					watchSlidesProgress: true,
					slideToClickedSlide: false
				});
			} else if (isObject(thumbsParams.swiper)) {
				const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
				Object.assign(thumbsSwiperParams, {
					watchSlidesProgress: true,
					slideToClickedSlide: false
				});
				swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
				swiperCreated = true;
			}

			swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
			swiper.thumbs.swiper.on('tap', onThumbClick);
			return true;
		}

		function update(initial) {
			const thumbsSwiper = swiper.thumbs.swiper;
			if (!thumbsSwiper || thumbsSwiper.destroyed) return;
			const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
			const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
			const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

			if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
				let currentThumbsIndex = thumbsSwiper.activeIndex;
				let newThumbsIndex;
				let direction;

				if (thumbsSwiper.params.loop) {
					if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
						thumbsSwiper.loopFix(); // eslint-disable-next-line

						thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
						currentThumbsIndex = thumbsSwiper.activeIndex;
					} // Find actual thumbs index to slide to


					const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
					const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();

					if (typeof prevThumbsIndex === 'undefined') {
						newThumbsIndex = nextThumbsIndex;
					} else if (typeof nextThumbsIndex === 'undefined') {
						newThumbsIndex = prevThumbsIndex;
					} else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
						newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
					} else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
						newThumbsIndex = nextThumbsIndex;
					} else {
						newThumbsIndex = prevThumbsIndex;
					}

					direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
				} else {
					newThumbsIndex = swiper.realIndex;
					direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
				}

				if (useOffset) {
					newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
				}

				if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
					if (thumbsSwiper.params.centeredSlides) {
						if (newThumbsIndex > currentThumbsIndex) {
							newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
						} else {
							newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
						}
					} else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;

					thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
				}
			} // Activate thumbs


			let thumbsToActivate = 1;
			const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

			if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
				thumbsToActivate = swiper.params.slidesPerView;
			}

			if (!swiper.params.thumbs.multipleActiveThumbs) {
				thumbsToActivate = 1;
			}

			thumbsToActivate = Math.floor(thumbsToActivate);
			thumbsSwiper.slides.removeClass(thumbActiveClass);

			if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
				for (let i = 0; i < thumbsToActivate; i += 1) {
					thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
				}
			} else {
				for (let i = 0; i < thumbsToActivate; i += 1) {
					thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
				}
			}
		}

		on('beforeInit', () => {
			const {
				thumbs
			} = swiper.params;
			if (!thumbs || !thumbs.swiper) return;
			init();
			update(true);
		});
		on('slideChange update resize observerUpdate', () => {
			update();
		});
		on('setTransition', (_s, duration) => {
			const thumbsSwiper = swiper.thumbs.swiper;
			if (!thumbsSwiper || thumbsSwiper.destroyed) return;
			thumbsSwiper.setTransition(duration);
		});
		on('beforeDestroy', () => {
			const thumbsSwiper = swiper.thumbs.swiper;
			if (!thumbsSwiper || thumbsSwiper.destroyed) return;

			if (swiperCreated) {
				thumbsSwiper.destroy();
			}
		});
		Object.assign(swiper.thumbs, {
			init,
			update
		});
	}

	function freeMode(_ref) {
		let {
			swiper,
			extendParams,
			emit,
			once
		} = _ref;
		extendParams({
			freeMode: {
				enabled: false,
				momentum: true,
				momentumRatio: 1,
				momentumBounce: true,
				momentumBounceRatio: 1,
				momentumVelocityRatio: 1,
				sticky: false,
				minimumVelocity: 0.02
			}
		});

		function onTouchStart() {
			const translate = swiper.getTranslate();
			swiper.setTranslate(translate);
			swiper.setTransition(0);
			swiper.touchEventsData.velocities.length = 0;
			swiper.freeMode.onTouchEnd({
				currentPos: swiper.rtl ? swiper.translate : -swiper.translate
			});
		}

		function onTouchMove() {
			const {
				touchEventsData: data,
				touches
			} = swiper; // Velocity

			if (data.velocities.length === 0) {
				data.velocities.push({
					position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
					time: data.touchStartTime
				});
			}

			data.velocities.push({
				position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
				time: now()
			});
		}

		function onTouchEnd(_ref2) {
			let {
				currentPos
			} = _ref2;
			const {
				params,
				$wrapperEl,
				rtlTranslate: rtl,
				snapGrid,
				touchEventsData: data
			} = swiper; // Time diff

			const touchEndTime = now();
			const timeDiff = touchEndTime - data.touchStartTime;

			if (currentPos < -swiper.minTranslate()) {
				swiper.slideTo(swiper.activeIndex);
				return;
			}

			if (currentPos > -swiper.maxTranslate()) {
				if (swiper.slides.length < snapGrid.length) {
					swiper.slideTo(snapGrid.length - 1);
				} else {
					swiper.slideTo(swiper.slides.length - 1);
				}

				return;
			}

			if (params.freeMode.momentum) {
				if (data.velocities.length > 1) {
					const lastMoveEvent = data.velocities.pop();
					const velocityEvent = data.velocities.pop();
					const distance = lastMoveEvent.position - velocityEvent.position;
					const time = lastMoveEvent.time - velocityEvent.time;
					swiper.velocity = distance / time;
					swiper.velocity /= 2;

					if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
						swiper.velocity = 0;
					} // this implies that the user stopped moving a finger then released.
					// There would be no events with distance zero, so the last event is stale.


					if (time > 150 || now() - lastMoveEvent.time > 300) {
						swiper.velocity = 0;
					}
				} else {
					swiper.velocity = 0;
				}

				swiper.velocity *= params.freeMode.momentumVelocityRatio;
				data.velocities.length = 0;
				let momentumDuration = 1000 * params.freeMode.momentumRatio;
				const momentumDistance = swiper.velocity * momentumDuration;
				let newPosition = swiper.translate + momentumDistance;
				if (rtl) newPosition = -newPosition;
				let doBounce = false;
				let afterBouncePosition;
				const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
				let needsLoopFix;

				if (newPosition < swiper.maxTranslate()) {
					if (params.freeMode.momentumBounce) {
						if (newPosition + swiper.maxTranslate() < -bounceAmount) {
							newPosition = swiper.maxTranslate() - bounceAmount;
						}

						afterBouncePosition = swiper.maxTranslate();
						doBounce = true;
						data.allowMomentumBounce = true;
					} else {
						newPosition = swiper.maxTranslate();
					}

					if (params.loop && params.centeredSlides) needsLoopFix = true;
				} else if (newPosition > swiper.minTranslate()) {
					if (params.freeMode.momentumBounce) {
						if (newPosition - swiper.minTranslate() > bounceAmount) {
							newPosition = swiper.minTranslate() + bounceAmount;
						}

						afterBouncePosition = swiper.minTranslate();
						doBounce = true;
						data.allowMomentumBounce = true;
					} else {
						newPosition = swiper.minTranslate();
					}

					if (params.loop && params.centeredSlides) needsLoopFix = true;
				} else if (params.freeMode.sticky) {
					let nextSlide;

					for (let j = 0; j < snapGrid.length; j += 1) {
						if (snapGrid[j] > -newPosition) {
							nextSlide = j;
							break;
						}
					}

					if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
						newPosition = snapGrid[nextSlide];
					} else {
						newPosition = snapGrid[nextSlide - 1];
					}

					newPosition = -newPosition;
				}

				if (needsLoopFix) {
					once('transitionEnd', () => {
						swiper.loopFix();
					});
				} // Fix duration


				if (swiper.velocity !== 0) {
					if (rtl) {
						momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
					} else {
						momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
					}

					if (params.freeMode.sticky) {
						// If freeMode.sticky is active and the user ends a swipe with a slow-velocity
						// event, then durations can be 20+ seconds to slide one (or zero!) slides.
						// It's easy to see this when simulating touch with mouse events. To fix this,
						// limit single-slide swipes to the default slide duration. This also has the
						// nice side effect of matching slide speed if the user stopped moving before
						// lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
						// For faster swipes, also apply limits (albeit higher ones).
						const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
						const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

						if (moveDistance < currentSlideSize) {
							momentumDuration = params.speed;
						} else if (moveDistance < 2 * currentSlideSize) {
							momentumDuration = params.speed * 1.5;
						} else {
							momentumDuration = params.speed * 2.5;
						}
					}
				} else if (params.freeMode.sticky) {
					swiper.slideToClosest();
					return;
				}

				if (params.freeMode.momentumBounce && doBounce) {
					swiper.updateProgress(afterBouncePosition);
					swiper.setTransition(momentumDuration);
					swiper.setTranslate(newPosition);
					swiper.transitionStart(true, swiper.swipeDirection);
					swiper.animating = true;
					$wrapperEl.transitionEnd(() => {
						if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
						emit('momentumBounce');
						swiper.setTransition(params.speed);
						setTimeout(() => {
							swiper.setTranslate(afterBouncePosition);
							$wrapperEl.transitionEnd(() => {
								if (!swiper || swiper.destroyed) return;
								swiper.transitionEnd();
							});
						}, 0);
					});
				} else if (swiper.velocity) {
					emit('_freeModeNoMomentumRelease');
					swiper.updateProgress(newPosition);
					swiper.setTransition(momentumDuration);
					swiper.setTranslate(newPosition);
					swiper.transitionStart(true, swiper.swipeDirection);

					if (!swiper.animating) {
						swiper.animating = true;
						$wrapperEl.transitionEnd(() => {
							if (!swiper || swiper.destroyed) return;
							swiper.transitionEnd();
						});
					}
				} else {
					swiper.updateProgress(newPosition);
				}

				swiper.updateActiveIndex();
				swiper.updateSlidesClasses();
			} else if (params.freeMode.sticky) {
				swiper.slideToClosest();
				return;
			} else if (params.freeMode) {
				emit('_freeModeNoMomentumRelease');
			}

			if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
				swiper.updateProgress();
				swiper.updateActiveIndex();
				swiper.updateSlidesClasses();
			}
		}

		Object.assign(swiper, {
			freeMode: {
				onTouchStart,
				onTouchMove,
				onTouchEnd
			}
		});
	}

	function Grid(_ref) {
		let {
			swiper,
			extendParams
		} = _ref;
		extendParams({
			grid: {
				rows: 1,
				fill: 'column'
			}
		});
		let slidesNumberEvenToRows;
		let slidesPerRow;
		let numFullColumns;

		const initSlides = slidesLength => {
			const {
				slidesPerView
			} = swiper.params;
			const {
				rows,
				fill
			} = swiper.params.grid;
			slidesPerRow = slidesNumberEvenToRows / rows;
			numFullColumns = Math.floor(slidesLength / rows);

			if (Math.floor(slidesLength / rows) === slidesLength / rows) {
				slidesNumberEvenToRows = slidesLength;
			} else {
				slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
			}

			if (slidesPerView !== 'auto' && fill === 'row') {
				slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
			}
		};

		const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
			const {
				slidesPerGroup,
				spaceBetween
			} = swiper.params;
			const {
				rows,
				fill
			} = swiper.params.grid; // Set slides order

			let newSlideOrderIndex;
			let column;
			let row;

			if (fill === 'row' && slidesPerGroup > 1) {
				const groupIndex = Math.floor(i / (slidesPerGroup * rows));
				const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
				const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
				row = Math.floor(slideIndexInGroup / columnsInGroup);
				column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
				newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
				slide.css({
					'-webkit-order': newSlideOrderIndex,
					order: newSlideOrderIndex
				});
			} else if (fill === 'column') {
				column = Math.floor(i / rows);
				row = i - column * rows;

				if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
					row += 1;

					if (row >= rows) {
						row = 0;
						column += 1;
					}
				}
			} else {
				row = Math.floor(i / slidesPerRow);
				column = i - row * slidesPerRow;
			}

			slide.css(getDirectionLabel('margin-top'), row !== 0 ? spaceBetween && `${spaceBetween}px` : '');
		};

		const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
			const {
				spaceBetween,
				centeredSlides,
				roundLengths
			} = swiper.params;
			const {
				rows
			} = swiper.params.grid;
			swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
			swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
			swiper.$wrapperEl.css({
				[getDirectionLabel('width')]: `${swiper.virtualSize + spaceBetween}px`
			});

			if (centeredSlides) {
				snapGrid.splice(0, snapGrid.length);
				const newSlidesGrid = [];

				for (let i = 0; i < snapGrid.length; i += 1) {
					let slidesGridItem = snapGrid[i];
					if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
					if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
				}

				snapGrid.push(...newSlidesGrid);
			}
		};

		swiper.grid = {
			initSlides,
			updateSlide,
			updateWrapperSize
		};
	}

	function appendSlide(slides) {
		const swiper = this;
		const {
			$wrapperEl,
			params
		} = swiper;

		if (params.loop) {
			swiper.loopDestroy();
		}

		if (typeof slides === 'object' && 'length' in slides) {
			for (let i = 0; i < slides.length; i += 1) {
				if (slides[i]) $wrapperEl.append(slides[i]);
			}
		} else {
			$wrapperEl.append(slides);
		}

		if (params.loop) {
			swiper.loopCreate();
		}

		if (!params.observer) {
			swiper.update();
		}
	}

	function prependSlide(slides) {
		const swiper = this;
		const {
			params,
			$wrapperEl,
			activeIndex
		} = swiper;

		if (params.loop) {
			swiper.loopDestroy();
		}

		let newActiveIndex = activeIndex + 1;

		if (typeof slides === 'object' && 'length' in slides) {
			for (let i = 0; i < slides.length; i += 1) {
				if (slides[i]) $wrapperEl.prepend(slides[i]);
			}

			newActiveIndex = activeIndex + slides.length;
		} else {
			$wrapperEl.prepend(slides);
		}

		if (params.loop) {
			swiper.loopCreate();
		}

		if (!params.observer) {
			swiper.update();
		}

		swiper.slideTo(newActiveIndex, 0, false);
	}

	function addSlide(index, slides) {
		const swiper = this;
		const {
			$wrapperEl,
			params,
			activeIndex
		} = swiper;
		let activeIndexBuffer = activeIndex;

		if (params.loop) {
			activeIndexBuffer -= swiper.loopedSlides;
			swiper.loopDestroy();
			swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
		}

		const baseLength = swiper.slides.length;

		if (index <= 0) {
			swiper.prependSlide(slides);
			return;
		}

		if (index >= baseLength) {
			swiper.appendSlide(slides);
			return;
		}

		let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
		const slidesBuffer = [];

		for (let i = baseLength - 1; i >= index; i -= 1) {
			const currentSlide = swiper.slides.eq(i);
			currentSlide.remove();
			slidesBuffer.unshift(currentSlide);
		}

		if (typeof slides === 'object' && 'length' in slides) {
			for (let i = 0; i < slides.length; i += 1) {
				if (slides[i]) $wrapperEl.append(slides[i]);
			}

			newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
		} else {
			$wrapperEl.append(slides);
		}

		for (let i = 0; i < slidesBuffer.length; i += 1) {
			$wrapperEl.append(slidesBuffer[i]);
		}

		if (params.loop) {
			swiper.loopCreate();
		}

		if (!params.observer) {
			swiper.update();
		}

		if (params.loop) {
			swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
		} else {
			swiper.slideTo(newActiveIndex, 0, false);
		}
	}

	function removeSlide(slidesIndexes) {
		const swiper = this;
		const {
			params,
			$wrapperEl,
			activeIndex
		} = swiper;
		let activeIndexBuffer = activeIndex;

		if (params.loop) {
			activeIndexBuffer -= swiper.loopedSlides;
			swiper.loopDestroy();
			swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
		}

		let newActiveIndex = activeIndexBuffer;
		let indexToRemove;

		if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
			for (let i = 0; i < slidesIndexes.length; i += 1) {
				indexToRemove = slidesIndexes[i];
				if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
				if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
			}

			newActiveIndex = Math.max(newActiveIndex, 0);
		} else {
			indexToRemove = slidesIndexes;
			if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
			if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
			newActiveIndex = Math.max(newActiveIndex, 0);
		}

		if (params.loop) {
			swiper.loopCreate();
		}

		if (!params.observer) {
			swiper.update();
		}

		if (params.loop) {
			swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
		} else {
			swiper.slideTo(newActiveIndex, 0, false);
		}
	}

	function removeAllSlides() {
		const swiper = this;
		const slidesIndexes = [];

		for (let i = 0; i < swiper.slides.length; i += 1) {
			slidesIndexes.push(i);
		}

		swiper.removeSlide(slidesIndexes);
	}

	function Manipulation(_ref) {
		let {
			swiper
		} = _ref;
		Object.assign(swiper, {
			appendSlide: appendSlide.bind(swiper),
			prependSlide: prependSlide.bind(swiper),
			addSlide: addSlide.bind(swiper),
			removeSlide: removeSlide.bind(swiper),
			removeAllSlides: removeAllSlides.bind(swiper)
		});
	}

	function effectInit(params) {
		const {
			effect,
			swiper,
			on,
			setTranslate,
			setTransition,
			overwriteParams,
			perspective,
			recreateShadows,
			getEffectParams
		} = params;
		on('beforeInit', () => {
			if (swiper.params.effect !== effect) return;
			swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);

			if (perspective && perspective()) {
				swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
			}

			const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
			Object.assign(swiper.params, overwriteParamsResult);
			Object.assign(swiper.originalParams, overwriteParamsResult);
		});
		on('setTranslate', () => {
			if (swiper.params.effect !== effect) return;
			setTranslate();
		});
		on('setTransition', (_s, duration) => {
			if (swiper.params.effect !== effect) return;
			setTransition(duration);
		});
		on('transitionEnd', () => {
			if (swiper.params.effect !== effect) return;

			if (recreateShadows) {
				if (!getEffectParams || !getEffectParams().slideShadows) return; // remove shadows

				swiper.slides.each(slideEl => {
					const $slideEl = swiper.$(slideEl);
					$slideEl.find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').remove();
				}); // create new one

				recreateShadows();
			}
		});
		let requireUpdateOnVirtual;
		on('virtualUpdate', () => {
			if (swiper.params.effect !== effect) return;

			if (!swiper.slides.length) {
				requireUpdateOnVirtual = true;
			}

			requestAnimationFrame(() => {
				if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
					setTranslate();
					requireUpdateOnVirtual = false;
				}
			});
		});
	}

	function effectTarget(effectParams, $slideEl) {
		if (effectParams.transformEl) {
			return $slideEl.find(effectParams.transformEl).css({
				'backface-visibility': 'hidden',
				'-webkit-backface-visibility': 'hidden'
			});
		}

		return $slideEl;
	}

	function effectVirtualTransitionEnd(_ref) {
		let {
			swiper,
			duration,
			transformEl,
			allSlides
		} = _ref;
		const {
			slides,
			activeIndex,
			$wrapperEl
		} = swiper;

		if (swiper.params.virtualTranslate && duration !== 0) {
			let eventTriggered = false;
			let $transitionEndTarget;

			if (allSlides) {
				$transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
			} else {
				$transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
			}

			$transitionEndTarget.transitionEnd(() => {
				if (eventTriggered) return;
				if (!swiper || swiper.destroyed) return;
				eventTriggered = true;
				swiper.animating = false;
				const triggerEvents = ['webkitTransitionEnd', 'transitionend'];

				for (let i = 0; i < triggerEvents.length; i += 1) {
					$wrapperEl.trigger(triggerEvents[i]);
				}
			});
		}
	}

	function EffectFade(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			fadeEffect: {
				crossFade: false,
				transformEl: null
			}
		});

		const setTranslate = () => {
			const {
				slides
			} = swiper;
			const params = swiper.params.fadeEffect;

			for (let i = 0; i < slides.length; i += 1) {
				const $slideEl = swiper.slides.eq(i);
				const offset = $slideEl[0].swiperSlideOffset;
				let tx = -offset;
				if (!swiper.params.virtualTranslate) tx -= swiper.translate;
				let ty = 0;

				if (!swiper.isHorizontal()) {
					ty = tx;
					tx = 0;
				}

				const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
				const $targetEl = effectTarget(params, $slideEl);
				$targetEl.css({
					opacity: slideOpacity
				}).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
			}
		};

		const setTransition = duration => {
			const {
				transformEl
			} = swiper.params.fadeEffect;
			const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
			$transitionElements.transition(duration);
			effectVirtualTransitionEnd({
				swiper,
				duration,
				transformEl,
				allSlides: true
			});
		};

		effectInit({
			effect: 'fade',
			swiper,
			on,
			setTranslate,
			setTransition,
			overwriteParams: () => ({
				slidesPerView: 1,
				slidesPerGroup: 1,
				watchSlidesProgress: true,
				spaceBetween: 0,
				virtualTranslate: !swiper.params.cssMode
			})
		});
	}

	function EffectCube(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			cubeEffect: {
				slideShadows: true,
				shadow: true,
				shadowOffset: 20,
				shadowScale: 0.94
			}
		});

		const createSlideShadows = ($slideEl, progress, isHorizontal) => {
			let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
			let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

			if (shadowBefore.length === 0) {
				shadowBefore = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
				$slideEl.append(shadowBefore);
			}

			if (shadowAfter.length === 0) {
				shadowAfter = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
				$slideEl.append(shadowAfter);
			}

			if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
			if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
		};

		const recreateShadows = () => {
			// create new ones
			const isHorizontal = swiper.isHorizontal();
			swiper.slides.each(slideEl => {
				const progress = Math.max(Math.min(slideEl.progress, 1), -1);
				createSlideShadows($(slideEl), progress, isHorizontal);
			});
		};

		const setTranslate = () => {
			const {
				$el,
				$wrapperEl,
				slides,
				width: swiperWidth,
				height: swiperHeight,
				rtlTranslate: rtl,
				size: swiperSize,
				browser
			} = swiper;
			const params = swiper.params.cubeEffect;
			const isHorizontal = swiper.isHorizontal();
			const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
			let wrapperRotate = 0;
			let $cubeShadowEl;

			if (params.shadow) {
				if (isHorizontal) {
					$cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

					if ($cubeShadowEl.length === 0) {
						$cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
						$wrapperEl.append($cubeShadowEl);
					}

					$cubeShadowEl.css({
						height: `${swiperWidth}px`
					});
				} else {
					$cubeShadowEl = $el.find('.swiper-cube-shadow');

					if ($cubeShadowEl.length === 0) {
						$cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
						$el.append($cubeShadowEl);
					}
				}
			}

			for (let i = 0; i < slides.length; i += 1) {
				const $slideEl = slides.eq(i);
				let slideIndex = i;

				if (isVirtual) {
					slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
				}

				let slideAngle = slideIndex * 90;
				let round = Math.floor(slideAngle / 360);

				if (rtl) {
					slideAngle = -slideAngle;
					round = Math.floor(-slideAngle / 360);
				}

				const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
				let tx = 0;
				let ty = 0;
				let tz = 0;

				if (slideIndex % 4 === 0) {
					tx = -round * 4 * swiperSize;
					tz = 0;
				} else if ((slideIndex - 1) % 4 === 0) {
					tx = 0;
					tz = -round * 4 * swiperSize;
				} else if ((slideIndex - 2) % 4 === 0) {
					tx = swiperSize + round * 4 * swiperSize;
					tz = swiperSize;
				} else if ((slideIndex - 3) % 4 === 0) {
					tx = -swiperSize;
					tz = 3 * swiperSize + swiperSize * 4 * round;
				}

				if (rtl) {
					tx = -tx;
				}

				if (!isHorizontal) {
					ty = tx;
					tx = 0;
				}

				const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

				if (progress <= 1 && progress > -1) {
					wrapperRotate = slideIndex * 90 + progress * 90;
					if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
				}

				$slideEl.transform(transform);

				if (params.slideShadows) {
					createSlideShadows($slideEl, progress, isHorizontal);
				}
			}

			$wrapperEl.css({
				'-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
				'transform-origin': `50% 50% -${swiperSize / 2}px`
			});

			if (params.shadow) {
				if (isHorizontal) {
					$cubeShadowEl.transform(`translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
				} else {
					const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
					const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
					const scale1 = params.shadowScale;
					const scale2 = params.shadowScale / multiplier;
					const offset = params.shadowOffset;
					$cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
				}
			}

			const zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
			$wrapperEl.transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
			$wrapperEl[0].style.setProperty('--swiper-cube-translate-z', `${zFactor}px`);
		};

		const setTransition = duration => {
			const {
				$el,
				slides
			} = swiper;
			slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

			if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
				$el.find('.swiper-cube-shadow').transition(duration);
			}
		};

		effectInit({
			effect: 'cube',
			swiper,
			on,
			setTranslate,
			setTransition,
			recreateShadows,
			getEffectParams: () => swiper.params.cubeEffect,
			perspective: () => true,
			overwriteParams: () => ({
				slidesPerView: 1,
				slidesPerGroup: 1,
				watchSlidesProgress: true,
				resistanceRatio: 0,
				spaceBetween: 0,
				centeredSlides: false,
				virtualTranslate: true
			})
		});
	}

	function createShadow(params, $slideEl, side) {
		const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}`;
		const $shadowContainer = params.transformEl ? $slideEl.find(params.transformEl) : $slideEl;
		let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

		if (!$shadowEl.length) {
			$shadowEl = $(`<div class="swiper-slide-shadow${side ? `-${side}` : ''}"></div>`);
			$shadowContainer.append($shadowEl);
		}

		return $shadowEl;
	}

	function EffectFlip(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			flipEffect: {
				slideShadows: true,
				limitRotation: true,
				transformEl: null
			}
		});

		const createSlideShadows = ($slideEl, progress, params) => {
			let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
			let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

			if (shadowBefore.length === 0) {
				shadowBefore = createShadow(params, $slideEl, swiper.isHorizontal() ? 'left' : 'top');
			}

			if (shadowAfter.length === 0) {
				shadowAfter = createShadow(params, $slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
			}

			if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
			if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
		};

		const recreateShadows = () => {
			// Set shadows
			const params = swiper.params.flipEffect;
			swiper.slides.each(slideEl => {
				const $slideEl = $(slideEl);
				let progress = $slideEl[0].progress;

				if (swiper.params.flipEffect.limitRotation) {
					progress = Math.max(Math.min(slideEl.progress, 1), -1);
				}

				createSlideShadows($slideEl, progress, params);
			});
		};

		const setTranslate = () => {
			const {
				slides,
				rtlTranslate: rtl
			} = swiper;
			const params = swiper.params.flipEffect;

			for (let i = 0; i < slides.length; i += 1) {
				const $slideEl = slides.eq(i);
				let progress = $slideEl[0].progress;

				if (swiper.params.flipEffect.limitRotation) {
					progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
				}

				const offset = $slideEl[0].swiperSlideOffset;
				const rotate = -180 * progress;
				let rotateY = rotate;
				let rotateX = 0;
				let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
				let ty = 0;

				if (!swiper.isHorizontal()) {
					ty = tx;
					tx = 0;
					rotateX = -rotateY;
					rotateY = 0;
				} else if (rtl) {
					rotateY = -rotateY;
				}

				$slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

				if (params.slideShadows) {
					createSlideShadows($slideEl, progress, params);
				}

				const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
				const $targetEl = effectTarget(params, $slideEl);
				$targetEl.transform(transform);
			}
		};

		const setTransition = duration => {
			const {
				transformEl
			} = swiper.params.flipEffect;
			const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
			$transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
			effectVirtualTransitionEnd({
				swiper,
				duration,
				transformEl
			});
		};

		effectInit({
			effect: 'flip',
			swiper,
			on,
			setTranslate,
			setTransition,
			recreateShadows,
			getEffectParams: () => swiper.params.flipEffect,
			perspective: () => true,
			overwriteParams: () => ({
				slidesPerView: 1,
				slidesPerGroup: 1,
				watchSlidesProgress: true,
				spaceBetween: 0,
				virtualTranslate: !swiper.params.cssMode
			})
		});
	}

	function EffectCoverflow(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			coverflowEffect: {
				rotate: 50,
				stretch: 0,
				depth: 100,
				scale: 1,
				modifier: 1,
				slideShadows: true,
				transformEl: null
			}
		});

		const setTranslate = () => {
			const {
				width: swiperWidth,
				height: swiperHeight,
				slides,
				slidesSizesGrid
			} = swiper;
			const params = swiper.params.coverflowEffect;
			const isHorizontal = swiper.isHorizontal();
			const transform = swiper.translate;
			const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
			const rotate = isHorizontal ? params.rotate : -params.rotate;
			const translate = params.depth; // Each slide offset from center

			for (let i = 0, length = slides.length; i < length; i += 1) {
				const $slideEl = slides.eq(i);
				const slideSize = slidesSizesGrid[i];
				const slideOffset = $slideEl[0].swiperSlideOffset;
				const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
				const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
				let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
				let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

				let translateZ = -translate * Math.abs(offsetMultiplier);
				let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

				if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
					stretch = parseFloat(params.stretch) / 100 * slideSize;
				}

				let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
				let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
				let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

				if (Math.abs(translateX) < 0.001) translateX = 0;
				if (Math.abs(translateY) < 0.001) translateY = 0;
				if (Math.abs(translateZ) < 0.001) translateZ = 0;
				if (Math.abs(rotateY) < 0.001) rotateY = 0;
				if (Math.abs(rotateX) < 0.001) rotateX = 0;
				if (Math.abs(scale) < 0.001) scale = 0;
				const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
				const $targetEl = effectTarget(params, $slideEl);
				$targetEl.transform(slideTransform);
				$slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

				if (params.slideShadows) {
					// Set shadows
					let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
					let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

					if ($shadowBeforeEl.length === 0) {
						$shadowBeforeEl = createShadow(params, $slideEl, isHorizontal ? 'left' : 'top');
					}

					if ($shadowAfterEl.length === 0) {
						$shadowAfterEl = createShadow(params, $slideEl, isHorizontal ? 'right' : 'bottom');
					}

					if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
					if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
				}
			}
		};

		const setTransition = duration => {
			const {
				transformEl
			} = swiper.params.coverflowEffect;
			const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
			$transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
		};

		effectInit({
			effect: 'coverflow',
			swiper,
			on,
			setTranslate,
			setTransition,
			perspective: () => true,
			overwriteParams: () => ({
				watchSlidesProgress: true
			})
		});
	}

	function EffectCreative(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			creativeEffect: {
				transformEl: null,
				limitProgress: 1,
				shadowPerProgress: false,
				progressMultiplier: 1,
				perspective: true,
				prev: {
					translate: [0, 0, 0],
					rotate: [0, 0, 0],
					opacity: 1,
					scale: 1
				},
				next: {
					translate: [0, 0, 0],
					rotate: [0, 0, 0],
					opacity: 1,
					scale: 1
				}
			}
		});

		const getTranslateValue = value => {
			if (typeof value === 'string') return value;
			return `${value}px`;
		};

		const setTranslate = () => {
			const {
				slides,
				$wrapperEl,
				slidesSizesGrid
			} = swiper;
			const params = swiper.params.creativeEffect;
			const {
				progressMultiplier: multiplier
			} = params;
			const isCenteredSlides = swiper.params.centeredSlides;

			if (isCenteredSlides) {
				const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
				$wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
			}

			for (let i = 0; i < slides.length; i += 1) {
				const $slideEl = slides.eq(i);
				const slideProgress = $slideEl[0].progress;
				const progress = Math.min(Math.max($slideEl[0].progress, -params.limitProgress), params.limitProgress);
				let originalProgress = progress;

				if (!isCenteredSlides) {
					originalProgress = Math.min(Math.max($slideEl[0].originalProgress, -params.limitProgress), params.limitProgress);
				}

				const offset = $slideEl[0].swiperSlideOffset;
				const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
				const r = [0, 0, 0];
				let custom = false;

				if (!swiper.isHorizontal()) {
					t[1] = t[0];
					t[0] = 0;
				}

				let data = {
					translate: [0, 0, 0],
					rotate: [0, 0, 0],
					scale: 1,
					opacity: 1
				};

				if (progress < 0) {
					data = params.next;
					custom = true;
				} else if (progress > 0) {
					data = params.prev;
					custom = true;
				} // set translate


				t.forEach((value, index) => {
					t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
				}); // set rotates

				r.forEach((value, index) => {
					r[index] = data.rotate[index] * Math.abs(progress * multiplier);
				});
				$slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
				const translateString = t.join(', ');
				const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
				const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
				const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
				const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

				if (custom && data.shadow || !custom) {
					let $shadowEl = $slideEl.children('.swiper-slide-shadow');

					if ($shadowEl.length === 0 && data.shadow) {
						$shadowEl = createShadow(params, $slideEl);
					}

					if ($shadowEl.length) {
						const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
						$shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
					}
				}

				const $targetEl = effectTarget(params, $slideEl);
				$targetEl.transform(transform).css({
					opacity: opacityString
				});

				if (data.origin) {
					$targetEl.css('transform-origin', data.origin);
				}
			}
		};

		const setTransition = duration => {
			const {
				transformEl
			} = swiper.params.creativeEffect;
			const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
			$transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
			effectVirtualTransitionEnd({
				swiper,
				duration,
				transformEl,
				allSlides: true
			});
		};

		effectInit({
			effect: 'creative',
			swiper,
			on,
			setTranslate,
			setTransition,
			perspective: () => swiper.params.creativeEffect.perspective,
			overwriteParams: () => ({
				watchSlidesProgress: true,
				virtualTranslate: !swiper.params.cssMode
			})
		});
	}

	function EffectCards(_ref) {
		let {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams({
			cardsEffect: {
				slideShadows: true,
				transformEl: null,
				rotate: true
			}
		});

		const setTranslate = () => {
			const {
				slides,
				activeIndex
			} = swiper;
			const params = swiper.params.cardsEffect;
			const {
				startTranslate,
				isTouched
			} = swiper.touchEventsData;
			const currentTranslate = swiper.translate;

			for (let i = 0; i < slides.length; i += 1) {
				const $slideEl = slides.eq(i);
				const slideProgress = $slideEl[0].progress;
				const progress = Math.min(Math.max(slideProgress, -4), 4);
				let offset = $slideEl[0].swiperSlideOffset;

				if (swiper.params.centeredSlides && !swiper.params.cssMode) {
					swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
				}

				if (swiper.params.centeredSlides && swiper.params.cssMode) {
					offset -= slides[0].swiperSlideOffset;
				}

				let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
				let tY = 0;
				const tZ = -100 * Math.abs(progress);
				let scale = 1;
				let rotate = -2 * progress;
				let tXAdd = 8 - Math.abs(progress) * 0.75;
				const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
				const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
				const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;

				if (isSwipeToNext || isSwipeToPrev) {
					const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
					rotate += -28 * progress * subProgress;
					scale += -0.5 * subProgress;
					tXAdd += 96 * subProgress;
					tY = `${-25 * subProgress * Math.abs(progress)}%`;
				}

				if (progress < 0) {
					// next
					tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
				} else if (progress > 0) {
					// prev
					tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
				} else {
					tX = `${tX}px`;
				}

				if (!swiper.isHorizontal()) {
					const prevY = tY;
					tY = tX;
					tX = prevY;
				}

				const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
				const transform = `
			translate3d(${tX}, ${tY}, ${tZ}px)
			rotateZ(${params.rotate ? rotate : 0}deg)
			scale(${scaleString})
		`;

				if (params.slideShadows) {
					// Set shadows
					let $shadowEl = $slideEl.find('.swiper-slide-shadow');

					if ($shadowEl.length === 0) {
						$shadowEl = createShadow(params, $slideEl);
					}

					if ($shadowEl.length) $shadowEl[0].style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
				}

				$slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
				const $targetEl = effectTarget(params, $slideEl);
				$targetEl.transform(transform);
			}
		};

		const setTransition = duration => {
			const {
				transformEl
			} = swiper.params.cardsEffect;
			const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
			$transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
			effectVirtualTransitionEnd({
				swiper,
				duration,
				transformEl
			});
		};

		effectInit({
			effect: 'cards',
			swiper,
			on,
			setTranslate,
			setTransition,
			perspective: () => true,
			overwriteParams: () => ({
				watchSlidesProgress: true,
				virtualTranslate: !swiper.params.cssMode
			})
		});
	}

	// Swiper Class
	const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Lazy, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
	Swiper.use(modules);

	return Swiper;

}));
//# sourceMappingURL=swiper-bundle.js.map



(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.scrollama = factory());
}(this, (function () { 'use strict';

  // DOM helper functions

  // public
  function selectAll(selector, parent = document) {
    if (typeof selector === 'string') {
      return Array.from(parent.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      return [selector];
    } else if (selector instanceof NodeList) {
      return Array.from(selector);
    } else if (selector instanceof Array) {
      return selector;
    }
    return [];
  }

  // SETUP
  function create(className) {
  	const el = document.createElement("div");
  	el.className = `scrollama__debug-step ${className}`;
  	el.style.position = "fixed";
  	el.style.left = "0";
  	el.style.width = "100%";
  	el.style.zIndex = "9999";
  	el.style.borderTop = "2px solid black";
  	el.style.borderBottom = "2px solid black";

  	const p = document.createElement("p");
  	p.style.position = "absolute";
  	p.style.left = "0";
  	p.style.height = "1px";
  	p.style.width = "100%";
  	p.style.borderTop = "1px dashed black";

  	el.appendChild(p);
  	document.body.appendChild(el);
  	return el;
  }

  // UPDATE
  function update({ id, step, marginTop }) {
  	const { index, height } = step;
  	const className = `scrollama__debug-step--${id}-${index}`;
  	let el = document.querySelector(`.${className}`);
  	if (!el) el = create(className);

  	el.style.top = `${marginTop * -1}px`;
  	el.style.height = `${height}px`;
  	el.querySelector("p").style.top = `${height / 2}px`;
  }

  function generateId() {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const date = Date.now();
      const result = [];
      for (let i = 0; i < 6; i += 1) {
        const char = alphabet[Math.floor(Math.random() * alphabet.length)];
        result.push(char);
      }
      return `${result.join("")}${date}`;
    }

  function err$1(msg) {
  	console.error(`scrollama error: ${msg}`);
  }

  function getIndex(node) {
  	return +node.getAttribute("data-scrollama-index");
  }

  function createProgressThreshold(height, threshold) {
      const count = Math.ceil(height / threshold);
      const t = [];
      const ratio = 1 / count;
      for (let i = 0; i < count + 1; i += 1) {
        t.push(i * ratio);
      }
      return t;
    }

  function parseOffset(x) {
  	if (typeof x === "string" && x.indexOf("px") > 0) {
  		const v = +x.replace("px", "");
  		if (!isNaN(v)) return { format: "pixels", value: v };
  		else {
  			err("offset value must be in 'px' format. Fallback to 0.5.");
  			return { format: "percent", value: 0.5 };
  		}
  	} else if (typeof x === "number" || !isNaN(+x)) {
  		if (x > 1) err("offset value is greater than 1. Fallback to 1.");
  		if (x < 0) err("offset value is lower than 0. Fallback to 0.");
  		return { format: "percent", value: Math.min(Math.max(0, x), 1) };
  	}
  	return null;
  }

  function indexSteps(steps) {
  	steps.forEach((step) =>
  		step.node.setAttribute("data-scrollama-index", step.index)
  	);
  }

  function getOffsetTop(node) {
    const { top } = node.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const clientTop = document.body.clientTop || 0;
    return top + scrollTop - clientTop;
  }

  let currentScrollY;
  let comparisonScrollY;
  let direction;

  function onScroll(container) {
  	const scrollTop = container ? container.scrollTop : window.pageYOffset;

  	if (currentScrollY === scrollTop) return;
  	currentScrollY = scrollTop;
  	if (currentScrollY > comparisonScrollY) direction = "down";
  	else if (currentScrollY < comparisonScrollY) direction = "up";
  	comparisonScrollY = currentScrollY;
  }

  function setupScroll(container) {
  	currentScrollY = 0;
  	comparisonScrollY = 0;
  	document.addEventListener("scroll", () => onScroll(container));
  }

  function scrollama() {
  	let cb = {};

  	let id = generateId();
  	let steps = [];
  	let globalOffset;
  	let containerElement;

  	let progressThreshold = 0;

  	let isEnabled = false;
  	let isProgress = false;
  	let isDebug = false;
  	let isTriggerOnce = false;

  	let exclude = [];

  	/* HELPERS */
  	function reset() {
  		cb = {
  			stepEnter: () => { },
  			stepExit: () => { },
  			stepProgress: () => { },
  		};
  		exclude = [];
  	}

  	function handleEnable(shouldEnable) {
  		if (shouldEnable && !isEnabled) updateObservers();
  		if (!shouldEnable && isEnabled) disconnectObservers();
  		isEnabled = shouldEnable;
  	}

  	/* NOTIFY CALLBACKS */
  	function notifyProgress(element, progress) {
  		const index = getIndex(element);
  		const step = steps[index];
  		if (progress !== undefined) step.progress = progress;
  		const response = { element, index, progress, direction };
  		if (step.state === "enter") cb.stepProgress(response);
  	}

  	function notifyStepEnter(element, check = true) {
  		const index = getIndex(element);
  		const step = steps[index];
  		const response = { element, index, direction };

  		step.direction = direction;
  		step.state = "enter";

  		// if (isPreserveOrder && check && direction !== "up")
  		//   notifyOthers(index, "above");
  		// if (isPreserveOrder && check && direction === "up")
  		//   notifyOthers(index, "below");

  		if (!exclude[index]) cb.stepEnter(response);
  		if (isTriggerOnce) exclude[index] = true;
  	}

  	function notifyStepExit(element, check = true) {
  		const index = getIndex(element);
  		const step = steps[index];

  		if (!step.state) return false;

  		const response = { element, index, direction };

  		if (isProgress) {
  			if (direction === "down" && step.progress < 1) notifyProgress(element, 1);
  			else if (direction === "up" && step.progress > 0)
  				notifyProgress(element, 0);
  		}

  		step.direction = direction;
  		step.state = "exit";

  		cb.stepExit(response);
  	}

  	/* OBSERVERS - HANDLING */
  	function resizeStep([entry]) {
  		const index = getIndex(entry.target);
  		const step = steps[index];
  		const h = entry.target.offsetHeight;
  		if (h !== step.height) {
  			step.height = h;
  			disconnectObserver(step);
  			updateStepObserver(step);
  			updateResizeObserver(step);
  		}
  	}

  	function intersectStep([entry]) {
  		onScroll(containerElement);

  		const { isIntersecting, target } = entry;
  		if (isIntersecting) notifyStepEnter(target);
  		else notifyStepExit(target);
  	}

  	function intersectProgress([entry]) {
  		const index = getIndex(entry.target);
  		const step = steps[index];
  		const { isIntersecting, intersectionRatio, target } = entry;
  		if (isIntersecting && step.state === "enter")
  			notifyProgress(target, intersectionRatio);
  	}

  	/*  OBSERVERS - CREATION */
  	function disconnectObserver({ observers }) {
  		Object.keys(observers).map((name) => {
  			observers[name].disconnect();
  		});
  	}

  	function disconnectObservers() {
  		steps.forEach(disconnectObserver);
  	}

  	function updateResizeObserver(step) {
  		const observer = new ResizeObserver(resizeStep);
  		observer.observe(step.node);
  		step.observers.resize = observer;
  	}

  	function updateResizeObservers() {
  		steps.forEach(updateResizeObserver);
  	}

  	function updateStepObserver(step) {
  		const h = window.innerHeight;
  		const off = step.offset || globalOffset;
  		const factor = off.format === "pixels" ? 1 : h;
  		const offset = off.value * factor;
  		const marginTop = step.height / 2 - offset;
  		const marginBottom = step.height / 2 - (h - offset);
  		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;

  		const threshold = 0.5;
  		const options = { rootMargin, threshold };
  		const observer = new IntersectionObserver(intersectStep, options);

  		observer.observe(step.node);
  		step.observers.step = observer;

  		if (isDebug) update({ id, step, marginTop, marginBottom });
  	}

  	function updateStepObservers() {
  		steps.forEach(updateStepObserver);
  	}

  	function updateProgressObserver(step) {
  		const h = window.innerHeight;
  		const off = step.offset || globalOffset;
  		const factor = off.format === "pixels" ? 1 : h;
  		const offset = off.value * factor;
  		const marginTop = -offset + step.height;
  		const marginBottom = offset - h;
  		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;

  		const threshold = createProgressThreshold(step.height, progressThreshold);
  		const options = { rootMargin, threshold };
  		const observer = new IntersectionObserver(intersectProgress, options);

  		observer.observe(step.node);
  		step.observers.progress = observer;
  	}

  	function updateProgressObservers() {
  		steps.forEach(updateProgressObserver);
  	}

  	function updateObservers() {
  		disconnectObservers();
  		updateResizeObservers();
  		updateStepObservers();
  		if (isProgress) updateProgressObservers();
  	}

  	/* SETUP */
  	const S = {};

  	S.setup = ({
  		step,
  		parent,
  		offset = 0.5,
  		threshold = 4,
  		progress = false,
  		once = false,
  		debug = false,
  		container = undefined
  	}) => {

  		setupScroll(container);

  		steps = selectAll(step, parent).map((node, index) => ({
  			index,
  			direction: undefined,
  			height: node.offsetHeight,
  			node,
  			observers: {},
  			offset: parseOffset(node.dataset.offset),
  			top: getOffsetTop(node),
  			progress: 0,
  			state: undefined,
  		}));

  		if (!steps.length) {
  			err$1("no step elements");
  			return S;
  		}

  		isProgress = progress;
  		isTriggerOnce = once;
  		isDebug = debug;
  		progressThreshold = Math.max(1, +threshold);
  		globalOffset = parseOffset(offset);
  		containerElement = container;

  		reset();
  		indexSteps(steps);
  		handleEnable(true);
  		return S;
  	};

  	S.enable = () => {
  		handleEnable(true);
  		return S;
  	};

  	S.disable = () => {
  		handleEnable(false);
  		return S;
  	};

  	S.destroy = () => {
  		handleEnable(false);
  		reset();
  		return S;
  	};

  	S.resize = () => {
  		updateObservers();
  		return S;
  	};

  	S.offset = (x) => {
  		if (x === null || x === undefined) return globalOffset.value;
  		globalOffset = parseOffset(x);
  		updateObservers();
  		return S;
  	};

  	S.onStepEnter = (f) => {
  		if (typeof f === "function") cb.stepEnter = f;
  		else err$1("onStepEnter requires a function");
  		return S;
  	};

  	S.onStepExit = (f) => {
  		if (typeof f === "function") cb.stepExit = f;
  		else err$1("onStepExit requires a function");
  		return S;
  	};

  	S.onStepProgress = (f) => {
  		if (typeof f === "function") cb.stepProgress = f;
  		else err$1("onStepProgress requires a function");
  		return S;
  	};
  	return S;
  }

  return scrollama;

})));


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.IMask = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global$p = // eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$8 = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$7 = fails$8; // Detect IE8's incomplete defineProperty implementation


	var descriptors = !fails$7(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var fails$6 = fails$8;

	var functionBindNative = !fails$6(function () {
	  var test = function () {
	    /* empty */
	  }.bind(); // eslint-disable-next-line no-prototype-builtins -- safe


	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var NATIVE_BIND$1 = functionBindNative;

	var call$5 = Function.prototype.call;
	var functionCall = NATIVE_BIND$1 ? call$5.bind(call$5) : function () {
	  return call$5.apply(call$5, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$1(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$2 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var NATIVE_BIND = functionBindNative;

	var FunctionPrototype$1 = Function.prototype;
	var bind = FunctionPrototype$1.bind;
	var call$4 = FunctionPrototype$1.call;
	var uncurryThis$b = NATIVE_BIND && bind.bind(call$4, call$4);
	var functionUncurryThis = NATIVE_BIND ? function (fn) {
	  return fn && uncurryThis$b(fn);
	} : function (fn) {
	  return fn && function () {
	    return call$4.apply(fn, arguments);
	  };
	};

	var uncurryThis$a = functionUncurryThis;

	var toString$4 = uncurryThis$a({}.toString);
	var stringSlice$1 = uncurryThis$a(''.slice);

	var classofRaw$1 = function (it) {
	  return stringSlice$1(toString$4(it), 8, -1);
	};

	var global$o = global$p;

	var uncurryThis$9 = functionUncurryThis;

	var fails$5 = fails$8;

	var classof$2 = classofRaw$1;

	var Object$4 = global$o.Object;
	var split = uncurryThis$9(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails$5(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$4('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$2(it) == 'String' ? split(it, '') : Object$4(it);
	} : Object$4;

	var global$n = global$p;

	var TypeError$7 = global$n.TypeError; // `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible

	var requireObjectCoercible$4 = function (it) {
	  if (it == undefined) throw TypeError$7("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject$1 = indexedObject;

	var requireObjectCoercible$3 = requireObjectCoercible$4;

	var toIndexedObject$3 = function (it) {
	  return IndexedObject$1(requireObjectCoercible$3(it));
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable$a = function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$9 = isCallable$a;

	var isObject$5 = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$9(it);
	};

	var global$m = global$p;

	var isCallable$8 = isCallable$a;

	var aFunction = function (argument) {
	  return isCallable$8(argument) ? argument : undefined;
	};

	var getBuiltIn$3 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$m[namespace]) : global$m[namespace] && global$m[namespace][method];
	};

	var uncurryThis$8 = functionUncurryThis;

	var objectIsPrototypeOf = uncurryThis$8({}.isPrototypeOf);

	var getBuiltIn$2 = getBuiltIn$3;

	var engineUserAgent = getBuiltIn$2('navigator', 'userAgent') || '';

	var global$l = global$p;

	var userAgent$1 = engineUserAgent;

	var process = global$l.process;
	var Deno = global$l.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us

	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0


	if (!version && userAgent$1) {
	  match = userAgent$1.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = userAgent$1.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */

	var V8_VERSION = engineV8Version;

	var fails$4 = fails$8; // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing


	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$4(function () {
	  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

	  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */

	var NATIVE_SYMBOL$1 = nativeSymbol;

	var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var global$k = global$p;

	var getBuiltIn$1 = getBuiltIn$3;

	var isCallable$7 = isCallable$a;

	var isPrototypeOf = objectIsPrototypeOf;

	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var Object$3 = global$k.Object;
	var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$1('Symbol');
	  return isCallable$7($Symbol) && isPrototypeOf($Symbol.prototype, Object$3(it));
	};

	var global$j = global$p;

	var String$3 = global$j.String;

	var tryToString$1 = function (argument) {
	  try {
	    return String$3(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var global$i = global$p;

	var isCallable$6 = isCallable$a;

	var tryToString = tryToString$1;

	var TypeError$6 = global$i.TypeError; // `Assert: IsCallable(argument) is true`

	var aCallable$1 = function (argument) {
	  if (isCallable$6(argument)) return argument;
	  throw TypeError$6(tryToString(argument) + ' is not a function');
	};

	var aCallable = aCallable$1; // `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod


	var getMethod$1 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable(func);
	};

	var global$h = global$p;

	var call$3 = functionCall;

	var isCallable$5 = isCallable$a;

	var isObject$4 = isObject$5;

	var TypeError$5 = global$h.TypeError; // `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive

	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$5(fn = input.toString) && !isObject$4(val = call$3(fn, input))) return val;
	  if (isCallable$5(fn = input.valueOf) && !isObject$4(val = call$3(fn, input))) return val;
	  if (pref !== 'string' && isCallable$5(fn = input.toString) && !isObject$4(val = call$3(fn, input))) return val;
	  throw TypeError$5("Can't convert object to primitive value");
	};

	var shared$3 = {exports: {}};

	var global$g = global$p; // eslint-disable-next-line es/no-object-defineproperty -- safe


	var defineProperty$1 = Object.defineProperty;

	var setGlobal$3 = function (key, value) {
	  try {
	    defineProperty$1(global$g, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    global$g[key] = value;
	  }

	  return value;
	};

	var global$f = global$p;

	var setGlobal$2 = setGlobal$3;

	var SHARED = '__core-js_shared__';
	var store$3 = global$f[SHARED] || setGlobal$2(SHARED, {});
	var sharedStore = store$3;

	var store$2 = sharedStore;

	(shared$3.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.21.0',
	  mode: 'global',
	  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.21.0/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});

	var global$e = global$p;

	var requireObjectCoercible$2 = requireObjectCoercible$4;

	var Object$2 = global$e.Object; // `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject

	var toObject$2 = function (argument) {
	  return Object$2(requireObjectCoercible$2(argument));
	};

	var uncurryThis$7 = functionUncurryThis;

	var toObject$1 = toObject$2;

	var hasOwnProperty = uncurryThis$7({}.hasOwnProperty); // `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty

	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$1(it), key);
	};

	var uncurryThis$6 = functionUncurryThis;

	var id = 0;
	var postfix = Math.random();
	var toString$3 = uncurryThis$6(1.0.toString);

	var uid$2 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$3(++id + postfix, 36);
	};

	var global$d = global$p;

	var shared$2 = shared$3.exports;

	var hasOwn$6 = hasOwnProperty_1;

	var uid$1 = uid$2;

	var NATIVE_SYMBOL = nativeSymbol;

	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var WellKnownSymbolsStore = shared$2('wks');
	var Symbol$1 = global$d.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

	var wellKnownSymbol$3 = function (name) {
	  if (!hasOwn$6(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;

	    if (NATIVE_SYMBOL && hasOwn$6(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else if (USE_SYMBOL_AS_UID && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  }

	  return WellKnownSymbolsStore[name];
	};

	var global$c = global$p;

	var call$2 = functionCall;

	var isObject$3 = isObject$5;

	var isSymbol$1 = isSymbol$2;

	var getMethod = getMethod$1;

	var ordinaryToPrimitive = ordinaryToPrimitive$1;

	var wellKnownSymbol$2 = wellKnownSymbol$3;

	var TypeError$4 = global$c.TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$2('toPrimitive'); // `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive

	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$3(input) || isSymbol$1(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;

	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$2(exoticToPrim, input, pref);
	    if (!isObject$3(result) || isSymbol$1(result)) return result;
	    throw TypeError$4("Can't convert object to primitive value");
	  }

	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;

	var isSymbol = isSymbol$2; // `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey


	var toPropertyKey$2 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var global$b = global$p;

	var isObject$2 = isObject$5;

	var document$1 = global$b.document; // typeof document.createElement is 'object' in old IE

	var EXISTS$1 = isObject$2(document$1) && isObject$2(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$6 = descriptors;

	var fails$3 = fails$8;

	var createElement = documentCreateElement; // Thanks to IE8 for its funny defineProperty


	var ie8DomDefine = !DESCRIPTORS$6 && !fails$3(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var DESCRIPTORS$5 = descriptors;

	var call$1 = functionCall;

	var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;

	var createPropertyDescriptor$1 = createPropertyDescriptor$2;

	var toIndexedObject$2 = toIndexedObject$3;

	var toPropertyKey$1 = toPropertyKey$2;

	var hasOwn$5 = hasOwnProperty_1;

	var IE8_DOM_DEFINE$1 = ie8DomDefine; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe


	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$5 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$2(O);
	  P = toPropertyKey$1(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (hasOwn$5(O, P)) return createPropertyDescriptor$1(!call$1(propertyIsEnumerableModule$1.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var DESCRIPTORS$4 = descriptors;

	var fails$2 = fails$8; // V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334


	var v8PrototypeDefineBug = DESCRIPTORS$4 && fails$2(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () {
	    /* empty */
	  }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype != 42;
	});

	var global$a = global$p;

	var isObject$1 = isObject$5;

	var String$2 = global$a.String;
	var TypeError$3 = global$a.TypeError; // `Assert: Type(argument) is Object`

	var anObject$2 = function (argument) {
	  if (isObject$1(argument)) return argument;
	  throw TypeError$3(String$2(argument) + ' is not an object');
	};

	var global$9 = global$p;

	var DESCRIPTORS$3 = descriptors;

	var IE8_DOM_DEFINE = ie8DomDefine;

	var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;

	var anObject$1 = anObject$2;

	var toPropertyKey = toPropertyKey$2;

	var TypeError$2 = global$9.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var $defineProperty = Object.defineProperty; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable'; // `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty

	objectDefineProperty.f = DESCRIPTORS$3 ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
	  anObject$1(O);
	  P = toPropertyKey(P);
	  anObject$1(Attributes);

	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);

	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  }

	  return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$1(O);
	  P = toPropertyKey(P);
	  anObject$1(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$2('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$2 = descriptors;

	var definePropertyModule$1 = objectDefineProperty;

	var createPropertyDescriptor = createPropertyDescriptor$2;

	var createNonEnumerableProperty$3 = DESCRIPTORS$2 ? function (object, key, value) {
	  return definePropertyModule$1.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$1 = {exports: {}};

	var uncurryThis$5 = functionUncurryThis;

	var isCallable$4 = isCallable$a;

	var store$1 = sharedStore;

	var functionToString = uncurryThis$5(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

	if (!isCallable$4(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource$2 = store$1.inspectSource;

	var global$8 = global$p;

	var isCallable$3 = isCallable$a;

	var inspectSource$1 = inspectSource$2;

	var WeakMap$1 = global$8.WeakMap;
	var nativeWeakMap = isCallable$3(WeakMap$1) && /native code/.test(inspectSource$1(WeakMap$1));

	var shared$1 = shared$3.exports;

	var uid = uid$2;

	var keys = shared$1('keys');

	var sharedKey$1 = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys$3 = {};

	var NATIVE_WEAK_MAP = nativeWeakMap;

	var global$7 = global$p;

	var uncurryThis$4 = functionUncurryThis;

	var isObject = isObject$5;

	var createNonEnumerableProperty$2 = createNonEnumerableProperty$3;

	var hasOwn$4 = hasOwnProperty_1;

	var shared = sharedStore;

	var sharedKey = sharedKey$1;

	var hiddenKeys$2 = hiddenKeys$3;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$1 = global$7.TypeError;
	var WeakMap = global$7.WeakMap;
	var set$1, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set$1(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$1('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
	  var wmget = uncurryThis$4(store.get);
	  var wmhas = uncurryThis$4(store.has);
	  var wmset = uncurryThis$4(store.set);

	  set$1 = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget(store, it) || {};
	  };

	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys$2[STATE] = true;

	  set$1 = function (it, metadata) {
	    if (hasOwn$4(it, STATE)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$2(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return hasOwn$4(it, STATE) ? it[STATE] : {};
	  };

	  has = function (it) {
	    return hasOwn$4(it, STATE);
	  };
	}

	var internalState = {
	  set: set$1,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$1 = descriptors;

	var hasOwn$3 = hasOwnProperty_1;

	var FunctionPrototype = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getDescriptor = DESCRIPTORS$1 && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$3(FunctionPrototype, 'name'); // additional protection from minified / mangled / dropped function names

	var PROPER = EXISTS && function something() {
	  /* empty */
	}.name === 'something';

	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$1 || DESCRIPTORS$1 && getDescriptor(FunctionPrototype, 'name').configurable);
	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$6 = global$p;

	var isCallable$2 = isCallable$a;

	var hasOwn$2 = hasOwnProperty_1;

	var createNonEnumerableProperty$1 = createNonEnumerableProperty$3;

	var setGlobal$1 = setGlobal$3;

	var inspectSource = inspectSource$2;

	var InternalStateModule = internalState;

	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

	var getInternalState = InternalStateModule.get;
	var enforceInternalState = InternalStateModule.enforce;
	var TEMPLATE = String(String).split('String');
	(redefine$1.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;

	  if (isCallable$2(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }

	    if (!hasOwn$2(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
	      createNonEnumerableProperty$1(value, 'name', name);
	    }

	    state = enforceInternalState(value);

	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }

	  if (O === global$6) {
	    if (simple) O[key] = value;else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty$1(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$2(this) && getInternalState(this).source || inspectSource(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil$1 = Math.ceil;
	var floor = Math.floor; // `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity

	var toIntegerOrInfinity$3 = function (argument) {
	  var number = +argument; // eslint-disable-next-line no-self-compare -- safe

	  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil$1)(number);
	};

	var toIntegerOrInfinity$2 = toIntegerOrInfinity$3;

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity$2(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$3;

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength

	var toLength$2 = function (argument) {
	  return argument > 0 ? min(toIntegerOrInfinity$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$1 = toLength$2; // `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike


	var lengthOfArrayLike$1 = function (obj) {
	  return toLength$1(obj.length);
	};

	var toIndexedObject$1 = toIndexedObject$3;

	var toAbsoluteIndex = toAbsoluteIndex$1;

	var lengthOfArrayLike = lengthOfArrayLike$1; // `Array.prototype.{ indexOf, includes }` methods implementation


	var createMethod$1 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$1($this);
	    var length = lengthOfArrayLike(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare -- NaN check

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$1(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$1(false)
	};

	var uncurryThis$3 = functionUncurryThis;

	var hasOwn$1 = hasOwnProperty_1;

	var toIndexedObject = toIndexedObject$3;

	var indexOf = arrayIncludes.indexOf;

	var hiddenKeys$1 = hiddenKeys$3;

	var push = uncurryThis$3([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !hasOwn$1(hiddenKeys$1, key) && hasOwn$1(O, key) && push(result, key); // Don't enum bug & hidden keys


	  while (names.length > i) if (hasOwn$1(O, key = names[i++])) {
	    ~indexOf(result, key) || push(result, key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$2 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var internalObjectKeys$1 = objectKeysInternal;

	var enumBugKeys$1 = enumBugKeys$2;

	var hiddenKeys = enumBugKeys$1.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe

	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys);
	};

	var objectGetOwnPropertySymbols = {};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn = getBuiltIn$3;

	var uncurryThis$2 = functionUncurryThis;

	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;

	var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;

	var anObject = anObject$2;

	var concat$1 = uncurryThis$2([].concat); // all object keys, includes non-enumerable and symbols

	var ownKeys$1 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
	  return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn = hasOwnProperty_1;

	var ownKeys = ownKeys$1;

	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;

	var definePropertyModule = objectDefineProperty;

	var copyConstructorProperties$1 = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];

	    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var fails$1 = fails$8;

	var isCallable$1 = isCallable$a;

	var replacement = /#|\.prototype\./;

	var isForced$1 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$1(detection) ? fails$1(detection) : !!detection;
	};

	var normalize = isForced$1.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$1.data = {};
	var NATIVE = isForced$1.NATIVE = 'N';
	var POLYFILL = isForced$1.POLYFILL = 'P';
	var isForced_1 = isForced$1;

	var global$5 = global$p;

	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	var createNonEnumerableProperty = createNonEnumerableProperty$3;

	var redefine = redefine$1.exports;

	var setGlobal = setGlobal$3;

	var copyConstructorProperties = copyConstructorProperties$1;

	var isForced = isForced_1;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	  options.name        - the .name of the function if it does not match the key
	*/


	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global$5;
	  } else if (STATIC) {
	    target = global$5[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$5[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	var internalObjectKeys = objectKeysInternal;

	var enumBugKeys = enumBugKeys$2; // `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe


	var objectKeys$1 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys);
	};

	var DESCRIPTORS = descriptors;

	var uncurryThis$1 = functionUncurryThis;

	var call = functionCall;

	var fails = fails$8;

	var objectKeys = objectKeys$1;

	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;

	var propertyIsEnumerableModule = objectPropertyIsEnumerable;

	var toObject = toObject$2;

	var IndexedObject = indexedObject; // eslint-disable-next-line es/no-object-assign -- safe


	var $assign = Object.assign; // eslint-disable-next-line es/no-object-defineproperty -- required for testing

	var defineProperty = Object.defineProperty;
	var concat = uncurryThis$1([].concat); // `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign

	var objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (DESCRIPTORS && $assign({
	    b: 1
	  }, $assign(defineProperty({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), {
	    b: 2
	  })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

	  var A = {};
	  var B = {}; // eslint-disable-next-line es/no-symbol -- safe

	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) {
	    B[chr] = chr;
	  });
	  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  var propertyIsEnumerable = propertyIsEnumerableModule.f;

	  while (argumentsLength > index) {
	    var S = IndexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;

	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  }

	  return T;
	} : $assign;

	var $$4 = _export;

	var assign = objectAssign; // `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es/no-object-assign -- required for testing


	$$4({
	  target: 'Object',
	  stat: true,
	  forced: Object.assign !== assign
	}, {
	  assign: assign
	});

	var wellKnownSymbol$1 = wellKnownSymbol$3;

	var TO_STRING_TAG$1 = wellKnownSymbol$1('toStringTag');
	var test = {};
	test[TO_STRING_TAG$1] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var global$4 = global$p;

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;

	var isCallable = isCallable$a;

	var classofRaw = classofRaw$1;

	var wellKnownSymbol = wellKnownSymbol$3;

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var Object$1 = global$4.Object; // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof$1 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object$1(it), TO_STRING_TAG)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	var global$3 = global$p;

	var classof = classof$1;

	var String$1 = global$3.String;

	var toString$2 = function (argument) {
	  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$1(argument);
	};

	var global$2 = global$p;

	var toIntegerOrInfinity = toIntegerOrInfinity$3;

	var toString$1 = toString$2;

	var requireObjectCoercible$1 = requireObjectCoercible$4;

	var RangeError = global$2.RangeError; // `String.prototype.repeat` method implementation
	// https://tc39.es/ecma262/#sec-string.prototype.repeat

	var stringRepeat = function repeat(count) {
	  var str = toString$1(requireObjectCoercible$1(this));
	  var result = '';
	  var n = toIntegerOrInfinity(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');

	  for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;

	  return result;
	};

	var $$3 = _export;

	var repeat$1 = stringRepeat; // `String.prototype.repeat` method
	// https://tc39.es/ecma262/#sec-string.prototype.repeat


	$$3({
	  target: 'String',
	  proto: true
	}, {
	  repeat: repeat$1
	});

	// https://github.com/tc39/proposal-string-pad-start-end
	var uncurryThis = functionUncurryThis;

	var toLength = toLength$2;

	var toString = toString$2;

	var $repeat = stringRepeat;

	var requireObjectCoercible = requireObjectCoercible$4;

	var repeat = uncurryThis($repeat);
	var stringSlice = uncurryThis(''.slice);
	var ceil = Math.ceil; // `String.prototype.{ padStart, padEnd }` methods implementation

	var createMethod = function (IS_END) {
	  return function ($this, maxLength, fillString) {
	    var S = toString(requireObjectCoercible($this));
	    var intMaxLength = toLength(maxLength);
	    var stringLength = S.length;
	    var fillStr = fillString === undefined ? ' ' : toString(fillString);
	    var fillLen, stringFiller;
	    if (intMaxLength <= stringLength || fillStr == '') return S;
	    fillLen = intMaxLength - stringLength;
	    stringFiller = repeat(fillStr, ceil(fillLen / fillStr.length));
	    if (stringFiller.length > fillLen) stringFiller = stringSlice(stringFiller, 0, fillLen);
	    return IS_END ? S + stringFiller : stringFiller + S;
	  };
	};

	var stringPad = {
	  // `String.prototype.padStart` method
	  // https://tc39.es/ecma262/#sec-string.prototype.padstart
	  start: createMethod(false),
	  // `String.prototype.padEnd` method
	  // https://tc39.es/ecma262/#sec-string.prototype.padend
	  end: createMethod(true)
	};

	// https://github.com/zloirock/core-js/issues/280
	var userAgent = engineUserAgent;

	var stringPadWebkitBug = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent);

	var $$2 = _export;

	var $padStart = stringPad.start;

	var WEBKIT_BUG$1 = stringPadWebkitBug; // `String.prototype.padStart` method
	// https://tc39.es/ecma262/#sec-string.prototype.padstart


	$$2({
	  target: 'String',
	  proto: true,
	  forced: WEBKIT_BUG$1
	}, {
	  padStart: function padStart(maxLength
	  /* , fillString = ' ' */
	  ) {
	    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1 = _export;

	var $padEnd = stringPad.end;

	var WEBKIT_BUG = stringPadWebkitBug; // `String.prototype.padEnd` method
	// https://tc39.es/ecma262/#sec-string.prototype.padend


	$$1({
	  target: 'String',
	  proto: true,
	  forced: WEBKIT_BUG
	}, {
	  padEnd: function padEnd(maxLength
	  /* , fillString = ' ' */
	  ) {
	    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $ = _export;

	var global$1 = global$p; // `globalThis` object
	// https://tc39.es/ecma262/#sec-globalthis


	$({
	  global: true
	}, {
	  globalThis: global$1
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  }, _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  Object.defineProperty(subClass, "prototype", {
	    writable: false
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};

	  var target = _objectWithoutPropertiesLoose(source, excluded);

	  var key, i;

	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }

	  return target;
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  } else if (call !== void 0) {
	    throw new TypeError("Derived constructors may only return object or undefined");
	  }

	  return _assertThisInitialized(self);
	}

	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();

	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	        result;

	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;

	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }

	    return _possibleConstructorReturn(this, result);
	  };
	}

	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = _getPrototypeOf(object);
	    if (object === null) break;
	  }

	  return object;
	}

	function _get() {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    _get = Reflect.get;
	  } else {
	    _get = function _get(target, property, receiver) {
	      var base = _superPropBase(target, property);

	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);

	      if (desc.get) {
	        return desc.get.call(arguments.length < 3 ? target : receiver);
	      }

	      return desc.value;
	    };
	  }

	  return _get.apply(this, arguments);
	}

	function set(target, property, value, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.set) {
	    set = Reflect.set;
	  } else {
	    set = function set(target, property, value, receiver) {
	      var base = _superPropBase(target, property);

	      var desc;

	      if (base) {
	        desc = Object.getOwnPropertyDescriptor(base, property);

	        if (desc.set) {
	          desc.set.call(receiver, value);
	          return true;
	        } else if (!desc.writable) {
	          return false;
	        }
	      }

	      desc = Object.getOwnPropertyDescriptor(receiver, property);

	      if (desc) {
	        if (!desc.writable) {
	          return false;
	        }

	        desc.value = value;
	        Object.defineProperty(receiver, property, desc);
	      } else {
	        _defineProperty(receiver, property, value);
	      }

	      return true;
	    };
	  }

	  return set(target, property, value, receiver);
	}

	function _set(target, property, value, receiver, isStrict) {
	  var s = set(target, property, value, receiver || target);

	  if (!s && isStrict) {
	    throw new Error('failed to set property');
	  }

	  return value;
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

	  if (_i == null) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;

	  var _s, _e;

	  try {
	    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	/**
	  Provides details of changing model value
	  @param {Object} [details]
	  @param {string} [details.inserted] - Inserted symbols
	  @param {boolean} [details.skip] - Can skip chars
	  @param {number} [details.removeCount] - Removed symbols count
	  @param {number} [details.tailShift] - Additional offset if any changes occurred before tail
	*/
	var ChangeDetails = /*#__PURE__*/function () {
	  /** Inserted symbols */

	  /** Can skip chars */

	  /** Additional offset if any changes occurred before tail */

	  /** Raw inserted is used by dynamic mask */
	  function ChangeDetails(details) {
	    _classCallCheck(this, ChangeDetails);

	    Object.assign(this, {
	      inserted: '',
	      rawInserted: '',
	      skip: false,
	      tailShift: 0
	    }, details);
	  }
	  /**
	    Aggregate changes
	    @returns {ChangeDetails} `this`
	  */


	  _createClass(ChangeDetails, [{
	    key: "aggregate",
	    value: function aggregate(details) {
	      this.rawInserted += details.rawInserted;
	      this.skip = this.skip || details.skip;
	      this.inserted += details.inserted;
	      this.tailShift += details.tailShift;
	      return this;
	    }
	    /** Total offset considering all changes */

	  }, {
	    key: "offset",
	    get: function get() {
	      return this.tailShift + this.inserted.length;
	    }
	  }]);

	  return ChangeDetails;
	}();

	/** Checks if value is string */

	function isString(str) {
	  return typeof str === 'string' || str instanceof String;
	}
	/**
	  Direction
	  @prop {string} NONE
	  @prop {string} LEFT
	  @prop {string} FORCE_LEFT
	  @prop {string} RIGHT
	  @prop {string} FORCE_RIGHT
	*/

	var DIRECTION = {
	  NONE: 'NONE',
	  LEFT: 'LEFT',
	  FORCE_LEFT: 'FORCE_LEFT',
	  RIGHT: 'RIGHT',
	  FORCE_RIGHT: 'FORCE_RIGHT'
	};
	/** */

	function forceDirection(direction) {
	  switch (direction) {
	    case DIRECTION.LEFT:
	      return DIRECTION.FORCE_LEFT;

	    case DIRECTION.RIGHT:
	      return DIRECTION.FORCE_RIGHT;

	    default:
	      return direction;
	  }
	}
	/** Escapes regular expression control chars */

	function escapeRegExp(str) {
	  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	}
	function normalizePrepare(prep) {
	  return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
	} // cloned from https://github.com/epoberezkin/fast-deep-equal with small changes

	function objectIncludes(b, a) {
	  if (a === b) return true;
	  var arrA = Array.isArray(a),
	      arrB = Array.isArray(b),
	      i;

	  if (arrA && arrB) {
	    if (a.length != b.length) return false;

	    for (i = 0; i < a.length; i++) {
	      if (!objectIncludes(a[i], b[i])) return false;
	    }

	    return true;
	  }

	  if (arrA != arrB) return false;

	  if (a && b && _typeof(a) === 'object' && _typeof(b) === 'object') {
	    var dateA = a instanceof Date,
	        dateB = b instanceof Date;
	    if (dateA && dateB) return a.getTime() == b.getTime();
	    if (dateA != dateB) return false;
	    var regexpA = a instanceof RegExp,
	        regexpB = b instanceof RegExp;
	    if (regexpA && regexpB) return a.toString() == b.toString();
	    if (regexpA != regexpB) return false;
	    var keys = Object.keys(a); // if (keys.length !== Object.keys(b).length) return false;

	    for (i = 0; i < keys.length; i++) {
	      // $FlowFixMe ... ???
	      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
	    }

	    for (i = 0; i < keys.length; i++) {
	      if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
	    }

	    return true;
	  } else if (a && b && typeof a === 'function' && typeof b === 'function') {
	    return a.toString() === b.toString();
	  }

	  return false;
	}
	/** Selection range */

	/** Provides details of changing input */

	var ActionDetails = /*#__PURE__*/function () {
	  /** Current input value */

	  /** Current cursor position */

	  /** Old input value */

	  /** Old selection */
	  function ActionDetails(value, cursorPos, oldValue, oldSelection) {
	    _classCallCheck(this, ActionDetails);

	    this.value = value;
	    this.cursorPos = cursorPos;
	    this.oldValue = oldValue;
	    this.oldSelection = oldSelection; // double check if left part was changed (autofilling, other non-standard input triggers)

	    while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
	      --this.oldSelection.start;
	    }
	  }
	  /**
	    Start changing position
	    @readonly
	  */


	  _createClass(ActionDetails, [{
	    key: "startChangePos",
	    get: function get() {
	      return Math.min(this.cursorPos, this.oldSelection.start);
	    }
	    /**
	      Inserted symbols count
	      @readonly
	    */

	  }, {
	    key: "insertedCount",
	    get: function get() {
	      return this.cursorPos - this.startChangePos;
	    }
	    /**
	      Inserted symbols
	      @readonly
	    */

	  }, {
	    key: "inserted",
	    get: function get() {
	      return this.value.substr(this.startChangePos, this.insertedCount);
	    }
	    /**
	      Removed symbols count
	      @readonly
	    */

	  }, {
	    key: "removedCount",
	    get: function get() {
	      // Math.max for opposite operation
	      return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
	      this.oldValue.length - this.value.length, 0);
	    }
	    /**
	      Removed symbols
	      @readonly
	    */

	  }, {
	    key: "removed",
	    get: function get() {
	      return this.oldValue.substr(this.startChangePos, this.removedCount);
	    }
	    /**
	      Unchanged head symbols
	      @readonly
	    */

	  }, {
	    key: "head",
	    get: function get() {
	      return this.value.substring(0, this.startChangePos);
	    }
	    /**
	      Unchanged tail symbols
	      @readonly
	    */

	  }, {
	    key: "tail",
	    get: function get() {
	      return this.value.substring(this.startChangePos + this.insertedCount);
	    }
	    /**
	      Remove direction
	      @readonly
	    */

	  }, {
	    key: "removeDirection",
	    get: function get() {
	      if (!this.removedCount || this.insertedCount) return DIRECTION.NONE; // align right if delete at right

	      return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
	      this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
	    }
	  }]);

	  return ActionDetails;
	}();

	/** Provides details of continuous extracted tail */
	var ContinuousTailDetails = /*#__PURE__*/function () {
	  /** Tail value as string */

	  /** Tail start position */

	  /** Start position */
	  function ContinuousTailDetails() {
	    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var stop = arguments.length > 2 ? arguments[2] : undefined;

	    _classCallCheck(this, ContinuousTailDetails);

	    this.value = value;
	    this.from = from;
	    this.stop = stop;
	  }

	  _createClass(ContinuousTailDetails, [{
	    key: "toString",
	    value: function toString() {
	      return this.value;
	    }
	  }, {
	    key: "extend",
	    value: function extend(tail) {
	      this.value += String(tail);
	    }
	  }, {
	    key: "appendTo",
	    value: function appendTo(masked) {
	      return masked.append(this.toString(), {
	        tail: true
	      }).aggregate(masked._appendPlaceholder());
	    }
	  }, {
	    key: "state",
	    get: function get() {
	      return {
	        value: this.value,
	        from: this.from,
	        stop: this.stop
	      };
	    },
	    set: function set(state) {
	      Object.assign(this, state);
	    }
	  }, {
	    key: "unshift",
	    value: function unshift(beforePos) {
	      if (!this.value.length || beforePos != null && this.from >= beforePos) return '';
	      var shiftChar = this.value[0];
	      this.value = this.value.slice(1);
	      return shiftChar;
	    }
	  }, {
	    key: "shift",
	    value: function shift() {
	      if (!this.value.length) return '';
	      var shiftChar = this.value[this.value.length - 1];
	      this.value = this.value.slice(0, -1);
	      return shiftChar;
	    }
	  }]);

	  return ContinuousTailDetails;
	}();

	/**
	 * Applies mask on element.
	 * @constructor
	 * @param {HTMLInputElement|HTMLTextAreaElement|MaskElement} el - Element to apply mask
	 * @param {Object} opts - Custom mask options
	 * @return {InputMask}
	 */
	function IMask(el) {
	  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  // currently available only for input-like elements
	  return new IMask.InputMask(el, opts);
	}

	/** Supported mask type */

	/** Provides common masking stuff */
	var Masked = /*#__PURE__*/function () {
	  // $Shape<MaskedOptions>; TODO after fix https://github.com/facebook/flow/issues/4773

	  /** @type {Mask} */

	  /** */
	  // $FlowFixMe no ideas

	  /** Transforms value before mask processing */

	  /** Validates if value is acceptable */

	  /** Does additional processing in the end of editing */

	  /** Format typed value to string */

	  /** Parse strgin to get typed value */

	  /** Enable characters overwriting */

	  /** */

	  /** */
	  function Masked(opts) {
	    _classCallCheck(this, Masked);

	    this._value = '';

	    this._update(Object.assign({}, Masked.DEFAULTS, opts));

	    this.isInitialized = true;
	  }
	  /** Sets and applies new options */


	  _createClass(Masked, [{
	    key: "updateOptions",
	    value: function updateOptions(opts) {
	      if (!Object.keys(opts).length) return; // $FlowFixMe

	      this.withValueRefresh(this._update.bind(this, opts));
	    }
	    /**
	      Sets new options
	      @protected
	    */

	  }, {
	    key: "_update",
	    value: function _update(opts) {
	      Object.assign(this, opts);
	    }
	    /** Mask state */

	  }, {
	    key: "state",
	    get: function get() {
	      return {
	        _value: this.value
	      };
	    },
	    set: function set(state) {
	      this._value = state._value;
	    }
	    /** Resets value */

	  }, {
	    key: "reset",
	    value: function reset() {
	      this._value = '';
	    }
	    /** */

	  }, {
	    key: "value",
	    get: function get() {
	      return this._value;
	    },
	    set: function set(value) {
	      this.resolve(value);
	    }
	    /** Resolve new value */

	  }, {
	    key: "resolve",
	    value: function resolve(value) {
	      this.reset();
	      this.append(value, {
	        input: true
	      }, '');
	      this.doCommit();
	      return this.value;
	    }
	    /** */

	  }, {
	    key: "unmaskedValue",
	    get: function get() {
	      return this.value;
	    },
	    set: function set(value) {
	      this.reset();
	      this.append(value, {}, '');
	      this.doCommit();
	    }
	    /** */

	  }, {
	    key: "typedValue",
	    get: function get() {
	      return this.doParse(this.value);
	    },
	    set: function set(value) {
	      this.value = this.doFormat(value);
	    }
	    /** Value that includes raw user input */

	  }, {
	    key: "rawInputValue",
	    get: function get() {
	      return this.extractInput(0, this.value.length, {
	        raw: true
	      });
	    },
	    set: function set(value) {
	      this.reset();
	      this.append(value, {
	        raw: true
	      }, '');
	      this.doCommit();
	    }
	    /** */

	  }, {
	    key: "isComplete",
	    get: function get() {
	      return true;
	    }
	    /** */

	  }, {
	    key: "isFilled",
	    get: function get() {
	      return this.isComplete;
	    }
	    /** Finds nearest input position in direction */

	  }, {
	    key: "nearestInputPos",
	    value: function nearestInputPos(cursorPos, direction) {
	      return cursorPos;
	    }
	    /** Extracts value in range considering flags */

	  }, {
	    key: "extractInput",
	    value: function extractInput() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      return this.value.slice(fromPos, toPos);
	    }
	    /** Extracts tail in range */

	  }, {
	    key: "extractTail",
	    value: function extractTail() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
	    }
	    /** Appends tail */
	    // $FlowFixMe no ideas

	  }, {
	    key: "appendTail",
	    value: function appendTail(tail) {
	      if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
	      return tail.appendTo(this);
	    }
	    /** Appends char */

	  }, {
	    key: "_appendCharRaw",
	    value: function _appendCharRaw(ch) {
	      if (!ch) return new ChangeDetails();
	      this._value += ch;
	      return new ChangeDetails({
	        inserted: ch,
	        rawInserted: ch
	      });
	    }
	    /** Appends char */

	  }, {
	    key: "_appendChar",
	    value: function _appendChar(ch) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var checkTail = arguments.length > 2 ? arguments[2] : undefined;
	      var consistentState = this.state;
	      var details;

	      var _normalizePrepare = normalizePrepare(this.doPrepare(ch, flags));

	      var _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2);

	      ch = _normalizePrepare2[0];
	      details = _normalizePrepare2[1];
	      details = details.aggregate(this._appendCharRaw(ch, flags));

	      if (details.inserted) {
	        var consistentTail;
	        var appended = this.doValidate(flags) !== false;

	        if (appended && checkTail != null) {
	          // validation ok, check tail
	          var beforeTailState = this.state;

	          if (this.overwrite === true) {
	            consistentTail = checkTail.state;
	            checkTail.unshift(this.value.length);
	          }

	          var tailDetails = this.appendTail(checkTail);
	          appended = tailDetails.rawInserted === checkTail.toString(); // not ok, try shift

	          if (!(appended && tailDetails.inserted) && this.overwrite === 'shift') {
	            this.state = beforeTailState;
	            consistentTail = checkTail.state;
	            checkTail.shift();
	            tailDetails = this.appendTail(checkTail);
	            appended = tailDetails.rawInserted === checkTail.toString();
	          } // if ok, rollback state after tail


	          if (appended && tailDetails.inserted) this.state = beforeTailState;
	        } // revert all if something went wrong


	        if (!appended) {
	          details = new ChangeDetails();
	          this.state = consistentState;
	          if (checkTail && consistentTail) checkTail.state = consistentTail;
	        }
	      }

	      return details;
	    }
	    /** Appends optional placeholder at end */

	  }, {
	    key: "_appendPlaceholder",
	    value: function _appendPlaceholder() {
	      return new ChangeDetails();
	    }
	    /** Appends optional eager placeholder at end */

	  }, {
	    key: "_appendEager",
	    value: function _appendEager() {
	      return new ChangeDetails();
	    }
	    /** Appends symbols considering flags */
	    // $FlowFixMe no ideas

	  }, {
	    key: "append",
	    value: function append(str, flags, tail) {
	      if (!isString(str)) throw new Error('value should be string');
	      var details = new ChangeDetails();
	      var checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
	      if (flags && flags.tail) flags._beforeTailState = this.state;

	      for (var ci = 0; ci < str.length; ++ci) {
	        details.aggregate(this._appendChar(str[ci], flags, checkTail));
	      } // append tail but aggregate only tailShift


	      if (checkTail != null) {
	        details.tailShift += this.appendTail(checkTail).tailShift; // TODO it's a good idea to clear state after appending ends
	        // but it causes bugs when one append calls another (when dynamic dispatch set rawInputValue)
	        // this._resetBeforeTailState();
	      }

	      if (this.eager && flags !== null && flags !== void 0 && flags.input && str) {
	        details.aggregate(this._appendEager());
	      }

	      return details;
	    }
	    /** */

	  }, {
	    key: "remove",
	    value: function remove() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
	      return new ChangeDetails();
	    }
	    /** Calls function and reapplies current value */

	  }, {
	    key: "withValueRefresh",
	    value: function withValueRefresh(fn) {
	      if (this._refreshing || !this.isInitialized) return fn();
	      this._refreshing = true;
	      var rawInput = this.rawInputValue;
	      var value = this.value;
	      var ret = fn();
	      this.rawInputValue = rawInput; // append lost trailing chars at end

	      if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
	        this.append(value.slice(this.value.length), {}, '');
	      }

	      delete this._refreshing;
	      return ret;
	    }
	    /** */

	  }, {
	    key: "runIsolated",
	    value: function runIsolated(fn) {
	      if (this._isolated || !this.isInitialized) return fn(this);
	      this._isolated = true;
	      var state = this.state;
	      var ret = fn(this);
	      this.state = state;
	      delete this._isolated;
	      return ret;
	    }
	    /**
	      Prepares string before mask processing
	      @protected
	    */

	  }, {
	    key: "doPrepare",
	    value: function doPrepare(str) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      return this.prepare ? this.prepare(str, this, flags) : str;
	    }
	    /**
	      Validates if value is acceptable
	      @protected
	    */

	  }, {
	    key: "doValidate",
	    value: function doValidate(flags) {
	      return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
	    }
	    /**
	      Does additional processing in the end of editing
	      @protected
	    */

	  }, {
	    key: "doCommit",
	    value: function doCommit() {
	      if (this.commit) this.commit(this.value, this);
	    }
	    /** */

	  }, {
	    key: "doFormat",
	    value: function doFormat(value) {
	      return this.format ? this.format(value, this) : value;
	    }
	    /** */

	  }, {
	    key: "doParse",
	    value: function doParse(str) {
	      return this.parse ? this.parse(str, this) : str;
	    }
	    /** */

	  }, {
	    key: "splice",
	    value: function splice(start, deleteCount, inserted, removeDirection) {
	      var tailPos = start + deleteCount;
	      var tail = this.extractTail(tailPos);
	      var oldRawValue;

	      if (this.eager) {
	        removeDirection = forceDirection(removeDirection);
	        oldRawValue = this.extractInput(0, tailPos, {
	          raw: true
	        });
	      }

	      var startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !this.eager ? DIRECTION.NONE : removeDirection);
	      var details = new ChangeDetails({
	        tailShift: startChangePos - start // adjust tailShift if start was aligned

	      }).aggregate(this.remove(startChangePos));

	      if (this.eager && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) {
	        if (removeDirection === DIRECTION.FORCE_LEFT) {
	          var valLength;

	          while (oldRawValue === this.rawInputValue && (valLength = this.value.length)) {
	            details.aggregate(new ChangeDetails({
	              tailShift: -1
	            })).aggregate(this.remove(valLength - 1));
	          }
	        } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
	          tail.unshift();
	        }
	      }

	      return details.aggregate(this.append(inserted, {
	        input: true
	      }, tail));
	    }
	  }, {
	    key: "maskEquals",
	    value: function maskEquals(mask) {
	      return this.mask === mask;
	    }
	  }]);

	  return Masked;
	}();
	Masked.DEFAULTS = {
	  format: function format(v) {
	    return v;
	  },
	  parse: function parse(v) {
	    return v;
	  }
	};
	IMask.Masked = Masked;

	/** Get Masked class by mask type */

	function maskedClass(mask) {
	  if (mask == null) {
	    throw new Error('mask property should be defined');
	  } // $FlowFixMe


	  if (mask instanceof RegExp) return IMask.MaskedRegExp; // $FlowFixMe

	  if (isString(mask)) return IMask.MaskedPattern; // $FlowFixMe

	  if (mask instanceof Date || mask === Date) return IMask.MaskedDate; // $FlowFixMe

	  if (mask instanceof Number || typeof mask === 'number' || mask === Number) return IMask.MaskedNumber; // $FlowFixMe

	  if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic; // $FlowFixMe

	  if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask; // $FlowFixMe

	  if (mask instanceof IMask.Masked) return mask.constructor; // $FlowFixMe

	  if (mask instanceof Function) return IMask.MaskedFunction;
	  console.warn('Mask not found for mask', mask); // eslint-disable-line no-console
	  // $FlowFixMe

	  return IMask.Masked;
	}
	/** Creates new {@link Masked} depending on mask type */

	function createMask(opts) {
	  // $FlowFixMe
	  if (IMask.Masked && opts instanceof IMask.Masked) return opts;
	  opts = Object.assign({}, opts);
	  var mask = opts.mask; // $FlowFixMe

	  if (IMask.Masked && mask instanceof IMask.Masked) return mask;
	  var MaskedClass = maskedClass(mask);
	  if (!MaskedClass) throw new Error('Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.');
	  return new MaskedClass(opts);
	}
	IMask.createMask = createMask;

	var _excluded$4 = ["mask"];
	var DEFAULT_INPUT_DEFINITIONS = {
	  '0': /\d/,
	  'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
	  // http://stackoverflow.com/a/22075070
	  '*': /./
	};
	/** */

	var PatternInputDefinition = /*#__PURE__*/function () {
	  /** */

	  /** */

	  /** */

	  /** */

	  /** */

	  /** */

	  /** */
	  function PatternInputDefinition(opts) {
	    _classCallCheck(this, PatternInputDefinition);

	    var mask = opts.mask,
	        blockOpts = _objectWithoutProperties(opts, _excluded$4);

	    this.masked = createMask({
	      mask: mask
	    });
	    Object.assign(this, blockOpts);
	  }

	  _createClass(PatternInputDefinition, [{
	    key: "reset",
	    value: function reset() {
	      this.isFilled = false;
	      this.masked.reset();
	    }
	  }, {
	    key: "remove",
	    value: function remove() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

	      if (fromPos === 0 && toPos >= 1) {
	        this.isFilled = false;
	        return this.masked.remove(fromPos, toPos);
	      }

	      return new ChangeDetails();
	    }
	  }, {
	    key: "value",
	    get: function get() {
	      return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : '');
	    }
	  }, {
	    key: "unmaskedValue",
	    get: function get() {
	      return this.masked.unmaskedValue;
	    }
	  }, {
	    key: "isComplete",
	    get: function get() {
	      return Boolean(this.masked.value) || this.isOptional;
	    }
	  }, {
	    key: "_appendChar",
	    value: function _appendChar(ch) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      if (this.isFilled) return new ChangeDetails();
	      var state = this.masked.state; // simulate input

	      var details = this.masked._appendChar(ch, flags);

	      if (details.inserted && this.doValidate(flags) === false) {
	        details.inserted = details.rawInserted = '';
	        this.masked.state = state;
	      }

	      if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
	        details.inserted = this.placeholderChar;
	      }

	      details.skip = !details.inserted && !this.isOptional;
	      this.isFilled = Boolean(details.inserted);
	      return details;
	    }
	  }, {
	    key: "append",
	    value: function append() {
	      var _this$masked;

	      // TODO probably should be done via _appendChar
	      return (_this$masked = this.masked).append.apply(_this$masked, arguments);
	    }
	  }, {
	    key: "_appendPlaceholder",
	    value: function _appendPlaceholder() {
	      var details = new ChangeDetails();
	      if (this.isFilled || this.isOptional) return details;
	      this.isFilled = true;
	      details.inserted = this.placeholderChar;
	      return details;
	    }
	  }, {
	    key: "_appendEager",
	    value: function _appendEager() {
	      return new ChangeDetails();
	    }
	  }, {
	    key: "extractTail",
	    value: function extractTail() {
	      var _this$masked2;

	      return (_this$masked2 = this.masked).extractTail.apply(_this$masked2, arguments);
	    }
	  }, {
	    key: "appendTail",
	    value: function appendTail() {
	      var _this$masked3;

	      return (_this$masked3 = this.masked).appendTail.apply(_this$masked3, arguments);
	    }
	  }, {
	    key: "extractInput",
	    value: function extractInput() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      var flags = arguments.length > 2 ? arguments[2] : undefined;
	      return this.masked.extractInput(fromPos, toPos, flags);
	    }
	  }, {
	    key: "nearestInputPos",
	    value: function nearestInputPos(cursorPos) {
	      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
	      var minPos = 0;
	      var maxPos = this.value.length;
	      var boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);

	      switch (direction) {
	        case DIRECTION.LEFT:
	        case DIRECTION.FORCE_LEFT:
	          return this.isComplete ? boundPos : minPos;

	        case DIRECTION.RIGHT:
	        case DIRECTION.FORCE_RIGHT:
	          return this.isComplete ? boundPos : maxPos;

	        case DIRECTION.NONE:
	        default:
	          return boundPos;
	      }
	    }
	  }, {
	    key: "doValidate",
	    value: function doValidate() {
	      var _this$masked4, _this$parent;

	      return (_this$masked4 = this.masked).doValidate.apply(_this$masked4, arguments) && (!this.parent || (_this$parent = this.parent).doValidate.apply(_this$parent, arguments));
	    }
	  }, {
	    key: "doCommit",
	    value: function doCommit() {
	      this.masked.doCommit();
	    }
	  }, {
	    key: "state",
	    get: function get() {
	      return {
	        masked: this.masked.state,
	        isFilled: this.isFilled
	      };
	    },
	    set: function set(state) {
	      this.masked.state = state.masked;
	      this.isFilled = state.isFilled;
	    }
	  }]);

	  return PatternInputDefinition;
	}();

	var PatternFixedDefinition = /*#__PURE__*/function () {
	  /** */

	  /** */

	  /** */

	  /** */

	  /** */

	  /** */
	  function PatternFixedDefinition(opts) {
	    _classCallCheck(this, PatternFixedDefinition);

	    Object.assign(this, opts);
	    this._value = '';
	    this.isFixed = true;
	  }

	  _createClass(PatternFixedDefinition, [{
	    key: "value",
	    get: function get() {
	      return this._value;
	    }
	  }, {
	    key: "unmaskedValue",
	    get: function get() {
	      return this.isUnmasking ? this.value : '';
	    }
	  }, {
	    key: "reset",
	    value: function reset() {
	      this._isRawInput = false;
	      this._value = '';
	    }
	  }, {
	    key: "remove",
	    value: function remove() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
	      this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
	      if (!this._value) this._isRawInput = false;
	      return new ChangeDetails();
	    }
	  }, {
	    key: "nearestInputPos",
	    value: function nearestInputPos(cursorPos) {
	      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
	      var minPos = 0;
	      var maxPos = this._value.length;

	      switch (direction) {
	        case DIRECTION.LEFT:
	        case DIRECTION.FORCE_LEFT:
	          return minPos;

	        case DIRECTION.NONE:
	        case DIRECTION.RIGHT:
	        case DIRECTION.FORCE_RIGHT:
	        default:
	          return maxPos;
	      }
	    }
	  }, {
	    key: "extractInput",
	    value: function extractInput() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
	      var flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	      return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || '';
	    }
	  }, {
	    key: "isComplete",
	    get: function get() {
	      return true;
	    }
	  }, {
	    key: "isFilled",
	    get: function get() {
	      return Boolean(this._value);
	    }
	  }, {
	    key: "_appendChar",
	    value: function _appendChar(ch) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var details = new ChangeDetails();
	      if (this._value) return details;
	      var appended = this.char === ch;
	      var isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && !this.eager && !flags.tail;
	      if (isResolved) details.rawInserted = this.char;
	      this._value = details.inserted = this.char;
	      this._isRawInput = isResolved && (flags.raw || flags.input);
	      return details;
	    }
	  }, {
	    key: "_appendEager",
	    value: function _appendEager() {
	      return this._appendChar(this.char);
	    }
	  }, {
	    key: "_appendPlaceholder",
	    value: function _appendPlaceholder() {
	      var details = new ChangeDetails();
	      if (this._value) return details;
	      this._value = details.inserted = this.char;
	      return details;
	    }
	  }, {
	    key: "extractTail",
	    value: function extractTail() {
	      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      return new ContinuousTailDetails('');
	    } // $FlowFixMe no ideas

	  }, {
	    key: "appendTail",
	    value: function appendTail(tail) {
	      if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
	      return tail.appendTo(this);
	    }
	  }, {
	    key: "append",
	    value: function append(str, flags, tail) {
	      var details = this._appendChar(str[0], flags);

	      if (tail != null) {
	        details.tailShift += this.appendTail(tail).tailShift;
	      }

	      return details;
	    }
	  }, {
	    key: "doCommit",
	    value: function doCommit() {}
	  }, {
	    key: "state",
	    get: function get() {
	      return {
	        _value: this._value,
	        _isRawInput: this._isRawInput
	      };
	    },
	    set: function set(state) {
	      Object.assign(this, state);
	    }
	  }]);

	  return PatternFixedDefinition;
	}();

	var _excluded$3 = ["chunks"];

	var ChunksTailDetails = /*#__PURE__*/function () {
	  /** */
	  function ChunksTailDetails() {
	    var chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	    _classCallCheck(this, ChunksTailDetails);

	    this.chunks = chunks;
	    this.from = from;
	  }

	  _createClass(ChunksTailDetails, [{
	    key: "toString",
	    value: function toString() {
	      return this.chunks.map(String).join('');
	    } // $FlowFixMe no ideas

	  }, {
	    key: "extend",
	    value: function extend(tailChunk) {
	      if (!String(tailChunk)) return;
	      if (isString(tailChunk)) tailChunk = new ContinuousTailDetails(String(tailChunk));
	      var lastChunk = this.chunks[this.chunks.length - 1];
	      var extendLast = lastChunk && ( // if stops are same or tail has no stop
	      lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
	      tailChunk.from === lastChunk.from + lastChunk.toString().length;

	      if (tailChunk instanceof ContinuousTailDetails) {
	        // check the ability to extend previous chunk
	        if (extendLast) {
	          // extend previous chunk
	          lastChunk.extend(tailChunk.toString());
	        } else {
	          // append new chunk
	          this.chunks.push(tailChunk);
	        }
	      } else if (tailChunk instanceof ChunksTailDetails) {
	        if (tailChunk.stop == null) {
	          // unwrap floating chunks to parent, keeping `from` pos
	          var firstTailChunk;

	          while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
	            firstTailChunk = tailChunk.chunks.shift();
	            firstTailChunk.from += tailChunk.from;
	            this.extend(firstTailChunk);
	          }
	        } // if tail chunk still has value


	        if (tailChunk.toString()) {
	          // if chunks contains stops, then popup stop to container
	          tailChunk.stop = tailChunk.blockIndex;
	          this.chunks.push(tailChunk);
	        }
	      }
	    }
	  }, {
	    key: "appendTo",
	    value: function appendTo(masked) {
	      // $FlowFixMe
	      if (!(masked instanceof IMask.MaskedPattern)) {
	        var tail = new ContinuousTailDetails(this.toString());
	        return tail.appendTo(masked);
	      }

	      var details = new ChangeDetails();

	      for (var ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
	        var chunk = this.chunks[ci];

	        var lastBlockIter = masked._mapPosToBlock(masked.value.length);

	        var stop = chunk.stop;
	        var chunkBlock = void 0;

	        if (stop != null && ( // if block not found or stop is behind lastBlock
	        !lastBlockIter || lastBlockIter.index <= stop)) {
	          if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
	          masked._stops.indexOf(stop) >= 0) {
	            details.aggregate(masked._appendPlaceholder(stop));
	          }

	          chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
	        }

	        if (chunkBlock) {
	          var tailDetails = chunkBlock.appendTail(chunk);
	          tailDetails.skip = false; // always ignore skip, it will be set on last

	          details.aggregate(tailDetails);
	          masked._value += tailDetails.inserted; // get not inserted chars

	          var remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
	          if (remainChars) details.aggregate(masked.append(remainChars, {
	            tail: true
	          }));
	        } else {
	          details.aggregate(masked.append(chunk.toString(), {
	            tail: true
	          }));
	        }
	      }
	      return details;
	    }
	  }, {
	    key: "state",
	    get: function get() {
	      return {
	        chunks: this.chunks.map(function (c) {
	          return c.state;
	        }),
	        from: this.from,
	        stop: this.stop,
	        blockIndex: this.blockIndex
	      };
	    },
	    set: function set(state) {
	      var chunks = state.chunks,
	          props = _objectWithoutProperties(state, _excluded$3);

	      Object.assign(this, props);
	      this.chunks = chunks.map(function (cstate) {
	        var chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails(); // $FlowFixMe already checked above

	        chunk.state = cstate;
	        return chunk;
	      });
	    }
	  }, {
	    key: "unshift",
	    value: function unshift(beforePos) {
	      if (!this.chunks.length || beforePos != null && this.from >= beforePos) return '';
	      var chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
	      var ci = 0;

	      while (ci < this.chunks.length) {
	        var chunk = this.chunks[ci];
	        var shiftChar = chunk.unshift(chunkShiftPos);

	        if (chunk.toString()) {
	          // chunk still contains value
	          // but not shifted - means no more available chars to shift
	          if (!shiftChar) break;
	          ++ci;
	        } else {
	          // clean if chunk has no value
	          this.chunks.splice(ci, 1);
	        }

	        if (shiftChar) return shiftChar;
	      }

	      return '';
	    }
	  }, {
	    key: "shift",
	    value: function shift() {
	      if (!this.chunks.length) return '';
	      var ci = this.chunks.length - 1;

	      while (0 <= ci) {
	        var chunk = this.chunks[ci];
	        var shiftChar = chunk.shift();

	        if (chunk.toString()) {
	          // chunk still contains value
	          // but not shifted - means no more available chars to shift
	          if (!shiftChar) break;
	          --ci;
	        } else {
	          // clean if chunk has no value
	          this.chunks.splice(ci, 1);
	        }

	        if (shiftChar) return shiftChar;
	      }

	      return '';
	    }
	  }]);

	  return ChunksTailDetails;
	}();

	var PatternCursor = /*#__PURE__*/function () {
	  function PatternCursor(masked, pos) {
	    _classCallCheck(this, PatternCursor);

	    this.masked = masked;
	    this._log = [];

	    var _ref = masked._mapPosToBlock(pos) || (pos < 0 ? // first
	    {
	      index: 0,
	      offset: 0
	    } : // last
	    {
	      index: this.masked._blocks.length,
	      offset: 0
	    }),
	        offset = _ref.offset,
	        index = _ref.index;

	    this.offset = offset;
	    this.index = index;
	    this.ok = false;
	  }

	  _createClass(PatternCursor, [{
	    key: "block",
	    get: function get() {
	      return this.masked._blocks[this.index];
	    }
	  }, {
	    key: "pos",
	    get: function get() {
	      return this.masked._blockStartPos(this.index) + this.offset;
	    }
	  }, {
	    key: "state",
	    get: function get() {
	      return {
	        index: this.index,
	        offset: this.offset,
	        ok: this.ok
	      };
	    },
	    set: function set(s) {
	      Object.assign(this, s);
	    }
	  }, {
	    key: "pushState",
	    value: function pushState() {
	      this._log.push(this.state);
	    }
	  }, {
	    key: "popState",
	    value: function popState() {
	      var s = this._log.pop();

	      this.state = s;
	      return s;
	    }
	  }, {
	    key: "bindBlock",
	    value: function bindBlock() {
	      if (this.block) return;

	      if (this.index < 0) {
	        this.index = 0;
	        this.offset = 0;
	      }

	      if (this.index >= this.masked._blocks.length) {
	        this.index = this.masked._blocks.length - 1;
	        this.offset = this.block.value.length;
	      }
	    }
	  }, {
	    key: "_pushLeft",
	    value: function _pushLeft(fn) {
	      this.pushState();

	      for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) === null || _this$block === void 0 ? void 0 : _this$block.value.length) || 0) {
	        var _this$block;

	        if (fn()) return this.ok = true;
	      }

	      return this.ok = false;
	    }
	  }, {
	    key: "_pushRight",
	    value: function _pushRight(fn) {
	      this.pushState();

	      for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
	        if (fn()) return this.ok = true;
	      }

	      return this.ok = false;
	    }
	  }, {
	    key: "pushLeftBeforeFilled",
	    value: function pushLeftBeforeFilled() {
	      var _this = this;

	      return this._pushLeft(function () {
	        if (_this.block.isFixed || !_this.block.value) return;
	        _this.offset = _this.block.nearestInputPos(_this.offset, DIRECTION.FORCE_LEFT);
	        if (_this.offset !== 0) return true;
	      });
	    }
	  }, {
	    key: "pushLeftBeforeInput",
	    value: function pushLeftBeforeInput() {
	      var _this2 = this;

	      // cases:
	      // filled input: 00|
	      // optional empty input: 00[]|
	      // nested block: XX<[]>|
	      return this._pushLeft(function () {
	        if (_this2.block.isFixed) return;
	        _this2.offset = _this2.block.nearestInputPos(_this2.offset, DIRECTION.LEFT);
	        return true;
	      });
	    }
	  }, {
	    key: "pushLeftBeforeRequired",
	    value: function pushLeftBeforeRequired() {
	      var _this3 = this;

	      return this._pushLeft(function () {
	        if (_this3.block.isFixed || _this3.block.isOptional && !_this3.block.value) return;
	        _this3.offset = _this3.block.nearestInputPos(_this3.offset, DIRECTION.LEFT);
	        return true;
	      });
	    }
	  }, {
	    key: "pushRightBeforeFilled",
	    value: function pushRightBeforeFilled() {
	      var _this4 = this;

	      return this._pushRight(function () {
	        if (_this4.block.isFixed || !_this4.block.value) return;
	        _this4.offset = _this4.block.nearestInputPos(_this4.offset, DIRECTION.FORCE_RIGHT);
	        if (_this4.offset !== _this4.block.value.length) return true;
	      });
	    }
	  }, {
	    key: "pushRightBeforeInput",
	    value: function pushRightBeforeInput() {
	      var _this5 = this;

	      return this._pushRight(function () {
	        if (_this5.block.isFixed) return; // const o = this.offset;

	        _this5.offset = _this5.block.nearestInputPos(_this5.offset, DIRECTION.NONE); // HACK cases like (STILL DOES NOT WORK FOR NESTED)
	        // aa|X
	        // aa<X|[]>X_    - this will not work
	        // if (o && o === this.offset && this.block instanceof PatternInputDefinition) continue;

	        return true;
	      });
	    }
	  }, {
	    key: "pushRightBeforeRequired",
	    value: function pushRightBeforeRequired() {
	      var _this6 = this;

	      return this._pushRight(function () {
	        if (_this6.block.isFixed || _this6.block.isOptional && !_this6.block.value) return; // TODO check |[*]XX_

	        _this6.offset = _this6.block.nearestInputPos(_this6.offset, DIRECTION.NONE);
	        return true;
	      });
	    }
	  }]);

	  return PatternCursor;
	}();

	/** Masking by RegExp */

	var MaskedRegExp = /*#__PURE__*/function (_Masked) {
	  _inherits(MaskedRegExp, _Masked);

	  var _super = _createSuper(MaskedRegExp);

	  function MaskedRegExp() {
	    _classCallCheck(this, MaskedRegExp);

	    return _super.apply(this, arguments);
	  }

	  _createClass(MaskedRegExp, [{
	    key: "_update",
	    value:
	    /**
	      @override
	      @param {Object} opts
	    */
	    function _update(opts) {
	      if (opts.mask) opts.validate = function (value) {
	        return value.search(opts.mask) >= 0;
	      };

	      _get(_getPrototypeOf(MaskedRegExp.prototype), "_update", this).call(this, opts);
	    }
	  }]);

	  return MaskedRegExp;
	}(Masked);
	IMask.MaskedRegExp = MaskedRegExp;

	var _excluded$2 = ["_blocks"];

	/**
	  Pattern mask
	  @param {Object} opts
	  @param {Object} opts.blocks
	  @param {Object} opts.definitions
	  @param {string} opts.placeholderChar
	  @param {boolean} opts.lazy
	*/
	var MaskedPattern = /*#__PURE__*/function (_Masked) {
	  _inherits(MaskedPattern, _Masked);

	  var _super = _createSuper(MaskedPattern);

	  /** */

	  /** */

	  /** Single char for empty input */

	  /** Show placeholder only when needed */
	  function MaskedPattern() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, MaskedPattern);

	    // TODO type $Shape<MaskedPatternOptions>={} does not work
	    opts.definitions = Object.assign({}, DEFAULT_INPUT_DEFINITIONS, opts.definitions);
	    return _super.call(this, Object.assign({}, MaskedPattern.DEFAULTS, opts));
	  }
	  /**
	    @override
	    @param {Object} opts
	  */


	  _createClass(MaskedPattern, [{
	    key: "_update",
	    value: function _update() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      opts.definitions = Object.assign({}, this.definitions, opts.definitions);

	      _get(_getPrototypeOf(MaskedPattern.prototype), "_update", this).call(this, opts);

	      this._rebuildMask();
	    }
	    /** */

	  }, {
	    key: "_rebuildMask",
	    value: function _rebuildMask() {
	      var _this = this;

	      var defs = this.definitions;
	      this._blocks = [];
	      this._stops = [];
	      this._maskedBlocks = {};
	      var pattern = this.mask;
	      if (!pattern || !defs) return;
	      var unmaskingBlock = false;
	      var optionalBlock = false;

	      for (var i = 0; i < pattern.length; ++i) {
	        if (this.blocks) {
	          var _ret = function () {
	            var p = pattern.slice(i);
	            var bNames = Object.keys(_this.blocks).filter(function (bName) {
	              return p.indexOf(bName) === 0;
	            }); // order by key length

	            bNames.sort(function (a, b) {
	              return b.length - a.length;
	            }); // use block name with max length

	            var bName = bNames[0];

	            if (bName) {
	              // $FlowFixMe no ideas
	              var maskedBlock = createMask(Object.assign({
	                parent: _this,
	                lazy: _this.lazy,
	                eager: _this.eager,
	                placeholderChar: _this.placeholderChar,
	                overwrite: _this.overwrite
	              }, _this.blocks[bName]));

	              if (maskedBlock) {
	                _this._blocks.push(maskedBlock); // store block index


	                if (!_this._maskedBlocks[bName]) _this._maskedBlocks[bName] = [];

	                _this._maskedBlocks[bName].push(_this._blocks.length - 1);
	              }

	              i += bName.length - 1;
	              return "continue";
	            }
	          }();

	          if (_ret === "continue") continue;
	        }

	        var char = pattern[i];
	        var isInput = (char in defs);

	        if (char === MaskedPattern.STOP_CHAR) {
	          this._stops.push(this._blocks.length);

	          continue;
	        }

	        if (char === '{' || char === '}') {
	          unmaskingBlock = !unmaskingBlock;
	          continue;
	        }

	        if (char === '[' || char === ']') {
	          optionalBlock = !optionalBlock;
	          continue;
	        }

	        if (char === MaskedPattern.ESCAPE_CHAR) {
	          ++i;
	          char = pattern[i];
	          if (!char) break;
	          isInput = false;
	        }

	        var def = isInput ? new PatternInputDefinition({
	          parent: this,
	          lazy: this.lazy,
	          eager: this.eager,
	          placeholderChar: this.placeholderChar,
	          mask: defs[char],
	          isOptional: optionalBlock
	        }) : new PatternFixedDefinition({
	          char: char,
	          eager: this.eager,
	          isUnmasking: unmaskingBlock
	        });

	        this._blocks.push(def);
	      }
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "state",
	    get: function get() {
	      return Object.assign({}, _get(_getPrototypeOf(MaskedPattern.prototype), "state", this), {
	        _blocks: this._blocks.map(function (b) {
	          return b.state;
	        })
	      });
	    },
	    set: function set(state) {
	      var _blocks = state._blocks,
	          maskedState = _objectWithoutProperties(state, _excluded$2);

	      this._blocks.forEach(function (b, bi) {
	        return b.state = _blocks[bi];
	      });

	      _set(_getPrototypeOf(MaskedPattern.prototype), "state", maskedState, this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "reset",
	    value: function reset() {
	      _get(_getPrototypeOf(MaskedPattern.prototype), "reset", this).call(this);

	      this._blocks.forEach(function (b) {
	        return b.reset();
	      });
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "isComplete",
	    get: function get() {
	      return this._blocks.every(function (b) {
	        return b.isComplete;
	      });
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "isFilled",
	    get: function get() {
	      return this._blocks.every(function (b) {
	        return b.isFilled;
	      });
	    }
	  }, {
	    key: "isFixed",
	    get: function get() {
	      return this._blocks.every(function (b) {
	        return b.isFixed;
	      });
	    }
	  }, {
	    key: "isOptional",
	    get: function get() {
	      return this._blocks.every(function (b) {
	        return b.isOptional;
	      });
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doCommit",
	    value: function doCommit() {
	      this._blocks.forEach(function (b) {
	        return b.doCommit();
	      });

	      _get(_getPrototypeOf(MaskedPattern.prototype), "doCommit", this).call(this);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "unmaskedValue",
	    get: function get() {
	      return this._blocks.reduce(function (str, b) {
	        return str += b.unmaskedValue;
	      }, '');
	    },
	    set: function set(unmaskedValue) {
	      _set(_getPrototypeOf(MaskedPattern.prototype), "unmaskedValue", unmaskedValue, this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "value",
	    get: function get() {
	      // TODO return _value when not in change?
	      return this._blocks.reduce(function (str, b) {
	        return str += b.value;
	      }, '');
	    },
	    set: function set(value) {
	      _set(_getPrototypeOf(MaskedPattern.prototype), "value", value, this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "appendTail",
	    value: function appendTail(tail) {
	      return _get(_getPrototypeOf(MaskedPattern.prototype), "appendTail", this).call(this, tail).aggregate(this._appendPlaceholder());
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "_appendEager",
	    value: function _appendEager() {
	      var _this$_mapPosToBlock;

	      var details = new ChangeDetails();
	      var startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.value.length)) === null || _this$_mapPosToBlock === void 0 ? void 0 : _this$_mapPosToBlock.index;
	      if (startBlockIndex == null) return details; // TODO test if it works for nested pattern masks

	      if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;

	      for (var bi = startBlockIndex; bi < this._blocks.length; ++bi) {
	        var d = this._blocks[bi]._appendEager();

	        if (!d.inserted) break;
	        details.aggregate(d);
	      }

	      return details;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "_appendCharRaw",
	    value: function _appendCharRaw(ch) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      var blockIter = this._mapPosToBlock(this.value.length);

	      var details = new ChangeDetails();
	      if (!blockIter) return details;

	      for (var bi = blockIter.index;; ++bi) {
	        var _flags$_beforeTailSta;

	        var _block = this._blocks[bi];
	        if (!_block) break;

	        var blockDetails = _block._appendChar(ch, Object.assign({}, flags, {
	          _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) === null || _flags$_beforeTailSta === void 0 ? void 0 : _flags$_beforeTailSta._blocks[bi]
	        }));

	        var skip = blockDetails.skip;
	        details.aggregate(blockDetails);
	        if (skip || blockDetails.rawInserted) break; // go next char
	      }

	      return details;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "extractTail",
	    value: function extractTail() {
	      var _this2 = this;

	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      var chunkTail = new ChunksTailDetails();
	      if (fromPos === toPos) return chunkTail;

	      this._forEachBlocksInRange(fromPos, toPos, function (b, bi, bFromPos, bToPos) {
	        var blockChunk = b.extractTail(bFromPos, bToPos);
	        blockChunk.stop = _this2._findStopBefore(bi);
	        blockChunk.from = _this2._blockStartPos(bi);
	        if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
	        chunkTail.extend(blockChunk);
	      });

	      return chunkTail;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "extractInput",
	    value: function extractInput() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      var flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	      if (fromPos === toPos) return '';
	      var input = '';

	      this._forEachBlocksInRange(fromPos, toPos, function (b, _, fromPos, toPos) {
	        input += b.extractInput(fromPos, toPos, flags);
	      });

	      return input;
	    }
	  }, {
	    key: "_findStopBefore",
	    value: function _findStopBefore(blockIndex) {
	      var stopBefore;

	      for (var si = 0; si < this._stops.length; ++si) {
	        var stop = this._stops[si];
	        if (stop <= blockIndex) stopBefore = stop;else break;
	      }

	      return stopBefore;
	    }
	    /** Appends placeholder depending on laziness */

	  }, {
	    key: "_appendPlaceholder",
	    value: function _appendPlaceholder(toBlockIndex) {
	      var _this3 = this;

	      var details = new ChangeDetails();
	      if (this.lazy && toBlockIndex == null) return details;

	      var startBlockIter = this._mapPosToBlock(this.value.length);

	      if (!startBlockIter) return details;
	      var startBlockIndex = startBlockIter.index;
	      var endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;

	      this._blocks.slice(startBlockIndex, endBlockIndex).forEach(function (b) {
	        if (!b.lazy || toBlockIndex != null) {
	          // $FlowFixMe `_blocks` may not be present
	          var args = b._blocks != null ? [b._blocks.length] : [];

	          var bDetails = b._appendPlaceholder.apply(b, args);

	          _this3._value += bDetails.inserted;
	          details.aggregate(bDetails);
	        }
	      });

	      return details;
	    }
	    /** Finds block in pos */

	  }, {
	    key: "_mapPosToBlock",
	    value: function _mapPosToBlock(pos) {
	      var accVal = '';

	      for (var bi = 0; bi < this._blocks.length; ++bi) {
	        var _block2 = this._blocks[bi];
	        var blockStartPos = accVal.length;
	        accVal += _block2.value;

	        if (pos <= accVal.length) {
	          return {
	            index: bi,
	            offset: pos - blockStartPos
	          };
	        }
	      }
	    }
	    /** */

	  }, {
	    key: "_blockStartPos",
	    value: function _blockStartPos(blockIndex) {
	      return this._blocks.slice(0, blockIndex).reduce(function (pos, b) {
	        return pos += b.value.length;
	      }, 0);
	    }
	    /** */

	  }, {
	    key: "_forEachBlocksInRange",
	    value: function _forEachBlocksInRange(fromPos) {
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      var fn = arguments.length > 2 ? arguments[2] : undefined;

	      var fromBlockIter = this._mapPosToBlock(fromPos);

	      if (fromBlockIter) {
	        var toBlockIter = this._mapPosToBlock(toPos); // process first block


	        var isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
	        var fromBlockStartPos = fromBlockIter.offset;
	        var fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
	        fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);

	        if (toBlockIter && !isSameBlock) {
	          // process intermediate blocks
	          for (var bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
	            fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
	          } // process last block


	          fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
	        }
	      }
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "remove",
	    value: function remove() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

	      var removeDetails = _get(_getPrototypeOf(MaskedPattern.prototype), "remove", this).call(this, fromPos, toPos);

	      this._forEachBlocksInRange(fromPos, toPos, function (b, _, bFromPos, bToPos) {
	        removeDetails.aggregate(b.remove(bFromPos, bToPos));
	      });

	      return removeDetails;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "nearestInputPos",
	    value: function nearestInputPos(cursorPos) {
	      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
	      if (!this._blocks.length) return 0;
	      var cursor = new PatternCursor(this, cursorPos);

	      if (direction === DIRECTION.NONE) {
	        // -------------------------------------------------
	        // NONE should only go out from fixed to the right!
	        // -------------------------------------------------
	        if (cursor.pushRightBeforeInput()) return cursor.pos;
	        cursor.popState();
	        if (cursor.pushLeftBeforeInput()) return cursor.pos;
	        return this.value.length;
	      } // FORCE is only about a|* otherwise is 0


	      if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
	        // try to break fast when *|a
	        if (direction === DIRECTION.LEFT) {
	          cursor.pushRightBeforeFilled();
	          if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
	          cursor.popState();
	        } // forward flow


	        cursor.pushLeftBeforeInput();
	        cursor.pushLeftBeforeRequired();
	        cursor.pushLeftBeforeFilled(); // backward flow

	        if (direction === DIRECTION.LEFT) {
	          cursor.pushRightBeforeInput();
	          cursor.pushRightBeforeRequired();
	          if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
	          cursor.popState();
	          if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
	          cursor.popState();
	        }

	        if (cursor.ok) return cursor.pos;
	        if (direction === DIRECTION.FORCE_LEFT) return 0;
	        cursor.popState();
	        if (cursor.ok) return cursor.pos;
	        cursor.popState();
	        if (cursor.ok) return cursor.pos; // cursor.popState();
	        // if (
	        //   cursor.pushRightBeforeInput() &&
	        //   // TODO HACK for lazy if has aligned left inside fixed and has came to the start - use start position
	        //   (!this.lazy || this.extractInput())
	        // ) return cursor.pos;

	        return 0;
	      }

	      if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
	        // forward flow
	        cursor.pushRightBeforeInput();
	        cursor.pushRightBeforeRequired();
	        if (cursor.pushRightBeforeFilled()) return cursor.pos;
	        if (direction === DIRECTION.FORCE_RIGHT) return this.value.length; // backward flow

	        cursor.popState();
	        if (cursor.ok) return cursor.pos;
	        cursor.popState();
	        if (cursor.ok) return cursor.pos;
	        return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
	      }

	      return cursorPos;
	    }
	    /** Get block by name */

	  }, {
	    key: "maskedBlock",
	    value: function maskedBlock(name) {
	      return this.maskedBlocks(name)[0];
	    }
	    /** Get all blocks by name */

	  }, {
	    key: "maskedBlocks",
	    value: function maskedBlocks(name) {
	      var _this4 = this;

	      var indices = this._maskedBlocks[name];
	      if (!indices) return [];
	      return indices.map(function (gi) {
	        return _this4._blocks[gi];
	      });
	    }
	  }]);

	  return MaskedPattern;
	}(Masked);
	MaskedPattern.DEFAULTS = {
	  lazy: true,
	  placeholderChar: '_'
	};
	MaskedPattern.STOP_CHAR = '`';
	MaskedPattern.ESCAPE_CHAR = '\\';
	MaskedPattern.InputDefinition = PatternInputDefinition;
	MaskedPattern.FixedDefinition = PatternFixedDefinition;
	IMask.MaskedPattern = MaskedPattern;

	/** Pattern which accepts ranges */

	var MaskedRange = /*#__PURE__*/function (_MaskedPattern) {
	  _inherits(MaskedRange, _MaskedPattern);

	  var _super = _createSuper(MaskedRange);

	  function MaskedRange() {
	    _classCallCheck(this, MaskedRange);

	    return _super.apply(this, arguments);
	  }

	  _createClass(MaskedRange, [{
	    key: "_matchFrom",
	    get:
	    /**
	      Optionally sets max length of pattern.
	      Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
	    */

	    /** Min bound */

	    /** Max bound */

	    /** */
	    function get() {
	      return this.maxLength - String(this.from).length;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "_update",
	    value: function _update(opts) {
	      // TODO type
	      opts = Object.assign({
	        to: this.to || 0,
	        from: this.from || 0,
	        maxLength: this.maxLength || 0
	      }, opts);
	      var maxLength = String(opts.to).length;
	      if (opts.maxLength != null) maxLength = Math.max(maxLength, opts.maxLength);
	      opts.maxLength = maxLength;
	      var fromStr = String(opts.from).padStart(maxLength, '0');
	      var toStr = String(opts.to).padStart(maxLength, '0');
	      var sameCharsCount = 0;

	      while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) {
	        ++sameCharsCount;
	      }

	      opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, '\\0') + '0'.repeat(maxLength - sameCharsCount);

	      _get(_getPrototypeOf(MaskedRange.prototype), "_update", this).call(this, opts);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "isComplete",
	    get: function get() {
	      return _get(_getPrototypeOf(MaskedRange.prototype), "isComplete", this) && Boolean(this.value);
	    }
	  }, {
	    key: "boundaries",
	    value: function boundaries(str) {
	      var minstr = '';
	      var maxstr = '';

	      var _ref = str.match(/^(\D*)(\d*)(\D*)/) || [],
	          _ref2 = _slicedToArray(_ref, 3),
	          placeholder = _ref2[1],
	          num = _ref2[2];

	      if (num) {
	        minstr = '0'.repeat(placeholder.length) + num;
	        maxstr = '9'.repeat(placeholder.length) + num;
	      }

	      minstr = minstr.padEnd(this.maxLength, '0');
	      maxstr = maxstr.padEnd(this.maxLength, '9');
	      return [minstr, maxstr];
	    } // TODO str is a single char everytime

	    /**
	      @override
	    */

	  }, {
	    key: "doPrepare",
	    value: function doPrepare(ch) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var details;

	      var _normalizePrepare = normalizePrepare(_get(_getPrototypeOf(MaskedRange.prototype), "doPrepare", this).call(this, ch.replace(/\D/g, ''), flags));

	      var _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2);

	      ch = _normalizePrepare2[0];
	      details = _normalizePrepare2[1];
	      if (!this.autofix || !ch) return ch;
	      var fromStr = String(this.from).padStart(this.maxLength, '0');
	      var toStr = String(this.to).padStart(this.maxLength, '0');
	      var nextVal = this.value + ch;
	      if (nextVal.length > this.maxLength) return '';

	      var _this$boundaries = this.boundaries(nextVal),
	          _this$boundaries2 = _slicedToArray(_this$boundaries, 2),
	          minstr = _this$boundaries2[0],
	          maxstr = _this$boundaries2[1];

	      if (Number(maxstr) < this.from) return fromStr[nextVal.length - 1];

	      if (Number(minstr) > this.to) {
	        if (this.autofix === 'pad' && nextVal.length < this.maxLength) {
	          return ['', details.aggregate(this.append(fromStr[nextVal.length - 1] + ch, flags))];
	        }

	        return toStr[nextVal.length - 1];
	      }

	      return ch;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doValidate",
	    value: function doValidate() {
	      var _get2;

	      var str = this.value;
	      var firstNonZero = str.search(/[^0]/);
	      if (firstNonZero === -1 && str.length <= this._matchFrom) return true;

	      var _this$boundaries3 = this.boundaries(str),
	          _this$boundaries4 = _slicedToArray(_this$boundaries3, 2),
	          minstr = _this$boundaries4[0],
	          maxstr = _this$boundaries4[1];

	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.from <= Number(maxstr) && Number(minstr) <= this.to && (_get2 = _get(_getPrototypeOf(MaskedRange.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args));
	    }
	  }]);

	  return MaskedRange;
	}(MaskedPattern);
	IMask.MaskedRange = MaskedRange;

	/** Date mask */

	var MaskedDate = /*#__PURE__*/function (_MaskedPattern) {
	  _inherits(MaskedDate, _MaskedPattern);

	  var _super = _createSuper(MaskedDate);

	  /** Pattern mask for date according to {@link MaskedDate#format} */

	  /** Start date */

	  /** End date */

	  /** */

	  /**
	    @param {Object} opts
	  */
	  function MaskedDate(opts) {
	    _classCallCheck(this, MaskedDate);

	    return _super.call(this, Object.assign({}, MaskedDate.DEFAULTS, opts));
	  }
	  /**
	    @override
	  */


	  _createClass(MaskedDate, [{
	    key: "_update",
	    value: function _update(opts) {
	      if (opts.mask === Date) delete opts.mask;
	      if (opts.pattern) opts.mask = opts.pattern;
	      var blocks = opts.blocks;
	      opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS()); // adjust year block

	      if (opts.min) opts.blocks.Y.from = opts.min.getFullYear();
	      if (opts.max) opts.blocks.Y.to = opts.max.getFullYear();

	      if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
	        opts.blocks.m.from = opts.min.getMonth() + 1;
	        opts.blocks.m.to = opts.max.getMonth() + 1;

	        if (opts.blocks.m.from === opts.blocks.m.to) {
	          opts.blocks.d.from = opts.min.getDate();
	          opts.blocks.d.to = opts.max.getDate();
	        }
	      }

	      Object.assign(opts.blocks, this.blocks, blocks); // add autofix

	      Object.keys(opts.blocks).forEach(function (bk) {
	        var b = opts.blocks[bk];
	        if (!('autofix' in b) && 'autofix' in opts) b.autofix = opts.autofix;
	      });

	      _get(_getPrototypeOf(MaskedDate.prototype), "_update", this).call(this, opts);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doValidate",
	    value: function doValidate() {
	      var _get2;

	      var date = this.date;

	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return (_get2 = _get(_getPrototypeOf(MaskedDate.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args)) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
	    }
	    /** Checks if date is exists */

	  }, {
	    key: "isDateExist",
	    value: function isDateExist(str) {
	      return this.format(this.parse(str, this), this).indexOf(str) >= 0;
	    }
	    /** Parsed Date */

	  }, {
	    key: "date",
	    get: function get() {
	      return this.typedValue;
	    },
	    set: function set(date) {
	      this.typedValue = date;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "typedValue",
	    get: function get() {
	      return this.isComplete ? _get(_getPrototypeOf(MaskedDate.prototype), "typedValue", this) : null;
	    },
	    set: function set(value) {
	      _set(_getPrototypeOf(MaskedDate.prototype), "typedValue", value, this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "maskEquals",
	    value: function maskEquals(mask) {
	      return mask === Date || _get(_getPrototypeOf(MaskedDate.prototype), "maskEquals", this).call(this, mask);
	    }
	  }]);

	  return MaskedDate;
	}(MaskedPattern);
	MaskedDate.DEFAULTS = {
	  pattern: 'd{.}`m{.}`Y',
	  format: function format(date) {
	    if (!date) return '';
	    var day = String(date.getDate()).padStart(2, '0');
	    var month = String(date.getMonth() + 1).padStart(2, '0');
	    var year = date.getFullYear();
	    return [day, month, year].join('.');
	  },
	  parse: function parse(str) {
	    var _str$split = str.split('.'),
	        _str$split2 = _slicedToArray(_str$split, 3),
	        day = _str$split2[0],
	        month = _str$split2[1],
	        year = _str$split2[2];

	    return new Date(year, month - 1, day);
	  }
	};

	MaskedDate.GET_DEFAULT_BLOCKS = function () {
	  return {
	    d: {
	      mask: MaskedRange,
	      from: 1,
	      to: 31,
	      maxLength: 2
	    },
	    m: {
	      mask: MaskedRange,
	      from: 1,
	      to: 12,
	      maxLength: 2
	    },
	    Y: {
	      mask: MaskedRange,
	      from: 1900,
	      to: 9999
	    }
	  };
	};

	IMask.MaskedDate = MaskedDate;

	/**
	  Generic element API to use with mask
	  @interface
	*/
	var MaskElement = /*#__PURE__*/function () {
	  function MaskElement() {
	    _classCallCheck(this, MaskElement);
	  }

	  _createClass(MaskElement, [{
	    key: "selectionStart",
	    get:
	    /** */

	    /** */

	    /** */

	    /** Safely returns selection start */
	    function get() {
	      var start;

	      try {
	        start = this._unsafeSelectionStart;
	      } catch (e) {}

	      return start != null ? start : this.value.length;
	    }
	    /** Safely returns selection end */

	  }, {
	    key: "selectionEnd",
	    get: function get() {
	      var end;

	      try {
	        end = this._unsafeSelectionEnd;
	      } catch (e) {}

	      return end != null ? end : this.value.length;
	    }
	    /** Safely sets element selection */

	  }, {
	    key: "select",
	    value: function select(start, end) {
	      if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;

	      try {
	        this._unsafeSelect(start, end);
	      } catch (e) {}
	    }
	    /** Should be overriden in subclasses */

	  }, {
	    key: "_unsafeSelect",
	    value: function _unsafeSelect(start, end) {}
	    /** Should be overriden in subclasses */

	  }, {
	    key: "isActive",
	    get: function get() {
	      return false;
	    }
	    /** Should be overriden in subclasses */

	  }, {
	    key: "bindEvents",
	    value: function bindEvents(handlers) {}
	    /** Should be overriden in subclasses */

	  }, {
	    key: "unbindEvents",
	    value: function unbindEvents() {}
	  }]);

	  return MaskElement;
	}();
	IMask.MaskElement = MaskElement;

	/** Bridge between HTMLElement and {@link Masked} */

	var HTMLMaskElement = /*#__PURE__*/function (_MaskElement) {
	  _inherits(HTMLMaskElement, _MaskElement);

	  var _super = _createSuper(HTMLMaskElement);

	  /** Mapping between HTMLElement events and mask internal events */

	  /** HTMLElement to use mask on */

	  /**
	    @param {HTMLInputElement|HTMLTextAreaElement} input
	  */
	  function HTMLMaskElement(input) {
	    var _this;

	    _classCallCheck(this, HTMLMaskElement);

	    _this = _super.call(this);
	    _this.input = input;
	    _this._handlers = {};
	    return _this;
	  }
	  /** */
	  // $FlowFixMe https://github.com/facebook/flow/issues/2839


	  _createClass(HTMLMaskElement, [{
	    key: "rootElement",
	    get: function get() {
	      var _this$input$getRootNo, _this$input$getRootNo2, _this$input;

	      return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) === null || _this$input$getRootNo2 === void 0 ? void 0 : _this$input$getRootNo2.call(_this$input)) !== null && _this$input$getRootNo !== void 0 ? _this$input$getRootNo : document;
	    }
	    /**
	      Is element in focus
	      @readonly
	    */

	  }, {
	    key: "isActive",
	    get: function get() {
	      //$FlowFixMe
	      return this.input === this.rootElement.activeElement;
	    }
	    /**
	      Returns HTMLElement selection start
	      @override
	    */

	  }, {
	    key: "_unsafeSelectionStart",
	    get: function get() {
	      return this.input.selectionStart;
	    }
	    /**
	      Returns HTMLElement selection end
	      @override
	    */

	  }, {
	    key: "_unsafeSelectionEnd",
	    get: function get() {
	      return this.input.selectionEnd;
	    }
	    /**
	      Sets HTMLElement selection
	      @override
	    */

	  }, {
	    key: "_unsafeSelect",
	    value: function _unsafeSelect(start, end) {
	      this.input.setSelectionRange(start, end);
	    }
	    /**
	      HTMLElement value
	      @override
	    */

	  }, {
	    key: "value",
	    get: function get() {
	      return this.input.value;
	    },
	    set: function set(value) {
	      this.input.value = value;
	    }
	    /**
	      Binds HTMLElement events to mask internal events
	      @override
	    */

	  }, {
	    key: "bindEvents",
	    value: function bindEvents(handlers) {
	      var _this2 = this;

	      Object.keys(handlers).forEach(function (event) {
	        return _this2._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]);
	      });
	    }
	    /**
	      Unbinds HTMLElement events to mask internal events
	      @override
	    */

	  }, {
	    key: "unbindEvents",
	    value: function unbindEvents() {
	      var _this3 = this;

	      Object.keys(this._handlers).forEach(function (event) {
	        return _this3._toggleEventHandler(event);
	      });
	    }
	    /** */

	  }, {
	    key: "_toggleEventHandler",
	    value: function _toggleEventHandler(event, handler) {
	      if (this._handlers[event]) {
	        this.input.removeEventListener(event, this._handlers[event]);
	        delete this._handlers[event];
	      }

	      if (handler) {
	        this.input.addEventListener(event, handler);
	        this._handlers[event] = handler;
	      }
	    }
	  }]);

	  return HTMLMaskElement;
	}(MaskElement);
	HTMLMaskElement.EVENTS_MAP = {
	  selectionChange: 'keydown',
	  input: 'input',
	  drop: 'drop',
	  click: 'click',
	  focus: 'focus',
	  commit: 'blur'
	};
	IMask.HTMLMaskElement = HTMLMaskElement;

	var HTMLContenteditableMaskElement = /*#__PURE__*/function (_HTMLMaskElement) {
	  _inherits(HTMLContenteditableMaskElement, _HTMLMaskElement);

	  var _super = _createSuper(HTMLContenteditableMaskElement);

	  function HTMLContenteditableMaskElement() {
	    _classCallCheck(this, HTMLContenteditableMaskElement);

	    return _super.apply(this, arguments);
	  }

	  _createClass(HTMLContenteditableMaskElement, [{
	    key: "_unsafeSelectionStart",
	    get:
	    /**
	      Returns HTMLElement selection start
	      @override
	    */
	    function get() {
	      var root = this.rootElement;
	      var selection = root.getSelection && root.getSelection();
	      var anchorOffset = selection && selection.anchorOffset;
	      var focusOffset = selection && selection.focusOffset;

	      if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
	        return anchorOffset;
	      }

	      return focusOffset;
	    }
	    /**
	      Returns HTMLElement selection end
	      @override
	    */

	  }, {
	    key: "_unsafeSelectionEnd",
	    get: function get() {
	      var root = this.rootElement;
	      var selection = root.getSelection && root.getSelection();
	      var anchorOffset = selection && selection.anchorOffset;
	      var focusOffset = selection && selection.focusOffset;

	      if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
	        return anchorOffset;
	      }

	      return focusOffset;
	    }
	    /**
	      Sets HTMLElement selection
	      @override
	    */

	  }, {
	    key: "_unsafeSelect",
	    value: function _unsafeSelect(start, end) {
	      if (!this.rootElement.createRange) return;
	      var range = this.rootElement.createRange();
	      range.setStart(this.input.firstChild || this.input, start);
	      range.setEnd(this.input.lastChild || this.input, end);
	      var root = this.rootElement;
	      var selection = root.getSelection && root.getSelection();

	      if (selection) {
	        selection.removeAllRanges();
	        selection.addRange(range);
	      }
	    }
	    /**
	      HTMLElement value
	      @override
	    */

	  }, {
	    key: "value",
	    get: function get() {
	      // $FlowFixMe
	      return this.input.textContent;
	    },
	    set: function set(value) {
	      this.input.textContent = value;
	    }
	  }]);

	  return HTMLContenteditableMaskElement;
	}(HTMLMaskElement);
	IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;

	var _excluded$1 = ["mask"];
	/** Listens to element events and controls changes between element and {@link Masked} */

	var InputMask = /*#__PURE__*/function () {
	  /**
	    View element
	    @readonly
	  */

	  /**
	    Internal {@link Masked} model
	    @readonly
	  */

	  /**
	    @param {MaskElement|HTMLInputElement|HTMLTextAreaElement} el
	    @param {Object} opts
	  */
	  function InputMask(el, opts) {
	    _classCallCheck(this, InputMask);

	    this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' ? new HTMLContenteditableMaskElement(el) : new HTMLMaskElement(el);
	    this.masked = createMask(opts);
	    this._listeners = {};
	    this._value = '';
	    this._unmaskedValue = '';
	    this._saveSelection = this._saveSelection.bind(this);
	    this._onInput = this._onInput.bind(this);
	    this._onChange = this._onChange.bind(this);
	    this._onDrop = this._onDrop.bind(this);
	    this._onFocus = this._onFocus.bind(this);
	    this._onClick = this._onClick.bind(this);
	    this.alignCursor = this.alignCursor.bind(this);
	    this.alignCursorFriendly = this.alignCursorFriendly.bind(this);

	    this._bindEvents(); // refresh


	    this.updateValue();

	    this._onChange();
	  }
	  /** Read or update mask */


	  _createClass(InputMask, [{
	    key: "mask",
	    get: function get() {
	      return this.masked.mask;
	    },
	    set: function set(mask) {
	      if (this.maskEquals(mask)) return; // $FlowFixMe No ideas ... after update

	      if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
	        this.masked.updateOptions({
	          mask: mask
	        });
	        return;
	      }

	      var masked = createMask({
	        mask: mask
	      });
	      masked.unmaskedValue = this.masked.unmaskedValue;
	      this.masked = masked;
	    }
	    /** Raw value */

	  }, {
	    key: "maskEquals",
	    value: function maskEquals(mask) {
	      var _this$masked;

	      return mask == null || ((_this$masked = this.masked) === null || _this$masked === void 0 ? void 0 : _this$masked.maskEquals(mask));
	    }
	  }, {
	    key: "value",
	    get: function get() {
	      return this._value;
	    },
	    set: function set(str) {
	      this.masked.value = str;
	      this.updateControl();
	      this.alignCursor();
	    }
	    /** Unmasked value */

	  }, {
	    key: "unmaskedValue",
	    get: function get() {
	      return this._unmaskedValue;
	    },
	    set: function set(str) {
	      this.masked.unmaskedValue = str;
	      this.updateControl();
	      this.alignCursor();
	    }
	    /** Typed unmasked value */

	  }, {
	    key: "typedValue",
	    get: function get() {
	      return this.masked.typedValue;
	    },
	    set: function set(val) {
	      this.masked.typedValue = val;
	      this.updateControl();
	      this.alignCursor();
	    }
	    /**
	      Starts listening to element events
	      @protected
	    */

	  }, {
	    key: "_bindEvents",
	    value: function _bindEvents() {
	      this.el.bindEvents({
	        selectionChange: this._saveSelection,
	        input: this._onInput,
	        drop: this._onDrop,
	        click: this._onClick,
	        focus: this._onFocus,
	        commit: this._onChange
	      });
	    }
	    /**
	      Stops listening to element events
	      @protected
	     */

	  }, {
	    key: "_unbindEvents",
	    value: function _unbindEvents() {
	      if (this.el) this.el.unbindEvents();
	    }
	    /**
	      Fires custom event
	      @protected
	     */

	  }, {
	    key: "_fireEvent",
	    value: function _fireEvent(ev) {
	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var listeners = this._listeners[ev];
	      if (!listeners) return;
	      listeners.forEach(function (l) {
	        return l.apply(void 0, args);
	      });
	    }
	    /**
	      Current selection start
	      @readonly
	    */

	  }, {
	    key: "selectionStart",
	    get: function get() {
	      return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
	    }
	    /** Current cursor position */

	  }, {
	    key: "cursorPos",
	    get: function get() {
	      return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
	    },
	    set: function set(pos) {
	      if (!this.el || !this.el.isActive) return;
	      this.el.select(pos, pos);

	      this._saveSelection();
	    }
	    /**
	      Stores current selection
	      @protected
	    */

	  }, {
	    key: "_saveSelection",
	    value: function
	      /* ev */
	    _saveSelection() {
	      if (this.value !== this.el.value) {
	        console.warn('Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.'); // eslint-disable-line no-console
	      }

	      this._selection = {
	        start: this.selectionStart,
	        end: this.cursorPos
	      };
	    }
	    /** Syncronizes model value from view */

	  }, {
	    key: "updateValue",
	    value: function updateValue() {
	      this.masked.value = this.el.value;
	      this._value = this.masked.value;
	    }
	    /** Syncronizes view from model value, fires change events */

	  }, {
	    key: "updateControl",
	    value: function updateControl() {
	      var newUnmaskedValue = this.masked.unmaskedValue;
	      var newValue = this.masked.value;
	      var isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
	      this._unmaskedValue = newUnmaskedValue;
	      this._value = newValue;
	      if (this.el.value !== newValue) this.el.value = newValue;
	      if (isChanged) this._fireChangeEvents();
	    }
	    /** Updates options with deep equal check, recreates @{link Masked} model if mask type changes */

	  }, {
	    key: "updateOptions",
	    value: function updateOptions(opts) {
	      var mask = opts.mask,
	          restOpts = _objectWithoutProperties(opts, _excluded$1);

	      var updateMask = !this.maskEquals(mask);
	      var updateOpts = !objectIncludes(this.masked, restOpts);
	      if (updateMask) this.mask = mask;
	      if (updateOpts) this.masked.updateOptions(restOpts);
	      if (updateMask || updateOpts) this.updateControl();
	    }
	    /** Updates cursor */

	  }, {
	    key: "updateCursor",
	    value: function updateCursor(cursorPos) {
	      if (cursorPos == null) return;
	      this.cursorPos = cursorPos; // also queue change cursor for mobile browsers

	      this._delayUpdateCursor(cursorPos);
	    }
	    /**
	      Delays cursor update to support mobile browsers
	      @private
	    */

	  }, {
	    key: "_delayUpdateCursor",
	    value: function _delayUpdateCursor(cursorPos) {
	      var _this = this;

	      this._abortUpdateCursor();

	      this._changingCursorPos = cursorPos;
	      this._cursorChanging = setTimeout(function () {
	        if (!_this.el) return; // if was destroyed

	        _this.cursorPos = _this._changingCursorPos;

	        _this._abortUpdateCursor();
	      }, 10);
	    }
	    /**
	      Fires custom events
	      @protected
	    */

	  }, {
	    key: "_fireChangeEvents",
	    value: function _fireChangeEvents() {
	      this._fireEvent('accept', this._inputEvent);

	      if (this.masked.isComplete) this._fireEvent('complete', this._inputEvent);
	    }
	    /**
	      Aborts delayed cursor update
	      @private
	    */

	  }, {
	    key: "_abortUpdateCursor",
	    value: function _abortUpdateCursor() {
	      if (this._cursorChanging) {
	        clearTimeout(this._cursorChanging);
	        delete this._cursorChanging;
	      }
	    }
	    /** Aligns cursor to nearest available position */

	  }, {
	    key: "alignCursor",
	    value: function alignCursor() {
	      this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
	    }
	    /** Aligns cursor only if selection is empty */

	  }, {
	    key: "alignCursorFriendly",
	    value: function alignCursorFriendly() {
	      if (this.selectionStart !== this.cursorPos) return; // skip if range is selected

	      this.alignCursor();
	    }
	    /** Adds listener on custom event */

	  }, {
	    key: "on",
	    value: function on(ev, handler) {
	      if (!this._listeners[ev]) this._listeners[ev] = [];

	      this._listeners[ev].push(handler);

	      return this;
	    }
	    /** Removes custom event listener */

	  }, {
	    key: "off",
	    value: function off(ev, handler) {
	      if (!this._listeners[ev]) return this;

	      if (!handler) {
	        delete this._listeners[ev];
	        return this;
	      }

	      var hIndex = this._listeners[ev].indexOf(handler);

	      if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
	      return this;
	    }
	    /** Handles view input event */

	  }, {
	    key: "_onInput",
	    value: function _onInput(e) {
	      this._inputEvent = e;

	      this._abortUpdateCursor(); // fix strange IE behavior


	      if (!this._selection) return this.updateValue();
	      var details = new ActionDetails( // new state
	      this.el.value, this.cursorPos, // old state
	      this.value, this._selection);
	      var oldRawValue = this.masked.rawInputValue;
	      var offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection).offset; // force align in remove direction only if no input chars were removed
	      // otherwise we still need to align with NONE (to get out from fixed symbols for instance)

	      var removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
	      var cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
	      if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
	      this.updateControl();
	      this.updateCursor(cursorPos);
	      delete this._inputEvent;
	    }
	    /** Handles view change event and commits model value */

	  }, {
	    key: "_onChange",
	    value: function _onChange() {
	      if (this.value !== this.el.value) {
	        this.updateValue();
	      }

	      this.masked.doCommit();
	      this.updateControl();

	      this._saveSelection();
	    }
	    /** Handles view drop event, prevents by default */

	  }, {
	    key: "_onDrop",
	    value: function _onDrop(ev) {
	      ev.preventDefault();
	      ev.stopPropagation();
	    }
	    /** Restore last selection on focus */

	  }, {
	    key: "_onFocus",
	    value: function _onFocus(ev) {
	      this.alignCursorFriendly();
	    }
	    /** Restore last selection on focus */

	  }, {
	    key: "_onClick",
	    value: function _onClick(ev) {
	      this.alignCursorFriendly();
	    }
	    /** Unbind view events and removes element reference */

	  }, {
	    key: "destroy",
	    value: function destroy() {
	      this._unbindEvents(); // $FlowFixMe why not do so?


	      this._listeners.length = 0; // $FlowFixMe

	      delete this.el;
	    }
	  }]);

	  return InputMask;
	}();
	IMask.InputMask = InputMask;

	/** Pattern which validates enum values */

	var MaskedEnum = /*#__PURE__*/function (_MaskedPattern) {
	  _inherits(MaskedEnum, _MaskedPattern);

	  var _super = _createSuper(MaskedEnum);

	  function MaskedEnum() {
	    _classCallCheck(this, MaskedEnum);

	    return _super.apply(this, arguments);
	  }

	  _createClass(MaskedEnum, [{
	    key: "_update",
	    value:
	    /**
	      @override
	      @param {Object} opts
	    */
	    function _update(opts) {
	      // TODO type
	      if (opts.enum) opts.mask = '*'.repeat(opts.enum[0].length);

	      _get(_getPrototypeOf(MaskedEnum.prototype), "_update", this).call(this, opts);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doValidate",
	    value: function doValidate() {
	      var _this = this,
	          _get2;

	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.enum.some(function (e) {
	        return e.indexOf(_this.unmaskedValue) >= 0;
	      }) && (_get2 = _get(_getPrototypeOf(MaskedEnum.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args));
	    }
	  }]);

	  return MaskedEnum;
	}(MaskedPattern);
	IMask.MaskedEnum = MaskedEnum;

	/**
	  Number mask
	  @param {Object} opts
	  @param {string} opts.radix - Single char
	  @param {string} opts.thousandsSeparator - Single char
	  @param {Array<string>} opts.mapToRadix - Array of single chars
	  @param {number} opts.min
	  @param {number} opts.max
	  @param {number} opts.scale - Digits after point
	  @param {boolean} opts.signed - Allow negative
	  @param {boolean} opts.normalizeZeros - Flag to remove leading and trailing zeros in the end of editing
	  @param {boolean} opts.padFractionalZeros - Flag to pad trailing zeros after point in the end of editing
	*/
	var MaskedNumber = /*#__PURE__*/function (_Masked) {
	  _inherits(MaskedNumber, _Masked);

	  var _super = _createSuper(MaskedNumber);

	  /** Single char */

	  /** Single char */

	  /** Array of single chars */

	  /** */

	  /** */

	  /** Digits after point */

	  /** */

	  /** Flag to remove leading and trailing zeros in the end of editing */

	  /** Flag to pad trailing zeros after point in the end of editing */
	  function MaskedNumber(opts) {
	    _classCallCheck(this, MaskedNumber);

	    return _super.call(this, Object.assign({}, MaskedNumber.DEFAULTS, opts));
	  }
	  /**
	    @override
	  */


	  _createClass(MaskedNumber, [{
	    key: "_update",
	    value: function _update(opts) {
	      _get(_getPrototypeOf(MaskedNumber.prototype), "_update", this).call(this, opts);

	      this._updateRegExps();
	    }
	    /** */

	  }, {
	    key: "_updateRegExps",
	    value: function _updateRegExps() {
	      // use different regexp to process user input (more strict, input suffix) and tail shifting
	      var start = '^' + (this.allowNegative ? '[+|\\-]?' : '');
	      var midInput = '(0|([1-9]+\\d*))?';
	      var mid = '\\d*';
	      var end = (this.scale ? '(' + escapeRegExp(this.radix) + '\\d{0,' + this.scale + '})?' : '') + '$';
	      this._numberRegExpInput = new RegExp(start + midInput + end);
	      this._numberRegExp = new RegExp(start + mid + end);
	      this._mapToRadixRegExp = new RegExp('[' + this.mapToRadix.map(escapeRegExp).join('') + ']', 'g');
	      this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), 'g');
	    }
	    /** */

	  }, {
	    key: "_removeThousandsSeparators",
	    value: function _removeThousandsSeparators(value) {
	      return value.replace(this._thousandsSeparatorRegExp, '');
	    }
	    /** */

	  }, {
	    key: "_insertThousandsSeparators",
	    value: function _insertThousandsSeparators(value) {
	      // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	      var parts = value.split(this.radix);
	      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
	      return parts.join(this.radix);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doPrepare",
	    value: function doPrepare(ch) {
	      var _get2;

	      ch = ch.replace(this._mapToRadixRegExp, this.radix);

	      var noSepCh = this._removeThousandsSeparators(ch);

	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var _normalizePrepare = normalizePrepare((_get2 = _get(_getPrototypeOf(MaskedNumber.prototype), "doPrepare", this)).call.apply(_get2, [this, noSepCh].concat(args))),
	          _normalizePrepare2 = _slicedToArray(_normalizePrepare, 2),
	          prepCh = _normalizePrepare2[0],
	          details = _normalizePrepare2[1];

	      if (ch && !noSepCh) details.skip = true;
	      return [prepCh, details];
	    }
	    /** */

	  }, {
	    key: "_separatorsCount",
	    value: function _separatorsCount(to) {
	      var extendOnSeparators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      var count = 0;

	      for (var pos = 0; pos < to; ++pos) {
	        if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
	          ++count;
	          if (extendOnSeparators) to += this.thousandsSeparator.length;
	        }
	      }

	      return count;
	    }
	    /** */

	  }, {
	    key: "_separatorsCountFromSlice",
	    value: function _separatorsCountFromSlice() {
	      var slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._value;
	      return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "extractInput",
	    value: function extractInput() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	      var flags = arguments.length > 2 ? arguments[2] : undefined;

	      var _this$_adjustRangeWit = this._adjustRangeWithSeparators(fromPos, toPos);

	      var _this$_adjustRangeWit2 = _slicedToArray(_this$_adjustRangeWit, 2);

	      fromPos = _this$_adjustRangeWit2[0];
	      toPos = _this$_adjustRangeWit2[1];
	      return this._removeThousandsSeparators(_get(_getPrototypeOf(MaskedNumber.prototype), "extractInput", this).call(this, fromPos, toPos, flags));
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "_appendCharRaw",
	    value: function _appendCharRaw(ch) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      if (!this.thousandsSeparator) return _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);
	      var prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

	      var prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);

	      this._value = this._removeThousandsSeparators(this.value);

	      var appendDetails = _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);

	      this._value = this._insertThousandsSeparators(this._value);
	      var beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

	      var beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);

	      appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
	      appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
	      return appendDetails;
	    }
	    /** */

	  }, {
	    key: "_findSeparatorAround",
	    value: function _findSeparatorAround(pos) {
	      if (this.thousandsSeparator) {
	        var searchFrom = pos - this.thousandsSeparator.length + 1;
	        var separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
	        if (separatorPos <= pos) return separatorPos;
	      }

	      return -1;
	    }
	  }, {
	    key: "_adjustRangeWithSeparators",
	    value: function _adjustRangeWithSeparators(from, to) {
	      var separatorAroundFromPos = this._findSeparatorAround(from);

	      if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;

	      var separatorAroundToPos = this._findSeparatorAround(to);

	      if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
	      return [from, to];
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "remove",
	    value: function remove() {
	      var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

	      var _this$_adjustRangeWit3 = this._adjustRangeWithSeparators(fromPos, toPos);

	      var _this$_adjustRangeWit4 = _slicedToArray(_this$_adjustRangeWit3, 2);

	      fromPos = _this$_adjustRangeWit4[0];
	      toPos = _this$_adjustRangeWit4[1];
	      var valueBeforePos = this.value.slice(0, fromPos);
	      var valueAfterPos = this.value.slice(toPos);

	      var prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);

	      this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));

	      var beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);

	      return new ChangeDetails({
	        tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
	      });
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "nearestInputPos",
	    value: function nearestInputPos(cursorPos, direction) {
	      if (!this.thousandsSeparator) return cursorPos;

	      switch (direction) {
	        case DIRECTION.NONE:
	        case DIRECTION.LEFT:
	        case DIRECTION.FORCE_LEFT:
	          {
	            var separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);

	            if (separatorAtLeftPos >= 0) {
	              var separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;

	              if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
	                return separatorAtLeftPos;
	              }
	            }

	            break;
	          }

	        case DIRECTION.RIGHT:
	        case DIRECTION.FORCE_RIGHT:
	          {
	            var separatorAtRightPos = this._findSeparatorAround(cursorPos);

	            if (separatorAtRightPos >= 0) {
	              return separatorAtRightPos + this.thousandsSeparator.length;
	            }
	          }
	      }

	      return cursorPos;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doValidate",
	    value: function doValidate(flags) {
	      var regexp = flags.input ? this._numberRegExpInput : this._numberRegExp; // validate as string

	      var valid = regexp.test(this._removeThousandsSeparators(this.value));

	      if (valid) {
	        // validate as number
	        var number = this.number;
	        valid = valid && !isNaN(number) && ( // check min bound for negative values
	        this.min == null || this.min >= 0 || this.min <= this.number) && ( // check max bound for positive values
	        this.max == null || this.max <= 0 || this.number <= this.max);
	      }

	      return valid && _get(_getPrototypeOf(MaskedNumber.prototype), "doValidate", this).call(this, flags);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doCommit",
	    value: function doCommit() {
	      if (this.value) {
	        var number = this.number;
	        var validnum = number; // check bounds

	        if (this.min != null) validnum = Math.max(validnum, this.min);
	        if (this.max != null) validnum = Math.min(validnum, this.max);
	        if (validnum !== number) this.unmaskedValue = String(validnum);
	        var formatted = this.value;
	        if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
	        if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
	        this._value = formatted;
	      }

	      _get(_getPrototypeOf(MaskedNumber.prototype), "doCommit", this).call(this);
	    }
	    /** */

	  }, {
	    key: "_normalizeZeros",
	    value: function _normalizeZeros(value) {
	      var parts = this._removeThousandsSeparators(value).split(this.radix); // remove leading zeros


	      parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, function (match, sign, zeros, num) {
	        return sign + num;
	      }); // add leading zero

	      if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + '0';

	      if (parts.length > 1) {
	        parts[1] = parts[1].replace(/0*$/, ''); // remove trailing zeros

	        if (!parts[1].length) parts.length = 1; // remove fractional
	      }

	      return this._insertThousandsSeparators(parts.join(this.radix));
	    }
	    /** */

	  }, {
	    key: "_padFractionalZeros",
	    value: function _padFractionalZeros(value) {
	      if (!value) return value;
	      var parts = value.split(this.radix);
	      if (parts.length < 2) parts.push('');
	      parts[1] = parts[1].padEnd(this.scale, '0');
	      return parts.join(this.radix);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "unmaskedValue",
	    get: function get() {
	      return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, '.');
	    },
	    set: function set(unmaskedValue) {
	      _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", unmaskedValue.replace('.', this.radix), this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "typedValue",
	    get: function get() {
	      return Number(this.unmaskedValue);
	    },
	    set: function set(n) {
	      _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", String(n), this, true);
	    }
	    /** Parsed Number */

	  }, {
	    key: "number",
	    get: function get() {
	      return this.typedValue;
	    },
	    set: function set(number) {
	      this.typedValue = number;
	    }
	    /**
	      Is negative allowed
	      @readonly
	    */

	  }, {
	    key: "allowNegative",
	    get: function get() {
	      return this.signed || this.min != null && this.min < 0 || this.max != null && this.max < 0;
	    }
	  }]);

	  return MaskedNumber;
	}(Masked);
	MaskedNumber.DEFAULTS = {
	  radix: ',',
	  thousandsSeparator: '',
	  mapToRadix: ['.'],
	  scale: 2,
	  signed: false,
	  normalizeZeros: true,
	  padFractionalZeros: false
	};
	IMask.MaskedNumber = MaskedNumber;

	/** Masking by custom Function */

	var MaskedFunction = /*#__PURE__*/function (_Masked) {
	  _inherits(MaskedFunction, _Masked);

	  var _super = _createSuper(MaskedFunction);

	  function MaskedFunction() {
	    _classCallCheck(this, MaskedFunction);

	    return _super.apply(this, arguments);
	  }

	  _createClass(MaskedFunction, [{
	    key: "_update",
	    value:
	    /**
	      @override
	      @param {Object} opts
	    */
	    function _update(opts) {
	      if (opts.mask) opts.validate = opts.mask;

	      _get(_getPrototypeOf(MaskedFunction.prototype), "_update", this).call(this, opts);
	    }
	  }]);

	  return MaskedFunction;
	}(Masked);
	IMask.MaskedFunction = MaskedFunction;

	var _excluded = ["compiledMasks", "currentMaskRef", "currentMask"];

	/** Dynamic mask for choosing apropriate mask in run-time */
	var MaskedDynamic = /*#__PURE__*/function (_Masked) {
	  _inherits(MaskedDynamic, _Masked);

	  var _super = _createSuper(MaskedDynamic);

	  /** Currently chosen mask */

	  /** Compliled {@link Masked} options */

	  /** Chooses {@link Masked} depending on input value */

	  /**
	    @param {Object} opts
	  */
	  function MaskedDynamic(opts) {
	    var _this;

	    _classCallCheck(this, MaskedDynamic);

	    _this = _super.call(this, Object.assign({}, MaskedDynamic.DEFAULTS, opts));
	    _this.currentMask = null;
	    return _this;
	  }
	  /**
	    @override
	  */


	  _createClass(MaskedDynamic, [{
	    key: "_update",
	    value: function _update(opts) {
	      _get(_getPrototypeOf(MaskedDynamic.prototype), "_update", this).call(this, opts);

	      if ('mask' in opts) {
	        // mask could be totally dynamic with only `dispatch` option
	        this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map(function (m) {
	          return createMask(m);
	        }) : [];
	      }
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "_appendCharRaw",
	    value: function _appendCharRaw(ch) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      var details = this._applyDispatch(ch, flags);

	      if (this.currentMask) {
	        details.aggregate(this.currentMask._appendChar(ch, flags));
	      }

	      return details;
	    }
	  }, {
	    key: "_applyDispatch",
	    value: function _applyDispatch() {
	      var appended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
	      var inputValue = this.rawInputValue;
	      var insertValue = flags.tail && flags._beforeTailState != null ? // $FlowFixMe - tired to fight with type system
	      flags._beforeTailState._rawInputValue : inputValue;
	      var tailValue = inputValue.slice(insertValue.length);
	      var prevMask = this.currentMask;
	      var details = new ChangeDetails();
	      var prevMaskState = prevMask && prevMask.state; // clone flags to prevent overwriting `_beforeTailState`

	      this.currentMask = this.doDispatch(appended, Object.assign({}, flags)); // restore state after dispatch

	      if (this.currentMask) {
	        if (this.currentMask !== prevMask) {
	          // if mask changed reapply input
	          this.currentMask.reset();

	          if (insertValue) {
	            // $FlowFixMe - it's ok, we don't change current mask above
	            var d = this.currentMask.append(insertValue, {
	              raw: true
	            });
	            details.tailShift = d.inserted.length - prevValueBeforeTail.length;
	          }

	          if (tailValue) {
	            // $FlowFixMe - it's ok, we don't change current mask above
	            details.tailShift += this.currentMask.append(tailValue, {
	              raw: true,
	              tail: true
	            }).tailShift;
	          }
	        } else {
	          // Dispatch can do something bad with state, so
	          // restore prev mask state
	          this.currentMask.state = prevMaskState;
	        }
	      }

	      return details;
	    }
	  }, {
	    key: "_appendPlaceholder",
	    value: function _appendPlaceholder() {
	      var details = this._applyDispatch.apply(this, arguments);

	      if (this.currentMask) {
	        details.aggregate(this.currentMask._appendPlaceholder());
	      }

	      return details;
	    }
	    /**
	     @override
	    */

	  }, {
	    key: "_appendEager",
	    value: function _appendEager() {
	      var details = this._applyDispatch.apply(this, arguments);

	      if (this.currentMask) {
	        details.aggregate(this.currentMask._appendEager());
	      }

	      return details;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doDispatch",
	    value: function doDispatch(appended) {
	      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      return this.dispatch(appended, this, flags);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doValidate",
	    value: function doValidate() {
	      var _get2, _this$currentMask;

	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return (_get2 = _get(_getPrototypeOf(MaskedDynamic.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args)) && (!this.currentMask || (_this$currentMask = this.currentMask).doValidate.apply(_this$currentMask, args));
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "reset",
	    value: function reset() {
	      var _this$currentMask2;

	      (_this$currentMask2 = this.currentMask) === null || _this$currentMask2 === void 0 ? void 0 : _this$currentMask2.reset();
	      this.compiledMasks.forEach(function (m) {
	        return m.reset();
	      });
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "value",
	    get: function get() {
	      return this.currentMask ? this.currentMask.value : '';
	    },
	    set: function set(value) {
	      _set(_getPrototypeOf(MaskedDynamic.prototype), "value", value, this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "unmaskedValue",
	    get: function get() {
	      return this.currentMask ? this.currentMask.unmaskedValue : '';
	    },
	    set: function set(unmaskedValue) {
	      _set(_getPrototypeOf(MaskedDynamic.prototype), "unmaskedValue", unmaskedValue, this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "typedValue",
	    get: function get() {
	      return this.currentMask ? this.currentMask.typedValue : '';
	    } // probably typedValue should not be used with dynamic
	    ,
	    set: function set(value) {
	      var unmaskedValue = String(value); // double check it

	      if (this.currentMask) {
	        this.currentMask.typedValue = value;
	        unmaskedValue = this.currentMask.unmaskedValue;
	      }

	      this.unmaskedValue = unmaskedValue;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "isComplete",
	    get: function get() {
	      var _this$currentMask3;

	      return Boolean((_this$currentMask3 = this.currentMask) === null || _this$currentMask3 === void 0 ? void 0 : _this$currentMask3.isComplete);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "isFilled",
	    get: function get() {
	      var _this$currentMask4;

	      return Boolean((_this$currentMask4 = this.currentMask) === null || _this$currentMask4 === void 0 ? void 0 : _this$currentMask4.isFilled);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "remove",
	    value: function remove() {
	      var details = new ChangeDetails();

	      if (this.currentMask) {
	        var _this$currentMask5;

	        details.aggregate((_this$currentMask5 = this.currentMask).remove.apply(_this$currentMask5, arguments)) // update with dispatch
	        .aggregate(this._applyDispatch());
	      }

	      return details;
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "state",
	    get: function get() {
	      return Object.assign({}, _get(_getPrototypeOf(MaskedDynamic.prototype), "state", this), {
	        _rawInputValue: this.rawInputValue,
	        compiledMasks: this.compiledMasks.map(function (m) {
	          return m.state;
	        }),
	        currentMaskRef: this.currentMask,
	        currentMask: this.currentMask && this.currentMask.state
	      });
	    },
	    set: function set(state) {
	      var compiledMasks = state.compiledMasks,
	          currentMaskRef = state.currentMaskRef,
	          currentMask = state.currentMask,
	          maskedState = _objectWithoutProperties(state, _excluded);

	      this.compiledMasks.forEach(function (m, mi) {
	        return m.state = compiledMasks[mi];
	      });

	      if (currentMaskRef != null) {
	        this.currentMask = currentMaskRef;
	        this.currentMask.state = currentMask;
	      }

	      _set(_getPrototypeOf(MaskedDynamic.prototype), "state", maskedState, this, true);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "extractInput",
	    value: function extractInput() {
	      var _this$currentMask6;

	      return this.currentMask ? (_this$currentMask6 = this.currentMask).extractInput.apply(_this$currentMask6, arguments) : '';
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "extractTail",
	    value: function extractTail() {
	      var _this$currentMask7, _get3;

	      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      return this.currentMask ? (_this$currentMask7 = this.currentMask).extractTail.apply(_this$currentMask7, args) : (_get3 = _get(_getPrototypeOf(MaskedDynamic.prototype), "extractTail", this)).call.apply(_get3, [this].concat(args));
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "doCommit",
	    value: function doCommit() {
	      if (this.currentMask) this.currentMask.doCommit();

	      _get(_getPrototypeOf(MaskedDynamic.prototype), "doCommit", this).call(this);
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "nearestInputPos",
	    value: function nearestInputPos() {
	      var _this$currentMask8, _get4;

	      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      return this.currentMask ? (_this$currentMask8 = this.currentMask).nearestInputPos.apply(_this$currentMask8, args) : (_get4 = _get(_getPrototypeOf(MaskedDynamic.prototype), "nearestInputPos", this)).call.apply(_get4, [this].concat(args));
	    }
	  }, {
	    key: "overwrite",
	    get: function get() {
	      return this.currentMask ? this.currentMask.overwrite : _get(_getPrototypeOf(MaskedDynamic.prototype), "overwrite", this);
	    },
	    set: function set(overwrite) {
	      console.warn('"overwrite" option is not available in dynamic mask, use this option in siblings');
	    }
	  }, {
	    key: "eager",
	    get: function get() {
	      return this.currentMask ? this.currentMask.eager : _get(_getPrototypeOf(MaskedDynamic.prototype), "eager", this);
	    },
	    set: function set(eager) {
	      console.warn('"eager" option is not available in dynamic mask, use this option in siblings');
	    }
	    /**
	      @override
	    */

	  }, {
	    key: "maskEquals",
	    value: function maskEquals(mask) {
	      return Array.isArray(mask) && this.compiledMasks.every(function (m, mi) {
	        var _mask$mi;

	        return m.maskEquals((_mask$mi = mask[mi]) === null || _mask$mi === void 0 ? void 0 : _mask$mi.mask);
	      });
	    }
	  }]);

	  return MaskedDynamic;
	}(Masked);
	MaskedDynamic.DEFAULTS = {
	  dispatch: function dispatch(appended, masked, flags) {
	    if (!masked.compiledMasks.length) return;
	    var inputValue = masked.rawInputValue; // simulate input

	    var inputs = masked.compiledMasks.map(function (m, index) {
	      m.reset();
	      m.append(inputValue, {
	        raw: true
	      });
	      m.append(appended, flags);
	      var weight = m.rawInputValue.length;
	      return {
	        weight: weight,
	        index: index
	      };
	    }); // pop masks with longer values first

	    inputs.sort(function (i1, i2) {
	      return i2.weight - i1.weight;
	    });
	    return masked.compiledMasks[inputs[0].index];
	  }
	};
	IMask.MaskedDynamic = MaskedDynamic;

	/** Mask pipe source and destination types */

	var PIPE_TYPE = {
	  MASKED: 'value',
	  UNMASKED: 'unmaskedValue',
	  TYPED: 'typedValue'
	};
	/** Creates new pipe function depending on mask type, source and destination options */

	function createPipe(mask) {
	  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PIPE_TYPE.MASKED;
	  var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PIPE_TYPE.MASKED;
	  var masked = createMask(mask);
	  return function (value) {
	    return masked.runIsolated(function (m) {
	      m[from] = value;
	      return m[to];
	    });
	  };
	}
	/** Pipes value through mask depending on mask type, source and destination options */

	function pipe(value) {
	  for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    pipeArgs[_key - 1] = arguments[_key];
	  }

	  return createPipe.apply(void 0, pipeArgs)(value);
	}
	IMask.PIPE_TYPE = PIPE_TYPE;
	IMask.createPipe = createPipe;
	IMask.pipe = pipe;

	try {
	  globalThis.IMask = IMask;
	} catch (e) {}

	exports.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
	exports.HTMLMaskElement = HTMLMaskElement;
	exports.InputMask = InputMask;
	exports.MaskElement = MaskElement;
	exports.Masked = Masked;
	exports.MaskedDate = MaskedDate;
	exports.MaskedDynamic = MaskedDynamic;
	exports.MaskedEnum = MaskedEnum;
	exports.MaskedFunction = MaskedFunction;
	exports.MaskedNumber = MaskedNumber;
	exports.MaskedPattern = MaskedPattern;
	exports.MaskedRange = MaskedRange;
	exports.MaskedRegExp = MaskedRegExp;
	exports.PIPE_TYPE = PIPE_TYPE;
	exports.createMask = createMask;
	exports.createPipe = createPipe;
	exports["default"] = IMask;
	exports.pipe = pipe;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=imask.js.map

/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur as it's already being fired
		// in leverageNative.
		_default: function() {
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );
