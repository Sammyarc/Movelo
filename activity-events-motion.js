/* Activity and Events: composed entrances; existing preview and dialog behavior stays authoritative. */
(() => {
  const { gsap, ScrollTrigger } = window;
  const tracking = document.querySelector('.tracking-section');
  const events = document.querySelector('.current-events');
  if (!gsap || !ScrollTrigger || !tracking || !events) return;
  gsap.registerPlugin(ScrollTrigger);
  const seen = new Set();
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const reveals = [];
    const clean = { clearProps: 'transform,opacity,clipPath' };
    const reveal = (key, section, target, build) => {
      if (seen.has(key)) return;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      build(timeline);
      const trigger = ScrollTrigger.create({
        id: key, trigger: target, start: 'top 88%', once: true,
        onEnter: () => { seen.add(key); timeline.play(); }
      });
      reveals.push({ key, section, timeline, trigger });
    };
    const settle = section => reveals.filter(item => item.section === section).forEach(item => {
      seen.add(item.key); item.timeline.progress(1); item.trigger.kill();
    });
    const $ = (section, selector) => [...section.querySelectorAll(selector)];

    reveal('activity-scene', tracking, tracking.querySelector('.tracking-visual'), timeline => {
      const photo = $(tracking, '.tracking-hoop');
      const dashboard = $(tracking, '.activity-dashboard');
      // The dashboard and all numeric values remain opaque throughout the entrance.
      timeline.from(photo, { scale: 1.09, duration: 1.2, ease: 'power2.out' }, 0)
        .from(dashboard, { y: 24, rotation: -1.2, duration: .95 }, .08)
        .set([...photo, ...dashboard], clean);
    });
    reveal('activity-chart', tracking, tracking.querySelector('.activity-chart'), timeline => {
      const chart = tracking.querySelector('.activity-chart');
      const paths = [...chart.querySelectorAll(':scope > path')].slice(0, 2);
      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
          strokeDashoffset: 0, duration: index ? .8 : 1.05, ease: 'power2.inOut'
        }, index ? .26 : 0);
      });
      const marker = chart.querySelector(':scope > circle');
      timeline.from(marker, { scale: .4, transformOrigin: '50% 50%', duration: .42, ease: 'back.out(1.3)' }, .62)
        .set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' })
        .set(marker, { clearProps: 'transform,transformOrigin' });
    });
    reveal('activity-heading', tracking, tracking.querySelector('.tracking-heading'), timeline => {
      const eyebrow = $(tracking, '.tracking-heading .section-eyebrow');
      const title = $(tracking, '#tracking-title');
      const art = $(tracking, '.tracking-title-art');
      const categories = $(tracking, '.tracking-category, .tracking-count');
      timeline.from(eyebrow, { y: 12, opacity: 0, duration: .5 }, 0)
        .fromTo(title, { y: 24, clipPath: 'inset(-15% -5% 100% -5%)' }, {
          y: 0, clipPath: 'inset(-15% -5% -20% -5%)', duration: 1
        }, .08)
        .from(art, { rotation: -9, scale: .9, duration: .95 }, .18)
        .from(categories, { y: 14, opacity: 0, stagger: .055, duration: .6 }, .28)
        .set([...eyebrow, ...title, ...art, ...categories], clean);
    });
    reveal('activity-action', tracking, tracking.querySelector('.tracking-description'), timeline => {
      const copy = $(tracking, '.tracking-description > p');
      const control = $(tracking, '.tracking-explore');
      timeline.from(copy, { y: 15, opacity: 0, stagger: .08, duration: .7 }, 0)
        .from(control, { y: 16, opacity: 0, duration: .7 }, .14)
        .set([...copy, ...control], clean);
    });
    reveal('activity-mood', tracking, tracking.querySelector('.mood-card'), timeline => {
      const card = $(tracking, '.mood-card');
      const photo = $(tracking, '.mood-photo-panel > img');
      const label = $(tracking, '.mood-year, .mood-coming, .mood-footer');
      timeline.from(card, { y: 28, opacity: 0, rotation: 1, duration: .9 }, 0)
        .from(photo, { scale: 1.08, duration: 1.15 }, 0)
        .from(label, { y: 8, opacity: 0, stagger: .06, duration: .6 }, .25)
        .set([...card, ...photo, ...label], clean);
    });

    reveal('events-heading', events, events.querySelector('.events-heading'), timeline => {
      const eyebrow = $(events, '.events-heading .section-eyebrow');
      const title = $(events, '#current-events-title');
      const art = $(events, '.events-title-art, .events-leaf');
      timeline.from(eyebrow, { y: 12, opacity: 0, duration: .5 }, 0)
        .fromTo(title, { y: 25, clipPath: 'inset(-15% -5% 100% -5%)' }, {
          y: 0, clipPath: 'inset(-15% -5% -15% -5%)', duration: 1.1
        }, .08)
        .from(art, { rotation: -8, scale: .9, stagger: .08, duration: .9 }, .18)
        .set([...eyebrow, ...title, ...art], clean);
    });
    const preview = events.querySelector('.events-tennis-photo');
    reveal('events-photo', events, preview, timeline => {
      // The figure owns the entrance; the image remains free for existing async crossfades.
      timeline.from(preview, { y: 24, opacity: 0, scale: .96, duration: .9 })
        .set(preview, clean);
    });
    const rows = $(events, '.event-row');
    rows.forEach((row, index) => reveal(`events-row-${index}`, events, row, timeline => {
      // Keep row geometry fixed so pointer/focus preview positioning never jumps.
      const content = [...row.children];
      timeline.from(content, { y: 12, opacity: 0, stagger: .04, duration: .65 })
        .set(content, clean);
    }));

    let tilt;
    const setTilt = value => {
      tilt?.kill();
      tilt = gsap.to(preview, { '--event-motion-tilt': `${value}deg`, duration: .38, ease: 'power3.out' });
    };
    const handlers = rows.map((row, index) => {
      const enter = event => {
        if (event.pointerType === 'touch') return;
        settle(events);
        setTilt([-1.6, 0, 1.2, -.8, 1.6][index]);
      };
      const focus = () => { settle(events); setTilt([-1.6, 0, 1.2, -.8, 1.6][index]); };
      row.addEventListener('pointerenter', enter);
      row.addEventListener('focus', focus);
      return { row, enter, focus };
    });
    const eventArea = events.querySelector('.events-list-wrap');
    const resetTilt = () => setTilt(0);
    const onTrackingFocus = () => settle(tracking);
    const onEventsFocus = () => settle(events);
    const onFocusOut = () => queueMicrotask(() => { if (!eventArea.contains(document.activeElement)) resetTilt(); });
    tracking.addEventListener('focusin', onTrackingFocus);
    events.addEventListener('focusin', onEventsFocus);
    eventArea.addEventListener('pointerleave', resetTilt);
    eventArea.addEventListener('focusout', onFocusOut);
    return () => {
      tilt?.kill(); preview.style.removeProperty('--event-motion-tilt');
      handlers.forEach(({ row, enter, focus }) => {
        row.removeEventListener('pointerenter', enter); row.removeEventListener('focus', focus);
      });
      tracking.removeEventListener('focusin', onTrackingFocus);
      events.removeEventListener('focusin', onEventsFocus);
      eventArea.removeEventListener('pointerleave', resetTilt);
      eventArea.removeEventListener('focusout', onFocusOut);
    };
  });
})();
