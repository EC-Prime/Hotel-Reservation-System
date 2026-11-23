import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  MAT, TEX, std, textured, emissive, paletteArt, paletteRug
} from './materials.js';
import { makeLabelTexture, makeNumberTexture } from './textures.js';

/* ------------------------------------------------------------------ */
/* Primitive helpers                                                    */
/* ------------------------------------------------------------------ */

export function bbox(parent, w, h, d, mat, x = 0, y = 0, z = 0, ry = 0, cast = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y + h / 2, z);
  mesh.rotation.y = ry;
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function rbox(parent, w, h, d, radius, mat, x = 0, y = 0, z = 0, ry = 0, cast = true) {
  const geo = new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, Math.min(w, h, d) / 2 - 0.001));
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y + h / 2, z);
  mesh.rotation.y = ry;
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function cyl(parent, rt, rb, h, mat, x = 0, y = 0, z = 0, seg = 16, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  mesh.position.set(x, y + h / 2, z);
  mesh.rotation.y = ry;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function sphere(parent, r, mat, x, y, z, seg = 12) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg / 2)), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function planeH(parent, w, d, mat, x, y, z, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = ry;
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function planeV(parent, w, h, mat, x, y, z, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function glow(parent, x, y, z, size = 0.7, color = '#ffd9a0', opacity = 0.7) {
  const mat = new THREE.SpriteMaterial({
    map: TEX.glow, color: new THREE.Color(color), transparent: true,
    opacity, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const s = new THREE.Sprite(mat);
  s.position.set(x, y, z);
  s.scale.setScalar(size);
  s.userData.noBake = true;
  parent.add(s);
  return s;
}

export function textPlane(parent, text, w, h, x, y, z, ry = 0, opts = {}) {
  const tex = makeLabelTexture(text, opts);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false,
    side: THREE.DoubleSide, opacity: opts.opacity ?? 1
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  mesh.userData.noBake = true;
  parent.add(mesh);
  return mesh;
}

export function numberPlane(parent, number, size, x, y, z, ry = 0) {
  const tex = makeNumberTexture(number, 'ROYAL HAVEN');
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  parent.add(mesh);
  return mesh;
}

/* ------------------------------------------------------------------ */
/* Joinery and small details                                           */
/* ------------------------------------------------------------------ */

export function addArt(parent, w, h, x, y, z, ry, palette, variant = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, w + 0.09, h + 0.09, 0.045, MAT.agedBrass, 0, -h / 2 - 0.045, 0, 0, false);
  const mat = textured(paletteArt(palette, variant), '#ffffff', 0.9);
  planeV(g, w, h, mat, 0, 0, 0.03);
  return g;
}

export function addMirror(parent, w, h, x, y, z, ry) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, w + 0.06, h + 0.06, 0.04, MAT.brass, 0, -h / 2, 0, 0, false);
  planeV(g, w, h, MAT.mirror, 0, 0, 0.025);
  return g;
}

export function addLamp(parent, x, yBase, z, scale = 1, shade = true) {
  const g = new THREE.Group();
  g.position.set(x, yBase, z);
  g.scale.setScalar(scale);
  parent.add(g);
  cyl(g, 0.10, 0.12, 0.035, MAT.brass, 0, 0, 0, 16);
  cyl(g, 0.016, 0.016, 0.46, MAT.brass, 0, 0.03, 0, 8);
  if (shade) {
    cyl(g, 0.16, 0.23, 0.27, MAT.linenShade, 0, 0.44, 0, 24);
    glow(g, 0, 0.58, 0, 0.72, '#ffd79a', 0.58);
    sphere(g, 0.035, MAT.warmBulb, 0, 0.57, 0, 8);
  }
  return g;
}

export function addWallSconce(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, 0.12, 0.20, 0.05, MAT.agedBrass, 0, -0.10, 0, 0, false);
  cyl(g, 0.09, 0.13, 0.18, MAT.linenShade, 0, -0.20, 0.08, 16);
  glow(g, 0, -0.12, 0.1, 0.46, '#ffd79a', 0.45);
  return g;
}

export function addBooks(parent, x, y, z, ry = 0, count = 5, palette = null) {
  const colors = palette ? [palette.accent, palette.textile, palette.woodDark, palette.accentSoft, '#d8c8a9'] : ['#7c6757', '#6e7450', '#a45f42', '#d8c8a9', '#4f5d66'];
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  let px = 0;
  for (let i = 0; i < count; i++) {
    const w = 0.035 + Math.random() * 0.035;
    const h = 0.22 + Math.random() * 0.10;
    const mat = std(colors[i % colors.length], 0.82, 0);
    bbox(g, w, h, 0.16 + Math.random() * 0.05, mat, px, 0, 0, 0, false);
    px += w + 0.012;
  }
  return g;
}

