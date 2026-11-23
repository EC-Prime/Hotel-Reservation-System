import * as THREE from 'three';
import { PALETTES, ROOM_LAYOUT, ROOM_BY_NUMBER, LEVELS, ROOM_H, roomDoor, roomView } from './data.js';
import { MAT, TEX, std, textured } from './materials.js';
import {
  bbox, rbox, cyl, sphere, planeH, planeV, glow, addArt, addMirror, addLamp,
  addWallSconce, addBooks, addPlant, addFlowers, addTray, addArmchair, addSofa,
  addCoffeeTable, addSideTable, addDesk, addWardrobe, addTV, addBed, addNightstand,
  addRug, addCurtains, addBathroom, addKitchenette, addCeilingCove, addPendant,
  addVent, addThermostat, addSwitch, addLuggageRack, addSuitcase, bakeGroup,
  textPlane
} from './kit.js';

/* ------------------------------------------------------------------ */
/* Room shells                                                         */
/* ------------------------------------------------------------------ */

function buildShell(room, local, palette) {
  const { w, d } = local;
  const wall = std(palette.wall, 0.94);
  const wallDeep = std(palette.wallDeep, 0.94);
  const h = ROOM_H;
  const T = 0.14;
  // Floor
  const floorMat = room.floor === 1
    ? textured(TEX.oak, '#b08c66', 0.7)
    : textured(TEX.carpet, palette.wallDeep, 0.99);
  planeH(local.group, w - 0.02, d - 0.02, floorMat, 0, 0.012, 0);
  // Side walls (shared partitions)
  bbox(local.group, T, h, d, wall, -w / 2 + T / 2, 0, 0, 0, false);
  bbox(local.group, T, h, d, wall, w / 2 - T / 2, 0, 0, 0, false);
  // Ceiling
  const ceiling = planeH(local.group, w - 0.04, d - 0.04, std('#e8e1d5', 0.97), 0, h, 0);
  ceiling.rotation.x = Math.PI / 2;
  // Skirting and cornice
  bbox(local.group, w, 0.11, 0.035, textured(TEX.walnut, palette.wood, 0.7), 0, 0.01, d / 2 - 0.075, 0, false);
  bbox(local.group, 0.035, 0.11, d, textured(TEX.walnut, palette.wood, 0.7), w / 2 - 0.075, 0.01, 0, 0, false);
  bbox(local.group, 0.035, 0.11, d, textured(TEX.walnut, palette.wood, 0.7), -w / 2 + 0.075, 0.01, 0, 0, false);
  // Headboard wall in fluted timber
  const headX = w / 2 - T - 0.02;
  bbox(local.group, 0.05, 2.65, d - 0.3, textured(TEX.walnut, palette.wood, 0.58), headX, 0.05, -0.1, 0, false);
  for (let z = -d / 2 + 0.35; z < d / 2 - 0.35; z += 0.17) {
    bbox(local.group, 0.035, 2.5, 0.06, std(palette.woodDark, 0.65), headX - 0.05, 0.12, z, 0, false);
  }
  // Warm painted panel on the opposite (TV) wall
  bbox(local.group, 0.04, 2.35, d * 0.55, wallDeep, -w / 2 + T + 0.02, 0.2, 0.2, 0, false);
  // Ceiling cove
  addCeilingCove(local.group, w, d, palette);
  // AC + thermostat + switches
  addVent(local.group, w / 2 - 1.25, 2.92, -d / 2 + 0.25, Math.PI);
  addThermostat(local.group, w / 2 - 0.28, 1.42, -d / 2 + 0.36, Math.PI);
  addSwitch(local.group, w / 2 - 1.85, 1.32, -d / 2 + 0.36, Math.PI);
  // Beside the bed: full-length mirror + art
  addMirror(local.group, 0.72, 1.9, -w / 2 + T + 0.09, 1.35, -d / 2 + 1.3, Math.PI / 2);
  addArt(local.group, 0.85, 1.05, -w / 2 + T + 0.10, 1.75, d / 2 - 1.75, Math.PI / 2, palette, room.number.charCodeAt(2) % 3);
}

/* ------------------------------------------------------------------ */
/* Room interiors                                                      */
/* ------------------------------------------------------------------ */

