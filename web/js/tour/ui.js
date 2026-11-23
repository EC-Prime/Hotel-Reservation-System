import {
  ROOM_LAYOUT, ROOM_BY_NUMBER, ROOM_TYPE_LABELS, ROOM_TYPE_DETAILS,
  SERVICE_DATA, SERVICE_BY_ID, LEVELS, WALK_ZONES, PALETTES
} from './data.js';

const CURRENCY_RATES = {
  ZAR: { symbol: 'R', rate: 1 },
  USD: { symbol: '$', rate: 1 / 18.2 },
  EUR: { symbol: '€', rate: 0.92 / 18.2 },
  GBP: { symbol: '£', rate: 0.79 / 18.2 }
};

const PLACE_ICONS = {
  pool: 'M2 15c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2 2.4 2 4.8 2M2 19c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2 2.4 2 4.8 2M7 11V5a2 2 0 0 1 4 0M13 11V5a2 2 0 0 1 4 0M17 11V5',
  spa: 'M12 21c0-5 3-8 8-8-1 5-4 8-8 8Zm0 0c0-5-3-8-8-8 1 5 4 8 8 8Zm0 0c0-4 1.5-7 4-9M12 21c0-4-1.5-7-4-9M12 3c1.6 1.8 2.4 3.6 2.4 5.4 0 1.8-.8 3.6-2.4 5.4-1.6-1.8-2.4-3.6-2.4-5.4C9.6 6.6 10.4 4.8 12 3Z',
  restaurant: 'M5 3v8a2 2 0 0 0 4 0V3M7 11v10M15 3c-1.5 1.6-2 3.6-2 6 0 2 .8 3 2 3v9M15 3v9',
  bar: 'M4 4h16l-7 8v6l3 2H8l3-2v-6L4 4Z',
  lounge: 'M5 20V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11M3 20h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  reception: 'M4 20h16M6 20v-6a6 6 0 0 1 12 0v6M12 4v3M9 20v-4h6v4',
  fitness: 'M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10',
  sunset: 'M12 3v3M5 8l2 2M19 8l-2 2M2 18h20M4 14a8 8 0 0 1 16 0M9 21h6',
  lift: 'M5 3h14v18H5zM12 3v18M8.5 9l1.5-2 1.5 2M14 11l1 2 1-2',
  stairs: 'M4 20h4v-4h4v-4h4V8h4'
};

export class TourUI {
  constructor(app) {
    this.app = app;
    this.controls = null;
    this.currentCurrency = localStorage.getItem('grand_reserve_currency') || 'ZAR';
    if (!CURRENCY_RATES[this.currentCurrency]) this.currentCurrency = 'ZAR';
    this.rooms = window.ROOMS_DATA || [];
    this.roomInfo = {};
    for (const r of this.rooms) this.roomInfo[r.roomNumber] = r;
    this.floor = 1;
    this.highlight = null;
    this.toastTimer = null;
    this.mapTimer = 0;
    this.openPanel = null;

    this.el = {
      panel: document.getElementById('tour-panel'),
      panelBody: document.getElementById('tour-panel-body'),
      panelClose: document.getElementById('tour-panel-close'),
      welcome: document.getElementById('tour-welcome'),
      rooms: document.getElementById('tour-rooms'),
      roomsList: document.getElementById('tour-rooms-list'),
      places: document.getElementById('tour-places'),
      placesList: document.getElementById('tour-places-list'),
      lift: document.getElementById('tour-lift'),
      liftList: document.getElementById('tour-lift-list'),
      toast: document.getElementById('tour-toast'),
      tooltip: document.getElementById('tour-tooltip'),
      hint: document.getElementById('tour-hint'),
      floorLabel: document.getElementById('tour-floor-label'),
      modeLabel: document.getElementById('tour-mode-label'),
      minimap: document.getElementById('tour-minimap'),
      mapCanvas: document.getElementById('tour-map-canvas'),
      joystick: document.getElementById('tour-joystick'),
      joystickKnob: document.getElementById('tour-joystick-knob'),
      fade: document.getElementById('tour-fade'),
      currency: document.getElementById('tour-currency'),
      levelButtons: Array.from(document.querySelectorAll('[data-floor]')),
      overviewButtons: Array.from(document.querySelectorAll('[data-action="overview"]')),
      roomsButtons: Array.from(document.querySelectorAll('[data-action="rooms"]')),
      placesButtons: Array.from(document.querySelectorAll('[data-action="places"]')),
      liftButtons: Array.from(document.querySelectorAll('[data-action="lift"]')),
      stairsButtons: Array.from(document.querySelectorAll('[data-action="stairs"]')),
      helpButtons: Array.from(document.querySelectorAll('[data-action="help"]')),
      resetButtons: Array.from(document.querySelectorAll('[data-action="reset"]')),
      bookButtons: Array.from(document.querySelectorAll('[data-action="book"]')),
      startButtons: Array.from(document.querySelectorAll('[data-action="start"]')),
      aerialButtons: Array.from(document.querySelectorAll('[data-action="aerial"]'))
    };

    this.bindStatic();
    this.buildRooms();
    this.buildPlaces();
    this.buildLift();
    this.setFloor(1);
    this.drawMap();
    this.buildFooterYear();
    this.updateCurrencyOptions();

    if (this.el.welcome) {
      this.el.welcome.hidden = false;
      document.body.classList.add('tour-intro');
    }
  }

