/**
 * main.js - Core Navigation, Currency, Clock & Global Utilities
 * The Grand Reserve Boutique & Spa
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
  initStickyHeader();
  initMobileMenu();
  initLiveClock();
  initCurrencySelector();
  initNewsletterForm();
});

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

