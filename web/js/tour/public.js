import * as THREE from 'three';
import { MAT, TEX, std, textured, paletteRug, paletteArt } from './materials.js';
import {
  bbox, rbox, cyl, sphere, planeH, planeV, glow, textPlane, addArt, addMirror,
  addLamp, addWallSconce, addBooks, addPlant, addFlowers, addTray, addArmchair,
  addSofa, addCoffeeTable, addSideTable, addDesk, addTV, addRug, addPendant,
  bakeGroup, addBed
} from './kit.js';
import { LEVELS, ROOM_H, SPA, BUILDING } from './data.js';

function floorPlane(parent, x0, x1, z0, z1, y, mat) {
  return planeH(parent, x1 - x0, z1 - z0, mat, (x0 + x1) / 2, y, (z0 + z1) / 2);
}

function ceiling(parent, x0, x1, z0, z1, y, mat = std('#e9e2d5', 0.97)) {
  const p = planeH(parent, x1 - x0, z1 - z0, mat, (x0 + x1) / 2, y, (z0 + z1) / 2);
  p.rotation.x = Math.PI / 2;
  return p;
}

function serviceHotspot(app, parent, id, x, y, z, w = 1.4, h = 2.2, d = 1.4) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }));
  mesh.position.set(x, y + h / 2, z);
  mesh.userData.hotspot = { kind: 'service', id };
  mesh.userData.noBake = true;
  parent.add(mesh);
  app.interactives.push(mesh);
  // A small brass marker at eye height
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.016, 8, 24), MAT.agedBrass);
  ring.position.set(x, y + 1.45, z);
  parent.add(ring);
  sphere(parent, 0.032, MAT.warmBulb, x, y + 1.45, z, 8);
  glow(parent, x, y + 1.45, z, 0.38, '#ffd39a', 0.28);
  return mesh;
}

function sign(parent, text, x, y, z, ry, w = 1.2, h = 0.24) {
  textPlane(parent, text, w, h, x, y, z, ry, {
    fg: '#ecd9a7', bg: 'rgba(10,13,19,.86)', border: 'rgba(197,168,105,.4)',
    font: '600 25px "Plus Jakarta Sans", sans-serif', letter: 4, width: 512, height: 100
  });
}

function warmLight(parent, x, y, z, intensity = 26, distance = 11, color = 0xffd39a) {
  const l = new THREE.PointLight(color, intensity, distance, 2);
  l.position.set(x, y, z);
  parent.add(l);
  return l;
}

function diningChair(parent, x, z, ry, palette) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  rbox(g, 0.46, 0.08, 0.44, 0.03, std(palette.textileSoft, 0.94), 0, 0.42, 0);
  rbox(g, 0.44, 0.46, 0.08, 0.03, std(palette.textileSoft, 0.94), 0, 0.48, -0.2);
  for (const dx of [-0.18, 0.18]) for (const dz of [-0.18, 0.18]) {
    bbox(g, 0.035, 0.42, 0.035, std('#6d5037', 0.8), dx, 0, dz);
  }
  return g;
}

function diningTable(parent, x, z, palette, seats = 4, w = 1.05) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  parent.add(g);
  cyl(g, w / 2, w / 2, 0.055, textured(TEX.oak, '#b18a62', 0.6), 0, 0.72, 0, 28);
  cyl(g, 0.06, 0.14, 0.70, MAT.agedBrass, 0, 0, 0, 10);
  bbox(g, 0.4, 0.02, 0.4, MAT.agedBrass, 0, 0.02, 0, 0, false);
  for (let i = 0; i < seats; i++) {
    const a = (i / seats) * Math.PI * 2 + Math.PI / 4;
    diningChair(g, Math.cos(a) * (w / 2 + 0.42), Math.sin(a) * (w / 2 + 0.42), -a + Math.PI / 2, palette);
  }
  // Place settings
  for (let i = 0; i < seats; i++) {
    const a = (i / seats) * Math.PI * 2 + Math.PI / 4;
    const px = Math.cos(a) * (w / 2 - 0.16), pz = Math.sin(a) * (w / 2 - 0.16);
    cyl(g, 0.06, 0.045, 0.14, MAT.glass, px, 0.78, pz, 10);
    bbox(g, 0.26, 0.012, 0.18, MAT.paper, Math.cos(a) * (w / 2 - 0.4), 0.79, Math.sin(a) * (w / 2 - 0.4), a + Math.PI / 2, false);
    cyl(g, 0.012, 0.012, 0.22, MAT.brass, px + 0.12, 0.79, pz, 6);
    sphere(g, 0.025, MAT.warmBulb, px + 0.12, 1.03, pz, 6);
  }
  addFlowers(g, 0, 0.78, 0);
  return g;
}

/* ------------------------------------------------------------------ */
/* Ground floor                                                        */
/* ------------------------------------------------------------------ */

export function buildGroundPublic(app) {
  const g = app.floorGroups[1];
  buildLobby(app, g);
  buildRestaurant(app, g);
  buildLounge(app, g);
  buildSpa(app, g);
}

