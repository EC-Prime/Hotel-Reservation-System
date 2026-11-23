# Hotel Reservation System

A hotel booking and front-desk management project with a guest website, a Node.js REST API, a MySQL database, and a Java Swing desktop application.

## ✨ What the system does

- Lets guests browse rooms, create an account, sign in, make reservations, and view their bookings on the website.
- Provides public room availability through the API and protects account and booking actions with JWT authentication.
- Gives hotel staff a Java Swing application for room, reservation, payment, check-in/check-out, dashboard, and user-management workflows.
- Stores room inventory, guest accounts, staff accounts, reservations, and audit events in MySQL.

The API uses a shared MySQL connection pool. The Java application connects to MySQL through JDBC. Both clients use the same database, but the Swing app does not currently route its database operations through the Node API.

## 🎬 Main project walkthrough

Use this single featured slot for the end-to-end video walkthrough. Replace the placeholder link when the video is uploaded.

> **▶ Watch the Hotel Reservation System walkthrough:** [Add the video URL here](VIDEO_WALKTHROUGH_URL)

Suggested walkthrough: guest room search and booking → staff reservation and check-in workflow → how the website, API, Render, and Aiven database fit together.

## 🧭 How someone uses the project

### 🌐 Guest using the deployed website

1. Open the deployed website URL in a browser.
2. Browse rooms and hotel experiences.
3. Create an account or sign in.
4. Choose a room and stay dates, then submit the reservation.
5. Use the account area to review bookings; use the confirmation page/email for reservation details.

The website calls the deployed API for account, room, and reservation data. A browser-only copy of the HTML pages is not enough for those dynamic actions.

### 🛎️ Staff using the desktop application

1. Install/open the `Hotel Reservation` NetBeans project on a computer with Java and the MySQL Connector/J library.
2. Configure `config/db.properties` with the Aiven MySQL connection values and CA certificate path.
3. Run the staff application from NetBeans and sign in with an active staff account in the database.
4. Use the dashboard and management screens to review rooms/reservations and carry out front-desk tasks such as confirming arrivals and checking guests in or out.

The Swing app connects directly to MySQL, so it does not require the Node API to be running. The guest website's account, availability, and booking workflows do require the API and database.

### 🧑‍💻 Developer running the full project locally

1. Set up MySQL and apply the database scripts described below.
2. Configure `api/.env` and install API dependencies.
3. Start the API with `npm start` from `api/`.
4. From the repository root, serve the website locally, for example with `python -m http.server 5500 --directory web` (Windows: `py -m http.server 5500 --directory web`). Open `http://localhost:5500` in a browser. `web/js/main.js` selects `http://localhost:3000/api` for localhost; avoid opening the HTML directly as a `file://` URL for authenticated or API-backed flows.
5. Configure and run the NetBeans desktop project separately if you need the staff interface.

The API is required when running the complete website workflow. It is not required just to open static pages, and it is not a dependency of the Swing app's direct JDBC connection.

## Repository layout

```text
Hotel-Reservation-System/
├── api/                         # Express API, controllers, services, middleware
│   ├── config/db.js             # MySQL connection pool
│   ├── controllers/             # Auth, room, reservation handlers
│   ├── routes/apiRoutes.js      # /api route definitions
│   ├── services/                # Database and email workflows
│   ├── server.js                # API entry point
│   └── package.json
├── database/
│   ├── hotel_db.sql             # Main schema and booking procedure
│   ├── seed_data.sql            # Sample room inventory and records
│   └── auth_migration.sql       # Guest account tables and reservation link
├── docs/                        # Project style, validation, and team briefs
├── Hotel Reservation/           # NetBeans Java Swing project
│   ├── src/hotel/reservation/   # Swing screens and UI components
│   ├── src/hotel/database/      # JDBC connection and repository
│   ├── config/                  # Local database properties (not committed)
│   └── lib/                     # MySQL Connector/J dependency
├── web/                         # Guest website pages, CSS, JavaScript, images
└── README.md
```

## Technology

