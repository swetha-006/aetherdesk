import * as THREE from 'three';
import { sound } from './audio.js';

// WebXR Hand Tracking 25 Standard Joints
const HAND_JOINTS = [
  'wrist',
  'thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip',
  'index-finger-metacarpal', 'index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate', 'index-finger-phalanx-distal', 'index-finger-tip',
  'middle-finger-metacarpal', 'middle-finger-phalanx-proximal', 'middle-finger-phalanx-intermediate', 'middle-finger-phalanx-distal', 'middle-finger-tip',
  'ring-finger-metacarpal', 'ring-finger-phalanx-proximal', 'ring-finger-phalanx-intermediate', 'ring-finger-phalanx-distal', 'ring-finger-tip',
  'pinky-finger-metacarpal', 'pinky-finger-phalanx-proximal', 'pinky-finger-phalanx-intermediate', 'pinky-finger-phalanx-distal', 'pinky-finger-tip'
];

const BONE_CONNECTIONS = [
  // Thumb
  ['wrist', 'thumb-metacarpal'],
  ['thumb-metacarpal', 'thumb-phalanx-proximal'],
  ['thumb-phalanx-proximal', 'thumb-phalanx-distal'],
  ['thumb-phalanx-distal', 'thumb-tip'],
  // Index
  ['wrist', 'index-finger-metacarpal'],
  ['index-finger-metacarpal', 'index-finger-phalanx-proximal'],
  ['index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate'],
  ['index-finger-phalanx-intermediate', 'index-finger-phalanx-distal'],
  ['index-finger-phalanx-distal', 'index-finger-tip'],
  // Middle
  ['wrist', 'middle-finger-metacarpal'],
  ['middle-finger-metacarpal', 'middle-finger-phalanx-proximal'],
  ['middle-finger-phalanx-proximal', 'middle-finger-phalanx-intermediate'],
  ['middle-finger-phalanx-intermediate', 'middle-finger-phalanx-distal'],
  ['middle-finger-phalanx-distal', 'middle-finger-tip'],
  // Ring
  ['wrist', 'ring-finger-metacarpal'],
  ['ring-finger-metacarpal', 'ring-finger-phalanx-proximal'],
  ['ring-finger-phalanx-proximal', 'ring-finger-phalanx-intermediate'],
  ['ring-finger-phalanx-intermediate', 'ring-finger-phalanx-distal'],
  ['ring-finger-phalanx-distal', 'ring-finger-tip'],
  // Pinky
  ['wrist', 'pinky-finger-metacarpal'],
  ['pinky-finger-metacarpal', 'pinky-finger-phalanx-proximal'],
  ['pinky-finger-phalanx-proximal', 'pinky-finger-phalanx-intermediate'],
  ['pinky-finger-phalanx-intermediate', 'pinky-finger-phalanx-distal'],
  ['pinky-finger-phalanx-distal', 'pinky-finger-tip']
];

export class HandInteractionEngine {
  constructor(scene, camera, renderer, cardManager) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.cardManager = cardManager;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Hand tracking state for left/right hands (WebXR)
    this.xrHands = {
      left: { inputSource: null, joints: {}, isPinching: false, palmUp: false, pinchMesh: null, group: null, jointMeshes: {}, boneLines: null, bonePositions: null },
      right: { inputSource: null, joints: {}, isPinching: false, palmUp: false, pinchMesh: null, group: null, jointMeshes: {}, boneLines: null, bonePositions: null }
    };

    // Grabbed object state
    this.grabbedMesh = null;
    this.grabHand = null; // 'mouse' or 'left' or 'right'
    this.grabPlane = new THREE.Plane();
    this.grabIntersection = new THREE.Vector3();
    this.grabStartPos = new THREE.Vector3();
    this.grabStartTime = 0;

    // Palm Palette mesh (appears over left wrist/palm)
    this.paletteGroup = null;
    this.paletteVisible = false;
    this.paletteRing = null;

    // Desktop simulator state
    this.isDesktopPinching = false;
    this.hoveredInteractive = null;

    // External event callbacks
    this.onCardTossedToAgent = null;
    this.onCardSnapped = null;
    this.onCardInspect = null;
    this.onPaletteAction = null;
    this.onAgentProximity = null;

