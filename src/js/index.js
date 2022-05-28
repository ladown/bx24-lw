'use strict';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

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
		},

		unlock() {
			this.node.classList.remove(this.mod);
		},
	};

	const AnimationOnEnterPage = {
		variables: {
			linesBottom: window.innerWidth >= 981 ? '100rem' : '55rem',
			linesOffset: {
				first: window.innerWidth >= 1921 ? '-100rem' : '-200rem',
				second: window.innerWidth >= 1921 ? '1000rem' : '640rem',
			},
			observer: null,
		},

		nods: {
			wrap: document.querySelector('.promo'),
			backgroundImage: document.querySelector('.promo__bg'),
			lines: document.querySelector('.promo__lines'),
			firstLine: document.querySelector('.promo__line:nth-child(1)'),
			secondLine: document.querySelector('.promo__line:nth-child(2)'),
		},

		setObserver() {
			this.variables.observer = new IntersectionObserver((entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						Body.node.style.pointerEvents = 'none';
						Body.lock();
					} else {
						this.unsetObserver();
					}

					this.setAnimation();
				});
			});
			this.variables.observer.observe(this.nods.wrap);
		},

		unsetObserver() {
			this.variables.observer.disconnect();
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

		init() {
			if (this.nods.wrap) {
				this.setObserver();
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
			circlSelector: 'circle:nth-child(2)',
		},

		nodes: {
			slider: document.querySelector('.info__slider'),
			pagination: document.querySelector('.info__progress'),
		},

		startAnimation(el) {
			el.style.animationPlayState = 'running';
		},

		setSlider() {
			new Swiper(this.nodes.slider, {
				slidesPerView: 1,
				modules: [Pagination, Autoplay],
				autoplay: {
					delay: 3000,
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
					autoplayStart: (swiper) => {
						const circle = swiper.pagination.bullets[swiper.activeIndex].querySelector(this.variables.circlSelector);
						this.startAnimation(circle);
					},
					slideChange: (swiper) => {
						const circle = swiper.pagination.bullets[swiper.activeIndex].querySelector(this.variables.circlSelector);
						this.startAnimation(circle);
						swiper.autoplay.start();
					},
				},
			});
		},

		init() {
			if (this.nodes) {
				this.setSlider();
			}
		},
	};

	ProblemSlider.init();

	const IntegrationSection = {
		variables: {
			pixelsToScroll: null,
		},

		nodes: {
			wrap: document.querySelector('.integration__content'),
			blockToScroll: document.querySelector('.integration__items'),
			blocks: document.querySelectorAll('.integration__item'),
		},

		mods: 'is-active',

		setVariables() {
			this.variables.pixelsToScroll = Math.ceil(
				document.querySelector('.integration__content').offsetHeight / 2 - this.nodes.blockToScroll.offsetHeight,
			);
		},

		setScrollForSection() {
			const timeLine = gsap.timeline({
				scrollTrigger: {
					trigger: this.nodes.blockToScroll,
					start: `top -=${this.variables.pixelsToScroll}`,
					end: `bottom -=${this.variables.pixelsToScroll / 2}`,
					scrub: true,
				},
			});

			timeLine.to(this.nodes.blockToScroll, {
				y: `${this.variables.pixelsToScroll}px`,
			});
		},

		setActiveItem() {
			const scroller = scrollama();

			scroller
				.setup({
					step: '.integration__item',
					offset: `${-this.variables.pixelsToScroll}px`,
				})
				.onStepEnter((response) => {
					const { element } = response;
					element.classList.add(this.mods);
				})
				.onStepExit((response) => {
					const { element, index, direction } = response;
					if (direction !== 'down' && index !== 0) {
						element.classList.remove(this.mods);
					}
				});
		},

		init() {
			if (this.nodes.blockToScroll && window.innerWidth >= 981) {
				this.setVariables();
				this.setScrollForSection();

				this.setActiveItem();
			}
		},
	};

	IntegrationSection.init();

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
					mask: [
						{
							mask: '0 (000) 000-00-00',
							startsWith: '8',
							lazy: false,
						},
						{
							mask: '+0 (000) 000-00-00',
							startsWith: '7',
							lazy: false,
						},
					],

					dispatch: (appended, dynamicMasked) => {
						var number = (dynamicMasked.value + appended).replace(/\D/g, '');

						return dynamicMasked.compiledMasks.find(function (m) {
							return number.indexOf(m.startsWith) === 0;
						});
					},
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
			forms: [document.querySelector('.contact__form'), document.querySelector('.callback__form')],
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
			console.log(input);
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
					console.log(countOfErrors);

					if (countOfErrors === 0) {
						console.log('We can send form there');
					}
				});
			});
		},

		init() {
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
			Body.unlock();
			gsap.to(this.nodes.modal, { display: 'none', opacity: 0, duration: 0.3, ease: 'linear' });
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
				console.log(event.target);
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
});
