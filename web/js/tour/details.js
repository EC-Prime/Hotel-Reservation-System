import * as THREE from 'three';
import { MAT, TEX, std, textured } from './materials.js';
import {
  bbox, rbox, cyl, sphere, planeV, textPlane, addArt, addBooks,
  addWallSconce, addPlant, addFlowers
} from './kit.js';
import { LEVELS, ROOM_H, ROOM_LAYOUT, PALETTES, roomDoor } from './data.js';

/* ------------------------------------------------------------------ */
/* Shared materials for the detailing pass                             */
/* ------------------------------------------------------------------ */

const BRONZE = std('#6d5438', 0.32, 0.85, { envMapIntensity: 1.2 });
const ROBE = textured(TEX.boucle, '#f2eadc', 0.98);
const BLANKET = std('#8c7a63', 0.95);
const CLOCK_FACE = std('#203235', 0.3, 0.1, { emissive: '#5fb6ad', emissiveIntensity: 0.8 });
const PAPER = std('#efe8d9', 0.95);
const DARK_GLASS = std('#3c2b25', 0.22, 0.05, { envMapIntensity: 0.9 });
const MENU = std('#262a27', 0.75, 0);
const STONE = textured(TEX.travertine, '#ddd5c7', 0.6);

const BOOK_PAL = {
  accent: '#6e7450', textile: '#a45f42',
  woodDark: '#4e3a29', accentSoft: '#a5a887', key: 'detail'
};

/* ------------------------------------------------------------------ */
/* Small reusable props                                                */
/* ------------------------------------------------------------------ */

function pictureLight(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, 0.52, 0.032, 0.055, MAT.agedBrass, 0, -0.016, 0, 0, false);
  bbox(g, 0.43, 0.012, 0.038, MAT.ledStrip, 0, -0.022, 0.048, 0, false);
  return g;
}

function tissueBox(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  rbox(g, 0.20, 0.11, 0.13, 0.02, PAPER, 0, 0, 0, 0, false);
  bbox(g, 0.15, 0.008, 0.035, MAT.whiteLinen, 0, 0.111, 0, 0, false);
  return g;
}

function clock(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  rbox(g, 0.19, 0.075, 0.07, 0.014, MAT.blackGloss, 0, 0, 0, 0, false);
  planeV(g, 0.14, 0.048, CLOCK_FACE, 0, 0.038, 0.037, 0);
  return g;
}

function laundryTote(parent, x, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  rbox(g, 0.30, 0.40, 0.22, 0.03, std('#9b8a70', 0.95), 0, 0.02, 0, 0, false);
  for (const sx of [-0.10, 0.10]) {
    bbox(g, 0.02, 0.17, 0.02, BRONZE, sx, 0.41, 0, 0, false);
  }
  bbox(g, 0.22, 0.018, 0.02, BRONZE, 0, 0.57, 0, 0, false);
  return g;
}

function hangingRobe(parent, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  parent.add(g);
  bbox(g, 0.09, 0.03, 0.09, MAT.agedBrass, 0, 1.86, 0, 0, false);
  rbox(g, 0.07, 0.62, 0.42, 0.025, ROBE, 0, 1.20, 0, Math.PI / 2, false);
  bbox(g, 0.06, 0.02, 0.42, BRONZE, 0.08, 1.38, 0, 0, false);
  return g;
}

function windowDetail(parent, w, d) {
  const z = d / 2 - 0.10;
  bbox(parent, w - 0.72, 0.055, 0.26, BRONZE, 0, 0.90, z, 0, false);
  for (const mx of [-w * 0.22, w * 0.22]) {
    bbox(parent, 0.045, 1.66, 0.05, BRONZE, mx, 0.96, z + 0.02, 0, false);
  }
  bbox(parent, w - 0.80, 0.045, 0.05, BRONZE, 0, 2.60, z + 0.02, 0, false);
  addBooks(parent, -w * 0.22 + 0.22, 0.96, z, 0, 2, BOOK_PAL);
  cyl(parent, 0.035, 0.04, 0.09, MAT.ceramic, w * 0.22 - 0.18, 0.96, z, 12);
}

function ceilingDownlights(parent, w, d, y) {
  for (const sx of [-0.28, 0.28]) {
    for (const sz of [-0.27, 0.27]) {
      const px = sx * w, pz = sz * d;
      cyl(parent, 0.078, 0.078, 0.008, BRONZE, px, y - 0.045, pz, 14);
      cyl(parent, 0.052, 0.052, 0.012, MAT.warmBulb, px, y - 0.042, pz, 12);
    }
  }
}

