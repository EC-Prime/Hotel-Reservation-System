#!/bin/bash
# Hotel Reservation System — folder/file scaffold (v2)
# Matches README architecture + all updates from planning session:
#   - Open-Meteo (no API key) instead of OpenWeatherMap
#   - Simulated payment step (web/js/payment.js)
#   - Email confirmation via Nodemailer (api/services/emailService.js)
#   - book_room() stored procedure wrappers on both write paths
#   - PR template + validation spec for Blessing/Terrence
#
# Run from the root of your cloned repo (where README.md and .gitignore
# already live). Works in Git Bash on Windows, or any Linux/Mac shell.

set -e

echo "Scaffolding Hotel Reservation System structure (v2)..."

# --- database/ ---
mkdir -p database
touch database/hotel_db.sql
touch database/seed_data.sql

# --- web/ (Public Guest Web Portal) ---
mkdir -p web/css web/js web/assets
touch web/css/style.css
touch web/js/main.js
touch web/js/weather.js        # now calls Open-Meteo — no API key needed
touch web/js/booking.js
touch web/js/payment.js        # NEW — simulated card form validation, generates payment_reference
touch web/index.html
touch web/rooms.html
touch web/booking.html
touch web/faq.html
touch web/confirmation.html

# --- api/ (Backend REST API Service) ---
mkdir -p api/config api/controllers api/routes api/services
touch api/config/db.js
touch api/controllers/reservationController.js
touch api/routes/apiRoutes.js
touch api/services/bookingService.js   # NEW — wraps CALL book_room(...), single source of truth (Node side)
touch api/services/emailService.js     # NEW — Nodemailer confirmation email
touch api/server.js
touch api/package.json

# --- swing/ (Java Desktop Application) ---
mkdir -p swing/src/config swing/src/models swing/src/services swing/src/views swing/lib
touch swing/src/config/DatabaseConnection.java
touch swing/src/models/Room.java
touch swing/src/models/Reservation.java
touch swing/src/services/BookingService.java   # NEW — wraps CallableStatement to book_room(...), Java side
touch swing/src/views/AdminLoginView.java
touch swing/src/views/AdminDashboardView.java
touch swing/src/views/RoomManagementView.java
touch swing/src/views/ReservationListView.java
touch swing/src/views/UserManagementView.java

# --- docs/ (governance — oversight system) ---
mkdir -p docs
cat > docs/validation-spec.md << 'DOCEOF'
# Booking validation contract

This is the single source of truth for booking validation rules.
Every layer (web JS, API, Swing) must match this exactly. If a rule
changes, update this file first, then update all three layers.

## Date rules
- check_in_date must not be in the past (compare to today, not to
  the moment of page load, to avoid timezone edge cases)
- check_out_date must be strictly after check_in_date
- Maximum stay length: 30 nights (reject anything longer — prevents
  accidental massive total_price values)
- Date format sent to the API: ISO 8601 (YYYY-MM-DD)

## Guest count rules
- num_guests must be >= 1
- num_guests must be <= the room's capacity (fetch capacity from
  the room record before validating, don't hardcode it client-side)

## What the UI must do on each book_room() outcome
| result_status      | Web UI behavior                                    | Swing UI behavior                          |
|---------------------|-----------------------------------------------------|---------------------------------------------|
| CONFIRMED           | Redirect to confirmation.html with reservation_id and payment_reference | Show success dialog, refresh ReservationListView |
| ROOM_UNAVAILABLE    | Show inline error near the date picker: "These dates are no longer available for this room." Do NOT clear the form. | Show a dialog with the same message; do not close the booking form |
| ERROR               | Show a generic "Something went wrong, please try again" message. Log the real error to the console/server log, never show raw SQL/stack traces to the guest. | Same — generic dialog, log details separately |

## Ownership
- Blessing/Terrence: implement this contract in `web/js/booking.js`
  (date validation) and `web/js/payment.js` (simulated payment,
  generates a `SIM-XXXXXX` reference client-side before the API call)
- Emmanuel: `api/services/bookingService.js` and
  `swing/src/services/BookingService.java` both call the same
  `book_room()` stored procedure — the actual overlap check lives
  in the DB, these files are wrappers only

## Weather widget (informational only — not booking-critical)
- Open-Meteo, no API key required: `https://api.open-meteo.com/v1/forecast`
- Convert Johannesburg to coordinates once (hardcode lat/long — no
  need to geocode on every page load): lat -26.2041, long 28.0473
- If the weather call fails, fail silently — hide the widget, never
  block or error out the booking flow over a weather API hiccup
DOCEOF

mkdir -p .github
cat > .github/PULL_REQUEST_TEMPLATE.md << 'PREOF'
## What does this PR do?
<!-- One or two sentences -->

## Checklist (reviewer and author both check this)
- [ ] Handles empty/invalid input (not just the happy path)
- [ ] Matches `docs/validation-spec.md` if this touches booking/dates
- [ ] Calls the real API endpoint — no hardcoded mock data left in
- [ ] No `console.log` / `System.out.println` debug statements left in
- [ ] No API keys, passwords, or `.env` values committed
- [ ] Tested locally before opening this PR

## Screenshots / demo (if UI-facing)
<!-- Drag an image or short clip here -->
PREOF

# --- root-level ---
touch .gitignore    # already exists per your message — script won't overwrite
touch README.md     # already exists per your message — script won't overwrite

echo ""
echo "Done. Structure created:"
find . -maxdepth 3 -not -path '*/\.git*' | sort
echo ""
echo "Next: copy hotel_db.sql and seed_data.sql into database/, then run them in MySQL."
