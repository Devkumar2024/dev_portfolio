/* script.js — progressive enhancement only.
   Site works 100% if this file fails to load. */
(() => {
  'use strict';

  /* ---------- 1. Scroll-spy: highlight nav link of section in view ---------- */
  const navLinks = [...document.querySelectorAll('.topnav a[href^="#"]')];
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const setActive = id => {
    for (const a of navLinks) {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    }
  };

  if (sections.length) {
    let queued = false;

    const update = () => {
      queued = false;
      const line = window.scrollY + window.innerHeight * 0.25;
      let current = sections[0];

      for (const s of sections) {
        const top = s.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = s;
      }

      if (window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
      }

      setActive(current.id);
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- 2. Reveal on scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealEls.forEach(el => io.observe(el));
  }
})();