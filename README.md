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
* **Live Weather API Integration:** Embedded OpenWeather API widget provides real-time local weather forecasts directly within the guest booking workflow.
* **Role-Based Operational Security:** Strict separation of privileges distinguishing public web guests from authenticated front-desk staff and system administrators.
* **Zero-Latency Inventory Management:** Automated room status transitions (`Available` ➔ `Pending` ➔ `Occupied` ➔ `Cleaning`) to prevent overbooking[cite: 8, 9].

---

## 🛠 3. Tech Stack

| Domain | Technology / Tool | Usage & Purpose |
| :--- | :--- | :--- |
| **Frontend Web** | HTML5, CSS3, JavaScript (ES6+) | Public guest portal, live weather widget, and reservation forms[cite: 8, 9]. |
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
│   │   └── style.css           # Global layout & component styling
│   ├── js/
│   │   ├── main.js             # Common navigation logic
│   │   ├── weather.js          # Open-Meteo API fetch logic[cite: 7, 8]
│   │   └── booking.js          # Reservation validation & API dispatch[cite: 7, 8]
│   ├── assets/                 # Images, room media & icons
│   ├── index.html              # Home landing page[cite: 8, 9]
│   ├── rooms.html              # Room catalog grid[cite: 8, 9]
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
