const $ = (s) => document.querySelector(s);

function initSlider() {
  const container = $('#hero-slides');
  const slides = JSON.parse(container.dataset.slides || '[]');
  if (slides.length === 0) return;

  let current = 0, timer, touchStart = 0;
  const dots = [...document.querySelectorAll('.slide-dots button')];

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    document.querySelectorAll('.hero-slide').forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    const item = slides[current];
    $('#hero-title').textContent = item.title;
    $('#hero-description').textContent = item.description;
    const cta = $('#hero-cta');
    cta.href = item.cta_link || '#decouvrir';
    cta.childNodes[0].nodeValue = `${item.cta_label || 'Découvrir Divine Todo'} `;
  };

  const restart = () => { clearInterval(timer); timer = setInterval(() => show(current + 1), 6500); };

  $('#next-slide').onclick = () => { show(current + 1); restart(); };
  $('#previous-slide').onclick = () => { show(current - 1); restart(); };
  dots.forEach((dot, i) => dot.onclick = () => { show(i); restart(); });

  $('.hero').addEventListener('touchstart', e => touchStart = e.changedTouches[0].screenX, { passive: true });
  $('.hero').addEventListener('touchend', e => {
    const delta = e.changedTouches[0].screenX - touchStart;
    if (Math.abs(delta) > 45) { show(current + (delta < 0 ? 1 : -1)); restart(); }
  }, { passive: true });

  restart();
}

function initInterface() {
  const header = $('#header'), menu = $('.menu-toggle'), panel = $('#nav-links');

  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 24), { passive: true });

  menu.onclick = () => {
    const open = panel.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
  };
  panel.querySelectorAll('a').forEach(a => a.onclick = () => panel.classList.remove('open'));

  $('.theme-toggle').onclick = () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? '' : 'dark';
  };

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const navLinks = [...panel.querySelectorAll('a')];
  const spy = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }),
    { rootMargin: '-40% 0px -55% 0px' }
  );
  document.querySelectorAll('main section[id]').forEach(section => spy.observe(section));
}

initSlider();
initInterface();