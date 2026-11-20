import * as THREE from 'three';

const buckets = new Map();

export function put(mat, geo) {
  let list = buckets.get(mat);
  if (!list) {
    list = [];
    buckets.set(mat, list);
  }
  list.push(geo);
}

export function box(mat, sx, sy, sz, x, y, z, rx = 0, ry = 0, rz = 0) {
  const g = new THREE.BoxGeometry(sx, sy, sz);
  bake(g, x, y, z, rx, ry, rz);
  put(mat, g);
}

export function cyl(mat, rt, rb, h, x, y, z, rx = 0, ry = 0, rz = 0, seg = 12) {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg);
  bake(g, x, y, z, rx, ry, rz);
  put(mat, g);
}

export function sphere(mat, r, x, y, z, seg = 10) {
  const g = new THREE.SphereGeometry(r, seg, seg - 2);
  bake(g, x, y, z);
  put(mat, g);
}

export function tube(mat, r, len, x, y, z, axis = 'x') {
  const g = new THREE.CylinderGeometry(r, r, len, 8);
  if (axis === 'x') g.rotateZ(Math.PI / 2);
  if (axis === 'z') g.rotateX(Math.PI / 2);
  bake(g, x, y, z);
  put(mat, g);
}

function bake(g, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz));
  m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
}

export function flush(parent, { shadow = false } = {}) {
  for (const [mat, geos] of buckets) {
    if (!geos.length) continue;
    const merged = merge(geos);
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = shadow;
    mesh.receiveShadow = shadow;
    parent.add(mesh);
    for (const g of geos) g.dispose();
  }
  buckets.clear();
}

function merge(geos) {
  let bytes = 0;
  for (const g of geos) bytes += g.attributes.position.count;
  const positions = new Float32Array(bytes * 3);
  const normals = new Float32Array(bytes * 3);
  const uvs = new Float32Array(bytes * 2);
  const index = [];
  let v = 0;
  for (const g of geos) {
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const u = g.attributes.uv;
    const base = v;
    for (let i = 0; i < p.count; i++) {
      positions[(v + i) * 3] = p.getX(i);
      positions[(v + i) * 3 + 1] = p.getY(i);
      positions[(v + i) * 3 + 2] = p.getZ(i);
      if (n) {
        normals[(v + i) * 3] = n.getX(i);
        normals[(v + i) * 3 + 1] = n.getY(i);
        normals[(v + i) * 3 + 2] = n.getZ(i);
      }
      if (u) {
        uvs[(v + i) * 2] = u.getX(i);
        uvs[(v + i) * 2 + 1] = u.getY(i);
      }
    }
    if (g.index) {
      const ix = g.index.array;
      for (let i = 0; i < ix.length; i++) index.push(ix[i] + base);
    } else {
      for (let i = 0; i < p.count; i++) index.push(base + i);
    }
    v += p.count;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(index);
  return geo;
}

export function canvasTex(draw, w = 256, h = 256, repeat) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}
