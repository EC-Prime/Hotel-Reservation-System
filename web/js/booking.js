/**
 * booking.js - Room Selection, Trip Summary, Filters & Reservation Flow
 * The Grand Reserve Boutique & Spa
 */

// Current Booking State
let bookingState = {
  checkIn: getFutureDate(1),
  checkOut: getFutureDate(4),
  numGuests: 2,
  selectedRoom: null,
  activeFilter: 'all',
  floorFilter: 'all',
  sortBy: 'featured',
  onlyAvailable: false
};

// Live catalog from GET /api/rooms, joined with rooms-data.js for images/amenities
let liveRooms = [];
let roomAvailabilityLoaded = false;
let roomAvailabilityError = '';
let roomAvailabilityRequestId = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTripState();
  initDateSelectors();
  initRoomsGallery();
  initFilters();
  initBookingForm();

  document.addEventListener('currencyChanged', () => {
    renderRoomsGrid();
    updateTripSummary();
  });
});

function getFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function calculateNights(inStr, outStr) {
  const d1 = new Date(inStr);
  const d2 = new Date(outStr);
  const diffTime = d2 - d1;
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
}

function isRoomBookable(room) {
  return Boolean(roomAvailabilityLoaded && room && room.available === true);
}

function getCatalogRooms() {
  if (roomAvailabilityLoaded) return liveRooms;
  return typeof ROOMS_DATA !== 'undefined' ? ROOMS_DATA : [];
}

function findCatalogRoom(id) {
  const rooms = getCatalogRooms();
  const match = rooms.find(r => r.roomId === Number(id) || r.roomNumber === String(id));
  return match || (typeof getRoomById === 'function' ? getRoomById(id) : null);
}

function mergeApiRoom(apiRoom) {
  const extras = typeof getRoomById === 'function' ? getRoomById(apiRoom.roomId) : {};
  return {
    ...extras,
    ...apiRoom,
    image: extras.image || '',
    amenities: extras.amenities || [],
    title: extras.title || apiRoom.roomType,
    categoryTag: extras.categoryTag || String(apiRoom.roomType || '').toLowerCase(),
    bedType: extras.bedType || '',
    sizeSqm: extras.sizeSqm || '',
    view: extras.view || '',
    badge: extras.badge || null,
    urgencyText: extras.urgencyText || null,
    comparePrice: extras.comparePrice || apiRoom.pricePerNight
  };
}

async function fetchLiveRooms() {
  const gallery = document.getElementById('roomsListContainer');
  if (!gallery) return;
  if (!bookingState.checkIn || !bookingState.checkOut) return;

  const requestId = ++roomAvailabilityRequestId;
  roomAvailabilityLoaded = false;
  roomAvailabilityError = '';
  liveRooms = [];
  renderRoomsGrid();
  updateTripSummary();

  try {
    const params = new URLSearchParams({
      checkIn: bookingState.checkIn,
      checkOut: bookingState.checkOut
    });
    const response = await fetch(`${API_BASE_URL}/rooms?${params.toString()}`);
    if (!response.ok) throw new Error(`Rooms request failed (${response.status}).`);
    const apiRooms = await response.json();
    if (!Array.isArray(apiRooms) || apiRooms.some(room => typeof room.available !== 'boolean')) {
      throw new Error('The room availability response was invalid.');
    }
    if (requestId !== roomAvailabilityRequestId) return;
    liveRooms = apiRooms.map(mergeApiRoom);
    roomAvailabilityLoaded = true;

    if (bookingState.selectedRoom) {
      const updated = liveRooms.find(r => r.roomId === bookingState.selectedRoom.roomId);
      if (updated) {
        bookingState.selectedRoom = updated;
        if (!updated.available) {
          bookingState.selectedRoom = liveRooms.find(r => r.available) || updated;
        }
      }
    }
  } catch (err) {
    if (requestId !== roomAvailabilityRequestId) return;
    console.warn('Could not load live room availability:', err.message);
    liveRooms = [];
    roomAvailabilityError = 'Live room availability could not be verified. Please try again.';
  }

  renderRoomsGrid();
  updateTripSummary();
}

