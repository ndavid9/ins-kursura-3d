import { DECK_Y as D } from './specs.js';
import { mats } from './materials.js';
import { pipe, boxI, handwheel, dial, plate, DENSITY } from './kit.js';

const step = (n) => n / DENSITY;

/** Colour-coded runs, frames, cables, then the machinery that has to read up close. */
export function fitOut() {
  frames(13.2, 81.2);
  trunks();
  cables(13.4, 81);
  boxesAndLamps();
  torpedoDetail(true);
  livingDetail();
  controlDetail();
  dieselBank();
  motorBank();
  torpedoDetail(false);
}

function frames(x0, x1) {
  for (let x = x0; x < x1; x += step(0.58)) {
    for (const z of [-1.48, 1.48]) {
      boxI(mats.creamDark, 0.04, 1.45, 0.045, x, D + 0.78, z);
    }
    boxI(mats.creamDark, 0.04, 0.04, 2.55, x, D + 1.98, 0);
  }
}

function trunks() {
  run(mats.pipeCream, 0.05, 13.2, 81, D + 1.9, -0.48, mats.red, 1.35);
  run(mats.pipeCream, 0.034, 13.2, 81, D + 1.74, 0.42, mats.red, 1.5);
  run(mats.red, 0.02, 13.5, 80.5, D + 1.48, -1.05, mats.red, 1.15);
  run(mats.pipeGreen, 0.042, 14, 80, D + 1.05, -1.28, mats.pipeGreen, 1.4);
  run(mats.pipeGreen, 0.028, 14, 80, D + 0.48, 1.32, mats.pipeGreen, 1.6);
  run(mats.pipeBlue, 0.018, 14, 72, D + 0.78, -1.22, mats.brass, 1.8);
  run(mats.pipeYellow, 0.016, 50, 66.5, D + 0.38, 1.18, mats.red, 0.9);
  // vertical drops at each compartment bulkhead
  for (const x of [23.4, 33.6, 42.4, 52.8, 65, 73]) {
    pipe(mats.pipeGreen, 0.03, 1.15, x, D + 1.15, -1.28, 'y');
    pipe(mats.red, 0.016, 0.7, x + 0.15, D + 1.35, -1.05, 'y');
    handwheel(mats.red, x, D + 1.15, -1.12, '+z', 0.85);
  }
}

function run(mat, r, x0, x1, y, z, valveMat, every) {
  pipe(mat, r, x1 - x0, (x0 + x1) / 2, y, z, 'x');
  const face = z > 0 ? '-z' : '+z';
  const nudge = z > 0 ? -(r + 0.07) : r + 0.07;
  for (let x = x0 + 0.35; x < x1 - 0.2; x += step(every)) {
    handwheel(valveMat, x, y, z + nudge, face, y > D + 1.6 ? 0.7 : 0.85);
    pipe(mat, r * 0.65, 0.1, x, y, z + nudge * 0.45, 'z');
  }
}

function cables(x0, x1) {
  const lanes = [
    [D + 1.62, -0.78],
    [D + 1.58, -0.7],
    [D + 1.66, 0.74],
    [D + 1.55, 0.66],
    [D + 2.02, 0.12],
    [D + 2.0, -0.08],
  ];
  for (const [y, z] of lanes) {
    const seg = step(0.42);
    for (let x = x0; x < x1; x += seg) {
      const sag = Math.sin(x * 2.4 + z * 8) * 0.025;
      pipe(mats.rubber, 0.011, seg * 1.08, x + seg / 2, y + sag, z, 'x');
    }
  }
}

function boxesAndLamps() {
  for (let x = 15; x < 80; x += step(2.1)) {
    const port = Math.round(x) % 2 === 0;
    const z = port ? -1.38 : 1.38;
    boxI(mats.cream, 0.22, 0.16, 0.1, x, D + 1.35, z);
    boxI(mats.dark, 0.08, 0.05, 0.02, x, D + 1.35, z + (port ? 0.06 : -0.06));
    if (x % 4 < 2.2) {
      plate(port ? mats.plateAir : mats.plateSea, x, D + 1.15, z + (port ? 0.02 : -0.02), port ? '+z' : '-z', 0.26, 0.12);
    }
  }
  plate(mats.plateWarn, 34.2, D + 1.55, -1.32, '+z', 0.32, 0.14);
  plate(mats.plateBallast, 35.6, D + 0.55, 1.25, '-z', 0.3, 0.13);
  plate(mats.plateFuel, 56.2, D + 1.45, 1.32, '-z', 0.3, 0.13);
  plate(mats.plateDiesel, 57.4, D + 1.15, -1.42, '+z', 0.34, 0.14);
}

