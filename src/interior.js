import * as THREE from 'three';
import {
  COMPARTMENTS,
  HOTSPOTS,
  DECK_Y,
  PH_C,
  PH_R,
} from './specs.js';
import { mats, markerMaterial } from './materials.js';
import { box, cyl, sphere, tube, flush } from './factory.js';
import { fitOut } from './fitout.js';
import { flushKit } from './kit.js';

const D = DECK_Y;

function shellR(x) {
  if (x < 20) return THREE.MathUtils.lerp(1.9, PH_R, (x - 12) / 8);
  if (x > 74) return THREE.MathUtils.lerp(PH_R, 1.8, (x - 74) / 8.2);
  return PH_R;
}

export function createInterior() {
  const root = new THREE.Group();
  root.name = 'interior';
  const lights = [];

  for (const c of COMPARTMENTS) {
    const r0 = shellR(c.x0);
    const r1 = shellR(c.x1);
    const len = c.x1 - c.x0;
    const geo = new THREE.CylinderGeometry(r1, r0, len, 28, 1, true);
    geo.rotateZ(-Math.PI / 2);
    geo.translate((c.x0 + c.x1) / 2, PH_C, 0);
    const mesh = new THREE.Mesh(geo, mats.interior);
    root.add(mesh);

    const floor = new THREE.Mesh(new THREE.BoxGeometry(len - 0.08, 0.08, 3.3), mats.deck);
    floor.position.set((c.x0 + c.x1) / 2, D - 0.02, 0);
    root.add(floor);
  }

  COMPARTMENTS.slice(0, -1).forEach((c, i) => addBulkhead(root, c.x1, i + 1));
  addEndCap(root, 12.0, shellR(12), true);
  addEndCap(root, 82.2, shellR(82.2), false);

  dress(root, lights);
  bowRoom();
  officers();
  control();
  crew();
  stern();
  figures(root);
  fitOut();
  flush(root, { shadow: false });
  flushKit(root);

  const markers = new THREE.Group();
  markers.name = 'markers';
  const mat = markerMaterial();
  for (const h of HOTSPOTS) {
    const s = new THREE.Sprite(mat);
    s.position.set(h.x, D + h.y + 0.35, h.z);
    s.scale.set(0.22, 0.22, 0.22);
    s.userData.hotspot = h.id;
    markers.add(s);
  }
  root.add(markers);

  const daylight = new THREE.MeshBasicMaterial({ color: 0xd5e4ee });
  const inDoor = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.15), daylight);
  inDoor.position.set(15.8, D + 1.05, 1.55);
  inDoor.rotation.y = Math.PI;
  const outDoor = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.15), daylight);
  outDoor.position.set(80.2, D + 1.05, 1.45);
  outDoor.rotation.y = Math.PI;
  root.add(inDoor, outDoor);

  const fill = new THREE.HemisphereLight(0xfff6ea, 0x8d8374, 0.72);
  root.add(fill);
  lights.push(fill);

  root.userData.lights = lights;
  return root;
}

function addBulkhead(root, x, n) {
  const r = shellR(x) + 0.02;
  const shape = new THREE.Shape();
  shape.absarc(0, PH_C, r, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, D + 1.08, 0.56, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ShapeGeometry(shape, 28);
  geo.rotateY(Math.PI / 2);
  geo.translate(x, 0, 0);
  const wall = new THREE.Mesh(geo, mats.cream);
  root.add(wall);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.035, 8, 20), mats.creamDark);
  rim.rotation.y = Math.PI / 2;
  rim.position.set(x, D + 1.08, 0);
  root.add(rim);

  const door = new THREE.Mesh(new THREE.CircleGeometry(0.54, 20), hatchMat(n));
  door.position.set(x + 0.06, D + 1.08, 0.78);
  door.rotation.y = -1.15;
  root.add(door);

  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.7), mats.creamDark);
  sill.position.set(x, D + 0.06, 0);
  root.add(sill);
}