function votive(parent, x, y, z) {
  cyl(parent, 0.045, 0.035, 0.075, MAT.glass, x, y, z, 12);
  cyl(parent, 0.014, 0.018, 0.045, MAT.warmBulb, x, y + 0.055, z, 8);
}

function wineBottle(parent, x, y, z) {
  cyl(parent, 0.045, 0.052, 0.24, DARK_GLASS, x, y, z, 12);
  cyl(parent, 0.018, 0.026, 0.09, DARK_GLASS, x, y + 0.24, z, 10);
  cyl(parent, 0.019, 0.019, 0.025, MAT.brass, x, y + 0.325, z, 10);
}

function foldedBlanket(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  rbox(g, 0.52, 0.10, 0.42, 0.03, BLANKET, 0, 0, 0, 0, false);
  bbox(g, 0.54, 0.014, 0.05, std('#b9a88f', 0.95), 0, 0.085, 0, 0, false);
  return g;
}

function lantern(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  bbox(g, 0.20, 0.02, 0.20, MAT.agedBrass, 0, 0, 0, 0, false);
  for (const sx of [-0.08, 0.08]) for (const sz of [-0.08, 0.08]) {
    bbox(g, 0.012, 0.26, 0.012, MAT.agedBrass, sx, 0.02, sz, 0, false);
  }
  cyl(g, 0.04, 0.045, 0.10, MAT.warmBulb, 0, 0.04, 0, 10);
  bbox(g, 0.22, 0.02, 0.22, MAT.agedBrass, 0, 0.28, 0, 0, false);
  return g;
}

/* ------------------------------------------------------------------ */
/* Guest rooms                                                         */
/* ------------------------------------------------------------------ */

function roomDetails(roomObj) {
  const { group, room, palette } = roomObj;
  const w = room.x1 - room.x0;
  const d = room.z1 - room.z0;

  // Picture lights wash the existing art and mirror on the TV wall.
  pictureLight(group, -w / 2 + 0.22, 2.40, d / 2 - 1.75, Math.PI / 2);
  pictureLight(group, -w / 2 + 0.22, 2.40, -d / 2 + 1.30, Math.PI / 2);

  // Proper window joinery behind the curtains, with a ledge and small props.
  windowDetail(group, w, d);

  // Recessed downlights between the cove and the pendants.
  ceilingDownlights(group, w, d, ROOM_H);

  // Bathroom vanity amenity, a robe on the wall and a bedside clock.
  tissueBox(group, -w / 2 + 0.30, 0.86, -d / 2 + 0.46);
  const bathD = room.type === 'penthouse' ? 2.9 : room.type === 'single' ? 2.35 : room.type === 'deluxe' ? 2.55 : 2.7;
  hangingRobe(group, -w / 2 + 0.34, -d / 2 + 0.22 + bathD * 0.58);
  const nz = room.type === 'single' ? 1.12 : 1.28;
  clock(group, w / 2 - 0.22, 0.55, 0.72 - nz + 0.12, -Math.PI / 2);

  // Laundry tote tucked beside the luggage rack.
  const lx = (room.type === 'single' || room.type === 'deluxe') ? 2.95 : w / 2 - 2.85;
  laundryTote(group, lx, -d / 2 + 0.92);
}

/* ------------------------------------------------------------------ */
/* Corridors and landings                                              */
/* ------------------------------------------------------------------ */