function buildSingle(room, local, palette) {
  const { w, d, group } = local;
  const bathW = 2.7, bathD = 2.35;
  addBathroom(group, {
    x0: -w / 2 + 0.18, z0: -d / 2 + 0.22, w: bathW, d: bathD,
    palette, tub: false, double: false
  });
  // Bed
  addBed(group, w / 2 - 1.22, 0.75, Math.PI, palette, 1.5, 'channel');
  addNightstand(group, w / 2 - 0.37, 0.75 - 1.12, -Math.PI / 2, palette, true);
  addNightstand(group, w / 2 - 0.37, 0.75 + 1.12, -Math.PI / 2, palette, true);
  addRug(group, w / 2 - 2.1, 0.85, 3.4, 3.1, palette, room.number.charCodeAt(2) % 2);
  // TV and console
  addConsoleAndTV(group, -w / 2 + 0.10, 0.7, Math.PI / 2, palette, 1.6);
  // Wardrobe, luggage
  addWardrobe(group, 0.8, -d / 2 + 0.43, Math.PI, palette, 1.35);
  addLuggageRack(group, 1.9, -d / 2 + 0.55, Math.PI, palette);
  // Desk by the window
  addDesk(group, -w / 2 + 1.55, d / 2 - 0.48, Math.PI, palette, 1.28);
  // Armchair and side table by the view
  addArmchair(group, -w / 2 + 1.15, d / 2 - 1.6, Math.PI * 0.78, palette);
  addSideTable(group, -w / 2 + 2.25, d / 2 - 1.7, palette);
  addPlant(group, -w / 2 + 0.55, d / 2 - 0.65, 0.9);
  addCurtains(group, 0, d / 2 - 0.18, 0, w - 0.9, palette);
  addPendant(group, 0, ROOM_H - 0.05, 0.8, palette, 0.8);
  addSuitcase(group, 1.8, d / 2 - 0.7, 0.2, palette);
  addSwitch(group, w / 2 - 0.22, 1.05, -d / 2 + 0.38, Math.PI);
}

function buildDeluxe(room, local, palette, garden = false) {
  const { w, d, group } = local;
  const bathW = 3.15, bathD = 2.55;
  addBathroom(group, {
    x0: -w / 2 + 0.18, z0: -d / 2 + 0.22, w: bathW, d: bathD,
    palette, tub: true, double: w > 8
  });
  addBed(group, w / 2 - 1.22, 0.72, Math.PI, palette, 1.82, room.floor % 2 ? 'channel' : 'slat');
  addNightstand(group, w / 2 - 0.38, 0.72 - 1.28, -Math.PI / 2, palette, true);
  addNightstand(group, w / 2 - 0.38, 0.72 + 1.28, -Math.PI / 2, palette, true);
  addRug(group, w / 2 - 2.35, 0.8, 4.1, 3.4, palette, room.number.charCodeAt(2) % 2);
  addConsoleAndTV(group, -w / 2 + 0.10, 0.55, Math.PI / 2, palette, 1.9);
  addWardrobe(group, 0.95, -d / 2 + 0.43, Math.PI, palette, 1.55);
  addLuggageRack(group, 2.15, -d / 2 + 0.55, Math.PI, palette);
  addDesk(group, -w / 2 + 1.5, d / 2 - 0.48, Math.PI, palette, 1.42);
  addArmchair(group, -w / 2 + 1.15, d / 2 - 1.5, Math.PI * 0.78, palette);
  addSideTable(group, -w / 2 + 2.35, d / 2 - 1.6, palette);
  addPlant(group, -w / 2 + 0.55, d / 2 - 0.62, 1.0);
  addCurtains(group, 0, d / 2 - 0.18, 0, w - 0.9, palette);
  addPendant(group, 0, ROOM_H - 0.05, 0.7, palette, 0.9);
  addSuitcase(group, 2.1, d / 2 - 0.72, 0.25, palette);
  // A small bench at the foot of the bed
  rbox(group, 0.42, 0.34, 1.55, 0.06, std(palette.textile, 0.94), w / 2 - 2.65, 0.03, 0.72, 0.02);
  if (garden) {
    addTray(group, -w / 2 + 2.1, 0.55, d / 2 - 1.6, palette);
  }
}

