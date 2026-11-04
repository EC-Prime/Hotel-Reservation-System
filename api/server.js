// api/server.js
//
// This is the entry point — the file you actually run with "node server.js".
// Its job: start a small web server, and load db.js so the connection test
// in db.js fires and tells you whether Aiven is reachable.


require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');   // requiring this file runs testConnection()
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // lets the server read JSON request bodies

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hotel Reservation System API is running.');
});

// Every route in apiRoutes.js is now reachable under /api/...
// e.g. POST /api/reservations
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 API server listening on http://localhost:${PORT}`);
});