| Area | Technology |
| --- | --- |
| Guest website | HTML, CSS, JavaScript |
| REST API | Node.js, Express 5 |
| Database | MySQL, `mysql2` connection pool |
| Staff desktop application | Java Swing, JDBC, NetBeans project |
| Authentication | bcrypt password hashes and JWT |
| Email | Nodemailer; confirmation emails require SMTP environment settings |

## Database setup

1. Create or select a MySQL database server and make sure the account used by both clients can connect to it.
2. Run [`database/hotel_db.sql`](database/hotel_db.sql) against MySQL. It creates `hotel_reservation_system`, the staff `users`, `rooms`, `reservations`, and `audit_log` tables, indexes, and the `book_room` procedure.
3. If guest website accounts are required, run [`database/auth_migration.sql`](database/auth_migration.sql) against the same database. It creates `guest_users` and links guest accounts to reservations.
4. To load demonstration inventory, review [`database/seed_data.sql`](database/seed_data.sql) and run it against the database. Avoid rerunning seed inserts if duplicate sample records are not wanted.

Keep database passwords, JWT secrets, email credentials, and certificates out of source control. The SQL seed data is demonstration data, not production inventory.

## Run the API

Requirements: Node.js and npm.

1. Create `api/.env` locally. Configure these values for your MySQL instance:

   ```dotenv
   PORT=3000
   DB_HOST=your-mysql-host
   DB_PORT=3306
   DB_NAME=hotel_reservation_system
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_SSL_CERT_PATH=certs/ca.pem
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRES_IN=24h
   ```

   `DB_SSL_CERT_PATH` is optional when the default `api/certs/ca.pem` is used. For a local MySQL server without TLS, update `api/config/db.js` for that environment rather than committing database credentials or weakening a hosted database connection.

2. From the `api` directory, install dependencies and start the server:

   ```sh
   npm install
   npm start
   ```

3. Open `http://localhost:3000/`. A successful response says the API is running. The API also logs whether its MySQL connection succeeded.

For confirmation email delivery, configure `EMAIL_USER` and `EMAIL_APP_PASSWORD` in `api/.env`. If they are absent, the email service skips sending.

## Deployment: Render and Aiven

The public website is deployed so guests can open it in a browser. The Node.js API is deployed on Render at `https://hotel-reservation-system-720g.onrender.com`; the website's `web/js/main.js` points production requests to that API. The deployed API connects to the remote Aiven MySQL service rather than a database running on a developer's computer.

For a Render deployment, configure the API service to run `npm start` from the `api` directory and provide the database, JWT, and optional email settings as Render environment variables. Provide the Aiven CA certificate to the running service through a secure file/secret mechanism and set `DB_SSL_CERT_PATH` to its path. Do not put database credentials or certificates in the repository. If the website is deployed as a separate Render Static Site, its publish directory is `web`; redeploy it after changing the production API URL in `web/js/main.js`.

### Aiven connection security

- The API client supplies the Aiven CA certificate for its TLS connection. The Swing JDBC connection uses `sslMode=VERIFY_CA` and the configured Aiven CA certificate.
- Aiven documents TLS for connections and encryption at rest, including encrypted MySQL backups. These managed-service controls complement application safeguards such as hashed passwords, JWT authorization, and keeping credentials in deployment secrets; they do not replace them.
- Check the Aiven service's IP allowlist and database users in the Aiven Console. Aiven documents that the default IP filter permits all addresses (`0.0.0.0/0`), so do not assume inbound access is restricted unless you have changed and verified the allowlist. Allow the actual Render egress addresses or use a supported private networking setup where available.
- Aiven MySQL can accept unencrypted connections unless TLS is required for the database user. The deployed API and Swing clients are configured for TLS, but the service-side `REQUIRE SSL` setting should also be reviewed if you need the server to reject non-TLS clients.
- Backups, encryption, IP filtering, and certificate rotation are service/platform features. Review the actual Aiven service plan and settings; this README does not claim that every optional control is enabled for this project.

See Aiven's documentation for [TLS certificates](https://aiven.io/docs/platform/concepts/tls-ssl-certificates), [cloud security](https://aiven.io/docs/platform/concepts/cloud-security), [MySQL backups](https://aiven.io/docs/products/mysql/concepts/mysql-backups), and [restricting network access](https://aiven.io/docs/platform/howto/restrict-access).

