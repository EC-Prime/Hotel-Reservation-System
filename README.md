# 🏨 Hotel Reservation System

> A hybrid hospitality management platform bridging an online guest booking portal with a real-time Java Swing administrative desktop application over a shared REST API and MySQL database.

---

## 📌 1. Project Vision & Executive Summary

Our **Hotel Reservation System** is a dual-interface platform designed to streamline guest bookings while giving front-desk staff real-time administrative control over hotel operations. 

* **The Vision:** Eliminate double-bookings, reduce manual front-desk errors, and provide a seamless end-to-end guest experience from initial web browsing to physical check-out.
* **Web Portal Focus:** Provides guests with an online reservation portal featuring instant availability checks, live local weather updates via Open-Meteo API, transparent room pricing, and automated booking confirmations.
* **Desktop App Focus:** Equips hotel receptionists with a Java Swing management tool to manage daily check-ins/check-outs, monitor room inventory statuses, and audit active bookings in real time.

---

## ⭐ 2. Unique Selling Points (USPs)

* **Hybrid Multi-Client Synchronization:** Dual-interface architecture where online web bookings update the front-desk Java Swing app instantly via a shared MySQL backend.
* **Live Weather API Integration:** Embedded Open-Meteo API widget provides real-time local weather forecasts directly within the guest booking workflow.
* **Role-Based Operational Security:** Strict separation of privileges distinguishing public web guests from authenticated front-desk staff and system administrators.
* **Zero-Latency Inventory Management:** Automated room status transitions (`Available` ➔ `Pending` ➔ `Occupied` ➔ `Cleaning`) to prevent overbooking[cite: 8, 9].
* **Immersive 3D Hotel Tour:** A self-contained WebGL walkthrough at `web/tour.html` lets guests explore the lobby, restaurant, bar, pool, spa, all three levels and all 20 furnished suites before booking.

---

## 🧭 2.1 Immersive 3D Tour

`web/tour.html` is a self-contained, explorable interpretation of Royal Haven Boutique & Spa. It follows the published three-level, 20-room layout and includes a porte-cochère and lobby, reception, bar, restaurant, pool courtyard, spa, level-2 gallery and fitness studio, and a level-3 Sunset Deck. Every guest room is furnished with a bed, rugs, wardrobe, bedside tables and lamps, seating, TV and an en-suite; larger suites add kitchenettes and private terraces.

**Controls**

| Action | Desktop | Touch / mobile |
| :--- | :--- | :--- |
| Look around | Drag the view | Drag the view |
| Walk | `W A S D` or arrow keys; `Shift` to hurry | On-screen joystick |
| Change level | `1` `2` `3`, floor dock, lift or stair | Floor dock, lift or stair |
| Aerial view | `V` or **Aerial** | **Aerial** button |
| Open a room or space | Click a door, number or brass marker | Tap a door, number or marker |
| Close a panel | `Esc` | Close button |

**Deep links**

- `tour.html?room=203` — open a specific suite
- `tour.html?service=spa` — open a hotel space
- `tour.html?floor=2` — arrive on a chosen level
- `tour.html?service=lift` / `tour.html?service=stairs` — jump to vertical circulation

**Preview locally**

The tour uses ES modules and an import map, so it must be served over HTTP (opening `tour.html` via `file://` will not work). A zero-dependency static server is included:

```bash
node web/serve.mjs
# → http://localhost:4173/tour.html
```

Set `PORT=8080` to use a different port. Any other static host for `web/` works too.

**Deploy to Render**

The frontend, including the 3D tour, is a static site — no server process is needed on Render. A `render.yaml` Blueprint is included:

1. Commit and push your changes first. Render deploys from Git, not from your local folder.
2. In Render, choose **New → Blueprint** and select this repository. It creates a static site called `royal-haven-web` with `web/` as the publish directory and no build step.
3. Or create a **Static Site** manually with: **Root Directory** `.`, **Build Command** empty, **Publish Directory** `web`.

Do **not** set the start command to `node web/serve.mjs` — that server exists only for local preview. Render's CDN serves the files directly with correct MIME types, so ES modules and import maps work as-is.

The 3D tour makes **no backend calls at all**. It loads only the static `js/rooms-data.js` array and the vendored Three.js modules, so deploying `web/` by itself is enough — no API Web Service, environment variables or database needed for the tour.

