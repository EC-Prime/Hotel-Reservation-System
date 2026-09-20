// api/server.js
//
// This is the entry point — the file you actually run with "node server.js".
// Its job: start a small web server, and load db.js so the connection test
// in db.js fires and tells you whether Aiven is reachable.

const express = require('express');
const pool = require('./config/db');   // just requiring this file runs testConnection()

const app = express();
app.use(express.json()); // lets the server read JSON request bodies later

const PORT = process.env.PORT || 3000;

// A simple "is it alive" route — visit http://localhost:3000 in a browser
// once the server is running, to confirm it's actually up.
app.get('/', (req, res) => {
  res.send('Hotel Reservation System API is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 API server listening on http://localhost:${PORT}`);
});
