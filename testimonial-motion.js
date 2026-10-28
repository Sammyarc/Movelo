/* Testimonials: readable, manual editorial transitions with stable controls. */
(() => {
  const { gsap, ScrollTrigger } = window;
  const section = document.querySelector('.testimonials');
  if (!section || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const seen = new Set();
  const quote = section.querySelector('#customer-testimonial');
  const select = gsap.utils.selector(section);

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const entrances = [];
    let transition = null;
    let pendingRender = null;
    const content = () => [...quote.querySelectorAll('.quote-count, blockquote, .testimonial-rating, .quote-footer > div')];
    const clear = targets => gsap.set(targets, { clearProps: 'transform,opacity,clipPath' });
    const reveal = (key, triggerElement, build) => {
      if (seen.has(key)) return;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      build(timeline);
      const trigger = ScrollTrigger.create({
        id: `testimonial-${key}`, trigger: triggerElement, start: 'top 88%', once: true,
        onEnter: () => { seen.add(key); timeline.play(); }
      });
      entrances.push({ key, timeline, trigger });
    };

    reveal('heading', select('.testimonials-heading')[0], timeline => {
      const title = select('#testimonials-title');
      const art = select('.testimonial-title-art');
      const labels = select('.testimonial-heading-labels > span');
      const watermark = select('.testimonial-watermark');
      timeline.fromTo(title, { y: 26, clipPath: 'inset(-20% -5% 100% -5%)' }, {
        y: 0, clipPath: 'inset(-20% -5% -25% -5%)', duration: 1
      }, 0)
        .from(art, { y: 12, rotation: -7, scale: .9, duration: 1 }, .09)
        .from(labels, { y: 12, opacity: 0, stagger: .08, duration: .6 }, .22)
        .from(watermark, { rotation: -7, scale: .95, opacity: 0, transformOrigin: '50% 50%', duration: 1.3 }, 0)
        .set([...title, ...art, ...labels, ...watermark], { clearProps: 'transform,opacity,clipPath' });
    });
    reveal('review', quote, timeline => {
      const count = select('.quote-count');
      const divider = select('.quote-count-rule');
      const body = select('.customer-quote-card blockquote, .testimonial-rating, .quote-footer');
      timeline.from(quote, { y: 30, opacity: 0, duration: .9 }, 0)
        .from(count, { y: 9, opacity: 0, duration: .6 }, .12)
        .from(divider, { scaleX: 0, transformOrigin: '0% 50%', duration: .75 }, .2)
        .from(body, { y: 16, opacity: 0, stagger: .08, duration: .7 }, .18)
        .set([quote, ...count, ...divider, ...body], { clearProps: 'transform,opacity' });
    });
    reveal('session', select('.single-session-card')[0], timeline => {
      const card = select('.single-session-card');
      const photo = select('.single-session-photo');
      const labels = select('.session-labels > span, .session-date');
      const copy = select('.session-copy');
      const price = select('.session-price');
      const footer = select('.session-format, .session-details-button');
      timeline.from(card, { y: 32, opacity: 0, duration: .9 }, 0)
        .from(photo, { scale: 1.1, duration: 1.25, ease: 'power2.out' }, 0)
        .from(labels, { y: -10, opacity: 0, stagger: .045, duration: .6 }, .13)
        .from(copy, { y: 20, opacity: 0, duration: .8 }, .2)
        .from(price, { y: 14, opacity: 0, duration: .7 }, .32)
        .from(footer, { y: 12, opacity: 0, stagger: .05, duration: .6 }, .38)
        .set([...card, ...photo, ...labels, ...copy, ...price, ...footer], { clearProps: 'transform,opacity' });
    });

    const settleEntrances = () => entrances.forEach(({ key, timeline, trigger }) => {
      seen.add(key); timeline.progress(1); trigger.kill();
    });
    const finishChange = () => {
      transition?.kill(); transition = null;
      if (pendingRender) { const render = pendingRender; pendingRender = null; render(); }
      clear(content());
    };
    const change = (direction, render) => {
      settleEntrances();
      const interrupted = Boolean(transition);
      transition?.kill(); clear(content());
      pendingRender = render;
      const arrive = () => {
        const commit = pendingRender;
        pendingRender = null;
        commit();
        transition = gsap.timeline({
          onComplete: () => { clear(content()); transition = null; ScrollTrigger.refresh(); }
        }).fromTo(content(), { x: direction * 22, opacity: 0 }, {
          x: 0, opacity: 1, duration: .44, stagger: .035, ease: 'power3.out'
        }, 0);
      };
      // New input replaces the pending review; the controls never move or lock.
      if (interrupted) arrive();
      else transition = gsap.timeline({ onComplete: arrive }).to(content(), {
        x: direction * -14, opacity: 0, duration: .13, ease: 'power2.in'
      });
    };

    window.moveloTestimonialMotion = { change };
    const onVisibility = () => { if (document.hidden) finishChange(); };
    section.addEventListener('focusin', settleEntrances);
    window.addEventListener('resize', finishChange);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      finishChange();
      delete window.moveloTestimonialMotion;
      section.removeEventListener('focusin', settleEntrances);
      window.removeEventListener('resize', finishChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });
})();