function buildSuite(room, local, palette, penthouse = false) {
  const { w, d, group } = local;
  const bathW = penthouse ? 3.5 : 3.25, bathD = penthouse ? 2.9 : 2.7;
  addBathroom(group, {
    x0: -w / 2 + 0.18, z0: -d / 2 + 0.22, w: bathW, d: bathD,
    palette, tub: true, double: true
  });
  // Bedroom on the east side
  addBed(group, w / 2 - 1.2, 0.62, Math.PI, palette, 1.88, penthouse ? 'channel' : 'slat');
  addNightstand(group, w / 2 - 0.4, 0.62 - 1.32, -Math.PI / 2, palette, true);
  addNightstand(group, w / 2 - 0.4, 0.62 + 1.32, -Math.PI / 2, palette, true);
  addRug(group, w / 2 - 2.6, 0.7, 4.4, 3.5, palette, 1);
  addConsoleAndTV(group, w / 2 - 4.3, 0.5, -Math.PI / 2, palette, 1.7);
  // Dressing / wardrobe
  addWardrobe(group, w / 2 - 3.9, -d / 2 + 0.45, Math.PI, palette, 1.7);
  addLuggageRack(group, w / 2 - 2.05, -d / 2 + 0.55, Math.PI, palette);
  addMirror(group, 0.85, 2.0, w / 2 - 2.15, 1.35, -d / 2 + 0.12, 0);
  // Living area west
  const lx = -w / 2 + 2.0;
  addSofa(group, lx, 0.45, 2.7, Math.PI / 2, palette, 0.9);
  addCoffeeTable(group, lx + 1.5, 0.45, 1.25, 0.68, palette, Math.PI / 2);
  addArmchair(group, lx + 1.5, d / 2 - 1.35, Math.PI * 0.85, palette);
  addSideTable(group, lx + 2.5, d / 2 - 1.6, palette);
  addRug(group, lx + 1.35, 0.4, 3.4, 3.0, palette, 0);
  addPlant(group, -w / 2 + 0.52, d / 2 - 0.7, 1.1);
  addCurtains(group, 0, d / 2 - 0.18, 0, w - 0.9, palette);
  // Kitchenette
  addKitchenette(group, -w / 2 + 0.42, penthouse ? 1.2 : 2.1, Math.PI / 2, palette, penthouse ? 2.5 : 2.1);
  // Dining / work table for penthouse
  if (penthouse) {
    addDining(group, -w / 2 + 4.2, d / 2 - 1.5, palette);
    addArt(group, 1.1, 1.3, -w / 2 + 3.9, 1.95, -d / 2 + 0.12, 0, palette, 2);
  } else {
    addDesk(group, -w / 2 + 3.7, d / 2 - 0.48, Math.PI, palette, 1.35);
  }
  addPendant(group, -w / 2 + 3.0, ROOM_H - 0.06, 0.6, palette, 1.0);
  addSuitcase(group, w / 2 - 1.0, d / 2 - 0.7, 0.4, palette);
  // Second bathroom (WC) for penthouses at the entry
  if (penthouse) {
    const g = new THREE.Group();
    group.add(g);
    const bx = -w / 2 + bathW + 0.2, bz = -d / 2 + 0.2;
    bbox(g, 1.9, 2.3, 0.1, std(palette.wall, 0.94), bx + 0.95, 0, bz + 0.05);
    bbox(g, 0.1, 2.3, 1.8, std(palette.wall, 0.94), bx + 0.05, 0, bz + 0.9);
    bbox(g, 0.1, 2.3, 1.8, std(palette.wall, 0.94), bx + 1.85, 0, bz + 0.9);
    bbox(g, 0.8, 2.3, 0.1, std(palette.wall, 0.94), bx + 0.4, 0, bz + 1.75);
    bbox(g, 0.1, 2.3, 0.35, std(palette.wall, 0.94), bx + 1.45, 0, bz + 1.75);
    planeH(g, 1.8, 1.7, textured(TEX.marble, palette.stone, 0.4), bx + 0.95, 0.02, bz + 0.9);
    bbox(g, 1.2, 0.76, 0.5, textured(TEX.walnut, palette.wood, 0.6), bx + 0.78, 0.02, bz + 0.35);
    bbox(g, 1.24, 0.04, 0.54, textured(TEX.marble, palette.stone, 0.35), bx + 0.78, 0.78, bz + 0.35);
    cyl(g, 0.16, 0.13, 0.07, MAT.ceramic, bx + 0.78, 0.84, bz + 0.34, 18);
    planeV(g, 1.0, 0.8, MAT.mirror, bx + 0.78, 1.6, bz + 0.15, 0);
    bbox(g, 0.44, 0.66, 0.5, MAT.ceramic, bx + 1.55, 0, bz + 1.48);
    rbox(g, 0.42, 0.08, 0.48, 0.03, MAT.ceramic, bx + 1.55, 0.66, bz + 1.48);
  }
}

function addConsoleAndTV(group, x, z, ry, palette, width = 1.75) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  group.add(g);
  bbox(g, 0.42, 0.42, width, textured(TEX.walnut, palette.wood, 0.6), 0.22, 0.02, 0);
  bbox(g, 0.46, 0.05, width + 0.04, MAT.agedBrass, 0.22, 0.43, 0, 0, false);
  addTV(g, 0.02, 1.55, 0, Math.PI / 2, 1.18);
  addSoundbar(g, 0.03, 0.74, 0, 0.9);
  addPlant(g, 0.18, -width / 2 + 0.2, 0.65);
  addBooks(g, 0.28, 0.46, width / 2 - 0.35, Math.PI / 2, 3, palette);
}