function corridorDetails(app) {
  for (let f = 1; f <= 3; f++) {
    const y = LEVELS[f - 1].y;
    const g = app.floorGroups[f];
    const palette = PALETTES[ROOM_LAYOUT.find(r => r.floor === f)?.palette] || PALETTES[0];
    const z0 = -4.8, z1 = -0.82;

    if (f > 1) {
      // Sconces sit between the actual door openings, not at bay centres.
      for (const r of ROOM_LAYOUT.filter(r => r.floor === f)) {
        addWallSconce(g, roomDoor(r).x, y + 2.60, z1 - 0.16, Math.PI);
      }
      for (let x = -26.5; x < 28; x += 8.4) {
        addArt(g, 0.92, 1.12, x, y + 1.92, z0 + 0.15, 0, palette, (Math.round(x) + f) % 3);
      }
      for (const x of [-28.2, 28.2]) {
        textPlane(g, `LEVEL ${f}`, 1.45, 0.26, x, y + 2.42, z0 + 0.16, 0, {
          fg: '#ecd9a7', bg: 'rgba(10,13,19,.86)', border: 'rgba(197,168,105,.4)',
          font: '600 24px "Plus Jakarta Sans", sans-serif', letter: 4,
          width: 512, height: 100
        });
      }
      // Housekeeping / ice niche on the north wall between the consoles.
      for (const x of [-15.5, 15.5]) {
        bbox(g, 0.72, 0.055, 0.34, textured(TEX.walnut, '#6b4d36', 0.6), x, y + 0.92, z0 + 0.30);
        bbox(g, 0.05, 0.88, 0.05, MAT.agedBrass, x - 0.31, y + 0.03, z0 + 0.30);
        bbox(g, 0.05, 0.88, 0.05, MAT.agedBrass, x + 0.31, y + 0.03, z0 + 0.30);
        cyl(g, 0.13, 0.11, 0.20, MAT.chrome, x - 0.14, y + 0.98, z0 + 0.30, 14);
        cyl(g, 0.10, 0.06, 0.015, MAT.brass, x - 0.14, y + 1.19, z0 + 0.30, 14);
        rbox(g, 0.24, 0.14, 0.20, 0.02, MAT.towel, x + 0.16, y + 0.98, z0 + 0.30, 0, false);
        tidyNotice(g, x, y + 1.55, z0 + 0.16);
      }
    }
  }

  // Garden-wing corridor: sconces and small framed prints on both walls.
  const wing = app.floorGroups[1];
  for (let x = -30; x <= -12; x += 4) {
    addWallSconce(wing, x, 2.55, 12.16, 0);
    addWallSconce(wing, x + 2, 2.55, 14.24, Math.PI);
  }
  for (const x of [-28, -22, -16]) {
    addArt(wing, 0.78, 0.96, x, 1.90, 12.14, 0, PALETTES[0], 1);
    addArt(wing, 0.78, 0.96, x + 2, 1.90, 14.26, Math.PI, PALETTES[0], 2);
  }
  laundryTote(wing, -12.6, 13.2, Math.PI / 2);
  addPlant(wing, -30.2, 13.2, 0.8);
}

function tidyNotice(parent, x, y, z) {
  textPlane(parent, 'HOUSEKEEPING', 0.78, 0.15, x, y, z, 0, {
    fg: '#d8c79b', bg: 'rgba(10,13,19,.8)', border: 'rgba(197,168,105,.3)',
    font: '600 20px "Plus Jakarta Sans", sans-serif', letter: 3,
    width: 384, height: 80
  });
}

/* ------------------------------------------------------------------ */
/* Public rooms                                                        */
/* ------------------------------------------------------------------ */

function lobbyDetails(app) {
  const g = app.floorGroups[1];

  // Brass directory beside reception.
  const dir = new THREE.Group();
  dir.position.set(6.66, 2.05, -12.9);
  dir.rotation.y = -Math.PI / 2;
  g.add(dir);
  bbox(dir, 1.28, 1.10, 0.05, MAT.agedBrass, 0, -0.55, 0, 0, false);
  const lines = ['01  LOBBY', '02  GALLERY', '03  SUNSET DECK'];
  lines.forEach((t, i) => textPlane(dir, t, 1.08, 0.20, 0, 0.28 - i * 0.28, 0.032, 0, {
    fg: '#f0dfb2', bg: 'transparent', border: null,
    font: '600 22px "Plus Jakarta Sans", sans-serif', letter: 2,
    width: 512, height: 80
  }));

  // Grandfather clock near the garden doors.
  const c = new THREE.Group();
  c.position.set(5.25, 0, -15.4);
  g.add(c);
  bbox(c, 0.52, 0.10, 0.52, BRONZE, 0, 0, 0, 0, false);
  bbox(c, 0.34, 1.62, 0.30, textured(TEX.walnut, '#5e432e', 0.6), 0, 0.10, 0, 0, false);
  cyl(c, 0.15, 0.15, 0.03, MAT.agedBrass, 0, 1.60, 0, 20);
  cyl(c, 0.125, 0.125, 0.012, PAPER, 0, 1.635, 0, 20);
  bbox(c, 0.012, 0.10, 0.008, MAT.blackGloss, 0, 1.68, 0.01, 0, false);
  bbox(c, 0.07, 0.009, 0.008, MAT.blackGloss, 0.03, 1.645, 0.01, 0, false);

  // A folded newspaper and votive on the side table, plus coasters by the chairs.
  bbox(g, 0.34, 0.012, 0.26, PAPER, 0.02, 0.51, -15.1, 0.24, false);
  bbox(g, 0.31, 0.010, 0.24, std('#d9d2c2', 0.95), 0.04, 0.522, -15.08, 0.18, false);
  votive(g, 0.18, 0.51, -15.26);
  for (const [x, z] of [[-1.2, -14.4], [-1.2, -11.9], [-1.2, -5.4]]) {
    cyl(g, 0.055, 0.055, 0.012, BRONZE, x + 0.14, 0.49, z + 0.12, 12);
  }

  // Umbrella stand and a pair of tall plants by the entrance.
  const u = new THREE.Group();
  u.position.set(4.9, 0, -16.8);
  g.add(u);
  cyl(u, 0.19, 0.16, 0.52, MAT.agedBrass, 0, 0, 0, 16);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.25;
    cyl(u, 0.012, 0.012, 0.72, std(i % 2 ? '#2f3336' : '#5b4b3b', 0.8), Math.cos(a) * 0.06, 0.42, Math.sin(a) * 0.06, 6);
  }
  addPlant(g, 6.2, -15.8, 1.25);
  addPlant(g, -6.4, -6.6, 1.15);
}

