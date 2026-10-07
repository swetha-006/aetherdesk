import * as THREE from 'three';
import { sound } from './audio.js';

// Configuration for seated 24-inch lap dock slots
// The slots curve comfortably in an arc within 0.35m - 0.55m from user chest
export const DOCK_SLOTS = [
  { id: 0, x: -0.32, y: -0.10, z: -0.42, rotY: 0.28, rotX: -0.22, name: 'Triage / Backlog', label: 'SLOT 0 • TRIAGE' },
  { id: 1, x: -0.11, y: -0.09, z: -0.46, rotY: 0.09, rotX: -0.24, name: 'Active Focus 1', label: 'SLOT 1 • FOCUS' },
  { id: 2, x:  0.11, y: -0.09, z: -0.46, rotY: -0.09, rotX: -0.24, name: 'Active Focus 2', label: 'SLOT 2 • FOCUS' },
  { id: 3, x:  0.32, y: -0.10, z: -0.42, rotY: -0.28, rotX: -0.22, name: 'Executive Synthesis', label: 'SLOT 3 • SYNTHESIS' }
];

export class CardManager {
  constructor(scene) {
    this.scene = scene;
    this.cards = [];
    this.cardMeshes = new Map(); // cardId -> mesh
    this.hoveredCard = null;
    this.grabbedCard = null;
    this.slotVisuals = [];
  }

