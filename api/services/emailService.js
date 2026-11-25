// api/services/emailService.js
//
// Sends the booking confirmation email.
// Rule: an email problem must NEVER fail or undo a booking. Every error is
// caught and logged here, and the function returns true/false instead of throwing.
//
// Setup (see .env.example): configure a Brevo API key and verified sender email.

const path = require('path');

// Resolve the local dotenv file from this source file, not from the process
// working directory. Render can start the service with a different cwd than
// the API folder; platform environment variables still take precedence.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = String(process.env.BREVO_API_KEY || '').trim();
const SENDER_EMAIL = String(process.env.SENDER_EMAIL || '').trim();
const configuredWebUrl = String(process.env.PUBLIC_WEB_URL || '').trim().replace(/\/$/, '');
const PUBLIC_WEB_URL = configuredWebUrl || 'https://royal-haven-web.onrender.com';
const RESEND_COOLDOWN_MS = 30 * 1000;
const resendTimestamps = new Map();

// If the credentials aren't set (e.g. a teammate running the API locally),
// skip emailing quietly instead of crashing.
const emailConfigured = Boolean(BREVO_API_KEY && SENDER_EMAIL);

// Guest-supplied text (like their name) goes into an HTML email, so escape it.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resendKey(booking) {
  return `${String(booking.reservationId)}:${String(booking.guestEmail || '').trim().toLowerCase()}`;
}

function getResendStatus(booking) {
  const key = resendKey(booking);
  const lastSentAt = resendTimestamps.get(key);
  const now = Date.now();

  if (!lastSentAt) {
    return { allowed: true, retryAfterMs: 0 };
  }

  const retryAfterMs = Math.max(0, RESEND_COOLDOWN_MS - (now - lastSentAt));
  return { allowed: retryAfterMs <= 0, retryAfterMs };
}

function getManageBookingUrl(reservationId, guestEmail) {
  const url = new URL(`${PUBLIC_WEB_URL}/confirmation.html`);
  url.searchParams.set('id', String(reservationId));
  url.searchParams.set('email', String(guestEmail || '').trim());
  return url.toString();
}

/**
 * @param {Object} booking
 * @param {string} booking.guestName
 * @param {string} booking.guestEmail
 * @param {number} booking.reservationId
 * @param {string} booking.roomNumber
 * @param {string} booking.roomType
 * @param {string} booking.checkIn
 * @param {string} booking.checkOut
 * @param {number} booking.totalPrice
 * @param {string} booking.paymentReference
 * @returns {Promise<boolean>} true if sent, false if skipped or failed
 */
async function sendConfirmationEmail(booking) {
  if (!emailConfigured) {
    const missing = [
      !BREVO_API_KEY && 'BREVO_API_KEY',
      !SENDER_EMAIL && 'SENDER_EMAIL'
    ].filter(Boolean).join(', ');
    console.log(`emailService: missing ${missing}, skipping email.`);
    return false;
  }

  const name = escapeHtml(booking.guestName);
  const subject = `Booking confirmed, ref ${booking.paymentReference}`;
  const manageUrl = getManageBookingUrl(booking.reservationId, booking.guestEmail);
  const qrImageUrl = `https://quickchart.io/qr?size=180&margin=1&text=${encodeURIComponent(manageUrl)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px;">
      <h2>Booking confirmed</h2>
      <p>Hi ${name}, your reservation is confirmed.</p>
      <table cellpadding="6" style="border-collapse: collapse;">
        <tr><td><b>Reference</b></td><td>${escapeHtml(booking.paymentReference)}</td></tr>
        <tr><td><b>Room</b></td><td>${escapeHtml(booking.roomNumber)} (${escapeHtml(booking.roomType)})</td></tr>
        <tr><td><b>Check-in</b></td><td>${escapeHtml(booking.checkIn)}</td></tr>
        <tr><td><b>Check-out</b></td><td>${escapeHtml(booking.checkOut)}</td></tr>
        <tr><td><b>Total</b></td><td>R${Number(booking.totalPrice).toFixed(2)}</td></tr>
      </table>
      <div style="margin-top: 20px; text-align: center;">
        <img src="${escapeHtml(qrImageUrl)}" width="140" height="140" alt="QR code to view your reservation online" style="display: inline-block;">
        <p style="color: #777; font-size: 12px; margin: 6px 0 0;">Scan to view your reservation online</p>
      </div>
      <p style="color: #777; font-size: 12px;">
        This is a demo booking from a student project. No payment was taken.
      </p>
    </div>`;

  const text = [
    `Booking confirmed`,
    `Hi ${booking.guestName}, your reservation is confirmed.`,
    `Reference: ${booking.paymentReference}`,
    `Room: ${booking.roomNumber} (${booking.roomType})`,
    `Check-in: ${booking.checkIn}`,
    `Check-out: ${booking.checkOut}`,
    `Total: R${Number(booking.totalPrice).toFixed(2)}`,
    `This is a demo booking from a student project. No payment was taken.`
  ].join('\n');

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'The Royal Haven', email: SENDER_EMAIL },
        to: [{ email: booking.guestEmail, name: booking.guestName }],
        subject,
        htmlContent: html,
        textContent: text
      })
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(`Brevo API request failed with status ${response.status}: ${responseBody}`);
    }

    resendTimestamps.set(resendKey(booking), Date.now());
    console.log(`emailService: confirmation sent for reservation ${booking.reservationId}`);
    return true;
  } catch (err) {
    console.error('emailService: failed to send email:', err.message);
    return false;
  }
}

/**
 * Send a guest inquiry to the configured hotel sender address.
 * Returns false on configuration/provider failure so a mail outage never
 * turns into a server error for the guest.
 */
async function sendContactInquiry({ name, email, subject, message }) {
  if (!emailConfigured) {
    console.log('emailService: missing contact mail configuration, skipping inquiry.');
    return false;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Royal Haven Website', email: SENDER_EMAIL },
        to: [{ email: SENDER_EMAIL, name: 'Royal Haven Concierge' }],
        replyTo: { email, name },
        subject: `Website inquiry: ${subject}`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>New website inquiry</h2>
          <p><b>From:</b> ${safeName} &lt;${safeEmail}&gt;</p>
          <p><b>Subject:</b> ${safeSubject}</p>
          <p>${safeMessage}</p>
        </div>`,
        textContent: `New website inquiry\n\nFrom: ${name} <${email}>\nSubject: ${subject}\n\n${message}`
      })
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(`Brevo API request failed with status ${response.status}: ${responseBody}`);
    }

    console.log(`emailService: contact inquiry sent from ${email}`);
    return true;
  } catch (err) {
    console.error('emailService: failed to send contact inquiry:', err.message);
    return false;
  }
}

async function resendConfirmationEmail(booking) {
  const status = getResendStatus(booking);
  if (!status.allowed) {
    return {
      sent: false,
      blocked: true,
      retryAfterMs: status.retryAfterMs
    };
  }

  const sent = await sendConfirmationEmail(booking);
  return {
    sent,
    blocked: false,
    retryAfterMs: 0
  };
}

module.exports = { sendConfirmationEmail, sendContactInquiry, resendConfirmationEmail, RESEND_COOLDOWN_MS };
