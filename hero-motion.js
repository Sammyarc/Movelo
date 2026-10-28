/* Movelo: an entrance with weight, followed by restrained interactive depth.
   All resting styles live in CSS; missing JS or reduced motion keeps them intact. */
(() => {
  const { gsap, ScrollTrigger } = window;
  const hero = document.querySelector('.hero');
  if (!hero || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let entrancePlayed = false;

  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 851px)',
    pointer: '(hover: hover) and (pointer: fine)'
  }, context => {
    if (!context.conditions.motion) return;
    const { desktop, pointer } = context.conditions;
    const select = gsap.utils.selector(hero);
    const ball = select('.hero-ball-object');
    const ballPointer = select('.hero-ball-pointer');
    const shadow = select('.hero-shadow-object');
    const shadowPointer = select('.hero-shadow-pointer');
    const interactive = desktop && pointer;
    const wordmark = select('.hero-wordmark');
    const lines = select('.hero-line');
    const lineText = select('.hero-line > span');
    const header = [...document.querySelectorAll('.site-header .logo, .site-header nav a, .site-header .theme-toggle')];
    const supporting = select('.hero-kicker, .hero-intro p');
    let entrance;
    let ready = false;
    let depth;
    let pointerX;
    let pointerY;
    let sphere;
    const position = { x: 0, y: 0 };
    const renderPosition = () => {
      setBallX(position.x); setBallY(position.y);
      // Translation is shared exactly; a cast shadow does not roll with the ball.
      setShadowX(position.x); setShadowY(position.y);
    };

    if (interactive) hero.classList.add('has-pointer-scene');

    gsap.set([...ball, ...ballPointer], { svgOrigin: '850.5 413.5' });
    if (interactive) gsap.set(shadow, { svgOrigin: '850.5 413.5' });
    const setBallX = gsap.quickSetter(ballPointer, 'x');
    const setBallY = gsap.quickSetter(ballPointer, 'y');
    const setShadowX = gsap.quickSetter(shadowPointer, 'x');
    const setShadowY = gsap.quickSetter(shadowPointer, 'y');

    const resetPointer = () => {
      if (!pointerX) return;
      sphere?.reset();
      pointerX(0); pointerY(0);
    };

    const activateDepth = () => {
      if (ready) return;
      ready = true;
      depth = gsap.timeline({
        scrollTrigger: {
          id: 'hero-depth', trigger: hero, start: 'top top', end: 'bottom top',
          scrub: .65, invalidateOnRefresh: true, onLeave: resetPointer
        }
      })
        .to(select('.hero-ball'), { y: () => hero.offsetHeight * (desktop ? .11 : .035), rotation: desktop ? 2 : .5, ease: 'none' }, 0)
        .to(wordmark, { y: () => hero.offsetHeight * (desktop ? .16 : .055), ease: 'none' }, 0)
        .to(select('.hero-photo'), { scale: desktop ? 1.075 : 1.025, ease: 'none' }, 0);
      if (interactive) {
        depth.to(select('.hero-shadow'), { y: () => hero.offsetHeight * .11, rotation: 2, ease: 'none' }, 0);
        pointerX = gsap.quickTo(position, 'x', { duration: .12, ease: 'power3.out', onUpdate: renderPosition });
        pointerY = gsap.quickTo(position, 'y', { duration: .12, ease: 'power3.out', onUpdate: renderPosition });
      }
    };

    const clearEntrance = () => {
      gsap.set([...header, ...supporting, ...lines, ...lineText, ...wordmark], { clearProps: 'transform,opacity,clipPath,willChange' });
      gsap.set(ball, { clearProps: 'transform,willChange' });
      gsap.set(shadow, { clearProps: 'transform,willChange' });
      activateDepth();
    };
    const settle = () => {
      if (entrance && !ready) entrance.progress(1);
      resetPointer();
    };
    const onScroll = () => { if (window.scrollY > 24) settle(); };
    const onResize = () => { settle(); };
    const onVisibility = () => { if (document.hidden) settle(); };

    if (interactive && window.createMoveloBall) {
      sphere = window.createMoveloBall(hero, (x, y) => {
        if (!ready || !pointerX) return;
        pointerX(x);
        pointerY(y);
      });
    }

    if (!entrancePlayed && !window.location.hash && window.scrollY < 24 && !document.hidden) {
      entrancePlayed = true;
      gsap.set([...ball, ...wordmark, ...lineText], { willChange: 'transform' });
      // Navigation is available immediately. The artwork and type resolve in 1.5s.
      entrance = gsap.timeline({ id: 'hero-entrance', defaults: { ease: 'power3.out' }, onComplete: clearEntrance });
      entrance
        .from(header, { y: 10, opacity: 0, duration: .55, stagger: .035 }, 0)
        .from(supporting, { y: 10, opacity: 0, duration: .65, stagger: .12 }, .15)
        .fromTo(lines, { clipPath: 'inset(0% -8% 100% -8%)' }, { clipPath: 'inset(-12% -8% -18% -8%)', duration: .85, stagger: .09 }, .12)
        .from(lineText, { yPercent: 105, rotation: 3, transformOrigin: '0% 100%', duration: 1, stagger: .09 }, .12)
        .fromTo(wordmark, { y: desktop ? 65 : 28, clipPath: 'inset(0% -5% 100% -5%)' }, { y: 0, clipPath: 'inset(-45% -5% -65% -5%)', duration: 1.15 }, .22)
        .from(ball, { x: desktop ? 100 : 42, y: desktop ? -75 : -35, rotation: -16, scale: 1.08, duration: 1.5, ease: 'power4.out' }, 0);
      if (interactive) entrance.from(shadow, { x: 100, y: -75, scale: 1.08, duration: 1.5, ease: 'power4.out' }, 0);
    } else {
      entrancePlayed = true;
      activateDepth();
    }

    hero.addEventListener('pointerleave', resetPointer);
    hero.addEventListener('focusin', settle);
    document.querySelector('.header-shell')?.addEventListener('focusin', settle);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', settle);
    return () => {
      sphere?.dispose();
      hero.removeEventListener('pointerleave', resetPointer);
      hero.removeEventListener('focusin', settle);
      document.querySelector('.header-shell')?.removeEventListener('focusin', settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', settle);
      // These may be created by onComplete after the matchMedia callback returns.
      depth?.scrollTrigger?.kill();
      depth?.revert();
      [pointerX, pointerY].forEach(tween => tween?.tween?.revert());
      gsap.set([...ballPointer, ...shadowPointer, ...shadow, ...select('.hero-ball, .hero-photo, .hero-shadow'), ...wordmark], { clearProps: 'transform,willChange' });
      hero.classList.remove('has-pointer-scene');
    };
  });
})();
