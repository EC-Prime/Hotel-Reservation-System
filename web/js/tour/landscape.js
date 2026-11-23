import * as THREE from 'three';
import { MAT, TEX, std, textured } from './materials.js';
import { bbox, rbox, cyl, sphere, planeH, planeV, glow, addPlant, bakeGroup } from './kit.js';
import { POOL, WING, SPA, ROOM_LAYOUT } from './data.js';

const stone = textured(TEX.travertine, '#d6cdbd', 0.88);
const paving = textured(TEX.limestone, '#c8c1b5', 0.96);
const teak = textured(TEX.teak, '#ffffff', 0.78);

export function buildLandscape(app) {
  const g = new THREE.Group();
  g.name = 'landscape';
  app.scene.add(g);

  buildSky(app, g);
  buildOcean(app, g);
  buildGrounds(g);
  buildPool(g, app);
  buildPatios(g);
  buildGardens(g);
  buildArrival(g);

  bakeGroup(g);
  app.landscape = g;
  return g;
}

function buildSky(app, g) {
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 40, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color('#7fa9c4') },
        mid: { value: new THREE.Color('#d9e6e6') },
        bottom: { value: new THREE.Color('#f6c891') }
      },
      vertexShader: `varying vec3 vWorld; void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vWorld = wp.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vWorld; uniform vec3 top; uniform vec3 mid; uniform vec3 bottom;
        void main(){ float h = normalize(vWorld).y; float a = smoothstep(-0.02, 0.32, h); float b = smoothstep(0.18, 0.85, h);
          vec3 c = mix(bottom, mid, a); c = mix(c, top, b); gl_FragColor = vec4(c, 1.0); }`
    })
  );
  sky.userData.noBake = true;
  g.add(sky);

  // Sun disc + haze
  const sunMat = new THREE.SpriteMaterial({ map: TEX.glow, color: new THREE.Color('#ffe6b0'), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const sun = new THREE.Sprite(sunMat);
  sun.position.set(-120, 52, 260);
  sun.scale.set(55, 55, 1);
  g.add(sun);
  const haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: new THREE.Color('#f7cf9c'), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  haze.position.set(-110, 34, 280);
  haze.scale.set(180, 90, 1);
  g.add(haze);

  // Wispy clouds
  for (let i = 0; i < 14; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: TEX.cloud, color: new THREE.Color('#fff4e5'), transparent: true,
      opacity: 0.12 + Math.random() * 0.18, depthWrite: false
    }));
    s.position.set(-260 + Math.random() * 520, 50 + Math.random() * 70, 120 + Math.random() * 180);
    s.scale.set(70 + Math.random() * 90, 22 + Math.random() * 28, 1);
    g.add(s);
  }

  // Distant headlands
  const hillMat = std('#7f9694', 1, 0, { envMapIntensity: 0.1 });
  for (let i = 0; i < 9; i++) {
    const hill = new THREE.Mesh(new THREE.ConeGeometry(16 + Math.random() * 20, 9 + Math.random() * 11, 5), hillMat);
    hill.position.set(-220 + i * 55, 1.5, 250 + Math.random() * 30);
    hill.scale.z = 1.7;
    g.add(hill);
  }
}

