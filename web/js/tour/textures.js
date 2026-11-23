import * as THREE from 'three';

/* Deterministic, lightweight canvas textures. Everything is generated at
   runtime, so the tour has no image downloads for surfaces or decals. */

let seed = 9271;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return c;
}

function finish(c, repeatX = 1, repeatY = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.anisotropy = 4;
  return t;
}

export function makeWoodTexture(base = '#8a6748', dark = '#5b3f2a', light = '#b28a63') {
  const s = 512, c = canvas(s), x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, s);
  g.addColorStop(0, light);
  g.addColorStop(0.35, base);
  g.addColorStop(1, dark);
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  for (let i = 0; i < 160; i++) {
    const px = rnd() * s;
    x.strokeStyle = `rgba(${35 + rnd() * 40}, ${22 + rnd() * 30}, ${14 + rnd() * 24}, ${0.05 + rnd() * 0.18})`;
    x.lineWidth = 0.6 + rnd() * 2.4;
    x.beginPath();
    x.moveTo(px, 0);
    for (let y = 0; y <= s; y += 18) {
      x.lineTo(px + Math.sin(y * 0.012 + i) * (2 + rnd() * 5) + (rnd() - 0.5) * 3, y);
    }
    x.stroke();
  }
  for (let i = 0; i < 7; i++) {
    const px = rnd() * s, py = rnd() * s;
    x.strokeStyle = 'rgba(45,28,16,.25)';
    x.lineWidth = 1.4;
    x.beginPath();
    x.ellipse(px, py, 5 + rnd() * 12, 2 + rnd() * 5, rnd() * 3, 0, Math.PI * 2);
    x.stroke();
  }
  const fine = x.createLinearGradient(0, 0, s, 0);
  fine.addColorStop(0, 'rgba(255,255,255,.04)');
  fine.addColorStop(.5, 'rgba(255,255,255,.0)');
  fine.addColorStop(1, 'rgba(0,0,0,.05)');
  x.fillStyle = fine;
  x.fillRect(0, 0, s, s);
  return finish(c, 2, 2);
}

export function makeStoneTexture(base = '#d5cdbf', speck = '#b7ad9d') {
  const s = 512, c = canvas(s), x = c.getContext('2d');
  x.fillStyle = base;
  x.fillRect(0, 0, s, s);
  for (let i = 0; i < 900; i++) {
    const alpha = 0.015 + rnd() * 0.055;
    x.fillStyle = rnd() > .5 ? `rgba(255,250,240,${alpha})` : `rgba(90,78,64,${alpha})`;
    x.beginPath();
    x.ellipse(rnd() * s, rnd() * s, 1 + rnd() * 14, 1 + rnd() * 8, rnd() * 3, 0, Math.PI * 2);
    x.fill();
  }
  for (let i = 0; i < 22; i++) {
    x.strokeStyle = `rgba(120,108,92,${0.03 + rnd() * 0.05})`;
    x.lineWidth = 0.7 + rnd() * 2;
    x.beginPath();
    let px = rnd() * s, py = rnd() * s;
    x.moveTo(px, py);
    for (let j = 0; j < 6; j++) {
      px += (rnd() - .5) * 80;
      py += (rnd() - .5) * 80;
      x.lineTo(px, py);
    }
    x.stroke();
  }
  x.strokeStyle = 'rgba(80,70,58,.10)';
  x.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    x.beginPath();
    x.moveTo(0, i * s / 4);
    x.lineTo(s, i * s / 4);
    x.stroke();
    x.beginPath();
    x.moveTo(i * s / 4, 0);
    x.lineTo(i * s / 4, s);
    x.stroke();
  }
  return finish(c, 2, 2);
}

export function makeMarbleTexture(base = '#eeeae2', vein = '#9b9488') {
  const s = 512, c = canvas(s), x = c.getContext('2d');
  x.fillStyle = base;
  x.fillRect(0, 0, s, s);
  for (let i = 0; i < 26; i++) {
    x.strokeStyle = `rgba(100,96,88,${0.04 + rnd() * 0.12})`;
    x.lineWidth = 0.5 + rnd() * 2.2;
    x.beginPath();
    let px = -40 + rnd() * s * 1.4, py = -60;
    x.moveTo(px, py);
    while (py < s + 60) {
      px += (rnd() - .5) * 55;
      py += 12 + rnd() * 34;
      x.lineTo(px, py);
    }
    x.stroke();
  }
  for (let i = 0; i < 80; i++) {
    x.fillStyle = `rgba(120,112,100,${rnd() * 0.03})`;
    x.beginPath();
    x.ellipse(rnd() * s, rnd() * s, 2 + rnd() * 22, 1 + rnd() * 9, rnd() * 3, 0, Math.PI * 2);
    x.fill();
  }
  return finish(c, 1.5, 1.5);
}