export function addPlant(parent, x, z, scale = 1, potMat = MAT.terracotta) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(scale);
  parent.add(g);
  cyl(g, 0.22, 0.17, 0.32, potMat, 0, 0, 0, 18);
  planeH(g, 0.36, 0.36, MAT.soil, 0, 0.315, 0);
  cyl(g, 0.022, 0.03, 0.55, std('#5a4a32', 0.95), 0, 0.3, 0, 7);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.44, 5), MAT.olive);
    leaf.position.set(Math.cos(a) * 0.16, 0.76 + (i % 3) * 0.06, Math.sin(a) * 0.16);
    leaf.rotation.z = Math.cos(a) * 0.7;
    leaf.rotation.x = Math.sin(a) * 0.7;
    g.add(leaf);
  }
  return g;
}

export function addFlowers(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  cyl(g, 0.075, 0.055, 0.18, MAT.ceramic, 0, 0, 0, 14);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.3;
    cyl(g, 0.006, 0.006, 0.30, std('#55704a', 0.9), Math.cos(a) * 0.035, 0.14, Math.sin(a) * 0.035, 5);
    sphere(g, 0.035 + Math.random() * 0.02, std(i % 2 ? '#d6b98d' : '#ece4d2', 0.9), Math.cos(a) * 0.07, 0.43, Math.sin(a) * 0.07, 8);
  }
  return g;
}

export function addTray(parent, x, y, z, palette) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  bbox(g, 0.46, 0.025, 0.32, MAT.agedBrass, 0, 0, 0, 0, false);
  cyl(g, 0.035, 0.045, 0.11, MAT.ceramic, -0.1, 0.03, 0.02, 12);
  cyl(g, 0.038, 0.045, 0.075, MAT.glass, 0.09, 0.03, -0.04, 12);
  cyl(g, 0.05, 0.05, 0.16, std('#496044', 0.25, 0.1), 0.14, 0.03, 0.07, 12);
  return g;
}

/* ------------------------------------------------------------------ */
/* Seating and tables                                                  */
/* ------------------------------------------------------------------ */

export function addArmchair(parent, x, z, ry = 0, palette, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  g.scale.setScalar(scale);
  parent.add(g);
  const fabric = textured(TEX.boucle, palette.accentSoft, 0.96);
  const wood = textured(TEX.walnut, '#8a6a4d', 0.7);
  bbox(g, 0.78, 0.16, 0.78, fabric, 0, 0.28, 0);
  rbox(g, 0.72, 0.12, 0.68, 0.04, textured(TEX.linen, '#f0e9dc', 0.96), 0, 0.40, 0.02);
  rbox(g, 0.72, 0.74, 0.16, 0.06, fabric, 0, 0.42, -0.32);
  bbox(g, 0.12, 0.38, 0.66, fabric, -0.37, 0.42, 0);
  bbox(g, 0.12, 0.38, 0.66, fabric, 0.37, 0.42, 0);
  for (const sx of [-0.30, 0.30]) for (const sz of [-0.28, 0.28]) {
    cyl(g, 0.025, 0.035, 0.28, wood, sx, 0, sz, 6);
  }
  rbox(g, 0.28, 0.28, 0.10, 0.04, std(palette.textile, 0.85), 0.16, 0.55, -0.17, 0.2);
  return g;
}

export function addSofa(parent, x, z, w, ry, palette, depth = 0.9) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  const fabric = textured(TEX.velvet, palette.textile, 0.92);
  const wood = textured(TEX.walnut, '#6d5039', 0.7);
  bbox(g, w, 0.22, depth, fabric, 0, 0.26, 0);
  for (let i = 0; i < 3; i++) {
    const cw = (w - 0.2) / 3;
    rbox(g, cw - 0.03, 0.16, depth - 0.18, 0.04, textured(TEX.linen, '#e6ddcd', 0.96), -w / 2 + 0.1 + cw * (i + 0.5), 0.46, 0.04);
  }
  rbox(g, w - 0.1, 0.55, 0.16, 0.05, fabric, 0, 0.50, -depth / 2 + 0.08);
  bbox(g, 0.16, 0.48, depth, fabric, -w / 2 + 0.08, 0.30, 0);
  bbox(g, 0.16, 0.48, depth, fabric, w / 2 - 0.08, 0.30, 0);
  for (let i = 0; i < 2; i++) {
    rbox(g, 0.36, 0.34, 0.10, 0.04, std(palette.accent, 0.88), w * 0.23 * (i ? 1 : -1), 0.55, -depth / 2 + 0.2, 0.1 * (i ? -1 : 1));
  }
  for (const sx of [-w / 2 + 0.2, w / 2 - 0.2]) for (const sz of [-depth / 2 + 0.15, depth / 2 - 0.15]) {
    cyl(g, 0.025, 0.035, 0.26, wood, sx, 0, sz, 6);
  }
  return g;
}

