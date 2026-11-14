/**
 * payment.js - Simulated Card Verification & Transaction Reference Generator
 * Royal Haven Boutique & Spa
 */

function generatePaymentReference() {
  const chars = '0123456789ABCDEF';
  let ref = 'SIM-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

function maskCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return '•••• •••• •••• ••••';
  const lastFour = cleaned.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generatePaymentReference, maskCardNumber };
}

