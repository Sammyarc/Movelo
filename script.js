const sectionDialog = document.querySelector('#section-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
  const darker = document.documentElement.classList.toggle('darker');
  themeToggle.setAttribute('aria-pressed', String(darker));
  themeToggle.setAttribute('aria-label', darker ? 'Use lighter appearance' : 'Use darker appearance');
});

const footerPlaceholder = document.querySelector('#footer-placeholder-dialog');
document.querySelectorAll('[data-footer-placeholder]').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.footerPlaceholder;
    document.querySelector('#footer-placeholder-title').textContent = name;
    document.querySelector('#footer-placeholder-description').textContent = `The ${name} link is a placeholder for now. Its destination has not been added yet.`;
    footerPlaceholder.showModal();
  });
});
document.querySelectorAll('.footer-resource-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#footer-resources-dialog').close();
    const target = document.querySelector(link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// The reference review is first. All additional reviews are visibly marked fictional demos.
const testimonialCard = document.querySelector('#customer-testimonial');
const testimonialQuote = testimonialCard.querySelector('blockquote p');
const referenceQuoteNodes = [...testimonialQuote.childNodes].map(node => node.cloneNode(true));
const referenceQuoteText = testimonialQuote.textContent.replace(/\s+/g, ' ').trim();
const demoTestimonials = [
  ['Maya Ellis', 5, 'A short activity break gives my day a lift. I like seeing the small steps add up over the week.'],
  ['Daniel Reed', 4.5, 'The group challenges make a regular workout feel more social. There is always a reason to show up.'],
  ['Zara Cole', 4, 'Trying a new sport felt less intimidating with a friendly group. I found a pace that works for me.'],
  ['Leo Martin', 5, 'A game with friends is my favorite way to get moving. The mix of activities keeps things interesting.'],
  ['Ava Brooks', 4.5, 'I enjoy keeping a simple record of my movement. It helps me notice the effort I put in each day.'],
  ['Noah Lane', 4, 'The beginner sessions gave me space to learn. A little encouragement made it easier to come back.'],
  ['Amira Stone', 5, 'I came for a workout and stayed for the conversations. Sharing the experience makes it more enjoyable.'],
  ['Lucas Vale', 4.5, 'Having a weekly challenge gives me something to aim for. I can make progress at my own pace.'],
  ['Chloe Reid', 5, 'The court is where I switch off and have fun. I like finding people who enjoy the same activities.'],
  ['Ethan Park', 4, 'A quick session fits into a busy day. I appreciate having different ways to stay active.'],
  ['Nina Blake', 4.5, 'Seeing my activity together helps me plan the next week. Small, steady habits feel achievable.'],
  ['Owen Miles', 5, 'Friendly games bring out my competitive side. The best part is cheering everyone on afterward.'],
  ['Leah Grant', 4.5, 'I like balancing solo training with community activities. It gives my routine a welcome change.'],
  ['Finn Harper', 4, 'Learning the basics with other beginners made the session relaxed. I left wanting to practice more.'],
  ['Ruby Hayes', 5, 'Movement feels easier when it is something I look forward to. The social side makes a difference.'],
  ['Adam Wells', 4.5, 'A simple challenge helps me stay consistent. I focus on the next step and enjoy the process.'],
  ['Iris Bennett', 5, 'There is something satisfying about a good rally. Playing together turns exercise into a shared moment.'],
  ['Theo Morgan', 4, 'I enjoy exploring activities outside my usual routine. Each session is a chance to learn something.'],
  ['Ella Reed', 4.5, 'The mix of movement and community keeps me interested. It is a good reminder to make time for myself.']
].map(([name, rating, quote]) => ({ name, rating, quote: `“${quote}”`, detail: 'Fictional customer', demo: true }));
const testimonials = [{ name: 'Benedeta Chan', rating: 4.5, quote: referenceQuoteText, detail: 'Housewife in china', demo: false }, ...demoTestimonials];
let testimonialIndex = 0;

function showTestimonial(index) {
  const direction = index >= testimonialIndex ? 1 : -1;
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  const selectedIndex = testimonialIndex;
  const review = testimonials[selectedIndex];
  const render = () => {
    if (review.demo) testimonialQuote.textContent = review.quote;
    else testimonialQuote.replaceChildren(...referenceQuoteNodes.map(node => node.cloneNode(true)));
    testimonialCard.classList.toggle('is-demo', review.demo);
    testimonialCard.querySelector('.quote-demo-label').hidden = !review.demo;
    document.querySelector('#testimonial-author').textContent = review.name;
    document.querySelector('#testimonial-person-detail').textContent = review.detail;
    const count = document.querySelector('#testimonial-count');
    count.textContent = `${selectedIndex + 1}/${testimonials.length}`;
    count.setAttribute('aria-label', `Testimonial ${selectedIndex + 1} of ${testimonials.length}`);
    document.querySelector('#testimonial-rating-value').textContent = String(review.rating);
    const fullStars = Math.floor(review.rating);
    const fraction = review.rating - fullStars;
    document.querySelector('#testimonial-rating-fill').setAttribute('width', String(fullStars * 25 + fraction * 24 - (fraction === 0 ? 1 : 0)));
    document.querySelector('#testimonial-status').textContent = `${review.demo ? 'Demo review. Fictional customer. ' : ''}Testimonial ${selectedIndex + 1} of ${testimonials.length}. ${review.name}. ${review.quote} ${review.rating} out of 5 stars.`;
  };
  if (window.moveloTestimonialMotion) window.moveloTestimonialMotion.change(direction, render);
  else render();
}

document.querySelector('.quote-prev').addEventListener('click', () => showTestimonial(testimonialIndex - 1));
document.querySelector('.quote-next').addEventListener('click', () => showTestimonial(testimonialIndex + 1));
document.querySelector('.quote-action-wrap').addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showTestimonial(testimonialIndex + (event.key === 'ArrowRight' ? 1 : -1));
});