export function addCoffeeTable(parent, x, z, w = 1.1, d = 0.62, palette, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, w, 0.06, d, textured(TEX.marble, '#ece6db', 0.35), 0, 0.38, 0);
  bbox(g, w - 0.12, 0.04, d - 0.12, MAT.brass, 0, 0.34, 0, 0, false);
  for (const sx of [-w / 2 + 0.08, w / 2 - 0.08]) {
    for (const sz of [-d / 2 + 0.08, d / 2 - 0.08]) {
      cyl(g, 0.018, 0.022, 0.36, MAT.agedBrass, sx, 0, sz, 6);
    }
  }
  addBooks(g, -0.22, 0.44, 0.04, 0.2, 3, palette);
  addFlowers(g, 0.26, 0.44, -0.02);
  return g;
}

export function addSideTable(parent, x, z, palette) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  parent.add(g);
  cyl(g, 0.30, 0.28, 0.045, textured(TEX.marble, '#e4ddd1', 0.4), 0, 0.48, 0, 24);
  cyl(g, 0.035, 0.05, 0.48, MAT.agedBrass, 0, 0, 0, 8);
  cyl(g, 0.22, 0.22, 0.03, MAT.agedBrass, 0, 0, 0, 24);
  addTray(g, 0, 0.53, 0, palette);
  return g;
}

export function addDesk(parent, x, z, ry, palette, w = 1.35) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  const wood = textured(TEX.walnut, palette.wood, 0.62);
  bbox(g, w, 0.055, 0.56, wood, 0, 0.74, 0);
  bbox(g, w - 0.1, 0.15, 0.48, wood, 0, 0.55, -0.02);
  for (const sx of [-w / 2 + 0.06, w / 2 - 0.06]) {
    bbox(g, 0.05, 0.74, 0.05, MAT.agedBrass, sx, 0, 0.22);
  }
  addLamp(g, -w / 2 + 0.25, 0.80, 0.02, 0.8);
  bbox(g, 0.26, 0.02, 0.34, MAT.paper, 0.14, 0.80, 0.04, -0.12);
  bbox(g, 0.01, 0.01, 0.16, MAT.blackGloss, 0.32, 0.82, 0.04, 0.4, false);
  addBooks(g, 0.38, 0.80, -0.18, 0.3, 2, palette);
  // Chair
  const c = new THREE.Group();
  c.position.set(0.02, 0, 0.55);
  g.add(c);
  rbox(c, 0.48, 0.08, 0.46, 0.04, textured(TEX.leather, palette.textileSoft, 0.7), 0, 0.44, 0);
  rbox(c, 0.46, 0.50, 0.08, 0.04, textured(TEX.leather, palette.textileSoft, 0.7), 0, 0.48, 0.22);
  for (const sx of [-0.2, 0.2]) for (const sz of [-0.18, 0.18]) {
    cyl(c, 0.018, 0.024, 0.42, MAT.agedBrass, sx, 0, sz, 6);
  }
  return g;
}

export function addWardrobe(parent, x, z, ry, palette, w = 1.55, h = 2.18, d = 0.58) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  const wood = textured(TEX.walnut, palette.wood, 0.55);
  bbox(g, w, h, d, wood, 0, 0.02, 0);
  bbox(g, w - 0.06, h - 0.1, 0.02, std(palette.woodDark, 0.6), 0, 0.06, d / 2 + 0.005, 0, false);
  const doorW = (w - 0.12) / 2;
  for (let side = 0; side < 2; side++) {
    const dx = -w / 4 + side * w / 2;
    bbox(g, doorW - 0.02, h - 0.16, 0.035, wood, dx, 0.09, d / 2 + 0.025);
    for (let i = 0; i < 7; i++) {
      bbox(g, 0.024, h - 0.3, 0.012, std(palette.woodDark, 0.65), dx - doorW / 2 + 0.09 + i * (doorW - 0.18) / 6, 0.16, d / 2 + 0.045, 0, false);
    }
    cyl(g, 0.014, 0.014, 0.22, MAT.brass, dx + (side ? -0.16 : 0.16), 1.02, d / 2 + 0.06, 8);
  }
  bbox(g, w + 0.08, 0.07, d + 0.08, MAT.agedBrass, 0, h + 0.02, 0);
  // A folded robe and slippers peeking in the open side
  rbox(g, 0.24, 0.06, 0.30, 0.03, MAT.towel, w / 2 - 0.22, 1.2, d / 2 + 0.03);
  bbox(g, 0.24, 0.018, 0.09, MAT.towel, w / 2 - 0.22, 1.26, d / 2 + 0.05, 0.08, false);
  return g;
}

export function addTV(parent, x, y, z, ry, w = 1.18) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, w + 0.04, w * 0.58 + 0.04, 0.055, MAT.blackGloss, 0, 0, 0, 0, false);
  const screen = planeV(g, w, w * 0.58, std('#0b1114', 0.13, 0.3, { emissive: '#11262b', emissiveIntensity: 0.5 }), 0, 0, 0.032);
  screen.userData.noBake = true;
  bbox(g, w * 0.7, 0.055, 0.10, MAT.blackMetal, 0, -w * 0.29 - 0.09, 0.02, 0, false);
  bbox(g, 0.28, 0.035, 0.06, MAT.blackMetal, 0, -w * 0.29 - 0.04, 0.02, 0, false);
  return g;
}