  createDockSlotVisuals() {
    DOCK_SLOTS.forEach((slot) => {
      const group = new THREE.Group();
      group.position.set(slot.x, slot.y, slot.z);
      group.rotation.x = slot.rotX;
      group.rotation.y = slot.rotY;

      // Base receiver tray plate
      const geom = new THREE.PlaneGeometry(0.19, 0.135);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x161B22,
        roughness: 0.6,
        metalness: 0.4,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.receiveShadow = true;
      group.add(mesh);

      // Glowing outer rim
      const edges = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.35,
        linewidth: 1
      });
      const border = new THREE.LineSegments(edges, lineMat);
      border.position.z = 0.001;
      group.add(border);

      // Slot text label canvas texture
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 48;
      const ctx = labelCanvas.getContext('2d');
      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(slot.label, 128, 24);

      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, opacity: 0.75 });
      const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.026), labelMat);
      labelMesh.position.set(0, -0.055, 0.002);
      group.add(labelMesh);

      // Magnetic hover target highlight plate (hidden until card dragged nearby)
      const highlightMat = new THREE.MeshBasicMaterial({
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide
      });
      const highlightMesh = new THREE.Mesh(geom, highlightMat);
      highlightMesh.position.z = 0.003;
      group.add(highlightMesh);

      this.scene.add(group);
      this.slotVisuals.push({
        slot,
        group,
        borderMat: lineMat,
        highlightMat,
        highlightMesh
      });
    });
  }

  setSlotHighlight(slotId, isActive) {
    const visual = this.slotVisuals.find((v) => v.slot.id === slotId);
    if (visual) {
      visual.highlightMat.opacity = isActive ? 0.28 : 0.0;
      visual.borderMat.opacity = isActive ? 0.95 : 0.35;
      visual.borderMat.color.setHex(isActive ? 0x10B981 : 0x06B6D4);
    }
  }

  clearAllSlotHighlights() {
    this.slotVisuals.forEach((v) => {
      v.highlightMat.opacity = 0.0;
      v.borderMat.opacity = 0.35;
      v.borderMat.color.setHex(0x06B6D4);
    });
  }

  renderCardCanvas(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Obsidian card background with tactile micro-texture
    ctx.fillStyle = '#161B22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle dark grid texture on card surface
    ctx.strokeStyle = '#1F2630';
    ctx.lineWidth = 1;
    for (let x = 32; x < canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 16);
      ctx.lineTo(x, canvas.height - 16);
      ctx.stroke();
    }

    // Top accent indicator based on capsule type
    let accentColor = '#06B6D4'; // Note / Default (Electric Cyan)
    let badgeBg = '#0E7490';
    if (data.type === 'task') {
      accentColor = '#10B981'; // Emerald
      badgeBg = '#047857';
    } else if (data.type === 'idea') {
      accentColor = '#F59E0B'; // Amber
      badgeBg = '#B45309';
    } else if (data.type === 'brief') {
      accentColor = '#38BDF8'; // Sky Cyan
      badgeBg = '#0369A1';
    }

    // Top glowing banner
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, canvas.width, 14);

    // Inner card border
    ctx.strokeStyle = '#30363D';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Card Type Badge
    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.roundRect(36, 36, 170, 44, 8);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((data.type || 'NOTE').toUpperCase(), 121, 58);

    // Priority Tag
    if (data.priority) {
      const isHigh = data.priority === 'HIGH' || data.priority === 'CRITICAL';
      ctx.fillStyle = isHigh ? '#991B1B' : '#334155';
      ctx.beginPath();
      ctx.roundRect(220, 36, 110, 44, 8);
      ctx.fill();

      ctx.fillStyle = isHigh ? '#FEF2F2' : '#CBD5E1';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(data.priority, 275, 58);
    }

    // Slot Anchor Indicator on top right
    ctx.fillStyle = '#475569';
    ctx.font = '600 18px Inter, sans-serif';
    ctx.textAlign = 'right';
    const slotName = DOCK_SLOTS[data.slotIndex % DOCK_SLOTS.length]?.name || 'Dock';
    ctx.fillText(`SLOT ${data.slotIndex}: ${slotName.toUpperCase()}`, canvas.width - 36, 58);

    // Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 34px Inter, sans-serif';
    const title = data.title || 'Untitled Capsule';
    const displayTitle = title.length > 30 ? title.substring(0, 28) + '...' : title;
    ctx.fillText(displayTitle, 36, 130);

    // Separator line
    ctx.strokeStyle = '#21262D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(36, 154);
    ctx.lineTo(canvas.width - 36, 154);
    ctx.stroke();

    // Body content (multi-line wrapping)
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '24px Inter, sans-serif';
    const text = data.content || '';
    const words = text.split(' ');
    let line = '';
    let y = 196;
    const lineHeight = 38;
    const maxLines = 6;
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 680 && n > 0) {
        ctx.fillText(line, 36, y);
        line = words[n] + ' ';
        y += lineHeight;
        lineCount++;
        if (lineCount >= maxLines) {
          ctx.fillText(line.trim() + '...', 36, y);
          line = '';
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (line && lineCount < maxLines) {
      ctx.fillText(line, 36, y);
    }

    // Footer Tag Chips
    if (data.tags && data.tags.length > 0) {
      let tagX = 36;
      const tagY = canvas.height - 56;
      ctx.font = 'bold 18px Inter, sans-serif';

      data.tags.slice(0, 4).forEach((tag) => {
        const tagText = '#' + tag;
        const tagWidth = ctx.measureText(tagText).width + 24;

        ctx.fillStyle = '#21262D';
        ctx.beginPath();
        ctx.roundRect(tagX, tagY - 20, tagWidth, 34, 6);
        ctx.fill();

        ctx.strokeStyle = '#30363D';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.fillText(tagText, tagX + 12, tagY + 3);

        tagX += tagWidth + 12;
      });
    }

    return canvas;
  }

  createCardMesh(data) {
    const canvas = this.renderCardCanvas(data);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const geom = new THREE.BoxGeometry(0.18, 0.125, 0.005);
    const faceMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.15
    });
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x21262d,
      roughness: 0.7,
      metalness: 0.3
    });

    const materials = [edgeMat, edgeMat, edgeMat, edgeMat, faceMat, edgeMat];
    const mesh = new THREE.Mesh(geom, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { cardData: data, isCard: true, id: data.id };

    // Calculate stack position if multiple cards share the same slot
    this.positionMeshInSlot(mesh, data.slotIndex, false);

    this.scene.add(mesh);
    this.cardMeshes.set(data.id, mesh);
    return mesh;
  }

  getStackIndex(cardId, slotIndex) {
    const cardsInSlot = this.cards.filter((c) => c.slotIndex === slotIndex);
    const idx = cardsInSlot.findIndex((c) => c.id === cardId);
    return idx >= 0 ? idx : 0;
  }

  positionMeshInSlot(mesh, slotIndex, animate = true) {
    const slot = DOCK_SLOTS[slotIndex % DOCK_SLOTS.length];
    const cardId = mesh.userData.id;
    const stackIdx = this.getStackIndex(cardId, slotIndex);

    // Slight vertical and depth offset per stack item to prevent z-fighting
    const stackYOffset = stackIdx * 0.008;
    const stackZOffset = stackIdx * 0.004;
    const staggerYaw = (stackIdx % 2 === 1 ? 0.02 : -0.015) * stackIdx;

    const targetPos = new THREE.Vector3(
      slot.x,
      slot.y + 0.004 + stackYOffset,
      slot.z + stackZOffset
    );
    const targetRot = new THREE.Euler(slot.rotX, slot.rotY + staggerYaw, 0);

    if (animate) {
      mesh.userData.targetPos = targetPos;
      mesh.userData.targetRot = targetRot;
      mesh.userData.isSnapping = true;
    } else {
      mesh.position.copy(targetPos);
      mesh.rotation.copy(targetRot);
      mesh.userData.targetPos = targetPos;
      mesh.userData.targetRot = targetRot;
      mesh.userData.isSnapping = false;
    }
  }

  loadCards(cardsData) {
    // Clear existing
    this.cardMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.cardMeshes.clear();
    this.cards = cardsData;

    this.cards.forEach((card, idx) => {
      if (card.slotIndex === undefined) card.slotIndex = idx % DOCK_SLOTS.length;
      this.createCardMesh(card);
    });
  }

  addCard(cardData) {
    if (!cardData.id) cardData.id = 'card-' + Date.now();
    if (cardData.slotIndex === undefined) {
      // Find least occupied slot
      const counts = [0, 0, 0, 0];
      this.cards.forEach((c) => {
        if (c.slotIndex >= 0 && c.slotIndex < 4) counts[c.slotIndex]++;
      });
      let minSlot = 0;
      let minVal = counts[0];
      for (let i = 1; i < 4; i++) {
        if (counts[i] < minVal) {
          minVal = counts[i];
          minSlot = i;
        }
      }
      cardData.slotIndex = minSlot;
    }

    this.cards.push(cardData);
    const mesh = this.createCardMesh(cardData);
    sound.playClick();
    return mesh;
  }

  getCard(cardId) {
    return this.cards.find((c) => c.id === cardId);
  }

  updateCard(cardId, newFields) {
    const card = this.cards.find((c) => c.id === cardId);
    if (!card) return;
    Object.assign(card, newFields);

    const mesh = this.cardMeshes.get(cardId);
    if (mesh) {
      mesh.userData.cardData = card;
      const newCanvas = this.renderCardCanvas(card);
      mesh.material[4].map.dispose();
      mesh.material[4].map = new THREE.CanvasTexture(newCanvas);
      mesh.material[4].needsUpdate = true;
    }
  }

  removeCard(cardId) {
    const idx = this.cards.findIndex((c) => c.id === cardId);
    if (idx !== -1) {
      this.cards.splice(idx, 1);
    }
    const mesh = this.cardMeshes.get(cardId);
    if (mesh) {
      this.scene.remove(mesh);
      this.cardMeshes.delete(cardId);
    }
  }

  findNearestSlot(pos) {
    let nearestSlot = DOCK_SLOTS[0];
    let minDist = Infinity;

    DOCK_SLOTS.forEach((slot) => {
      const slotPos = new THREE.Vector3(slot.x, slot.y, slot.z);
      const d = pos.distanceTo(slotPos);
      if (d < minDist) {
        minDist = d;
        nearestSlot = slot;
      }
    });

    return { slot: nearestSlot, distance: minDist };
  }

  snapToNearestSlot(mesh) {
    const { slot } = this.findNearestSlot(mesh.position);
    mesh.userData.cardData.slotIndex = slot.id;
    this.positionMeshInSlot(mesh, slot.id, true);
    sound.playSnap();
  }

  update(delta) {
    // Smoothly animate snapping cards with spring damping
    this.cardMeshes.forEach((mesh) => {
      if (mesh.userData.isSnapping && mesh.userData.targetPos) {
        mesh.position.lerp(mesh.userData.targetPos, 14 * delta);
        mesh.quaternion.slerp(new THREE.Quaternion().setFromEuler(mesh.userData.targetRot), 14 * delta);

        if (mesh.position.distanceTo(mesh.userData.targetPos) < 0.001) {
          mesh.position.copy(mesh.userData.targetPos);
          mesh.rotation.copy(mesh.userData.targetRot);
          mesh.userData.isSnapping = false;
        }
      }
    });
  }
}