function loadSavedTripState() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('checkIn')) bookingState.checkIn = params.get('checkIn');
  if (params.get('checkOut')) bookingState.checkOut = params.get('checkOut');
  if (params.get('guests')) bookingState.numGuests = parseInt(params.get('guests'), 10) || 2;
  if (params.get('type')) bookingState.activeFilter = params.get('type').toLowerCase();
  if (params.get('floor')) bookingState.floorFilter = params.get('floor');
  if (params.get('roomId')) {
    const r = findCatalogRoom(params.get('roomId'));
    if (r) bookingState.selectedRoom = r;
  }
}

function initDateSelectors() {
  const inInput = document.getElementById('searchCheckIn');
  const outInput = document.getElementById('searchCheckOut');
  const guestsSelect = document.getElementById('searchGuests');

  if (inInput) {
    inInput.value = bookingState.checkIn;
    inInput.min = getFutureDate(0);
    inInput.addEventListener('change', (e) => {
      bookingState.checkIn = e.target.value;
      if (outInput && outInput.value <= bookingState.checkIn) {
        const next = new Date(bookingState.checkIn);
        next.setDate(next.getDate() + 1);
        const pad = n => String(n).padStart(2, '0');
        outInput.value = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
        bookingState.checkOut = outInput.value;
      }
      updateTripSummary();
      fetchLiveRooms();
    });
  }

  if (outInput) {
    outInput.value = bookingState.checkOut;
    outInput.min = getFutureDate(1);
    outInput.addEventListener('change', (e) => {
      bookingState.checkOut = e.target.value;
      updateTripSummary();
      fetchLiveRooms();
    });
  }

  if (guestsSelect) {
    guestsSelect.value = bookingState.numGuests;
    guestsSelect.addEventListener('change', (e) => {
      bookingState.numGuests = parseInt(e.target.value, 10);
      updateTripSummary();
    });
  }
}

function initRoomsGallery() {
  const container = document.getElementById('roomsListContainer');
  if (!container) return;

  if (!bookingState.selectedRoom && typeof ROOMS_DATA !== 'undefined' && ROOMS_DATA.length > 0) {
    bookingState.selectedRoom = ROOMS_DATA.find(r => r.roomId === 9) || ROOMS_DATA[0];
  }

  renderRoomsGrid();
  updateTripSummary();
  fetchLiveRooms();
}

