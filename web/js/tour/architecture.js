import * as THREE from 'three';
import { MAT, TEX, std, textured } from './materials.js';
import { bbox, rbox, cyl, sphere, planeH, planeV, glow, textPlane, addPlant, bakeGroup } from './kit.js';
import { BUILDING, WING, SPA, LEVELS, ROOM_H, LOBBY_VOID, FLOOR_H, ROOM_LAYOUT, roomDoor } from './data.js';

const WALL = std('#ded6c7', 0.93);
const WALL_WARM = std('#e5ddce', 0.94);
const WALL_DARK = std('#b9ad9a', 0.92);
const BASE = std('#c9bfae', 0.9);
const PLASTER = std('#ebe4d7', 0.96);
const BRONZE = std('#6d5438', 0.32, 0.85, { envMapIntensity: 1.2 });
const TEAK = textured(TEX.teak, '#ffffff', 0.72);
const CARPET = textured(TEX.carpet, '#b3a996', 0.98);

function slab(parent, x0, x1, z0, z1, y, thickness = 0.28, mat = BASE) {
  bbox(parent, x1 - x0, thickness, z1 - z0, mat, (x0 + x1) / 2, y - thickness, (z0 + z1) / 2, 0, false);
}

function glassWall(parent, x0, x1, z, y, height, opts = {}) {
  const g = new THREE.Group();
  parent.add(g);
  const w = x1 - x0;
  const frame = opts.frame || BRONZE;
  const glass = opts.glass || MAT.windowGlass;
  // bottom and top rails
  bbox(g, w, 0.09, 0.10, frame, (x0 + x1) / 2, y + 0.02, z, 0, false);
  bbox(g, w, 0.08, 0.10, frame, (x0 + x1) / 2, y + height - 0.07, z, 0, false);
  // vertical mullions
  const bays = Math.max(1, Math.round(w / 1.55));
  for (let i = 0; i <= bays; i++) {
    const px = x0 + (w * i) / bays;
    bbox(g, 0.075, height, 0.11, frame, px, y, z, 0, false);
  }
  // glazing
  for (let i = 0; i < bays; i++) {
    const px = x0 + (w * (i + 0.5)) / bays;
    planeV(g, w / bays - 0.09, height - 0.14, glass, px, y + height / 2, z + 0.005, 0);
  }
  return g;
}

function solidWallX(parent, x0, x1, z, y, height, mat = WALL, thickness = 0.14) {
  bbox(parent, x1 - x0, height, thickness, mat, (x0 + x1) / 2, y, z, 0, true);
}

function solidWallZ(parent, z0, z1, x, y, height, mat = WALL, thickness = 0.14) {
  bbox(parent, thickness, height, z1 - z0, mat, x, y, (z0 + z1) / 2, 0, true);
}

/* ------------------------------------------------------------------ */
/* Exterior shell                                                      */
/* ------------------------------------------------------------------ */

