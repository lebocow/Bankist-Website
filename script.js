'use strict';

// Variables
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);
const nav = document.querySelector(`.nav`);
const header = document.querySelector(`.header`);

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (const btn of btnsOpenModal) {
  btn.addEventListener('click', openModal);
}

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: `smooth` });
});

// Page navigation
document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();

  if (
    e.target.classList.contains(`nav__link`) &&
    !e.target.classList.contains(`nav__link--btn`)
  ) {
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

// Tabbed component
tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  for (const t of tabs) {
    t.classList.remove('operations__tab--active');
  }
  for (const t of tabsContent) {
    t.classList.remove('operations__content--active');
  }

  // Active tab
  clicked.classList.add(`operations__tab--active`);

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

// Menu fade animation
const handleHover = function (e) {
  const navLink = e.target.closest('.nav__link');
  if (!navLink) return;

  const siblings = nav.querySelectorAll('.nav__link');
  const logo = nav.querySelector('img');

  for (const el of siblings) {
    if (el !== navLink) el.style.opacity = this;
  }

  logo.style.opacity = this;
};
nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));

// Sticky navigation
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) nav.classList.remove(`sticky`);
  else nav.classList.add(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll(`.section`);

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Use for-of loop instead of forEach
for (const section of allSections) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
}

// Lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(
    `load`,
    entry.target.classList.remove(`lazy-img`)
  );

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

for (const img of imgTargets) imgObserver.observe(img);

// Slider
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector(`.dots`);

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    for (const [i] of slides.entries()) {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    }
  };

  const goToSlide = function (slide) {
    for (const [i, s] of slides.entries()) {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    }
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const nextSlide = function () {
    curSlide === maxSlide ? (curSlide = 0) : curSlide++;
    activateDot(curSlide);
    goToSlide(curSlide);
  };

  const prevSlide = function () {
    curSlide === 0 ? (curSlide = maxSlide) : curSlide--;
    activateDot(curSlide);
    goToSlide(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  // Event handlers
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function (e) {
    e.key === `ArrowRight` && nextSlide();
    e.key === `ArrowLeft` && prevSlide();
  });

  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      const { slide } = e.target.dataset;
      curSlide = slide;

      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
