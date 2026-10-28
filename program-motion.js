/* Programs: one-time entrances and manual, interruptible directional transitions. */
(() => {
  const { gsap, ScrollTrigger } = window;
  const section = document.querySelector('.program');
  if (!section || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const cards = [...section.querySelectorAll('.program-card')];
  const counter = section.querySelector('#program-current');
  const seen = new Set();
  // Prepare the local photos before the carousel is reached, avoiding blank arrivals.
  const preload = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    section.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    preload.disconnect();
  }, { rootMargin: '450px' });
  preload.observe(section);

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const select = gsap.utils.selector(section);
    const entrances = [];
    let transition = null;
    let pendingRender = null;
    const clear = targets => gsap.set(targets, { clearProps: 'transform,opacity,clipPath' });
    const visibleCards = () => cards.filter(card => !card.hidden)
      .sort((a, b) => Number(a.style.order) - Number(b.style.order));
    const reveal = (key, element, build) => {
      if (seen.has(key)) return;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      build(timeline);
      const trigger = ScrollTrigger.create({
        id: `program-${key}`, trigger: element, start: 'top 88%', once: true,
        onEnter: () => { seen.add(key); timeline.play(); }
      });
      entrances.push({ key, timeline, trigger });
    };
    reveal('heading', select('.program-topline')[0], timeline => {
      const top = select('.program-tags > span, .program-topline .section-eyebrow');
      const title = select('#program-title');
      const art = select('.program-title-art');
      const copy = select('.program-heading > p');
      timeline.from(top, { y: 12, opacity: 0, stagger: .05, duration: .55 }, 0)
        .fromTo(title, { y: 28, clipPath: 'inset(-12% -5% 100% -5%)' },
          { y: 0, clipPath: 'inset(-12% -5% -25% -5%)', duration: 1 }, .08)
        .from(art, { y: 10, rotation: -8, scale: .88, duration: .95 }, .15)
        .from(copy, { y: 14, opacity: 0, duration: .7 }, .27)
        .set([...top, ...title, ...art, ...copy], { clearProps: 'transform,opacity,clipPath' });
    });
    reveal('navigation', select('.program-pagination')[0], timeline => {
      const items = select('.program-counter, .program-arrows');
      timeline.from(items, { y: 18, opacity: 0, stagger: .1, duration: .75 })
        .set(items, { clearProps: 'transform,opacity' });
    });
    visibleCards().forEach((card, index) => reveal(`card-${index}`, card, timeline => {
      const photo = card.querySelector('.partner-photo, .event-photo');
      timeline.from(card, { y: 34, opacity: 0, rotation: index ? .7 : -.7, duration: .95 }, index * .06);
      if (photo) timeline.from(photo, { scale: 1.1, duration: 1.15 }, .06);
      timeline.set(photo ? [card, photo] : card, { clearProps: 'transform,opacity' });
    }));

    const settleEntrances = () => entrances.forEach(({ key, timeline, trigger }) => {
      seen.add(key); timeline.progress(1); trigger.kill();
    });
    const finishChange = () => {
      transition?.kill(); transition = null;
      if (pendingRender) { const render = pendingRender; pendingRender = null; render(); }
      clear([...cards, counter]);
    };
    const change = (direction, render) => {
      settleEntrances();
      const interrupted = Boolean(transition);
      transition?.kill(); clear([...cards, counter]);
      pendingRender = render;
      const arrive = () => {
        pendingRender(); pendingRender = null;
        transition = gsap.timeline({
          onComplete: () => { clear([...cards, counter]); transition = null; ScrollTrigger.refresh(); }
        }).fromTo(visibleCards(), { x: direction * 32, opacity: 0 }, {
          x: 0, opacity: 1, stagger: .045, duration: .48, ease: 'power3.out'
        }, 0).fromTo(counter, { y: direction * 14, opacity: 0 }, {
          y: 0, opacity: 1, duration: .36, ease: 'power3.out'
        }, .04);
      };
      // Rapid input immediately shows the newest pair; no queued stale transitions.
      if (interrupted) arrive();
      else transition = gsap.timeline({ onComplete: arrive })
        .to(visibleCards(), { x: direction * -20, opacity: 0, duration: .14, ease: 'power2.in' }, 0)
        .to(counter, { y: direction * -10, opacity: 0, duration: .14 }, 0);
    };
    window.moveloProgramMotion = { change };
    const onVisibility = () => { if (document.hidden) finishChange(); };
    section.addEventListener('focusin', settleEntrances);
    window.addEventListener('resize', finishChange);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      finishChange();
      delete window.moveloProgramMotion;
      section.removeEventListener('focusin', settleEntrances);
      window.removeEventListener('resize', finishChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });
})();