function buildLobby(app, g) {
  const root = new THREE.Group();
  g.add(root);
  // Travertine floor and inlaid brass line
  floorPlane(root, -7, 7, -17.4, 5.4, 0.025, textured(TEX.travertine, '#d9d1c2', 0.55));
  bbox(root, 13.4, 0.012, 0.05, MAT.brass, 0, 0.037, -6.4, 0, false);
  bbox(root, 0.05, 0.012, 22.0, MAT.brass, 0, 0.037, -6, 0, false);
  // Reception desk
  const rx = 4.6, rz = -9.2;
  bbox(root, 1.1, 1.05, 3.5, textured(TEX.walnut, '#664a34', 0.55), rx, 0.02, rz);
  bbox(root, 1.22, 0.08, 3.62, textured(TEX.marble, '#e9e2d4', 0.32), rx, 1.07, rz, 0, false);
  bbox(root, 0.05, 0.85, 3.3, MAT.agedBrass, rx - 0.57, 0.12, rz, 0, false);
  // Desk front fluting
  for (let z = rz - 1.6; z <= rz + 1.6; z += 0.16) {
    bbox(root, 0.02, 0.9, 0.055, std('#523b28', 0.65), rx - 0.57, 0.12, z, 0, false);
  }
  // Back-of-house reception wall: key rack, pigeon holes, crest
  bbox(root, 0.18, 3.0, 4.3, textured(TEX.walnut, '#5d4331', 0.6), 6.85, 0.02, rz);
  for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) {
    bbox(root, 0.30, 0.26, 0.03, std('#3f2b1e', 0.8), 6.70, 1.40 + y * 0.34, rz - 1.4 + x * 0.9, 0, false);
    cyl(root, 0.020, 0.020, 0.10, MAT.brass, 6.67, 1.50 + y * 0.34, rz - 1.4 + x * 0.9, 8, Math.PI / 2);
  }
  // crest above desk
  const crest = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), std('#c9a869', 0.3, 0.7));
  crest.rotation.y = -Math.PI / 2;
  crest.position.set(6.72, 3.25, rz);
  root.add(crest);
  // monitor, bell, flowers, card terminal
  bbox(root, 0.52, 0.34, 0.06, MAT.blackGloss, rx + 0.05, 1.14, rz - 0.95, -0.1);
  bbox(root, 0.04, 0.28, 0.04, MAT.blackMetal, rx + 0.05, 1.10, rz - 0.95);
  cyl(root, 0.055, 0.06, 0.035, MAT.brass, rx - 0.1, 1.15, rz + 0.2, 16);
  cyl(root, 0.045, 0.05, 0.02, MAT.brass, rx - 0.1, 1.17, rz + 0.2, 16);
  addFlowers(root, rx - 0.08, 1.15, rz + 1.0);
  bbox(root, 0.16, 0.05, 0.22, MAT.blackGloss, rx - 0.25, 1.15, rz + 0.75, 0.2);
  bbox(root, 0.40, 0.03, 0.28, MAT.paper, rx - 0.1, 1.15, rz + 1.4, -0.1, false);
  addBooks(root, rx - 0.1, 1.15, rz - 1.3, 0.2, 2, { accent: '#6e7450', textile: '#a45f42', woodDark: '#4e3a29', accentSoft: '#a5a887' });
  // Desk chairs
  for (const z of [rz - 0.8, rz + 0.8]) {
    diningChair(root, rx + 0.75, z, -Math.PI / 2, { textileSoft: '#7c6757' });
  }
  // Reception sign
  sign(root, 'RECEPTION', 6.68, 2.95, rz + 2.35, -Math.PI / 2, 1.35, 0.27);
  serviceHotspot(app, root, 'reception', rx - 0.8, 0.0, rz, 1.3, 2.3, 3.5);

  // Lobby seating clusters
  const seatPal = { textile: '#7c6757', accent: '#6e7450', textileSoft: '#b49b87', accentSoft: '#a5a887' };
  addRug(root, -2.6, -13.2, 5.8, 4.2, { rug: '#c7b28f', accent: '#6e7450', textile: '#a45f42', ...seatPal }, 0);
  addSofa(root, -4.3, -13.2, 2.7, Math.PI / 2, seatPal, 0.95);
  addArmchair(root, -1.2, -14.4, Math.PI * 0.15, seatPal, 1.05);
  addArmchair(root, -1.2, -11.9, -Math.PI * 0.15, seatPal, 1.05);
  addCoffeeTable(root, -2.4, -13.2, 1.3, 0.8, seatPal);
  addSideTable(root, 0.0, -15.1, seatPal);
  addLamp(root, -5.6, 1.15, -15.0, 1.2);
  addPlant(root, -6.1, -16.2, 1.35);
  addPlant(root, -6.1, -9.8, 1.2);

  // Second seating group under the stair / by the garden doors
  addRug(root, -2.0, -4.4, 5.0, 3.2, { rug: '#b7ab90', accent: '#6e7450', textile: '#a45f42', ...seatPal }, 1);
  addSofa(root, -4.2, -4.4, 2.5, Math.PI / 2, seatPal, 0.9);
  addArmchair(root, -1.2, -5.4, Math.PI * 0.1, seatPal, 1.0);
  addCoffeeTable(root, -2.3, -4.4, 1.2, 0.7, seatPal);
  addPlant(root, 6.1, -1.0, 1.2);

  // Central round table and enormous arrangement
  cyl(root, 0.95, 0.95, 0.06, textured(TEX.marble, '#e5ded0', 0.3), 0.1, 0.75, -13.2, 36);
  cyl(root, 0.12, 0.20, 0.74, MAT.agedBrass, 0.1, 0, -13.2, 12);
  const arr = new THREE.Group();
  arr.position.set(0.1, 0.8, -13.2);
  root.add(arr);
  cyl(arr, 0.26, 0.20, 0.42, MAT.ceramic, 0, 0, 0, 18);
  for (let i = 0; i < 18; i++) {
    const a = i * 0.7, r = 0.15 + Math.random() * 0.45;
    const stem = cyl(arr, 0.006, 0.006, 0.7 + Math.random() * 0.5, std('#5b6b4a', 0.9), Math.cos(a) * 0.08, 0.35, Math.sin(a) * 0.08, 5);
    stem.rotation.z = Math.cos(a) * 0.25;
    sphere(arr, 0.045 + Math.random() * 0.03, std(i % 3 === 0 ? '#d8c7a5' : i % 3 === 1 ? '#8e9b7b' : '#bb8a68', 0.9), Math.cos(a) * r, 1.05 + Math.random() * 0.35, Math.sin(a) * r, 7);
  }
  addLamp(root, 1.4, 0.8, -13.2, 0.9);

  // Luggage trolley and doormat
  const trolley = new THREE.Group();
  trolley.position.set(1.6, 0, -16.2);
  root.add(trolley);
  bbox(trolley, 1.0, 0.08, 0.55, MAT.brass, 0, 0.28, 0);
  for (const x of [-0.42, 0.42]) for (const z of [-0.2, 0.2]) {
    cyl(trolley, 0.025, 0.025, 1.4, MAT.brass, x, 0.05, z, 8);
  }
  bbox(trolley, 1.0, 0.06, 0.55, MAT.brass, 0, 1.38, 0);
  bbox(trolley, 0.48, 0.65, 0.30, std('#5b4b3b', 0.8), 0, 0.35, 0);
  bbox(trolley, 0.30, 0.02, 0.02, MAT.brass, 0, 0.70, 0.18, 0, false);
  planeH(root, 3.0, 1.1, std('#4d463b', 0.98), 0, 0.03, -17.15);
  // concierge pigeon-hole console on the west side
  bbox(root, 1.35, 1.05, 0.42, textured(TEX.walnut, '#5f4430', 0.6), -5.9, 0.02, -2.4, Math.PI / 2);
  addFlowers(root, -5.9, 1.08, -2.4);
  addPlant(root, 5.9, -4.2, 1.2);
  sign(root, 'CONCIERGE', 6.6, 2.4, -13.4, -Math.PI / 2, 1.0, 0.22);
  warmLight(root, 0, 5.3, -11.8, 55, 18, 0xffd6a3);
  warmLight(root, 4.2, 2.6, -8.5, 18, 8);
  warmLight(root, -3.0, 2.4, -12.7, 16, 8);
  bakeGroup(root);
}