function addEndCap(root, x, r, bow) {
  const shape = new THREE.Shape();
  shape.absarc(0, PH_C, r, 0, Math.PI * 2, false);
  const geo = new THREE.ShapeGeometry(shape, 24);
  geo.rotateY(Math.PI / 2);
  geo.translate(x, 0, 0);
  root.add(new THREE.Mesh(geo, mats.cream));
  if (!bow) return;
}

function hatchMat(n) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#d9d2c3';
  g.beginPath();
  g.arc(64, 64, 62, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#8d877c';
  g.lineWidth = 6;
  g.stroke();
  g.fillStyle = '#b42318';
  g.font = '700 42px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(String(n), 64, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 });
}

function dress(root, lights) {
  tube(mats.creamDark, 0.055, 64, 48, PH_C + 1.35, -0.28, 'x');
  tube(mats.creamDark, 0.04, 64, 48, PH_C + 1.15, 0.32, 'x');
  tube(mats.red, 0.028, 60, 46, D + 1.72, -0.62, 'x');
  tube(mats.dark, 0.045, 58, 47, D + 1.9, 0.62, 'x');

  for (const c of COMPARTMENTS) {
    const x = (c.x0 + c.x1) / 2;
    const y = D + 1.85;
    sphere(mats.lamp, 0.07, x, y, 0, 8);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshStandardMaterial({
      color: 0xf4f7fb,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
    }));
    bulb.position.set(x, y, 0);
    root.add(bulb);
    const L = new THREE.PointLight(0xfff3dd, 2.8, 16, 1.15);
    L.position.set(x, y - 0.2, 0);
    root.add(L);
    lights.push(L);
  }
}

function bowRoom() {
  const ys = [0.48, 1.15, 1.82];
  const zs = [-0.42, 0.42];
  for (const y of ys) {
    for (const z of zs) {
      cyl(mats.cream, 0.3, 0.3, 2.4, 13.3, D + y, z, 0, 0, Math.PI / 2, 16);
      cyl(mats.brass, 0.32, 0.32, 0.08, 14.45, D + y, z, 0, 0, Math.PI / 2, 16);
      cyl(mats.red, 0.08, 0.08, 0.06, 14.52, D + y, z, 0, 0, Math.PI / 2, 10);
    }
  }
  const racks = [
    [18.6, 0.42, -1.05],
    [18.6, 1.05, -1.05],
    [18.6, 0.42, 1.05],
    [18.6, 1.05, 1.05],
  ];
  for (const [x, y, z] of racks) {
    cyl(mats.torpedo, 0.24, 0.24, 6.4, x, D + y, z, 0, 0, Math.PI / 2, 12);
    cyl(mats.brass, 0.25, 0.25, 0.08, x + 1.2, D + y, z, 0, 0, Math.PI / 2, 12);
    cyl(mats.brass, 0.25, 0.25, 0.08, x - 1.4, D + y, z, 0, 0, Math.PI / 2, 12);
  }
  box(mats.creamDark, 0.5, 0.7, 1.4, 22.4, D + 0.7, 0);
  for (let i = 0; i < 4; i++) {
    cyl(mats.red, 0.1, 0.1, 0.04, 22.2, D + 1.15, -0.45 + i * 0.3, Math.PI / 2, 0, 0, 10);
  }
}

function officers() {
  box(mats.white, 0.04, 1.7, 1.5, 25.2, D + 0.9, -0.85);
  box(mats.cream, 1.7, 0.08, 0.62, 26.6, D + 0.55, -1.05);
  box(mats.creamDark, 0.7, 0.7, 0.45, 27.4, D + 0.85, -1.15);
  box(mats.blanket, 1.7, 0.1, 0.55, 26.5, D + 0.62, -1.05);
  box(mats.pillow, 0.28, 0.08, 0.4, 25.7, D + 0.7, -1.05);

  box(mats.blueCloth, 1.5, 0.06, 0.85, 30.4, D + 0.78, 0.85);
  box(mats.cream, 1.5, 0.72, 0.85, 30.4, D + 0.38, 0.85);
  sphere(mats.orange, 0.1, 30.9, D + 0.9, 0.7, 8);
  sphere(mats.red, 0.08, 30.75, D + 0.88, 0.85, 8);
  sphere(mats.foliageSafe(), 0.07, 30.95, D + 0.86, 0.95, 6);

  box(mats.cream, 0.55, 1.3, 0.4, 29.2, D + 0.7, -1.25);
  box(mats.dark, 0.4, 0.28, 0.08, 29.2, D + 0.85, -1.02);
  box(mats.white, 0.5, 0.7, 0.35, 32.2, D + 1.0, -1.2);
  box(mats.red, 0.12, 0.12, 0.02, 32.2, D + 1.25, -1.01);

  box(mats.rubber, 1.6, 0.55, 1.1, 27.8, D - 0.35, 0.15);
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      box(mats.dark, 0.22, 0.32, 0.28, 27.2 + i * 0.28, D - 0.32, -0.25 + j * 0.32);
    }
  }
  box(mats.steel, 1.7, 0.04, 1.15, 27.8, D + 0.02, 0.15);

  box(mats.cream, 0.4, 0.5, 0.35, 24.6, D + 0.85, 1.15);
}

