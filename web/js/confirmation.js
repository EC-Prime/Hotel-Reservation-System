

document.addEventListener('DOMContentLoaded', () => {
  loadConfirmedBooking();
  initManageBookingLookup();
});

function nightsBetween(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const nights = Math.round((end - start) / 86400000);
  return nights > 0 ? nights : 1;
}

function extrasForRoomNumber(roomNumber) {
  if (typeof ROOMS_DATA === 'undefined') return {};
  return ROOMS_DATA.find(r => r.roomNumber === String(roomNumber)) || {};
}

function viewModelFromApi(reservation) {
  const extras = extrasForRoomNumber(reservation.roomNumber);
  const nights = nightsBetween(reservation.checkIn, reservation.checkOut);
  const nightly = extras.pricePerNight || (nights ? reservation.totalPrice / nights : 0);

  return {
    reservationId: reservation.reservationId,
    bookingId: reservation.paymentReference,
    paymentReference: reservation.paymentReference,
    status: reservation.status,
    guestName: reservation.guestName,
    guestEmail: reservation.guestEmail,
    guestPhone: reservation.guestPhone || '',
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    nights,
    numGuests: reservation.numGuests,
    totalPrice: reservation.totalPrice,
    room: {
      roomId: extras.roomId,
      roomNumber: reservation.roomNumber,
      floorNumber: extras.floorNumber,
      title: extras.title || reservation.roomType,
      image: extras.image || '',
      pricePerNight: nightly,
      bedType: extras.bedType || '',
      view: extras.view || '',
      roomType: reservation.roomType
    }
  };
}

async function fetchReservation(id, email) {
  const params = new URLSearchParams();
  if (email) params.set('email', email);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const headers = {};
  if (typeof authHeaders === 'function') {
    Object.assign(headers, authHeaders());
  }

  const response = await fetch(`${API_BASE_URL}/reservations/${encodeURIComponent(id)}${queryStr}`, {
    headers
  });
  let data = {};
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }
  if (!response.ok) {
    const message = data.message || data.error || 'Reservation not found.';
    throw new Error(message);
  }
  return viewModelFromApi(data);
}

function setConfirmedStayVisible(visible) {
  const panel = document.getElementById('confirmedStayPanel');
  const successIcon = document.getElementById('confirmSuccessIcon');
  if (panel) {
    panel.hidden = !visible;
    panel.style.display = visible ? '' : 'none';
  }
  if (successIcon) {
    successIcon.hidden = !visible;
    successIcon.style.display = visible ? '' : 'none';
  }
}

async function loadConfirmedBooking() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id');
  let email = urlParams.get('email');

  // If email is not in URL, but user is logged in, use the logged-in user's email
  if (!email && typeof getUser === 'function') {
    const user = getUser();
    if (user && user.email) {
      email = user.email;
    }
  }

  if (!targetId || !email) {
    setConfirmedStayVisible(false);
    const heading = document.querySelector('.confirm-hero-title');
    const sub = document.querySelector('.confirm-hero-sub');
    if (heading) heading.textContent = 'Manage Your Stay';
    if (sub) {
      sub.textContent = 'Enter your booking number and the email address you used to book.';
    }
    return;
  }

  try {
    const booking = await fetchReservation(targetId, email);
    setConfirmedStayVisible(true);
    renderConfirmationUI(booking);
  } catch (err) {
    setConfirmedStayVisible(false);
    showToast(err.message, 'urgent');
    const heading = document.querySelector('.confirm-hero-title');
    const sub = document.querySelector('.confirm-hero-sub');
    if (heading) heading.textContent = 'Booking Not Found';
    if (sub) sub.textContent = err.message;
  }
}

let resendCooldownUntil = 0;

function updateResendButtonState() {
  const btn = document.getElementById('btnResendConfirmationEmail');
  const status = document.getElementById('resendEmailCooldownText');
  if (!btn) return;

  const remainingMs = Math.max(0, resendCooldownUntil - Date.now());
  const remainingSeconds = Math.ceil(remainingMs / 1000);

  if (remainingMs > 0) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-clock"></i> Resend Email (${remainingSeconds}s)`;
    if (status) {
      status.textContent = `Confirmation email can be resent in ${remainingSeconds}s`;
      status.style.display = 'block';
    }
    return;
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Resend Confirmation Email';
  if (status) {
    status.style.display = 'none';
    status.textContent = '';
  }
}