function addSoundbar(group, x, y, z, width) {
  bbox(group, 0.055, 0.085, width, std('#1b1d1e', 0.55, 0.2), x, y, z, 0, false);
}

function addDining(group, x, z, palette) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  group.add(g);
  cyl(g, 0.48, 0.48, 0.05, textured(TEX.marble, palette.stone, 0.35), 0, 0.73, 0, 24);
  cyl(g, 0.06, 0.12, 0.72, MAT.agedBrass, 0, 0, 0, 10);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const cx = Math.cos(a) * 0.85, cz = Math.sin(a) * 0.85;
    const c = new THREE.Group();
    c.position.set(cx, 0, cz);
    c.rotation.y = -a;
    g.add(c);
    rbox(c, 0.42, 0.07, 0.42, 0.03, std(palette.textileSoft, 0.92), 0, 0.45, 0);
    rbox(c, 0.40, 0.42, 0.08, 0.03, std(palette.textileSoft, 0.92), 0, 0.50, 0.18);
    for (const dx of [-0.17, 0.17]) for (const dz of [-0.17, 0.17]) bbox(c, 0.03, 0.45, 0.03, MAT.agedBrass, dx, 0, dz);
  }
  // Table setting
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    for (const r of [0.28, 0.35]) {
      const px = Math.cos(a) * r, pz = Math.sin(a) * r;
      cyl(g, 0.05, 0.04, 0.12, MAT.glass, px, 0.78, pz, 10);
    }
    bbox(g, 0.22, 0.012, 0.16, MAT.paper, Math.cos(a) * 0.5, 0.79, Math.sin(a) * 0.5, a, false);
  }
  addFlowers(g, 0, 0.78, 0);
  return g;
}

/* ------------------------------------------------------------------ */
/* Balconies                                                           */
/* ------------------------------------------------------------------ */