function restaurantDetails(app) {
  const g = app.floorGroups[1];
  const tables = [
    [12.4, -14.2], [16.2, -14.2], [20.2, -11.0], [24.1, -11.0],
    [12.5, -9.2], [16.4, -8.5], [20.0, -5.2], [12.8, -3.6], [17.0, -2.4], [22.4, -1.0]
  ];
  tables.forEach(([x, z], i) => {
    votive(g, x + 0.16, 0.79, z + 0.16);
    if (i % 3 === 0) wineBottle(g, x - 0.18, 0.79, z - 0.18);
    bbox(g, 0.22, 0.012, 0.16, MENU, x, 0.79, z - 0.36, 0.3, false);
  });

  // Brass footrail, clean glassware and a chalkboard on the host stand.
  cyl(g, 0.032, 0.032, 7.6, MAT.brass, 26.85, 0.16, -8.2, 10, Math.PI / 2);
  for (const z of [-11.6, -8.2, -4.8]) {
    cyl(g, 0.026, 0.026, 0.16, MAT.brass, 26.85, 0.03, z, 8);
  }
  for (let z = -11.4; z <= -4.8; z += 0.95) {
    cyl(g, 0.035, 0.03, 0.12, MAT.glass, 27.45, 1.16, z, 10);
  }
  bbox(g, 0.06, 0.86, 1.05, MAT.agedBrass, 10.55, 1.15, -3.2, 0, false);
  textPlane(g, 'TODAY', 0.72, 0.14, 10.51, 1.86, -3.2, 0, {
    fg: '#efe3c6', bg: 'transparent', border: null,
    font: '600 22px "Playfair Display", serif', letter: 3,
    width: 384, height: 80
  });
}

function loungeDetails(app) {
  const g = app.floorGroups[1];

  // Fireplace tools beside the hearth.
  const tools = new THREE.Group();
  tools.position.set(-27.9, 0, -9.4);
  g.add(tools);
  cyl(tools, 0.13, 0.15, 0.06, BRONZE, 0, 0, 0, 14);
  for (let i = 0; i < 3; i++) {
    cyl(tools, 0.012, 0.012, 0.72, MAT.brass, -0.07 + i * 0.07, 0.05, 0, 6);
  }
  bbox(tools, 0.20, 0.02, 0.02, MAT.brass, 0, 0.77, 0, 0, false);

  // Throws on the sofas, a book on the side table and a decanter at the bar.
  foldedBlanket(g, -16.5, 0.68, -8.4);
  foldedBlanket(g, -22.4, 0.68, -8.4, Math.PI);
  addBooks(g, -23.4, 0.52, -11.5, 0.2, 3, BOOK_PAL);
  wineBottle(g, -20.95, 1.08, 2.9);
  votive(g, -24.4, 1.08, 2.9);
}

function poolDetails(app) {
  const g = app.floorGroups[1];

  // Folded towels on every other lounger.
  for (let i = 0; i < 7; i += 2) {
    foldedBlanket(g, -6 + i * 3.25, 0.50, 16.08, Math.PI);
  }
  for (let i = 0; i < 3; i++) {
    const cz = 7.2 + i * 3.1;
    votive(g, 16.2, 0.59, cz + 0.65);
    rbox(g, 0.34, 0.16, 0.28, 0.03, MAT.towel, 14.0, 0.50, cz + 0.45, 0, false);
  }
  // A second glass and napkin on each poolside table.
  for (let i = 0; i < 4; i++) {
    const x = -3.8 + i * 4;
    cyl(g, 0.035, 0.035, 0.11, MAT.glass, x - 0.11, 0.60, 14.32, 10);
    bbox(g, 0.18, 0.008, 0.14, PAPER, x + 0.04, 0.601, 14.18, 0.1, false);
  }
}

