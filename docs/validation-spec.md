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