async function handleResendConfirmationEmail(booking) {
  const btn = document.getElementById('btnResendConfirmationEmail');
  if (!btn) return;

  if (Date.now() < resendCooldownUntil) {
    const remainingSeconds = Math.max(1, Math.ceil((resendCooldownUntil - Date.now()) / 1000));
    showToast(`Please wait ${remainingSeconds} seconds before resending the email.`, 'urgent');
    updateResendButtonState();
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${encodeURIComponent(booking.reservationId)}/resend-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: booking.guestEmail })
    });

    let data = {};
    try {
      data = await response.json();
    } catch (err) {
      data = {};
    }

    if (response.ok) {
      resendCooldownUntil = Date.now() + 30000;
      updateResendButtonState();
      showToast('Confirmation email resent. Please check your inbox and spam folder.');
      return;
    }

    const message = data.message || data.error || 'We could not resend the confirmation email right now.';
    showToast(message, 'urgent');
    if (response.status === 429 && data.retryAfterSeconds) {
      resendCooldownUntil = Date.now() + data.retryAfterSeconds * 1000;
    }
    updateResendButtonState();
  } catch (err) {
    showToast('The email service is unavailable right now. Please try again in a moment.', 'urgent');
    updateResendButtonState();
  }
}

function renderConfirmationUI(booking) {
  setConfirmedStayVisible(true);
  resendCooldownUntil = 0;
  updateResendButtonState();

  const heading = document.querySelector('.confirm-hero-title');
  const sub = document.querySelector('.confirm-hero-sub');
  if (heading) heading.textContent = 'Thank You';
  if (sub) {
    sub.innerHTML = `Your stay at the <span id="confirmRoomTitle">${booking.room.title}</span> is confirmed. We look forward to hosting you, <strong id="confirmGuestName" style="color: #FFF;">${booking.guestName}</strong>.`;
  }

  const roomNameEl = document.getElementById('confirmRoomTitle');
  const bookingIdEl = document.getElementById('confirmBookingId');
  const roomImgEl = document.getElementById('confirmRoomImage');
  const datesEl = document.getElementById('confirmStayDates');
  const checkInInfoEl = document.getElementById('confirmCheckInInfo');
  const guestNameEl = document.getElementById('confirmGuestName');

  if (roomNameEl) roomNameEl.textContent = booking.room.title;
  if (bookingIdEl) bookingIdEl.textContent = `Booking ID: ${booking.paymentReference}`;
  if (roomImgEl) {
    roomImgEl.src = booking.room.image;
    roomImgEl.alt = booking.room.title;
  }
  if (datesEl) {
    datesEl.textContent = `${formatDateDisplay(booking.checkIn)} — ${formatDateDisplay(booking.checkOut)} (${booking.nights} Nights)`;
  }
  if (checkInInfoEl) {
    checkInInfoEl.textContent = `3:00 PM | Digital Key Ready`;
  }
  if (guestNameEl) {
    guestNameEl.textContent = booking.guestName;
  }

  const btnCalendar = document.getElementById('btnAddToCalendar');
  if (btnCalendar) {
    btnCalendar.onclick = () => downloadCalendarEvent(booking);
  }

  const btnReceipt = document.getElementById('btnViewReceipt');
  if (btnReceipt) {
    btnReceipt.onclick = () => openReceiptModal(booking);
  }

  const btnResend = document.getElementById('btnResendConfirmationEmail');
  if (btnResend) {
    btnResend.onclick = () => handleResendConfirmationEmail(booking);
  }

  updateResendButtonState();
  window.activeBookingForReceipt = booking;
}

