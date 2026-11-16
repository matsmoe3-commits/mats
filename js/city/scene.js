// 3D-Stadt: jedes Gebäude ist ein Tool, Baustellen mit Kran sind geplante Vorhaben.
// Alles wird aus Code erzeugt (keine Modelldateien), damit neue Tools automatisch ein Gebäude bekommen.
import * as THREE from 'three';
import { OrbitControls } from '../../vendor/three/OrbitControls.js';
import { RoomEnvironment } from '../../vendor/three/RoomEnvironment.js';

const BLOCK = 36;   // Abstand von Straße zu Straße
const ROAD = 8;     // Straßenbreite
const LOT = BLOCK - ROAD; // bebaubare Fläche pro Block

const rand = mulberry32(7); // fester Zufall: die Stadt sieht bei jedem Laden gleich aus
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Materialien & Texturen ----------

const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });

function canvasTexture(w, h, draw, { repeat = [1, 1], srgb = true } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Fassade mit Fensterraster: Tagesbild + Leuchtbild für abends (zufällig beleuchtete Fenster).
function facade({ cols, rows, wall, glass, frame = wall, litRatio = 0.45, glassW = 0.7, glassH = 0.62 }) {
  const cw = 64; const ch = 64;
  const W = cols * cw; const H = rows * ch;
  const lit = [];
  for (let i = 0; i < cols * rows; i++) lit.push(rand() < litRatio);
  const cell = (g, x, y, fn) => {
    const gw = cw * glassW; const gh = ch * glassH;
    fn(g, x * cw + (cw - gw) / 2, y * ch + (ch - gh) / 2, gw, gh);
  };
  const map = canvasTexture(W, H, (g) => {
    g.fillStyle = wall; g.fillRect(0, 0, W, H);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      cell(g, x, y, (g2, px, py, w, h) => {
        g2.fillStyle = frame; g2.fillRect(px - 2, py - 2, w + 4, h + 4);
        const grad = g2.createLinearGradient(px, py, px + w, py + h);
        grad.addColorStop(0, glass[0]); grad.addColorStop(1, glass[1]);
        g2.fillStyle = grad; g2.fillRect(px, py, w, h);
      });
    }
  });
  const emissiveMap = canvasTexture(W, H, (g) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (!lit[y * cols + x]) continue;
      cell(g, x, y, (g2, px, py, w, h) => {
        g2.fillStyle = rand() < 0.3 ? '#ffe7bf' : '#ffd48f';
        g2.fillRect(px, py, w, h);
      });
    }
  });
  return { map, emissiveMap };
}

// Gitter (für Kranmast, Ausleger, Gerüst): Textur mit Transparenz.
function lattice(color, { diag = true } = {}) {
  return canvasTexture(64, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = color; g.lineWidth = 6;
    g.strokeRect(3, 3, w - 6, h - 6);
    if (diag) { g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.stroke(); }
  });
}

function windowMaterial(fac, opts = {}) {
  return mat('#ffffff', {
    map: fac.map, emissiveMap: fac.emissiveMap, emissive: new THREE.Color('#ffcf8a'), emissiveIntensity: 0,
    roughness: 0.35, metalness: 0.1, ...opts,
  });
}

// ---------- Bausteine ----------

function mesh(geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
const box = (w, h, d, material, x = 0, y = 0, z = 0) => mesh(new THREE.BoxGeometry(w, h, d), material, x, y + h / 2, z);

function prism(w, h, d, material) { // Dreiecksprisma (Giebel, Sheddach)
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(-w / 2 + w * 0.15, h); s.lineTo(-w / 2, 0);
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  geo.translate(0, 0, -d / 2);
  return mesh(geo, material);
}
function gable(w, h, d, material) { // symmetrischer Giebel
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  geo.translate(0, 0, -d / 2);
  return mesh(geo, material);
}
function pyramid(w, d, h, material) {
  const geo = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1);
  geo.rotateY(Math.PI / 4);
  const m = mesh(geo, material);
  m.scale.set(w, h, d);
  return m;
}

// ---------- Gebäude ----------
// Jede Funktion liefert { group, height } – group steht mittig auf (0,0,0), Front zeigt nach +z.