function buildOcean(app, g) {
  const uniforms = {
    uTime: { value: 0 },
    uSun: { value: new THREE.Vector3(-0.45, 0.2, 0.87) },
    uDeep: { value: new THREE.Color('#3f7f86') },
    uShallow: { value: new THREE.Color('#8fc6c4') },
    uSky: { value: new THREE.Color('#e4ddd0') }
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `
      uniform float uTime; varying vec3 vW;
      void main(){
        vec3 p = position;
        p.z += sin(p.x*0.18 + uTime*0.7)*0.13 + sin(p.y*0.25 - uTime*0.55)*0.09;
        vec4 wp = modelMatrix * vec4(p,1.0); vW = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uSun, uDeep, uShallow, uSky; varying vec3 vW;
      void main(){
        float ripple = sin(vW.x*0.55 + uTime*0.9)*0.5 + sin(vW.z*0.8 - uTime*1.1)*0.5;
        float fine = sin(vW.x*2.1 + vW.z*1.4 + uTime*1.7)*0.5+0.5;
        vec3 col = mix(uDeep, uShallow, 0.42 + ripple*0.10 + fine*0.06);
        float spec = pow(max(0.0, sin(vW.x*0.45 + vW.z*0.19 + uTime)*0.5+0.5), 22.0);
        col += vec3(1.0,0.86,0.64)*spec*0.5;
        float dist = clamp((vW.z - 22.0)/160.0, 0.0, 1.0);
        col = mix(col, uSky, dist*0.62);
        gl_FragColor = vec4(col, 0.94);
      }`
  });
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(700, 360, 80, 40), mat);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, -0.26, 190);
  ocean.userData.noBake = true;
  g.add(ocean);
  app.ocean = ocean;

  // Shoreline foam / promenade edge
  bbox(g, 300, 0.25, 1.0, std('#e8e1d2', 0.9), 0, -0.1, 23.3, 0, false);
  const foamMat = std('#f3efe5', 0.8, 0, { transparent: true, opacity: 0.55 });
  bbox(g, 300, 0.03, 0.35, foamMat, 0, 0.04, 23.0, 0, false);

  // Sailing boats
  for (let i = 0; i < 4; i++) {
    const boat = new THREE.Group();
    boat.position.set(-80 + i * 45, 0.02, 80 + i * 22);
    g.add(boat);
    bbox(boat, 2.4, 0.35, 0.9, std('#f0ece2', 0.7), 0, 0, 0, 0, false);
    cyl(boat, 0.025, 0.03, 3.6, std('#8b7f6d', 0.8), 0, 0.2, 0, 5);
    const sail = new THREE.Mesh(new THREE.ConeGeometry(1.1, 3.1, 3), std('#fbf5e8', 0.86));
    sail.position.set(0.35, 2.0, 0);
    sail.rotation.z = -0.18;
    boat.add(sail);
  }

  // Gulls
  const gullMat = std('#f7f3e9', 0.9);
  for (let i = 0; i < 7; i++) {
    const gull = new THREE.Group();
    gull.position.set(-30 + Math.random() * 60, 12 + Math.random() * 10, 40 + Math.random() * 30);
    const l = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.12), gullMat);
    l.rotation.z = 0.25; l.position.x = -0.35; gull.add(l);
    const r = l.clone(); r.rotation.z = -0.25; r.position.x = 0.35; gull.add(r);
    g.add(gull);
  }
}

function buildGrounds(g) {
  // Coastal lawn / sandy earth
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(320, 220), std('#a9a286', 1, 0, { envMapIntensity: 0.08 }));
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(0, -0.08, 45);
  lawn.receiveShadow = true;
  g.add(lawn);
  // Paved apron around the building
  planeH(g, 86, 58, paving, -1, 0.015, 1, 0);
  // Promenade along the water
  planeH(g, 300, 7, stone, 0, 0.02, 24.5);
  bbox(g, 300, 0.55, 0.32, std('#c4b9a6', 0.9), 0, 0, 27.8, 0, false);
  for (let x = -140; x <= 140; x += 22) {
    bbox(g, 0.8, 2.5, 0.8, std('#c7bda9', 0.9), x, 0, 28.2, 0, false);
    bbox(g, 0.2, 0.22, 0.2, MAT.warmBulb, x, 2.45, 28.2, 0, false);
    glow(g, x, 2.35, 28.2, 1.2, '#ffd39a', 0.25);
  }

  // Driveway and forecourt
  planeH(g, 20, 18, std('#b6afa0', 0.95), 0, 0.018, -30);
  planeH(g, 26, 5, std('#a9a293', 0.96), 0, 0.02, -37);
  for (const x of [-8.5, 8.5]) {
    bbox(g, 0.28, 1.05, 0.28, MAT.blackMetal, x, 0, -23.8, 0, false);
    bbox(g, 0.22, 0.2, 0.22, MAT.warmBulb, x, 1.02, -23.8, 0, false);
    glow(g, x, 0.95, -23.8, 0.8, '#ffd39a', 0.22);
  }
  // Reflecting water feature at the entrance
  const rw = new THREE.Mesh(new THREE.CircleGeometry(2.1, 32), std('#5f8b8b', 0.1, 0.2, { transparent: true, opacity: 0.8 }));
  rw.rotation.x = -Math.PI / 2; rw.position.set(0, 0.05, -27.2); g.add(rw);
  bbox(g, 4.7, 0.30, 4.7, stone, 0, 0, -27.2, 0, false);
}

