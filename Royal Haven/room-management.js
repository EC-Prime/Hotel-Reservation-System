(() => {
  'use strict';

  /* Settings: change these to match your system */
  const CURRENCY = 'ZAR';
  const LOCALE = 'en-ZA';
  const STORAGE_KEY = 'royalHaven.rooms';

  const STATUS = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance'
  };
  const TYPES = [
    { name: 'Standard', capacity: 2, rate: 850 },
    { name: 'Double', capacity: 2, rate: 1050 },
    { name: 'Deluxe', capacity: 2, rate: 1450 },
    { name: 'Executive', capacity: 2, rate: 1850 },
    { name: 'Family', capacity: 4, rate: 2200 },
    { name: 'Suite', capacity: 3, rate: 3200 }
  ];
  const FIRST = ['Sarah', 'Daniel', 'Emily', 'Thabo', 'Naledi', 'James', 'Aisha', 'Liam', 'Zanele', 'Michael', 'Lerato', 'Sophie'];
  const LAST = ['Johnson', 'Smith', 'Brown', 'Mokoena', 'Dlamini', 'Patel', 'Nkosi', 'Moore', 'Khumalo', 'Van der Merwe'];

  const money = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 });
  const byNumber = (a, b) => a.number.localeCompare(b.number, undefined, { numeric: true });
  const SORTERS = {
    number: byNumber,
    floor: (a, b) => a.floor - b.floor || byNumber(a, b),
    'rate-asc': (a, b) => a.rate - b.rate,
    'rate-desc': (a, b) => b.rate - a.rate
  };

  /* Seed data: 120 rooms over 6 floors, 35 available (matches the dashboard) */
  function seedRooms() {
    const counts = { available: 35, occupied: 58, reserved: 14, cleaning: 8, maintenance: 5 };
    const pool = Object.entries(counts).flatMap(([status, n]) => Array(n).fill(status));
    let seed = 42;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const list = [];
    for (let floor = 1; floor <= 6; floor++) {
      for (let n = 1; n <= 20; n++) {
        const i = list.length;
        const type = TYPES[i % TYPES.length];
        const status = pool[i];
        list.push({
          number: String(floor * 100 + n),
          type: type.name,
          floor,
          capacity: type.capacity,
          rate: type.rate + floor * 25,
          status,
          guest: status === 'occupied' || status === 'reserved'
            ? `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`
            : ''
        });
      }
    }
    return list;
  }

  let rooms;
  try {
    rooms = JSON.parse(localStorage.getItem(STORAGE_KEY)) || seedRooms();
  } catch {
    rooms = seedRooms();
  }
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms)); } catch { /* storage blocked: keep working in memory */ }
  };

  const $ = (sel) => document.querySelector(sel);
  const rowsEl = $('#roomRows');
  const countEl = $('#count');
  const searchEl = $('#search');
  const statusFilter = $('#statusFilter');
  const typeFilter = $('#typeFilter');
  const sortEl = $('#sortBy');
  const roomDialog = $('#roomDialog');
  const roomForm = $('#roomForm');
  const dlgTitle = $('#dlgTitle');
  const formError = $('#formError');
  const confirmDialog = $('#confirmDialog');
  const confirmText = $('#confirmText');
  const toastEl = $('#toast');

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const options = (pairs, placeholder = '') => (placeholder ? `<option value="">${placeholder}</option>` : '')
    + pairs.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
  const statusPairs = Object.entries(STATUS);
  const typePairs = TYPES.map((t) => [t.name, t.name]);

  statusFilter.innerHTML = options(statusPairs, 'All statuses');
  typeFilter.innerHTML = options(typePairs, 'All types');
  $('#f-type').innerHTML = options(typePairs);
  $('#f-status').innerHTML = options(statusPairs);

  const rowHTML = (r) => {
    const id = esc(r.number);
    const statusOpts = statusPairs
      .map(([v, l]) => `<option value="${v}"${v === r.status ? ' selected' : ''}>${l}</option>`)
      .join('');
    return `<tr>
      <td><strong>${id}</strong></td>
      <td>${esc(r.type)}</td>
      <td>${r.floor}</td>
      <td>${r.capacity}</td>
      <td>${money.format(r.rate)}</td>
      <td>${r.guest ? esc(r.guest) : '<span class="muted">—</span>'}</td>
      <td><select class="status" data-status="${r.status}" data-room="${id}" aria-label="Status of room ${id}">${statusOpts}</select></td>
      <td><button class="btn small" data-action="edit" data-room="${id}">Edit</button><button class="btn small danger" data-action="delete" data-room="${id}">Delete</button></td>
    </tr>`;
  };

  const visibleRooms = () => {
    const q = searchEl.value.trim().toLowerCase();
    return rooms
      .filter((r) => (!statusFilter.value || r.status === statusFilter.value)
        && (!typeFilter.value || r.type === typeFilter.value)
        && (!q || `${r.number} ${r.type} ${r.guest}`.toLowerCase().includes(q)))
      .sort(SORTERS[sortEl.value]);
  };

  const countOf = (status) => rooms.filter((r) => r.status === status).length;

  const render = () => {
    const list = visibleRooms();
    rowsEl.innerHTML = list.length
      ? list.map(rowHTML).join('')
      : '<tr><td class="empty" colspan="8">No rooms match these filters.</td></tr>';
    countEl.textContent = `Showing ${list.length} of ${rooms.length} rooms`;
    $('#statTotal').textContent = rooms.length;
    $('#statAvailable').textContent = countOf('available');
    $('#statOccupied').textContent = countOf('occupied');
    $('#statReserved').textContent = countOf('reserved');
  };

  let toastTimer;
  const toast = (message) => {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };

  const changed = (message) => {
    save();
    render();
    if (message) toast(message);
  };

  const findRoom = (number) => rooms.find((r) => r.number === number);

  /* Guest names only make sense for occupied or reserved rooms */
  const applyStatus = (room, status) => {
    room.status = status;
    if (status !== 'occupied' && status !== 'reserved') room.guest = '';
  };

  rowsEl.addEventListener('change', (e) => {
    const select = e.target.closest('select.status');
    if (!select) return;
    const room = findRoom(select.dataset.room);
    applyStatus(room, select.value);
    changed(`Room ${room.number} is now ${STATUS[room.status].toLowerCase()}.`);
  });

  rowsEl.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const room = findRoom(button.dataset.room);
    if (button.dataset.action === 'edit') openForm(room);
    else askDelete(room);
  });

  /* Add and edit */
  const FIELDS = ['number', 'type', 'floor', 'capacity', 'rate', 'status', 'guest'];
  let editing = null;

  const openForm = (room) => {
    editing = room;
    const v = room || { number: '', type: 'Standard', floor: 1, capacity: 2, rate: 850, status: 'available', guest: '' };
    dlgTitle.textContent = room ? `Edit room ${room.number}` : 'Add room';
    FIELDS.forEach((f) => { $(`#f-${f}`).value = v[f]; });
    formError.textContent = '';
    roomDialog.showModal();
  };

  $('#f-type').addEventListener('change', (e) => {
    const t = TYPES.find((x) => x.name === e.target.value);
    $('#f-capacity').value = t.capacity;
    $('#f-rate').value = t.rate;
  });

  roomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      number: $('#f-number').value.trim(),
      type: $('#f-type').value,
      floor: Number($('#f-floor').value),
      capacity: Number($('#f-capacity').value),
      rate: Number($('#f-rate').value),
      status: $('#f-status').value,
      guest: $('#f-guest').value.trim()
    };
    if (!data.number || rooms.some((r) => r.number === data.number && r !== editing)) {
      formError.textContent = data.number ? `Room ${data.number} already exists.` : 'Enter a room number.';
      return;
    }
    const isNew = !editing;
    const room = editing || {};
    Object.assign(room, data);
    applyStatus(room, data.status);
    if (isNew) rooms.push(room);
    editing = null;
    roomDialog.close();
    changed(isNew ? `Room ${room.number} added.` : `Room ${room.number} updated.`);
  });

  $('#cancelRoom').addEventListener('click', () => roomDialog.close());
  $('#addRoom').addEventListener('click', () => openForm(null));

  /* Delete with confirmation */
  let doomed = null;

  const askDelete = (room) => {
    doomed = room;
    confirmText.textContent = `Room ${room.number} (${room.type}) will be removed from the list. This cannot be undone.`;
    confirmDialog.showModal();
  };

  confirmDialog.addEventListener('close', () => {
    const room = doomed;
    doomed = null;
    if (confirmDialog.returnValue !== 'delete' || !room) return;
    rooms = rooms.filter((r) => r !== room);
    changed(`Room ${room.number} deleted.`);
  });

  /* Search, filters and sorting */
  [searchEl, statusFilter, typeFilter, sortEl].forEach((control) => control.addEventListener('input', render));

  render();
})();