function tower() {
  const g = new THREE.Group();
  const concrete = mat('#bdb8b0');
  g.add(box(18, 5, 18, concrete));
  const fac = facade({ cols: 6, rows: 18, wall: '#5d6a74', glass: ['#9fb7c6', '#47606f'], frame: '#3e474e', litRatio: 0.5, glassW: 0.86, glassH: 0.72 });
  const side = windowMaterial(fac, { roughness: 0.18, metalness: 0.35 });
  const top = mat('#8a8780');
  const t = mesh(new THREE.BoxGeometry(12, 54, 12), [side, side, top, top, side, side], 0, 5 + 27, 0);
  g.add(t);
  g.add(box(13, 1.2, 13, mat('#d6d2cb'), 0, 59, 0)); // Dachkante
  g.add(box(5, 3, 4, mat('#9c978f'), -2, 60.2, 1)); // Technik
  g.add(mesh(new THREE.CylinderGeometry(0.15, 0.15, 9), mat('#777'), 3, 64.7, -3)); // Antenne
  g.add(box(10, 1.6, 0.4, mat('#2d2f33', { roughness: 0.5 }), 0, 2.6, 9.1)); // Vordach
  return { group: g, height: 66 };
}

function workshop() {
  const g = new THREE.Group();
  const fac = facade({ cols: 6, rows: 2, wall: '#9b5a43', glass: ['#b7c7cf', '#5d6f78'], frame: '#4b3b34', litRatio: 0.7, glassW: 0.62, glassH: 0.55 });
  const brick = windowMaterial(fac);
  g.add(mesh(new THREE.BoxGeometry(20, 8, 14), brick, 0, 4, 0));
  const glass = mat('#a9c4cf', { roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.75, emissive: new THREE.Color('#ffd48f'), emissiveIntensity: 0 });
  for (let i = 0; i < 4; i++) { // Sheddach
    const p = prism(5, 3, 14, glass);
    p.position.set(-7.5 + i * 5, 8, 0);
    g.add(p);
  }
  g.add(box(6, 5, 0.4, mat('#3a3d42', { roughness: 0.6, metalness: 0.4 }), 0, 0, 7.05)); // Rolltor
  g.add(box(1, 12, 1, mat('#8a4b38'), 8.5, 0, -5.5)); // Schornstein
  return { group: g, height: 13, glass };
}

function townhall() {
  const g = new THREE.Group();
  const fac = facade({ cols: 8, rows: 3, wall: '#d9cdb6', glass: ['#7f8f99', '#3d4950'], frame: '#efe7d8', litRatio: 0.6, glassW: 0.45, glassH: 0.6 });
  const stone = windowMaterial(fac);
  g.add(mesh(new THREE.BoxGeometry(22, 11, 14), stone, 0, 5.5, 0));
  const roof = pyramid(23, 15, 5, mat('#6f4f45', { roughness: 0.75 }));
  roof.position.y = 11 + 2.5;
  g.add(roof);
  const tfac = facade({ cols: 2, rows: 6, wall: '#d9cdb6', glass: ['#7f8f99', '#3d4950'], frame: '#efe7d8', litRatio: 0.4, glassW: 0.4, glassH: 0.5 });
  g.add(mesh(new THREE.BoxGeometry(5, 26, 5), windowMaterial(tfac), 0, 13, 7.5));
  const spire = pyramid(5.6, 5.6, 7, mat('#4f6b5e', { roughness: 0.6, metalness: 0.3 })); // Kupferdach
  spire.position.set(0, 26 + 3.5, 7.5);
  g.add(spire);
  const clock = mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 32), mat('#f4efe6', { emissive: new THREE.Color('#fff2d0'), emissiveIntensity: 0 }), 0, 21, 10.1);
  clock.rotation.x = Math.PI / 2;
  g.add(clock);
  g.add(box(0.15, 1.3, 0.1, mat('#222'), 0, 20.9, 10.3));
  g.add(box(6, 1, 3, mat('#cfc6b4'), 0, 0, 11)); // Treppe
  return { group: g, height: 33, extra: [clock.material] };
}