function buildPool(g, app) {
  const deck = new THREE.Group();
  g.add(deck);
  // Teak deck around pool
  const x0 = -9, x1 = 17.2, z0 = 5.8, z1 = 17.0;
  planeH(deck, x1 - x0, z1 - z0, teak, (x0 + x1) / 2, 0.035, (z0 + z1) / 2);
  // plank seams
  for (let x = x0; x < x1; x += 0.45) {
    bbox(deck, 0.018, 0.006, z1 - z0, std('#5e4128', 0.9), x, 0.038, (z0 + z1) / 2, 0, false);
  }
  // Pool basin
  const p = POOL;
  bbox(deck, p.x1 - p.x0 + 0.9, 0.28, p.z1 - p.z0 + 0.9, stone, (p.x0 + p.x1) / 2, 0.0, (p.z0 + p.z1) / 2, 0, false);
  planeH(deck, p.x1 - p.x0, p.z1 - p.z0, std('#7fb6b3', 0.4), (p.x0 + p.x1) / 2, -0.8, (p.z0 + p.z1) / 2);
  // pool walls
  for (const [x, z, w, d] of [
    [(p.x0 + p.x1) / 2, p.z0, p.x1 - p.x0, 0.3],
    [(p.x0 + p.x1) / 2, p.z1, p.x1 - p.x0, 0.3],
    [p.x0, (p.z0 + p.z1) / 2, 0.3, p.z1 - p.z0],
    [p.x1, (p.z0 + p.z1) / 2, 0.3, p.z1 - p.z0]
  ]) {
    bbox(deck, w, 1.1, d, std('#5e9d9f', 0.35), x, -0.95, z, 0, false);
  }
  // Water shader
  const waterMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSun: { value: new THREE.Vector3(-0.5, 0.4, 0.8) } },
    transparent: true,
    vertexShader: `varying vec3 vW; void main(){ vec4 wp=modelMatrix*vec4(position,1.0); vW=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }`,
    fragmentShader: `uniform float uTime; varying vec3 vW;
      void main(){
        float a = sin(vW.x*2.2 + uTime*1.2)*0.5+0.5;
        float b = sin(vW.z*3.1 - uTime*1.4)*0.5+0.5;
        float c = sin((vW.x+vW.z)*4.3 + uTime*2.0)*0.5+0.5;
        vec3 col = mix(vec3(0.18,0.52,0.55), vec3(0.55,0.84,0.81), 0.4 + a*0.22 + b*0.15);
        col += vec3(1.0,0.92,0.76) * pow(c, 18.0) * 0.55;
        gl_FragColor = vec4(col, 0.88);
      }`
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(p.x1 - p.x0 - 0.25, p.z1 - p.z0 - 0.25), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set((p.x0 + p.x1) / 2, -0.06, (p.z0 + p.z1) / 2);
  water.userData.noBake = true;
  deck.add(water);
  app.poolWater = water;
  // Pool steps
  for (let i = 0; i < 3; i++) {
    bbox(deck, 1.4, 0.18, 0.45, std('#7fb6b3', 0.4), p.x0 + 1.1, -0.2 - i * 0.18, p.z1 - 0.9 - i * 0.4, 0, false);
  }
  // Edge coping
  bbox(deck, p.x1 - p.x0 + 0.6, 0.10, 0.34, stone, (p.x0 + p.x1) / 2, 0.04, p.z0 - 0.1, 0, false);
  bbox(deck, p.x1 - p.x0 + 0.6, 0.10, 0.34, stone, (p.x0 + p.x1) / 2, 0.04, p.z1 + 0.1, 0, false);

  // Loungers along the south edge
  for (let i = 0; i < 7; i++) {
    addLounger(deck, -6 + i * 3.25, 16.0, 0, i % 2);
  }
  // Cabanas on the east deck
  for (let i = 0; i < 3; i++) addCabana(deck, 15.1, 7.2 + i * 3.1);
  // Umbrellas
  for (const x of [-5.5, 4.2, 12.0]) addUmbrella(deck, x, 6.8);
  // Side tables with drinks
  for (let i = 0; i < 4; i++) {
    const x = -3.8 + i * 4;
    cyl(deck, 0.24, 0.22, 0.04, MAT.agedBrass, x, 0.56, 14.4, 16);
    cyl(deck, 0.03, 0.03, 0.55, MAT.agedBrass, x, 0.02, 14.4, 8);
    cyl(deck, 0.06, 0.05, 0.12, MAT.glass, x + 0.08, 0.60, 14.4, 12);
  }
  // Outdoor shower
  const shower = new THREE.Group();
  shower.position.set(16.2, 0, 15.8);
  deck.add(shower);
  bbox(shower, 1.0, 0.08, 1.0, stone, 0, 0, 0, 0, false);
  cyl(shower, 0.04, 0.04, 2.3, MAT.brass, 0, 0, -0.35, 8);
  bbox(shower, 0.65, 0.07, 0.07, MAT.brass, -0.25, 2.15, -0.35, 0, false);
  cyl(shower, 0.15, 0.15, 0.03, MAT.chrome, -0.52, 2.14, -0.35, 16);
  for (let i = 0; i < 7; i++) cyl(shower, 0.006, 0.006, 0.28, std('#cfe4e1', 0.2, 0.1, { transparent: true, opacity: 0.4 }), -0.52, 1.76 - i * 0.03, -0.55 + i * 0.05, 5);
  // Towels
  bbox(deck, 0.45, 0.16, 0.32, MAT.towel, 16.9, 0.06, 16.4, 0.2, false);

  // Poolside service bar hatch
  bbox(deck, 4.0, 1.05, 0.8, teak, 12, 0, 5.4);
  bbox(deck, 4.2, 0.08, 0.95, stone, 12, 1.05, 5.4, 0, false);
  for (let i = 0; i < 4; i++) {
    cyl(deck, 0.05, 0.04, 0.18, MAT.glass, 10.8 + i * 0.65, 1.14, 5.35, 12);
  }
}

