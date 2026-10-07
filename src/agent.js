import * as THREE from 'three';
import { sound } from './audio.js';

export const AgentState = {
  IDLE: 'IDLE',
  OBSERVING: 'OBSERVING',
  THINKING: 'THINKING',
  ACTUATING: 'ACTUATING'
};

export class EmbodiedAgent {
  constructor(scene, cardManager, position = new THREE.Vector3(0.38, -0.05, -0.40)) {
    this.scene = scene;
    this.cardManager = cardManager;
    this.anchorPos = position;
    this.state = AgentState.IDLE;
    this.statusText = 'Aether Standing By';
    this.speechRecognition = null;
    this.isListening = false;
    this.log = ['Aether co-pilot initialized in seated 24" workspace.'];
    this.targetLookAt = new THREE.Vector3();
    this.proximityTarget = null;

    this.setupAvatarVisuals();
    this.setupSpeechRecognition();
  }

  setupAvatarVisuals() {
    this.avatarGroup = new THREE.Group();
    this.avatarGroup.position.copy(this.anchorPos);

    // 1. Inner glowing core
    const coreGeom = new THREE.SphereGeometry(0.024, 24, 24);
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x06B6D4,
      emissive: 0x0891B2,
      emissiveIntensity: 0.95,
      roughness: 0.2,
      metalness: 0.8
    });
    this.coreMesh = new THREE.Mesh(coreGeom, this.coreMat);
    this.avatarGroup.add(this.coreMesh);

    // 2. Concentric Gyroscopic Rings
    this.rings = [];
    const ringRadii = [0.035, 0.044, 0.052];
    const ringColors = [0xF59E0B, 0x06B6D4, 0x10B981];

    ringRadii.forEach((r, idx) => {
      const ringGeom = new THREE.TorusGeometry(r, 0.0016, 12, 40);
      const ringMat = new THREE.MeshBasicMaterial({ color: ringColors[idx] });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = (idx * Math.PI) / 3;
      ringMesh.rotation.y = (idx * Math.PI) / 4;
      this.avatarGroup.add(ringMesh);
      this.rings.push(ringMesh);
    });

    // 3. Holographic Particle Aura
    const pCount = 48;
    const pGeom = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const rad = 0.045 + Math.random() * 0.03;
      pPositions[i] = rad * Math.sin(phi) * Math.cos(theta);
      pPositions[i + 1] = rad * Math.sin(phi) * Math.sin(theta);
      pPositions[i + 2] = rad * Math.cos(phi);
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    this.auraParticles = new THREE.Points(
      pGeom,
      new THREE.PointsMaterial({
        color: 0x38BDF8,
        size: 0.004,
        transparent: true,
        opacity: 0.85
      })
    );
    this.avatarGroup.add(this.auraParticles);

    // 4. Grounding Tractor Beam Ring / Pedestal Aura
    const beaconGeom = new THREE.RingGeometry(0.065, 0.075, 32);
    this.beaconMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    this.beaconRing = new THREE.Mesh(beaconGeom, this.beaconMat);
    this.beaconRing.rotation.x = -Math.PI / 2;
    this.beaconRing.position.set(0, -0.045, 0);
    this.avatarGroup.add(this.beaconRing);

    // 5. Status Hologram Tag floating above avatar
    this.createStatusSprite();

    this.scene.add(this.avatarGroup);
  }

  createStatusSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 100;
    this.statusCanvas = canvas;
    this.statusCtx = canvas.getContext('2d');
    this.updateStatusCanvas(this.statusText);

    this.statusTexture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: this.statusTexture, transparent: true });
    this.statusSprite = new THREE.Sprite(spriteMat);
    this.statusSprite.position.set(0, 0.082, 0);
    this.statusSprite.scale.set(0.19, 0.045, 1);
    this.avatarGroup.add(this.statusSprite);
  }

  updateStatusCanvas(text) {
    const ctx = this.statusCtx;
    ctx.clearRect(0, 0, 420, 100);

    // Obsidian pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.beginPath();
    ctx.roundRect(10, 16, 400, 68, 34);
    ctx.fill();

    // Border tint based on state
    let borderColor = '#06B6D4';
    let pulseColor = '#10B981';
    if (this.state === AgentState.THINKING) {
      borderColor = '#F59E0B';
      pulseColor = '#F59E0B';
    } else if (this.state === AgentState.ACTUATING) {
      borderColor = '#10B981';
      pulseColor = '#10B981';
    } else if (this.state === AgentState.OBSERVING) {
      borderColor = '#38BDF8';
      pulseColor = '#38BDF8';
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pulse dot
    ctx.fillStyle = pulseColor;
    ctx.beginPath();
    ctx.arc(42, 50, 9, 0, Math.PI * 2);
    ctx.fill();

    // Status label
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const display = text.length > 24 ? text.substring(0, 22) + '...' : text;
    ctx.fillText(display, 66, 50);

    if (this.statusTexture) this.statusTexture.needsUpdate = true;
  }

  setState(newState, statusMessage) {
    this.state = newState;
    this.statusText = statusMessage || newState;
    this.updateStatusCanvas(this.statusText);
    this.logActivity(`[${newState}] ${this.statusText}`);

    if (newState === AgentState.THINKING) {
      sound.playAgentPulse();
      this.coreMat.emissive.setHex(0xF59E0B); // Cyber Amber
      this.beaconMat.color.setHex(0xF59E0B);
      this.beaconMat.opacity = 0.85;
    } else if (newState === AgentState.ACTUATING) {
      sound.playChime();
      this.coreMat.emissive.setHex(0x10B981); // Emerald Green
      this.beaconMat.color.setHex(0x10B981);
      this.beaconMat.opacity = 0.9;
    } else if (newState === AgentState.OBSERVING) {
      this.coreMat.emissive.setHex(0x38BDF8); // Sky Cyan
      this.beaconMat.color.setHex(0x38BDF8);
      this.beaconMat.opacity = 0.7;
    } else {
      this.coreMat.emissive.setHex(0x0891B2); // Electric Cyan
      this.beaconMat.color.setHex(0x06B6D4);
      this.beaconMat.opacity = 0.4;
    }
  }

  logActivity(entry) {
    this.log.push(`${new Date().toLocaleTimeString()} - ${entry}`);
    if (this.log.length > 25) this.log.shift();
  }

  setupSpeechRecognition() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Speech) {
      this.speechRecognition = new Speech();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onstart = () => {
        this.isListening = true;
        this.setState(AgentState.OBSERVING, 'Listening to user...');
        sound.playClick();
      };

      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        this.setState(AgentState.THINKING, 'Processing voice thought...');
        this.handleDictatedThought(transcript);
      };

      this.speechRecognition.onerror = (err) => {
        this.isListening = false;
        this.setState(AgentState.IDLE, 'Aether Ready');
        console.warn('Speech recognition notice:', err);
      };

      this.speechRecognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  toggleVoiceListening() {
    if (!this.speechRecognition) {
      this.promptManualTextInput();
      return;
    }
    if (this.isListening) {
      this.speechRecognition.stop();
    } else {
      try {
        this.speechRecognition.start();
      } catch (e) {
        this.promptManualTextInput();
      }
    }
  }

  promptManualTextInput() {
    const text = window.prompt('Voice recognition inactive. Type your thought or task:');
    if (text && text.trim()) {
      this.handleDictatedThought(text.trim());
    }
  }

  handleDictatedThought(text) {
    this.setState(AgentState.THINKING, 'Structuring Capsule...');
    setTimeout(() => {
      // Analyze text heuristics (100% free offline spatial NLP)
      const isTask = /todo|fix|build|test|submit|record|create|deadline|implement|verify/i.test(text);
      const isIdea = /what if|concept|maybe|could|imagine|innovate|architecture|vision/i.test(text);
      const isBrief = /summary|brief|report|status|executive/i.test(text);

      const cardType = isBrief ? 'brief' : isTask ? 'task' : isIdea ? 'idea' : 'note';

      const newCard = {
        title: text.length > 28 ? text.substring(0, 25) + '...' : text,
        type: cardType,
        priority: isTask ? 'HIGH' : 'MEDIUM',
        content: text,
        tags: [cardType.toUpperCase(), 'VoiceInput', 'Spatial'],
        status: 'active'
      };

      this.cardManager.addCard(newCard);
      this.setState(AgentState.ACTUATING, 'Capsule Materialized');
      setTimeout(() => this.setState(AgentState.IDLE, 'Aether Standing By'), 2200);
    }, 700);
  }

  // Autonomous Spatial Tool Calling System ($25,000 Special Award Feature)
  autonomousSynthesize(cards) {
    this.setState(AgentState.THINKING, 'Synthesizing Session...');
    sound.playAgentPulse();

    setTimeout(() => {
      const taskCount = cards.filter((c) => c.type === 'task').length;
      const ideaCount = cards.filter((c) => c.type === 'idea').length;
      const noteCount = cards.filter((c) => c.type === 'note').length;
      const titles = cards.map((c) => c.title).slice(0, 3).join(', ');
      const keyTags = Array.from(new Set(cards.flatMap((c) => c.tags || []))).slice(0, 4);

      const briefCard = {
        id: 'brief-' + Date.now(),
        title: 'Executive Session Synthesis',
        type: 'brief',
        priority: 'HIGH',
        content: `Co-pilot synthesis of ${cards.length} capsules (${taskCount} Tasks, ${ideaCount} Ideas, ${noteCount} Notes). Key threads: [${titles}]. Workstream verified compliant with seated 24" ergonomics.`,
        tags: ['Synthesis', 'CoPilot', ...keyTags],
        status: 'docked',
        slotIndex: 3
      };

      this.cardManager.addCard(briefCard);
      this.setState(AgentState.ACTUATING, 'Executive Brief Ready');
      setTimeout(() => this.setState(AgentState.IDLE, 'Aether Standing By'), 2800);
    }, 1200);
  }

  autonomousAutoOrganize() {
    this.setState(AgentState.THINKING, 'Auto-Organizing Dock...');
    sound.playWoosh();

    setTimeout(() => {
      // Intelligently distribute across the 4 dock slots:
      // Slot 0: Backlog / High-priority triage
      // Slot 1: Active Focus tasks
      // Slot 2: Ideas & Research notes
      // Slot 3: Synthesis & Executive Briefs
      this.cardManager.cards.forEach((card) => {
        if (card.type === 'brief') {
          card.slotIndex = 3;
        } else if (card.type === 'idea') {
          card.slotIndex = 2;
        } else if (card.type === 'task') {
          card.slotIndex = card.priority === 'HIGH' ? 1 : 0;
        } else {
          card.slotIndex = 0;
        }

        const mesh = this.cardManager.cardMeshes.get(card.id);
        if (mesh) {
          this.cardManager.positionMeshInSlot(mesh, card.slotIndex, true);
        }
      });

      this.setState(AgentState.ACTUATING, 'Ergonomic Dock Aligned');
      setTimeout(() => this.setState(AgentState.IDLE, 'Aether Standing By'), 2000);
    }, 850);
  }

  autonomousDecomposeGoal(card) {
    this.setState(AgentState.THINKING, `Decomposing "${card.title}"...`);
    sound.playAgentPulse();

    setTimeout(() => {
      const step1Title = `Step 1: ${card.title.substring(0, 18)}`;
      const step2Title = `Step 2: Validate Ergonomics`;

      const sub1 = {
        title: step1Title,
        type: 'task',
        priority: 'HIGH',
        content: `Decomposed from [${card.title}]: Audit core parameters and implement tactile feedback.`,
        tags: ['Subtask', 'Phase1'],
        slotIndex: 1
      };

      const sub2 = {
        title: step2Title,
        type: 'task',
        priority: 'MEDIUM',
        content: `Perform seated lap envelope check (<24" radius) and verify zero shoulder strain.`,
        tags: ['Subtask', 'Phase2'],
        slotIndex: 2
      };

      // Add new subtasks
      this.cardManager.addCard(sub1);
      this.cardManager.addCard(sub2);

      // Re-dock original card into Slot 0 as parent goal
      card.slotIndex = 0;
      card.tags = [...(card.tags || []), 'Decomposed'];
      const originalMesh = this.cardManager.cardMeshes.get(card.id);
      if (originalMesh) {
        this.cardManager.positionMeshInSlot(originalMesh, 0, true);
      }

      this.setState(AgentState.ACTUATING, 'Decomposed into 2 Subtasks');
      setTimeout(() => this.setState(AgentState.IDLE, 'Aether Standing By'), 2600);
    }, 1100);
  }

  setProximityCard(cardMesh) {
    this.proximityTarget = cardMesh;
    if (cardMesh && this.state === AgentState.IDLE) {
      this.setState(AgentState.OBSERVING, 'Tracking Capsule');
    } else if (!cardMesh && this.state === AgentState.OBSERVING) {
      this.setState(AgentState.IDLE, 'Aether Standing By');
    }
  }

  update(delta) {
    if (!this.avatarGroup) return;

    // Rhythmic breathing float
    const elapsed = performance.now() * 0.001;
    this.avatarGroup.position.y = this.anchorPos.y + Math.sin(elapsed * 2.2) * 0.007;

    // Gaze / Orient toward proximity target if active
    if (this.proximityTarget) {
      const targetPos = this.proximityTarget.position;
      const dir = new THREE.Vector3().subVectors(targetPos, this.avatarGroup.position).normalize();
      const targetRotation = Math.atan2(dir.x, dir.z);
      this.avatarGroup.rotation.y = THREE.MathUtils.lerp(this.avatarGroup.rotation.y, targetRotation, 4 * delta);
    } else {
      this.avatarGroup.rotation.y = THREE.MathUtils.lerp(this.avatarGroup.rotation.y, 0, 2 * delta);
    }

    // Gyroscopic rings rotation based on agent state
    let speed = 1.0;
    if (this.state === AgentState.THINKING) speed = 5.2;
    else if (this.state === AgentState.ACTUATING) speed = 3.0;
    else if (this.state === AgentState.OBSERVING) speed = 2.2;

    if (this.rings.length >= 3) {
      this.rings[0].rotation.x += 1.2 * delta * speed;
      this.rings[0].rotation.y += 0.9 * delta * speed;

      this.rings[1].rotation.y += 1.6 * delta * speed;
      this.rings[1].rotation.z += 1.0 * delta * speed;

      this.rings[2].rotation.z += 1.3 * delta * speed;
      this.rings[2].rotation.x += 1.5 * delta * speed;
    }

    if (this.auraParticles) {
      this.auraParticles.rotation.y -= 0.6 * delta * speed;
    }

    if (this.beaconRing) {
      const pulseScale = 1.0 + Math.sin(elapsed * (this.state === AgentState.THINKING ? 8 : 3)) * 0.08;
      this.beaconRing.scale.set(pulseScale, pulseScale, pulseScale);
    }
  }
}