function museum() {
  const g = new THREE.Group();
  const stone = mat('#e7e2d8', { roughness: 0.7 });
  g.add(box(24, 1.2, 18, mat('#d3cdc1'), 0, 0, 0)); // Sockel
  g.add(box(22, 9, 12, stone, 0, 1.2, -2));
  for (let i = 0; i < 7; i++) {
    g.add(mesh(new THREE.CylinderGeometry(0.55, 0.65, 8, 16), stone, -9 + i * 3, 1.2 + 4, 6));
  }
  g.add(box(22, 1.2, 4.6, stone, 0, 9.2, 5.5)); // Gebälk
  const ped = gable(22, 3.5, 4.6, stone);
  ped.position.set(0, 10.4, 5.5);
  g.add(ped);
  g.add(box(22, 0.8, 12, mat('#cfc8bb'), 0, 10.2, -2));
  for (let i = 0; i < 3; i++) g.add(box(24 - i * 1.5, 0.4, 1.2, mat('#d3cdc1'), 0, i * 0.4, 9 + 0.6 - i * 1.2)); // Stufen
  return { group: g, height: 15 };
}

// Baustelle: Rohbau, Gerüst, Zaun, Kran. animate(t) dreht den Ausleger.
function crane(height = 34, jib = 26) {
  const g = new THREE.Group();
  const yellow = mat('#e3b23c', { map: lattice('#e3b23c'), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.3 });
  yellow.map.repeat.set(1, height / 2);
  const mast = box(1.6, height, 1.6, yellow);
  g.add(mast);
  g.add(box(4, 1, 4, mat('#8a8780'), 0, 0, 0)); // Fundament
  const top = new THREE.Group();
  top.position.y = height;
  const jibMat = mat('#e3b23c', { map: lattice('#e3b23c'), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.3 });
  jibMat.map.repeat.set(jib / 2, 1);
  const j = box(jib, 1.4, 1.4, jibMat, jib / 2 - 3, 0, 0);
  top.add(j);
  top.add(box(9, 1, 1.4, mat('#d9a634', { roughness: 0.55, metalness: 0.3 }), -7, 0.2, 0)); // Gegenausleger, massiv
  top.add(box(2.6, 2.6, 2.4, mat('#9a968f'), -10, -1.6, 0)); // Gegengewicht, hängt am Gegenausleger
  top.add(box(2.2, 2.4, 2, mat('#e3b23c', { roughness: 0.5 }), 0, -2.4, 1.6)); // Kabine
  top.add(mesh(new THREE.ConeGeometry(0.9, 5, 4), yellow, 0, 3.4, 0)); // Turmspitze
  const hookX = jib * 0.62;
  top.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 14), mat('#333'), hookX, -7, 0)); // Seil
  top.add(box(0.8, 1, 0.8, mat('#333', { metalness: 0.6, roughness: 0.4 }), hookX, -15, 0)); // Haken
  g.add(top);
  return { group: g, top };
}

function construction() {
  const g = new THREE.Group();
  const concrete = mat('#b9b4ab', { roughness: 0.9 });
  g.add(box(16, 0.6, 14, concrete));
  for (let f = 0; f < 3; f++) {
    for (const x of [-6.5, 0, 6.5]) for (const z of [-5.5, 0, 5.5]) {
      if (f === 2 && rand() < 0.4) continue;
      g.add(box(0.6, 3.4, 0.6, concrete, x, 0.6 + f * 3.6, z));
    }
    if (f < 2) g.add(box(14, 0.3, 12, concrete, 0, 0.6 + f * 3.6 + 3.4, 0));
  }
  const scaffold = mat('#8d939a', { map: lattice('#8d939a', { diag: false }), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5 });
  scaffold.map.repeat.set(8, 6);
  g.add(box(15, 11, 1.2, scaffold, 0, 0.6, 7.2));
  const fence = mat('#e9e6df');
  for (const [w, d, x, z] of [[18, 0.15, 0, 8.6], [18, 0.15, 0, -8.6], [0.15, 17, 9, 0], [0.15, 17, -9, 0]]) {
    g.add(box(w, 1.8, d, fence, x, 0, z));
  }
  g.add(box(6, 2.6, 2.6, mat('#5e7480'), -5.5, 0, -11)); // Bürocontainer
  g.add(mesh(new THREE.ConeGeometry(2.2, 1.6, 12), mat('#c9a978', { roughness: 1 }), 6, 0.8, -11)); // Sandhaufen
  const c = crane(36, 28);
  c.group.position.set(-8, 0, -6);
  c.top.rotation.y = rand() * Math.PI * 2;
  g.add(c.group);
  return { group: g, height: 40, crane: c };
}

