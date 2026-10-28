/* Movelo's closing signature: staggered print strips and a cursor-following ink reveal. */
(() => {
  const { gsap, ScrollTrigger } = window;
  const footer = document.querySelector('.site-footer');
  if (!footer || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const seen = new Set();
  const svgNS = 'http://www.w3.org/2000/svg';
  const makeSVG = (tag, attributes = {}) => {
    const element = document.createElementNS(svgNS, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  };

  gsap.matchMedia().add({
    motion: '(prefers-reduced-motion: no-preference)',
    pointer: '(hover: hover) and (pointer: fine)'
  }, context => {
    if (!context.conditions.motion) return;
    const select = gsap.utils.selector(footer);
    const entries = [];
    const wordmark = footer.querySelector('.footer-wordmark');
    const original = wordmark.querySelector('text');
    const backTop = footer.querySelector('.footer-top-link');
    const topIcon = backTop.querySelector('svg');
    let hoverTween;
    let inkTween;
    let disposed = false;
    let wordmarkReady = seen.has('signature');

    const reveal = (key, triggerElement, build) => {
      if (seen.has(key)) return;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      build(timeline);
      const trigger = ScrollTrigger.create({
        id: `footer-${key}`, trigger: triggerElement, start: 'clamp(top 91%)', once: true,
        onEnter: () => { seen.add(key); timeline.play(); }
      });
      entries.push({ key, timeline, trigger });
    };
    const clear = targets => gsap.set(targets, { clearProps: 'transform,opacity,clipPath,transformOrigin' });

    reveal('message', select('.footer-message')[0], timeline => {
      const title = select('.footer-message h2');
      const benefits = select('.footer-benefits > a');
      timeline.fromTo(title, { y: 28, clipPath: 'inset(-12% -5% 100% -5%)' },
        { y: 0, clipPath: 'inset(-12% -5% -20% -5%)', duration: .95 }, 0)
        .from(benefits, { y: 14, opacity: 0, duration: .6, stagger: .07 }, .24)
        .set([...title, ...benefits], { clearProps: 'transform,opacity,clipPath' });
    });
    reveal('photo', select('.footer-explore-card')[0], timeline => {
      const card = select('.footer-explore-card');
      const image = select('.footer-explore-card > img');
      timeline.from(card, { y: 28, rotation: -4, transformOrigin: '10% 100%', opacity: 0, duration: .95 }, 0)
        .from(image, { scale: 1.13, duration: 1.2, ease: 'power2.out' }, 0)
        .set([...card, ...image], { clearProps: 'transform,opacity,transformOrigin' });
    });
    reveal('navigation', select('.footer-navigation')[0], timeline => {
      const links = select('.footer-nav > a, .footer-nav > button');
      timeline.from(links, { y: 10, opacity: 0, duration: .5, stagger: .04 }, 0)
        .from(backTop, { scale: .82, opacity: 0, duration: .75 }, .1)
        .from(topIcon, { rotation: -100, duration: .95 }, .1)
        .set([...links, backTop, topIcon], { clearProps: 'transform,opacity' });
    });
    reveal('details', select('.footer-contact')[0], timeline => {
      const details = select('.footer-contact > *, .footer-legal > *');
      timeline.from(details, { y: 12, opacity: 0, duration: .55, stagger: .045 })
        .set(details, { clearProps: 'transform,opacity' });
    });
    reveal('bottom', select('.footer-bottom')[0], timeline => {
      const items = select('.footer-tools > *, .footer-bottom > p');
      timeline.from(items, { y: 10, opacity: 0, duration: .55, stagger: .06 })
        .set(items, { clearProps: 'transform,opacity' });
    });

    // Duplicate full text into clipping bands, preserving exact font shaping and kerning.
    // The source text becomes visible again after the one-time entrance.
    const defs = makeSVG('defs', { 'data-footer-motion': '' });
    wordmark.prepend(defs);
    const print = makeSVG('g', { 'data-footer-motion': '' });
    const stripTexts = [];
    if (!wordmarkReady) {
      for (let index = 0; index < 7; index++) {
        const clip = makeSVG('clipPath', { id: `footer-print-strip-${index}`, clipPathUnits: 'userSpaceOnUse' });
        clip.append(makeSVG('rect', { x: index * 1100 / 7 - .25, y: -350, width: 1100 / 7 + .5, height: 900 }));
        defs.append(clip);
        const strip = makeSVG('g', { 'clip-path': `url(#footer-print-strip-${index})` });
        const text = original.cloneNode(true);
        strip.append(text); print.append(strip); stripTexts.push(text);
      }
      wordmark.append(print);
      gsap.set(original, { opacity: 0 });
    }
    const inkClip = makeSVG('clipPath', { id: 'footer-ink-lens', clipPathUnits: 'userSpaceOnUse' });
    const inkCircle = makeSVG('circle', { cx: -200, cy: 100, r: 145 });
    inkClip.append(inkCircle); defs.append(inkClip);
    const ink = original.cloneNode(true);
    ink.setAttribute('data-footer-motion', '');
    ink.setAttribute('clip-path', 'url(#footer-ink-lens)');
    ink.setAttribute('fill', '#bf3900');
    ink.style.opacity = '0';
    wordmark.append(ink);
    const lens = { x: -200, y: 100 };
    const updateLens = () => { inkCircle.setAttribute('cx', lens.x); inkCircle.setAttribute('cy', lens.y); };
    const finishSignature = () => {
      wordmarkReady = true;
      original.style.removeProperty('opacity');
      print.remove();
      stripTexts.length = 0;
    };
    reveal('signature', wordmark, timeline => {
      timeline.fromTo(stripTexts, { y: 225 }, { y: 0, duration: 1.15, stagger: .045, ease: 'power4.out' }, 0)
        .fromTo(ink, { opacity: 0 }, { opacity: 1, duration: .18 }, .2)
        .fromTo(lens, { x: -200 }, { x: 1300, duration: 1.3, ease: 'power2.inOut', onUpdate: updateLens }, .22)
        .to(ink, { opacity: 0, duration: .24 }, 1.3)
        .call(finishSignature, [], 1.56);
    });

    const xTo = gsap.quickTo(lens, 'x', { duration: .45, ease: 'power3.out', onUpdate: updateLens });
    const yTo = gsap.quickTo(lens, 'y', { duration: .45, ease: 'power3.out', onUpdate: updateLens });
    let pointerInside = false;
    const moveInk = event => {
      if (!context.conditions.pointer || event.pointerType !== 'mouse' || !wordmarkReady || disposed) return;
      const bounds = wordmark.getBoundingClientRect();
      xTo((event.clientX - bounds.left) / bounds.width * 1100);
      yTo((event.clientY - bounds.top) / bounds.height * 200);
      if (!pointerInside) {
        pointerInside = true; inkTween?.kill();
        inkTween = gsap.to(ink, { opacity: 1, duration: .2, overwrite: true });
      }
    };
    const leaveInk = () => {
      pointerInside = false; inkTween?.kill();
      inkTween = gsap.to(ink, { opacity: 0, duration: .35, overwrite: true });
    };
    const settleEntries = () => entries.forEach(({ key, timeline, trigger }) => {
      seen.add(key); timeline.progress(1); trigger.kill();
    });
    const engageTop = () => {
      settleEntries(); hoverTween?.kill();
      hoverTween = gsap.to(topIcon, { rotation: 90, scale: 1.08, duration: .65, ease: 'power3.out' });
    };
    const releaseTop = () => {
      if (backTop.matches(':hover, :focus-visible')) return;
      hoverTween?.kill(); hoverTween = gsap.to(topIcon, { rotation: 0, scale: 1, duration: .65, ease: 'power3.out' });
    };
    const goTop = event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      settleEntries(); leaveInk();
      document.querySelector('#main').focus({ preventScroll: true });
      if (location.hash !== '#main') history.pushState(null, '', '#main');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const onVisibility = () => {
      if (document.hidden) { leaveInk(); hoverTween?.kill(); clear(topIcon); }
    };
    footer.addEventListener('focusin', settleEntries);
    wordmark.addEventListener('pointermove', moveInk);
    wordmark.addEventListener('pointerleave', leaveInk);
    backTop.addEventListener('pointerenter', engageTop);
    backTop.addEventListener('pointerleave', releaseTop);
    backTop.addEventListener('focus', engageTop);
    backTop.addEventListener('blur', releaseTop);
    backTop.addEventListener('click', goTop);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      hoverTween?.kill(); inkTween?.kill(); xTo.tween.kill(); yTo.tween.kill();
      footer.removeEventListener('focusin', settleEntries);
      wordmark.removeEventListener('pointermove', moveInk);
      wordmark.removeEventListener('pointerleave', leaveInk);
      backTop.removeEventListener('pointerenter', engageTop);
      backTop.removeEventListener('pointerleave', releaseTop);
      backTop.removeEventListener('focus', engageTop);
      backTop.removeEventListener('blur', releaseTop);
      backTop.removeEventListener('click', goTop);
      document.removeEventListener('visibilitychange', onVisibility);
      original.style.removeProperty('opacity');
      clear(topIcon);
      print.remove(); ink.remove(); defs.remove();
    };
  });
})();
