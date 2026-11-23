import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  WALK_ZONES, ROOM_BY_NUMBER, LEVELS, SERVICE_BY_ID, ROOM_LAYOUT
} from './data.js';
import { getDoors } from './architecture.js';

const EYE = 1.62;
const WALK_SPEED = 3.15;
const RUN_SPEED = 5.15;
const PLAYER_RADIUS = 0.26;

/* Landing points used by lift, stairs, floor buttons and deep links. */
export const LANDINGS = {
  1: { x: 4.4, z: -2.6, yaw: 2.55 },
  2: { x: 4.6, z: -2.45, yaw: 2.9 },
  3: { x: 4.6, z: -2.45, yaw: 2.9 }
};

export class TourControls {
  constructor(app, ui) {
    this.app = app;
    this.ui = ui;
    this.camera = app.camera;
    this.dom = app.renderer.domElement;
    this.scene = app.scene;

    this.floor = 1;
    this.pos = new THREE.Vector3(0, 0, -16.15);
    this.yaw = 0.08;
    this.pitch = -0.03;
    this.targetYaw = this.yaw;
    this.targetPitch = this.pitch;
    this.camY = EYE;
    this.velocity = new THREE.Vector2();
    this.keys = new Set();
    this.joystick = new THREE.Vector2();
    this.mode = 'walk';
    this.locked = false;
    this.overview = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.dragging = false;
    this.dragMoved = 0;
    this.dragStart = null;
    this.lastPointer = { x: 0, y: 0 };
    this.focusedRoom = null;
    this.focusedService = null;
    this.walkTime = 0;
    this.hovered = null;
    this.fov = 62;
    this.transition = null;

    this.zones = { 1: [], 2: [], 3: [] };
    for (const z of WALK_ZONES) {
      if (this.zones[z.floor]) this.zones[z.floor].push(z);
    }
    this.colliders = { 1: [], 2: [], 3: [] };
    for (const c of app.colliders || []) {
      if (this.colliders[c.floor]) this.colliders[c.floor].push(c);
    }
    // Stair flights and stairwell openings are solid to walk against
    this.colliders[1].push({ x0: 0.3, x1: 2.5, z0: -13.9, z1: -4.9, kind: 'stair' });
    this.colliders[2].push({ x0: -3.5, x1: -1.3, z0: -5.75, z1: -4.35, kind: 'stair' });
    this.colliders[3].push({ x0: -3.95, x1: -0.85, z0: -15.45, z1: -12.35, kind: 'stairwell' });

    this.doors = getDoors();
    this.bind();
    this.setFloor(1, { silent: true, instant: true });
    this.applyCamera(0);
  }

  /* ------------------------------------------------------------------ */
  /* Input                                                              */
  /* ------------------------------------------------------------------ */
  bind() {
    const canvas = this.dom;
    canvas.style.touchAction = 'none';

    this.onKeyDown = (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
      this.keys.add(k);
      if (k === 'shift') this.keys.add('shift');
      if (k === 'r') this.ui.toast('View reset to the lobby');
      if (k === 'v') this.toggleOverview();
      if (k === 'escape') this.ui.closePanels();
      if (['1', '2', '3'].includes(k)) this.setFloor(Number(k));
      if (k === 'e' || k === 'enter') this.interactCenter();
    };
    this.onKeyUp = (e) => {
      this.keys.delete(e.key.toLowerCase());
      if (e.key === 'Shift') this.keys.delete('shift');
    };
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', () => this.keys.clear());

    canvas.addEventListener('pointerdown', (e) => {
      if (this.mode !== 'walk' || this.locked) return;
      if (e.button !== undefined && e.button !== 0) return;
      this.dragging = true;
      this.dragMoved = 0;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.lastPointer = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add('is-looking');
    });

    canvas.addEventListener('pointermove', (e) => {
      this.updatePointer(e.clientX, e.clientY);
      if (this.dragging) {
        const dx = e.clientX - this.lastPointer.x;
        const dy = e.clientY - this.lastPointer.y;
        this.lastPointer = { x: e.clientX, y: e.clientY };
        this.dragMoved += Math.abs(dx) + Math.abs(dy);
        if (this.mode === 'walk') {
          this.targetYaw -= dx * 0.0042;
          this.targetPitch -= dy * 0.0034;
          this.targetPitch = THREE.MathUtils.clamp(this.targetPitch, -1.18, 1.12);
        }
      } else if (this.mode === 'walk') {
        this.hoverTest();
      }
    });

    const endDrag = (e) => {
      if (!this.dragging) return;
      this.dragging = false;
      canvas.classList.remove('is-looking');
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
      if (this.dragMoved < 9 && this.dragStart) this.pick();
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', (e) => {
      this.dragging = false;
      canvas.classList.remove('is-looking');
    });
    canvas.addEventListener('pointerleave', () => {
      if (!this.dragging) this.ui.hover(null);
    });