function buildRestaurant(app, g) {
  const root = new THREE.Group();
  g.add(root);
  const pal = { textile: '#8a6c53', accent: '#5f6b58', textileSoft: '#c0a88e', accentSoft: '#abb39a', wood: '#7b5b3f', woodDark: '#4e3a29', stone: '#d8cfc0' };
  floorPlane(root, 9.8, 29.2, -17.4, 4.2, 0.025, textured(TEX.oak, '#a67f58', 0.68));
  // Herringbone suggestion: brass inlay
  bbox(root, 18.8, 0.012, 0.04, MAT.brass, 19.5, 0.038, -15.8, 0, false);
  ceiling(root, 9.8, 29.2, -17.4, 4.2, 3.28, std('#e6ded0', 0.96));
  // Timber ceiling slats
  for (let x = 10.4; x < 29.0; x += 0.62) {
    bbox(root, 0.10, 0.10, 21.0, textured(TEX.oak, '#a87f56', 0.75), x, 3.20, -6.6, 0, false);
  }
  // Bar on the east
  bbox(root, 1.0, 1.10, 8.3, textured(TEX.walnut, '#5b412d', 0.55), 27.7, 0.02, -8.2);
  bbox(root, 1.15, 0.075, 8.5, textured(TEX.marbleGreen, '#ffffff', 0.3), 27.7, 1.12, -8.2, 0, false);
  for (let z = -12.0; z <= -4.4; z += 0.55) {
    diningChair(root, 26.75, z, Math.PI / 2, { textileSoft: '#7c6757' });
  }
  // Back bar
  bbox(root, 0.55, 2.5, 8.4, textured(TEX.walnut, '#4d3626', 0.62), 29.4, 0.02, -8.2);
  for (let y = 0; y < 4; y++) {
    bbox(root, 0.32, 0.045, 8.0, MAT.brass, 29.35, 1.15 + y * 0.36, -8.2, 0, false);
    for (let z = -11.6; z <= -4.8; z += 0.55) {
      const h = 0.18 + Math.random() * 0.16;
      cyl(root, 0.035, 0.042, h, std(['#6b7a5d', '#c9b18b', '#d9d2c5', '#8e5c3e'][(y + Math.round(z)) % 4], 0.28, 0.05), 29.22, 1.20 + y * 0.36, z, 8);
    }
  }
  // Bar pendant lights
  for (let z = -12; z <= -4.5; z += 2.4) addPendant(root, 27.0, 3.05, z, pal, 0.7);
  // Bar sign + menu
  sign(root, 'THE LANTERN BAR', 28.2, 2.65, -12.8, -Math.PI / 2, 1.8, 0.3);
  serviceHotspot(app, root, 'bar', 27.0, 0.0, -8.2, 2.0, 2.3, 8.0);
  // Open kitchen at the north-east
  bbox(root, 8.5, 1.0, 0.28, MAT.chrome, 24.4, 0.02, -13.45);
  bbox(root, 8.5, 0.055, 0.7, std('#b9bdbd', 0.3, 0.65), 24.4, 1.0, -13.6, 0, false);
  bbox(root, 8.5, 0.55, 2.8, std('#a7a6a0', 0.55), 24.4, 2.75, -15.6, 0, false);
  for (let x = 20.5; x <= 28; x += 1.6) {
    bbox(root, 0.7, 0.06, 0.4, MAT.brass, x, 1.08, -13.7, 0, false);
    for (let i = 0; i < 7; i++) bbox(root, 0.02, 0.1, 0.02, MAT.brass, x - 0.3 + i * 0.1, 1.08, -13.7, 0, false);
  }
  // Kitchen pass lights
  for (let x = 20.8; x <= 27.8; x += 1.4) {
    cyl(root, 0.04, 0.04, 0.02, MAT.warmBulb, x, 2.66, -13.7, 10);
    glow(root, x, 2.55, -13.7, 0.55, '#ffd39a', 0.22);
  }
  sign(root, 'OPEN KITCHEN', 24.4, 2.55, -13.36, 0, 1.5, 0.22);
  // Dining tables
  const tables = [
    [12.4, -14.2], [16.2, -14.2], [20.2, -11.0], [24.1, -11.0],
    [12.5, -9.2], [16.4, -8.5], [20.0, -5.2], [12.8, -3.6], [17.0, -2.4], [22.4, -1.0]
  ];
  tables.forEach(([x, z], i) => diningTable(root, x, z, pal, i % 2 ? 4 : 2, i % 3 === 0 ? 1.2 : 1.0));
  // Banquette along the south
  bbox(root, 13.5, 0.42, 0.75, std('#6f5a46', 0.9), 18.0, 0.02, 3.2);
  rbox(root, 13.2, 0.20, 0.72, 0.06, std('#a98d6f', 0.94), 18.0, 0.42, 3.2);
  for (let x = 12; x <= 24; x += 1.6) rbox(root, 0.55, 0.45, 0.12, 0.04, std('#c4b096', 0.94), x, 0.62, 2.9, 0.1);
  // Host stand
  bbox(root, 0.55, 1.1, 0.9, textured(TEX.walnut, '#5c412e', 0.6), 10.6, 0.02, -3.2);
  bbox(root, 0.62, 0.05, 0.98, MAT.agedBrass, 10.6, 1.12, -3.2, 0, false);
  addFlowers(root, 10.6, 1.17, -3.2);
  sign(root, 'SALT & CEDAR', 10.6, 2.8, -3.95, 0, 1.8, 0.32);
  serviceHotspot(app, root, 'restaurant', 10.6, 0.0, -3.2, 1.4, 2.3, 1.6);
  // Wine wall
  for (let y = 0; y < 5; y++) {
    bbox(root, 0.25, 0.04, 4.2, MAT.brass, 9.95, 0.55 + y * 0.48, -12.2, 0, false);
    for (let z = -14; z <= -10; z += 0.42) {
      cyl(root, 0.03, 0.03, 0.24, std(['#4d2f2f', '#5a4b33', '#31403a'][(y + Math.round(z)) % 3], 0.4, 0.05), 9.95, 0.61 + y * 0.48, z, 8);
    }
  }
  // Terrace doors
  for (let x = 12; x <= 26; x += 3.5) {
    bbox(root, 2.2, 2.8, 0.05, MAT.windowGlass, x, 0.1, 4.18, 0, false);
    bbox(root, 0.08, 2.9, 0.12, MAT.brass, x - 1.1, 0.0, 4.18, 0, false);
    bbox(root, 0.08, 2.9, 0.12, MAT.brass, x + 1.1, 0.0, 4.18, 0, false);
  }
  warmLight(root, 18, 2.7, -6.0, 30, 14);
  warmLight(root, 27.0, 2.6, -8.2, 20, 9, 0xffc985);
  warmLight(root, 24.5, 2.5, -14.0, 14, 7);
  bakeGroup(root);
}