function spaDetails(app) {
  const g = app.floorGroups[1];

  // Reception amenities.
  cyl(g, 0.16, 0.13, 0.09, STONE, 19.3, 1.08, 14.1, 16);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.3;
    sphere(g, 0.05, std('#b8ae9b', 0.9), 19.3 + Math.cos(a) * 0.07, 1.18, 14.1 + Math.sin(a) * 0.07, 7);
  }
  rbox(g, 0.22, 0.13, 0.16, 0.02, MAT.towel, 19.3, 1.08, 15.15, 0, false);

  // Candles on low brass tables and folded blankets through the lounge.
  for (const x of [21.3, 23.1, 24.9]) {
    cyl(g, 0.035, 0.04, 0.82, MAT.agedBrass, x, 0.02, 10.6, 10);
    cyl(g, 0.22, 0.20, 0.04, MAT.agedBrass, x, 0.84, 10.6, 16);
    votive(g, x, 0.88, 10.6);
  }
  for (let i = 0; i < 3; i++) foldedBlanket(g, 21.8 + i * 1.75, 0.66, 9.9, Math.PI / 2);

  // Treatment-room finishing touches.
  for (const [x0, z0] of [[19.0, 6.4], [24.2, 6.4]]) {
    const cx = x0 + 2.35, cz = z0 + 2.4;
    rbox(g, 0.42, 0.16, 0.28, 0.03, MAT.towel, cx - 0.55, 0.66, cz, 0, false);
    votive(g, cx + 0.62, 0.70, cz - 0.30);
    addFlowers(g, x0 + 0.55, 0.02, z0 + 1.2);
  }
}

function level2Details(app) {
  const g = app.floorGroups[2];
  const y = LEVELS[1].y;
  const pal = PALETTES[1];

  // A small art walk along the gallery wall.
  for (const [x, v] of [[12.5, 0], [16.5, 1], [24.0, 2]]) {
    addArt(g, 1.05, 1.28, x, y + 1.95, -18.08, 0, pal, v);
    pictureLight(g, x, y + 2.70, -17.96, 0);
  }
  // Coffee station crockery and a small plant on the counter.
  for (let x = 24.9; x <= 27.0; x += 0.55) {
    cyl(g, 0.038, 0.035, 0.07, MAT.ceramic, x, y + 1.08, -16.05, 10);
  }
  const plant = new THREE.Group();
  plant.position.set(0, y, 0);
  g.add(plant);
  addPlant(plant, 28.4, -16.0, 0.7);

  // Studio bench with towels and water bottles.
  bbox(g, 1.0, 0.42, 0.52, textured(TEX.teak, '#b89264', 0.75), -18.6, y + 0.02, -6.2);
  rbox(g, 0.44, 0.20, 0.30, 0.03, MAT.towel, -18.8, y + 0.44, -6.2, 0, false);
  for (const x of [-18.9, -18.3]) {
    cyl(g, 0.035, 0.04, 0.20, MAT.glass, x, y + 0.48, -6.2, 10);
  }
}

function level3Details(app) {
  const g = app.floorGroups[3];
  const y = LEVELS[2].y;

  // Blankets folded on every lounger, with a lantern between pairs.
  for (let i = 0; i < 4; i++) {
    const x = -9.0 + i * 2.4;
    foldedBlanket(g, x, y + 0.50, -6.2, Math.PI);
    if (i % 2 === 0) lantern(g, x + 1.2, y + 0.08, -7.0);
  }
  // Side table with sunset drinks beside the fire table.
  cyl(g, 0.30, 0.28, 0.05, MAT.agedBrass, 3.9, y + 0.55, -6.6, 18);
  cyl(g, 0.03, 0.04, 0.54, MAT.agedBrass, 3.9, y + 0.02, -6.6, 8);
  for (const dx of [-0.12, 0.12]) {
    cyl(g, 0.035, 0.035, 0.14, MAT.glass, 3.9 + dx, y + 0.60, -6.6, 10);
  }
  wineBottle(g, 3.9, y + 0.60, -6.9);
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export function addDetailPass(app) {
  for (const roomObj of Object.values(app.roomObjects)) roomDetails(roomObj);
  corridorDetails(app);
  lobbyDetails(app);
  loungeDetails(app);
  restaurantDetails(app);
  poolDetails(app);
  spaDetails(app);
  level2Details(app);
  level3Details(app);
  return app;
}