    this.setupHandVisuals();
    this.setupPalmPalette();
    this.setupDesktopControls();
  }

  setupHandVisuals() {
    ['left', 'right'].forEach((side) => {
      const isLeft = side === 'left';
      const mainColor = isLeft ? 0x06B6D4 : 0xF59E0B;
      const boneColor = isLeft ? 0x22D3EE : 0xFBBF24;

      const handGroup = new THREE.Group();
      handGroup.visible = false;
      this.scene.add(handGroup);
      this.xrHands[side].group = handGroup;

      // 1. Joint Meshes (25 joints)
      const jointMeshes = {};
      HAND_JOINTS.forEach((jointName) => {
        const isTip = jointName.endsWith('-tip');
        const isWrist = jointName === 'wrist';
        const radius = isWrist ? 0.007 : isTip ? 0.0045 : 0.0035;

        const geom = new THREE.SphereGeometry(radius, 12, 12);
        const mat = new THREE.MeshStandardMaterial({
          color: mainColor,
          emissive: mainColor,
          emissiveIntensity: 0.6,
          roughness: 0.3,
          metalness: 0.7
        });
        const jointMesh = new THREE.Mesh(geom, mat);
        jointMesh.visible = false;
        handGroup.add(jointMesh);
        jointMeshes[jointName] = jointMesh;
      });
      this.xrHands[side].jointMeshes = jointMeshes;

      // 2. Bone Lines (interconnecting skeleton)
      const numBones = BONE_CONNECTIONS.length;
      const bonePositions = new Float32Array(numBones * 2 * 3);
      const boneGeom = new THREE.BufferGeometry();
      boneGeom.setAttribute('position', new THREE.BufferAttribute(bonePositions, 3));

      const boneMat = new THREE.LineBasicMaterial({
        color: boneColor,
        transparent: true,
        opacity: 0.7,
        linewidth: 2
      });
      const boneLines = new THREE.LineSegments(boneGeom, boneMat);
      handGroup.add(boneLines);
      this.xrHands[side].boneLines = boneLines;
      this.xrHands[side].bonePositions = bonePositions;

      // 3. Pinch indicator sphere
      const pinchGeom = new THREE.SphereGeometry(0.012, 16, 16);
      const pinchMat = new THREE.MeshBasicMaterial({
        color: mainColor,
        transparent: true,
        opacity: 0.75
      });
      const pinchSphere = new THREE.Mesh(pinchGeom, pinchMat);
      pinchSphere.visible = false;
      this.scene.add(pinchSphere);
      this.xrHands[side].pinchMesh = pinchSphere;
    });
  }

  setupPalmPalette() {
    this.paletteGroup = new THREE.Group();
    this.paletteGroup.position.set(-0.24, -0.05, -0.36); // Left lap/wrist area
    this.paletteGroup.visible = false;

    // Outer spinning tactical ring
    const ringGeom = new THREE.RingGeometry(0.055, 0.062, 36);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, side: THREE.DoubleSide });
    this.paletteRing = new THREE.Mesh(ringGeom, ringMat);
    this.paletteGroup.add(this.paletteRing);

    // Inner dark obsidian disc
    const discGeom = new THREE.CircleGeometry(0.053, 36);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x161B22,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });
    const disc = new THREE.Mesh(discGeom, discMat);
    this.paletteGroup.add(disc);

    // Center icon badge
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 128;
    badgeCanvas.height = 128;
    const bCtx = badgeCanvas.getContext('2d');
    bCtx.fillStyle = '#06B6D4';
    bCtx.font = 'bold 36px Inter, sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText('✋ PALM', 64, 64);
    const bTex = new THREE.CanvasTexture(badgeCanvas);
    const bMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.038, 0.038), new THREE.MeshBasicMaterial({ map: bTex, transparent: true }));
    bMesh.position.z = 0.002;
    this.paletteGroup.add(bMesh);

    // Radial tool buttons
    const tools = [
      { id: 'add_task', label: '+ TASK', color: 0x10B981, angle: 0 },
      { id: 'add_note', label: '+ NOTE', color: 0x06B6D4, angle: Math.PI * 0.5 },
      { id: 'add_idea', label: '+ IDEA', color: 0xF59E0B, angle: Math.PI },
      { id: 'voice_mic', label: '🎤 VOICE', color: 0xEC4899, angle: Math.PI * 1.5 }
    ];

    this.paletteButtons = [];

    tools.forEach((t) => {
      const btnGeom = new THREE.BoxGeometry(0.042, 0.022, 0.006);
      const btnMat = new THREE.MeshStandardMaterial({
        color: t.color,
        roughness: 0.3,
        metalness: 0.2
      });
      const btn = new THREE.Mesh(btnGeom, btnMat);
      const radius = 0.095;
      btn.position.set(Math.cos(t.angle) * radius, Math.sin(t.angle) * radius, 0.005);
      btn.userData = { isPaletteTool: true, toolId: t.id, label: t.label, baseColor: t.color };

      // Button label canvas texture
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.label, 80, 40);

      const labelTex = new THREE.CanvasTexture(canvas);
      const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
      const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.038, 0.019), labelMat);
      labelMesh.position.z = 0.004;
      btn.add(labelMesh);

      this.paletteGroup.add(btn);
      this.paletteButtons.push(btn);
    });

    this.scene.add(this.paletteGroup);
  }

  togglePalmPalette(forceState = null) {
    this.paletteVisible = forceState !== null ? forceState : !this.paletteVisible;
    this.paletteGroup.visible = this.paletteVisible;
    if (this.paletteVisible) {
      sound.playWoosh();
    }
    return this.paletteVisible;
  }

  setupDesktopControls() {
    const dom = this.renderer.domElement;

    dom.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.grabbedMesh) {
        // Dragging active capsule along view plane
        if (this.raycaster.ray.intersectPlane(this.grabPlane, this.grabIntersection)) {
          this.grabbedMesh.position.copy(this.grabIntersection);

          // Proximity test: check if near agent pedestal at (0.38, -0.05, -0.40)
          const agentPos = new THREE.Vector3(0.38, -0.05, -0.40);
          const distToAgent = this.grabbedMesh.position.distanceTo(agentPos);
          if (this.onAgentProximity) {
            this.onAgentProximity(distToAgent < 0.24 ? this.grabbedMesh : null);
          }

          // Slot proximity: highlight nearest slot
          const { slot, distance } = this.cardManager.findNearestSlot(this.grabbedMesh.position);
          this.cardManager.clearAllSlotHighlights();
          if (distance < 0.14) {
            this.cardManager.setSlotHighlight(slot.id, true);
          }
        }
      } else {
        // Check hover for cards and palette buttons
        const cardMeshes = Array.from(this.cardManager.cardMeshes.values());
        const intersects = this.raycaster.intersectObjects([...cardMeshes, ...this.paletteButtons], true);

        if (intersects.length > 0) {
          let topObj = intersects[0].object;
          while (topObj.parent && !topObj.userData.isCard && !topObj.userData.isPaletteTool && topObj !== this.scene) {
            topObj = topObj.parent;
          }
          if (topObj !== this.hoveredInteractive) {
            this.hoveredInteractive = topObj;
            sound.playHover();
            dom.style.cursor = 'pointer';
          }
        } else {
          if (this.hoveredInteractive) {
            this.hoveredInteractive = null;
            dom.style.cursor = 'default';
          }
        }
      }
    });

    dom.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left click only
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Check palette buttons first
      if (this.paletteVisible) {
        const palIntersects = this.raycaster.intersectObjects(this.paletteButtons, true);
        if (palIntersects.length > 0) {
          let btn = palIntersects[0].object;
          while (btn && !btn.userData.isPaletteTool) btn = btn.parent;
          if (btn && btn.userData.toolId) {
            sound.playClick();
            if (this.onPaletteAction) this.onPaletteAction(btn.userData.toolId);
            return;
          }
        }
      }

      // Check cards
      const cardMeshes = Array.from(this.cardManager.cardMeshes.values());
      const intersects = this.raycaster.intersectObjects(cardMeshes, true);

      if (intersects.length > 0) {
        let cardMesh = intersects[0].object;
        while (cardMesh.parent && !cardMesh.userData.isCard) cardMesh = cardMesh.parent;

        if (cardMesh && cardMesh.userData.isCard) {
          this.grabbedMesh = cardMesh;
          this.grabHand = 'mouse';
          this.grabStartPos.copy(cardMesh.position);
          this.grabStartTime = performance.now();
          this.isDesktopPinching = true;
          dom.style.cursor = 'grabbing';
          sound.playClick();

          // Stop ongoing snapping animation
          cardMesh.userData.isSnapping = false;

          // Drag plane facing camera tilted comfortably
          const normal = new THREE.Vector3(0, 0.35, 0.93).normalize();
          this.grabPlane.setFromNormalAndCoplanarPoint(normal, cardMesh.position);

          // Elevate slightly and tilt toward camera for optimal reading
          cardMesh.position.y += 0.02;
          cardMesh.rotation.x = -0.15;
        }
      }
    });

    dom.addEventListener('mouseup', () => {
      if (this.grabbedMesh) {
        dom.style.cursor = 'default';
        const releasedMesh = this.grabbedMesh;
        this.grabbedMesh = null;
        this.isDesktopPinching = false;
        this.cardManager.clearAllSlotHighlights();

        if (this.onAgentProximity) this.onAgentProximity(null);

        // Calculate drag distance to differentiate click (inspect) from drag (toss/snap)
        const dragDist = releasedMesh.position.distanceTo(this.grabStartPos);
        const dragTime = performance.now() - this.grabStartTime;

        if (dragDist < 0.015 && dragTime < 300) {
          // Micro-click / tap: open inspector modal!
          if (this.onCardInspect) {
            this.onCardInspect(releasedMesh.userData.cardData);
          }
          this.cardManager.snapToNearestSlot(releasedMesh);
          return;
        }

        // Check if tossed toward Agent pedestal (x: 0.38, y: -0.05, z: -0.40)
        const agentDist = releasedMesh.position.distanceTo(new THREE.Vector3(0.38, -0.05, -0.40));
        if (agentDist < 0.20) {
          if (this.onCardTossedToAgent) {
            this.onCardTossedToAgent(releasedMesh.userData.cardData);
          }
        } else {
          // Snap back into nearest curved tray slot
          this.cardManager.snapToNearestSlot(releasedMesh);
          if (this.onCardSnapped) {
            this.onCardSnapped(releasedMesh.userData.cardData);
          }
        }
      }
    });

    // Keyboard shortcuts:
    // P = Toggle Palm Palette
    // N = New Task Capsule
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'p' || e.key === 'P') {
        this.togglePalmPalette();
      }
    });
  }

  // WebXR Frame Hand-Tracking update (25 joints per hand)
  updateXRHandFrame(frame, referenceSpace) {
    const session = this.renderer.xr.getSession();
    if (!session) return;

    for (const inputSource of session.inputSources) {
      if (!inputSource.hand) continue;

      const handedness = inputSource.handedness; // 'left' or 'right'
      const handState = this.xrHands[handedness];
      if (!handState) continue;
      handState.inputSource = inputSource;

      // Make hand visual group visible
      if (handState.group) handState.group.visible = true;

      // Map to store current frame 3D positions of all joints
      const jointPositions = new Map();

      // Query and position all 25 joints
      for (const jointName of HAND_JOINTS) {
        const joint = inputSource.hand.get(jointName);
        const jointMesh = handState.jointMeshes[jointName];
        if (joint && referenceSpace) {
          const pose = frame.getJointPose(joint, referenceSpace);
          if (pose) {
            const pos = new THREE.Vector3(
              pose.transform.position.x,
              pose.transform.position.y,
              pose.transform.position.z
            );
            jointPositions.set(jointName, pos);
            if (jointMesh) {
              jointMesh.position.copy(pos);
              jointMesh.visible = true;
            }
          } else if (jointMesh) {
            jointMesh.visible = false;
          }
        }
      }

      // Update bone lines connecting the joints
      if (handState.boneLines && handState.bonePositions) {
        let ptr = 0;
        for (const [jointA, jointB] of BONE_CONNECTIONS) {
          const posA = jointPositions.get(jointA);
          const posB = jointPositions.get(jointB);
          if (posA && posB) {
            handState.bonePositions[ptr++] = posA.x;
            handState.bonePositions[ptr++] = posA.y;
            handState.bonePositions[ptr++] = posA.z;
            handState.bonePositions[ptr++] = posB.x;
            handState.bonePositions[ptr++] = posB.y;
            handState.bonePositions[ptr++] = posB.z;
          } else {
            ptr += 6;
          }
        }
        handState.boneLines.geometry.attributes.position.needsUpdate = true;
      }

      // Detect index-tip and thumb-tip for micro-pinch gesture
      const indexPos = jointPositions.get('index-finger-tip');
      const thumbPos = jointPositions.get('thumb-tip');
      const wristPos = jointPositions.get('wrist');

      if (indexPos && thumbPos) {
        // Update pinch mesh visual at midpoint
        const pinchMidpoint = new THREE.Vector3().addVectors(indexPos, thumbPos).multiplyScalar(0.5);
        handState.pinchMesh.position.copy(pinchMidpoint);
        handState.pinchMesh.visible = true;

        const pinchDistance = indexPos.distanceTo(thumbPos);
        const isPinchingNow = pinchDistance < 0.024; // 2.4 cm pinch threshold

        if (isPinchingNow && !handState.isPinching) {
          // Pinch Start
          handState.isPinching = true;
          sound.playClick();
          this.handleXRPinchStart(pinchMidpoint, handedness);
        } else if (!isPinchingNow && handState.isPinching) {
          // Pinch End
          handState.isPinching = false;
          this.handleXRPinchEnd(handedness);
        } else if (handState.isPinching && this.grabbedMesh && this.grabHand === handedness) {
          // Dragging along pinch
          this.grabbedMesh.position.copy(pinchMidpoint);

          // Proximity feedback
          const agentDist = this.grabbedMesh.position.distanceTo(new THREE.Vector3(0.38, -0.05, -0.40));
          if (this.onAgentProximity) {
            this.onAgentProximity(agentDist < 0.24 ? this.grabbedMesh : null);
          }
          const { slot, distance } = this.cardManager.findNearestSlot(this.grabbedMesh.position);
          this.cardManager.clearAllSlotHighlights();
          if (distance < 0.14) {
            this.cardManager.setSlotHighlight(slot.id, true);
          }
        }
      }

      // Detect Left Palm-Up to summon Palm Palette
      if (handedness === 'left' && wristPos) {
        const wristJoint = inputSource.hand.get('wrist');
        if (wristJoint && referenceSpace) {
          const wristPose = frame.getJointPose(wristJoint, referenceSpace);
          if (wristPose) {
            const rot = wristPose.transform.orientation;
            const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
            const upVector = new THREE.Vector3(0, 1, 0).applyQuaternion(quat);

            if (upVector.y > 0.55) {
              if (!this.paletteVisible) {
                this.paletteGroup.position.copy(wristPos).add(new THREE.Vector3(0, 0.06, 0.02));
                this.paletteGroup.quaternion.copy(this.camera.quaternion);
                this.togglePalmPalette(true);
              }
            } else {
              if (this.paletteVisible) {
                this.togglePalmPalette(false);
              }
            }
          }
        }
      }
    }
  }

  handleXRPinchStart(pinchPoint, handedness) {
    const cardMeshes = Array.from(this.cardManager.cardMeshes.values());
    let closestCard = null;
    let minDist = 0.08; // 8cm reach

    cardMeshes.forEach((mesh) => {
      const d = mesh.position.distanceTo(pinchPoint);
      if (d < minDist) {
        minDist = d;
        closestCard = mesh;
      }
    });

    if (closestCard) {
      this.grabbedMesh = closestCard;
      this.grabHand = handedness;
      this.grabStartPos.copy(closestCard.position);
      this.grabStartTime = performance.now();
      closestCard.userData.isSnapping = false;
    }
  }

  handleXRPinchEnd(handedness) {
    if (this.grabbedMesh && this.grabHand === handedness) {
      const released = this.grabbedMesh;
      this.grabbedMesh = null;
      this.grabHand = null;
      this.cardManager.clearAllSlotHighlights();
      if (this.onAgentProximity) this.onAgentProximity(null);

      // Check agent toss
      const agentDist = released.position.distanceTo(new THREE.Vector3(0.38, -0.05, -0.40));
      if (agentDist < 0.20) {
        if (this.onCardTossedToAgent) this.onCardTossedToAgent(released.userData.cardData);
      } else {
        this.cardManager.snapToNearestSlot(released);
        if (this.onCardSnapped) this.onCardSnapped(released.userData.cardData);
      }
    }
  }

  update(delta) {
    // Rotate tactical accent ring on palm palette without spinning tool buttons
    if (this.paletteVisible && this.paletteRing) {
      this.paletteRing.rotation.z += 0.7 * delta;
    }
  }
}