function torpedoDetail(bow) {
  if (bow) {
    const ys = [0.48, 1.15, 1.82];
    const zs = [-0.42, 0.42];
    for (const y of ys) {
      for (const z of zs) {
        // dogs around the breech
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          boxI(mats.steel, 0.04, 0.07, 0.03, 14.55, D + y + Math.sin(a) * 0.34, z + Math.cos(a) * 0.34);
        }
        handwheel(mats.brass, 14.62, D + y, z, '+x', 0.7);
        pipe(mats.red, 0.012, 0.55, 14.9, D + y + 0.28, z, 'x');
      }
    }
    // loading rail and hoist
    boxI(mats.dark, 7.2, 0.05, 0.08, 18.4, D + 2.02, 0);
    boxI(mats.dark, 0.5, 0.08, 0.22, 17.2, D + 1.96, 0);
    pipe(mats.steel, 0.012, 0.7, 17.2, D + 1.55, 0, 'y');
    boxI(mats.steel, 0.16, 0.1, 0.12, 17.2, D + 1.15, 0);
    // impulse air manifold on the after bulkhead
    for (let i = 0; i < 6; i++) {
      handwheel(mats.red, 22.55, D + 0.55 + (i % 3) * 0.38, -0.55 + Math.floor(i / 3) * 1.1, '-x', 0.65);
    }
    plate(mats.plateAir, 22.5, D + 1.7, 0, '-x', 0.34, 0.14);
    return;
  }
  const ys = [0.7, 1.45];
  const zs = [-0.48, 0.48];
  for (const y of ys) {
    for (const z of zs) {
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        boxI(mats.steel, 0.035, 0.06, 0.03, 80.15, D + y + Math.sin(a) * 0.32, z + Math.cos(a) * 0.32);
      }
      handwheel(mats.brass, 80.05, D + y, z, '-x', 0.65);
      pipe(mats.red, 0.012, 0.4, 79.7, D + y + 0.22, z, 'x');
    }
  }
  boxI(mats.dark, 4.2, 0.045, 0.07, 77.2, D + 1.95, 0);
  pipe(mats.steel, 0.01, 0.55, 76.4, D + 1.6, -1.05, 'y');
}

function livingDetail() {
  // CO cabin: voice pipe, small gauge, lamp switch
  pipe(mats.brass, 0.02, 0.85, 26.2, D + 1.35, -1.15, 'y');
  dial(mats.gaugePress, 27.6, D + 1.25, -1.22, '+z', 0.8);
  handwheel(mats.brass, 25.4, D + 1.05, -1.2, '+z', 0.6);
  // wardroom receiver stack already a box; add a row of dials
  for (let i = 0; i < 3; i++) dial(mats.gaugeElec, 29.2, D + 0.95 + i * 0.16, -1.0, '+z', 0.55);
  // galley: stove burners, sink, rack, pots
  for (let i = 0; i < 2; i++) {
    pipe(mats.dark, 0.09, 0.04, 44.55 + i * 0.28, D + 1.08, -1.15, 'y');
  }
  boxI(mats.steel, 0.28, 0.08, 0.22, 45.15, D + 1.02, -1.05);
  pipe(mats.pipeBlue, 0.012, 0.35, 45.15, D + 1.2, -1.2, 'y');
  boxI(mats.cream, 0.08, 0.45, 0.5, 44.2, D + 1.15, -1.15);
  // bunk rails
  for (let i = 0; i < 3; i++) {
    boxI(mats.steel, 1.7, 0.02, 0.02, 49.0, D + 0.42 + i * 0.48, 0.82);
    boxI(mats.steel, 0.02, 1.35, 0.02, 48.15, D + 0.85, 1.38);
  }
  // AC compressor pipes
  pipe(mats.pipeBlue, 0.03, 0.8, 51.3, D + 1.25, -1.15, 'x');
  pipe(mats.red, 0.015, 0.5, 51.55, D + 0.9, -0.85, 'y');
  for (let i = 0; i < 3; i++) dial(mats.gaugePress, 51.15, D + 0.85 + i * 0.18, -0.7, '-z', 0.6);
  handwheel(mats.red, 50.9, D + 1.05, -1.05, '-z', 0.7);
}