function control() {
  cyl(mats.cream, 0.11, 0.14, 2.3, 36.1, D + 1.15, 0.05, 0, 0, 0, 12);
  cyl(mats.cream, 0.08, 0.1, 2.15, 37.2, D + 1.1, -0.12, 0, 0, 0, 12);
  cyl(mats.brass, 0.16, 0.16, 0.12, 36.1, D + 0.85, 0.05, 0, 0, 0, 12);
  cyl(mats.brass, 0.13, 0.13, 0.1, 37.2, D + 0.8, -0.12, 0, 0, 0, 12);

  box(mats.cream, 0.55, 1.05, 1.1, 39.7, D + 0.7, -1.05);
  cyl(mats.dark, 0.22, 0.22, 0.06, 39.7, D + 1.05, -0.48, Math.PI / 2, 0, 0, 16);
  cyl(mats.brass, 0.05, 0.05, 0.2, 39.7, D + 1.05, -0.38, Math.PI / 2, 0, 0, 8);

  box(mats.creamDark, 2.4, 1.15, 0.28, 36.8, D + 1.05, -1.35);
  for (let i = 0; i < 4; i++) {
    cyl(mats.gauge, 0.16, 0.16, 0.05, 35.9 + i * 0.55, D + 1.2, -1.18, Math.PI / 2, 0, 0, 12);
  }

  box(mats.cream, 0.9, 0.75, 0.6, 40.6, D + 0.75, 0.95);
  box(mats.chart, 0.7, 0.02, 0.45, 40.6, D + 1.14, 0.95);

  for (let i = 0; i < 5; i++) {
    cyl(mats.red, 0.09, 0.09, 0.04, 34.6, D + 0.7 + (i % 3) * 0.28, 0.9, Math.PI / 2, 0, 0, 8);
  }
  box(mats.cream, 0.35, 0.9, 0.5, 38.4, D + 0.7, 1.05);
  cyl(mats.dark, 0.03, 0.03, 0.45, 38.15, D + 0.95, 1.05, 0.4, 0, 0, 6);
  cyl(mats.dark, 0.03, 0.03, 0.45, 38.65, D + 0.95, 1.05, -0.3, 0, 0, 6);

  box(mats.dark, 0.45, 0.7, 0.35, 41.3, D + 0.85, -1.15);
}