    canvas.addEventListener('wheel', (e) => {
      if (this.mode !== 'walk') return;
      e.preventDefault();
      this.fov = THREE.MathUtils.clamp(this.fov + Math.sign(e.deltaY) * 2.6, 40, 76);
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }, { passive: false });
  }

  updatePointer(clientX, clientY) {
    const r = this.dom.getBoundingClientRect();
    this.pointer.x = ((clientX - r.left) / r.width) * 2 - 1;
    this.pointer.y = -((clientY - r.top) / r.height) * 2 + 1;
    this.mouse = { x: clientX, y: clientY };
  }

  setJoystick(x, y) {
    this.joystick.set(x, y);
  }

  /* ------------------------------------------------------------------ */
  /* Camera and movement                                                */
  /* ------------------------------------------------------------------ */
  applyCamera(dt) {
    const cam = this.camera;
    cam.rotation.order = 'YXZ';
    cam.rotation.y = this.yaw + Math.PI;
    cam.rotation.x = this.pitch;
    cam.position.set(this.pos.x, this.camY, this.pos.z);
    if (this.mode === 'overview' && this.overview) this.overview.update();
    if (this.fov !== cam.fov) {
      cam.fov = this.fov;
      cam.updateProjectionMatrix();
    }
  }

  update(dt) {
    dt = Math.min(dt, 0.05);
    this.animateDoors(dt);

    if (this.mode === 'overview') {
      if (this.overview) this.overview.update();
      return;
    }

    // Look smoothing
    const lookLerp = 1 - Math.pow(0.0025, dt);
    this.yaw += (this.targetYaw - this.yaw) * lookLerp;
    this.pitch += (this.targetPitch - this.pitch) * lookLerp;

    // Movement input
    const forward = (this.keys.has('w') || this.keys.has('arrowup') ? 1 : 0)
      - (this.keys.has('s') || this.keys.has('arrowdown') ? 1 : 0);
    const strafe = (this.keys.has('d') || this.keys.has('arrowright') ? 1 : 0)
      - (this.keys.has('a') || this.keys.has('arrowleft') ? 1 : 0);
    let ix = strafe + this.joystick.x;
    let iy = forward + this.joystick.y;
    const len = Math.hypot(ix, iy);
    if (len > 1) { ix /= len; iy /= len; }

    const running = this.keys.has('shift') || (this.keys.has('control') && false);
    const speed = running ? RUN_SPEED : WALK_SPEED;
    const fx = Math.sin(this.yaw);
    const fz = Math.cos(this.yaw);
    const rx = -Math.cos(this.yaw);
    const rz = Math.sin(this.yaw);
    const desiredX = (fx * iy + rx * ix) * speed;
    const desiredZ = (fz * iy + rz * ix) * speed;
    const accel = 1 - Math.pow(0.0009, dt);
    this.velocity.x += (desiredX - this.velocity.x) * accel;
    this.velocity.y += (desiredZ - this.velocity.y) * accel;

    if (len > 0.02) {
      const stepX = this.velocity.x * dt;
      const stepZ = this.velocity.y * dt;
      if (this.canStand(this.floor, this.pos.x + stepX, this.pos.z)) {
        this.pos.x += stepX;
      } else {
        this.velocity.x *= 0.4;
      }
      if (this.canStand(this.floor, this.pos.x, this.pos.z + stepZ)) {
        this.pos.z += stepZ;
      } else {
        this.velocity.y *= 0.4;
      }
      this.walkTime += dt * (running ? 1.5 : 1);
    }

    // Eye height + gentle walking bob
    const floorY = LEVELS[this.floor - 1].y;
    const movement = Math.hypot(this.velocity.x, this.velocity.y);
    const bob = movement > 0.4 ? Math.sin(this.walkTime * 8.5) * 0.022 : 0;
    const targetY = floorY + EYE + bob;
    this.camY += (targetY - this.camY) * (1 - Math.pow(0.0001, dt));

    // Keep look inside the building shell bounds as a final guard
    this.pos.x = THREE.MathUtils.clamp(this.pos.x, -33, 31);
    this.pos.z = THREE.MathUtils.clamp(this.pos.z, -43, 23);

    this.applyCamera(dt);
  }

  canStand(floor, x, z) {
    const zones = this.zones[floor] || [];
    let inZone = false;
    for (const zone of zones) {
      if (x >= zone.x0 && x <= zone.x1 && z >= zone.z0 && z <= zone.z1) { inZone = true; break; }
    }
    if (!inZone) return false;
    const cols = this.colliders[floor] || [];
    for (const c of cols) {
      if (x > c.x0 - PLAYER_RADIUS && x < c.x1 + PLAYER_RADIUS
        && z > c.z0 - PLAYER_RADIUS && z < c.z1 + PLAYER_RADIUS) return false;
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Floors, lifts and stairs                                           */
  /* ------------------------------------------------------------------ */
  setFloor(n, opts = {}) {
    if (!LEVELS[n - 1]) return;
    const changed = this.floor !== n;
    this.floor = n;
    if (!opts.keepPosition) {
      const land = LANDINGS[n];
      this.pos.x = land.x;
      this.pos.z = land.z;
      this.targetYaw = this.yaw = land.yaw;
      this.targetPitch = this.pitch = -0.02;
    }
    const floorY = LEVELS[n - 1].y;
    if (opts.instant) {
      this.camY = floorY + EYE;
    } else {
      this.transition = { from: this.camY, to: floorY + EYE, t: 0 };
    }
    if (this.mode === 'overview') this.toggleOverview(false);
    if (this.ui) {
      this.ui.setFloor(n);
      if (!opts.silent) {
        this.ui.toast(changed ? `Level ${n} — ${LEVELS[n - 1].name}` : LEVELS[n - 1].name);
        this.ui.flash();
      }
    }
    this.focusedRoom = null;
    this.focusedService = null;
  }

  stepFloor(dir) {
    const next = THREE.MathUtils.clamp(this.floor + dir, 1, 3);
    if (next !== this.floor) this.setFloor(next);
    else this.ui.toast(dir > 0 ? 'You are on the top floor' : 'You are on the ground floor');
  }

  useStairs() {
    const next = this.floor === 3 ? 1 : this.floor + 1;
    this.floor = next;
    // Stair landing points on each level, beside the feature stair
    const stairLanding = {
      1: { x: 2.2, z: -4.0, yaw: 1.3 },
      2: { x: 5.6, z: -4.0, yaw: 2.4 },
      3: { x: 5.6, z: -4.0, yaw: 2.4 }
    };
    const l = stairLanding[next];
    this.pos.x = l.x; this.pos.z = l.z;
    this.yaw = this.targetYaw = l.yaw;
    this.pitch = this.targetPitch = 0.05;
    const floorY = LEVELS[next - 1].y;
    this.transition = { from: this.camY, to: floorY + EYE, t: 0 };
    this.ui.setFloor(next);
    this.ui.toast(`Up the feature stair to ${LEVELS[next - 1].name}`);
    this.ui.flash();
    this.focusedRoom = null;
    this.focusedService = null;
  }

  /* ------------------------------------------------------------------ */
  /* Jumping to content                                                 */
  /* ------------------------------------------------------------------ */
  focusRoom(number, opts = {}) {
    const room = ROOM_BY_NUMBER[number];
    if (!room) return;
    this.floor = room.floor;
    const y = LEVELS[room.floor - 1].y;
    const door = room.rot
      ? { x: room.x0 + 1.4, z: room.z1 - 1.15 }
      : { x: room.x1 - 1.4, z: room.z0 + 1.15 };
    // Stand just inside the door, looking across the bed toward the window.
    const cx = (room.x0 + room.x1) / 2;
    const cz = (room.z0 + room.z1) / 2;
    const insideX = room.rot ? room.x0 + 2.0 : room.x1 - 2.0;
    const insideZ = room.rot ? room.z1 - 1.35 : room.z0 + 1.35;
    this.pos.x = insideX;
    this.pos.z = insideZ;
    const targetX = cx + (room.rot ? -1.1 : 1.1);
    const targetZ = cz + (room.rot ? -1.4 : 1.4);
    this.yaw = this.targetYaw = Math.atan2(targetX - this.pos.x, targetZ - this.pos.z);
    this.pitch = this.targetPitch = -0.03;
    this.transition = { from: this.camY, to: y + EYE, t: 0 };
    this.focusedRoom = number;
    this.focusedService = null;
    if (this.mode === 'overview') this.toggleOverview(false);
    this.ui.setFloor(room.floor);
    this.ui.highlightRoom(number);
    if (!opts.silent) {
      this.ui.flash();
      this.ui.toast(`Welcome to suite ${number}`);
    }
  }

  focusService(id, opts = {}) {
    const service = SERVICE_BY_ID[id];
    if (!service) return;
    // The lift and stair have their own interaction.
    if (service.kind === 'lift') { this.ui.openLift(); return; }
    if (service.kind === 'stairs') { this.useStairs(); return; }
    this.floor = service.floor;
    const y = LEVELS[service.floor - 1].y;
    const v = service.view;
    this.pos.x = v.x;
    this.pos.z = v.z;
    const target = service.position;
    this.yaw = this.targetYaw = Math.atan2(target.x - v.x, target.z - v.z);
    this.pitch = this.targetPitch = v.pitch ?? -0.02;
    this.transition = { from: this.camY, to: y + EYE, t: 0 };
    this.focusedService = id;
    this.focusedRoom = null;
    if (this.mode === 'overview') this.toggleOverview(false);
    this.ui.setFloor(service.floor);
    if (!opts.silent) {
      this.ui.flash();
      this.ui.toast(service.title);
    }
  }

  resetView() {
    this.floor = 1;
    this.pos.set(0, 0, -16.15);
    this.yaw = this.targetYaw = 0.08;
    this.pitch = this.targetPitch = -0.03;
    this.transition = { from: this.camY, to: EYE, t: 0 };
    this.ui.setFloor(1);
    this.ui.closePanels();
  }

  /* ------------------------------------------------------------------ */
  /* Picking and hover                                                  */
  /* ------------------------------------------------------------------ */
  raycast() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.raycaster.far = 18;
    const hits = this.raycaster.intersectObjects(this.app.interactives, false);
    for (const hit of hits) {
      if (hit.object.visible === false) continue;
      const hs = hit.object.userData.hotspot;
      if (!hs) continue;
      // Only allow interaction on the active level
      const y = hit.point.y;
      const floorY = LEVELS[this.floor - 1].y;
      if (y < floorY - 0.6 || y > floorY + 4.4) continue;
      return { hotspot: hs, hit };
    }
    return null;
  }

  pick() {
    const result = this.raycast();
    if (!result) {
      this.ui.hover(null);
      return;
    }
    const hs = result.hotspot;
    if (hs.kind === 'room') this.ui.openRoom(hs.id);
    else if (hs.kind === 'service') {
      if (hs.id === 'lift') this.ui.openLift();
      else this.ui.openService(hs.id);
    } else if (hs.kind === 'lift') {
      this.ui.openLift();
    }
  }

  interactCenter() {
    this.pointer.set(0, 0);
    this.pick();
  }

  hoverTest() {
    const result = this.raycast();
    const hs = result ? result.hotspot : null;
    this.hovered = hs;
    if (hs) {
      this.dom.style.cursor = 'pointer';
      this.ui.hover(hs, this.mouse);
    } else {
      this.dom.style.cursor = 'grab';
      this.ui.hover(null);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Overview orbit                                                     */
  /* ------------------------------------------------------------------ */
  toggleOverview(force) {
    const on = typeof force === 'boolean' ? force : this.mode !== 'overview';
    if (on) {
      this.mode = 'overview';
      this.ui.setMode('overview');
      if (!this.overview) {
        this.overview = new OrbitControls(this.camera, this.dom);
        this.overview.enableDamping = true;
        this.overview.dampingFactor = 0.06;
        this.overview.minDistance = 18;
        this.overview.maxDistance = 115;
        this.overview.maxPolarAngle = Math.PI * 0.492;
        this.overview.autoRotate = true;
        this.overview.autoRotateSpeed = 0.32;
        this.overview.target.set(0, 4.2, -2);
      }
      this.camera.position.set(37, 30, 37);
      this.camera.rotation.order = 'XYZ';
      this.camera.lookAt(0, 4.2, -2);
      this.overview.target.set(0, 4.2, -2);
      this.overview.enabled = true;
      this.overview.update();
      this.ui.toast('Survey the whole house — drag to orbit');
    } else {
      this.mode = 'walk';
      if (this.overview) this.overview.enabled = false;
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
      this.applyCamera(0);
      this.ui.setMode('walk');
      this.ui.toast('Back on foot');
    }
  }

  /* ------------------------------------------------------------------ */
  /* Doors                                                              */
  /* ------------------------------------------------------------------ */
  animateDoors(dt) {
    const world = new THREE.Vector3();
    for (const door of this.doors) {
      if (!door.parent) continue;
      const d = door.userData.door;
      if (!d) continue;
      door.getWorldPosition(world);
      const y = LEVELS[this.floor - 1].y;
      const near = this.mode === 'walk'
        && Math.abs(world.y - y) < 4
        && world.distanceTo(new THREE.Vector3(this.pos.x, y, this.pos.z)) < 3.3;
      const target = near ? d.openSign * 1.15 : 0;
      d.angle += (target - d.angle) * (1 - Math.pow(0.002, dt));
      d.leaf.rotation.y = d.angle;
    }
  }
}