/* ------------------------------------------------------------------ */
/* Bed and bedside                                                     */
/* ------------------------------------------------------------------ */

export function addBed(parent, x, z, ry, palette, bedWidth = 1.8, style = 'channel') {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  const length = 2.08;
  const wood = textured(TEX.walnut, palette.wood, 0.55);
  const dark = textured(TEX.walnut, palette.woodDark, 0.65);

  // Base and headboard
  bbox(g, length + 0.16, 0.30, bedWidth + 0.12, dark, 0.02, 0.03, 0);
  bbox(g, length + 0.08, 0.10, bedWidth + 0.08, wood, 0.02, 0.31, 0);
  const headX = -length / 2 - 0.08;
  bbox(g, 0.10, 1.22, bedWidth + 0.34, dark, headX, 0.20, 0, 0, true);
  if (style === 'channel') {
    for (let i = 0; i < 4; i++) {
      rbox(g, 0.16, 0.245, bedWidth + 0.30, 0.04, textured(TEX.velvet, palette.accentSoft, 0.9), headX + 0.075, 0.30 + i * 0.255, 0, 0, false);
    }
  } else {
    for (let i = 0; i < 13; i++) {
      bbox(g, 0.06, 1.10, (bedWidth + 0.30) / 13 - 0.012, wood, headX + 0.07, 0.27, -bedWidth / 2 - 0.15 + ((bedWidth + 0.30) / 13) * (i + 0.5), 0, false);
    }
  }

  // Mattress + linen layers
  rbox(g, length, 0.26, bedWidth, 0.06, MAT.whiteLinen, 0.02, 0.38, 0);
  rbox(g, length + 0.04, 0.055, bedWidth + 0.04, 0.02, MAT.ivoryLinen, 0.02, 0.61, 0);
  rbox(g, length * 0.82, 0.15, bedWidth + 0.10, 0.05, MAT.duvet, 0.16, 0.63, 0);
  // Folded sheet at the head of the duvet
  rbox(g, 0.48, 0.055, bedWidth + 0.12, 0.02, MAT.towel, -0.26, 0.755, 0);
  // Textured runner across the foot
  bbox(g, 0.56, 0.035, bedWidth + 0.16, textured(paletteRug(palette, 1), '#ffffff', 0.96), 0.62, 0.76, 0, 0, false);
  // Draped throw at one corner
  rbox(g, 0.64, 0.06, 0.48, 0.02, std(palette.textile, 0.94), 0.50, 0.77, bedWidth / 2 - 0.15, 0.12);
  bbox(g, 0.60, 0.35, 0.045, std(palette.textile, 0.94), 0.50, 0.43, bedWidth / 2 + 0.07, 0, false);

  // Pillows
  const px = -length / 2 + 0.34;
  const pillowW = bedWidth > 1.5 ? 0.62 : 0.56;
  const positions = bedWidth > 1.5 ? [-0.32, 0.32] : [0];
  for (const pz of positions) {
    rbox(g, 0.44, 0.16, pillowW, 0.07, MAT.whiteLinen, px, 0.77, pz, 0.03);
    rbox(g, 0.30, 0.13, pillowW * 0.78, 0.05, MAT.towel, px + 0.06, 0.86, pz, -0.05);
  }
  if (bedWidth > 1.5) {
    rbox(g, 0.20, 0.26, 0.42, 0.06, std(palette.textileSoft, 0.94), px + 0.24, 0.80, 0.0, 0.2);
    rbox(g, 0.20, 0.24, 0.38, 0.06, std(palette.accent, 0.94), px + 0.28, 0.82, -0.02, -0.16);
  }
  // Reading lights built into the headboard
  cyl(g, 0.035, 0.045, 0.035, MAT.brass, headX + 0.12, 0.98, -bedWidth / 2 + 0.18, 12);
  cyl(g, 0.035, 0.045, 0.035, MAT.brass, headX + 0.12, 0.98, bedWidth / 2 - 0.18, 12);
  glow(g, headX + 0.16, 1.02, -bedWidth / 2 + 0.18, 0.36, '#ffd79a', 0.4);
  glow(g, headX + 0.16, 1.02, bedWidth / 2 - 0.18, 0.36, '#ffd79a', 0.4);
  return g;
}