function controlDetail() {
  // depth-gauge pair and a full valve manifold, starboard forward
  dial(mats.gaugeDepth, 35.15, D + 1.35, -1.18, '+z', 1.7);
  dial(mats.gaugeDepth, 35.55, D + 1.32, -1.18, '+z', 1.35);
  dial(mats.gaugePress, 36.0, D + 0.85, -1.18, '+z', 0.9);
  // manifold: 5 rows × 6 wheels
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      const red = (row + col) % 2 === 0;
      handwheel(red ? mats.red : mats.pipeGreen, 34.55 + col * 0.16, D + 0.48 + row * 0.2, 1.22, '-z', 0.55);
    }
  }
  boxI(mats.cream, 1.15, 1.15, 0.06, 34.95, D + 0.95, 1.28);
  // plane levers already exist; add a telegraph and a second small wheel
  boxI(mats.brass, 0.16, 0.22, 0.08, 39.55, D + 1.22, -0.55);
  dial(mats.gaugeElec, 39.85, D + 1.28, -0.55, '-z', 0.7);
  handwheel(mats.dark, 39.7, D + 1.05, -0.42, '-z', 1.85);
  // periscope training handles
  boxI(mats.dark, 0.28, 0.03, 0.04, 36.1, D + 1.05, 0.05);
  boxI(mats.dark, 0.22, 0.03, 0.04, 37.2, D + 0.98, -0.12);
  pipe(mats.brass, 0.015, 0.4, 36.1, D + 0.7, 0.2, 'y');
  // chart table lamps and a repeat dial
  dial(mats.gaugeDepth, 40.85, D + 1.28, 0.7, '-z', 0.75);
  plate(mats.plateBallast, 34.9, D + 1.62, 1.22, '-z', 0.32, 0.12);
}

function dieselBank() {
  const engines = [
    { x: 58.0, z: -1.32, side: 1 },
    { x: 59.15, z: -0.28, side: 1 },
    { x: 58.0, z: 1.18, side: -1 },
  ];
  for (const e of engines) engine(e.x, e.z, e.side);
  // catwalk grating between centre and starboard, clear of the collision lane centre
  for (let x = 56.2; x < 62.4; x += 0.28) {
    boxI(mats.dark, 0.06, 0.02, 0.55, x, D + 0.04, 0.48);
  }
  // deckhead manifold over the engines, lower than the boat-wide trunks
  run(mats.pipeCream, 0.06, 54.2, 64.6, D + 1.58, -0.9, mats.red, 0.7);
  run(mats.red, 0.025, 54.5, 64.2, D + 1.42, 0.95, mats.red, 0.65);
  pipe(mats.pipeCream, 0.07, 0.9, 63.4, D + 1.35, -0.28, 'y');
  pipe(mats.pipeCream, 0.055, 0.7, 63.6, D + 1.2, 1.18, 'y');
}

