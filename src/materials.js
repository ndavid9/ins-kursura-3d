import * as THREE from 'three';
import { canvasTex } from './factory.js';

function std(opts) {
  return new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.05, ...opts });
}

const panel = canvasTex((g, w, h) => {
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(20,24,28,0.45)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(8, 0);
  g.lineTo(8, h);
  g.moveTo(0, h * 0.5);
  g.lineTo(w, h * 0.5);
  g.stroke();
  g.fillStyle = 'rgba(20,24,28,0.35)';
  for (let y = 18; y < h; y += 28) {
    for (let x = 20; x < w; x += 36) {
      g.fillRect(x, y, 2, 2);
      g.fillRect(x, y + 8, 2, 2);
    }
  }
}, 128, 128, [1, 1]);

function dial(g, w, h, label, unit, t) {
  g.fillStyle = '#f4efe4';
  g.fillRect(0, 0, w, h);
  g.strokeStyle = '#1c1c1c';
  g.lineWidth = 7;
  g.beginPath();
  g.arc(w / 2, h / 2, 52, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#1c1c1c';
  g.font = '700 18px sans-serif';
  g.textAlign = 'center';
  g.fillText(label, w / 2, 78);
  g.font = '600 14px sans-serif';
  g.fillText(unit, w / 2, 96);
  g.strokeStyle = '#b42318';
  g.lineWidth = 3;
  const a = -2.4 + t * 2.6;
  g.beginPath();
  g.moveTo(w / 2, h / 2);
  g.lineTo(w / 2 + Math.cos(a) * 36, h / 2 + Math.sin(a) * 36);
  g.stroke();
  g.fillStyle = '#222';
  g.beginPath();
  g.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
  g.fill();
}

function plateMat(top, bottom) {
  return std({
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#efe8da';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#2a2a2a';
      g.lineWidth = 6;
      g.strokeRect(6, 6, w - 12, h - 12);
      g.fillStyle = '#1a1a1a';
      g.font = '700 36px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(top, w / 2, h * 0.4);
      g.font = '600 22px sans-serif';
      g.fillText(bottom, w / 2, h * 0.68);
    }, 256, 128),
    roughness: 0.62,
    metalness: 0.05,
  });
}