function downloadCalendarEvent(booking) {
  const title = `Stay at Royal Haven (${booking.room.title})`;
  const description = `Reservation ${booking.paymentReference} for ${booking.guestName}. Check-in 3:00 PM.`;
  const location = `Royal Haven Boutique & Spa, 104 Ocean View Blvd, Waterfront`;

  const startDate = booking.checkIn.replace(/-/g, '') + 'T150000Z';
  const endDate = booking.checkOut.replace(/-/g, '') + 'T110000Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Royal Haven Boutique and Spa//EN',
    'BEGIN:VEVENT',
    `UID:${booking.paymentReference}-${Date.now()}@grandreserve.com`,
    `DTSTAMP:${startDate}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `RoyalHaven-Booking-${String(booking.paymentReference).replace(/[^a-zA-Z0-9]/g, '')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Calendar invite (.ics) downloaded successfully!');
}

function openReceiptModal(booking) {
  let backdrop = document.getElementById('receiptModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'receiptModalBackdrop';
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);
  }

  const formattedIn = formatDateDisplay(booking.checkIn);
  const formattedOut = formatDateDisplay(booking.checkOut);

  backdrop.innerHTML = `
    <div class="modal-box" style="max-width: 650px; background: #0D111A; border: 1px solid var(--border-gold);">
      <button class="modal-close-btn" onclick="closeReceiptModal()"><i class="fas fa-times"></i></button>
      <div id="printableReceiptArea" style="padding: 36px 32px; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.4rem; color: #FFF; letter-spacing: 1px;">ROYAL HAVEN</h2>
            <p style="font-size: 0.72rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 2px;">Boutique & Spa</p>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">104 Ocean View Blvd, Waterfront<br>Tel: +1 (800) 472-6373</p>
          </div>
          <div style="text-align: right;">
            <span class="badge-tag badge-gold">Official Invoice</span>
            <p style="font-family: var(--font-display); font-size: 1.1rem; color: var(--gold-bright); margin-top: 8px;">${booking.paymentReference}</p>
            <p style="font-size: 0.75rem; color: var(--text-muted);">${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 0.85rem;">
          <div>
            <p style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Billed To:</p>
            <p style="font-weight: 600; color: #FFF;">${booking.guestName}</p>
            <p style="color: var(--text-secondary);">${booking.guestEmail}</p>
            ${booking.guestPhone ? `<p style="color: var(--text-secondary);">${booking.guestPhone}</p>` : ''}
          </div>
          <div>
            <p style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Your Stay:</p>
            <p style="font-weight: 600; color: #FFF;">${formattedIn} — ${formattedOut}</p>
            <p style="color: var(--text-secondary);">${booking.nights} Nights • ${booking.numGuests} Guests</p>
            <p style="color: var(--gold-primary);">Room ${booking.room.roomNumber}${booking.room.floorNumber ? ` (Floor ${booking.room.floorNumber})` : ''}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-gold); text-align: left; color: var(--gold-primary);">
              <th style="padding: 8px 0;">Description</th>
              <th style="padding: 8px 0; text-align: center;">Nights</th>
              <th style="padding: 8px 0; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 12px 0;">
                <strong>${booking.room.title}</strong>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${booking.room.bedType}</div>
              </td>
              <td style="padding: 12px 0; text-align: center;">${booking.nights}</td>
              <td style="padding: 12px 0; text-align: right;">${formatCurrency(booking.totalPrice)}</td>
            </tr>
            <tr style="font-size: 1.15rem; font-weight: 700; color: #FFF;">
              <td style="padding: 16px 0;" colspan="2">Total Paid</td>
              <td style="padding: 16px 0; text-align: right; color: var(--gold-bright); font-family: var(--font-display); font-size: 1.4rem;">
                ${formatCurrency(booking.totalPrice)}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--text-muted); text-align: center;">
          <p><i class="fas fa-lock" style="color: var(--gold-primary);"></i> Payment Verified • Electronic Confirmation Valid for Check-in</p>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <button class="btn-secondary" onclick="closeReceiptModal()">Close</button>
          <button class="btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Print Receipt</button>
        </div>
      </div>
    </div>
  `;

  backdrop.classList.add('active');
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeReceiptModal();
  });
}

function closeReceiptModal() {
  const backdrop = document.getElementById('receiptModalBackdrop');
  if (backdrop) backdrop.classList.remove('active');
}

function initManageBookingLookup() {
  const lookupForm = document.getElementById('manageBookingSearchForm');
  if (!lookupForm) return;

  const urlParams = new URLSearchParams(window.location.search);
  const idInput = document.getElementById('lookupBookingId');
  const emailInput = document.getElementById('lookupGuestEmail');
  if (idInput && urlParams.get('id')) idInput.value = urlParams.get('id');
  if (emailInput && urlParams.get('email')) emailInput.value = urlParams.get('email');

  lookupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const reservationId = idInput ? idInput.value.trim().replace(/^#/, '') : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (!reservationId || !email) {
      showToast('Enter your booking number and email to search.', 'urgent');
      return;
    }

    try {
      const booking = await fetchReservation(reservationId, email);
      showToast(`Booking found for ${booking.guestName}.`);
      renderConfirmationUI(booking);
      const next = new URLSearchParams({ id: String(booking.reservationId), email: booking.guestEmail });
      history.replaceState({}, '', `confirmation.html?${next.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast(err.message, 'urgent');
    }
  });
}
