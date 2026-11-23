import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { initMaterials } from './materials.js';
import { LEVELS, SERVICE_BY_ID, ROOM_BY_NUMBER } from './data.js';
import { buildShell, buildCirculation, buildCorridors, finaliseArchitecture } from './architecture.js';
import { buildRooms } from './rooms.js';
import { buildLandscape } from './landscape.js';
import { buildGroundPublic, buildLevel2Public, buildLevel3Public } from './public.js';
import { addDetailPass } from './details.js';
import { TourControls } from './controls.js';
import { TourUI } from './ui.js';

const canvas = document.getElementById('tour-canvas');
const loader = document.getElementById('tour-loader');
const loaderNote = document.getElementById('tour-loader-note');

function fail(err) {
  console.error('[Royal Haven tour]', err);
  if (loaderNote) {
    loaderNote.textContent = 'The 3D view could not start. Your browser may not support WebGL2.';
    loaderNote.classList.add('is-error');
  }
}

function boot() {
  initMaterials();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
    alpha: false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#dce4e1');
  scene.fog = new THREE.Fog('#dbe2dc', 78, 300);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.08, 520);
  camera.position.set(0, 1.62, -16.15);

  // Image-based lighting for metals, glass and polished stone
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new RoomEnvironment();
  const envRT = pmrem.fromScene(envScene, 0.035);
  scene.environment = envRT.texture;
  envScene.dispose?.();

  // Golden-hour key light over the sea
  const sun = new THREE.DirectionalLight('#ffe2b6', 2.35);
  sun.position.set(-46, 52, 64);
  sun.target.position.set(0, 3.2, -6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -52;
  sun.shadow.camera.right = 52;
  sun.shadow.camera.top = 48;
  sun.shadow.camera.bottom = -40;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 210;
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  scene.add(sun.target);

  const hemi = new THREE.HemisphereLight('#dfeef2', '#6d5c47', 0.62);
  scene.add(hemi);
  const ambient = new THREE.AmbientLight('#f4ead9', 0.22);
  scene.add(ambient);
  // Cool fill from the north, as if bouncing off the forecourt
  const fill = new THREE.DirectionalLight('#c9dbe0', 0.35);
  fill.position.set(18, 24, -40);
  scene.add(fill);

  const app = {
    scene, camera, renderer,
    interactives: [],
    floorGroups: { 1: new THREE.Group(), 2: new THREE.Group(), 3: new THREE.Group() },
    colliders: []
  };
  for (const f of [1, 2, 3]) {
    app.floorGroups[f].name = `floor-${f}`;
    scene.add(app.floorGroups[f]);
  }

  buildLandscape(app);
  buildShell(app);
  buildCirculation(app);
  buildCorridors(app);
  buildRooms(app);
  buildGroundPublic(app);
  buildLevel2Public(app);
  buildLevel3Public(app);
  addDetailPass(app);
  finaliseArchitecture(app);

  const ui = new TourUI(app);
  const controls = new TourControls(app, ui);
  ui.setControls(controls);
  app.ui = ui;
  app.controls = controls;
  window.RH_TOUR = app;

  // Deep links: ?room=203 · ?service=spa · ?floor=2
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  const service = params.get('service');
  const floor = Number(params.get('floor'));
  let deepLinked = false;
  if (room && ROOM_BY_NUMBER[room]) {
    deepLinked = true;
    ui.startTour(false);
    setTimeout(() => ui.openRoom(room), 60);
  } else if (service && SERVICE_BY_ID[service]) {
    deepLinked = true;
    ui.startTour(false);
    if (service === 'lift') setTimeout(() => ui.openLift(), 60);
    else if (service === 'stairs') setTimeout(() => controls.useStairs(), 300);
    else setTimeout(() => ui.openService(service), 60);
  } else if (LEVELS[floor - 1]) {
    deepLinked = true;
    ui.startTour(false);
    setTimeout(() => controls.setFloor(floor), 60);
  }
  if (deepLinked) {
    ui.el.welcome.hidden = true;
    document.body.classList.remove('tour-intro');
  }

  // Resize
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 180));

  const clock = new THREE.Clock();
  let frames = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.06);
    const t = clock.elapsedTime;

    controls.update(dt);
    ui.update(dt);

    if (app.ocean?.material?.uniforms?.uTime) {
      app.ocean.material.uniforms.uTime.value = t;
    }
    if (app.poolWater?.material?.uniforms?.uTime) {
      app.poolWater.material.uniforms.uTime.value = t;
    }
    if (app.liftCabin) {
      const targetY = LEVELS[controls.floor - 1].y + 0.05;
      app.liftCabin.position.y += (targetY - app.liftCabin.position.y) * Math.min(1, dt * 1.4);
    }

    renderer.render(scene, camera);

    frames++;
    if (frames === 2 && loader) {
      loader.classList.add('is-done');
      setTimeout(() => loader.remove(), 900);
    }
  };
  animate();

  // Pause the clock when the tab is hidden so returning does not jump
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) clock.getDelta();
  });
}

try {
  boot();
} catch (err) {
  fail(err);
}