const BUILDERS = { tower, workshop, townhall, museum, construction };

// ---------- Umgebung ----------

function tree(x, z) {
  const g = new THREE.Group();
  const s = 0.8 + rand() * 0.5;
  g.add(mesh(new THREE.CylinderGeometry(0.22 * s, 0.3 * s, 2.4 * s, 6), mat('#6b4f3a'), 0, 1.2 * s, 0));
  const leaf = mat(['#5d7d47', '#6b8a4f', '#4f6e3d'][Math.floor(rand() * 3)], { roughness: 0.95 });
  g.add(mesh(new THREE.IcosahedronGeometry(1.8 * s, 1), leaf, 0, 3.6 * s, 0));
  g.add(mesh(new THREE.IcosahedronGeometry(1.3 * s, 1), leaf, 0.7 * s, 4.6 * s, 0.3 * s));
  g.position.set(x, 0.25, z);
  g.rotation.y = rand() * Math.PI;
  return g;
}

function lamp(x, z) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.08, 0.1, 5, 6), mat('#3b3d40', { metalness: 0.6, roughness: 0.4 }), 0, 2.5, 0));
  const bulb = mesh(new THREE.SphereGeometry(0.28, 12, 8), mat('#fff6e0', { emissive: new THREE.Color('#ffd79a'), emissiveIntensity: 0 }), 0, 5.1, 0);
  g.add(bulb);
  g.position.set(x, 0, z);
  return { group: g, bulb };
}

// ---------- Szene ----------