  setControls(controls) {
    this.controls = controls;
  }

  /* ------------------------------------------------------------------ */
  /* Static UI wiring                                                   */
  /* ------------------------------------------------------------------ */
  bindStatic() {
    this.el.panelClose?.addEventListener('click', () => this.closePanels());
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closePanels());
    });

    for (const btn of this.el.levelButtons) {
      btn.addEventListener('click', () => this.controls?.setFloor(Number(btn.dataset.floor)));
    }
    for (const btn of this.el.overviewButtons) {
      btn.addEventListener('click', () => this.controls?.toggleOverview());
    }
    for (const btn of this.el.roomsButtons) {
      btn.addEventListener('click', () => this.openRooms());
    }
    for (const btn of this.el.placesButtons) {
      btn.addEventListener('click', () => this.openPlaces());
    }
    document.querySelectorAll('[data-quick]').forEach(btn => {
      btn.addEventListener('click', () => this.openService(btn.dataset.quick));
    });
    for (const btn of this.el.liftButtons) {
      btn.addEventListener('click', () => this.openLift());
    }
    for (const btn of this.el.stairsButtons) {
      btn.addEventListener('click', () => this.controls?.useStairs());
    }
    for (const btn of this.el.helpButtons) {
      btn.addEventListener('click', () => this.showHelp());
    }
    for (const btn of this.el.resetButtons) {
      btn.addEventListener('click', () => {
        this.controls?.resetView();
        this.toast('Back at the lobby entrance');
      });
    }
    for (const btn of this.el.bookButtons) {
      btn.addEventListener('click', () => { window.location.href = 'booking.html'; });
    }
    for (const btn of this.el.startButtons) {
      btn.addEventListener('click', () => this.startTour(false));
    }
    for (const btn of this.el.aerialButtons) {
      btn.addEventListener('click', () => this.startTour(true));
    }

    if (this.el.currency) {
      this.el.currency.value = this.currentCurrency;
      this.el.currency.addEventListener('change', (e) => {
        this.currentCurrency = e.target.value;
        localStorage.setItem('grand_reserve_currency', this.currentCurrency);
        if (this.openPanel) this.refreshOpenPanel();
        if (this.openPanel?.kind === 'rooms') this.buildRooms();
        this.toast(`Rates shown in ${this.currentCurrency}`);
      });
    }

    // Mobile joystick
    const stick = this.el.joystick;
    if (stick) {
      let active = false;
      let id = null;
      const radius = 44;
      const move = (e) => {
        if (!active) return;
        const r = stick.getBoundingClientRect();
        let dx = e.clientX - (r.left + r.width / 2);
        let dy = e.clientY - (r.top + r.height / 2);
        const len = Math.hypot(dx, dy);
        if (len > radius) { dx = (dx / len) * radius; dy = (dy / len) * radius; }
        this.el.joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
        this.controls?.setJoystick(dx / radius, -dy / radius);
      };
      const end = (e) => {
        active = false;
        id = null;
        this.el.joystickKnob.style.transform = 'translate(0px, 0px)';
        this.controls?.setJoystick(0, 0);
        try { stick.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
      };
      stick.addEventListener('pointerdown', (e) => {
        active = true; id = e.pointerId;
        stick.setPointerCapture(e.pointerId);
        move(e);
      });
      stick.addEventListener('pointermove', move);
      stick.addEventListener('pointerup', end);
      stick.addEventListener('pointercancel', end);
    }

    // Hints disappear once the guest starts moving
    const dismissHint = () => {
      this.el.hint?.classList.add('is-hidden');
      window.removeEventListener('keydown', dismissHint);
      this.el.joystick?.removeEventListener('pointerdown', dismissHint);
    };
    window.addEventListener('keydown', dismissHint, { once: true });
    this.el.joystick?.addEventListener('pointerdown', dismissHint, { once: true });
    setTimeout(() => this.el.hint?.classList.add('is-faded'), 12000);

    window.addEventListener('resize', () => this.drawMap());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closePanels();
    });
  }

  buildFooterYear() {
    const y = document.getElementById('tour-year');
    if (y) y.textContent = new Date().getFullYear();
  }

  updateCurrencyOptions() {
    if (!this.el.currency) return;
    this.el.currency.value = this.currentCurrency;
  }

  formatPrice(zar) {
    const cur = CURRENCY_RATES[this.currentCurrency] || CURRENCY_RATES.ZAR;
    const converted = Number(zar) * cur.rate;
    return `${cur.symbol}${Math.round(converted).toLocaleString()}`;
  }

  startTour(aerial) {
    if (this.el.welcome) {
      this.el.welcome.classList.add('is-leaving');
      setTimeout(() => { this.el.welcome.hidden = true; this.el.welcome.classList.remove('is-leaving'); }, 700);
    }
    document.body.classList.remove('tour-intro');
    if (aerial) {
      this.controls?.toggleOverview(true);
    } else {
      this.controls?.resetView();
      this.toast('Welcome to Royal Haven — drag to look around');
    }
    this.el.joystick?.classList.remove('is-hidden');
  }

  /* ------------------------------------------------------------------ */
  /* Panels                                                             */
  /* ------------------------------------------------------------------ */
  showPanel(kind) {
    this.openPanel = kind;
    this.el.panel?.classList.add('is-open');
    document.body.classList.add('tour-panel-open');
    this.el.rooms?.classList.remove('is-open');
    this.el.places?.classList.remove('is-open');
    this.el.lift?.classList.remove('is-open');
  }

  hidePanel() {
    this.openPanel = null;
    this.el.panel?.classList.remove('is-open');
    document.body.classList.remove('tour-panel-open');
  }

  closePanels() {
    this.hidePanel();
    this.el.rooms?.classList.remove('is-open');
    this.el.places?.classList.remove('is-open');
    this.el.lift?.classList.remove('is-open');
    this.el.panelClose?.blur();
    this.highlight = null;
    this.drawMap();
  }

  refreshOpenPanel() {
    if (!this.openPanel) return;
    const kind = this.openPanel;
    if (kind.kind === 'room') this.openRoom(kind.id, true);
    else if (kind.kind === 'service') this.openService(kind.id, true);
    else if (kind.kind === 'place') this.openPlaces();
    else if (kind.kind === 'help') this.showHelp();
  }

  openRoom(number, silent = false) {
    const room = ROOM_BY_NUMBER[number];
    if (!room) return;
    const info = this.roomInfo[number] || {};
    const details = ROOM_TYPE_DETAILS[room.type];
    const pal = PALETTES[room.palette];
    const price = info.pricePerNight || 1200;
    const capacity = info.capacity || details.capacity;
    const view = room.view || info.view || 'Garden view';
    const image = info.image || 'images/photo-1590490360182-c33d57733427.jpg';
    const amenities = (info.amenities || ['Rain shower', 'Smart TV', 'Nespresso bar', 'Wi-Fi 6', '24/7 room service']).slice(0, 6);
    const booking = `booking.html?roomId=${info.roomId ?? number}&guests=${capacity}`;

    this.el.panelBody.innerHTML = `
      <div class="panel-media">
        <img src="${image}" alt="${escapeHtml(info.title || `Suite ${number}`)}" loading="lazy">
        <div class="panel-media-top">
          <span class="panel-chip">Level ${room.floor}</span>
          <span class="panel-chip panel-chip--gold">${escapeHtml(ROOM_TYPE_LABELS[room.type] || room.type)}</span>
        </div>
        <p class="panel-caption">Suite ${number} · ${escapeHtml(pal.name)} palette</p>
      </div>
      <div class="panel-content">
        <p class="panel-eyebrow">Level ${room.floor} · ${escapeHtml(room.wing === 'garden' ? 'Garden Wing' : 'Ocean Wing')}</p>
        <h2 class="panel-title">${escapeHtml(info.title || `Suite ${number}`)}</h2>
        <p class="panel-desc">${escapeHtml(info.description || 'A calm, considered room with warm materials, a generous bed and a quiet place to sit by the window.')}</p>

        <div class="panel-price">
          <span class="panel-price-amount">${this.formatPrice(price)}</span>
          <span class="panel-price-unit">per night · ${escapeHtml(this.currentCurrency)}</span>
        </div>

        <dl class="panel-facts">
          <div><dt>Sleeps</dt><dd>${capacity} ${capacity === 1 ? 'guest' : 'guests'}</dd></div>
          <div><dt>Size</dt><dd>${info.sizeSqm || Math.round((room.x1 - room.x0) * (room.z1 - room.z0))} m²</dd></div>
          <div><dt>Bed</dt><dd>${escapeHtml(info.bedType || details.bed)}</dd></div>
          <div><dt>View</dt><dd>${escapeHtml(view)}</dd></div>
        </dl>

        <h3 class="panel-sub">In the room</h3>
        <ul class="panel-amenities">
          ${amenities.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
          <li>${escapeHtml(details.extra)}</li>
        </ul>

        <div class="panel-actions">
          <a class="btn btn--gold" href="${booking}">Reserve suite ${number}</a>
          <button class="btn btn--ghost" data-room-enter="${number}">Step inside</button>
        </div>
        <p class="panel-note">Conceptual 3D interpretation · photography and room details are illustrative.</p>
      </div>`;

    this.el.panelBody.querySelector('[data-room-enter]')?.addEventListener('click', () => {
      this.controls?.focusRoom(number);
      this.closePanels();
    });
    this.showPanel({ kind: 'room', id: number });
    this.el.panelBody.scrollTop = 0;
    this.highlight = number;
    this.drawMap();
    if (!silent) this.controls?.focusRoom(number, { silent: true });
  }

  openService(id, silent = false) {
    const service = SERVICE_BY_ID[id];
    if (!service) return;
    if (service.kind === 'lift') { this.openLift(); return; }
    if (service.kind === 'stairs') {
      this.closePanels();
      this.controls?.useStairs();
      return;
    }
    const gallery = (service.gallery && service.gallery.length ? service.gallery : [service.image]).filter(Boolean);
    const amenities = service.amenities || [];
    const cta = service.cta && service.link
      ? `<a class="btn btn--gold" href="${service.link}">${escapeHtml(service.cta)}</a>`
      : '<a class="btn btn--gold" href="booking.html">Plan your stay</a>';

    this.el.panelBody.innerHTML = `
      <div class="panel-media">
        <img id="tour-service-image" src="${service.image}" alt="${escapeHtml(service.title)}" loading="lazy">
        <div class="panel-media-top">
          <span class="panel-chip">Level ${service.floor}</span>
          <span class="panel-chip panel-chip--gold">${escapeHtml(service.hours.split('·')[0].trim())}</span>
        </div>
        ${gallery.length > 1 ? `<div class="panel-thumbs">
          ${gallery.map((src, i) => `<button class="panel-thumb${i === 0 ? ' is-active' : ''}" data-service-img="${src}" aria-label="View image ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}
        </div>` : ''}
      </div>
      <div class="panel-content">
        <p class="panel-eyebrow">${escapeHtml(service.eyebrow)}</p>
        <h2 class="panel-title">${escapeHtml(service.title)}</h2>
        <p class="panel-desc">${escapeHtml(service.description)}</p>
        <dl class="panel-facts">
          <div><dt>Hours</dt><dd>${escapeHtml(service.hours)}</dd></div>
          <div><dt>Details</dt><dd>${escapeHtml(service.capacity)}</dd></div>
        </dl>
        <h3 class="panel-sub">Highlights</h3>
        <ul class="panel-amenities">
          ${amenities.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
        </ul>
        <div class="panel-actions">
          ${cta}
          <button class="btn btn--ghost" data-service-walk="${id}">Walk there</button>
        </div>
        <p class="panel-note">A conceptual space, styled after the published experience photography.</p>
      </div>`;

    this.el.panelBody.querySelectorAll('[data-service-img]').forEach(btn => {
      btn.addEventListener('click', () => {
        const img = this.el.panelBody.querySelector('#tour-service-image');
        if (img) img.src = btn.dataset.serviceImg;
        this.el.panelBody.querySelectorAll('.panel-thumb').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
    this.el.panelBody.querySelector('[data-service-walk]')?.addEventListener('click', () => {
      this.controls?.focusService(id);
      this.closePanels();
    });
    this.showPanel({ kind: 'service', id });
    this.el.panelBody.scrollTop = 0;
    if (!silent) this.controls?.focusService(id, { silent: true });
  }

  openPlaces() {
    const groups = [
      ['Ground floor', SERVICE_DATA.filter(s => s.floor === 1)],
      ['Level 2', SERVICE_DATA.filter(s => s.floor === 2)],
      ['Level 3', SERVICE_DATA.filter(s => s.floor === 3)]
    ];
    this.el.placesList.innerHTML = groups.map(([label, items]) => `
      <section class="drawer-group">
        <h3 class="drawer-heading">${label}</h3>
        <div class="place-grid">
          ${items.map(s => `
            <button class="place-card" data-place="${s.id}">
              <img src="${s.image}" alt="" loading="lazy">
              <span class="place-card-body">
                <span class="place-card-title">${escapeHtml(s.title)}</span>
                <span class="place-card-meta">${escapeHtml(s.hours)}</span>
              </span>
            </button>`).join('')}
        </div>
      </section>`).join('');
    this.el.placesList.querySelectorAll('[data-place]').forEach(btn => {
      btn.addEventListener('click', () => this.openService(btn.dataset.place));
    });
    this.hidePanel();
    this.el.rooms?.classList.remove('is-open');
    this.el.lift?.classList.remove('is-open');
    this.el.places?.classList.add('is-open');
    this.openPanel = { kind: 'places' };
    document.body.classList.add('tour-panel-open');
  }

  showHelp() {
    this.el.panelBody.innerHTML = `
      <div class="panel-content panel-content--plain">
        <p class="panel-eyebrow">A short guide</p>
        <h2 class="panel-title">Finding your way</h2>
        <div class="help-grid">
          <div><span class="help-key">Drag</span><p>Look around. On a phone, drag anywhere on the view.</p></div>
          <div><span class="help-key">W A S D</span><p>Walk. Arrow keys work too. Hold Shift to move faster.</p></div>
          <div><span class="help-key">Scroll</span><p>Narrow or widen the view.</p></div>
          <div><span class="help-key">1 2 3</span><p>Jump between levels. The lift button does the same.</p></div>
          <div><span class="help-key">Click</span><p>Select a room door, suite number, or a brass service marker.</p></div>
          <div><span class="help-key">V</span><p>Step back for the aerial view. Drag to orbit, scroll to zoom.</p></div>
        </div>
        <p class="panel-desc" style="margin-top:18px">This is a conceptual walkthrough built from the hotel’s published room list and photography. Everything you see is illustrative, not a survey of the real property.</p>
        <div class="panel-actions">
          <button class="btn btn--gold" data-action="help-start">Begin in the lobby</button>
          <button class="btn btn--ghost" data-action="help-aerial">Aerial view</button>
        </div>
      </div>`;
    this.el.panelBody.querySelector('[data-action="help-start"]')?.addEventListener('click', () => {
      this.closePanels();
      this.controls?.resetView();
    });
    this.el.panelBody.querySelector('[data-action="help-aerial"]')?.addEventListener('click', () => {
      this.closePanels();
      this.controls?.toggleOverview(true);
    });
    this.showPanel({ kind: 'help' });
  }

  openRooms() {
    this.hidePanel();
    this.el.rooms.classList.add('is-open');
    this.el.places?.classList.remove('is-open');
    this.el.lift?.classList.remove('is-open');
    this.openPanel = { kind: 'rooms' };
    document.body.classList.add('tour-panel-open');
  }

  openLift() {
    this.hidePanel();
    this.el.rooms?.classList.remove('is-open');
    this.el.places?.classList.remove('is-open');
    this.el.lift.classList.add('is-open');
    this.openPanel = { kind: 'lift' };
    document.body.classList.add('tour-panel-open');
  }

  /* ------------------------------------------------------------------ */
  /* Drawers                                                            */
  /* ------------------------------------------------------------------ */
  buildRooms() {
    const byFloor = { 1: [], 2: [], 3: [] };
    for (const r of ROOM_LAYOUT) byFloor[r.floor].push(r);
    this.el.roomsList.innerHTML = [1, 2, 3].map(f => `
      <section class="drawer-group">
        <h3 class="drawer-heading">
          <span>Level ${f}</span>
          <em>${LEVELS[f - 1].name} · ${byFloor[f].length} rooms</em>
        </h3>
        <div class="room-grid">
          ${byFloor[f].map(r => {
            const info = this.roomInfo[r.number] || {};
            return `<button class="room-card" data-room="${r.number}">
              <span class="room-card-thumb"><img src="${info.image || 'images/photo-1590490360182-c33d57733427.jpg'}" alt="" loading="lazy"></span>
              <span class="room-card-body">
                <span class="room-card-number">${r.number}</span>
                <span class="room-card-title">${escapeHtml(info.title || ROOM_TYPE_LABELS[r.type])}</span>
                <span class="room-card-meta">${escapeHtml(r.view)} · ${ROOM_TYPE_DETAILS[r.type].capacity} ${ROOM_TYPE_DETAILS[r.type].capacity === 1 ? 'guest' : 'guests'} · from ${this.formatPrice(info.pricePerNight || 1200)}</span>
              </span>
            </button>`;
          }).join('')}
        </div>
      </section>`).join('');

    this.el.roomsList.querySelectorAll('[data-room]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.rooms.classList.remove('is-open');
        this.openRoom(btn.dataset.room);
      });
    });
  }

  rebuildRoomPrices() {
    // Prices inside the drawer change with currency
    this.buildRooms();
  }

  buildPlaces() {
    if (this.el.placesList) this.el.placesList.innerHTML = '';
  }

  buildLift() {
    this.el.liftList.innerHTML = [1, 2, 3].map(f => `
      <button class="lift-card" data-lift-floor="${f}">
        <span class="lift-number">0${f}</span>
        <span class="lift-body">
          <strong>${LEVELS[f - 1].name}</strong>
          <em>${f === 1 ? 'Lobby, dining, pool & spa' : f === 2 ? 'Guest rooms 201–206 · gallery' : 'Guest rooms 301–308 · Sunset Deck'}</em>
        </span>
        <span class="lift-go" aria-hidden="true">→</span>
      </button>`).join('');
    this.el.liftList.querySelectorAll('[data-lift-floor]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.controls?.setFloor(Number(btn.dataset.liftFloor));
        this.closePanels();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Small feedback                                                     */
  /* ------------------------------------------------------------------ */
  setFloor(n) {
    this.floor = n;
    const label = this.el.floorLabel;
    if (label) label.textContent = `Level ${n} · ${LEVELS[n - 1].name}`;
    for (const btn of this.el.levelButtons) {
      btn.classList.toggle('is-active', Number(btn.dataset.floor) === n);
      btn.setAttribute('aria-pressed', String(Number(btn.dataset.floor) === n));
    }
    this.drawMap();
  }

  setMode(mode) {
    const label = this.el.modeLabel;
    if (label) label.textContent = mode === 'overview' ? 'Aerial view' : 'On foot';
    for (const btn of this.el.overviewButtons) {
      btn.classList.toggle('is-active', mode === 'overview');
      btn.setAttribute('aria-pressed', String(mode === 'overview'));
    }
    document.body.classList.toggle('is-overview', mode === 'overview');
  }

  toast(text) {
    if (!this.el.toast) return;
    this.el.toast.textContent = text;
    this.el.toast.classList.add('is-visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.el.toast.classList.remove('is-visible'), 2800);
  }

  flash() {
    if (!this.el.fade) return;
    this.el.fade.classList.remove('is-flashing');
    void this.el.fade.offsetWidth;
    this.el.fade.classList.add('is-flashing');
  }

  highlightRoom(number) {
    this.highlight = number;
    this.drawMap();
  }

  hover(hotspot, mouse) {
    const tip = this.el.tooltip;
    if (!tip) return;
    if (!hotspot) {
      tip.classList.remove('is-visible');
      return;
    }
    let text = '';
    if (hotspot.kind === 'room') {
      const room = ROOM_BY_NUMBER[hotspot.id];
      const info = this.roomInfo[hotspot.id] || {};
      text = `Suite ${hotspot.id} · ${info.title || ROOM_TYPE_LABELS[room?.type] || 'Guest room'} · ${this.formatPrice(info.pricePerNight || 1200)}`;
    } else if (hotspot.kind === 'lift') {
      text = 'The glass lift · choose a level';
    } else if (hotspot.kind === 'service') {
      const s = SERVICE_BY_ID[hotspot.id];
      text = s ? `${s.title} · ${s.hours}` : '';
    }
    if (!text) { tip.classList.remove('is-visible'); return; }
    tip.textContent = text;
    const x = mouse?.x ?? window.innerWidth / 2;
    const y = mouse?.y ?? window.innerHeight / 2;
    tip.style.transform = `translate(${Math.min(x + 16, window.innerWidth - 260)}px, ${y + 18}px)`;
    tip.classList.add('is-visible');
  }

  /* ------------------------------------------------------------------ */
  /* Minimap                                                            */
  /* ------------------------------------------------------------------ */
  drawMap() {
    const canvas = this.el.mapCanvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.round(rect.width || 188));
    const H = Math.max(1, Math.round(rect.height || 150));
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const bounds = this.floor === 1
      ? { x0: -34, x1: 32, z0: -23, z1: 23 }
      : { x0: -32, x1: 32, z0: -19, z1: 7.5 };
    const pad = 9;
    const scale = Math.min((W - pad * 2) / (bounds.x1 - bounds.x0), (H - pad * 2) / (bounds.z1 - bounds.z0));
    const ox = pad + ((W - pad * 2) - (bounds.x1 - bounds.x0) * scale) / 2;
    const oy = pad + ((H - pad * 2) - (bounds.z1 - bounds.z0) * scale) / 2;
    const mx = (x) => ox + (x - bounds.x0) * scale;
    const my = (z) => oy + (z - bounds.z0) * scale;

    // zones
    const zones = WALK_ZONES.filter(z => z.floor === this.floor);
    for (const z of zones) {
      ctx.fillStyle = z.room ? 'rgba(216,203,180,0.38)' : 'rgba(197,168,105,0.16)';
      ctx.fillRect(mx(z.x0), my(z.z0), (z.x1 - z.x0) * scale, (z.z1 - z.z0) * scale);
    }
    // room outlines
    for (const r of ROOM_LAYOUT.filter(r => r.floor === this.floor)) {
      const active = r.number === this.highlight;
      ctx.fillStyle = active ? 'rgba(231,207,151,0.55)' : 'rgba(242,232,208,0.24)';
      ctx.strokeStyle = active ? '#ecd9a7' : 'rgba(235,216,173,0.55)';
      ctx.lineWidth = active ? 1.6 : 0.8;
      ctx.fillRect(mx(r.x0), my(r.z0), (r.x1 - r.x0) * scale, (r.z1 - r.z0) * scale);
      ctx.strokeRect(mx(r.x0), my(r.z0), (r.x1 - r.x0) * scale, (r.z1 - r.z0) * scale);
      if (scale > 2.5 && (r.number === this.highlight || r.number % 2 === 0)) {
        ctx.fillStyle = active ? '#10161d' : 'rgba(236,226,203,.8)';
        ctx.font = `${active ? 600 : 500} ${Math.max(7, Math.min(9, scale * 1.8))}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(r.number, mx((r.x0 + r.x1) / 2), my((r.z0 + r.z1) / 2) + 3);
      }
    }
    // sea hint
    if (this.floor === 1) {
      ctx.fillStyle = 'rgba(96,158,163,0.22)';
      ctx.fillRect(mx(-34), my(22), (32 + 34) * scale, (23 - 22) * scale);
    }
    // player
    if (this.controls && this.controls.mode === 'walk' && this.controls.floor === this.floor) {
      const p = this.controls.pos;
      const px = mx(p.x), py = my(p.z);
      const dir = this.controls.yaw;
      const fx = Math.sin(dir), fz = Math.cos(dir);
      ctx.fillStyle = '#f3e4bd';
      ctx.beginPath();
      ctx.moveTo(px + fx * 6.5, py + fz * 6.5);
      ctx.lineTo(px - fx * 4 - fz * 4, py - fz * 4 + fx * 4);
      ctx.lineTo(px - fx * 4 + fz * 4, py - fz * 4 - fx * 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(12,18,25,.75)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(231,207,151,.35)';
      ctx.stroke();
    }
    // north
    ctx.fillStyle = 'rgba(231,214,174,.7)';
    ctx.font = '600 8px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('N', W - 9, 13);
  }

  update(dt) {
    this.mapTimer += dt;
    if (this.mapTimer > 0.1) {
      this.mapTimer = 0;
      this.drawMap();
    }
  }
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