function buildLounge(app, g) {
  const root = new THREE.Group();
  g.add(root);
  const pal = { textile: '#6f6759', accent: '#6e7450', textileSoft: '#a4927e', accentSoft: '#a5a887', rug: '#b7ab90', wood: '#6b4e38', woodDark: '#433025', stone: '#cfc8bb' };
  floorPlane(root, -29.2, -9.8, -17.4, 4.2, 0.025, textured(TEX.oak, '#9b7653', 0.7));
  ceiling(root, -29.2, -9.8, -17.4, 4.2, 3.28, std('#e6ded0', 0.97));
  addRug(root, -19.4, -8.4, 8.0, 6.0, { ...pal, rug: '#b7ab90' }, 0);
  addRug(root, -19.4, 0.0, 6.5, 3.6, { ...pal, rug: '#c0b397' }, 1);
  // Fireplace on the west wall
  bbox(root, 0.65, 3.15, 3.3, textured(TEX.limestone, '#b9b1a4', 0.82), -28.75, 0.02, -11.0);
  bbox(root, 0.25, 1.2, 1.7, std('#2a2723', 0.95), -28.45, 0.25, -11.0);
  bbox(root, 0.12, 0.18, 1.9, MAT.fire, -28.36, 0.55, -11.0, 0, false);
  for (let i = 0; i < 5; i++) {
    sphere(root, 0.12 + Math.random() * 0.1, MAT.fire, -28.35, 0.45 + Math.random() * 0.35, -11.6 + Math.random() * 1.2, 7);
  }
  glow(root, -28.2, 0.9, -11.0, 2.1, '#ff9d4a', 0.5);
  warmLight(root, -27.2, 1.2, -11.0, 22, 6, 0xff9a52);
  bbox(root, 0.5, 0.10, 3.6, MAT.agedBrass, -28.55, 1.35, -11.0, 0, false);
  addArt(root, 1.05, 1.2, -28.85, 2.35, -11.0, Math.PI / 2, pal, 1);
  // Bookshelves on the north wall
  bbox(root, 7.4, 2.7, 0.40, textured(TEX.walnut, '#5b402d', 0.6), -24.0, 0.02, -16.75);
  for (let y = 0; y < 5; y++) {
    bbox(root, 7.1, 0.04, 0.44, MAT.agedBrass, -24.0, 0.35 + y * 0.48, -16.72, 0, false);
    for (let x = -27.2; x < -20.8; x += 0.24) {
      if (Math.random() > 0.18) addBooks(root, x, 0.39 + y * 0.48, -16.72, 0, 1, pal);
    }
  }
  // Seating
  addSofa(root, -16.5, -8.4, 3.0, -Math.PI / 2, pal, 1.0);
  addSofa(root, -22.4, -8.4, 2.6, Math.PI / 2, pal, 0.95);
  addArmchair(root, -19.5, -11.4, 0, pal, 1.1);
  addArmchair(root, -19.5, -5.4, Math.PI, pal, 1.1);
  addCoffeeTable(root, -19.5, -8.4, 1.6, 0.85, pal);
  addSideTable(root, -23.4, -11.5, pal);
  addLamp(root, -24.4, 1.2, -12.5, 1.35);
  addLamp(root, -14.6, 1.2, -4.8, 1.25);
  // Reading nook by the window
  addArmchair(root, -13.2, -14.6, Math.PI * 0.65, pal, 1.0);
  addSideTable(root, -12.1, -13.7, pal);
  addPlant(root, -12.0, -16.5, 1.3);
  addPlant(root, -28.0, -3.3, 1.15);
  // Honesty bar / coffee station
  bbox(root, 3.8, 1.0, 0.75, textured(TEX.walnut, '#5b402d', 0.6), -23.0, 0.02, 2.9);
  bbox(root, 3.9, 0.06, 0.85, textured(TEX.marble, '#e3dbcd', 0.32), -23.0, 1.02, 2.9, 0, false);
  for (let x = -24.6; x <= -21.4; x += 0.8) {
    cyl(root, 0.06, 0.05, 0.16, MAT.glass, x, 1.08, 2.8, 10);
    cyl(root, 0.04, 0.04, 0.22, std(['#6b7a5d', '#c9b18b', '#8e5c3e'][Math.round(x) % 3], 0.3, 0.1), x, 1.08, 2.6, 8);
  }
  bbox(root, 0.4, 0.35, 0.28, MAT.blackGloss, -20.95, 1.08, 2.9);
  sign(root, 'THE READING LOUNGE', -24.0, 3.02, -16.9, 0, 2.2, 0.3);
  serviceHotspot(app, root, 'lounge', -19.5, 0.0, -8.4, 7.0, 2.4, 6.5);
  warmLight(root, -19.5, 2.6, -8.4, 26, 13);
  bakeGroup(root);
}