export function mountCity(container, buildings, { onOpen, night: startNight } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // Bauplätze: Blöcke rund um die Kreuzung, nach Entfernung sortiert.
  const slots = [];
  for (let i = -3; i <= 2; i++) for (let j = -3; j <= 2; j++) {
    slots.push({ i, j, x: BLOCK / 2 + i * BLOCK, z: BLOCK / 2 + j * BLOCK });
  }
  slots.sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z) || a.x - b.x);
  const used = slots.slice(0, Math.max(4, buildings.length));
  const iMin = Math.min(...used.map((s) => s.i)); const iMax = Math.max(...used.map((s) => s.i));
  const jMin = Math.min(...used.map((s) => s.j)); const jMax = Math.max(...used.map((s) => s.j));
  const x0 = iMin * BLOCK; const x1 = (iMax + 1) * BLOCK;
  const z0 = jMin * BLOCK; const z1 = (jMax + 1) * BLOCK;
  const cx = (x0 + x1) / 2; const cz = (z0 + z1) / 2;
  const span = Math.max(x1 - x0, z1 - z0);

  // Boden, Straßen, Blöcke
  const ground = mesh(new THREE.PlaneGeometry(span * 6, span * 6), mat('#8e9a78', { roughness: 1 }), cx, -0.02, cz);
  ground.rotation.x = -Math.PI / 2;
  ground.castShadow = false;
  scene.add(ground);
  const asphalt = mat('#4a4b4f', { roughness: 0.95 });
  const marking = mat('#e8e4da', { roughness: 0.8 });
  const ext = 18; // Straßen laufen etwas über den Rand hinaus
  for (let i = iMin; i <= iMax + 1; i++) {
    const x = i * BLOCK;
    scene.add(box(ROAD, 0.05, z1 - z0 + ext * 2, asphalt, x, 0, cz));
    for (let z = z0 - ext + 2; z < z1 + ext; z += 5) {
      if (Math.abs(((z % BLOCK) + BLOCK) % BLOCK) < 6 || Math.abs(((z % BLOCK) + BLOCK) % BLOCK) > BLOCK - 6) continue;
      scene.add(box(0.25, 0.02, 2.2, marking, x, 0.05, z));
    }
  }
  for (let j = jMin; j <= jMax + 1; j++) {
    const z = j * BLOCK;
    scene.add(box(x1 - x0 + ext * 2, 0.05, ROAD, asphalt, cx, 0.001, z));
    for (let x = x0 - ext + 2; x < x1 + ext; x += 5) {
      if (Math.abs(((x % BLOCK) + BLOCK) % BLOCK) < 6 || Math.abs(((x % BLOCK) + BLOCK) % BLOCK) > BLOCK - 6) continue;
      scene.add(box(2.2, 0.02, 0.25, marking, x, 0.05, z));
    }
  }
  const sidewalk = mat('#c9c4bb', { roughness: 0.9 });
  const grass = mat('#7f9663', { roughness: 1 });
  const lamps = [];
  for (let i = iMin; i <= iMax; i++) for (let j = jMin; j <= jMax; j++) {
    const x = BLOCK / 2 + i * BLOCK; const z = BLOCK / 2 + j * BLOCK;
    scene.add(box(LOT, 0.25, LOT, sidewalk, x, 0, z));
    scene.add(box(LOT - 3, 0.06, LOT - 3, grass, x, 0.25, z));
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      scene.add(tree(x + dx * (LOT / 2 - 3), z + dz * (LOT / 2 - 3)));
    }
    const l = lamp(x + LOT / 2 - 0.8, z + LOT / 2 - 0.8);
    lamps.push(l);
    scene.add(l.group);
  }

  // Gebäude
  const pickables = [];
  const windowMats = [];
  const cranes = [];
  const labels = [];
  const labelLayer = document.createElement('div');
  labelLayer.className = 'city-labels';
  container.appendChild(labelLayer);

  buildings.forEach((b, n) => {
    const slot = used[n];
    const built = BUILDERS[b.kind]();
    const g = built.group;
    g.position.set(slot.x, 0.25, slot.z);
    // Front zur Kamera drehen (Kamera schaut von +x/+z): mal nach +z, mal nach +x
    g.rotation.y = n % 2 ? Math.PI / 2 : 0;
    g.traverse((o) => {
      if (!o.isMesh) return;
      o.userData.key = b.key;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      ms.forEach((m) => { if (m.emissiveMap || m.emissive?.getHex()) windowMats.push(m); });
    });
    scene.add(g);
    pickables.push(g);
    if (built.crane) cranes.push(built.crane);
    if (b.addCrane) { // bestehendes Gebäude im Ausbau
      const c = crane(Math.max(30, built.height * 0.7), 22);
      c.group.position.set(slot.x - 11, 0.25, slot.z - 11);
      c.top.rotation.y = 0.8;
      scene.add(c.group);
      cranes.push(c);
    }
    const el = document.createElement('button');
    el.className = `city-label${b.kind === 'construction' ? ' building-site' : ''}`;
    el.innerHTML = `<strong>${b.label}</strong>${b.sub ? `<span>${b.sub}</span>` : ''}`;
    el.addEventListener('click', (e) => { e.stopPropagation(); select(b.key); });
    labelLayer.appendChild(el);
    labels.push({ el, key: b.key, pos: new THREE.Vector3(slot.x, built.height + 3, slot.z), b });
  });

  // Licht
  const hemi = new THREE.HemisphereLight('#dfe8f0', '#7a6f5f', 1.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff4e2', 2.6);
  sun.position.set(cx + 80, 140, cz + 40);
  sun.target.position.set(cx, 0, cz);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = span * 0.9;
  Object.assign(sun.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc, near: 10, far: 400 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.6;
  scene.add(sun, sun.target);

  // Kamera: isometrisch, orthografisch
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 2000);
  const dir = new THREE.Vector3(1, 0.82, 1).normalize();
  camera.position.copy(dir.clone().multiplyScalar(300)).add(new THREE.Vector3(cx, 0, cz));
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(cx, 14, cz);
  controls.enableDamping = true;
  controls.minPolarAngle = 0.55;
  controls.maxPolarAngle = 1.15;
  controls.minZoom = 0.6;
  controls.maxZoom = 4;
  controls.screenSpacePanning = false;
  controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }; // Handy: wischen = verschieben
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.update();

  const viewSize = span * 0.66;
  function resize() {
    const w = container.clientWidth; const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    // Hochformat (Handy): mehr Höhe zeigen, damit alles reinpasst
    const size = aspect < 1 ? viewSize / Math.max(aspect, 0.55) * 0.8 : viewSize;
    camera.left = -size * aspect; camera.right = size * aspect;
    camera.top = size; camera.bottom = -size;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Tag / Abend
  function setNight(night) {
    scene.background = new THREE.Color(night ? '#1b2033' : '#dfe6ea');
    scene.fog = new THREE.Fog(scene.background, span * 2.2, span * 5);
    hemi.intensity = night ? 0.25 : 1.1;
    hemi.color.set(night ? '#5d6a9a' : '#dfe8f0');
    sun.intensity = night ? 0.35 : 2.6;
    sun.color.set(night ? '#9fb0e0' : '#fff4e2');
    scene.environmentIntensity = night ? 0.15 : 0.6;
    windowMats.forEach((m) => { m.emissiveIntensity = night ? 1.6 : 0; });
    lamps.forEach((l) => { l.bulb.material.emissiveIntensity = night ? 3 : 0; });
    container.classList.toggle('night', night);
  }
  setNight(!!startNight);

  // Auswahl: erster Tipp holt das Gebäude heran, zweiter öffnet das Tool.
  let selected = null;
  let anim = null;
  function select(key) {
    if (selected === key) { onOpen?.(key); return; }
    selected = key;
    const l = labels.find((x) => x.key === key);
    labels.forEach((x) => x.el.classList.toggle('active', x.key === key));
    const from = controls.target.clone();
    const to = new THREE.Vector3(l.pos.x, l.pos.y * 0.45, l.pos.z);
    const zFrom = camera.zoom; const zTo = Math.max(1.8, zFrom);
    const t0 = performance.now();
    anim = (now) => {
      const k = Math.min(1, (now - t0) / 700);
      const e = 1 - (1 - k) ** 3;
      const target = from.clone().lerp(to, e);
      camera.position.add(target.clone().sub(controls.target));
      controls.target.copy(target);
      camera.zoom = zFrom + (zTo - zFrom) * e;
      camera.updateProjectionMatrix();
      if (k === 1) anim = null;
    };
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return; // war ein Ziehen
    const r = renderer.domElement.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, true).find((h) => h.object.userData.key);
    if (hit) select(hit.object.userData.key);
    else { selected = null; labels.forEach((x) => x.el.classList.remove('active')); }
  });

  // Schleife
  const v = new THREE.Vector3();
  let raf = 0;
  let disposed = false;
  function frame(now) {
    if (disposed) return;
    if (!container.isConnected) { dispose(); return; }
    raf = requestAnimationFrame(frame);
    if (anim) anim(now);
    controls.update();
    cranes.forEach((c, n) => { c.top.rotation.y += Math.sin(now / 4000 + n * 2) * 0.0016; });
    renderer.render(scene, camera);
    const w = container.clientWidth; const h = container.clientHeight;
    labels.forEach((l) => {
      v.copy(l.pos).project(camera);
      // Schilder nie über den oberen Rand schieben (hohe Gebäude)
      const y = Math.max(54, (-v.y * 0.5 + 0.5) * h);
      const half = (l.width ||= l.el.offsetWidth) / 2 + 6; // Schilder auch seitlich im Bild halten
      const x = Math.min(w - half, Math.max(half, (v.x * 0.5 + 0.5) * w));
      l.el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    });
  }
  raf = requestAnimationFrame(frame);

  function dispose() {
    disposed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    controls.dispose();
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.map?.dispose(); m.emissiveMap?.dispose(); m.dispose(); });
    });
    pmrem.dispose();
    renderer.dispose();
  }

  return { setNight, dispose, select };
}