function crew() {
  box(mats.cream, 1.15, 0.9, 0.7, 44.8, D + 0.55, -1.15);
  box(mats.dark, 0.5, 0.12, 0.4, 44.8, D + 1.05, -1.15);
  cyl(mats.steel, 0.1, 0.12, 0.16, 44.5, D + 1.15, -1.2, 0, 0, 0, 8);
  cyl(mats.steel, 0.09, 0.1, 0.14, 45.1, D + 1.12, -1.05, 0, 0, 0, 8);
  box(mats.floral, 0.05, 1.3, 1.6, 43.6, D + 1.0, -1.2);

  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const y = 0.38 + k * 0.48;
      box(mats.creamDark, 1.75, 0.06, 0.58, 49.0, D + y, 1.12);
      box(mats.blanket, 1.55, 0.06, 0.48, 49.1, D + y + 0.06, 1.12);
      box(mats.pillow, 0.22, 0.06, 0.32, 48.3, D + y + 0.1, 1.12);
    }
  }
  box(mats.floral, 0.05, 1.5, 2.2, 50.6, D + 1.05, 1.15);

  box(mats.cream, 0.8, 0.85, 0.55, 51.3, D + 0.6, -1.15);
  cyl(mats.steel, 0.08, 0.08, 0.7, 51.0, D + 1.15, -1.2, 0, 0, Math.PI / 2, 8);
  box(mats.dark, 0.35, 0.4, 0.3, 51.6, D + 0.7, -0.85);

  box(mats.cream, 1.1, 0.72, 0.7, 46.8, D + 0.4, 0.15);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      box(mats.dark, 0.18, 0.28, 0.22, 46.4 + i * 0.24, D - 0.22, -0.05 + j * 0.28);
    }
  }

  const shelf = [0.55, 1.15];
  for (const y of shelf) {
    box(mats.creamDark, 0.25, 0.04, 1.4, 47.6, D + y, -1.2);
    for (let i = 0; i < 5; i++) {
      box(mats.brass, 0.04, 0.16, 0.14, 47.55, D + y + 0.1, -1.7 + i * 0.26);
    }
  }
}

function stern() {
  const ys = [0.7, 1.45];
  const zs = [-0.48, 0.48];
  for (const y of ys) {
    for (const z of zs) {
      cyl(mats.cream, 0.28, 0.28, 1.8, 81.1, D + y, z, 0, 0, Math.PI / 2, 14);
      cyl(mats.brass, 0.3, 0.3, 0.07, 80.25, D + y, z, 0, 0, Math.PI / 2, 14);
    }
  }
  cyl(mats.torpedo, 0.22, 0.22, 5.2, 76.8, D + 0.45, -1.05, 0, 0, Math.PI / 2, 10);
  cyl(mats.torpedo, 0.22, 0.22, 5.2, 76.8, D + 0.45, 1.05, 0, 0, Math.PI / 2, 10);

  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const y = 0.4 + k * 0.46;
      box(mats.creamDark, 1.6, 0.05, 0.52, 75.6, D + y, -1.1);
      box(mats.blanket, 1.4, 0.05, 0.42, 75.7, D + y + 0.05, -1.1);
      box(mats.pillow, 0.2, 0.05, 0.28, 74.95, D + y + 0.08, -1.1);
    }
  }

  box(mats.cream, 0.7, 1.5, 0.55, 76.2, D + 0.85, 1.15);
  box(mats.orange, 0.28, 1.05, 0.28, 76.2, D + 0.85, 1.15);
  sphere(mats.orange, 0.16, 76.2, D + 1.5, 1.15, 8);
  box(mats.dark, 0.5, 0.35, 0.04, 76.2, D + 1.15, 0.86);

  box(mats.white, 0.55, 1.2, 0.08, 74.2, D + 0.9, 1.2);
}

function figures(root) {
  stand(root, 39.2, -0.85, 0.2, mats.blue);
  stand(root, 26.9, -1.05, 1.4, mats.white);
  sit(root, 30.0, 0.85, -1.2);
  stand(root, 57.4, 0.72, -0.4, mats.blue);
}

function stand(root, x, z, yaw, shirt) {
  const g = new THREE.Group();
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.75, 6), mats.dark);
  leg.position.y = 0.38;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.55, 8), shirt);
  torso.position.y = 0.98;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mats.skin);
  head.position.y = 1.4;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.06, 8), mats.white);
  cap.position.y = 1.5;
  g.add(leg, torso, head, cap);
  g.position.set(x, D, z);
  g.rotation.y = yaw;
  root.add(g);
}

function sit(root, x, z, yaw) {
  const g = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.5, 8), mats.blue);
  torso.position.y = 1.05;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mats.skin);
  head.position.y = 1.42;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.05, 8), mats.white);
  cap.position.y = 1.52;
  g.add(torso, head, cap);
  g.position.set(x, D, z);
  g.rotation.y = yaw;
  root.add(g);
}

// Small helper so a fruit reads green without a new exported material.
mats.foliageSafe = () => mats.foliage;
