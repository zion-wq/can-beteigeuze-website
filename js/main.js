/* ============================================================
   Can Beteigeuze — Main JS
   ============================================================ */

/* --- GA4 helper ------------------------------------------- */
function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, params || {});
  }
}

/* --- Sticky nav ------------------------------------------- */
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile menu ------------------------------------------ */
const menuBtn    = document.querySelector('.nav__menu-btn');
const mobileMenu = document.querySelector('.nav__mobile');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    menuBtn.setAttribute('aria-expanded', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Reveal on scroll ------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --- GA4: scroll events ----------------------------------- */
let reviewsTracked  = false;
let tariefenTracked = false;

const scrollTracker = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id || entry.target.dataset.track;
    if (id === 'reviews' && !reviewsTracked) {
      reviewsTracked = true;
      trackEvent('scroll_reviews');
    }
    if ((id === 'tarieven' || id === 'prices-preview') && !tariefenTracked) {
      tariefenTracked = true;
      trackEvent('scroll_tarieven');
    }
    scrollTracker.unobserve(entry.target);
  });
}, { threshold: 0.3 });

['reviews', 'tarieven', 'prices-preview'].forEach(id => {
  const el = document.getElementById(id) || document.querySelector(`[data-track="${id}"]`);
  if (el) scrollTracker.observe(el);
});

/* --- CTA click tracking ----------------------------------- */
document.querySelectorAll('[data-ga]').forEach(el => {
  el.addEventListener('click', () => trackEvent(el.dataset.ga));
});

/* --- GA4: formulier tracking ----------------------------- */
const firstFields = document.querySelectorAll('form [name]:not([type="hidden"])');
let formStarted = false;
firstFields.forEach(field => {
  field.addEventListener('focus', () => {
    if (!formStarted) {
      formStarted = true;
      trackEvent('formulier_gestart');
    }
  }, { once: true });
});

document.querySelectorAll('form[data-netlify]').forEach(form => {
  form.addEventListener('submit', () => trackEvent('formulier_verzonden'));
});

/* --- GA4: tel / email / whatsapp -------------------------- */
document.querySelectorAll('a[href^="tel:"]').forEach(el => {
  el.addEventListener('click', () => trackEvent('telefoon_klik'));
});
document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
  el.addEventListener('click', () => trackEvent('email_klik'));
});
document.querySelectorAll('.whatsapp-btn, [data-ga="whatsapp_klik"]').forEach(el => {
  el.addEventListener('click', () => trackEvent('whatsapp_klik'));
});

/* --- Lightbox -------------------------------------------- */
const lightbox    = document.getElementById('lightbox');
const lbImg       = lightbox?.querySelector('.lightbox__img');
const lbCaption   = lightbox?.querySelector('.lightbox__caption');
const lbClose     = lightbox?.querySelector('.lightbox__close');
const lbPrev      = lightbox?.querySelector('.lightbox__nav--prev');
const lbNext      = lightbox?.querySelector('.lightbox__nav--next');
let   lbItems     = [];
let   lbIndex     = 0;

function openLightbox(index) {
  lbIndex = index;
  const item = lbItems[index];
  if (!item || !lbImg) return;
  lbImg.src = item.src;
  lbImg.alt = item.alt || '';
  if (lbCaption) lbCaption.textContent = item.caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}
function lbGo(dir) {
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
  openLightbox(lbIndex);
}

if (lightbox) {
  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => lbGo(-1));
  lbNext?.addEventListener('click', () => lbGo(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });
}

function initGallery() {
  const gallery    = document.querySelector('.gallery-grid');
  const tabs       = document.querySelectorAll('.gallery-tab');
  if (!gallery) return;

  lbItems = [];
  const allItems = gallery.querySelectorAll('.gallery-item');
  allItems.forEach((item, i) => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-item__caption');
    lbItems.push({
      src:     img?.dataset.src || img?.src || '',
      alt:     img?.alt || '',
      caption: cap?.textContent || '',
    });
    item.addEventListener('click', () => openLightbox(i));
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      allItems.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
      // Rebuild lightbox items for visible only
      lbItems = [];
      let idx = 0;
      allItems.forEach(item => {
        if (item.style.display === 'none') return;
        const img = item.querySelector('img');
        const cap = item.querySelector('.gallery-item__caption');
        const finalIdx = idx++;
        lbItems.push({ src: img?.dataset.src || img?.src || '', alt: img?.alt || '', caption: cap?.textContent || '' });
        item.onclick = () => openLightbox(finalIdx);
      });
    });
  });
}
initGallery();

/* --- FAQ accordion --------------------------------------- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer  = btn.nextElementSibling;
    const isOpen  = btn.classList.contains('open');

    // Close all in same category
    const cat = btn.closest('.faq-category');
    cat?.querySelectorAll('.faq-question.open').forEach(openBtn => {
      openBtn.classList.remove('open');
      openBtn.nextElementSibling?.classList.remove('open');
    });

    if (!isOpen) {
      btn.classList.add('open');
      answer?.classList.add('open');
    }
  });
});

/* --- Calendar interaction tracking ----------------------- */
document.querySelectorAll('.calendar-section iframe, .calendar-section [data-calendar]').forEach(el => {
  el.addEventListener('click', () => trackEvent('kalender_interactie'), { once: true });
  el.addEventListener('touchstart', () => trackEvent('kalender_interactie'), { once: true });
});

/* --- Cookie banner --------------------------------------- */
const cookieBanner = document.querySelector('.cookie-banner');
if (cookieBanner && !localStorage.getItem('cookie-accepted')) {
  cookieBanner.classList.add('show');
}
document.querySelector('.cookie-accept')?.addEventListener('click', () => {
  localStorage.setItem('cookie-accepted', '1');
  cookieBanner?.classList.remove('show');
  // Enable GA4 after consent
  if (typeof gtag === 'function') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
});
document.querySelector('.cookie-decline')?.addEventListener('click', () => {
  localStorage.setItem('cookie-accepted', '0');
  cookieBanner?.classList.remove('show');
});

/* --- Lazy load images ------------------------------------ */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      obs.unobserve(img);
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}
