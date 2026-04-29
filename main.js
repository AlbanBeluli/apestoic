/* ── LOADER ──────────────────────────────────────────────────────── */

function createLoader(exit = false) {
  const loader = document.createElement('div');
  loader.className = 'loader' + (exit ? ' open exit' : '');
  loader.innerHTML = `
    <div class="loader-panel loader-panel--top"></div>
    <div class="loader-panel loader-panel--bot"></div>
    <div class="loader-center">
      <div class="loader-mark">A</div>
      <div class="loader-name">APE STOIC</div>
    </div>
  `;
  document.body.prepend(loader);
  return loader;
}

// Page enter — inject loader closed, open after delay
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');
  const loader = createLoader(false);

  setTimeout(() => {
    loader.classList.add('open');
    document.body.classList.remove('loading');
  }, 1200);

  loader.querySelector('.loader-panel--bot').addEventListener('transitionend', () => {
    loader.remove();
  }, { once: true });
});

// Page exit — intercept internal link clicks, close loader then navigate
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('http') ||
    href.startsWith('//') ||
    href.startsWith('mailto') ||
    href.startsWith('tel')
  ) return;

  e.preventDefault();

  document.body.classList.add('loading');
  const loader = createLoader(true); // starts open (transparent)

  // Double rAF ensures the browser has painted the open state before we close
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      loader.classList.remove('open'); // panels slide in to cover
      loader.querySelector('.loader-panel--bot').addEventListener('transitionend', () => {
        window.location.href = href;
      }, { once: true });
    });
  });
});

/* ── NAV SCROLL ──────────────────────────────────────────────────── */

const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}


/* ── FADE-UP ─────────────────────────────────────────────────────── */

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* ── TERMINAL TYPE-IN ────────────────────────────────────────────── */

const termLines = document.querySelectorAll('.terminal .t-line, .terminal .t-gap');
termLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transition = 'opacity 0.2s';
  setTimeout(() => { line.style.opacity = '1'; }, 1400 + i * 180);
});