The booking/auth pages are a separate concern. `web/js/main.js` points them at `https://hotel-reservation-system-720g.onrender.com/api` for non-local hosts, so if you host those pages they will use your existing API. A "Book this room" link in a tour panel simply navigates to `booking.html`; the tour itself never contacts the API.

If you also need to deploy the API from scratch, create a **Web Service** with root directory `api`, build command `npm install`, start command `npm start`, and environment variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `EMAIL_USER` and `EMAIL_APP_PASSWORD`. Note that `api/certs/ca.pem` is gitignored, so a fresh deploy will not contain the Aiven CA certificate — either force-add it or change `api/config/db.js` to read it from an environment variable.

**Implementation notes**

- Three.js r160 and its addons are vendored in `web/vendor/three/`; there is no runtime CDN dependency.
- Geometry and textures are generated procedurally at runtime; photography comes from the existing `web/images/` library.
- Static meshes are batched by material to keep draw calls low. Walk collision uses floor zones plus furniture/stair colliders.
- Prices respect the shared `grand_reserve_currency` preference and each room panel links to the existing booking flow.
- The tour is a **conceptual visualisation** built from the published room list and photography. It is illustrative and not a survey of the built property.

---

## 🛠 3. Tech Stack

| Domain | Technology / Tool | Usage & Purpose |
| :--- | :--- | :--- |
| **Frontend Web** | HTML5, CSS3, JavaScript (ES6+) | Public guest portal, live weather widget, and reservation forms[cite: 8, 9]. |
| **3D Tour** | Three.js r160 (vendored), WebGL2, procedural textures | Immersive walkthrough of the hotel, rooms and services. |
| **Desktop App** | Java Swing (JDK 17+) | Admin desktop interface for front-desk operations & check-ins[cite: 8, 9]. |
| **Backend API** | Node.js / Express.js | Asynchronous REST API routing client requests to the database[cite: 7, 8]. |
| **Database** | MySQL (XAMPP Server / Workbench) | Relational database hosting room, user, and reservation tables. |
| **External APIs** | Open-Meteo REST API | Live weather data integration for the web booking portal. |
| **IDE & Tooling** | VS Code, Git, Postman | Primary development workspace, version control, and API testing. |

---

## 🏗 4. System Architecture

```text
[ PUBLIC WEB PORTAL ]             [ API / BACKEND LAYER ]              [ DATA STORAGE LAYER ]
  • Web Portal (HTML5/CSS3)  ──Fetch──>  Emmanuel's REST API Router  ──JDBC──>  MySQL Database Server
  • Desktop App (Java Swing) ──JDBC───>   (ApiController.js / Express)             (XAMPP / Workbench)
hotel-reservation-system/
├── database/                   # Database Schemas & Seed Data (Emmanuel, Grace, Themba)
│   ├── hotel_db.sql            # Relational database schema & tables
│   └── seed_data.sql           # Initial test records (rooms, admin accounts)
│
├── web/                        # Public Guest Web Portal (Mission, Stacy, Blessing, Terrence, Khethokuhle)
│   ├── css/
│   │   ├── style.css           # Global design system & shared components
│   │   ├── home.css            # Landing-page styling
│   │   └── tour.css            # Immersive 3D tour overlays & responsive UI
│   ├── js/
│   │   ├── main.js             # Common navigation logic
│   │   ├── weather.js          # Open-Meteo API fetch logic[cite: 7, 8]
│   │   ├── booking.js          # Reservation validation & API dispatch[cite: 7, 8]
│   │   ├── rooms-data.js       # Canonical room list, prices, photos & amenities
│   │   └── tour/               # Three.js tour modules (data, geometry, detail pass, controls, UI)
│   ├── vendor/three/           # Locally vendored Three.js r160 + addons
│   ├── images/                 # Room, experience and service photography
│   ├── index.html              # Home landing page[cite: 8, 9]
│   ├── serve.mjs               # Zero-dependency static server for local preview
│   ├── rooms.html              # Room catalog grid[cite: 8, 9]
│   ├── tour.html               # Immersive 3D walkthrough
│   ├── booking.html            # Reservation portal with weather widget
│   ├── faq.html                # FAQ & guest policies page
│   └── confirmation.html       # Success receipt & booking summary[cite: 8, 9]
│
├── api/                        # Backend REST API Service (Emmanuel)
│   ├── config/
│   │   └── db.js               # MySQL database connection pool[cite: 7]
│   ├── controllers/
│   │   └── reservationController.js # Handles booking & room status endpoints[cite: 7]
│   ├── routes/
│   │   └── apiRoutes.js        # API endpoint definitions (/api/reservations)[cite: 7]
│   ├── server.js               # Express application entry point[cite: 7]
│   └── package.json            # Node.js dependencies
│
├── swing/                      # Java Desktop Application (Vanessa, Thanyani, Themba, Grace)
│   ├── src/
│   │   ├── config/
│   │   │   └── DatabaseConnection.java # Shared JDBC connection driver[cite: 4, 7]
│   │   ├── models/
│   │   │   ├── Room.java       # Room data model
│   │   │   └── Reservation.java# Reservation data model
│   │   └── views/
│   │       ├── AdminLoginView.java       # Receptionist login window[cite: 8, 9]
│   │       ├── AdminDashboardView.java   # Operations dashboard UI
│   │       ├── RoomManagementView.java   # Room inventory grid[cite: 8, 9]
│   │       ├── ReservationListView.java  # Booking ledger JTable UI[cite: 8, 9]
│   │       └── UserManagementView.java   # Admin & security setup[cite: 8, 9]
│   └── lib/                    # MySQL Connector JAR files (.jar)
│
├── .gitignore                  # Git rules for build outputs & node_modules
└── README.md                   # Full system documentation & setup guide
```