export function buildShell(app) {
  const g = new THREE.Group();
  g.name = 'shell';
  app.scene.add(g);

  // Foundation + main floor plates
  bbox(g, 72, 0.55, 48, std('#a99f8f', 0.95), -1, -0.6, 1.5, 0, false);
  slab(g, BUILDING.x0 - 0.2, BUILDING.x1 + 0.2, BUILDING.z0 - 0.2, BUILDING.z1 + 0.2, 0.02, 0.40, BASE);
  // Floor 2 slab with the double-height lobby void
  slab(g, BUILDING.x0, LOBBY_VOID.x0, BUILDING.z0, BUILDING.z1, LEVELS[1].y, 0.28, BASE);
  slab(g, LOBBY_VOID.x1, BUILDING.x1, BUILDING.z0, BUILDING.z1, LEVELS[1].y, 0.28, BASE);
  slab(g, LOBBY_VOID.x0, LOBBY_VOID.x1, LOBBY_VOID.z1, BUILDING.z1, LEVELS[1].y, 0.28, BASE);
  slab(g, LOBBY_VOID.x0, LOBBY_VOID.x1, BUILDING.z0, LOBBY_VOID.z0, LEVELS[1].y, 0.28, BASE);
  // Floor 3 slab, with an opening for the stair from level 2
  {
    const hx0 = -3.9, hx1 = -0.9, hz0 = -15.4, hz1 = -12.4;
    slab(g, BUILDING.x0, hx0, BUILDING.z0, BUILDING.z1, LEVELS[2].y, 0.28, BASE);
    slab(g, hx1, BUILDING.x1, BUILDING.z0, BUILDING.z1, LEVELS[2].y, 0.28, BASE);
    slab(g, hx0, hx1, BUILDING.z0, hz0, LEVELS[2].y, 0.28, BASE);
    slab(g, hx0, hx1, hz1, BUILDING.z1, LEVELS[2].y, 0.28, BASE);
  }
  // Roof over third-floor rooms
  slab(g, BUILDING.x0, BUILDING.x1, -4.9, BUILDING.z1, LEVELS[2].y + FLOOR_H, 0.32, BASE);

  // Garden wing + spa pavilion roofs / slabs
  slab(g, WING.x0, WING.x1, WING.z0, WING.z1, 0.02, 0.36, BASE);
  slab(g, WING.x0, WING.x1, WING.z0, WING.z1, 3.42, 0.30, BASE);
  slab(g, SPA.x0, SPA.x1, SPA.z0, SPA.z1, 0.02, 0.36, BASE);
  slab(g, SPA.x0, SPA.x1, SPA.z0, SPA.z1, 3.42, 0.30, BASE);

  // North façade — ground floor glazed public rooms
  const northZ = BUILDING.z0;
  // solid piers
  for (const [x0, x1] of [[-30, -28], [-9.5, -7], [7, 9.5], [28, 30]]) {
    solidWallX(g, x0, x1, northZ, 0, 11.1, PLASTER, 0.38);
  }
  // ground lobby / restaurant / lounge glazing
  glassWall(g, -7, 7, northZ, 0.15, 3.35, { glass: MAT.windowGlass });
  glassWall(g, 9.5, 28, northZ, 0.15, 3.35);
  glassWall(g, -28, -9.5, northZ, 0.15, 3.35);
  // upper north façade with punched windows and plaster bands
  for (let f = 1; f < 3; f++) {
    const y = LEVELS[f].y;
    bbox(g, 60, 0.44, 0.34, PLASTER, 0, y + 3.12, northZ - 0.04, 0, true);
    for (let x = -27; x <= 27; x += 6) {
      bbox(g, 3.4, 2.0, 0.16, PLASTER, x, y + 0.55, northZ - 0.02, 0, false);
      bbox(g, 2.7, 1.55, 0.10, MAT.windowGlass, x, y + 0.80, northZ - 0.06, 0, false);
      bbox(g, 2.8, 0.05, 0.16, BRONZE, x, y + 0.78, northZ - 0.08, 0, false);
    }
    bbox(g, 60, 0.28, 0.34, BASE, 0, y - 0.10, northZ - 0.04, 0, true);
  }

  // East / west façades
  for (const side of [-1, 1]) {
    const x = side < 0 ? BUILDING.x0 : BUILDING.x1;
    for (let f = 0; f < 3; f++) {
      const y = LEVELS[f].y;
      bbox(g, 0.30, 3.4, 24, PLASTER, x, y, -6, 0, false);
      for (let z = -15; z <= 3; z += 6) {
        bbox(g, 0.12, 1.8, 3.0, MAT.windowGlass, x + side * 0.15, y + 0.8, z, 0, false);
        bbox(g, 0.16, 0.06, 3.1, BRONZE, x + side * 0.18, y + 0.78, z, 0, false);
      }
    }
  }

  // South façade over the pool — upper guest rooms
  for (let f = 1; f < 3; f++) {
    const y = LEVELS[f].y;
    const z = BUILDING.z1;
    slab(g, BUILDING.x0, BUILDING.x1, z, z + 0.8, y + 0.1, 0.22, BASE);
    glassWall(g, BUILDING.x0 + 0.2, BUILDING.x1 - 0.2, z, y + 0.08, 3.15, { glass: MAT.windowGlass });
    for (let x = BUILDING.x0; x <= BUILDING.x1; x += 4) {
      bbox(g, 0.09, 3.35, 0.22, PLASTER, x, y, z + 0.04, 0, false);
    }
    bbox(g, 60, 0.36, 0.34, PLASTER, 0, y + 3.08, z + 0.10, 0, false);
    bbox(g, 60, 0.26, 0.30, BASE, 0, y - 0.06, z + 0.10, 0, false);
  }
  // Ground floor south opening to the pool: just columns and deep threshold
  for (let x = -30; x <= 30; x += 10) {
    bbox(g, 0.65, 3.4, 0.65, PLASTER, x, 0, BUILDING.z1, 0, true);
  }
  bbox(g, 60, 0.32, 0.5, PLASTER, 0, 3.1, BUILDING.z1, 0, false);

  // Garden wing envelope
  for (const z of [WING.z0, WING.z1]) {
    for (let x = WING.x0; x < WING.x1; x += 7) {
      bbox(g, 0.5, 3.35, 0.30, PLASTER, x + 0.25, 0, z, 0, false);
    }
    bbox(g, WING.x1 - WING.x0, 0.28, 0.32, PLASTER, (WING.x0 + WING.x1) / 2, 3.15, z, 0, false);
  }
  solidWallZ(g, WING.z0, WING.z1, WING.x0, 0, 3.4, PLASTER, 0.3);
  // wing east wall with openings to pool colonnade
  for (let z = WING.z0; z < WING.z1; z += 5) {
    bbox(g, 0.30, 3.35, 0.45, PLASTER, WING.x1, 0, z + 0.22, 0, false);
    bbox(g, 0.16, 2.4, 3.9, MAT.windowGlass, WING.x1 + 0.06, 0.5, z + 2.5, 0, false);
  }
  // wing parapet / green roof edge
  bbox(g, WING.x1 - WING.x0 + 0.4, 0.55, 0.35, BASE, (WING.x0 + WING.x1) / 2, 3.45, WING.z0, 0, false);
  bbox(g, WING.x1 - WING.x0 + 0.4, 0.55, 0.35, BASE, (WING.x0 + WING.x1) / 2, 3.45, WING.z1, 0, false);

  // Spa pavilion envelope — a timber and glass garden room
  glassWall(g, SPA.x0, SPA.x1, SPA.z1, 0.1, 3.2, { frame: BRONZE, glass: MAT.windowGlass });
  solidWallZ(g, SPA.z0, SPA.z1, SPA.x1, 0, 3.4, PLASTER, 0.3);
  for (let z = SPA.z0; z < SPA.z1; z += 4) {
    bbox(g, 0.22, 3.3, 0.5, TEAK, SPA.x0, 0, z + 0.25, 0, false);
  }
  bbox(g, SPA.x1 - SPA.x0, 0.22, 0.30, TEAK, (SPA.x0 + SPA.x1) / 2, 3.22, SPA.z0, 0, false);
  // timber fins on the spa roof edge
  for (let x = SPA.x0; x <= SPA.x1; x += 0.55) {
    bbox(g, 0.07, 0.85, 0.35, TEAK, x, 3.42, SPA.z1, 0, false);
  }

  // Roof garden + skylight + solar panels
  const roofY = LEVELS[2].y + FLOOR_H;
  bbox(g, 60, 0.22, 0.5, BASE, 0, roofY, BUILDING.z1, 0, false);
  bbox(g, 0.5, 0.55, 11.2, BASE, BUILDING.x0, roofY, 0.5, 0, false);
  bbox(g, 0.5, 0.55, 11.2, BASE, BUILDING.x1, roofY, 0.5, 0, false);
  // Luminous lobby ceiling / skylight recess
  bbox(g, 8.0, 0.12, 3.2, std('#f2ead9', 0.8, 0, { emissive: '#ffe4b7', emissiveIntensity: 0.75 }), 0.4, LEVELS[2].y - 0.16, -8.4, 0, false);
  for (let i = 0; i < 6; i++) {
    bbox(g, 7.2, 0.03, 0.05, MAT.ledStrip, 0.4, LEVELS[2].y - 0.24, -9.6 + i * 0.48, 0, false);
  }
  // Roof planters and solar array
  for (let x = -24; x <= 24; x += 8) {
    bbox(g, 4.2, 0.35, 1.1, std('#5a5348', 0.9), x, roofY + 0.1, -7.2, 0, false);
    for (let i = 0; i < 5; i++) {
      bbox(g, 0.42, 0.34, 0.42, MAT.olive, x - 1.6 + i * 0.8, roofY + 0.46, -7.2, 0, false);
    }
  }
  for (let i = 0; i < 5; i++) {
    bbox(g, 2.4, 0.08, 1.4, std('#20323b', 0.3, 0.55), -20 + i * 3.0, roofY + 0.55, -10.5, 0.12, false);
  }

  // Parapet around the roof garden
  bbox(g, 60.6, 0.75, 0.3, PLASTER, 0, roofY, BUILDING.z0, 0, false);

  // Porte-cochère
  const canopyY = 3.15;
  bbox(g, 13, 0.35, 5.2, PLASTER, 0, canopyY, -20.5, 0, true);
  bbox(g, 13.4, 0.16, 5.5, TEAK, 0, canopyY + 0.35, -20.5, 0, false);
  for (const x of [-5.8, 5.8]) {
    bbox(g, 0.36, canopyY, 0.36, BRONZE, x, 0, -22.7);
    bbox(g, 0.5, 0.16, 0.5, BASE, x, 0, -22.7);
  }
  // warm downlights under the canopy
  for (let x = -4.2; x <= 4.2; x += 2.8) {
    cyl(g, 0.055, 0.055, 0.025, MAT.warmBulb, x, canopyY - 0.03, -20.3, 12);
    glow(g, x, canopyY - 0.1, -20.3, 0.85, '#ffd79a', 0.3);
  }
  textPlane(g, 'ROYAL HAVEN', 3.6, 0.55, 0, canopyY - 0.42, -22.93, 0, {
    fg: '#e7cf97', bg: 'transparent', border: null, font: '600 54px "Cinzel", serif', letter: 8, width: 1024, height: 160
  });
  textPlane(g, 'BOUTIQUE  &  SPA', 1.9, 0.22, 0, canopyY - 0.75, -22.93, 0, {
    fg: '#c5a869', bg: 'transparent', border: null, font: '500 22px "Plus Jakarta Sans", sans-serif', letter: 8, width: 768, height: 96
  });

  // Entrance doors — pivoted open
  for (const side of [-1, 1]) {
    const door = new THREE.Group();
    door.position.set(side * 0.08, 0, northZ + 0.06);
    door.rotation.y = side * 0.82;
    g.add(door);
    bbox(door, 1.25, 2.55, 0.08, MAT.windowGlass, side * 0.62, 0, 0, 0, false);
    bbox(door, 0.07, 2.6, 0.12, BRONZE, side * 1.25, 0, 0, 0, false);
  }
  bbox(g, 4.0, 0.10, 0.16, BRONZE, 0, 2.68, northZ + 0.02, 0, false);
  bbox(g, 2.8, 0.02, 1.1, std('#5d5549', 0.98), 0, 0.02, northZ + 0.65, 0, false);

  // Address / house plaque
  textPlane(g, '104', 0.42, 0.3, 3.2, 1.55, northZ - 0.22, Math.PI, {
    fg: '#d9c18d', bg: 'transparent', border: null, font: '500 74px "Playfair Display", serif', letter: 0, width: 256, height: 192
  });

  bakeGroup(g);
  app.shell = g;
  return g;
}

