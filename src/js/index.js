'use strict';

import { gsap } from 'gsap';

import Swiper, { Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import scrollama from 'scrollama';

import IMask from 'imask';

import $ from 'jquery';

import './pug-files';
import '../scss/style.scss';

window.addEventListener('DOMContentLoaded', () => {
	const Body = {
		node: document.body,

		mod: 'js-lock',

		lock() {
			this.node.classList.add(this.mod);

			const paddingRight =
				parseInt(window.getComputedStyle(this.node, null).getPropertyValue('padding-right'), 10) +
				this.getScrollbarWidth() * 1;
			this.node.style.paddingRight = `${paddingRight}px`;
			document.querySelector('header.header').style.paddingRight = `${paddingRight}px`;
		},

		unlock() {
			this.node.classList.remove(this.mod);
			this.node.style.paddingRight = '';
			document.querySelector('header.header').style.paddingRight = '';
		},

		getScrollbarWidth() {
			let w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				h = d.getElementsByTagName('html')[0],
				wHeght = w.innerHeight || e.clientHeight || g.clientHeight,
				dHeight = Math.max(
					g.scrollHeight,
					g.offsetHeight,
					g.getBoundingClientRect().height,
					h.clientHeight,
					h.scrollHeight,
					h.offsetHeight,
				);

			if (dHeight <= wHeght) {
				return 0;
			}

			let outer = document.createElement('div');
			let inner = document.createElement('div');
			let widthNoScroll;
			let widthWithScroll;

			outer.style.visibility = 'hidden';
			outer.style.width = '100px';
			document.body.appendChild(outer);

			widthNoScroll = outer.offsetWidth;

			// Force scrollbars
			outer.style.overflow = 'scroll';

			// Add inner div
			inner.style.width = '100%';
			outer.appendChild(inner);

			widthWithScroll = inner.offsetWidth;

			// Remove divs
			outer.parentNode.removeChild(outer);

			return widthNoScroll - widthWithScroll;
		},
	};

	const AnimationOnEnterPage = {
		variables: {
			linesBottom: null,
			linesOffset: {
				first: null,
				second: null,
			},
		},

		nods: {
			wrap: document.querySelector('.promo'),
			backgroundImage: document.querySelector('.promo__bg'),
			lines: document.querySelector('.promo__lines'),
			firstLine: document.querySelector('.promo__line:nth-child(1)'),
			secondLine: document.querySelector('.promo__line:nth-child(2)'),
		},

		setAnimation() {
			gsap.to(this.nods.backgroundImage, {
				scale: 1.2,
				ease: 'linear',
				duration: 1,
				onStart: () => {
					gsap.to(this.nods.lines, {
						rotate: 0,
						bottom: this.variables.linesBottom,
						ease: 'linear',
						duration: 1,
						onComplete: () => {
							Body.unlock();
							Body.node.style.pointerEvents = '';
						},
					});

					gsap.to(this.nods.firstLine, { x: this.variables.linesOffset.first, ease: 'linear', duration: 1 });

					gsap.to(this.nods.secondLine, { x: this.variables.linesOffset.second, ease: 'linear', duration: 1 });
				},
			});
		},

		setVariables(event = false) {
			if (event) {
				this.variables.linesBottom = event.target.innerWidth >= 981 ? '100rem' : '55rem';
				this.variables.linesOffset.first = event.target.innerWidth >= 1921 ? '-100rem' : '-200rem';
				this.variables.linesOffset.second = event.target.innerWidth >= 1921 ? '1000rem' : '640rem';
			} else {
				this.variables.linesBottom = window.innerWidth >= 981 ? '100rem' : '55rem';
				this.variables.linesOffset.first = window.innerWidth >= 1921 ? '-100rem' : '-200rem';
				this.variables.linesOffset.second = window.innerWidth >= 1921 ? '1000rem' : '640rem';
			}
		},

		changeOnResize() {
			window.addEventListener('resize', (event) => {
				this.setVariables(event);

				if (this.nods.lines) {
					this.nods.lines.style.bottom = this.variables.linesBottom;
					this.nods.firstLine.style.transform = `translate(${this.variables.linesOffset.first}, 0px)`;
					this.nods.secondLine.style.transform = `translate(${this.variables.linesOffset.second}, 0px)`;
				}
			});
		},

		init() {
			if (this.nods.wrap) {
				this.setVariables();

				if (isInViewport(this.nods.wrap)) {
					Body.node.style.pointerEvents = 'none';
					Body.lock();
				}

				this.setAnimation();

				this.changeOnResize();
			}
		},
	};

	AnimationOnEnterPage.init();

	const Header = {
		variables: {
			pageScrollOffset: 300,
			btnDataSelector: 'open-btn',
			widthToCloseMenu: 981,
		},

		nodes: {
			block: document.querySelector('header.header'),
			menu: document.querySelector('.header__nav'),
		},

		mods: {
			opened: 'is-opened',
		},

		openMenu(el) {
			Body.lock();
			el.classList.add(this.mods.opened);
			gsap.to(Header.nodes.menu, {
				display: 'flex',
				duration: 0.01,
				onComplete: function () {
					gsap.to(Header.nodes.menu, {
						x: 0,
						duration: 0.3,
						ease: 'linear',
					});
				},
			});
		},

		closeMenu(el) {
			Body.unlock();
			el.classList.remove(this.mods.opened);
			gsap.to(Header.nodes.menu, {
				x: '-100%',
				duration: 0.3,
				ease: 'linear',
				display: 'none',
			});
		},

		closeMenuOnResize() {
			window.addEventListener('resize', (event) => {
				if (
					event.target &&
					event.target.innerWidth >= this.variables.widthToCloseMenu &&
					this.nodes.block.classList.contains(this.mods.opened)
				) {
					Body.unlock();
					this.nodes.block.classList.remove(this.mods.opened);
					this.nodes.menu.style.cssText = `
						display: '';
						transform: '';
					`;
				}
			});
		},

		init() {
			this.nodes.block.addEventListener('click', function ({ target }) {
				if (target && target.dataset.header === Header.variables.btnDataSelector) {
					if (this.classList.contains(Header.mods.opened)) {
						Header.closeMenu(this);
					} else {
						Header.openMenu(this);
					}
				}
			});

			this.closeMenuOnResize();
		},
	};

	Header.init();

	const ProblemSlider = {
		variables: {
			isInit: false,
			circlSelector: 'circle:nth-child(2)',
			slider: null,
		},

		nodes: {
			slider: document.querySelector('.info__slider'),
			pagination: document.querySelector('.info__progress'),
		},

		startAnimation(el) {
			el.style.animationPlayState = 'running';
		},

		isInViewport() {
			if (isInViewport(ProblemSlider.nodes.slider)) {
				ProblemSlider.variables.slider.enable();
				const circle = ProblemSlider.variables.slider.pagination.bullets[0].querySelector(
					ProblemSlider.variables.circlSelector,
				);
				ProblemSlider.startAnimation(circle);
				ProblemSlider.variables.slider.autoplay.start();
				window.removeEventListener('scroll', ProblemSlider.isInViewport);
			}
		},

		setObserver() {
			window.addEventListener('scroll', this.isInViewport);
		},

		setSlider() {
			this.variables.slider = new Swiper(this.nodes.slider, {
				enabled: false,
				slidesPerView: 1,
				modules: [Pagination, Autoplay],
				autoplay: {
					delay: 2700,
					disableOnInteraction: false,
					stopOnLastSlide: true,
				},
				pagination: {
					el: this.nodes.pagination,
					clickable: 'true',
					type: 'bullets',
					renderBullet: function (index, className) {
						return `
							<div class="${className} info__progress-item">
								<svg class="info__progress-line">
									<circle cx="20rem" cy="20rem" r="16rem"></circle>
									<circle cx="20rem" cy="20rem" r="16rem"></circle>
								</svg>
								<div class="info__progress-count">0${index + 1}</div>
							</div>`;
					},
				},
				on: {
					init: (swiper) => {
						swiper.autoplay.stop();
					},
					slideChange: (swiper) => {
						if (swiper.enabled) {
							const circle = swiper.pagination.bullets[swiper.activeIndex].querySelector(this.variables.circlSelector);
							this.startAnimation(circle);
							swiper.autoplay.start();
						}
					},
				},
			});
		},

		init() {
			if (this.nodes.slider) {
				this.setObserver();
				this.setSlider();
			}
		},
	};

	ProblemSlider.init();

	const CertificatesSlider = {
		node: '.certificates__slider',

		setSlider() {
			new Swiper(this.node, {
				grabCursor: true,
				slidesPerView: 'auto',
				spaceBetween: 15,
				breakpoints: {
					768: {
						slidesPerView: 3,
						spaceBetween: 15,
					},
					980: {
						slidesPerView: 4,
						spaceBetween: 24,
					},
				},
			});
		},

		init() {
			if (this.node) {
				this.setSlider();
			}
		},
	};

	CertificatesSlider.init();

	const InputMasks = {
		nodes: {
			timeInput: document.querySelectorAll('input[name="time"]'),
			phoneInput: document.querySelectorAll('input[type="tel"]'),
		},

		setTimeMask() {
			this.nodes.timeInput.forEach((input) => {
				IMask(input, {
					mask: 'HOURS:MINUTES',
					blocks: {
						HOURS: {
							mask: IMask.MaskedRange,
							from: 0,
							to: 24,
						},
						MINUTES: {
							mask: IMask.MaskedRange,
							from: 0,
							to: 60,
						},
					},
				});
			});
		},

		setPhoneMask() {
			this.nodes.phoneInput.forEach((input) => {
				IMask(input, {
					mask: '0 (000) 000-00-00',
				});
			});
		},

		init() {
			if (this.nodes.timeInput.length) {
				this.setTimeMask();
			}

			if (this.nodes.phoneInput.length) {
				this.setPhoneMask();
			}
		},
	};

	InputMasks.init();

	const Form = {
		variables: {
			inputs: '.field',
			checkbox: '.checkbox__input',
		},

		nodes: {
			forms: [],
		},

		mods: {
			filled: 'is-filled',
		},

		setFilled() {
			this.nodes.forms.forEach((form) => {
				const inputs = form.querySelectorAll(this.variables.inputs);

				inputs.forEach((input) => {
					input.addEventListener('change', (event) => {
						input.setAttribute('value', event.target.value);

						if (input.getAttribute('value') || event.target.tagName.toLowerCase() === 'select') {
							input.classList.add(this.mods.filled);
						} else {
							input.classList.remove(this.mods.filled);
						}
					});
				});
			});
		},

		formValidation(input) {
			let numberOfErrors = 0;

			if (!input.checked) {
				numberOfErrors++;
			}

			return numberOfErrors;
		},

		formListener() {
			this.nodes.forms.forEach((form) => {
				const checkbox = form.querySelector(this.variables.checkbox);

				form.addEventListener('submit', (event) => {
					event.preventDefault();
					const countOfErrors = this.formValidation(checkbox);

					if (countOfErrors === 0) {
						console.log('We can send form there');
					}
				});
			});
		},

		setFormNodes() {
			const formsSelectors = ['.contact__form', '.callback__form'];
			formsSelectors.forEach((formSelector) => {
				const form = document.querySelector(formSelector);

				if (form) {
					this.nodes.forms.push(form);
				}
			});
		},

		init() {
			this.setFormNodes();

			if (this.nodes.forms.length) {
				this.setFilled();
				this.formListener();
			}
		},
	};

	Form.init();

	const Accordion = {
		nodes: {
			block: document.querySelectorAll('.faq__item'),
			header: document.querySelectorAll('.faq__item-head'),
			subheader: document.querySelectorAll('.faq__item-content'),
		},

		mods: 'is-opened',

		openAccordion(index) {
			this.nodes.block[index].classList.add(this.mods);
			$(this.nodes.subheader[index]).css('display', 'flex').hide().slideDown();
		},

		closeAccordion() {
			this.nodes.block.forEach((block) => {
				block.classList.remove(this.mods);
			});
			this.nodes.subheader.forEach((subheader) => {
				$(subheader).slideUp();
			});
		},

		init() {
			if (this.nodes.block.length) {
				this.nodes.header.forEach((header, index) => {
					header.addEventListener('click', () => {
						if (this.nodes.block[index].classList.contains(this.mods)) {
							this.closeAccordion();
						} else {
							this.closeAccordion();
							this.openAccordion(index);
						}
					});
				});
			}
		},
	};

	Accordion.init();

	const PriceSlider = {
		node: document.querySelectorAll('.price__slider'),

		setSlider() {
			this.node.forEach((slider) => {
				new Swiper(slider, {
					slidesPerView: 'auto',
					spaceBetween: 10,

					breakpoints: {
						580: {
							slidesPerView: 2,
							spaceBetween: 16,
						},
						980: {
							slidesPerView: 3,
							spaceBetween: 24,
						},
					},
				});
			});
		},

		init() {
			if (this.node.length) {
				this.setSlider();
			}
		},
	};

	PriceSlider.init();

	const Modal = {
		isOpened: false,
		nodes: {
			modal: document.querySelector('.callback'),
			trigger: document.querySelectorAll('.callback__open-btn'),
		},

		openModal() {
			Body.lock();
			gsap.to(this.nodes.modal, { display: 'flex', opacity: 1, duration: 0.3, ease: 'linear' });
		},

		closeModal() {
			gsap.to(this.nodes.modal, {
				display: 'none',
				opacity: 0,
				duration: 0.3,
				ease: 'linear',
				onComplete: () => {
					Body.unlock();
				},
			});
		},

		setListenerForTrigger() {
			this.nodes.trigger.forEach((btn) => {
				btn.addEventListener('click', (event) => {
					event.preventDefault();

					if (this.isOpened) {
						this.closeModal();
					} else {
						this.openModal();
					}

					this.isOpened = !this.isOpened;
				});
			});
		},

		setListenerForModal() {
			this.nodes.modal.addEventListener('click', (event) => {
				if (
					event.target &&
					(event.target.classList.contains('callback__overlay') || event.target.classList.contains('callback__close'))
				) {
					this.closeModal();
					this.isOpened = !this.isOpened;
				}
			});
		},

		init() {
			if (this.nodes.modal) {
				this.setListenerForTrigger();
				this.setListenerForModal();
			}
		},
	};

	Modal.init();

	const ScrollSection = {
		variables: {
			scroller: scrollama(),
			isActivated: true,
		},

		nods: {
			wrap: document.querySelector('.integration'),
			title: document.querySelector('.integration__title'),
			itemsWrap: document.querySelector('.integration__items'),
			items: document.querySelectorAll('.integration__item'),
		},

		mods: 'is-active',

		handleResize() {
			const titleHeight =
				this.nods.title.offsetHeight < this.nods.items[this.nods.items.length - 1].offsetHeight
					? this.nods.items[this.nods.items.length - 1].offsetHeight + 10
					: this.nods.title.offsetHeight;
			const titleTopOffset = window.innerHeight / 2 - titleHeight / 2;

			this.nods.title.style.cssText = `
				height: ${titleHeight}px;
				top: ${titleTopOffset}px;
			`;

			this.variables.scroller.resize();
		},

		handleStepEnter(response) {
			const { index, direction } = response;

			if (direction === 'down') {
				this.nods.items[index].classList.add(this.mods);

				if (index > 1 && this.variables.isActivated) {
					this.nods.items.forEach((el, idx) => {
						if (idx < index) {
							el.classList.add(this.mods);

							this.variables.isActivated = false;
						}
					});
				}
			}
		},

		handleStepLeave(response) {
			const { index, direction } = response;

			if (direction === 'up' && index !== 0) {
				this.nods.items[response.index].classList.remove(this.mods);
			}
		},

		setOnResize() {
			window.addEventListener('resize', (event) => {
				if (event.target.innerWidth <= 768) {
					this.variables.scroller.disable();
				} else {
					this.handleResize();
					this.variables.scroller.enable();
				}
			});
		},

		setPreviousItems() {
			if (this.variables.activeItem !== 0 && this.variables.activeItem !== 1) {
				this.nods.items.forEach((el, index) => {
					if (index <= this.variables.activeItem) {
						el.classList.add(this.mods);
					}
				});
			}
		},

		init() {
			if (this.nods.wrap) {
				this.handleResize();

				this.variables.scroller
					.setup({
						step: '.integration__item',
						offset: 0.5,
						debug: false,
					})
					.onStepEnter((response) => {
						this.handleStepEnter(response);
					})
					.onStepExit((response) => {
						this.handleStepLeave(response);
					});

				if (window.innerWidth >= 769) {
					this.variables.scroller.enable();

					if (this.nods.wrap.getBoundingClientRect().bottom <= -1) {
						this.nods.items.forEach((el) => {
							el.classList.add(this.mods);
						});

						this.variables.isActivated = false;
					}
				} else {
					this.variables.scroller.disable();
				}

				this.setOnResize();
			}
		},
	};

	ScrollSection.init();

	const Select = {
		variables: {
			isOpened: false,
		},

		nods: {
			select: document.querySelector('.select'),
			input: document.querySelector('.select__input'),
			value: document.querySelector('.select__value'),
			optionWrap: document.querySelector('.select__options'),
			options: document.querySelectorAll('.select__option'),
		},

		mods: {
			opened: 'is-opened',
			active: 'is-active',
			filled: 'is-filled',
		},

		toggleState() {
			this.variables.isOpened = !this.variables.isOpened;
		},

		setValue(option, value) {
			this.nods.input.setAttribute('value', value);
			this.nods.value.textContent = value;

			if (!this.nods.select.classList.contains(this.mods.filled)) {
				this.nods.select.classList.add(this.mods.filled);
			}

			this.setActiveOption(option);
		},

		setActiveOption(option) {
			this.nods.options.forEach((el) => {
				if (option === el) {
					el.classList.add(this.mods.active);
				} else {
					el.classList.remove(this.mods.active);
				}
			});
		},

		openSelect() {
			this.nods.select.classList.add(this.mods.opened);

			gsap.to(this.nods.optionWrap, {
				opacity: 1,
				display: 'flex',
				transform: 'translateY(0)',
				duration: 0.3,
				ease: 'linear',
			});

			this.toggleState();
		},

		closeSelect() {
			this.nods.select.classList.remove(this.mods.opened);

			gsap.to(this.nods.optionWrap, {
				opacity: 0,
				display: 'none',
				transform: 'translateY(50rem)',
				duration: 0.3,
				ease: 'linear',
			});

			this.toggleState();
		},

		setListenerForBlock() {
			this.nods.select.addEventListener('click', (event) => {
				event.stopPropagation();

				if (event.target && event.target.classList.contains('select__head')) {
					if (!this.variables.isOpened) {
						this.openSelect();
					} else {
						this.closeSelect();
					}
				} else if (event.target && event.target.classList.contains('select__option')) {
					const value = event.target.textContent.trim();

					if (!event.target.classList.contains(this.mods.active)) {
						this.setValue(event.target, value);
					}

					this.closeSelect();
				}
			});
		},

		setListenerForDocument() {
			Body.node.addEventListener('click', (event) => {
				const path = event.composedPath && event.composedPath();
				if (this.variables.isOpened && !path.includes(this.nods.select)) {
					this.closeSelect();
				}
			});
		},

		init() {
			if (this.nods.select) {
				this.setListenerForBlock();

				this.setListenerForDocument();
			}
		},
	};

	Select.init();

	function isInViewport(el) {
		var top = el.offsetTop;
		var left = el.offsetLeft;
		var width = el.offsetWidth;
		var height = el.offsetHeight;

		while (el.offsetParent) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}

		return (
			top < window.pageYOffset + window.innerHeight &&
			left < window.pageXOffset + window.innerWidth &&
			top + height > window.pageYOffset &&
			left + width > window.pageXOffset
		);
	}
});