export function makeFabricTexture(base = '#ddd7cb', tone = '#b9b0a0') {
  const s = 256, c = canvas(s), x = c.getContext('2d');
  x.fillStyle = base;
  x.fillRect(0, 0, s, s);
  for (let i = 0; i < s; i += 3) {
    x.fillStyle = `rgba(255,255,255,${0.018 + rnd() * 0.025})`;
    x.fillRect(i, 0, 1, s);
    x.fillStyle = `rgba(70,60,50,${0.012 + rnd() * 0.02})`;
    x.fillRect(0, i, s, 1);
  }
  for (let i = 0; i < 240; i++) {
    x.fillStyle = `rgba(90,78,64,${rnd() * 0.04})`;
    x.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 2, 1 + rnd() * 2);
  }
  return finish(c, 3, 3);
}

export function makeCarpetTexture(base = '#bdb3a0', dark = '#a99d89') {
  const s = 256, c = canvas(s), x = c.getContext('2d');
  x.fillStyle = base;
  x.fillRect(0, 0, s, s);
  for (let i = 0; i < 5000; i++) {
    x.fillStyle = rnd() > .5 ? `rgba(255,255,255,${rnd() * .05})` : `rgba(60,50,40,${rnd() * .06})`;
    x.fillRect(rnd() * s, rnd() * s, 1, 1 + rnd() * 2);
  }
  for (let i = 0; i < 8; i++) {
    x.strokeStyle = `rgba(90,78,62,${0.03 + rnd() * 0.05})`;
    x.lineWidth = 8 + rnd() * 24;
    x.beginPath();
    x.moveTo(-20, rnd() * s);
    x.bezierCurveTo(s * .3, rnd() * s, s * .7, rnd() * s, s + 20, rnd() * s);
    x.stroke();
  }
  return finish(c, 3, 3);
}

export function makeRugTexture(colors = ['#c7b28f', '#8d4f38', '#6e7450']) {
  const s = 512, c = canvas(s), x = c.getContext('2d');
  x.fillStyle = colors[0];
  x.fillRect(0, 0, s, s);
  x.strokeStyle = 'rgba(70,55,40,.28)';
  x.lineWidth = 5;
  x.strokeRect(18, 18, s - 36, s - 36);
  x.strokeStyle = 'rgba(255,250,240,.28)';
  x.lineWidth = 2;
  x.strokeRect(30, 30, s - 60, s - 60);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = 92 + col * 110, cy = 92 + row * 82;
      x.strokeStyle = row % 2 ? colors[1] : colors[2];
      x.lineWidth = 5;
      x.beginPath();
      x.moveTo(cx, cy - 27); x.lineTo(cx + 30, cy); x.lineTo(cx, cy + 27); x.lineTo(cx - 30, cy); x.closePath();
      x.stroke();
      x.fillStyle = row % 2 ? 'rgba(141,79,56,.18)' : 'rgba(110,116,80,.20)';
      x.fill();
    }
  }
  for (let i = 0; i < 4000; i++) {
    x.fillStyle = `rgba(255,250,238,${rnd() * .06})`;
    x.fillRect(rnd() * s, rnd() * s, 1, 1);
  }
  return finish(c, 1, 1);
}

export function makeArtTexture(colors = ['#a45f42', '#6e7450', '#c9a35e', '#d8cfbf']) {
  const s = 512, c = canvas(s), x = c.getContext('2d');
  x.fillStyle = '#ebe4d7';
  x.fillRect(0, 0, s, s);
  for (let i = 0; i < 10; i++) {
    x.fillStyle = colors[i % colors.length] + (rnd() > .5 ? 'cc' : '88');
    x.beginPath();
    if (rnd() > .5) {
      x.arc(rnd() * s, rnd() * s, 20 + rnd() * 105, 0, Math.PI * 2);
    } else {
      x.rect(rnd() * s * .7, rnd() * s * .7, 20 + rnd() * 180, 12 + rnd() * 120);
    }
    x.fill();
  }
  x.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 700; i++) {
    x.fillStyle = `rgba(80,60,40,${rnd() * .05})`;
    x.fillRect(rnd() * s, rnd() * s, 2, 2);
  }
  x.globalCompositeOperation = 'source-over';
  return finish(c, 1, 1);
}

