import * as THREE from 'three';
import { LENGTH, Y0, DECK_Y } from './specs.js';
import { mats } from './materials.js';
import { createHullMesh, deckHeightAt, hullPoint } from './hull.js';

const HALF = LENGTH / 2;

export function createExterior() {
  const root = new THREE.Group();
  root.name = 'exterior';

  const world = new THREE.Group();
  root.add(world);
  buildGround(world);
  buildSky(world);

  const sub = new THREE.Group();
  sub.position.x = -HALF;
  root.add(sub);

  sub.add(createHullMesh());
  buildSail(sub);
  buildBow(sub);
  buildStern(sub);
  buildDetails(sub);
  buildStairs(sub);
  buildSupports(sub);

  const hemi = new THREE.HemisphereLight(0xc9ddf2, 0x8d7352, 0.62);
  world.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d4, 2.55);
  sun.position.set(-30, 54, -36);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 8;
  sun.shadow.camera.far = 180;
  sun.shadow.camera.left = -70;
  sun.shadow.camera.right = 70;
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  sun.shadow.bias = -0.00035;
  sun.target.position.set(0, 4, 0);
  world.add(sun, sun.target);

  return { root, sub, sun };
}

function buildSky(world) {
  const geo = new THREE.SphereGeometry(420, 28, 18);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      sun: { value: new THREE.Vector3(-0.45, 0.62, -0.64).normalize() },
    },
    vertexShader: `
      varying vec3 vW;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      varying vec3 vW;
      uniform vec3 sun;
      void main() {
        vec3 d = normalize(vW);
        float h = clamp(d.y * 0.55 + 0.45, 0.0, 1.0);
        vec3 zen = vec3(0.27, 0.50, 0.78);
        vec3 hor = vec3(0.90, 0.78, 0.64);
        vec3 col = mix(hor, zen, pow(clamp(d.y, 0.0, 1.0), 0.65));
        float s = pow(max(dot(d, sun), 0.0), 420.0);
        col += vec3(1.0, 0.86, 0.62) * s;
        float haze = pow(1.0 - max(d.y, 0.0), 5.0);
        col = mix(col, vec3(0.78, 0.72, 0.62), haze * 0.35);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(geo, mat);
  sky.frustumCulled = false;
  world.add(sky);

  const seaGeo = new THREE.PlaneGeometry(520, 280, 70, 36);
  const seaMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      uniform float uTime;
      varying float vH;
      varying vec2 vPos;
      void main() {
        vec3 p = position;
        float w = sin(p.x * 0.045 + uTime * 0.7) * 0.18
                + sin(p.y * 0.06 + uTime * 0.55) * 0.12
                + sin((p.x + p.y) * 0.02 + uTime * 0.3) * 0.2;
        p.z += w;
        vH = w;
        vPos = p.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying float vH;
      varying vec2 vPos;
      void main() {
        float depth = smoothstep(-132.0, -108.0, vPos.y);
        vec3 shallow = vec3(0.22, 0.55, 0.66);
        vec3 deep = vec3(0.04, 0.24, 0.40);
        vec3 col = mix(shallow, deep, depth);
        col += vec3(0.55, 0.72, 0.78) * smoothstep(0.12, 0.28, vH);
        float foam = smoothstep(-128.0, -118.0, vPos.y) * smoothstep(-104.0, -116.0, vPos.y);
        col = mix(col, vec3(0.92, 0.95, 0.96), foam * 0.7);
        float alpha = smoothstep(-136.0, -120.0, vPos.y);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
  const sea = new THREE.Mesh(seaGeo, seaMat);
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, 0.02, -150);
  sea.name = 'sea';
  world.add(sea);
  world.userData.seaMat = seaMat;
}

function buildGround(world) {
  const sand = new THREE.Mesh(new THREE.CircleGeometry(80, 40), mats.sand);
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(0, -0.02, -16);
  sand.scale.set(1.4, 1, 0.7);
  sand.receiveShadow = true;
  world.add(sand);

  const beach = new THREE.Mesh(new THREE.PlaneGeometry(140, 36), mats.sand);
  beach.rotation.x = -Math.PI / 2;
  beach.position.set(0, 0.0, -20);
  beach.receiveShadow = true;
  world.add(beach);

  const plaza = new THREE.Mesh(new THREE.BoxGeometry(108, 0.16, 26), mats.tile);
  plaza.position.set(0, 0.08, 2);
  plaza.receiveShadow = true;
  world.add(plaza);

  const road = new THREE.Mesh(new THREE.BoxGeometry(130, 0.08, 10), mats.road);
  road.position.set(0, 0.1, 20);
  road.receiveShadow = true;
  world.add(road);

  const wall = new THREE.Mesh(new THREE.BoxGeometry(96, 1.35, 0.35), mats.waterWall);
  wall.position.set(0, 0.85, 14.2);
  wall.castShadow = true;
  wall.receiveShadow = true;
  world.add(wall);

  const sign = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.1, 0.18), mats.sign);
  sign.position.set(-28, 1.7, 13.6);
  sign.castShadow = true;
  world.add(sign);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.45, 0.12), mats.concrete);
  frame.position.set(-28, 1.65, 13.45);
  world.add(frame);

  const hill = new THREE.Mesh(new THREE.ConeGeometry(18, 7.5, 5), new THREE.MeshStandardMaterial({ color: 0x6d7c72, roughness: 1 }));
  hill.position.set(-90, 2.2, -70);
  hill.rotation.y = 0.4;
  world.add(hill);
  const hill2 = new THREE.Mesh(new THREE.SphereGeometry(10, 12, 8), new THREE.MeshStandardMaterial({ color: 0x7d8b80, roughness: 1 }));
  hill2.scale.set(1.8, 0.35, 1);
  hill2.position.set(-70, 1.4, -78);
  world.add(hill2);

  for (let i = -2; i <= 3; i++) {
    palm(world, -40 + i * 16, 0.16, 16.8, i);
    lampPost(world, -46 + i * 18, 0.16, 11.5);
  }
  person(world, -38, 0.16, 6.2, 0.6, 0xc4553a, 1);
  person(world, -36.2, 0.16, 6.5, 0.4, 0x245c8a, 0.92);
  person(world, 22, 0.16, 7.4, -0.8, 0xf2f2f2, 1);
  person(world, 23.3, 0.16, 7.1, -1.1, 0x2c2c2c, 0.95);
  person(world, -8, 0.16, -6.5, 1.2, 0xd7a15a, 1.02);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.9, 6), mats.dark);
  pole.position.set(-6.4, 1.1, 6.8);
  world.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.55), mats.flag);
  flag.position.set(-5.95, 1.85, 6.8);
  world.add(flag);
}

function palm(parent, x, y, z, seed) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 3.4, 6), mats.trunk);
  trunk.position.y = 1.7;
  trunk.rotation.z = 0.08 * (seed % 2 ? 1 : -1);
  g.add(trunk);
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.8, 4), mats.foliage);
    leaf.position.y = 3.5;
    leaf.rotation.z = 1.1;
    leaf.rotation.y = (i / 6) * Math.PI * 2;
    leaf.translateY(0.15);
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / 6) * Math.PI * 2;
    const frond = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 1.5), mats.foliage);
    frond.position.set(0, 3.45, 0.7);
    frond.rotation.x = 0.5;
    pivot.add(frond);
    g.add(pivot);
  }
  g.position.set(x, y, z);
  parent.add(g);
}

function lampPost(parent, x, y, z) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.2, 6), mats.dark);
  pole.position.set(x, y + 2.1, z);
  parent.add(pole);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), mats.lamp);
  head.position.set(x, y + 4.25, z);
  parent.add(head);
}

function person(parent, x, y, z, rot, shirt, s = 1) {
  const g = new THREE.Group();
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * s, 0.08 * s, 0.78 * s, 6), mats.dark);
  leg.position.y = 0.39 * s;
  g.add(leg);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * s, 0.15 * s, 0.62 * s, 8), new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.7 }));
  torso.position.y = 1.05 * s;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13 * s, 10, 8), mats.skin);
  head.position.y = 1.52 * s;
  g.add(head);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * s, 0.045 * s, 0.48 * s, 5), mats.skin);
  arm.position.set(0.18 * s, 1.05 * s, 0);
  arm.rotation.z = 0.25;
  g.add(arm);
  g.position.set(x, y, z);
  g.rotation.y = rot;
  g.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  parent.add(g);
}

function buildSail(sub) {
  const deck = hullPoint(36.6, Math.PI / 2).y;
  const L = 10.4;
  const W = 2.2;
  const H = 4.7;
  const cx = 36.4;

  const casing = new THREE.Mesh(new THREE.BoxGeometry(56, 0.2, 3.3), mats.hullDark);
  casing.position.set(46, hullPoint(46, Math.PI / 2).y + 0.06, 0);
  casing.castShadow = true;
  casing.receiveShadow = true;
  sub.add(casing);

  const body = new THREE.Mesh(new THREE.BoxGeometry(L - 1.6, H, W), mats.hullDark);
  body.position.set(cx + 0.5, deck + H / 2, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  sub.add(body);
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(W / 2, W / 2, H, 18), mats.hullDark);
  nose.position.set(cx - L / 2 + 0.95, deck + H / 2, 0);
  nose.castShadow = true;
  sub.add(nose);

  const textMat = new THREE.MeshStandardMaterial({
    map: makeS20(),
    transparent: true,
    roughness: 0.5,
    metalness: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const decal = new THREE.PlaneGeometry(1.7, 0.48);
  const d1 = new THREE.Mesh(decal, textMat);
  d1.position.set(cx + 0.4, deck + 2.35, W / 2 + 0.03);
  const d2 = new THREE.Mesh(decal, textMat);
  d2.position.set(cx + 0.4, deck + 2.35, -W / 2 - 0.03);
  d2.rotation.y = Math.PI;
  sub.add(d1, d2);

  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.08), mats.glass);
      win.position.set(cx - 1.2 + i * 0.6, deck + 3.25, side * (W / 2 + 0.02));
      sub.add(win);
    }
  }

  mast(sub, 34.6, deck + H, 0.055, 1.15);
  mast(sub, 35.7, deck + H, 0.07, 0.95);
  const radar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.55), mats.dark);
  radar.position.set(37.3, deck + H + 1.35, 0);
  sub.add(radar);
  mast(sub, 37.3, deck + H, 0.06, 1.35);
  const esm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.42, 10), mats.dark);
  esm.position.set(38.6, deck + H + 0.3, 0);
  sub.add(esm);
  mast(sub, 40.2, deck + H, 0.025, 2.05);

  const snorkel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.5, 10), mats.hullDark);
  snorkel.position.set(43.4, deck + 0.9, 0.15);
  sub.add(snorkel);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mats.hullDark);
  head.scale.set(1, 0.7, 1.2);
  head.position.set(43.4, deck + 1.7, 0.15);
  sub.add(head);
}

function mast(sub, x, y, r, h) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.15, h, 8), mats.dark);
  m.position.set(x, y + h / 2, 0);
  sub.add(m);
}

function makeS20() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 80;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 256, 80);
  g.fillStyle = '#f2f5f7';
  g.font = '700 54px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('S 20', 128, 42);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function carveBow(mesh) {
  const pos = mesh.geometry.attributes.position;
  const cutX = 5.7;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x < cutX && y > Y0 + 1.85 && y < Y0 + 5.35 && Math.abs(z) < 1.55) {
      pos.setX(i, cutX);
    }
  }
  pos.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}

function buildBow(sub) {
  const hull = sub.getObjectByName('hull');
  if (hull) carveBow(hull);
  const cutX = 5.7;
  const ys = [2.45, 3.4, 4.35];
  const zs = [-0.52, 0.52];
  ys.forEach((y, yi) => {
    zs.forEach((z) => {
      const red = yi < 2;
      const bore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.26, 1.15, 18),
        red ? mats.red : mats.rubber,
      );
      bore.rotation.z = Math.PI / 2;
      bore.position.set(cutX - 0.35, Y0 + y, z);
      sub.add(bore);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.045, 8, 18), mats.steel);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(cutX - 0.88, Y0 + y, z);
      sub.add(ring);
    });
  });
  const recess = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.7, 1.85), mats.rubber);
  recess.position.set(cutX + 0.05, Y0 + 3.4, 0);
  sub.add(recess);

  for (const side of [-1, 1]) {
    const anchorA = side > 0 ? 0.2 : Math.PI - 0.2;
    const p = hullPoint(9.2, anchorA);
    const plane = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.14, 2.6), mats.hullDark);
    plane.position.set(9.2, p.y, p.z + side * 1.15);
    plane.castShadow = true;
    sub.add(plane);
  }

  const anchor = new THREE.Group();
  const shank = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 0.1), mats.rubber);
  shank.position.y = 0.9;
  anchor.add(shank);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.15), mats.rubber);
  stock.position.y = 1.55;
  anchor.add(stock);
  const crown = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.16), mats.rubber);
  crown.position.y = 0.12;
  anchor.add(crown);
  for (const s of [-1, 1]) {
    const fluke = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 0.06), mats.rubber);
    fluke.position.set(s * 0.28, 0.28, 0);
    fluke.rotation.z = s * 0.6;
    anchor.add(fluke);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 6, 12), mats.steel);
  ring.position.y = 1.78;
  anchor.add(ring);
  anchor.position.set(-2.2, 0.16, 2.4);
  anchor.rotation.y = 0.4;
  sub.add(anchor);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.9, 0.3, 2.2),
    new THREE.Vector3(-0.4, 0.25, 1.4),
    new THREE.Vector3(1.2, 0.7, 0.7),
    new THREE.Vector3(2.4, Y0 + 2.3, 0.35),
  ]);
  const chain = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.035, 5, false), mats.steel);
  sub.add(chain);
}

function buildStern(sub) {
  const rudder = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.5, 0.16), mats.hullDark);
  rudder.position.set(89.2, Y0 + 3.15, 0);
  rudder.castShadow = true;
  sub.add(rudder);
  const lower = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.15, 0.14), mats.hullDark);
  lower.position.set(88.6, Y0 + 0.85, 0);
  sub.add(lower);

  for (const side of [-1, 1]) {
    const plane = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.1, 2.5), mats.hullDark);
    plane.position.set(82.5, Y0 + 2.15, side * 2.35);
    plane.castShadow = true;
    sub.add(plane);
  }

  const positions = [
    [84.2, Y0 + 1.55, -2.15],
    [84.2, Y0 + 1.55, 2.15],
    [86.3, Y0 + 1.45, 0],
  ];
  positions.forEach(([x, y, z], i) => {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, i === 2 ? 3.2 : 2.4, 8), mats.steel);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(x - (i === 2 ? 1.5 : 1.1), y, z);
    sub.add(shaft);
    sub.add(makeProp(1.15, x, y, z));
  });

  for (let i = 0; i < 8; i++) {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.2), mats.rubber);
    const x = 74 + i * 1.15;
    const p = hullPoint(x, 0.35);
    slot.position.set(x, p.y, Math.sign(p.z) * (Math.abs(p.z) + 0.02));
    sub.add(slot);
    const slot2 = slot.clone();
    const p2 = hullPoint(x, Math.PI - 0.35);
    slot2.position.set(x, p2.y, Math.sign(p2.z || -1) * (Math.abs(p2.z) + 0.02));
    sub.add(slot2);
  }
}

function makeProp(radius, x, y, z) {
  const g = new THREE.Group();
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.16, radius * 0.16, radius * 0.22, 10),
    mats.steel,
  );
  hub.rotation.z = Math.PI / 2;
  g.add(hub);
  const shape = new THREE.Shape();
  shape.moveTo(0.02, radius * 0.18);
  shape.quadraticCurveTo(radius * 0.22, radius * 0.55, 0.01, radius * 0.98);
  shape.quadraticCurveTo(-radius * 0.28, radius * 0.55, -0.02, radius * 0.18);
  const bladeGeo = new THREE.ExtrudeGeometry(shape, { depth: radius * 0.055, bevelEnabled: false });
  bladeGeo.translate(0, 0, -radius * 0.028);
  for (let i = 0; i < 6; i++) {
    const blade = new THREE.Mesh(bladeGeo, mats.steel);
    blade.rotation.order = 'YXZ';
    blade.rotation.y = 0.5;
    blade.rotation.x = (i / 6) * Math.PI * 2;
    blade.castShadow = true;
    g.add(blade);
  }
  g.position.set(x, y, z);
  return g;
}

function buildDetails(sub) {
  for (let i = 0; i < 28; i++) {
    const x = 14 + i * 2.15;
    if (x > 30 && x < 43) continue;
    for (const side of [-1, 1]) {
      const a = side > 0 ? 0.55 : Math.PI - 0.55;
      const p = hullPoint(x, a);
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.18), mats.rubber);
      slot.position.set(x, p.y + 0.02, p.z + side * 0.05);
      sub.add(slot);
    }
  }
  const hatchGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 12);
  [18, 48, 70].forEach((x) => {
    const h = new THREE.Mesh(hatchGeo, mats.hullDark);
    h.position.set(x, deckHeightAt(x) + 0.08, 0);
    sub.add(h);
  });
}

function buildStairs(sub) {
  stairRun(sub, 18.5, 1);
  stairRun(sub, 78.5, 1);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.7, 0.12), mats.rubber);
  const p = hullPoint(16.2, 0.15);
  door.position.set(16.2, DECK_Y + 0.85, Math.max(2.6, p.z - 0.2));
  sub.add(door);
  const door2 = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.7, 0.12), mats.rubber);
  const p2 = hullPoint(80.2, 0.2);
  door2.position.set(80.2, DECK_Y + 0.85, Math.max(2.4, p2.z - 0.15));
  sub.add(door2);
}

function stairRun(sub, xDoor, dir) {
  const steps = 12;
  const z0 = 8.2;
  const z1 = 3.5;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const z = z0 + (z1 - z0) * t;
    const y = 0.2 + t * (DECK_Y + 0.15);
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.42), mats.dark);
    step.position.set(xDoor + 1.1, y, z);
    step.castShadow = true;
    sub.add(step);
  }
  for (const dz of [-0.42, 0.42]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, z0 - z1), mats.steel);
    rail.position.set(xDoor + 1.1 + dz, DECK_Y * 0.55 + 0.9, (z0 + z1) / 2);
    rail.rotation.x = -0.42 * dir;
    sub.add(rail);
  }
  const plat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.3), mats.dark);
  plat.position.set(xDoor, DECK_Y + 0.12, 3.15);
  sub.add(plat);
}

function buildSupports(sub) {
  const xs = [22, 34, 48, 60, 72];
  xs.forEach((x) => {
    for (const z of [-1.5, 1.5]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.15, 0.7), mats.concrete);
      pier.position.set(x, 0.7, z);
      pier.castShadow = true;
      pier.receiveShadow = true;
      sub.add(pier);
    }
    const keel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.45), mats.concrete);
    keel.position.set(x, 0.38, 0);
    sub.add(keel);
  });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(62, 0.22, 5.2), mats.concrete);
  slab.position.set(46, 0.22, 0);
  slab.receiveShadow = true;
  sub.add(slab);
}

export function updateSea(root, time) {
  const sea = root.getObjectByName('sea');
  if (sea) sea.material.uniforms.uTime.value = time;
}