function buildSpa(app, g) {
  const root = new THREE.Group();
  g.add(root);
  const pal = { textile: '#a08e7a', accent: '#5f6b58', textileSoft: '#c0b29e', accentSoft: '#aeb49a', wood: '#7b5b3f', woodDark: '#4e3a29', stone: '#d9d2c4' };
  floorPlane(root, 18.2, 29.8, 6.2, 17.8, 0.03, textured(TEX.travertine, '#d7cfc0', 0.55));
  ceiling(root, 18.2, 29.8, 6.2, 17.8, 3.28, std('#e3dccd', 0.96));
  // Reeded timber wall along the east
  bbox(root, 0.3, 3.2, 11.0, textured(TEX.oak, '#a37d55', 0.65), 29.6, 0.02, 12.0);
  for (let z = 6.8; z < 17.4; z += 0.18) bbox(root, 0.04, 2.7, 0.07, std('#7b5b3f', 0.7), 29.4, 0.2, z, 0, false);
  // Spa reception
  bbox(root, 0.85, 1.0, 2.6, textured(TEX.walnut, '#5d432f', 0.6), 19.3, 0.02, 14.7);
  bbox(root, 0.95, 0.06, 2.7, textured(TEX.marble, '#e6dfd1', 0.32), 19.3, 1.02, 14.7, 0, false);
  addFlowers(root, 19.3, 1.08, 14.7);
  addPlant(root, 18.7, 16.6, 1.0);
  sign(root, 'HAVEN SPA', 18.7, 2.8, 12.2, Math.PI / 2, 1.6, 0.3);
  serviceHotspot(app, root, 'spa', 19.3, 0.0, 14.7, 2.0, 2.3, 2.8);
  // Relaxation lounge
  addRug(root, 23.6, 11.2, 5.0, 4.0, { ...pal, rug: '#b7ab90' }, 0);
  for (let i = 0; i < 3; i++) {
    const l = new THREE.Group();
    l.position.set(21.8 + i * 1.75, 0, 9.2);
    l.rotation.y = Math.PI / 2;
    root.add(l);
    bbox(l, 0.7, 0.30, 1.8, textured(TEX.leather, '#b7a58f', 0.72), 0, 0.22, 0);
    rbox(l, 0.66, 0.16, 1.4, 0.06, MAT.towel, 0, 0.50, 0.1);
    rbox(l, 0.66, 0.12, 0.5, 0.05, MAT.towel, 0, 0.66, -0.62);
    for (const dx of [-0.28, 0.28]) for (const dz of [-0.7, 0.7]) bbox(l, 0.04, 0.22, 0.04, MAT.agedBrass, dx, 0, dz);
  }
  // Treatment rooms along the south-east
  const buildTreatmentRoom = (x0, z0, w, d, label, idx) => {
    const r = new THREE.Group();
    r.position.set(x0, 0, z0);
    root.add(r);
    bbox(r, w, 2.5, 0.10, std('#cdbfa9', 0.94), w / 2, 0, 0.05);
    bbox(r, 0.10, 2.5, d, std('#cdbfa9', 0.94), 0.05, 0, d / 2);
    bbox(r, 0.10, 2.5, d, std('#cdbfa9', 0.94), w - 0.05, 0, d / 2);
    // opening on north wall
    bbox(r, w / 2 - 0.5, 2.5, 0.10, std('#cdbfa9', 0.94), w / 4 - 0.25, 0, d - 0.05);
    bbox(r, w / 2 - 0.5, 2.5, 0.10, std('#cdbfa9', 0.94), w * 0.75 + 0.25, 0, d - 0.05);
    // treatment bed
    const bed = new THREE.Group();
    bed.position.set(w / 2, 0, d / 2);
    r.add(bed);
    bbox(bed, 2.0, 0.38, 0.85, std('#6f543c', 0.8), 0, 0.1, 0);
    rbox(bed, 1.95, 0.20, 0.78, 0.06, MAT.towel, 0, 0.48, 0);
    rbox(bed, 0.48, 0.10, 0.55, 0.04, MAT.towel, -0.65, 0.66, 0);
    // rolled towels, oil, candle
    for (let i = 0; i < 2; i++) cyl(bed, 0.08, 0.08, 0.26, MAT.towel, 0.65 + i * 0.18, 0.62, 0.32, 12, Math.PI / 2);
    cyl(bed, 0.035, 0.03, 0.14, std('#9a7d56', 0.4), 0.7, 0.62, -0.2, 10);
    cyl(bed, 0.045, 0.045, 0.10, MAT.warmBulb, 0.4, 0.62, -0.25, 10);
    glow(bed, 0.4, 0.75, -0.25, 0.4, '#ffd39a', 0.35);
    // plant + stool
    addPlant(r, 0.4, d - 0.5, 0.7);
    cyl(r, 0.22, 0.20, 0.42, std('#8a7458', 0.8), w - 0.6, 0, d - 0.5, 14);
    // Light
    cyl(r, 0.05, 0.05, 0.02, MAT.warmBulb, w / 2, 2.46, d / 2, 10);
    glow(r, w / 2, 2.35, d / 2, 0.7, '#ffd39a', 0.22);
    sign(r, label, w / 2, 2.15, d + 0.01, 0, 1.4, 0.18);
  };
  buildTreatmentRoom(19.0, 6.4, 4.7, 4.8, 'CEDAR ROOM', 0);
  buildTreatmentRoom(24.2, 6.4, 4.7, 4.8, 'SEA ROOM', 1);
  // Cedar sauna
  const sauna = new THREE.Group();
  sauna.position.set(26.3, 0, 12.9);
  root.add(sauna);
  bbox(sauna, 3.0, 2.5, 3.5, textured(TEX.oak, '#a77d4e', 0.72), 0, 0, 0);
  bbox(sauna, 2.7, 2.3, 3.2, std('#9b6f45', 0.75), 0, 0.05, 0);
  bbox(sauna, 2.5, 2.2, 2.9, std('#d9a96c', 0.8), 0, 0.1, 0);
  for (let i = 0; i < 3; i++) bbox(sauna, 2.3, 0.12, 0.7, textured(TEX.teak, '#b88a57', 0.8), 0, 0.55 + i * 0.45, -0.9 + i * 0.55);
  for (let i = 0; i < 3; i++) sphere(sauna, 0.13, std('#5a5750', 0.9), 0.6 - i * 0.2, 1.6, 1.1, 7);
  bbox(sauna, 0.8, 1.9, 0.06, MAT.windowGlass, 0, 0.3, 1.77, 0, false);
  // Steam room
  const steam = new THREE.Group();
  steam.position.set(22.8, 0, 14.7);
  root.add(steam);
  bbox(steam, 2.8, 2.5, 2.2, std('#77766f', 0.9), 0, 0, 0);
  bbox(steam, 2.5, 0.12, 0.7, textured(TEX.travertine, '#d8d0c2', 0.6), 0, 0.55, -0.4);
  bbox(steam, 1.0, 1.9, 0.06, MAT.windowGlass, 0, 0.3, 1.12, 0, false);
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.cloud, color: new THREE.Color('#f8f2e8'), transparent: true, opacity: 0.18, depthWrite: false }));
    s.position.set(22.8 + (Math.random() - .5) * 2, 1.2 + Math.random(), 14.7 + Math.random() * 2);
    s.scale.set(2.2, 2.2, 1);
    root.add(s);
  }
  // Plunge pool
  bbox(root, 2.2, 0.85, 2.2, std('#6d6b62', 0.8), 27.8, -0.5, 16.6, 0, false);
  bbox(root, 1.9, 0.06, 1.9, std('#4d8e8e', 0.12, 0.1, { transparent: true, opacity: 0.86 }), 27.8, 0.35, 16.6, 0, false);
  // Aromatherapy diffusers and stones
  for (let i = 0; i < 7; i++) {
    sphere(root, 0.10 + Math.random() * 0.12, std('#8b887c', 0.9), 20.5 + Math.random() * 1.5, 0.12, 11.0 + Math.random() * 1.4, 7);
  }
  warmLight(root, 23.5, 2.5, 11.0, 24, 12, 0xffd2a0);
  warmLight(root, 19.2, 2.2, 15.3, 12, 6, 0xffc98d);
  bakeGroup(root);
}