function engine(cx, cz, side) {
  const L = 4.15;
  const W = 0.72;
  boxI(mats.dark, L, 0.12, W + 0.08, cx, D + 0.08, cz);
  boxI(mats.cream, L * 0.96, 0.32, W, cx, D + 0.28, cz);
  boxI(mats.cream, L * 0.9, 0.62, W * 0.86, cx, D + 0.72, cz);
  boxI(mats.creamDark, L * 0.82, 0.16, W * 0.62, cx, D + 1.08, cz);
  for (let i = 0; i < 6; i++) {
    const x = cx - 1.45 + i * 0.55;
    pipe(mats.steel, 0.17, 0.42, x, D + 1.22, cz, 'y');
    boxI(mats.red, 0.22, 0.045, 0.22, x, D + 1.45, cz);
    pipe(mats.pipeYellow, 0.012, 0.28, x, D + 0.95, cz + side * 0.28, 'y');
    boxI(mats.dark, 0.06, 0.08, 0.08, x, D + 0.55, cz + side * 0.32);
  }
  const ez = cz - side * 0.3;
  pipe(mats.creamDark, 0.07, L * 0.78, cx - 0.1, D + 1.32, ez, 'x');
  pipe(mats.creamDark, 0.07, 0.42, cx + L * 0.36, D + 1.5, ez, 'y');
  // flywheel
  pipe(mats.dark, 0.28, 0.1, cx + L * 0.46, D + 0.5, cz, 'x');
  // forward gauge board, facing the bow so it is readable walking aft
  const fx = cx - L * 0.5;
  boxI(mats.cream, 0.06, 0.62, 0.48, fx, D + 0.95, cz);
  dial(mats.gaugePress, fx - 0.04, D + 1.08, cz - 0.1, '-x', 0.7);
  dial(mats.gaugePress, fx - 0.04, D + 1.08, cz + 0.1, '-x', 0.7);
  dial(mats.gaugeElec, fx - 0.04, D + 0.82, cz - 0.1, '-x', 0.6);
  dial(mats.gaugeDepth, fx - 0.04, D + 0.82, cz + 0.1, '-x', 0.6);
  handwheel(mats.red, fx - 0.02, D + 0.55, cz, '-x', 0.8);
  // rocker-cover clamps
  for (let i = 0; i < 5; i++) {
    boxI(mats.steel, 0.04, 0.04, W * 0.5, cx - 1.2 + i * 0.55, D + 1.28, cz);
  }
}

function motorBank() {
  motor(68.5, -0.52, 0.42, 2.5);
  motor(68.3, -1.32, 0.3, 1.9);
  motor(68.3, 1.2, 0.3, 1.9);
  // creep motor
  pipe(mats.dark, 0.14, 0.55, 70.5, D + 0.32, 0.15, 'x');
  boxI(mats.cream, 0.35, 0.28, 0.28, 70.15, D + 0.32, 0.15);
  // shafts continuing aft
  pipe(mats.steel, 0.08, 2.4, 71.15, D + 0.38, -1.32, 'x');
  pipe(mats.steel, 0.08, 2.4, 71.15, D + 0.38, 1.2, 'x');
  pipe(mats.steel, 0.1, 2.6, 71.25, D + 0.4, -0.52, 'x');
  // switchboard on starboard, levers and gauges
  boxI(mats.cream, 0.12, 1.35, 1.35, 66.35, D + 0.95, 1.15);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      dial(row === 2 ? mats.gaugeElec : mats.gaugePress, 66.26, D + 1.25 - row * 0.28, 0.75 + col * 0.28, '-z', 0.7);
    }
  }
  for (let i = 0; i < 4; i++) {
    boxI(mats.dark, 0.08, 0.28, 0.04, 66.24, D + 0.55, 0.7 + i * 0.22, 0.5, 0, 0);
    boxI(mats.red, 0.05, 0.05, 0.05, 66.2, D + 0.72, 0.7 + i * 0.22);
  }
  // cable looms from the board down to the motors
  for (let i = 0; i < 5; i++) {
    pipe(mats.rubber, 0.018, 1.1, 66.6, D + 0.7, 0.55 + i * 0.12, 'y');
    pipe(mats.rubber, 0.016, 1.3, 67.3 + i * 0.15, D + 0.35, 0.9, 'x');
  }
  plate(mats.plateDiesel, 66.22, D + 1.55, 1.15, '-z', 0.32, 0.12);
  handwheel(mats.red, 69.4, D + 1.15, -1.25, '+z', 0.75);
  handwheel(mats.pipeGreen, 69.6, D + 0.85, 1.15, '-z', 0.7);
}
function motor(x, z, r, len) {
  pipe(mats.cream, r, len, x, D + 0.48, z, 'x');
  pipe(mats.creamDark, r * 0.72, len * 0.35, x - len * 0.15, D + 0.48, z, 'x');
  for (let i = 0; i < 6; i++) {
    pipe(mats.steel, r * 1.05, 0.035, x - len * 0.32 + i * (len / 8), D + 0.48, z, 'x');
  }
  boxI(mats.dark, 0.18, r * 1.3, r * 1.3, x + len * 0.42, D + 0.48, z);
  // terminal box on top
  boxI(mats.cream, 0.35, 0.16, 0.28, x, D + 0.48 + r + 0.08, z);
  pipe(mats.rubber, 0.02, 0.35, x, D + 0.48 + r + 0.28, z, 'y');
}
