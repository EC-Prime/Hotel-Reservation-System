// api/controllers/authController.js
//
// HTTP handlers for guest authentication.
// All database work is delegated to authService.
// No plaintext passwords ever touch this file — only bcrypt hashes.

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const authService = require('../services/authService');

const BCRYPT_ROUNDS = 12;
const EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN  = 8;

// ------------------------------------------------------------------ helpers --

function issueToken(user) {
  return jwt.sign(
    {
      sub:   user.guest_user_id,
      email: user.email,
      name:  user.full_name,
      phone: user.phone || null
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

// ------------------------------------------------------------------ POST /api/auth/signup --
/**
 * Create a new guest account.
 * Body: { fullName, email, password, confirmPassword, phone? }
 */
async function signup(req, res) {
  const { fullName, email, password, confirmPassword, phone } = req.body;

  // --- Input validation ---
  const errors = {};
  if (!fullName || String(fullName).trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }
  if (!email || !EMAIL_RE.test(String(email).trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password || password.length < PASSWORD_MIN) {
    errors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
  } else if (!/\d/.test(password)) {
    errors.password = 'Password must contain at least one number.';
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed.', fields: errors });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();

    // Check for duplicate email before hashing (fast path)
    const taken = await authService.emailExists(normalizedEmail);
    if (taken) {
      return res.status(409).json({
        error: 'Validation failed.',
        fields: { email: 'An account with this email already exists.' }
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const newId = await authService.createGuest({
      fullName: String(fullName).trim(),
      email:    normalizedEmail,
      phone:    phone ? String(phone).trim() : null,
      passwordHash
    });

    return res.status(201).json({
      message: 'Account created successfully. Please log in.'
    });
  } catch (err) {
    console.error('signup failed:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// ------------------------------------------------------------------ POST /api/auth/login --
/**
 * Authenticate an existing guest account.
 * Body: { email, password }
 * Returns: { token, name, email }
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await authService.findGuestByEmail(String(email).trim());

    // Use the SAME generic message whether the email doesn't exist or the
    // password is wrong — never leak which field failed.
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact us.' });
    }

    const token = issueToken(user);

    return res.status(200).json({
      token,
      name:  user.full_name,
      email: user.email
    });
  } catch (err) {
    console.error('login failed:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// ------------------------------------------------------------------ POST /api/auth/logout --
/**
 * Logout is handled client-side (clear localStorage token).
 * This endpoint exists so the frontend has a clean place to call,
 * and for future server-side token blacklisting if needed.
 */
function logout(req, res) {
  return res.status(200).json({ message: 'Logged out successfully.' });
}

// ------------------------------------------------------------------ GET /api/auth/me --
/**
 * Returns the current user's profile from the database.
 * Requires a valid JWT (verifyToken middleware applied in routes).
 */
async function me(req, res) {
  try {
    const user = await authService.findGuestById(req.user.sub);
    if (!user) {
      return res.status(404).json({ error: 'Account not found.' });
    }
    // Never return password_hash — findGuestById already excludes it.
    return res.status(200).json({
      guestUserId: user.guest_user_id,
      fullName:    user.full_name,
      email:       user.email,
      phone:       user.phone || null,
      createdAt:   user.created_at
    });
  } catch (err) {
    console.error('me failed:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// ------------------------------------------------------------------ POST /api/auth/forgot-password --
/**
 * Request password assistance.
 * Body: { email }
 * Always returns a generic success response to prevent account enumeration.
 */
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const user = await authService.findGuestByEmail(String(email).trim());

    // In a production system, generate a random crypto token, save to db, and email a reset link.
    // For student demo/security standard: respond with generic success regardless of account existence.
    if (user) {
      console.log(`[Auth] Password assistance requested for user ID: ${user.guest_user_id} (${user.email})`);
    }

    return res.status(200).json({
      message: 'If an account exists with that email, instructions have been dispatched.'
    });
  } catch (err) {
    console.error('forgotPassword failed:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = { signup, login, logout, me, forgotPassword };
