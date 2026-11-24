// api/services/emailService.js
//
// Sends the booking confirmation email.
// Rule: an email problem must NEVER fail or undo a booking. Every error is
// caught and logged here, and the function returns true/false instead of throwing.
//
// Setup (see .env.example): configure a Brevo API key and verified sender email.

require('dotenv').config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const RESEND_COOLDOWN_MS = 30 * 1000;
const resendTimestamps = new Map();

// If the credentials aren't set (e.g. a teammate running the API locally),
// skip emailing quietly instead of crashing.
const emailConfigured = BREVO_API_KEY && SENDER_EMAIL;

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
    console.log('emailService: BREVO_API_KEY / SENDER_EMAIL not set, skipping email.');
    return false;
  }

  const name = escapeHtml(booking.guestName);
  const subject = `Booking confirmed, ref ${booking.paymentReference}`;

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

module.exports = { sendConfirmationEmail, resendConfirmationEmail, RESEND_COOLDOWN_MS };