/* ------------------------------------------------------------------ */
/* Circulation: feature stair, glass lift, entrance welcome            */
/* ------------------------------------------------------------------ */

export function buildCirculation(app) {
  const g = new THREE.Group();
  g.name = 'circulation';
  app.scene.add(g);

  // Feature stair in the double-height lobby — two straight flights
  const stair = new THREE.Group();
  g.add(stair);
  const stepW = 1.8;
  const steps = 14;
  const rise = LEVELS[1].y / 14;
  const run = 0.615;
  const travertine = textured(TEX.travertine, '#d8d0c2', 0.55);

  const flight = (x, z0, y0, dir) => {
    for (let i = 0; i < steps; i++) {
      bbox(stair, stepW, rise, run, travertine, x, y0 + i * rise, z0 + dir * i * run, 0, false);
      // brass rail posts and glass infill on both sides
      if (i % 2 === 0) {
        for (const side of [-1, 1]) {
          cyl(stair, 0.017, 0.017, 1.0, MAT.brass, x + side * (stepW / 2 - 0.08), y0 + i * rise, z0 + dir * i * run, 8);
        }
      }
      for (const side of [-1, 1]) {
        bbox(stair, 0.035, 0.035, run + 0.02, MAT.brass, x + side * (stepW / 2 - 0.08), y0 + i * rise + 0.96, z0 + dir * i * run, 0, false);
        planeV(stair, run + 0.02, 0.78, std('#cfe0df', 0.1, 0, { transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }), x + side * (stepW / 2 - 0.08), y0 + i * rise + 0.55, z0 + dir * i * run + dir * run / 2, 0);
      }
    }
  };

  // Ground to level 2, rising north-to-south through the atrium
  flight(1.4, -13.55, 0, 1);
  // Level 2 landing + guard rails
  bbox(stair, stepW + 0.35, 0.22, 1.4, travertine, 1.4, LEVELS[1].y - 0.22, -4.75, 0, false);
  for (const side of [-1, 1]) {
    bbox(stair, 0.035, 0.035, 1.4, MAT.brass, 1.4 + side * (stepW / 2 + 0.12), LEVELS[1].y + 0.96, -4.75, 0, false);
    for (let z = -5.35; z <= -4.2; z += 0.4) {
      cyl(stair, 0.016, 0.016, 1.0, MAT.brass, 1.4 + side * (stepW / 2 + 0.12), LEVELS[1].y, z, 6);
    }
  }
  // Level 2 to level 3, returning north across the void
  flight(-2.4, -5.05, LEVELS[1].y, -1);
  // Level 3 landing
  bbox(stair, stepW + 0.35, 0.22, 2.6, travertine, -2.4, LEVELS[2].y - 0.22, -13.4, 0, false);
  for (const side of [-1, 1]) {
    bbox(stair, 0.035, 0.035, 2.6, MAT.brass, -2.4 + side * (stepW / 2 + 0.12), LEVELS[2].y + 0.96, -13.4, 0, false);
    for (let z = -14.7; z <= -12.1; z += 0.4) {
      cyl(stair, 0.016, 0.016, 1.0, MAT.brass, -2.4 + side * (stepW / 2 + 0.12), LEVELS[2].y, z, 6);
    }
  }
  // Sculptural chandelier
  const ch = new THREE.Group();
  ch.position.set(0.2, 7.0, -11.5);
  g.add(ch);
  cyl(ch, 0.012, 0.012, 2.6, MAT.blackMetal, 0, -2.6, 0, 6);
  for (let ring = 0; ring < 3; ring++) {
    const rad = 1.4 - ring * 0.32;
    const torus = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.025, 8, 48), MAT.brass);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = -ring * 0.32;
    ch.add(torus);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      sphere(ch, 0.035, MAT.warmBulb, Math.cos(a) * rad, -ring * 0.32 - 0.05, Math.sin(a) * rad, 8);
      glow(ch, Math.cos(a) * rad, -ring * 0.32 - 0.05, Math.sin(a) * rad, 0.38, '#ffd9a0', 0.35);
    }
  }

  // Glass lift shaft
  const shaft = new THREE.Group();
  g.add(shaft);
  bbox(shaft, 3.2, 0.15, 2.9, BASE, 4.6, 0, -4.9, 0, false);
  // corner posts
  for (const x of [3.0, 6.2]) for (const z of [-6.3, -3.5]) {
    bbox(shaft, 0.10, 11.0, 0.10, BRONZE, x, 0, z);
  }
  // glass panels
  for (const x of [3.0, 6.2]) {
    for (const y of [0, 3.7, 7.4]) {
      planeV(shaft, 2.7, 3.4, MAT.windowGlass, x, y + 1.75, -4.9, Math.PI / 2);
    }
  }
  for (const z of [-6.3, -3.5]) {
    for (const y of [0, 3.7, 7.4]) {
      planeV(shaft, 3.15, 3.4, MAT.windowGlass, 4.6, y + 1.75, z, 0);
    }
  }
  // Cabin
  const cabin = new THREE.Group();
  cabin.position.set(4.6, 0.05, -4.9);
  g.add(cabin);
  bbox(cabin, 2.75, 0.08, 2.45, textured(TEX.marble, '#d9d2c5', 0.4), 0, 0, 0, 0, false);
  bbox(cabin, 2.75, 0.06, 2.45, MAT.brass, 0, 2.25, 0, 0, false);
  for (const x of [-1.3, 1.3]) for (const z of [-1.15, 1.15]) {
    bbox(cabin, 0.07, 2.3, 0.07, MAT.brass, x, 0.05, z);
  }
  // mirrors on the back
  planeV(cabin, 2.4, 2.0, MAT.mirror, 0, 1.25, -1.18, 0);
  bbox(cabin, 0.75, 0.10, 0.03, MAT.brass, 0, 1.45, -1.20, 0, false);
  textPlane(cabin, '3', 0.24, 0.24, 0, 1.9, -1.19, 0, { fg: '#f3d995', bg: 'rgba(10,12,16,.75)', border: null, font: '500 70px "Playfair Display", serif', width: 128, height: 128 });
  app.liftCabin = cabin;

  // Lift doors at each level
  for (let f = 1; f <= 3; f++) {
    const y = LEVELS[f - 1].y;
    const floorGroup = app.floorGroups[f];
    const doorGroup = new THREE.Group();
    doorGroup.position.set(4.6, y + 0.02, -3.47);
    floorGroup.add(doorGroup);
    bbox(doorGroup, 2.55, 2.36, 0.08, textured(TEX.walnut, '#6b523c', 0.45), 0, 0, 0, 0, false);
    for (const side of [-1, 1]) {
      bbox(doorGroup, 1.22, 2.28, 0.03, std('#af9b7a', 0.25, 0.72), side * 0.63, 0.04, 0.05, 0, false);
      bbox(doorGroup, 0.025, 2.28, 0.035, MAT.brass, side * 0.025, 0.04, 0.07, 0, false);
    }
    bbox(doorGroup, 0.05, 0.42, 0.03, std('#1a1a1a', 0.4), 1.42, 1.2, 0.08, 0, false);
    textPlane(doorGroup, `L${f}`, 0.22, 0.13, 1.42, 1.48, 0.095, 0, {
      fg: '#ffd9a0', bg: 'rgba(10,12,16,.8)', border: 'rgba(197,168,105,.3)', font: '600 22px "Plus Jakarta Sans"', width: 128, height: 80
    });
    const hs = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.5, 0.4), new THREE.MeshBasicMaterial({ visible: false }));
    hs.position.set(4.6, y + 1.25, -3.2);
    hs.userData.hotspot = { kind: 'lift' };
    hs.userData.noBake = true;
    floorGroup.add(hs);
    app.interactives.push(hs);
  }

  // Lift signage
  textPlane(g, 'LIFT', 0.52, 0.16, 6.6, 2.75, -4.1, 0, {
    fg: '#e7cf97', bg: 'rgba(10,13,19,.82)', border: 'rgba(197,168,105,.35)', font: '600 24px "Plus Jakarta Sans"', letter: 5, width: 256, height: 80
  });

  // Gallery guard rails around the lobby void
  for (let f = 1; f <= 2; f++) {
    const y = LEVELS[f].y + 0.08;
    const floorGroup = app.floorGroups[f];
    const rail = new THREE.Group();
    floorGroup.add(rail);
    const sides = [
      { x0: -7, x1: 7, z: -6, rz: 0 },
      { x0: -7, x1: 7, z: -17, rz: 0 },
      { x: -7, z0: -17, z1: -6, rz: Math.PI / 2 },
      { x: 7, z0: -17, z1: -6, rz: Math.PI / 2 }
    ];
    for (const s of sides) {
      if (s.rz === 0) {
        const len = s.x1 - s.x0;
        bbox(rail, len, 0.05, 0.05, MAT.brass, (s.x0 + s.x1) / 2, y + 0.95, s.z, 0, false);
        planeV(rail, len, 0.9, std('#bcd7d5', 0.08, 0, { transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }), (s.x0 + s.x1) / 2, y + 0.48, s.z, 0);
        for (let x = s.x0; x <= s.x1; x += 1.0) cyl(rail, 0.015, 0.015, 0.95, MAT.brass, x, y, s.z, 6);
      } else {
        const len = s.z1 - s.z0;
        bbox(rail, 0.05, 0.05, len, MAT.brass, s.x, y + 0.95, (s.z0 + s.z1) / 2, 0, false);
        planeV(rail, len, 0.9, std('#bcd7d5', 0.08, 0, { transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }), s.x, y + 0.48, (s.z0 + s.z1) / 2, Math.PI / 2);
        for (let z = s.z0; z <= s.z1; z += 1.0) cyl(rail, 0.015, 0.015, 0.95, MAT.brass, s.x, y, z, 6);
      }
    }
  }

  bakeGroup(g);
  app.circulation = g;
  return g;
}