function buildBalcony(room, app, palette) {
  if (![201, 202, 203, 303, 304].includes(room.number)) return;
  const y = LEVELS[room.floor - 1].y;
  const group = app.floorGroups[room.floor];
  const x0 = room.x0 + 0.25, x1 = room.x1 - 0.25;
  const depth = room.number === 203 ? 3.3 : (room.number === 303 || room.number === 304) ? 4.0 : 1.4;
  const z0 = 6.0, z1 = 6.0 + depth;
  const g = new THREE.Group();
  group.add(g);
  // Deck
  bbox(g, x1 - x0, 0.16, depth, textured(TEX.teak, '#ffffff', 0.8), (x0 + x1) / 2, y - 0.02, z0 + depth / 2);
  for (let x = x0; x < x1; x += 0.42) {
    bbox(g, 0.012, 0.006, depth, std('#5e4128', 0.9), x, y + 0.135, z0 + depth / 2, 0, false);
  }
  // Glass balustrade
  const railMat = std('#c8dedb', 0.06, 0, { transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
  for (const z of [z1, z0]) {
    planeV(g, x1 - x0, 1.0, railMat, (x0 + x1) / 2, y + 0.62, z, 0);
    bbox(g, x1 - x0, 0.05, 0.05, MAT.brass, (x0 + x1) / 2, y + 1.14, z);
  }
  for (const x of [x0, x1]) {
    planeV(g, depth, 1.0, railMat, x, y + 0.62, z0 + depth / 2, Math.PI / 2);
    bbox(g, 0.05, 0.05, depth, MAT.brass, x, y + 1.14, z0 + depth / 2);
  }
  // Planters
  for (const x of [x0 + 0.45, x1 - 0.45]) {
    bbox(g, 0.42, 0.55, 0.42, MAT.terracotta, x, y + 0.12, z1 - 0.35);
    addPlant(g, x, z1 - 0.35, 0.6);
  }
  if (depth > 2) {
    addSofa(g, (x0 + x1) / 2 - 1.0, z0 + 2.3, 2.3, Math.PI, palette, 0.8);
    addCoffeeTable(g, (x0 + x1) / 2 + 1.2, z0 + 2.5, 1.0, 0.6, palette);
    addArmchair(g, (x0 + x1) / 2 + 2.3, z0 + 1.4, Math.PI * 0.85, palette);
    if (room.number === 303 || room.number === 304) {
      const fire = new THREE.Group();
      fire.position.set((x0 + x1) / 2, y + 0.14, z0 + depth - 1.1);
      g.add(fire);
      cyl(fire, 0.45, 0.42, 0.30, std('#3a3731', 0.7), 0, 0, 0, 18);
      bbox(fire, 0.55, 0.05, 0.55, MAT.fire, 0, 0.28, 0, 0, false);
      glow(fire, 0, 0.45, 0, 1.2, '#ff9d4a', 0.5);
    }
  } else {
    addArmchair(g, (x0 + x1) / 2 - 0.8, z0 + 0.75, Math.PI * 0.75, palette, 0.9);
    addArmchair(g, (x0 + x1) / 2 + 0.8, z0 + 0.75, Math.PI * 1.25, palette, 0.9);
    cyl(g, 0.24, 0.22, 0.04, MAT.agedBrass, (x0 + x1) / 2, y + 0.58, z0 + 0.6, 16);
    cyl(g, 0.02, 0.03, 0.48, MAT.agedBrass, (x0 + x1) / 2, y + 0.14, z0 + 0.6, 8);
  }
  // Light
  addLamp(g, x1 - 0.35, y + 0.18, z0 + depth - 0.45, 0.75);
  bakeGroup(g);
}

/* ------------------------------------------------------------------ */
/* Build all rooms                                                     */
/* ------------------------------------------------------------------ */

export function buildRooms(app) {
  app.roomObjects = {};
  app.colliders = app.colliders || [];

  for (const room of ROOM_LAYOUT) {
    const palette = PALETTES[room.palette];
    const w = room.x1 - room.x0;
    const d = room.z1 - room.z0;
    const cx = (room.x0 + room.x1) / 2;
    const cz = (room.z0 + room.z1) / 2;
    const floorY = LEVELS[room.floor - 1].y;
    const group = new THREE.Group();
    group.position.set(cx, floorY, cz);
    group.rotation.y = room.rot;
    group.name = `room-${room.number}`;
    app.floorGroups[room.floor].add(group);
    const local = { group, w, d };

    buildShell(room, local, palette);
    if (room.type === 'single') buildSingle(room, local, palette);
    else if (room.type === 'deluxe') buildDeluxe(room, local, palette, room.wing === 'garden');
    else if (room.type === 'junior') buildSuite(room, local, palette, false);
    else if (room.type === 'terrace') buildSuite(room, local, palette, false);
    else if (room.type === 'penthouse') buildSuite(room, local, palette, true);

    // Tea tray and lived-in details
    const teaX = room.type === 'single' ? -w / 2 + 2.4 : -w / 2 + 3.4;
    addTray(group, teaX, 0.55, d / 2 - 1.1, palette);
    addBooks(group, w / 2 - 1.1, 0.05, d / 2 - 1.7, 0.2, 3, palette);
    addFlowers(group, -w / 2 + 1.1, 0.55, d / 2 - 2.0);

    bakeGroup(group);
    buildBalcony(room, app, palette);

    // Furniture collision (major pieces only)
    const door = roomDoor(room);
    const bedRect = { x0: w / 2 - 2.45, x1: w / 2 - 0.1, z0: 0.72 - 1.15, z1: 0.72 + 1.15 };
    const wardrobeRect = { x0: 0.05, x1: 1.75, z0: -d / 2, z1: -d / 2 + 0.7 };
    const bathRect = { x0: -w / 2, x1: -w / 2 + (room.type === 'penthouse' ? 3.7 : room.type === 'single' ? 2.9 : 3.35), z0: -d / 2, z1: -d / 2 + (room.type === 'single' ? 2.55 : 2.95) };
    for (const r of [bedRect, wardrobeRect, bathRect]) {
      const world = localRectToWorld(r, room, cx, cz);
      app.colliders.push({ floor: room.floor, ...world, kind: 'furniture' });
    }

    app.roomObjects[room.number] = {
      group, room, palette, center: { x: cx, z: cz }, floorY,
      viewpoint: roomView(room),
      look: { x: cx + (room.rot ? -1.6 : 1.6), z: cz + (room.rot ? -2.0 : 2.0) }
    };
  }
  return app.roomObjects;
}

function localRectToWorld(r, room, cx, cz) {
  // local x, z rotated by room.rot then translated
  let x0 = r.x0, x1 = r.x1, z0 = r.z0, z1 = r.z1;
  if (Math.abs(room.rot - Math.PI) < 0.01) {
    x0 = -r.x1; x1 = -r.x0;
    z0 = -r.z1; z1 = -r.z0;
  }
  return {
    x0: cx + x0, x1: cx + x1,
    z0: cz + z0, z1: cz + z1
  };
}