function renderRoomsGrid() {
  const container = document.getElementById('roomsListContainer');
  const countBadge = document.getElementById('roomsCountBadge');
  if (!container) return;

  if (!roomAvailabilityLoaded) {
    if (countBadge) countBadge.textContent = 'Availability unavailable';
    container.innerHTML = roomAvailabilityError
      ? `<div role="alert" style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-card);">
          <p style="color: var(--text-secondary); margin-bottom: 20px;">${roomAvailabilityError}</p>
          <button class="btn-primary" onclick="fetchLiveRooms()">Retry</button>
        </div>`
      : '<p role="status" style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">Checking live room availability…</p>';
    return;
  }

  let rooms = [...getCatalogRooms()];

  if (bookingState.activeFilter !== 'all') {
    rooms = rooms.filter(r => r.categoryTag === bookingState.activeFilter || r.roomType.toLowerCase() === bookingState.activeFilter);
  }

  if (bookingState.floorFilter !== 'all') {
    rooms = rooms.filter(r => r.floorNumber === parseInt(bookingState.floorFilter, 10));
  }

  if (bookingState.onlyAvailable) {
    rooms = rooms.filter(isRoomBookable);
  }

  if (bookingState.sortBy === 'price-low') {
    rooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (bookingState.sortBy === 'price-high') {
    rooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
  }

  if (countBadge) {
    countBadge.textContent = `${rooms.length} Sanctuaries Found`;
  }

  if (rooms.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-card);">
        <i class="fas fa-bed" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 16px;"></i>
        <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: #FFF; margin-bottom: 8px;">No Sanctuaries Matched Your Criteria</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Try adjusting your filters or dates to discover available rooms.</p>
        <button class="btn-primary" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = rooms.map(room => {
    const isSelected = bookingState.selectedRoom && bookingState.selectedRoom.roomId === room.roomId;
    const isAvailable = isRoomBookable(room);
    const convertedLivePrice = formatCurrency(room.pricePerNight);
    const convertedComparePrice = formatCurrency(room.comparePrice);

    return `
      <div class="room-card ${isSelected ? 'selected' : ''}" id="room-card-${room.roomId}">
        <div class="room-card-media">
          <img src="${room.image}" alt="${room.title}" class="room-card-img" loading="lazy">
          <div class="room-badges-top">
            ${room.badge ? `<span class="badge-tag badge-gold"><i class="fas fa-crown"></i> ${room.badge}</span>` : '<span></span>'}
            ${!isAvailable ? `<span class="badge-tag badge-urgent"><i class="fas fa-circle" style="font-size: 0.45rem;"></i> Unavailable</span>` : (room.urgencyText ? `<span class="badge-tag badge-urgent"><i class="fas fa-circle" style="font-size: 0.45rem;"></i> ${room.urgencyText}</span>` : '')}
          </div>
          <div class="room-floor-pill">
            <i class="fas fa-layer-group" style="color: var(--gold-primary);"></i> Floor ${room.floorNumber} • Room ${room.roomNumber}
          </div>
        </div>

        <div class="room-card-body">
          <div class="room-header-row">
            <div>
              <h3 class="room-title">${room.title}</h3>
              <div class="room-meta-icons">
                <span class="room-meta-item"><i class="fas fa-bed"></i> ${room.bedType}</span>
                <span class="room-meta-item"><i class="fas fa-vector-square"></i> ${room.sizeSqm} sqm</span>
                <span class="room-meta-item"><i class="fas fa-user-friends"></i> Max ${room.capacity} Guests</span>
                <span class="room-meta-item"><i class="fas fa-compass"></i> ${room.view}</span>
              </div>
            </div>
          </div>

          <p class="room-desc">${room.description}</p>

          <div class="room-amenities-tags">
            ${(room.amenities || []).slice(0, 3).map(a => `<span class="amenity-chip"><i class="fas fa-check" style="color: var(--gold-primary); font-size: 0.65rem;"></i> ${a}</span>`).join('')}
            ${(room.amenities || []).length > 3 ? `<span class="amenity-chip">+${room.amenities.length - 3} more</span>` : ''}
          </div>

          <div class="room-footer-row">
            <div class="room-pricing-wrap">
              <span class="room-compare-price">Expedia: ${convertedComparePrice}</span>
              <div class="room-price-live">
                <span class="room-rate-amount">${convertedLivePrice}</span>
                <span class="room-rate-label">Live Direct Rate / night</span>
              </div>
            </div>

            <div class="room-actions-group">
              <button class="btn-view-details" onclick="openRoomModal(${room.roomId})">View Details</button>
              <button
                class="btn-select-room ${isSelected ? 'selected' : ''}"
                onclick="selectSanctuary(${room.roomId})"
                ${!isAvailable ? 'disabled' : ''}
              >
                ${!isAvailable ? 'Unavailable' : isSelected ? '<i class="fas fa-check"></i> Selected' : 'Select Room'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectSanctuary(roomId) {
  const room = findCatalogRoom(roomId);
  if (!room || !isRoomBookable(room)) return;

  bookingState.selectedRoom = room;
  renderRoomsGrid();
  updateTripSummary();

  showToast(`Selected "${room.title}" for your trip summary!`);

  if (window.innerWidth <= 1080) {
    const summary = document.querySelector('.trip-summary-sidebar');
    if (summary) summary.scrollIntoView({ behavior: 'smooth' });
  }
}

function stayTotal(room, nights) {
  return Number(room.pricePerNight) * nights;
}

function updateTripSummary() {
  const summaryDates = document.getElementById('summaryDates');
  const summaryNights = document.getElementById('summaryNights');
  const summaryGuests = document.getElementById('summaryGuests');
  const summarySanctuary = document.getElementById('summarySanctuary');
  const summaryRate = document.getElementById('summaryRate');
  const summaryTotal = document.getElementById('summaryTotal');
  const completeBtn = document.getElementById('completeBookingBtn');

  const nights = calculateNights(bookingState.checkIn, bookingState.checkOut);
  const formattedIn = formatDateDisplay(bookingState.checkIn);
  const formattedOut = formatDateDisplay(bookingState.checkOut);

  if (summaryDates) {
    summaryDates.textContent = `${formattedIn} — ${formattedOut}`;
  }
  if (summaryNights) {
    summaryNights.textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
  }
  if (summaryGuests) {
    summaryGuests.textContent = `${bookingState.numGuests} Guest${bookingState.numGuests > 1 ? 's' : ''}`;
  }

  if (!bookingState.selectedRoom) {
    if (summarySanctuary) summarySanctuary.innerHTML = '<span style="color: var(--text-muted);">No sanctuary selected yet</span>';
    if (summaryRate) summaryRate.textContent = formatCurrency(0);
    if (summaryTotal) summaryTotal.textContent = formatCurrency(0);
    if (completeBtn) {
      completeBtn.disabled = true;
      completeBtn.textContent = 'Select a Sanctuary to Proceed';
    }
    return;
  }

  const room = bookingState.selectedRoom;
  const nightly = room.pricePerNight;
  const total = stayTotal(room, nights);

  if (summarySanctuary) {
    summarySanctuary.innerHTML = `
      <div class="selected-sanctuary-box">
        <img src="${room.image}" alt="${room.title}" class="selected-sanctuary-thumb">
        <div class="selected-sanctuary-info">
          <h4>${room.title}</h4>
          <p><i class="fas fa-layer-group"></i> Floor ${room.floorNumber} • ${room.roomType}</p>
        </div>
      </div>
    `;
  }

  if (summaryRate) summaryRate.textContent = `${formatCurrency(nightly)} × ${nights} nights`;
  if (summaryTotal) {
    const formatted = formatCurrency(total);
    if (summaryTotal.textContent !== formatted) {
      summaryTotal.textContent = formatted;
      summaryTotal.classList.remove('price-highlight-glow');
      void summaryTotal.offsetWidth; // trigger reflow
      summaryTotal.classList.add('price-highlight-glow');
    }
  }

  if (completeBtn) {
    const bookable = isRoomBookable(room);
    completeBtn.disabled = !bookable;
    completeBtn.innerHTML = bookable
      ? `Complete Booking <i class="fas fa-arrow-right"></i>`
      : 'This room is unavailable';
    completeBtn.onclick = () => {
      if (!bookable) return;
      saveTripToLocalStorage();
      if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        const dest = `booking.html?roomId=${room.roomId}&checkIn=${bookingState.checkIn}&checkOut=${bookingState.checkOut}&guests=${bookingState.numGuests}`;
        window.location.href = `login.html?redirect=${encodeURIComponent(dest)}`;
        return;
      }
      window.location.href = `booking.html?roomId=${room.roomId}&checkIn=${bookingState.checkIn}&checkOut=${bookingState.checkOut}&guests=${bookingState.numGuests}`;
    };
  }
}

function saveTripToLocalStorage() {
  localStorage.setItem('grand_reserve_active_trip', JSON.stringify({
    checkIn: bookingState.checkIn,
    checkOut: bookingState.checkOut,
    numGuests: bookingState.numGuests,
    roomId: bookingState.selectedRoom ? bookingState.selectedRoom.roomId : null
  }));
}

function initFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      bookingState.activeFilter = pill.getAttribute('data-filter') || 'all';
      renderRoomsGrid();
    });
  });

  const floorSelect = document.getElementById('floorFilterSelect');
  if (floorSelect) {
    if (bookingState.floorFilter !== 'all') floorSelect.value = bookingState.floorFilter;
    floorSelect.addEventListener('change', (e) => {
      bookingState.floorFilter = e.target.value;
      renderRoomsGrid();
    });
  }

  const sortSelect = document.getElementById('sortFilterSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      bookingState.sortBy = e.target.value;
      renderRoomsGrid();
    });
  }

  const availBtn = document.getElementById('availToggleBtn');
  if (availBtn) {
    availBtn.addEventListener('click', () => {
      bookingState.onlyAvailable = !bookingState.onlyAvailable;
      availBtn.classList.toggle('active', bookingState.onlyAvailable);
      renderRoomsGrid();
    });
  }
}

function resetAllFilters() {
  bookingState.activeFilter = 'all';
  bookingState.floorFilter = 'all';
  bookingState.onlyAvailable = false;
  bookingState.sortBy = 'featured';

  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));

  const floorSelect = document.getElementById('floorFilterSelect');
  if (floorSelect) floorSelect.value = 'all';

  const sortSelect = document.getElementById('sortFilterSelect');
  if (sortSelect) sortSelect.value = 'featured';

  renderRoomsGrid();
}

function openRoomModal(roomId) {
  const room = findCatalogRoom(roomId);
  if (!room) return;

  let backdrop = document.getElementById('roomDetailsModal');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'roomDetailsModal';
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);
  }

  backdrop.innerHTML = `
    <div class="modal-box">
      <button class="modal-close-btn" onclick="closeRoomModal()"><i class="fas fa-times"></i></button>
      <div style="position: relative; height: 320px; overflow: hidden;">
        <img src="${room.image}" alt="${room.title}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; bottom: 16px; left: 20px; background: rgba(11, 14, 20, 0.85); padding: 6px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-gold);">
          <span style="color: var(--gold-bright); font-weight: 700;">Floor ${room.floorNumber} • Sanctuary #${room.roomNumber}</span>
        </div>
      </div>
      <div style="padding: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
          <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: #FFF;">${room.title}</h2>
          <div style="font-size: 1.6rem; font-family: var(--font-display); font-weight: 700; color: var(--gold-bright);">
            ${formatCurrency(room.pricePerNight)} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-secondary);">/ night</span>
          </div>
        </div>

        <div class="room-meta-icons" style="margin-bottom: 20px;">
          <span class="room-meta-item"><i class="fas fa-bed"></i> ${room.bedType}</span>
          <span class="room-meta-item"><i class="fas fa-vector-square"></i> ${room.sizeSqm} sqm</span>
          <span class="room-meta-item"><i class="fas fa-user-friends"></i> Capacity: ${room.capacity} Guests</span>
          <span class="room-meta-item"><i class="fas fa-compass"></i> ${room.view}</span>
        </div>

        <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">${room.description}</p>

        <h4 style="font-family: var(--font-display); font-size: 1rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Curated Amenities & Services</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 30px;">
          ${(room.amenities || []).map(a => `<div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-primary);"><i class="fas fa-check-circle" style="color: var(--gold-primary);"></i> ${a}</div>`).join('')}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 14px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
          <button class="btn-secondary" onclick="closeRoomModal()">Close</button>
          <button class="btn-primary" onclick="selectSanctuary(${room.roomId}); closeRoomModal();">
            <i class="fas fa-check"></i> Select This Sanctuary
          </button>
        </div>
      </div>
    </div>
  `;

  backdrop.classList.add('active');
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeRoomModal();
  });
}

function closeRoomModal() {
  const backdrop = document.getElementById('roomDetailsModal');
  if (backdrop) backdrop.classList.remove('active');
}

function showBookingError(message) {
  const errorEl = document.getElementById('bookingSubmitError');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
  showToast(message, 'urgent');
}

function clearBookingError() {
  const errorEl = document.getElementById('bookingSubmitError');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

function renderCheckoutRecap(room, checkIn, checkOut) {
  const recapContainer = document.getElementById('checkoutRoomRecap');
  if (!recapContainer || !room) return;

  const nights = calculateNights(checkIn, checkOut);
  const total = stayTotal(room, nights);

  recapContainer.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
        <img src="${room.image}" alt="${room.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);">
        <div>
          <span class="badge-tag badge-gold">Floor ${room.floorNumber} • Sanctuary #${room.roomNumber}</span>
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #FFF; margin-top: 4px;">${room.title}</h3>
          <p style="font-size: 0.8rem; color: var(--gold-light);">${room.bedType} • Max ${room.capacity} Guests</p>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.875rem;">
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Dates:</span> <strong style="color: #FFF;">${formatDateDisplay(checkIn)} — ${formatDateDisplay(checkOut)} (${nights} Nights)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Rate (${nights} nights × ${formatCurrency(room.pricePerNight)}):</span> <span>${formatCurrency(total)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 1.15rem; color: #FFF; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
          <span>Total Payable:</span> <strong id="checkoutTotalAmount" class="price-highlight-glow" style="color: var(--gold-bright); font-size: 1.6rem; font-family: var(--font-display);">${formatCurrency(total)}</strong>
        </div>
      </div>
    </div>
  `;
}

function initBookingForm() {
  const form = document.getElementById('reservationCheckoutForm');
  if (!form) return;

  // Protect checkout form: user must be logged in to book
  if (typeof requireAuth === 'function') {
    requireAuth('login.html');
  }

  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId') || 9;
  let checkIn = urlParams.get('checkIn') || getFutureDate(1);
  let checkOut = urlParams.get('checkOut') || getFutureDate(4);
  const guests = parseInt(urlParams.get('guests'), 10) || 2;

  let room = findCatalogRoom(roomId) || (typeof ROOMS_DATA !== 'undefined' ? ROOMS_DATA[0] : null);

  const guestName = document.getElementById('guestName');
  const guestEmail = document.getElementById('guestEmail');
  const guestPhone = document.getElementById('guestPhone');
  const formCheckIn = document.getElementById('formCheckIn');
  const formCheckOut = document.getElementById('formCheckOut');
  const formGuests = document.getElementById('formGuests');
  const submitBtn = form.querySelector('button[type="submit"]');
  let checkoutAvailabilityVerified = false;
  let availabilityRequestId = 0;

  // Auto-fill form fields from logged-in user profile
  if (typeof getUser === 'function') {
    const user = getUser();
    if (user) {
      if (guestName && !guestName.value && user.name) guestName.value = user.name;
      if (guestEmail && !guestEmail.value && user.email) guestEmail.value = user.email;
      if (guestPhone && !guestPhone.value && user.phone) guestPhone.value = user.phone;
    }
  }

  if (formCheckIn) formCheckIn.value = checkIn;
  if (formCheckOut) formCheckOut.value = checkOut;
  if (formGuests) formGuests.value = guests;

  if (submitBtn) submitBtn.disabled = true;
  renderCheckoutRecap(room, checkIn, checkOut);

  const refreshAvailability = async () => {
    checkIn = formCheckIn ? formCheckIn.value : checkIn;
    checkOut = formCheckOut ? formCheckOut.value : checkOut;
    const requestId = ++availabilityRequestId;
    checkoutAvailabilityVerified = false;
    if (submitBtn) submitBtn.disabled = true;
    clearBookingError();
    renderCheckoutRecap(room, checkIn, checkOut);

    try {
      const params = new URLSearchParams({ checkIn, checkOut });
      const response = await fetch(`${API_BASE_URL}/rooms?${params.toString()}`);
      if (!response.ok) throw new Error(`Rooms request failed (${response.status}).`);
      const apiRooms = await response.json();
      if (!Array.isArray(apiRooms) || apiRooms.some(apiRoom => typeof apiRoom.available !== 'boolean')) {
        throw new Error('The room availability response was invalid.');
      }
      if (requestId !== availabilityRequestId) return;

      const apiRoom = apiRooms.find(candidate => candidate.roomId === Number(roomId));
      if (!apiRoom) {
        throw new Error('The selected room could not be found. Please choose a room again.');
      }

      room = mergeApiRoom(apiRoom);
      renderCheckoutRecap(room, checkIn, checkOut);
      if (!apiRoom.available) {
        showBookingError('This room is unavailable for the selected dates. Please choose another room or change your dates.');
        return;
      }

      checkoutAvailabilityVerified = true;
      if (submitBtn) submitBtn.disabled = false;
    } catch (err) {
      if (requestId !== availabilityRequestId) return;
      console.warn('Could not verify checkout room availability:', err.message);
      showBookingError(err.message === 'The selected room could not be found. Please choose a room again.'
        ? err.message
        : 'Live room availability could not be verified. Please try again.');
    }
  };
  if (formCheckIn) formCheckIn.addEventListener('change', refreshAvailability);
  if (formCheckOut) formCheckOut.addEventListener('change', refreshAvailability);
  refreshAvailability();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearBookingError();

    if (!checkoutAvailabilityVerified) {
      showBookingError('Live room availability must be verified before booking. Please try again.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Securing Reservation...`;
    }

    const payload = {
      roomId: room.roomId,
      guestName: guestName ? guestName.value.trim() : '',
      guestEmail: guestEmail ? guestEmail.value.trim() : '',
      guestPhone: guestPhone ? guestPhone.value.trim() : '',
      checkIn: formCheckIn ? formCheckIn.value : checkIn,
      checkOut: formCheckOut ? formCheckOut.value : checkOut,
      numGuests: formGuests ? parseInt(formGuests.value, 10) : guests
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (typeof authHeaders === 'function') {
        Object.assign(headers, authHeaders());
      }

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseErr) {
        data = {};
      }

      if (response.status === 201 && data.reservationId) {
        const next = new URLSearchParams({
          id: String(data.reservationId),
          email: payload.guestEmail
        });
        window.location.href = `confirmation.html?${next.toString()}`;
        return;
      }

      const apiMessage = data.message || data.error || 'This reservation could not be completed. Please try again.';
      showBookingError(apiMessage);
    } catch (err) {
      showBookingError('The reservation service is unavailable. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = !checkoutAvailabilityVerified;
        submitBtn.innerHTML = `<i class="fas fa-shield-alt"></i> Confirm & Guarantee Reservation`;
      }
    }
  });
}
