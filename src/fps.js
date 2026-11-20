import * as THREE from 'three';
import { COMPARTMENTS, HATCH_X, DECK_Y, EYE, LENGTH } from './specs.js';

const XMIN = 13.5;
const XMAX = 81.05;

export function createFPS(camera, dom) {
  const state = {
    enabled: false,
    yaw: 0,
    pitch: -0.06,
    x: 15.2,
    z: 0.2,
    dragging: false,
    lastX: 0,
    lastY: 0,
    pointerLocked: false,
    move: { x: 0, y: 0 },
  };
  const keys = new Set();
  const OFF = LENGTH / 2;

  function passage(x) {
    let z = 0;
    let half = 0.36;
    let zMin = null;
    let zMax = null;
    if (x > 14.1 && x < 17.6) {
      z = 0.15;
      half = 0.34;
      zMin = -0.4;
      zMax = 1.55;
    } else if (x > 54.6 && x < 64.2) {
      z = 0.42;
      half = 0.16;
    } else if (x > 66.0 && x < 72.2) {
      z = 0.32;
      half = 0.18;
    } else if (x > 77.6 && x < 81.0) {
      z = 0.05;
      half = 0.34;
      zMin = -0.4;
      zMax = 1.45;
    }
    for (const hx of HATCH_X) {
      const d = Math.abs(x - hx);
      if (d < 1.15) {
        const t = d / 1.15;
        z *= t;
        half = Math.min(half, 0.3);
        zMin = null;
        zMax = null;
      }
    }
    return { z, half, zMin, zMax };
  }

  function clampPos(x, z) {
    x = THREE.MathUtils.clamp(x, XMIN, XMAX);
    const p = passage(x);
    const z0 = p.zMin ?? p.z - p.half;
    const z1 = p.zMax ?? p.z + p.half;
    z = THREE.MathUtils.clamp(z, z0, z1);
    return { x, z };
  }

  function applyCamera() {
    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const dir = new THREE.Vector3(cy * cp, sp, sy * cp);
    const eye = new THREE.Vector3(state.x - OFF, DECK_Y + EYE, state.z);
    camera.position.copy(eye);
    camera.up.set(0, 1, 0);
    camera.lookAt(eye.clone().add(dir));
  }

  function tryMove(nx, nz) {
    for (const hx of HATCH_X) {
      const crossing = (state.x - hx) * (nx - hx) < 0;
      if (crossing && Math.abs(nz) > 0.34) {
        nx = hx + Math.sign(state.x - hx) * 0.08;
      }
    }
    const c = clampPos(nx, nz);
    state.x = c.x;
    state.z = c.z;
  }

  function update(dt) {
    if (!state.enabled) return;
    const forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
    const strafe = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
    const fx = forward + state.move.y;
    const sx = strafe + state.move.x;
    const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 3.6 : 2.25;
    const mag = Math.hypot(fx, sx);
    if (mag > 0.001) {
      const k = (mag > 1 ? 1 / mag : 1) * speed * dt;
      const dirX = Math.cos(state.yaw);
      const dirZ = Math.sin(state.yaw);
      const rightX = -Math.sin(state.yaw);
      const rightZ = Math.cos(state.yaw);
      tryMove(state.x + (dirX * fx + rightX * sx) * k, state.z + (dirZ * fx + rightZ * sx) * k);
    }
    applyCamera();
  }

  function teleport(id) {
    const c = COMPARTMENTS.find((d) => d.id === id) || COMPARTMENTS[0];
    let x = THREE.MathUtils.clamp((c.x0 + c.x1) / 2, XMIN, XMAX);
    if (c.id === 'c1') x = 16.6;
    const p = passage(x);
    state.x = x;
    state.z = c.id === 'c1' ? 0.45 : p.z;
    state.yaw = c.id === 'c1' ? Math.PI * 0.88 : 0;
    state.pitch = -0.16;
    if (state.enabled) applyCamera();
  }

  function enable() {
    state.enabled = true;
    applyCamera();
  }
  function disable() {
    state.enabled = false;
    if (document.pointerLockElement === dom) document.exitPointerLock();
  }

  function look(dx, dy) {
    state.yaw -= dx * 0.0023;
    state.pitch -= dy * 0.002;
    state.pitch = THREE.MathUtils.clamp(state.pitch, -1.15, 1.15);
  }

  dom.addEventListener('click', () => {
    if (!state.enabled) return;
    if (document.pointerLockElement !== dom) {
      dom.requestPointerLock?.();
    }
  });
  document.addEventListener('pointerlockchange', () => {
    state.pointerLocked = document.pointerLockElement === dom;
  });
  document.addEventListener('mousemove', (e) => {
    if (!state.enabled) return;
    if (state.pointerLocked) look(e.movementX, e.movementY);
    else if (state.dragging) look(e.clientX - state.lastX, e.clientY - state.lastY);
    state.lastX = e.clientX;
    state.lastY = e.clientY;
  });
  dom.addEventListener('pointerdown', (e) => {
    if (!state.enabled || e.button !== 0) return;
    state.dragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
  });
  window.addEventListener('pointerup', () => {
    state.dragging = false;
  });
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    keys.add(e.code);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));

  let joyId = null;
  let lookId = null;
  let joyOrigin = null;
  let lookLast = null;
  const joyEl = document.getElementById('joy');
  const knob = document.getElementById('joy-knob');

  function touchById(list, id) {
    for (const t of list) if (t.identifier === id) return t;
    return null;
  }

  dom.parentElement.addEventListener('touchstart', (e) => {
    if (!state.enabled) return;
    for (const t of e.changedTouches) {
      if (t.target.closest && t.target.closest('button, a, dialog, #card, #top, #map')) continue;
      if (joyId === null && t.clientX < window.innerWidth * 0.46) {
        joyId = t.identifier;
        joyOrigin = { x: t.clientX, y: t.clientY };
        joyEl.classList.add('on');
        joyEl.style.left = `${t.clientX - 54}px`;
        joyEl.style.top = `${t.clientY - 54}px`;
        joyEl.style.bottom = 'auto';
      } else if (lookId === null) {
        lookId = t.identifier;
        lookLast = { x: t.clientX, y: t.clientY };
      }
    }
  }, { passive: true });

  dom.parentElement.addEventListener('touchmove', (e) => {
    if (!state.enabled) return;
    const j = touchById(e.changedTouches, joyId) || touchById(e.targetTouches, joyId);
    if (j && joyOrigin) {
      const dx = j.clientX - joyOrigin.x;
      const dy = j.clientY - joyOrigin.y;
      const max = 42;
      const cx = THREE.MathUtils.clamp(dx, -max, max);
      const cy = THREE.MathUtils.clamp(dy, -max, max);
      knob.style.left = `${34 + cx}px`;
      knob.style.top = `${34 + cy}px`;
      state.move.x = cx / max;
      state.move.y = -cy / max;
    }
    const l = touchById(e.changedTouches, lookId);
    if (l && lookLast) {
      look(l.clientX - lookLast.x, l.clientY - lookLast.y);
      lookLast = { x: l.clientX, y: l.clientY };
    }
    if (joyId !== null || lookId !== null) e.preventDefault();
  }, { passive: false });

  function endTouch(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) {
        joyId = null;
        state.move.x = 0;
        state.move.y = 0;
        knob.style.left = '34px';
        knob.style.top = '34px';
        if (!window.matchMedia('(pointer: coarse)').matches) joyEl.classList.remove('on');
      }
      if (t.identifier === lookId) lookId = null;
    }
  }
  dom.parentElement.addEventListener('touchend', endTouch);
  dom.parentElement.addEventListener('touchcancel', endTouch);

  return { state, update, teleport, enable, disable, applyCamera, passage };
}

export function compartmentAt(x) {
  return COMPARTMENTS.find((c) => x >= c.x0 && x < c.x1) || COMPARTMENTS[COMPARTMENTS.length - 1];
}