/* ------------------------------------------------------------------ */
/* Level 2 — gallery, lounge and movement studio                        */
/* ------------------------------------------------------------------ */

export function buildLevel2Public(app) {
  const g = app.floorGroups[2];
  const y = LEVELS[1].y;
  const root = new THREE.Group();
  g.add(root);
  floorPlane(root, -30.2, -7.2, -18.2, -4.5, y + 0.02, textured(TEX.oak, '#9d7a56', 0.7));
  floorPlane(root, 7.2, 30.2, -18.2, -4.5, y + 0.02, textured(TEX.oak, '#9d7a56', 0.7));
  ceiling(root, -30.2, -7.2, -18.2, -4.5, y + 3.3, std('#e6ded0', 0.97));
  ceiling(root, 7.2, 30.2, -18.2, -4.5, y + 3.3, std('#e6ded0', 0.97));

  // East gallery lounge
  const pal = { textile: '#7c6757', accent: '#7c8872', textileSoft: '#b49b87', accentSoft: '#abb39a', rug: '#b7ab90', wood: '#6b4e38', woodDark: '#433025', stone: '#cfc8bb' };
  addRug(root, 20.0, -11.5, 5.4, 4.0, pal, 1);
  addSofa(root, 18.0, -13.8, 2.8, 0, pal, 0.95);
  addArmchair(root, 21.5, -9.4, Math.PI, pal, 1.05);
  addArmchair(root, 17.2, -9.4, Math.PI, pal, 1.05);
  addCoffeeTable(root, 19.6, -11.5, 1.35, 0.75, pal);
  addLamp(root, 16.4, y + 1.0, -14.4, 1.3);
  addPlant(root, 23.0, -16.5, 1.2);
  bbox(root, 3.4, 1.0, 0.65, textured(TEX.walnut, '#5d432f', 0.6), 26.0, y + 0.02, -16.4);
  bbox(root, 3.5, 0.06, 0.72, textured(TEX.marble, '#e4dccd', 0.32), 26.0, y + 1.02, -16.4, 0, false);
  bbox(root, 0.38, 0.34, 0.26, MAT.blackGloss, 26.8, y + 1.08, -16.4);
  for (let x = 24.9; x <= 27.0; x += 0.55) cyl(root, 0.05, 0.045, 0.13, MAT.ceramic, x, y + 1.08, -16.25, 10);
  sign(root, 'THE GALLERY', 20.0, y + 2.9, -17.0, 0, 1.9, 0.28);
  // Books and art
  addArt(root, 1.25, 1.55, 29.9, y + 1.95, -10.5, -Math.PI / 2, pal, 2);
  addArt(root, 1.1, 1.4, 8.0, y + 1.95, -12.0, Math.PI / 2, pal, 1);
  // West movement studio
  floorPlane(root, -30.0, -12.0, -18.0, -5.0, y + 0.025, std('#7b7467', 0.98));
  addMirror(root, 5.0, 1.9, -20.6, y + 1.3, -9.5, Math.PI / 2);
  addMirror(root, 4.2, 1.9, -15.2, y + 1.3, -17.6, 0);
  // treadmill
  const tread = new THREE.Group();
  tread.position.set(-22.0, y + 0.02, -14.0);
  root.add(tread);
  bbox(tread, 0.9, 0.28, 1.9, std('#2c2e2f', 0.6), 0, 0, 0);
  bbox(tread, 0.9, 0.08, 1.4, std('#3a3c3d', 0.8), 0, 0.28, 0.1);
  bbox(tread, 0.12, 1.1, 0.10, MAT.blackMetal, 0, 0.3, -0.82);
  bbox(tread, 0.75, 0.35, 0.12, MAT.blackGloss, 0, 1.25, -0.86, 0.1);
  // rower
  const rower = new THREE.Group();
  rower.position.set(-26.0, y + 0.02, -10.0);
  root.add(rower);
  bbox(rower, 0.42, 0.22, 2.0, std('#6c5539', 0.7), 0, 0.1, 0);
  bbox(rower, 0.55, 0.10, 0.42, std('#2f3132', 0.6), 0, 0.34, 0.2);
  // weights rack
  bbox(root, 2.0, 1.3, 0.45, MAT.blackMetal, -28.0, y + 0.02, -6.6);
  for (let i = 0; i < 5; i++) {
    cyl(root, 0.10, 0.10, 0.24, std('#3c3c3c', 0.6), -28.8 + i * 0.4, y + 0.2, -6.4, 12, Math.PI / 2);
    cyl(root, 0.10, 0.10, 0.24, std('#3c3c3c', 0.6), -28.8 + i * 0.4, y + 0.75, -6.4, 12, Math.PI / 2);
  }
  // yoga mats
  for (let i = 0; i < 3; i++) {
    planeH(root, 0.65, 1.7, std(i % 2 ? '#6b7a5d' : '#8e7b66', 0.98), -18.5 + i * 1.0, y + 0.04, -10.5);
  }
  sign(root, 'MOVEMENT STUDIO', -21.5, y + 2.8, -17.85, 0, 2.2, 0.28);
  serviceHotspot(app, root, 'fitness', -21.0, y, -14.0, 3.0, 2.4, 2.0);
  warmLight(root, 20, y + 2.5, -11.5, 24, 12);
  warmLight(root, -21, y + 2.5, -11.0, 18, 11);
  bakeGroup(root);
}