export function addNightstand(parent, x, z, ry, palette, lamp = true) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  const wood = textured(TEX.walnut, palette.wood, 0.58);
  bbox(g, 0.52, 0.52, 0.44, wood, 0, 0.02, 0);
  bbox(g, 0.46, 0.18, 0.02, std(palette.woodDark, 0.7), 0, 0.10, 0.225, 0, false);
  bbox(g, 0.46, 0.16, 0.02, std(palette.woodDark, 0.7), 0, 0.30, 0.225, 0, false);
  cyl(g, 0.012, 0.012, 0.12, MAT.brass, 0, 0.15, 0.245, 8);
  cyl(g, 0.012, 0.012, 0.12, MAT.brass, 0, 0.35, 0.245, 8);
  if (lamp) addLamp(g, 0, 0.54, 0, 1.0);
  addBooks(g, 0.08, 0.54, -0.04, 1.2, 2, palette);
  cyl(g, 0.032, 0.04, 0.10, MAT.glass, -0.16, 0.54, 0.06, 12);
  bbox(g, 0.16, 0.02, 0.12, MAT.paper, 0.12, 0.54, 0.12, 0.2, false);
  return g;
}

/* ------------------------------------------------------------------ */
/* Soft furnishings                                                    */
/* ------------------------------------------------------------------ */

export function addRug(parent, x, z, w, d, palette, variant = 0, ry = 0) {
  const mat = textured(paletteRug(palette, variant), '#ffffff', 0.98, { side: THREE.DoubleSide });
  const rug = planeH(parent, w, d, mat, x, 0.012, z, ry);
  rug.receiveShadow = true;
  // fringed ends
  const fringeMat = std('#d8c9ac', 0.98);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 12; i++) {
      bbox(parent, 0.025, 0.012, 0.12, fringeMat, x + side * w / 2, 0.008, z - d / 2 + 0.1 + i * (d - 0.2) / 11, ry, false);
    }
  }
  return rug;
}