export const mats = {
  hull: std({
    color: 0xffffff,
    map: panel,
    vertexColors: true,
    roughness: 0.62,
    metalness: 0.42,
  }),
  hullDark: std({ color: 0x1b2126, roughness: 0.78, metalness: 0.3 }),
  cream: std({ color: 0xd9d2c3, roughness: 0.78, metalness: 0.04 }),
  creamDark: std({ color: 0xb7b1a4, roughness: 0.8, metalness: 0.05 }),
  white: std({ color: 0xe7e1d6, roughness: 0.7 }),
  red: std({ color: 0xb42318, roughness: 0.45, metalness: 0.15 }),
  pipeGreen: std({ color: 0x2c6b45, roughness: 0.48, metalness: 0.22 }),
  pipeYellow: std({ color: 0xc6a23a, roughness: 0.5, metalness: 0.18 }),
  pipeBlue: std({ color: 0x3d6f99, roughness: 0.46, metalness: 0.2 }),
  pipeCream: std({ color: 0xd5cec0, roughness: 0.55, metalness: 0.12 }),
  brass: std({ color: 0xb08a45, roughness: 0.38, metalness: 0.72 }),
  steel: std({ color: 0x8d949a, roughness: 0.35, metalness: 0.75 }),
  dark: std({ color: 0x2a2e32, roughness: 0.55, metalness: 0.4 }),
  rubber: std({ color: 0x23262a, roughness: 0.9, metalness: 0.02 }),
  torpedo: std({ color: 0x3d4a3a, roughness: 0.55, metalness: 0.25 }),
  deck: std({ color: 0x4a4038, roughness: 0.86, metalness: 0.04 }),
  blanket: std({ color: 0x3e4a38, roughness: 0.9 }),
  pillow: std({ color: 0xe7e2d8, roughness: 0.9 }),
  blue: std({ color: 0x1f4e89, roughness: 0.55 }),
  blueCloth: std({ color: 0x1d4e89, roughness: 0.72 }),
  skin: std({ color: 0xc48a62, roughness: 0.7 }),
  orange: std({ color: 0xd4652f, roughness: 0.6 }),
  concrete: std({ color: 0xb7b1a8, roughness: 0.92 }),
  sand: std({ color: 0xe4d2b0, roughness: 1 }),
  tile: std({
    color: 0xffffff,
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#c46a52';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#b85d48';
      for (let y = 0; y < h; y += 16) {
        const off = (y / 16) % 2 ? 16 : 0;
        for (let x = -16; x < w; x += 32) {
          g.fillRect(x + off + 1, y + 1, 30, 14);
          g.fillStyle = y % 32 === 0 ? '#cf7b62' : '#a85442';
          g.fillRect(x + off + 1, y + 1, 30, 14);
          g.fillStyle = '#b85d48';
        }
      }
    }, 128, 128, [24, 10]),
    roughness: 0.92,
  }),
  road: std({ color: 0x6d7270, roughness: 0.95 }),
  glass: std({
    color: 0x9ec4d4,
    roughness: 0.08,
    metalness: 0.15,
    transparent: true,
    opacity: 0.55,
  }),
  lamp: new THREE.MeshStandardMaterial({
    color: 0xfff4d8,
    emissive: 0xffe1a8,
    emissiveIntensity: 1.4,
    roughness: 0.4,
  }),
  foliage: std({ color: 0x2f6b45, roughness: 0.9 }),
  trunk: std({ color: 0x6b5140, roughness: 0.9 }),
  waterWall: std({
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#e7f2f6';
      g.fillRect(0, 0, w, h);
      const bands = ['#1f6f93', '#3d93b8', '#7eb7cc', '#d5ecf2'];
      for (let i = 0; i < 6; i++) {
        g.fillStyle = bands[i % bands.length];
        g.beginPath();
        g.moveTo(0, 20 + i * 28);
        for (let x = 0; x <= w; x += 16) {
          g.lineTo(x, 20 + i * 28 + Math.sin(x * 0.08 + i) * 8);
        }
        g.lineTo(w, h);
        g.lineTo(0, h);
        g.fill();
      }
    }, 256, 128, [6, 1]),
    roughness: 0.85,
  }),
  sign: std({
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#14181c';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#d5dbe0';
      g.lineWidth = 8;
      g.strokeRect(16, 16, w - 32, h - 32);
      g.fillStyle = '#f4f7f8';
      g.font = '700 72px Georgia, serif';
      g.textAlign = 'center';
      g.fillText('KURSURA', w / 2, 118);
      g.font = '600 36px sans-serif';
      g.fillText('SUBMARINE MUSEUM', w / 2, 168);
      g.fillStyle = '#c5ccd1';
      g.font = '500 28px sans-serif';
      g.fillText('VMRDA  ·  RK BEACH', w / 2, 214);
    }, 640, 280),
    roughness: 0.6,
    metalness: 0.15,
  }),
  flag: std({
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#ff9933';
      g.fillRect(0, 0, w, h / 3);
      g.fillStyle = '#ffffff';
      g.fillRect(0, h / 3, w, h / 3);
      g.fillStyle = '#138808';
      g.fillRect(0, (2 * h) / 3, w, h / 3);
      g.strokeStyle = '#1a3c8b';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
      g.stroke();
    }, 96, 64),
    roughness: 0.7,
    side: THREE.DoubleSide,
  }),
  floral: std({
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#efe4d4';
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 70; i++) {
        const x = (i * 97) % w;
        const y = (i * 57) % h;
        g.fillStyle = i % 3 === 0 ? '#d9899a' : i % 3 === 1 ? '#7d9a6e' : '#e6c36a';
        g.beginPath();
        g.arc(x, y, 3 + (i % 4), 0, Math.PI * 2);
        g.fill();
      }
    }, 256, 256, [2, 2]),
    roughness: 0.92,
  }),
  gaugeDepth: std({
    map: canvasTex((g, w, h) => dial(g, w, h, 'ГЛУБ', 'm', 0.62), 128, 128),
    roughness: 0.4,
    metalness: 0.1,
  }),
  gaugePress: std({
    map: canvasTex((g, w, h) => dial(g, w, h, 'ВВД', 'кг', 0.4), 128, 128),
    roughness: 0.4,
    metalness: 0.1,
  }),
  gaugeElec: std({
    map: canvasTex((g, w, h) => dial(g, w, h, 'А', 'V', 0.55), 128, 128),
    roughness: 0.4,
    metalness: 0.1,
  }),
  plateAir: plateMat('ВВД', 'HP AIR'),
  plateFuel: plateMat('ТОПЛИВО', 'FUEL'),
  plateSea: plateMat('ЗАБОРТ.', 'SEA'),
  plateBallast: plateMat('БАЛЛАСТ', 'BALLAST'),
  plateWarn: plateMat('НЕ ТРОГАТЬ', 'DO NOT TOUCH'),
  plateDiesel: plateMat('37Д  2000', '2D42M'),
  gauge: std({
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#f6f1e6';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#222';
      g.lineWidth = 6;
      g.beginPath();
      g.arc(w / 2, h / 2, 54, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = '#1b1b1b';
      g.font = '700 18px sans-serif';
      g.textAlign = 'center';
      g.fillText('m', w / 2, 86);
      g.strokeStyle = '#b42318';
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(w / 2, h / 2);
      g.lineTo(w / 2 + 30, h / 2 - 24);
      g.stroke();
    }, 128, 128),
    roughness: 0.45,
  }),
  chart: std({
    map: canvasTex((g, w, h) => {
      g.fillStyle = '#efe6cf';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#2a6f97';
      g.lineWidth = 2;
      g.strokeRect(8, 8, w - 16, h - 16);
      g.beginPath();
      g.moveTo(20, 80);
      g.bezierCurveTo(80, 20, 140, 100, 220, 40);
      g.stroke();
      g.fillStyle = '#1d3557';
      g.font = '600 16px sans-serif';
      g.fillText('BAY OF BENGAL', 24, 36);
    }, 256, 128),
    roughness: 0.8,
  }),
  interior: std({
    color: 0xe7dfd2,
    roughness: 0.72,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }),
};

export function markerMaterial() {
  const map = canvasTex((g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#a68445';
    g.beginPath();
    g.arc(w / 2, h / 2, 28, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#f6f1e6';
    g.beginPath();
    g.arc(w / 2, h / 2, 12, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#f6f1e6';
    g.lineWidth = 4;
    g.beginPath();
    g.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
    g.stroke();
  }, 96, 96);
  return new THREE.SpriteMaterial({ map, depthWrite: false, transparent: true });
}