## API routes

The API mounts its routes under `/api`.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Public | Create a guest account |
| `POST` | `/api/auth/login` | Public | Sign in and receive an auth token |
| `POST` | `/api/auth/logout` | Public | Sign-out endpoint |
| `POST` | `/api/auth/forgot-password` | Public | Start account recovery |
| `GET` | `/api/auth/me` | JWT required | Read the signed-in guest account |
| `GET` | `/api/rooms` | Public | Read room inventory and availability data |
| `POST` | `/api/reservations` | JWT required | Create a reservation |
| `GET` | `/api/reservations/my-bookings` | JWT required | List the signed-in guest's reservations |
| `GET` | `/api/reservations/:id` | Optional auth | Read a reservation using the supported ownership/access checks |
| `POST` | `/api/reservations/:id/resend-email` | Route-specific | Resend a reservation confirmation email |

Availability is calculated from database room and reservation data when the API is queried. This is request/response behavior, not a push-based live update stream.

## Run the Java Swing application

1. Open the `Hotel Reservation` directory as a NetBeans project.
2. Copy `Hotel Reservation/config/db.properties.example` to `Hotel Reservation/config/db.properties`.
3. Set `db.host`, `db.port`, `db.name`, `db.user`, and `db.password` to the same MySQL database used by the API. Place the database CA certificate at the configured `db.ssl.ca.path` when TLS is required.
4. Confirm the MySQL Connector/J library listed in the NetBeans project is available under `Hotel Reservation/lib`.
5. Build and run the project from NetBeans. The current NetBeans configuration names `hotel.reservation.Payments` as its main class; use the project configuration if launching a different screen during development.

Do not commit `db.properties`, private NetBeans configuration files, or database certificates.

## Booking and account notes

- Staff accounts are stored in `users`; guest website accounts are stored separately in `guest_users`.
- Passwords are stored as bcrypt hashes.
- Reservation statuses include `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, and `CANCELLED`.
- Room operational statuses include `AVAILABLE`, `OCCUPIED`, and `MAINTENANCE`.
- `book_room` is the database booking procedure intended to protect against overlapping confirmed or checked-in bookings. The active application paths should be checked against the deployed database procedure before relying on it for production booking integrity.
- The payment form is a project/demo flow. A payment reference is simulated; no real payment gateway is configured.

## Website pages

The guest-facing pages are in `web/`, including the home page, room list, booking and confirmation pages, account pages, experiences, contact, FAQ, and login/signup flows. Shared browser logic and page behavior are in `web/js/`; global and page-specific styles are in `web/css/`; local imagery is in `web/images/`.

The 3D hotel environment is currently a separate Planner 5D concept project. It is not yet exported or integrated into the guest website, and its room layout is approximate because no verified hotel floor plan was provided.

## Development checks

- API package: `cd api && npm start`
- The `api/package.json` test script is currently a placeholder and does not run an automated test suite.
- Database schema and migration scripts should be applied to a development database before exercising booking or account flows.

## Project documents

- [`docs/style-guide.md`](docs/style-guide.md) — website design conventions
- [`docs/validation-spec.md`](docs/validation-spec.md) — form and input validation expectations
- [`security/Readme.md`](security/Readme.md) — security deliverable notes

## Team roles

| Team member(s) | Role | Main responsibilities |
| --- | --- | --- |
| Emmanuel | Technical lead, backend, and database | Owns the system architecture, MySQL schema, JDBC connection, and Node API integration. |
| Mission and Stacy | Web frontend and visual design | Build the guest website layouts, room listings, and shared page styling. |
| Blessing and Terrence | Web behavior and API integration | Implement booking and confirmation flows, browser-side validation, and API requests. |
| Vanessa and Thanyani | Java Swing front-desk application | Build staff-facing screens for the dashboard, rooms, reservations, and check-in/check-out workflows. |
| Themba and Grace | Security and database administration | Support staff authentication, database access setup, and security validation. |