export function addCurtains(parent, x, z, ry, width, palette, height = 3.0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  const curtainMat = textured(TEX.linenWarm, palette.curtain, 0.98, { side: THREE.DoubleSide });
  const sheerMat = std('#f2ede4', 0.9, 0, { transparent: true, opacity: 0.36, side: THREE.DoubleSide, depthWrite: false });
  const span = width - 0.7;
  // Rod
  cyl(g, 0.022, 0.022, span + 0.9, MAT.agedBrass, 0, height, 0.12, 10, Math.PI / 2);
  sphere(g, 0.045, MAT.brass, -span / 2 - 0.50, height + 0.02, 0.12, 10);
  sphere(g, 0.045, MAT.brass, span / 2 + 0.50, height + 0.02, 0.12, 10);
  // Sheer panels
  for (const side of [-1, 1]) {
    const px = side * (span / 2 - 0.20);
    for (let i = 0; i < 5; i++) {
      bbox(g, 0.16, height - 0.28, 0.018, sheerMat, px + (i - 2) * 0.14, 0.12, 0.08, 0, false);
    }
  }
  // Heavy drapes with deep folds
  for (const side of [-1, 1]) {
    const px = side * (span / 2 + 0.03);
    for (let i = 0; i < 6; i++) {
      const off = (i - 2.5) * 0.105;
      rbox(g, 0.155, height - 0.18, 0.10 + (i % 2) * 0.05, 0.03, curtainMat, px + off, 0.06, 0.05, 0, false);
    }
    // Tieback
    cyl(g, 0.035, 0.035, 0.12, MAT.agedBrass, px, 1.25, 0.1, 8, Math.PI / 2);
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Bathroom                                                            */
/* ------------------------------------------------------------------ */

export function addBathroom(parent, opts) {
  const {
    x0, z0, w, d, palette, tub = false, double = false, doorSide = 'south', tile = null
  } = opts;
  const g = new THREE.Group();
  g.position.set(x0, 0, z0);
  parent.add(g);
  const H = 2.25;
  const marble = tile || textured(TEX.marble, palette.stone, 0.35);
  const tileDark = textured(TEX.limestone, palette.wallDeep, 0.6);
  planeH(g, w, d, marble, w / 2, 0.025, d / 2);
  // Ceiling
  planeH(g, w, d, std('#e8e2d6', 0.95), w / 2, H, d / 2).rotation.x = Math.PI / 2;
  // Back wall and side walls
  bbox(g, w, H, 0.10, marble, w / 2, 0, 0.05);
  bbox(g, 0.10, H, d, marble, 0.05, 0, d / 2);
  bbox(g, 0.10, H, d, marble, w - 0.05, 0, d / 2);
  // Front wall with door opening
  const doorW = 0.82;
  const doorX = doorSide === 'south' ? w - 1.05 : 1.05;
  bbox(g, doorX - doorW / 2, H, 0.10, marble, (doorX - doorW / 2) / 2, 0, d - 0.05);
  bbox(g, w - (doorX + doorW / 2), H, 0.10, marble, (doorX + doorW / 2 + w) / 2, 0, d - 0.05);
  bbox(g, doorW, H - 2.12, 0.10, marble, doorX, 2.12, d - 0.05);
  // Bathroom door, left ajar
  const door = new THREE.Group();
  door.position.set(doorX - doorW / 2, 0, d - 0.09);
  door.rotation.y = -0.9;
  g.add(door);
  bbox(door, doorW, 2.08, 0.055, textured(TEX.walnut, palette.wood, 0.5), doorW / 2, 0, 0);
  cyl(door, 0.018, 0.018, 0.13, MAT.brass, doorW - 0.12, 1.02, 0.07, 8, Math.PI / 2);

  // Vanity
  const vanityW = double ? 2.0 : 1.5;
  const vx = 0.18;
  bbox(g, vanityW, 0.78, 0.56, textured(TEX.walnut, palette.wood, 0.55), vx, 0.02, 0.38);
  bbox(g, vanityW + 0.05, 0.055, 0.60, marble, vx, 0.80, 0.38);
  bbox(g, vanityW - 0.08, 0.30, 0.02, std(palette.woodDark, 0.7), vx, 0.18, 0.67, 0, false);
  const sinks = double ? [vx - vanityW / 4, vx + vanityW / 4] : [vx];
  for (const sx of sinks) {
    cyl(g, 0.18, 0.15, 0.08, MAT.ceramic, sx, 0.85, 0.37, 24);
    cyl(g, 0.025, 0.02, 0.20, MAT.brass, sx, 0.92, 0.13, 10);
    bbox(g, 0.02, 0.02, 0.16, MAT.brass, sx, 1.10, 0.21, 0, false);
  }
  // Mirror + glow
  planeV(g, vanityW * 0.85, 0.95, MAT.mirror, vx, 1.72, 0.115, 0);
  bbox(g, vanityW * 0.9, 0.025, 0.03, MAT.ledStrip, vx, 1.22, 0.10, 0, false);
  bbox(g, vanityW * 0.9, 0.025, 0.03, MAT.ledStrip, vx, 2.21, 0.10, 0, false);
  glow(g, vx, 1.7, 0.18, 1.25, '#ffe0ad', 0.3);
  addFlowers(g, vx + vanityW / 2 - 0.12, 0.86, 0.36);

  // Shower in the far corner
  const showerX = w - 1.08, showerZ = 1.1;
  bbox(g, 1.02, 0.09, 1.9, tileDark, showerX, 0.02, showerZ);
  planeV(g, 1.9, 2.0, std('#cfe1e0', 0.08, 0, { transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false }), w - 1.62, 1.05, showerZ, Math.PI / 2);
  cyl(g, 0.016, 0.016, 1.95, MAT.brass, w - 1.65, 0.02, showerZ, 8);
  cyl(g, 0.016, 0.016, 1.95, MAT.brass, w - 0.51, 0.02, showerZ, 8);
  cyl(g, 0.016, 0.016, 1.1, MAT.brass, w - 1.08, 2.0, showerZ, 8, Math.PI / 2);
  cyl(g, 0.16, 0.16, 0.035, MAT.chrome, w - 1.08, 2.02, showerZ, 20);
  bbox(g, 0.56, 0.34, 0.18, tileDark, w - 0.20, 1.06, showerZ + 0.5, 0, false);
  addBottles(g, w - 0.3, 1.12, showerZ + 0.45, 3);

  // WC
  const tx = w - 0.62, tz = d - 0.55;
  bbox(g, 0.44, 0.68, 0.52, MAT.ceramic, tx, 0, tz);
  rbox(g, 0.42, 0.10, 0.50, 0.04, MAT.ceramic, tx, 0.68, tz);
  cyl(g, 0.19, 0.16, 0.08, MAT.ceramic, tx, 0.58, tz + 0.08, 20);
  bbox(g, 0.26, 0.02, 0.0, MAT.paper, tx + 0.36, 0.75, tz, 0, false);

  // Towel ladder
  cyl(g, 0.014, 0.014, 1.0, MAT.brass, 0.32, 0.35, d - 0.18, 8);
  cyl(g, 0.014, 0.014, 1.0, MAT.brass, 0.92, 0.35, d - 0.18, 8);
  for (let i = 0; i < 4; i++) {
    cyl(g, 0.012, 0.012, 0.60, MAT.brass, 0.62, 0.55 + i * 0.22, d - 0.18, 8, Math.PI / 2);
  }
  rbox(g, 0.52, 0.72, 0.05, 0.02, MAT.towel, 0.62, 0.70, d - 0.23, 0, false);
  rbox(g, 0.48, 0.30, 0.06, 0.02, MAT.towel, 0.62, 1.12, d - 0.22, 0, false);
  // Bath mat, slippers
  planeH(g, 0.7, 0.45, textured(TEX.boucle, '#ece6d9', 0.98), 0.8, 0.035, d - 0.7);
  for (const sx of [0.64, 0.90]) rbox(g, 0.14, 0.035, 0.30, 0.02, MAT.towel, sx, 0.04, d - 0.48, 0.2, false);

  if (tub) {
    const txx = w / 2 - 0.18, tzz = d - 1.27;
    rbox(g, 1.55, 0.52, 0.78, 0.10, MAT.ceramic, txx, 0.02, tzz);
    rbox(g, 1.38, 0.10, 0.60, 0.05, std('#d9e7e4', 0.08, 0.1, { transparent: true, opacity: 0.8 }), txx, 0.48, tzz, 0, false);
    cyl(g, 0.02, 0.02, 0.20, MAT.brass, txx + 0.60, 0.54, tzz - 0.30, 8);
    cyl(g, 0.02, 0.02, 0.24, MAT.brass, txx + 0.70, 0.54, tzz - 0.30, 8, Math.PI / 2);
    bbox(g, 0.38, 0.025, 0.26, MAT.agedBrass, txx, 0.55, tzz + 0.05, 0.15, false);
    addFlowers(g, txx + 0.05, 0.58, tzz + 0.02);
  }

  // Ceiling downlights
  for (const lx of [0.8, w - 1.4]) {
    cyl(g, 0.055, 0.055, 0.02, MAT.warmBulb, lx, H - 0.03, d / 2, 12);
  }
  return g;
}

function addBottles(parent, x, y, z, count = 3) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  for (let i = 0; i < count; i++) {
    const mat = std(['#6b7a5d', '#c9b18b', '#d9d2c5'][i % 3], 0.3, 0.05);
    cyl(g, 0.035, 0.04, 0.16, mat, i * 0.09, 0, 0, 10);
    cyl(g, 0.015, 0.025, 0.03, MAT.blackGloss, i * 0.09, 0.16, 0, 8);
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Kitchenette                                                         */
/* ------------------------------------------------------------------ */

export function addKitchenette(parent, x, z, ry, palette, w = 2.4) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  const wood = textured(TEX.walnut, palette.wood, 0.6);
  const stone = textured(TEX.marble, palette.stone, 0.32);
  bbox(g, w, 0.86, 0.62, wood, 0, 0.02, 0);
  bbox(g, w + 0.05, 0.055, 0.66, stone, 0, 0.88, 0);
  for (let i = 0; i < 3; i++) {
    bbox(g, w / 3 - 0.04, 0.74, 0.02, std(palette.woodDark, 0.7), -w / 3 + i * w / 3, 0.07, 0.32, 0, false);
    cyl(g, 0.010, 0.010, 0.12, MAT.brass, -w / 3 + i * w / 3, 0.62, 0.345, 8, Math.PI / 2);
  }
  // Sink
  bbox(g, 0.52, 0.025, 0.36, MAT.chrome, -w / 2 + 0.45, 0.90, 0.02, 0, false);
  cyl(g, 0.02, 0.02, 0.24, MAT.brass, -w / 2 + 0.45, 0.92, -0.18, 8);
  // Hob
  bbox(g, 0.62, 0.02, 0.44, MAT.blackGloss, 0.15, 0.90, 0.02, 0, false);
  for (const hx of [-0.16, 0.16]) for (const hz of [-0.13, 0.13]) {
    cyl(g, 0.075, 0.075, 0.012, MAT.blackMetal, 0.15 + hx, 0.92, 0.02 + hz, 16);
  }
  // Upper shelf
  bbox(g, w, 0.05, 0.28, wood, 0, 1.64, -0.12);
  bbox(g, w, 0.05, 0.28, wood, 0, 2.02, -0.12);
  for (let i = 0; i < 6; i++) {
    cyl(g, 0.045, 0.045, 0.16, MAT.ceramic, -w / 2 + 0.25 + i * 0.33, 1.69, -0.10, 12);
  }
  addBottles(g, -w / 2 + 0.20, 2.07, -0.10, 2);
  // Kettle + cups + coffee machine
  cyl(g, 0.09, 0.10, 0.18, MAT.chrome, w / 2 - 0.25, 0.93, 0.0, 16);
  bbox(g, 0.22, 0.35, 0.24, MAT.blackGloss, w / 2 - 0.58, 0.93, -0.1);
  bbox(g, 0.18, 0.05, 0.02, MAT.brass, w / 2 - 0.58, 1.05, 0.03, 0, false);
  // Mini fridge under counter
  bbox(g, 0.48, 0.62, 0.03, MAT.blackGloss, w / 2 - 0.35, 0.12, 0.32, 0, false);
  // Bar stools
  for (let i = 0; i < 2; i++) {
    const sx = -w / 4 + i * w / 2;
    cyl(g, 0.17, 0.17, 0.045, textured(TEX.leather, palette.textile, 0.62), sx, 0.66, 0.72, 16);
    cyl(g, 0.025, 0.04, 0.64, MAT.agedBrass, sx, 0.03, 0.72, 8);
    cyl(g, 0.16, 0.16, 0.02, MAT.agedBrass, sx, 0.03, 0.72, 16);
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Architecture-adjacent detail                                        */
/* ------------------------------------------------------------------ */

export function addCeilingCove(parent, w, d, palette) {
  const strip = std('#f1e6d2', 0.5, 0, { emissive: '#ffd9a0', emissiveIntensity: 1.0 });
  const y = 3.18;
  bbox(parent, w - 0.5, 0.025, 0.05, strip, 0, y, -d / 2 + 0.28, 0, false);
  bbox(parent, w - 0.5, 0.025, 0.05, strip, 0, y, d / 2 - 0.28, 0, false);
  bbox(parent, 0.05, 0.025, d - 0.5, strip, -w / 2 + 0.28, y, 0, 0, false);
  bbox(parent, 0.05, 0.025, d - 0.5, strip, w / 2 - 0.28, y, 0, 0, false);
}

export function addPendant(parent, x, y, z, palette, size = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  cyl(g, 0.008, 0.008, 0.42, MAT.blackMetal, 0, 0, 0, 6);
  cyl(g, 0.28 * size, 0.11 * size, 0.20, MAT.linenShade, 0, -0.20, 0, 20);
  sphere(g, 0.045, MAT.warmBulb, 0, -0.18, 0, 8);
  glow(g, 0, -0.15, 0, 1.3 * size, '#ffd79a', 0.45);
  return g;
}

export function addVent(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, 0.42, 0.16, 0.025, std('#d7d2c8', 0.7), 0, 0, 0, 0, false);
  for (let i = 0; i < 5; i++) bbox(g, 0.34, 0.008, 0.012, std('#9c968b', 0.8), 0, 0.02 + i * 0.026, 0.016, 0, false);
  return g;
}

export function addThermostat(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, 0.13, 0.18, 0.022, MAT.whitePlastic, 0, 0, 0, 0, false);
  bbox(g, 0.08, 0.055, 0.005, std('#1a2a2b', 0.3, 0.1, { emissive: '#5a8e8b', emissiveIntensity: 0.6 }), 0, 0.07, 0.016, 0, false);
  return g;
}

export function addSwitch(parent, x, y, z, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  bbox(g, 0.16, 0.10, 0.015, MAT.whitePlastic, 0, 0, 0, 0, false);
  bbox(g, 0.045, 0.05, 0.008, std('#d0cbc1', 0.6), 0, 0.02, 0.012, 0, false);
  return g;
}

export function addSuitcase(parent, x, z, ry, palette) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  rbox(g, 0.44, 0.66, 0.26, 0.05, textured(TEX.leather, palette.woodDark, 0.72), 0, 0.03, 0.14);
  bbox(g, 0.30, 0.02, 0.025, MAT.agedBrass, 0, 0.32, 0.28, 0, false);
  bbox(g, 0.10, 0.02, 0.03, MAT.agedBrass, 0, 0.68, 0.10, 0, false);
  return g;
}

export function addLuggageRack(parent, x, z, ry, palette) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  parent.add(g);
  for (const sx of [-0.35, 0.35]) for (const sz of [-0.25, 0.25]) {
    cyl(g, 0.018, 0.022, 0.44, MAT.agedBrass, sx, 0, sz, 6);
  }
  bbox(g, 0.78, 0.03, 0.58, textured(TEX.leather, palette.textile, 0.7), 0, 0.44, 0);
  addSuitcase(g, 0, -0.06, 0.2, palette);
  return g;
}

