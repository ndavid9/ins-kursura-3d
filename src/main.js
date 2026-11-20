import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COMPARTMENTS, HOTSPOTS, LENGTH, aboutParagraphs, approximationNotes, SOURCES } from './specs.js';
import { createExterior, updateSea } from './exterior.js';
import { createInterior } from './interior.js';
import { createFPS, compartmentAt } from './fps.js';

const view = document.getElementById('view');
const loadEl = document.getElementById('loading');
const loadBar = document.getElementById('load-bar');
const loadStatus = document.getElementById('load-status');
const bannerKicker = document.getElementById('banner-kicker');
const bannerTitle = document.getElementById('banner-title');
const bannerBody = document.getElementById('banner-body');
const card = document.getElementById('card');
const hint = document.getElementById('hint');
const mapEl = document.getElementById('map');
const about = document.getElementById('about');
const coarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
if (coarse) document.body.dataset.coarse = '1';

const renderer = new THREE.WebGLRenderer({ canvas: view, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xc5d0d8, 70, 280);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.08, 900);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let mode = 'exterior';
let exterior;
let interior;
let orbit;
let fps;
let shownSpot = null;
let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function frame() {
  return new Promise((r) => requestAnimationFrame(() => r()));
}
function setLoad(p, text) {
  loadBar.style.width = `${p}%`;
  loadStatus.textContent = text;
}

async function boot() {
  setLoad(12, 'Fairing a 91.3 m hull…');
  await frame();
  exterior = createExterior();
  scene.add(exterior.root);

  setLoad(38, 'Setting her on the RK Beach plinth…');
  await frame();
  orbit = new OrbitControls(camera, view);
  orbit.target.set(-14, 4.2, 0);
  camera.position.set(-24, 8.2, -27);
  orbit.enableDamping = !reduceMotion;
  orbit.dampingFactor = 0.08;
  orbit.maxPolarAngle = Math.PI * 0.49;
  orbit.minDistance = 8;
  orbit.maxDistance = 90;
  orbit.update();

  setLoad(62, 'Opening the seven compartments…');
  await frame();
  interior = createInterior();
  interior.position.x = -LENGTH / 2;
  interior.visible = false;
  for (const l of interior.userData.lights) l.visible = false;
  scene.add(interior);

  setLoad(84, 'Hanging the plaques…');
  await frame();
  fps = createFPS(camera, view);
  buildMap();
  buildAbout();
  wireUI();
  setLoad(100, 'She is on the beach.');
  await frame();
  loadEl.classList.add('done');
  setTimeout(() => loadEl.remove(), 500);
  document.body.dataset.mode = 'exterior';
  updateHud();
  window.__KURSURA = { enter, leave, fps, scene, camera, orbit };
  const hash = location.hash.replace('#', '');
  if (hash === 'about') about.showModal();
  else if (COMPARTMENTS.some((c) => c.id === hash)) enter(hash);
  animate();
}

function buildMap() {
  for (const c of COMPARTMENTS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.id = c.id;
    b.style.setProperty('--len', String(c.x1 - c.x0));
    b.innerHTML = `<i>${c.n}</i><span>${c.short}</span>`;
    b.title = c.name;
    b.addEventListener('click', () => enter(c.id));
    mapEl.appendChild(b);
  }
}

function buildAbout() {
  const body = document.getElementById('about-body');
  const paras = aboutParagraphs().map((p) => `<p>${p}</p>`).join('');
  const rows = [
    ['Class', 'I641, NATO Foxtrot. Kalvari class.'],
    ['Built', 'Sudomekh, Leningrad. Launched 25 Feb 1969. Commissioned at Riga 18 Dec 1969.'],
    ['Decommissioned', '27 February 2001, after 31 years and about 73,500 nautical miles.'],
    ['Museum', 'Dedicated 9 August 2002. Open to the public 24 August 2002. RK Beach, Visakhapatnam.'],
    ['Length', '91.3 m'],
    ['Beam / diameter', '7.4–7.5 m waterline in class tables; 8 m maximum on the museum board.'],
    ['Draught', '6 m (Kursura); 5.09 m in Russian tables on normal fuel.'],
    ['Height', '11.92 m on the museum board, keel to the top of the housed sail.'],
    ['Displacement', '1,945 t surfaced, 2,469 t dived (board and Indian Navy page).'],
    ['Depth', '280 m maximum on the board. Russian tables: 250 m operating, 280 m limit.'],
    ['Plant', '3 × 2,000 hp diesels; centre motor 2,700 hp; wing motors 2 × 1,350 hp; creep motor ~140 hp.'],
    ['Propellers', 'Three shafts, six blades each.'],
    ['Weapons', '6 bow and 4 stern 533 mm tubes, 22 torpedoes, or mines in lieu.'],
    ['Batteries', '448 cells in four groups of 112, 652 kg each on the board.'],
    ['Crew', 'Board: 72. Other Navy pages: 8 officers and 67–69 sailors.'],
    ['Compartments', '7, bow to stern, as walked in the museum.'],
  ].map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
  const approx = approximationNotes().map((p) => `<li>${p}</li>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noreferrer">${s.title}</a> — ${s.note}</li>`).join('');
  body.innerHTML = `
    ${paras}
    <h3>Figures used in the model</h3>
    <table>${rows}</table>
    <h3>What is approximate</h3>
    <ul>${approx}</ul>
    <h3>Sources</h3>
    <ul>${sources}</ul>
  `;
}

