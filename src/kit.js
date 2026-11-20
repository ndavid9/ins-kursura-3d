import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
/** Fewer repeated fittings on a phone. The big shapes stay. */
export const DENSITY = coarse ? 0.62 : 1;

const CYL = new THREE.CylinderGeometry(1, 1, 1, 6);
const BOX = new THREE.BoxGeometry(1, 1, 1);
const GAUGE = new THREE.CircleGeometry(0.075, 12);

function wheelGeo() {
  const ring = new THREE.TorusGeometry(0.1, 0.016, 4, 8);
  const hub = new THREE.CylinderGeometry(0.022, 0.022, 0.028, 6);
  hub.rotateX(Math.PI / 2);
  const spokes = [0, 1, 2].map((i) => {
    const s = new THREE.BoxGeometry(0.18, 0.014, 0.01);
    s.rotateZ((i * Math.PI) / 3);
    return s;
  });
  return mergeGeometries([ring, hub, ...spokes]);
}
const WHEEL = wheelGeo();

const bags = new Map();
const m = new THREE.Matrix4();
const q = new THREE.Quaternion();
const p = new THREE.Vector3();
const s = new THREE.Vector3();
const e = new THREE.Euler();

function push(key, geo, mat, x, y, z, rx, ry, rz, sx, sy, sz) {
  let b = bags.get(key);
  if (!b) {
    b = { geo, mat, list: [] };
    bags.set(key, b);
  }
  p.set(x, y, z);
  e.set(rx, ry, rz);
  q.setFromEuler(e);
  s.set(sx, sy, sz);
  m.compose(p, q, s);
  b.list.push(m.clone());
}

/** Unit cylinder is Y-up. axis x or z lays it along that axis. */
export function pipe(mat, radius, len, x, y, z, axis = 'x') {
  const rx = axis === 'z' ? Math.PI / 2 : 0;
  const rz = axis === 'x' ? Math.PI / 2 : 0;
  const ry = axis === 'y' ? 0 : 0;
  push(mat.uuid + ':cyl', CYL, mat, x, y, z, rx, ry, rz, radius, len, radius);
}

export function boxI(mat, sx, sy, sz, x, y, z, rx = 0, ry = 0, rz = 0) {
  push(mat.uuid + ':box', BOX, mat, x, y, z, rx, ry, rz, sx, sy, sz);
}

/** face: +z toward starboard side of the passage, -z toward port, ±x along the boat. */
function faceEuler(face) {
  if (face === '-z') return [0, Math.PI, 0];
  if (face === '+x') return [0, Math.PI / 2, 0];
  if (face === '-x') return [0, -Math.PI / 2, 0];
  return [0, 0, 0];
}

export function handwheel(mat, x, y, z, face = '+z', scale = 1) {
  const [rx, ry, rz] = faceEuler(face);
  push(mat.uuid + ':wheel', WHEEL, mat, x, y, z, rx, ry, rz, scale, scale, scale);
}

export function dial(mat, x, y, z, face = '+z', scale = 1) {
  const [rx, ry, rz] = faceEuler(face);
  push(mat.uuid + ':gauge', GAUGE, mat, x, y, z, rx, ry, rz, scale, scale, scale);
}

export function plate(mat, x, y, z, face = '+z', w = 0.28, h = 0.14) {
  const [rx, ry, rz] = faceEuler(face);
  push(mat.uuid + ':plate', BOX, mat, x, y, z, rx, ry, rz, w, h, 0.012);
}

export function flushKit(parent) {
  for (const b of bags.values()) {
    if (!b.list.length) continue;
    const mesh = new THREE.InstancedMesh(b.geo, b.mat, b.list.length);
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.matrixAutoUpdate = false;
    for (let i = 0; i < b.list.length; i++) mesh.setMatrixAt(i, b.list[i]);
    mesh.instanceMatrix.needsUpdate = true;
    parent.add(mesh);
    b.list.length = 0;
  }
  bags.clear();
}

export function kitCounts() {
  return 0;
}
