/**
 * main.js - Core Navigation, Currency, Clock & Global Utilities
 * Royal Haven Boutique & Spa
 */

const API_BASE_URL = (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api'
  : 'https://hotel-reservation-system-720g.onrender.com/api';

// Database prices are South African rand. ZAR is the base (rate 1).
const CURRENCY_RATES = {
  ZAR: { symbol: 'R', rate: 1.0 },
  USD: { symbol: '$', rate: 1 / 18.2 },
  EUR: { symbol: '€', rate: 0.92 / 18.2 },
  GBP: { symbol: '£', rate: 0.79 / 18.2 }
};

let currentCurrency = localStorage.getItem('grand_reserve_currency') || 'ZAR';

document.addEventListener('DOMContentLoaded', () => {
  initPageLoadBar();
  initStickyHeader();
  initMobileMenu();
  initLiveClock();
  initCurrencySelector();
  initNewsletterForm();
  initNavAuthUI();
  initScrollAnimations();
  initHeroPillsCurrency();

  document.addEventListener('currencyChanged', () => {
    initHeroPillsCurrency();
  });
});

// Subtle Royal Gold Top Page Transition Loading Bar
function initPageLoadBar() {
  let bar = document.getElementById('pageLoadBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'pageLoadBar';
    document.body.prepend(bar);
  }

  // Animate on arrival
  bar.classList.add('loading');
  bar.style.width = '75%';
  setTimeout(() => {
    bar.classList.add('done');
    setTimeout(() => {
      bar.style.width = '0%';
      bar.classList.remove('loading', 'done');
    }, 600);
  }, 200);

  // Hook internal link clicks for smooth transitions
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;

    // Ignore new tabs, anchors, tel/mailto, or external sites
    if (link.target === '_blank' || link.href.includes('#') || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) return;
    if (link.origin !== window.location.origin) return;

    bar.classList.remove('done');
    bar.classList.add('loading');
    bar.style.width = '85%';
  });
}

// Update the featured suite pills on the homepage with current currency
function initHeroPillsCurrency() {
  const pill1 = document.querySelector('a[href*="roomId=9"] span:last-child');
  const pill2 = document.querySelector('a[href*="roomId=13"] span:last-child');
  const pill3 = document.querySelector('a[href*="roomId=15"] span:last-child');

  if (pill1) pill1.textContent = `The Royal Terrace Suite • ${formatCurrency(2200)}`;
  if (pill2) pill2.textContent = `Ocean Horizon Deluxe • ${formatCurrency(3000)}`;
  if (pill3) pill3.textContent = `The Celestial Penthouse • ${formatCurrency(2400)}`;
}

// Staggered scroll reveal observer for cards and content sections
function initScrollAnimations() {
  const elementsToReveal = document.querySelectorAll(
    '.room-card, .perk-card, .experience-card, .footer-main-grid, .confirm-hero-center, .confirmation-card-main, .manage-lookup-box, .auth-card'
  );

  if (!elementsToReveal.length) return;

  // Mark elements for initial hidden state
  elementsToReveal.forEach((el, index) => {
    el.classList.add('reveal-init');
    // Add staggered delay to child cards within grids
    const staggerIndex = (index % 4) + 1;
    el.classList.add(`stagger-${staggerIndex}`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elementsToReveal.forEach(el => observer.observe(el));
}

// Update the navigation CTA group to reflect whether the user is logged in
function initNavAuthUI() {
  if (typeof getUser !== 'function') return;

  const navCtaGroup = document.querySelector('.nav-cta-group');
  if (!navCtaGroup) return;

  const user = getUser();
  const reserveBtn = navCtaGroup.querySelector('.btn-nav-gold');
  const reserveHref = reserveBtn ? reserveBtn.getAttribute('href') : 'rooms.html';

  if (user) {
    // Logged in: show guest name pill + discrete logout + primary Reserve button
    const firstName = (user.name || 'Guest').split(' ')[0];
    navCtaGroup.innerHTML = `
      <a href="account.html" class="nav-user-pill" title="My Account & Stays">
        <i class="fas fa-crown"></i>
        <span>${escapeHtml(firstName)}</span>
      </a>
      <button onclick="logout('index.html')" class="btn-nav-signout" title="Sign Out">
        <i class="fas fa-sign-out-alt"></i>
      </button>
      <a href="${reserveHref}" class="btn-nav-gold">Book a Room</a>
      <button class="mobile-menu-btn" aria-label="Toggle navigation"><i class="fas fa-bars"></i></button>
    `;
  } else {
    // Logged out: show Sign In link + Book a Room button
    navCtaGroup.innerHTML = `
      <a href="login.html" class="nav-auth-link">
        <i class="fas fa-user-circle"></i>
        <span>Sign In</span>
      </a>
      <span class="nav-divider"></span>
      <a href="${reserveHref}" class="btn-nav-gold">Book a Room</a>
      <button class="mobile-menu-btn" aria-label="Toggle navigation"><i class="fas fa-bars"></i></button>
    `;
  }

  // Re-bind mobile toggle button
  initMobileMenu();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Sticky Header blur & elevation
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile navigation drawer
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.site-nav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-open');
    toggleBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });
}

// Live Local Time Display
function initLiveClock() {
  const clockEl = document.getElementById('liveHotelClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  update();
  setInterval(update, 30000);
}

// Currency Selector
function initCurrencySelector() {
  const select = document.getElementById('currencySelector');
  if (!select) return;

  select.value = currentCurrency;
  select.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem('grand_reserve_currency', currentCurrency);
    document.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: currentCurrency } }));
    showToast(`Currency updated to ${currentCurrency}`);
  });
}

// Currency formatting helper (amount is ZAR)
function formatCurrency(amountZar) {
  const cur = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.ZAR;
  const converted = Number(amountZar) * cur.rate;
  return `${cur.symbol}${Math.round(converted).toLocaleString()}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'Not selected';
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Toast notification helper
function showToast(message, type = 'gold') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'urgent' ? 'fa-exclamation-circle' : 'fa-check-circle';
  toast.innerHTML = `<i class="fas ${icon}" style="color: var(--gold-bright);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Newsletter subscription
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast('Thank you for subscribing to Private Privilege updates.');
      input.value = '';
    }
  });
}

