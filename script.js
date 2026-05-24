/* =========================================================
   Adv. Megha Jain — interactions
   ========================================================= */

// Year
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Nav scroll state
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile quick actions appear after hero CTAs have scrolled away.
const mobileQuick = document.querySelector('.mobile-quick');
const onQuickScroll = () => {
  if (!mobileQuick) return;
  mobileQuick.classList.toggle('visible', window.scrollY > 420);
};
onQuickScroll();
window.addEventListener('scroll', onQuickScroll, { passive: true });

// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  })
);

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active nav section
(function () {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

  sections.forEach(section => sectionObserver.observe(section));
})();

// Custom cursor (desktop only)
(function () {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  const ease = 0.18;

  const onMove = (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.classList.add('is-active');
  };
  const onLeave = () => cursor.classList.remove('is-active');

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', () => cursor.classList.add('is-active'));

  const tick = () => {
    cx += (mx - cx) * ease;
    cy += (my - cy) * ease;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  const hoverables = 'a, button, summary, .row, input, select, textarea, .pillar';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
})();

// Subtle parallax on hero portrait
(function () {
  const fig = document.querySelector('.hero-figure .figure-mask img');
  if (!fig) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const offset = Math.max(-30, Math.min(30, y * 0.04));
      fig.style.transform = `scale(1.04) translateY(${offset}px)`;
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Smooth, exclusive FAQ accordion
(function () {
  const items = document.querySelectorAll('.faq-list details');
  items.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        items.forEach(o => { if (o !== d) o.open = false; });
      }
    });
  });
})();

// Scroll progress bar
(function () {
  const bar = document.querySelector('.scroll-bar span');
  if (!bar) return;
  const tick = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  tick();
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
})();

// Form → mailto fallback (no backend)
function sendMail(e) {
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  const email = f.email.value.trim();
  const phone = f.phone.value.trim();
  const matter = f.matter.value;
  const msg = f.message.value.trim();

  const subject = `New enquiry — ${matter} — ${name}`;
  const body =
    `Name: ${name}\r\n` +
    `Email: ${email}\r\n` +
    `Phone: ${phone}\r\n` +
    `Matter: ${matter}\r\n\r\n` +
    `${msg}`;

  window.location.href =
    `mailto:office@advmeghajain.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return false;
}
