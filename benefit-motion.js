/* Benefits: staged editorial reveals and interruptible, native-details accordions. */
(() => {
  const { gsap, ScrollTrigger } = window;
  const section = document.querySelector('.benefit');
  if (!section || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const seen = new Set();
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const select = gsap.utils.selector(section);
    const reveals = [];
    const refresh = gsap.delayedCall(.08, () => ScrollTrigger.refresh()).pause();
    const reveal = (key, trigger, build) => {
      if (seen.has(key)) return;
      const timeline = gsap.timeline({
        paused: true, defaults: { ease: 'power3.out', duration: .85 },
        onComplete: () => seen.add(key)
      });
      build(timeline);
      const scroll = ScrollTrigger.create({
        id: `benefit-${key}`, trigger, start: 'top 88%', once: true,
        onEnter: () => { seen.add(key); timeline.play(); }
      });
      reveals.push({ timeline, scroll, key });
    };
    const clear = () => ({ clearProps: 'transform,opacity,clipPath,willChange' });

    reveal('copy', select('.benefit-copy')[0], timeline => {
      const eyebrow = select('.benefit-copy > .section-eyebrow');
      const title = select('#benefit-title');
      const art = select('.benefit-title-art');
      const tags = select('.benefit-tags > span');
      timeline
        .from(eyebrow, { y: 12, opacity: 0, duration: .5 }, 0)
        .fromTo(title, { y: 28, clipPath: 'inset(-15% -6% 100% -6%)' },
          { y: 0, clipPath: 'inset(-15% -6% -25% -6%)', duration: 1 }, .07)
        .from(art, { y: 12, rotation: -10, scale: .85, transformOrigin: '50% 70%', duration: 1.05 }, .14)
        .from(tags, { y: 14, opacity: 0, stagger: .07, duration: .65 }, .26)
        .set([...eyebrow, ...title, ...art, ...tags], clear(), 1.2);
    });
    reveal('accordion', select('.benefit-accordion')[0], timeline => {
      const rows = select('.benefit-accordion details');
      timeline.from(rows, { y: 18, opacity: 0, stagger: .08, duration: .65 })
        .set(rows, clear());
    });
    reveal('precision', select('.precision-card')[0], timeline => {
      const panel = select('.precision-card');
      const text = select('.precision-established, .precision-description, .precision-action');
      timeline.from(panel, { y: 32, opacity: 0, duration: .95 }, 0)
        .from(text, { y: 16, opacity: 0, stagger: .09, duration: .7 }, .15)
        .set([...panel, ...text], clear());
    });
    reveal('tennis', select('.tennis-feature')[0], timeline => {
      const image = select('.tennis-feature > img');
      const label = select('.sale-label');
      const metric = select('.activity-card');
      timeline.from(image, { scale: 1.14, duration: 1.25, ease: 'power2.out' }, 0)
        .from(label, { y: -12, opacity: 0, duration: .55 }, .15)
        .from(metric, { y: 30, opacity: 0, rotation: -3, transformOrigin: '20% 100%', duration: .9 }, .22)
        .set([...image, ...label, ...metric], clear());
    });

    const settleReveals = () => reveals.forEach(({ timeline, scroll, key }) => {
      seen.add(key); timeline.progress(1); scroll.kill();
    });
    section.addEventListener('focusin', settleReveals);

    const accordion = section.querySelector('.benefit-accordion');
    const states = [...accordion.querySelectorAll('details')].map(details => ({
      details, summary: details.querySelector('summary'), body: details.querySelector('p'),
      mark: details.querySelector('.disclosure-mark'), name: details.getAttribute('name'),
      expanded: details.open, tween: null
    }));
    accordion.classList.add('is-animated');

    const finish = state => {
      state.details.open = state.expanded;
      gsap.set(state.details, { clearProps: 'height,overflow' });
      gsap.set(state.body, { clearProps: 'opacity,transform' });
      state.body.removeAttribute('aria-hidden');
      state.tween = null;
      refresh.restart(true);
    };
    const change = (state, expanded) => {
      state.tween?.kill();
      const height = state.details.getBoundingClientRect().height;
      state.expanded = expanded;
      state.summary.setAttribute('aria-expanded', String(expanded));
      state.body.setAttribute('aria-hidden', String(!expanded));
      // Keep content rendered while closing; remove open only when it settles.
      state.details.open = true;
      const target = state.summary.offsetHeight + (expanded ? state.body.offsetHeight : 0);
      gsap.set(state.details, { height, overflow: 'hidden' });
      state.tween = gsap.timeline({ onComplete: () => finish(state) })
        .to(state.details, { height: target, duration: .44, ease: 'power3.inOut' }, 0)
        .to(state.mark, { '--disclosure-turn': expanded ? '0deg' : '90deg', duration: .35, ease: 'power3.inOut' }, 0)
        .to(state.body, { opacity: expanded ? 1 : 0, y: expanded ? 0 : -5, duration: .25, ease: 'power2.out' }, expanded ? .08 : 0);
    };
    states.forEach(state => {
      // Native grouping would instantly hide the outgoing panel before its animation.
      state.details.removeAttribute('name');
      gsap.set(state.mark, { '--disclosure-turn': state.expanded ? '0deg' : '90deg' });
      state.onClick = event => {
        event.preventDefault();
        settleReveals();
        const expanded = !state.expanded;
        states.forEach(other => { if (other !== state && other.expanded) change(other, false); });
        change(state, expanded);
      };
      state.summary.addEventListener('click', state.onClick);
    });
    const onResize = () => states.forEach(state => {
      if (state.tween) { state.tween.kill(); finish(state); }
    });
    window.addEventListener('resize', onResize);

    return () => {
      refresh.kill();
      section.removeEventListener('focusin', settleReveals);
      window.removeEventListener('resize', onResize);
      accordion.classList.remove('is-animated');
      states.forEach(state => {
        state.tween?.kill();
        gsap.killTweensOf([state.details, state.body, state.mark]);
        state.details.open = state.expanded;
        state.summary.removeEventListener('click', state.onClick);
        state.summary.removeAttribute('aria-expanded');
        state.body.removeAttribute('aria-hidden');
        gsap.set(state.details, { clearProps: 'height,overflow' });
        gsap.set(state.body, { clearProps: 'opacity,transform' });
        state.mark.style.removeProperty('--disclosure-turn');
      });
      states.forEach(state => { if (state.name !== null) state.details.setAttribute('name', state.name); });
    };
  });
})();