/* ------------------------------------------------------------------ */
/* Level 3 — Sunset Deck                                               */
/* ------------------------------------------------------------------ */

export function buildLevel3Public(app) {
  const g = app.floorGroups[3];
  const y = LEVELS[2].y;
  const root = new THREE.Group();
  g.add(root);
  // Teak deck over the north half, with the stair opening cut out
  const hx0 = -3.9, hx1 = -0.9, hz0 = -15.4, hz1 = -12.4;
  const deckMat = textured(TEX.teak, '#ffffff', 0.8);
  floorPlane(root, -30.2, hx0, -18.2, -4.5, y + 0.03, deckMat);
  floorPlane(root, hx1, 30.2, -18.2, -4.5, y + 0.03, deckMat);
  floorPlane(root, hx0, hx1, -18.2, hz0, y + 0.03, deckMat);
  floorPlane(root, hx0, hx1, hz1, -4.5, y + 0.03, deckMat);
  for (let x = -30; x < 30.2; x += 0.42) {
    if (x > hx0 - 0.1 && x < hx1 + 0.1) {
      bbox(root, 0.014, 0.006, Math.abs(hz0 + 18.2), std('#5e4128', 0.9), x, y + 0.037, (-18.2 + hz0) / 2, 0, false);
      bbox(root, 0.014, 0.006, Math.abs(-4.5 - hz1), std('#5e4128', 0.9), x, y + 0.037, (hz1 - 4.5) / 2, 0, false);
    } else {
      bbox(root, 0.014, 0.006, 13.6, std('#5e4128', 0.9), x, y + 0.037, -11.35, 0, false);
    }
  }
  // Glass balustrade around the stair opening (open on the landing side)
  const holeRail = std('#c8dedb', 0.06, 0, { transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
  planeV(root, hx1 - hx0, 1.05, holeRail, (hx0 + hx1) / 2, y + 0.55, hz0, 0);
  bbox(root, hx1 - hx0 + 0.1, 0.06, 0.06, MAT.brass, (hx0 + hx1) / 2, y + 1.10, hz0, 0, false);
  for (const x of [hx0, hx1]) {
    planeV(root, Math.abs(hz1 - hz0), 1.05, holeRail, x, y + 0.55, (hz0 + hz1) / 2, Math.PI / 2);
    bbox(root, 0.06, 0.06, Math.abs(hz1 - hz0), MAT.brass, x, y + 1.10, (hz0 + hz1) / 2, 0, false);
  }
  for (const [x, z] of [[hx0, hz0], [hx1, hz0], [hx0, hz1 - 0.9], [hx1, hz1 - 0.9]]) {
    cyl(root, 0.03, 0.035, 1.08, MAT.brass, x, y + 0.02, z, 8);
  }
  // Windbreak glass along the north and sides
  for (const [x0, x1, z, ry] of [[-30, 30, -18.0, 0], [-30.2, -30.2, -18, Math.PI / 2], [30.2, 30.2, -18, Math.PI / 2]]) {
    if (ry === 0) {
      planeV(root, x1 - x0, 1.2, MAT.windowGlass, (x0 + x1) / 2, y + 0.65, z, 0);
      bbox(root, x1 - x0, 0.06, 0.06, MAT.brass, (x0 + x1) / 2, y + 1.28, z, 0, false);
    }
  }
  // Pergola
  const perg = new THREE.Group();
  perg.position.set(0, y + 0.02, -10.0);
  root.add(perg);
  for (const x of [-5.8, 5.8]) for (const z of [-4.4, 4.4]) {
    bbox(perg, 0.16, 3.1, 0.16, textured(TEX.teak, '#b89264', 0.75), x, 0, z);
  }
  for (let x = -6.0; x <= 6.0; x += 0.4) {
    bbox(perg, 0.07, 0.14, 9.2, textured(TEX.teak, '#b89264', 0.75), x, 3.08, 0, 0, false);
  }
  bbox(perg, 12.0, 0.10, 0.12, MAT.brass, 0, 3.0, -4.5, 0, false);
  bbox(perg, 12.0, 0.10, 0.12, MAT.brass, 0, 3.0, 4.5, 0, false);
  // Lounge seating
  const pal = { textile: '#8c7a63', accent: '#355c5c', textileSoft: '#c0ab8f', accentSoft: '#7b9a95', rug: '#c0b397', wood: '#5b4435', woodDark: '#382a21', stone: '#d4cec2' };
  addRug(perg, 0, 1.0, 7.4, 5.0, pal, 0);
  addSofa(perg, -2.6, -0.6, 3.1, 0, pal, 0.95);
  addSofa(perg, 2.4, 2.8, 2.7, Math.PI, pal, 0.95);
  addArmchair(perg, 3.4, -1.0, -Math.PI * 0.7, pal, 1.05);
  addCoffeeTable(perg, 0, 1.2, 1.5, 0.8, pal);
  addSideTable(perg, -4.4, 2.2, pal);
  // Fire table
  const fire = new THREE.Group();
  fire.position.set(0, 0.02, 3.4);
  perg.add(fire);
  cyl(fire, 0.7, 0.6, 0.32, std('#3c3933', 0.75), 0, 0, 0, 24);
  bbox(fire, 0.8, 0.04, 0.8, MAT.fire, 0, 0.3, 0, 0, false);
  for (let i = 0; i < 6; i++) sphere(fire, 0.1 + Math.random() * 0.1, MAT.fire, (Math.random() - .5) * 0.6, 0.36 + Math.random() * 0.2, (Math.random() - .5) * 0.6, 7);
  glow(fire, 0, 0.5, 0, 1.8, '#ff9d4a', 0.4);
  // Bar cart
  const cart = new THREE.Group();
  cart.position.set(5.0, 0.02, -3.8);
  perg.add(cart);
  bbox(cart, 0.9, 0.06, 0.5, MAT.agedBrass, 0, 0.75, 0);
  bbox(cart, 0.9, 0.06, 0.5, MAT.agedBrass, 0, 0.3, 0);
  for (const x of [-0.38, 0.38]) for (const z of [-0.2, 0.2]) cyl(cart, 0.015, 0.015, 0.82, MAT.brass, x, 0.05, z, 6);
  for (let i = 0; i < 4; i++) cyl(cart, 0.04, 0.04, 0.16, MAT.glass, -0.25 + i * 0.18, 0.81, 0, 10);
  cyl(cart, 0.05, 0.05, 0.28, std('#496044', 0.3, 0.1), 0.25, 0.81, 0, 10);
  // Planters
  for (const [x, z] of [[-6.4, 3.9], [6.4, 3.9], [-6.3, -4.0], [6.3, -4.0]]) {
    bbox(perg, 0.55, 0.55, 0.55, MAT.terracotta, x, 0, z);
    addPlant(perg, x, z, 0.7);
  }
  // String lights along the pergola
  for (let i = 0; i < 16; i++) {
    const x = -5.6 + i * 0.75;
    const sag = Math.sin((i / 15) * Math.PI) * 0.35;
    sphere(perg, 0.045, MAT.warmBulb, x, 2.85 - sag, -4.35, 7);
    glow(perg, x, 2.85 - sag, -4.35, 0.32, '#ffd39a', 0.3);
    sphere(perg, 0.045, MAT.warmBulb, x, 2.85 - sag, 4.35, 7);
    glow(perg, x, 2.85 - sag, 4.35, 0.32, '#ffd39a', 0.3);
  }
  // Loungers along the edge
  for (let i = 0; i < 4; i++) {
    const l = new THREE.Group();
    l.position.set(-9.0 + i * 2.4, y + 0.04, -6.2);
    l.rotation.y = Math.PI;
    root.add(l);
    bbox(l, 0.72, 0.08, 1.8, std('#6f5238', 0.8), 0, 0.28, 0);
    rbox(l, 0.66, 0.12, 1.25, 0.05, MAT.towel, 0, 0.38, 0.15);
    for (const dx of [-0.30, 0.30]) for (const dz of [-0.75, 0.75]) bbox(l, 0.05, 0.28, 0.05, MAT.agedBrass, dx, 0, dz);
  }
  // Deck planting
  for (let x = -28; x <= 28; x += 4.5) {
    if (Math.abs(x) < 8) continue;
    bbox(root, 1.6, 0.55, 0.8, std('#5a5348', 0.9), x, y + 0.04, -5.3);
    addPlant(root, x, -5.3, 0.55);
  }
  sign(root, 'SUNSET DECK', 0, y + 1.35, -17.6, 0, 2.0, 0.3);
  serviceHotspot(app, root, 'sunset', 0, y, -8.0, 12.0, 2.5, 8.0);
  warmLight(root, 0, y + 2.8, -9.0, 34, 15, 0xffcd93);
  bakeGroup(root);
}