document.querySelectorAll('[data-section]').forEach((button) => {
  button.addEventListener('click', () => {
    dialogTitle.textContent = button.dataset.section;
    sectionDialog.showModal();
  });
});

sectionDialog.addEventListener('click', (event) => {
  if (event.target === sectionDialog) {
    const bounds = sectionDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      sectionDialog.close();
    }
  }
});

const programCards = [...document.querySelectorAll('#program-cards > article')];
const programCurrent = document.querySelector('#program-current');
const programStatus = document.querySelector('#program-status');
let programIndex = 0;

function showProgramEvents(index) {
  const direction = index >= programIndex ? 1 : -1;
  programIndex = (index + programCards.length) % programCards.length;
  const selectedIndex = programIndex;
  const nextIndex = (selectedIndex + 1) % programCards.length;
  const render = () => {
    programCards.forEach((card, cardIndex) => {
      card.hidden = cardIndex !== selectedIndex && cardIndex !== nextIndex;
      card.style.order = cardIndex === selectedIndex ? '0' : '1';
    });
    programCurrent.textContent = String(selectedIndex + 1).padStart(2, '0');
    programStatus.textContent = `Showing events ${selectedIndex + 1} and ${nextIndex + 1} of ${programCards.length}.`;
  };
  if (window.moveloProgramMotion) window.moveloProgramMotion.change(direction, render);
  else render();
}

document.querySelector('.program-prev').addEventListener('click', () => showProgramEvents(programIndex - 1));
document.querySelector('.program-next').addEventListener('click', () => showProgramEvents(programIndex + 1));
document.querySelector('.program-arrows').addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showProgramEvents(programIndex + (event.key === 'ArrowRight' ? 1 : -1));
});

document.querySelectorAll('[data-dialog]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.dialog).showModal();
  });
});

document.querySelectorAll('.activity-modal').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});

const eventDialog = document.querySelector('#event-details-dialog');
const eventDetails = {
  fitness: { title: 'Online Fitness Challenge', image: 'program-online-fitness.png', description: 'Virtual challenges and guided training to keep you moving.' },
  camp: { title: 'Youth Sports Camp — 20yo', image: 'program-youth-camp.png', description: 'Coach & Trainer · Solid Community · Team Uniform' },
  obstacle: { title: 'Obstacle Course Race', image: 'program-obstacle-race.png', description: 'Take on the course and challenge your strength, balance, and endurance.' },
  game: { title: 'Sport x Game Day', image: 'program-game-day.png', description: 'Get together for friendly games and shared time on the court.' },
  trainer: { title: 'Trainer Meet & Greet', image: 'program-trainer-meet.png', description: 'Meet the coaches and connect with the sports community.' }
};
const eventButtons = [...document.querySelectorAll('[data-event]')];
const eventList = document.querySelector('.events-list');
const eventPreviewArea = document.querySelector('.events-list-wrap');
const eventPreview = document.querySelector('.events-tennis-photo');
const eventPreviewImage = eventPreview.querySelector('img');
const eventMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
eventMotionPreference.addEventListener('change', () => {
  if (eventMotionPreference.matches) eventPreviewImage.getAnimations().forEach(animation => animation.cancel());
});
const defaultEventButton = eventButtons.find(button => button.dataset.event === 'camp');
const eventPreviewDescriptions = {
  fitness: 'An athlete exercising with dumbbells in a bright home studio.',
  camp: eventPreviewImage.alt,
  obstacle: 'A runner crossing a wooden obstacle on an outdoor course.',
  game: 'Friends playing basketball together on an outdoor court.',
  trainer: 'A fitness trainer talking with an athlete beside a sports court.'
};
const eventPreviewLoads = new Map();
let activeEventButton = defaultEventButton;
let hoveredEventButton = null;
let eventPreviewRequest = 0;
let keyboardEventPreview = false;
let eventPointerPosition = null;

