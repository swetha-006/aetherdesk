import * as THREE from 'three';

export class SpatialScene {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090D12); // Deep obsidian space void

    // Camera setup for seated ergonomic viewing (lap-focused)
    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.05,
      20
    );
    // User seated eye-level
    this.camera.position.set(0, 0, 0.05);

    // Renderer with WebXR capabilities
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.xr.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.setupLighting();
    this.setupEnvironment();
    this.setupLapDock();

    window.addEventListener('resize', () => this.onResize());
  }

  setupLighting() {
    // Ambient light with soft obsidian tone
    const ambient = new THREE.AmbientLight(0x384152, 1.4);
    this.scene.add(ambient);

    // Directional Key Light
    const keyLight = new THREE.DirectionalLight(0xF8FAFC, 1.9);
    keyLight.position.set(0.6, 1.2, 0.4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Fill Light with subtle cyan cool tone
    const fillLight = new THREE.DirectionalLight(0x06B6D4, 0.7);
    fillLight.position.set(-0.8, 0.6, 0.2);
    this.scene.add(fillLight);

    // Lap Dock Point Glow Light
    this.dockGlow = new THREE.PointLight(0x0891B2, 0.9, 1.4);
    this.dockGlow.position.set(0, -0.05, -0.45);
    this.scene.add(this.dockGlow);

    // Agent Pedestal Amber/Cyan Beacon Light
    this.agentBeaconLight = new THREE.PointLight(0x06B6D4, 0.6, 0.8);
    this.agentBeaconLight.position.set(0.38, 0.02, -0.40);
    this.scene.add(this.agentBeaconLight);
  }

  setupEnvironment() {
    // Ground grid below seated chair level
    const gridHelper = new THREE.GridHelper(8, 32, 0x1E293B, 0x0F172A);
    gridHelper.position.y = -0.85;
    this.scene.add(gridHelper);

    // Ambient floating dust motes
    const particleCount = 140;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4;
      positions[i + 1] = (Math.random() - 0.5) * 2;
      positions[i + 2] = -0.2 - Math.random() * 2;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.008,
      transparent: true,
      opacity: 0.4
    });

    this.particles = new THREE.Points(geom, mat);
    this.scene.add(this.particles);
  }

  setupLapDock() {
    // The Ergonomic 24-inch Curved Lap Console
    const dockGroup = new THREE.Group();
    dockGroup.position.set(0, -0.16, -0.45);

    // Main Curved Console Tray Shape
    const curveRadius = 0.55;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, curveRadius + 0.12, Math.PI * 0.65, Math.PI * 0.35, true);
    shape.absarc(0, 0, curveRadius - 0.12, Math.PI * 0.35, Math.PI * 0.65, false);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.015,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006
    };

    const dockGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    dockGeom.center();

    const dockMat = new THREE.MeshStandardMaterial({
      color: 0x161B22, // Matte obsidian
      roughness: 0.45,
      metalness: 0.6
    });

    const dockMesh = new THREE.Mesh(dockGeom, dockMat);
    dockMesh.rotation.x = Math.PI / 2 + 0.22; // Ergonomic tilt towards user eyes
    dockMesh.receiveShadow = true;
    dockGroup.add(dockMesh);

    // Tactical Neon LED Edge Strip along front contour
    const ledGeom = new THREE.TorusGeometry(0.55, 0.0035, 8, 54, Math.PI * 0.42);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4 });
    const ledStrip = new THREE.Mesh(ledGeom, ledMat);
    ledStrip.rotation.x = Math.PI / 2 + 0.22;
    ledStrip.rotation.z = Math.PI * 0.79;
    ledStrip.position.set(0, 0.008, 0.02);
    dockGroup.add(ledStrip);

    // Central Active Synthesis Pad
    const padGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.004, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x0F172A,
      roughness: 0.2,
      metalness: 0.8
    });
    const padMesh = new THREE.Mesh(padGeom, padMat);
    padMesh.position.set(0, 0.006, -0.02);
    padMesh.rotation.x = 0.22;
    dockGroup.add(padMesh);

    // Focus Pad Amber Rim
    const rimGeom = new THREE.RingGeometry(0.118, 0.122, 32);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B, side: THREE.DoubleSide });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.position.set(0, 0.009, -0.02);
    rimMesh.rotation.x = -Math.PI / 2 + 0.22;
    dockGroup.add(rimMesh);

    // Agent Pedestal on right wing of console
    const pedestalGeom = new THREE.CylinderGeometry(0.046, 0.056, 0.042, 24);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x21262D,
      roughness: 0.35,
      metalness: 0.7
    });
    const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
    pedestal.position.set(0.38, 0.05, 0.02);
    dockGroup.add(pedestal);

    // Pedestal Emitter Ring
    const ringGeom = new THREE.RingGeometry(0.042, 0.047, 28);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22D3EE, side: THREE.DoubleSide });
    const agentRing = new THREE.Mesh(ringGeom, ringMat);
    agentRing.rotation.x = -Math.PI / 2;
    agentRing.position.set(0.38, 0.072, 0.02);
    dockGroup.add(agentRing);

    this.dockGroup = dockGroup;
    this.scene.add(dockGroup);

    // World coordinate for agent avatar
    this.agentAnchor = new THREE.Vector3(0.38, -0.05, -0.40);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update(delta) {
    if (this.particles) {
      this.particles.rotation.y += 0.015 * delta;
    }
  }
}