function addLounger(g, x, z, ry = 0, variant = 0) {
  const grp = new THREE.Group();
  grp.position.set(x, 0, z);
  grp.rotation.y = ry;
  g.add(grp);
  bbox(grp, 0.72, 0.08, 1.85, std('#6f5238', 0.8), 0, 0.30, 0);
  for (const dx of [-0.32, 0.32]) for (const dz of [-0.78, 0.78]) {
    bbox(grp, 0.05, 0.30, 0.05, MAT.agedBrass, dx, 0.0, dz);
  }
  rbox(grp, 0.66, 0.12, 1.30, 0.05, variant ? std('#e4d9c4', 0.95) : MAT.towel, 0, 0.38, 0.15);
  rbox(grp, 0.66, 0.10, 0.52, 0.05, variant ? std('#e4d9c4', 0.95) : MAT.towel, 0, 0.64, -0.62);
  bbox(grp, 0.45, 0.05, 0.42, std('#c8b493', 0.9), 0, 0.48, 0.62, 0, false);
  if (variant) cyl(grp, 0.05, 0.045, 0.14, std('#8fa38c', 0.2, 0.1), 0.18, 0.53, 0.60, 10);
  return grp;
}

function addUmbrella(g, x, z) {
  const grp = new THREE.Group();
  grp.position.set(x, 0, z);
  g.add(grp);
  cyl(grp, 0.035, 0.04, 2.55, std('#7d6549', 0.8), 0, 0, 0, 8);
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.75, 0.55, 12), std('#e7ddc9', 0.95));
  canopy.position.y = 2.55;
  canopy.castShadow = true;
  grp.add(canopy);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    bbox(grp, 0.02, 0.02, 0.60, std('#cabfa8', 0.9), Math.cos(a) * 0.86, 2.32, Math.sin(a) * 0.86, a, false);
  }
  return grp;
}

function addCabana(g, x, z) {
  const grp = new THREE.Group();
  grp.position.set(x, 0, z);
  g.add(grp);
  bbox(grp, 2.7, 0.12, 2.9, teak, 0, 0.02, 0);
  for (const dx of [-1.25, 1.25]) for (const dz of [-1.3, 1.3]) {
    bbox(grp, 0.10, 2.45, 0.10, MAT.agedBrass, dx, 0, dz);
  }
  bbox(grp, 2.9, 0.12, 3.1, std('#d8cbb4', 0.92), 0, 2.45, 0, 0, false);
  // Curtains at the sides
  for (const dx of [-1.3, 1.3]) {
    for (let i = 0; i < 4; i++) {
      bbox(grp, 0.05, 2.15, 0.20, std('#e8dfce', 0.98, 0, { transparent: true, opacity: 0.8 }), dx, 0.22, -1.1 + i * 0.72, 0, false);
    }
  }
  // Daybed
  bbox(grp, 2.1, 0.35, 1.15, std('#6f5238', 0.8), 0, 0.18, 0.45);
  rbox(grp, 2.0, 0.18, 1.05, 0.07, MAT.towel, 0, 0.52, 0.45);
  for (let i = 0; i < 3; i++) rbox(grp, 0.45, 0.28, 0.12, 0.06, std(i % 2 ? '#c3a983' : '#8fa38c', 0.9), -0.65 + i * 0.65, 0.64, 0.0, 0.08);
  cyl(grp, 0.25, 0.23, 0.04, MAT.agedBrass, 1.1, 0.55, 0.65, 12);
  return grp;
}