export function makeGlowTexture(inner = 'rgba(255,221,157,.95)', outer = 'rgba(255,190,100,0)') {
  const s = 128, c = canvas(s), x = c.getContext('2d');
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.4, 'rgba(255,206,136,.35)');
  g.addColorStop(1, outer);
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makeCloudTexture() {
  const s = 256, c = canvas(s), x = c.getContext('2d');
  for (let i = 0; i < 28; i++) {
    const g = x.createRadialGradient(rnd() * s, rnd() * s, 4, rnd() * s, rnd() * s, 30 + rnd() * 80);
    g.addColorStop(0, `rgba(255,248,236,${0.10 + rnd() * 0.14})`);
    g.addColorStop(1, 'rgba(255,248,236,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makeLabelTexture(text, opts = {}) {
  const {
    fg = '#e9d6a4', bg = 'rgba(10,14,20,.72)', font = '600 34px "Plus Jakarta Sans", sans-serif',
    border = 'rgba(197,168,105,.45)', pad = 26, letter = 4, width = 512, height = 128
  } = opts;
  const c = document.createElement('canvas');
  c.width = width; c.height = height;
  const x = c.getContext('2d');
  x.clearRect(0, 0, width, height);
  if (bg) {
    x.fillStyle = bg;
    x.beginPath();
    x.roundRect(2, 2, width - 4, height - 4, 12);
    x.fill();
  }
  if (border) {
    x.strokeStyle = border;
    x.lineWidth = 2;
    x.beginPath();
    x.roundRect(2, 2, width - 4, height - 4, 12);
    x.stroke();
  }
  x.fillStyle = fg;
  x.font = font;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.letterSpacing = `${letter}px`;
  const lines = String(text).split('\n');
  lines.forEach((line, i) => {
    x.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * (height / (lines.length + .5)));
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function makeNumberTexture(number, suffix = '') {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  x.clearRect(0, 0, 256, 256);
  const g = x.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, '#18202b');
  g.addColorStop(1, '#0c1118');
  x.fillStyle = g;
  x.beginPath(); x.roundRect(12, 12, 232, 232, 30); x.fill();
  x.strokeStyle = 'rgba(197,168,105,.5)'; x.lineWidth = 3;
  x.beginPath(); x.roundRect(12, 12, 232, 232, 30); x.stroke();
  x.fillStyle = '#f1e2b8';
  x.font = '500 92px "Playfair Display", serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(number, 128, 118);
  if (suffix) {
    x.fillStyle = 'rgba(197,168,105,.8)';
    x.font = '600 22px "Plus Jakarta Sans", sans-serif';
    x.letterSpacing = '5px';
    x.fillText(suffix, 128, 190);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function makePortraitTexture(colors = ['#a45f42', '#6e7450', '#c9a35e']) {
  const c = document.createElement('canvas');
  c.width = 320; c.height = 420;
  const x = c.getContext('2d');
  x.fillStyle = '#d9d1c2'; x.fillRect(0, 0, 320, 420);
  x.fillStyle = colors[0]; x.beginPath(); x.arc(160, 170, 90, 0, Math.PI * 2); x.fill();
  x.fillStyle = colors[1]; x.fillRect(30, 250, 260, 140);
  x.fillStyle = 'rgba(250,244,232,.5)';
  for (let i = 0; i < 12; i++) x.fillRect(rnd() * 300, rnd() * 400, 2, 20);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createTextures() {
  return {
    oak: makeWoodTexture('#9b7653', '#684a31', '#bd9871'),
    walnut: makeWoodTexture('#6a4a35', '#3f2a1d', '#8c6749'),
    darkWood: makeWoodTexture('#4a3224', '#241812', '#684a35'),
    travertine: makeStoneTexture('#d8d0c1'),
    limestone: makeStoneTexture('#cfc9bd', '#a9a194'),
    marble: makeMarbleTexture('#eeeae0', '#a39b8d'),
    marbleGreen: makeMarbleTexture('#c9d2c4', '#718267'),
    marbleDark: makeMarbleTexture('#4b4a48', '#232322'),
    linen: makeFabricTexture('#e7e1d5'),
    linenWarm: makeFabricTexture('#ded4c3'),
    velvet: makeFabricTexture('#7c6757', '#5d4c40'),
    boucle: makeFabricTexture('#ded8cb', '#c0b7a6'),
    leather: makeFabricTexture('#9b8d7c', '#6d6052'),
    carpet: makeCarpetTexture('#b8ae9c'),
    teak: makeWoodTexture('#9a7046', '#6a4628', '#bd9563'),
    glow: makeGlowTexture(),
    cloud: makeCloudTexture(),
    plaque: makeNumberTexture('RH'),
    label: makeLabelTexture('ROYAL HAVEN')
  };
}