## 👥5. Team Roles & Deliverables Matrix
```text
This document outlines the assigned roles, primary technical responsibilities, and key deliverable files for all members of Group 1 (Topic 8: Hotel Reservation System).

---

## 🛠 Tech Lead & Core Backend
* **Emmanuel** — *Technical Lead & Backend/Database Developer*
  * **Responsibilities:** Designs core database architecture, manages shared MySQL database, creates JDBC connection handlers, and builds backend REST API integration routes.
  * **Deliverable Files:**
    * `database/hotel_db.sql`
    * `swing/src/config/DatabaseConnection.java`
    * `api/controllers/reservationController.js`
    * `api/server.js`

---

## 🌐 Public Web Portal Sub-Team

* **Mission & Stacy** — *Web Frontend Developers (Design & Structure)*
  * **Responsibilities:** Design and build visual layouts, CSS styling, room preview grids, hero banners, and static landing components for guest-facing pages.
  * **Deliverable Files:**
    * `web/index.html`
    * `web/rooms.html`
    * `web/css/style.css`

* **Blessing & Terrence** — *Web JavaScript & API Developers (Logic & Fetch)*
  * **Responsibilities:** Implement client-side form logic, write asynchronous JavaScript `fetch()` calls to route data to the Node.js API, and integrate live weather updates via Open-Meteo API.
  * **Deliverable Files:**
    * `web/booking.html`
    * `web/confirmation.html`
    * `web/js/weather.js`
    * `web/js/booking.js`

* **Khethokuhle** — *Static Content & Quality Assurance Developer*
  * **Responsibilities:** Build guest policy sections, construct FAQ page structures, ensure site navigation links work seamlessly, and assist with web portal QA testing.
  * **Deliverable Files:**
    * `web/faq.html`
    * `web/js/main.js`

---

## 🖥 Front-Desk Desktop Application Sub-Team

* **Vanessa & Thanyani** — *Java Swing Desktop Developers (GUI & Operations)*
  * **Responsibilities:** Develop desktop GUI views for receptionists, construct `JTable` components to render live room inventory and reservations, and wire up check-in/check-out operational actions.
  * **Deliverable Files:**
    * `swing/src/views/AdminDashboardView.java`
    * `swing/src/views/RoomManagementView.java`
    * `swing/src/views/ReservationListView.java`
    * `swing/src/models/Room.java`
    * `swing/src/models/Reservation.java`

* **Themba & Grace** — *Security & Database Administration*
  * **Responsibilities:** Design front-desk authentication interfaces, manage MySQL database user access roles visually via XAMPP / MySQL Workbench, and conduct validation/security testing across system login forms.
  * **Deliverable Files:**
    * `swing/src/views/AdminLoginView.java`
    * `swing/src/views/UserManagementView.java`
    * `database/seed_data.sql`