function buildPatios(g) {
  // Garden-wing patios
  for (const r of ROOM_LAYOUT.filter(r => r.floor === 1)) {
    const north = r.z0 < 12;
    const z = north ? 4.7 : 21.1;
    const depth = north ? 1.15 : 1.55;
    const cx = (r.x0 + r.x1) / 2;
    bbox(g, r.x1 - r.x0 - 0.5, 0.08, depth, teak, cx, 0.03, z + depth / 2, 0, false);
    bbox(g, r.x1 - r.x0 - 0.5, 0.05, 0.05, MAT.agedBrass, cx, 0.10, z + 0.05, 0, false);
    // hedge/fence at the outer edge
    for (let i = 0; i < 4; i++) {
      bbox(g, 0.42, 0.65, 0.42, MAT.olive, r.x0 + 0.6 + i * ((r.x1 - r.x0 - 1.2) / 3), 0.08, z + depth - 0.15, 0, false);
    }
    addPatioChair(g, cx - 1.0, z + depth / 2, north ? 0.2 : Math.PI, r.palette === 0 ? '#c3a983' : '#aeb49a');
    addPatioChair(g, cx + 1.0, z + depth / 2, north ? -0.2 : Math.PI + 0.2, r.palette === 0 ? '#c3a983' : '#aeb49a');
    cyl(g, 0.25, 0.24, 0.04, MAT.agedBrass, cx, 0.48, z + depth / 2, 12);
    bbox(g, 0.01, 0.4, 0.01, MAT.agedBrass, cx, 0.08, z + depth / 2, 0, false);
    glow(g, cx, 0.85, z + depth / 2, 0.45, '#ffd39a', 0.22);
  }
}

function addPatioChair(g, x, z, ry, color) {
  const grp = new THREE.Group();
  grp.position.set(x, 0, z);
  grp.rotation.y = ry;
  g.add(grp);
  bbox(grp, 0.58, 0.07, 0.56, std(color, 0.92), 0, 0.42, 0);
  rbox(grp, 0.54, 0.44, 0.08, 0.04, std(color, 0.92), 0, 0.45, -0.25);
  for (const dx of [-0.24, 0.24]) for (const dz of [-0.22, 0.22]) {
    bbox(grp, 0.05, 0.42, 0.05, std('#6b5138', 0.8), dx, 0, dz);
  }
}

function buildGardens(g) {
  // Palm trees around the pool and forecourt
  const palmSpots = [
    [-12.6, 9.2], [-12.4, 17.4], [18.4, 18.8], [23.6, 4.5], [-23.5, -21.8], [12.5, -22.6]
  ];
  for (const [x, z] of palmSpots) addPalm(g, x, z, 1 + Math.random() * 0.3);

  // Olive trees / coastal canopy
  const oliveSpots = [
    [-27.5, 22.6], [-19.5, 22.8], [6, 22.6], [12, 22.5], [-30.5, -21], [24, -21.5]
  ];
  for (const [x, z] of oliveSpots) addOlive(g, x, z, 0.9 + Math.random() * 0.4);

  // Hedges and grasses
  for (let x = -18; x <= 20; x += 3.2) {
    bbox(g, 1.9, 0.55 + Math.random() * 0.25, 0.8, MAT.olive, x, 0.02, 22.0, 0, false);
  }
  for (let x = -10; x <= 16; x += 1.6) {
    for (let i = 0; i < 5; i++) {
      const bx = x + (Math.random() - .5) * 1.2;
      const bz = 18.1 + Math.random() * 2.2;
      bbox(g, 0.04, 0.55 + Math.random() * 0.55, 0.04, std('#8e956d', 0.95), bx, 0.02, bz, Math.random(), false);
    }
  }
  // Planters around pool
  for (const [x, z] of [[-8.2, 6.2], [16.4, 6.4], [16.4, 16.6], [-8.2, 16.4]]) {
    cyl(g, 0.42, 0.34, 0.65, MAT.terracotta, x, 0.02, z, 16);
    addPlant(g, x, z + 0.02, 0.9, std('#9c7b57', 0.9));
  }

  // Spa garden with steam vent and stones
  for (let i = 0; i < 7; i++) {
    sphere(g, 0.25 + Math.random() * 0.25, std('#888273', 0.9), 20 + Math.random() * 8, 0.16, 19 + Math.random() * 2.2, 7);
  }
  bbox(g, 4.2, 0.3, 0.4, std('#7d7464', 0.9), 24, 0.1, 20.4, 0, false);
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.cloud, color: new THREE.Color('#f6f0e5'), transparent: true, opacity: 0.15, depthWrite: false }));
    s.position.set(21 + Math.random() * 6, 0.7 + Math.random() * 1.1, 18.2 + Math.random() * 2);
    s.scale.set(1.8, 1.8, 1);
    g.add(s);
  }
}