function wireUI() {
  document.getElementById('btn-about').addEventListener('click', () => about.showModal());
  document.getElementById('btn-mode').addEventListener('click', () => {
    if (mode === 'exterior') enter('c1');
    else leave();
  });
  document.getElementById('card-close').addEventListener('click', () => {
    card.hidden = true;
  });
  window.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('dialog')) return;
    if (e.code === 'KeyI') about.showModal();
    if (e.code === 'KeyB' && mode === 'exterior') enter('c1');
    if (e.code === 'KeyE' && mode === 'interior') {
      const atDoor = fps.state.z > 0.9 && (fps.state.x < 17.4 || fps.state.x > 78.6);
      if (atDoor) leave();
      else openNearest();
    }
    const n = Number(e.key);
    if (n >= 1 && n <= 7) enter(COMPARTMENTS[n - 1].id);
  });
  view.addEventListener('pointerdown', onPick);
  window.addEventListener('resize', resize);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function enter(id) {
  mode = 'interior';
  document.body.dataset.mode = 'interior';
  exterior.root.visible = false;
  interior.visible = true;
  for (const l of interior.userData.lights) l.visible = true;
  orbit.enabled = false;
  scene.fog = new THREE.FogExp2(0xd9d3c6, 0.016);
  scene.background = new THREE.Color(0x2a2824);
  camera.fov = 68;
  camera.updateProjectionMatrix();
  lastComp = null;
  fps.teleport(id || 'c1');
  fps.enable();
  view.focus();
  document.getElementById('btn-mode').textContent = 'Back to the beach';
  card.hidden = true;
  shownSpot = null;
  updateHud();
}

function leave() {
  mode = 'exterior';
  document.body.dataset.mode = 'exterior';
  fps.disable();
  interior.visible = false;
  for (const l of interior.userData.lights) l.visible = false;
  exterior.root.visible = true;
  orbit.enabled = true;
  scene.fog = new THREE.Fog(0xc5d0d8, 70, 280);
  scene.background = null;
  camera.fov = 50;
  camera.updateProjectionMatrix();
  camera.position.set(-24, 8.2, -27);
  orbit.target.set(-14, 4.2, 0);
  document.getElementById('btn-mode').textContent = 'Board at the bow';
  card.hidden = true;
  updateHud();
}

function updateHud() {
  const buttons = [...mapEl.querySelectorAll('button')];
  if (mode === 'exterior') {
    bannerKicker.textContent = 'On the plaza';
    bannerTitle.textContent = 'Kursura on her plinth';
    bannerBody.textContent = '91.3 m overall. The bow is cut open, as on RK Beach, so the six tubes show. A person on the tiles is 1.7 m.';
    hint.textContent = coarse
      ? 'Drag to orbit. Pinch to zoom. Board at the bow, or tap a compartment.'
      : 'Drag to orbit · scroll to zoom · Board at the bow, or pick a compartment.';
    buttons.forEach((b) => {
      b.classList.remove('active', 'here');
    });
    return;
  }
  const c = compartmentAt(fps.state.x);
  bannerKicker.textContent = c.kicker;
  bannerTitle.textContent = c.name;
  bannerBody.textContent = c.body;
  hint.textContent = coarse
    ? 'Left side walks · right side looks · tap a brass plaque.'
    : 'WASD or arrows walk · drag or click to look · E opens a plaque · 1–7 jump.';
  buttons.forEach((b) => {
    b.classList.toggle('active', b.dataset.id === c.id);
    b.classList.toggle('here', b.dataset.id === c.id);
  });
}

function distTo(h) {
  const dx = h.x - fps.state.x;
  const dz = h.z - fps.state.z;
  return Math.hypot(dx, dz);
}
function nearestHotspot() {
  let best = null;
  let bestD = 2.4;
  for (const h of HOTSPOTS) {
    const d = distTo(h);
    if (d < bestD) {
      best = h;
      bestD = d;
    }
  }
  return best;
}
function openNearest() {
  const h = nearestHotspot();
  if (h) openHotspot(h);
}
function openHotspot(h) {
  shownSpot = h.id;
  card.hidden = false;
  document.getElementById('card-kicker').textContent = 'Plaque';
  document.getElementById('card-title').textContent = h.title;
  document.getElementById('card-body').textContent = h.body;
}
function onPick(e) {
  if (mode !== 'interior') return;
  const rect = view.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(interior.getObjectByName('markers'), true);
  if (hits[0]) {
    const id = hits[0].object.userData.hotspot;
    const h = HOTSPOTS.find((d) => d.id === id);
    if (h) openHotspot(h);
  }
}

const clock = new THREE.Clock();
let lastComp = null;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  const t = clock.elapsedTime;
  if (mode === 'exterior') {
    if (!reduceMotion) updateSea(exterior.root, t);
    orbit.update();
  } else {
    fps.update(dt);
    const id = compartmentAt(fps.state.x).id;
    if (id !== lastComp) {
      lastComp = id;
      shownSpot = null;
      card.hidden = true;
      updateHud();
    }
    const near = nearestHotspot();
    if (near && card.hidden && near.id !== shownSpot && distTo(near) < 1.55) openHotspot(near);
    if (!reduceMotion) {
      const markers = interior.getObjectByName('markers');
      const s = 0.2 + Math.sin(t * 3) * 0.018;
      markers.children.forEach((m) => m.scale.set(s, s, s));
    }
  }
  renderer.render(scene, camera);
}

boot().catch((err) => {
  console.error(err);
  loadStatus.textContent = 'The model failed to start. See the console.';
});