function loadEventPreview(key) {
  if (!eventPreviewLoads.has(key)) {
    const image = new Image();
    image.src = `assets/${key === 'camp' ? 'events-tennis-rest.png' : eventDetails[key].image}`;
    eventPreviewLoads.set(key, image.decode().then(() => image).catch(() => {
      eventPreviewLoads.delete(key);
      return null;
    }));
  }
  return eventPreviewLoads.get(key);
}

function positionEventPreview() {
  if (!window.matchMedia('(min-width: 851px)').matches) {
    eventPreview.style.removeProperty('--event-preview-y');
    return;
  }
  const area = eventPreviewArea.getBoundingClientRect();
  const row = activeEventButton.getBoundingClientRect();
  const minimum = -.0035 * area.width;
  const maximum = Math.max(minimum, eventList.offsetHeight - eventPreview.offsetHeight);
  const top = row.top - area.top + row.height / 2 - eventPreview.offsetHeight * .45;
  eventPreview.style.setProperty('--event-preview-y', `${Math.max(minimum, Math.min(maximum, top))}px`);
}

async function showEventPreview(button) {
  activeEventButton = button;
  eventButtons.forEach(row => row.parentElement.classList.toggle('event-active', row === button));
  positionEventPreview();
  const request = ++eventPreviewRequest;
  const key = button.dataset.event;
  const image = await loadEventPreview(key);
  // A slower image must never replace the preview for a more recent hover.
  if (!image || request !== eventPreviewRequest) return;
  if (eventPreviewImage.src !== image.src) {
    eventPreviewImage.src = image.src;
    eventPreviewImage.alt = eventPreviewDescriptions[key];
    eventPreviewImage.getAnimations().forEach(animation => animation.cancel());
    if (!eventMotionPreference.matches) {
      eventPreviewImage.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 140 });
    }
  }
}

function restoreEventPreview() {
  const focused = eventButtons.find(button => button === document.activeElement);
  showEventPreview(focused || hoveredEventButton || defaultEventButton);
}

const eventImageObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  eventButtons.forEach(button => loadEventPreview(button.dataset.event));
  eventImageObserver.disconnect();
}, { rootMargin: '250px' });
eventImageObserver.observe(eventPreviewArea);
new ResizeObserver(positionEventPreview).observe(eventList);
eventPreviewArea.addEventListener('pointerleave', () => {
  hoveredEventButton = null;
  restoreEventPreview();
});
eventList.addEventListener('focusout', () => queueMicrotask(restoreEventPreview));
eventList.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') return;
  const moved = eventPointerPosition && (eventPointerPosition.x !== event.clientX || eventPointerPosition.y !== event.clientY);
  eventPointerPosition = { x: event.clientX, y: event.clientY };
  if (keyboardEventPreview && !moved) return;
  keyboardEventPreview = false;
  const button = event.target.closest('[data-event]');
  if (button && button !== hoveredEventButton) {
    hoveredEventButton = button;
    showEventPreview(button);
  }
});

eventButtons.forEach(button => {
  button.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    eventPointerPosition = { x: event.clientX, y: event.clientY };
    // Focus-induced scrolling can move a row under a stationary mouse.
    if (keyboardEventPreview) return;
    hoveredEventButton = button;
    showEventPreview(button);
  });
  button.addEventListener('focus', () => {
    keyboardEventPreview = button.matches(':focus-visible');
    showEventPreview(button);
  });
  button.addEventListener('click', () => {
    const event = eventDetails[button.dataset.event];
    document.querySelector('#event-details-title').textContent = event.title;
    document.querySelector('#event-details-photo').src = `assets/${event.image}`;
    document.querySelector('#event-details-description').textContent = event.description;
    eventDialog.showModal();
  });
});
eventDialog.addEventListener('click', event => {
  if (event.target !== eventDialog) return;
  const bounds = eventDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) eventDialog.close();
});