function addPalm(g, x, z, scale = 1) {
  const grp = new THREE.Group();
  grp.position.set(x, 0, z);
  grp.scale.setScalar(scale);
  g.add(grp);
  let px = 0, pz = 0;
  for (let i = 0; i < 7; i++) {
    const seg = cyl(grp, 0.17 - i * 0.012, 0.20 - i * 0.012, 0.9, std('#8d7350', 0.92), px, i * 0.86, pz, 7);
    px += 0.055; pz += 0.018;
    seg.rotation.z = -0.04;
  }
  const crownY = 6.1;
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 3.0), std('#5d7349', 0.9, 0, { side: THREE.DoubleSide }));
    leaf.position.set(px + Math.cos(a) * 1.0, crownY + 0.2 - (i % 3) * 0.1, pz + Math.sin(a) * 1.0);
    leaf.rotation.y = -a + Math.PI / 2;
    leaf.rotation.x = -0.65 + (i % 2) * 0.15;
    leaf.rotation.z = 0.2;
    grp.add(leaf);
  }
  // Coconuts
  for (let i = 0; i < 3; i++) sphere(grp, 0.10, std('#6d5d42', 0.9), px + (Math.random() - .5) * 0.4, crownY - 0.2, pz + (Math.random() - .5) * 0.4, 8);
}

function addOlive(g, x, z, scale = 1) {
  const grp = new THREE.Group();
  grp.position.set(x, 0, z);
  grp.scale.setScalar(scale);
  g.add(grp);
  cyl(grp, 0.14, 0.24, 2.2, std('#6c5b45', 0.95), 0, 0, 0, 7);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const canopy = sphere(grp, 0.95 + Math.random() * 0.35, std('#707d5c', 0.95), Math.cos(a) * 0.8, 2.3 + Math.random() * 0.5, Math.sin(a) * 0.8, 8);
    canopy.scale.y = 0.8;
  }
}

function buildArrival(g) {
  // Low stone wall and planting at the street edge
  bbox(g, 14, 0.65, 0.4, stone, 0, 0.02, -42, 0, false);
  for (let x = -6.4; x <= 6.4; x += 1.2) {
    bbox(g, 0.9, 0.5, 0.7, MAT.olive, x, 0.02, -41.3, 0, false);
  }
  // Warm path lights
  for (let z = -40; z <= -24; z += 4.8) {
    for (const x of [-11.5, 11.5]) {
      bbox(g, 0.16, 0.75, 0.16, MAT.agedBrass, x, 0, z);
      bbox(g, 0.18, 0.22, 0.18, MAT.warmBulb, x, 0.72, z, 0, false);
      glow(g, x, 0.82, z, 0.65, '#ffd39a', 0.28);
    }
  }
  // Bicycles parked by the entrance
  for (let i = 0; i < 2; i++) {
    const bx = -13.5 + i * 1.1, bz = -19;
    for (const dz of [-0.55, 0.55]) {
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 6, 18), MAT.blackMetal);
      wheel.position.set(bx, 0.38, bz + dz);
      wheel.rotation.y = Math.PI / 2;
      g.add(wheel);
    }
    bbox(g, 0.045, 0.045, 1.1, std('#9a6b48', 0.7), bx, 0.52, bz);
    bbox(g, 0.045, 0.55, 0.045, std('#9a6b48', 0.7), bx, 0.40, bz + 0.45);
    bbox(g, 0.28, 0.04, 0.07, std('#3c3329', 0.8), bx, 0.86, bz + 0.55);
  }
}