/* ------------------------------------------------------------------ */
/* Per-floor corridor shells and doors                                 */
/* ------------------------------------------------------------------ */

export function addSwingDoor(parent, opts) {
  const { x, z, width = 1.06, height = 2.16, y = 0, openSign = -1, mat, hotspot, hinge = -1 } = opts;
  const g = new THREE.Group();
  g.position.set(x + hinge * width / 2, y + 0.02, z);
  parent.add(g);
  const leaf = new THREE.Group();
  g.add(leaf);
  bbox(leaf, width, height, 0.06, mat, -hinge * width / 2, 0, 0);
  bbox(leaf, width - 0.16, height - 0.24, 0.02, std('#6b5138', 0.5), -hinge * width / 2, 0.10, 0.045, 0, false);
  // brass lever + card reader
  bbox(leaf, 0.15, 0.03, 0.03, MAT.brass, -hinge * (width - 0.18), 1.02, 0.09, 0, false);
  bbox(leaf, 0.03, 0.15, 0.03, MAT.brass, -hinge * (width - 0.18), 0.94, 0.09, 0, false);
  bbox(leaf, 0.11, 0.17, 0.02, MAT.blackGloss, -hinge * (width - 0.18), 1.32, 0.085, 0, false);
  bbox(leaf, 0.018, 0.018, 0.005, MAT.warmBulb, -hinge * (width - 0.18), 1.39, 0.098, 0, false);
  g.userData.door = { angle: 0, target: 0, openSign, leaf, hotspot };
  leaf.traverse(o => {
    if (!o.isMesh) return;
    o.userData.noBake = true;
    if (hotspot) {
      o.userData.hotspot = hotspot;
      doorInteractiveMeshes.push(o);
    }
  });
  if (hotspot) {
    leaf.userData.hotspot = hotspot;
    parent.userData.doors = parent.userData.doors || [];
    parent.userData.doors.push(g);
  }
  app_door_register(g);
  return g;
}

