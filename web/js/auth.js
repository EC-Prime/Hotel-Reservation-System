/**
 * auth.js — Shared JWT authentication helpers
 * Royal Haven Boutique & Spa
 *
 * Include this script BEFORE any page script that needs auth.
 * It exposes a small, clean API used by booking.js, main.js,
 * confirmation.js, login.html, and signup.html.
 */

const TOKEN_KEY = 'grand_reserve_token';

/** Store the JWT returned by /api/auth/login */
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Read the raw JWT string */
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** Remove the token (logout / expiry) */
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Decode the JWT payload and return it, or null if:
 *  - no token stored
 *  - token is malformed
 *  - token has expired (checked client-side)
 *
 * NOTE: this is a local decode only — it does NOT verify the
 * signature. Signature verification happens server-side.
 * We use this only to read display data (name, email, etc.)
 * and to decide whether to show the login/logout button.
 *
 * @returns {Object|null}
 */
function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearToken();
      return null;
    }
    return payload;
  } catch {
    clearToken();
    return null;
  }
}

/**
 * Returns true if the user is currently logged in with a valid, non-expired token.
 * @returns {boolean}
 */
function isLoggedIn() {
  return getUser() !== null;
}

/**
 * Redirect to login if not logged in.
 * Preserves the current page as a `redirect` query param so the user
 * is sent back after a successful login.
 *
 * @param {string} [loginPage='login.html']
 */
function requireAuth(loginPage = 'login.html') {
  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(location.pathname.split('/').pop() + location.search);
    window.location.href = `${loginPage}?redirect=${redirect}`;
  }
}

/**
 * Build the Authorization header object for fetch() calls.
 * Returns an empty object if the user is not logged in.
 *
 * Usage:
 *   fetch(url, { headers: { 'Content-Type': 'application/json', ...authHeaders() } })
 *
 * @returns {Object}
 */
function authHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Log the user out: clear the token and redirect to the given page.
 * @param {string} [redirectTo='index.html']
 */
function logout(redirectTo = 'index.html') {
  clearToken();
  window.location.href = redirectTo;
}