/* ------------------------------------------------------------------ */
/* Bake static meshes by material to keep draw calls low               */
/* ------------------------------------------------------------------ */

export function bakeGroup(group) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const buckets = new Map();
  const remove = [];
  group.traverse(o => {
    if (!o.isMesh || o.userData.noBake) return;
    if (Array.isArray(o.material) || !o.material) return;
    if (!o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;

    // BufferGeometryUtils requires every geometry in a batch to have the same
    // attribute set and the same indexing. Normalise to non-indexed position,
    // normal and uv before merging; custom geometry without uv stays unmerged.
    let g = o.geometry.clone();
    if (!g.attributes.uv) { g.dispose(); return; }
    if (g.index) {
      const flat = g.toNonIndexed();
      g.dispose();
      g = flat;
    }
    for (const name of Object.keys(g.attributes)) {
      if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
    }
    if (!g.attributes.normal) g.computeVertexNormals();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    g.computeBoundingSphere();
    if (!g.boundingSphere || !Number.isFinite(g.boundingSphere.radius)) {
      g.dispose();
      return;
    }

    const key = o.material.uuid;
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, geoms: [], cast: o.castShadow });
    buckets.get(key).geoms.push(g);
    remove.push(o);
  });

  for (const b of buckets.values()) {
    let merged = null;
    if (b.geoms.length === 1) {
      merged = b.geoms[0];
    } else {
      try {
        merged = mergeGeometries(b.geoms, false);
      } catch (e) {
        merged = null;
      }
    }
    if (!merged) {
      b.geoms.forEach(geo => geo.dispose());
      continue;
    }
    merged.computeBoundingSphere();
    if (!merged.boundingSphere || !Number.isFinite(merged.boundingSphere.radius)) {
      merged.dispose();
      continue;
    }
    const mesh = new THREE.Mesh(merged, b.mat);
    mesh.castShadow = b.cast;
    mesh.receiveShadow = true;
    mesh.userData.baked = true;
    group.add(mesh);
  }
  remove.forEach(o => o.parent && o.parent.remove(o));
  return group;
}
