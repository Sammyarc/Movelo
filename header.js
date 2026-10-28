/* Clear at the top, blue glass within the hero, white glass over later sections. */
(() => {
  const shell = document.querySelector('.header-shell');
  const header = shell?.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const kicker = hero?.querySelector('.hero-kicker');
  if (!shell || !header || !hero || !kicker) return;
  // The original remains in the hero for the clear top state and no-JS fallback.
  const stickyKicker = kicker.cloneNode(true);
  stickyKicker.classList.add('header-hero-kicker');
  shell.querySelector('.header-inner').append(stickyKicker);
  let observer;
  let height = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    const overHero = hero.getBoundingClientRect().bottom > height;
    shell.classList.toggle('is-over-hero', overHero);
    shell.classList.toggle('is-at-top', overHero && window.scrollY <= 1);
    hero.classList.toggle('has-sticky-kicker', overHero && window.scrollY > 1);
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  const measure = () => {
    const nextHeight = header.getBoundingClientRect().height;
    if (nextHeight === height) return;
    height = nextHeight;
    document.documentElement.style.setProperty('--site-header-height', `${height}px`);
    observer?.disconnect();
    observer = new IntersectionObserver(update, { rootMargin: `-${height}px 0px 0px 0px`, threshold: 0 });
    observer.observe(hero);
    update();
  };
  new ResizeObserver(measure).observe(header);
  window.addEventListener('pageshow', update);
  window.addEventListener('scroll', onScroll, { passive: true });
  measure();
})();
