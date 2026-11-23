import * as THREE from 'three';
import { createTextures, makeArtTexture, makeRugTexture, makeGlowTexture } from './textures.js';

export const TEX = {};
const cache = new Map();
let initialised = false;

export function initMaterials() {
  if (initialised) return;
  initialised = true;
  Object.assign(TEX, createTextures());
  TEX.glow = TEX.glow || makeGlowTexture();
  TEX.rugs = {};
  TEX.arts = {};
}

function key(o) {
  return JSON.stringify(o);
}

export function std(color, roughness = 0.72, metalness = 0, opts = {}) {
  const o = { color, roughness, metalness, ...opts };
  const k = 'std' + key(o);
  if (cache.has(k)) return cache.get(k);
  const m = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness,
    envMapIntensity: opts.envMapIntensity ?? 0.6,
    ...opts
  });
  cache.set(k, m);
  return m;
}

export function textured(map, color = '#ffffff', roughness = 0.8, opts = {}) {
  const k = 'tex' + map.uuid + color + roughness + key(opts);
  if (cache.has(k)) return cache.get(k);
  const m = new THREE.MeshStandardMaterial({
    map,
    color: new THREE.Color(color),
    roughness,
    metalness: opts.metalness ?? 0,
    envMapIntensity: opts.envMapIntensity ?? 0.55,
    ...opts
  });
  cache.set(k, m);
  return m;
}

export function emissive(color, intensity = 1.2, base = '#1a140d') {
  const k = 'emi' + color + intensity + base;
  if (cache.has(k)) return cache.get(k);
  const m = new THREE.MeshStandardMaterial({
    color: new THREE.Color(base),
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    roughness: 0.55,
    metalness: 0
  });
  cache.set(k, m);
  return m;
}

export function paletteArt(palette, index = 0) {
  const k = palette.key + index;
  if (!TEX.arts[k]) TEX.arts[k] = makeArtTexture(palette.art);
  return TEX.arts[k];
}

export function paletteRug(palette, variant = 0) {
  const k = palette.key + variant;
  if (!TEX.rugs[k]) {
    const colors = variant % 2
      ? [palette.rug, palette.textile, palette.accent]
      : [palette.rug, palette.accent, palette.textile];
    TEX.rugs[k] = makeRugTexture(colors);
  }
  return TEX.rugs[k];
}

export const MAT = {
  get brass() { return std('#b99253', 0.28, 0.92, { envMapIntensity: 1.25 }); },
  get agedBrass() { return std('#8e6e3c', 0.42, 0.85, { envMapIntensity: 1.05 }); },
  get blackMetal() { return std('#17191c', 0.4, 0.65); },
  get chrome() { return std('#c9ccce', 0.16, 0.95); },
  get glass() {
    return std('#bcd6d8', 0.06, 0, {
      transparent: true, opacity: 0.20, side: THREE.DoubleSide,
      depthWrite: false, envMapIntensity: 1.4
    });
  },
  get windowGlass() {
    return std('#a9cfd4', 0.03, 0, {
      transparent: true, opacity: 0.16, side: THREE.DoubleSide,
      depthWrite: false, envMapIntensity: 1.6
    });
  },
  get mirror() { return std('#d8e2e2', 0.03, 1, { envMapIntensity: 1.8 }); },
  get ceramic() { return std('#f3efe7', 0.22, 0); },
  get whiteLinen() { return textured(TEX.linen, '#ffffff', 0.92); },
  get ivoryLinen() { return textured(TEX.linenWarm, '#fffaf0', 0.95); },
  get duvet() { return textured(TEX.linen, '#fcfaf4', 0.98); },
  get towel() { return textured(TEX.boucle, '#f7f2e7', 0.98); },
  get darkStone() { return textured(TEX.limestone, '#8e8980', 0.82); },
  get green() { return std('#4d6346', 0.9, 0, { envMapIntensity: 0.25 }); },
  get olive() { return std('#66704d', 0.92, 0); },
  get soil() { return std('#3d2f23', 1, 0); },
  get terracotta() { return std('#a76548', 0.88, 0); },
  get screen() { return std('#10161a', 0.22, 0.1, { envMapIntensity: 0.8 }); },
  get water() {
    return std('#2d7b82', 0.04, 0.05, {
      transparent: true, opacity: 0.86, envMapIntensity: 1.7,
      depthWrite: false
    });
  },
  get fire() { return emissive('#ff9a3c', 2.4, '#3a1a0a'); },
  get paper() { return std('#eee7d9', 0.95, 0); },
  get leather() { return std('#8b6746', 0.62, 0.05); },
  get blackGloss() { return std('#0c0e10', 0.14, 0.5); },
  get whitePlastic() { return std('#e9e6df', 0.35, 0); },
  get linenShade() { return emissive('#ffd89a', 0.52, '#c8b494'); },
  get warmBulb() { return emissive('#ffcf8a', 2.6, '#402a14'); },
  get ledStrip() { return emissive('#ffd9a0', 1.7, '#7a5a30'); },
  get poolTile() { return std('#77b6b5', 0.24, 0.05, { envMapIntensity: 0.9 }); }
};

// Textures are generated as soon as the material library loads, so modules that
// create shared materials at import time (architecture, landscape) can do so
// safely before the app boots.
initMaterials();
