(() => {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.burger');

  // Шапка: фон при скролле + прогресс-бар
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    header.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  const toggleMenu = (open) => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  // Появление блоков
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    io.observe(el);
  });

  // Табы прайса
  document.querySelectorAll('[data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n); }
      });
    });
  });

  // Фильтр работ
  const items = [...document.querySelectorAll('.works__item')];
  document.querySelectorAll('.filter__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter__btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      const f = btn.dataset.filter;
      items.forEach((it) => it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f));
    });
  });

  // Лайтбокс
  const lb = document.querySelector('.lightbox');
  const lbImg = lb.querySelector('.lightbox__img');
  let idx = 0;
  const visible = () => items.filter((it) => !it.classList.contains('is-hidden')).map((it) => it.querySelector('img'));
  const show = (i) => {
    const list = visible();
    idx = (i + list.length) % list.length;
    lbImg.src = list[idx].src;
    lbImg.alt = list[idx].alt;
  };
  items.forEach((it) => it.querySelector('button').addEventListener('click', () => {
    show(visible().indexOf(it.querySelector('img')));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }));
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // Фильтр отзывов
  const rcards = [...document.querySelectorAll('.rcard')];
  document.querySelectorAll('.rv-filter__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rv-filter__btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      const f = btn.dataset.rfilter;
      rcards.forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
    });
  });
})();