const doorRegistry = [];
const doorInteractiveMeshes = [];
function app_door_register(g) { doorRegistry.push(g); }
export function getDoors() { return doorRegistry; }

export function buildCorridors(app) {
  for (let f = 1; f <= 3; f++) {
    const y = LEVELS[f - 1].y;
    const group = app.floorGroups[f];
    const carpet = textured(TEX.carpet, f === 1 ? '#a99f8d' : f === 2 ? '#a9a08f' : '#a39b8b', 0.98);
    // South corridor / room landing
    const z0 = -4.8, z1 = -0.82;
    const x0 = f === 1 ? -30 : -30.2, x1 = f === 1 ? 30 : 30.2;
    planeH(group, x1 - x0, z1 - z0, carpet, (x0 + x1) / 2, y + 0.015, (z0 + z1) / 2);
    bbox(group, x1 - x0, 0.10, 0.08, MAT.agedBrass, (x0 + x1) / 2, y + 0.01, z1 - 0.08, 0, false);
    // corridor ceiling
    planeH(group, x1 - x0, z1 - z0, std('#e9e2d5', 0.96), (x0 + x1) / 2, y + 3.30, (z0 + z1) / 2).rotation.x = Math.PI / 2;
    // wall to public north
    solidWallX(group, x0, x1, z0, y, 3.34, f === 3 ? WALL_WARM : WALL, 0.16);
    // end walls
    solidWallZ(group, z0, z1, x0, y, 3.34, WALL, 0.14);
    solidWallZ(group, z0, z1, x1, y, 3.34, WALL, 0.14);

    // paint / panelling along corridor
    bbox(group, x1 - x0, 0.95, 0.03, textured(TEX.walnut, f === 1 ? '#7a5c42' : f === 2 ? '#6f523b' : '#654b38', 0.62), (x0 + x1) / 2, y + 0.10, z0 + 0.10, 0, false);
    bbox(group, x1 - x0, 0.05, 0.03, MAT.agedBrass, (x0 + x1) / 2, y + 1.05, z0 + 0.11, 0, false);

    // corridor wall along the guest rooms with door openings
    if (f > 1) {
      const doors = ROOM_LAYOUT.filter(r => r.floor === f);
      createRoomWall(group, x0, x1, z1, y, doors, f);
      // light coves and sconces
      for (let x = x0 + 2; x < x1; x += 4.2) {
        cyl(group, 0.045, 0.045, 0.02, MAT.warmBulb, x, y + 3.27, (z0 + z1) / 2, 10);
        glow(group, x, y + 3.18, (z0 + z1) / 2, 0.55, '#ffd9a0', 0.22);
      }
      for (let x = x0 + 4; x < x1; x += 8.4) {
        // slim console and art in the corridor
        bbox(group, 1.1, 0.06, 0.34, textured(TEX.walnut, '#694d37', 0.6), x, y + 0.82, z0 + 0.28);
        bbox(group, 0.05, 0.80, 0.05, MAT.agedBrass, x - 0.48, y + 0.03, z0 + 0.28);
        bbox(group, 0.05, 0.80, 0.05, MAT.agedBrass, x + 0.48, y + 0.03, z0 + 0.28);
        bbox(group, 0.36, 0.52, 0.05, MAT.agedBrass, x, y + 1.32, z0 + 0.10, 0, false);
        planeV(group, 0.30, 0.46, std('#6f7c6c', 0.75), x, y + 1.32, z0 + 0.13, 0);
      }
    } else {
      // Ground floor: west corridor to garden wing and the public hall
      createRoomWall(group, -30, 30, z1, y, ROOM_LAYOUT.filter(r => r.floor === 1), 1);
    }
  }

  // Ground wing corridor
  const wingGroup = app.floorGroups[1];
  // corridor from public hall to wing (covered colonnade)
  planeH(wingGroup, 2.5, 8.7, textured(TEX.travertine, '#d4cbbb', 0.72), -8.5, 0.02, 9.8);
  for (let z = 6.4; z <= 14.2; z += 2.4) {
    bbox(wingGroup, 0.25, 3.0, 0.25, TEAK, -9.6, 0, z);
    bbox(wingGroup, 0.25, 3.0, 0.25, TEAK, -7.4, 0, z);
  }
  bbox(wingGroup, 2.6, 0.22, 8.8, TEAK, -8.5, 3.05, 9.8, 0, false);
  for (let z = 7.2; z < 14; z += 2.5) {
    cyl(wingGroup, 0.05, 0.05, 0.02, MAT.warmBulb, -8.5, 2.98, z, 10);
    glow(wingGroup, -8.5, 2.9, z, 0.5, '#ffd9a0', 0.25);
  }

  // Wing corridor floor
  planeH(wingGroup, 21.5, 2.5, CARPET, -21, 0.018, 13.2);
  // Wing corridor ceiling
  planeH(wingGroup, 21.5, 2.5, std('#e8e1d4', 0.96), -21, 3.28, 13.2).rotation.x = Math.PI / 2;
  // Wing corridor walls with room doors
  createRoomWall(wingGroup, -32, -10, 12.0, 0, ROOM_LAYOUT.filter(r => r.floor === 1 && r.z1 <= 12), 1, true);
  createRoomWall(wingGroup, -32, -10, 14.4, 0, ROOM_LAYOUT.filter(r => r.floor === 1 && r.z0 >= 14), 1, true);

  // Wing corridor south/north wall accents
  for (let x = -30; x <= -12; x += 6) {
    bbox(wingGroup, 0.32, 0.55, 0.04, MAT.agedBrass, x, 2.1, 12.08, 0, false);
    bbox(wingGroup, 0.30, 0.44, 0.04, std('#77826c', 0.8), x, 2.14, 14.32, 0, false);
  }
}

