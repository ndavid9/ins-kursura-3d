import * as THREE from 'three';
import { LENGTH, Y0 } from './specs.js';
import { mats } from './materials.js';

const SEG_X = 64;
const SEG_A = 36;

function smooth(t) {
  t = Math.min(1, Math.max(0, t));
  return t * t * (3 - 2 * t);
}

function dimsAt(x) {
  const u = x / LENGTH;
  let hb;
  if (u < 0.05) hb = 4 * Math.pow(u / 0.05, 0.34);
  else if (u < 0.2) hb = 4 * (0.78 + 0.22 * smooth((u - 0.05) / 0.15));
  else if (u < 0.62) hb = 4;
  else if (u < 0.86) hb = 4 * (1 - 0.16 * ((u - 0.62) / 0.24));
  else hb = 4 * 0.84 * (1 - Math.pow((u - 0.86) / 0.14, 0.7));

  let deck = 6.55 + 0.7 * Math.sin(Math.min(1, u * 1.15) * Math.PI);
  if (u < 0.07) deck = 5.15 + (deck - 5.15) * Math.pow(u / 0.07, 0.4);
  if (u > 0.9) deck -= 1.35 * Math.pow((u - 0.9) / 0.1, 1.1);

  let keel = 0.2;
  if (u < 0.14) {
    keel = 0.2 - 0.45 * Math.sin((u / 0.14) * Math.PI) + 1.55 * Math.pow(Math.max(0, 1 - u / 0.1), 1.6);
  }
  if (u > 0.88) keel = 0.2 + 2.35 * Math.pow((u - 0.88) / 0.12, 1.25);

  const n = 2.05 + 0.4 * Math.sin(Math.min(1, u / 0.5) * Math.PI * 0.5);
  return { halfBeam: Math.max(0.08, hb), deck, keel, n };
}

function sectionPoint(x, a) {
  const d = dimsAt(x);
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const ex = 2 / d.n;
  let z = Math.sign(ca || 1) * Math.pow(Math.abs(ca), ex);
  let yN = Math.sign(sa || 1) * Math.pow(Math.abs(sa), ex);

  if (x < 14) {
    const bow = smooth(1 - x / 14);
    const upper = Math.exp(-((yN - 0.42) ** 2) / 0.16);
    const lowerStart = smooth((x - 0.6) / 2.2);
    const lower = Math.exp(-((yN + 0.5) ** 2) / 0.2) * lowerStart;
    const lobe = Math.min(1, upper * 1.08 + lower * 1.05);
    const waist = 0.22 + 0.78 * lobe;
    z *= 1 - bow + bow * waist;
    if (x < 2.2 && yN < -0.05) {
      const fade = smooth((2.2 - x) / 2.2) * smooth((-yN) / 0.8);
      z *= 1 - fade * 0.85;
    }
  }

  const cy = (d.deck + d.keel) / 2;
  const ry = (d.deck - d.keel) / 2;
  let y = cy + yN * ry;
  z *= d.halfBeam;

  const deckY = d.deck;
  if (y > deckY - 0.55 && x > 9 && x < 83) {
    const t = smooth((y - (deckY - 0.55)) / 0.55);
    y = y * (1 - t) + (deckY - 0.04) * t;
    z *= 1 + 0.06 * t * (1 - Math.abs(ca));
  }

  return { x, y: y + Y0, z };
}

function paint(x, y) {
  const yLocal = y - Y0;
  if (x < 10.5 && yLocal > 5.15) return [0.82, 0.84, 0.86];
  if (x < 12.5 && yLocal < 2.7) return [0.86, 0.88, 0.9];
  if (yLocal > 6.35 && x > 8 && x < 84) return [0.1, 0.12, 0.13];
  const grit = 0.92 + 0.08 * Math.abs(Math.sin(x * 1.7 + y * 2.3));
  return [0.16 * grit, 0.18 * grit, 0.2 * grit];
}

export function createHullMesh() {
  const positions = [];
  const uvs = [];
  const colors = [];
  const indices = [];
  const stride = SEG_A + 1;

  for (let i = 0; i <= SEG_X; i++) {
    const x = (i / SEG_X) * LENGTH;
    for (let j = 0; j <= SEG_A; j++) {
      const a = (j / SEG_A) * Math.PI * 2;
      const p = sectionPoint(x, a);
      positions.push(p.x, p.y, p.z);
      uvs.push(x / 4.2, j / SEG_A);
      colors.push(...paint(p.x, p.y));
    }
  }
  for (let i = 0; i < SEG_X; i++) {
    for (let j = 0; j < SEG_A; j++) {
      const a = i * stride + j;
      const b = a + stride;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mats.hull);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = 'hull';
  return mesh;
}

export function hullPoint(x, a) {
  return sectionPoint(x, a);
}

export function deckHeightAt(x) {
  return dimsAt(x).deck + Y0;
}