function createRoomWall(parent, x0, x1, z, y, rooms, floor, alongX = true) {
  const sorted = rooms.slice().sort((a, b) => a.x0 - b.x0);
  let cursor = x0;
  for (const r of sorted) {
    const door = roomDoor(r);
    const dx = door.x;
    const openW = 1.08;
    if (dx - openW / 2 > cursor) {
      bbox(parent, dx - openW / 2 - cursor, 3.34, 0.16, WALL, (cursor + dx - openW / 2) / 2, y, z);
    }
    // lintel above the door
    bbox(parent, openW, 3.34 - 2.24, 0.16, WALL, dx, y + 2.24, z);
    cursor = dx + openW / 2;
    // Door leaf
    const openSign = r.rot ? 1 : -1;
    const parentDoor = new THREE.Group();
    parent.add(parentDoor);
    const dg = addSwingDoor(parentDoor, {
      x: dx, z, width: openW, y, openSign,
      mat: textured(TEX.walnut, '#6c4e37', 0.52),
      hotspot: { kind: 'room', id: r.number },
      hinge: r.rot ? -1 : -1
    });
    dg.userData.room = r.number;
    dg.userData.floor = floor;
    // Number plaque and small brass pin
    const plaqueX = dx + (r.rot ? 0.78 : -0.78);
    const rot = 0;
    bbox(parent, 0.30, 0.30, 0.035, MAT.agedBrass, plaqueX, y + 1.44, z - 0.10, 0, false);
    textPlane(parent, r.number, 0.23, 0.23, plaqueX, y + 1.59, z - 0.13, 0, {
      fg: '#f0dfb2', bg: 'rgba(9,13,18,0.9)', border: null,
      font: '500 84px "Playfair Display", serif', letter: 0, width: 256, height: 256
    });
    sphere(parent, 0.022, MAT.warmBulb, dx + (r.rot ? -0.72 : 0.72), y + 1.36, z - 0.12, 8);
  }
  const last = sorted[sorted.length - 1];
  if (last) {
    const end = last.x1;
    if (x1 > end) bbox(parent, x1 - end, 3.34, 0.16, WALL, (end + x1) / 2, y, z);
  }
  if (sorted.length === 0) bbox(parent, x1 - x0, 3.34, 0.16, WALL, (x0 + x1) / 2, y, z);
}

export function finaliseArchitecture(app) {
  for (const f of [1, 2, 3]) {
    const g = app.floorGroups[f];
    if (g) bakeGroup(g);
  }
  // Door leaves stay unbaked so they can swing and be picked by the raycaster.
  for (const mesh of doorInteractiveMeshes) {
    if (!app.interactives.includes(mesh)) app.interactives.push(mesh);
  }
  app.doors = doorRegistry;
  return doorRegistry;
}
