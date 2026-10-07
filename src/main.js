import * as THREE from 'three';
import { SpatialScene } from './scene.js';
import { CardManager } from './cards.js';
import { HandInteractionEngine } from './hands.js';
import { EmbodiedAgent, AgentState } from './agent.js';
import { vault } from './vault.js';
import { sound } from './audio.js';

class AetherDeskApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.xrSession = null;
    this.xrRefSpace = null;
    this.completedSteps = new Set();

    this.init();
  }

  init() {
    // 1. Setup Three.js Spatial Scene & Lap Dock
    this.spatialScene = new SpatialScene(this.container);
    this.scene = this.spatialScene.scene;
    this.camera = this.spatialScene.camera;
    this.renderer = this.spatialScene.renderer;

    // 2. Setup Card Manager & Load Vault
    this.cardManager = new CardManager(this.scene);
    this.cardManager.createDockSlotVisuals();
    const initialVault = vault.load();
    this.cardManager.loadCards(initialVault.cards);

    // 3. Setup Hands-First Engine
    this.handEngine = new HandInteractionEngine(
      this.scene,
      this.camera,
      this.renderer,
      this.cardManager
    );

    // 4. Setup Embodied Spatial Agent (Aether)
    this.agent = new EmbodiedAgent(
      this.scene,
      this.cardManager,
      this.spatialScene.agentAnchor
    );

    // Sync agent logs from vault
    if (initialVault.agentLog) {
      initialVault.agentLog.forEach((l) => this.agent.logActivity(l));
    }

    // Connect Hand Gestures to Agent Actions
    this.handEngine.onCardTossedToAgent = (card) => {
      this.updateHudToast(`Delegated "${card.title}" to Aether`);
      this.agent.autonomousDecomposeGoal(card);
      this.markStepComplete(3);
      vault.save(this.cardManager.cards, this.agent.log);
      this.syncAgentTelemetry();
    };

    this.handEngine.onCardSnapped = (card) => {
      this.markStepComplete(1);
      this.markStepComplete(4);
      vault.save(this.cardManager.cards, this.agent.log);
    };

    this.handEngine.onCardInspect = (card) => {
      this.markStepComplete(1);
      this.openInspectorModal(card);
    };

    this.handEngine.onAgentProximity = (grabbedMesh) => {
      this.agent.setProximityCard(grabbedMesh);
      this.syncAgentTelemetry();
    };

    this.handEngine.onPaletteAction = (toolId) => {
      this.markStepComplete(2);

      if (toolId === 'voice_mic') {
        this.agent.toggleVoiceListening();
      } else if (toolId === 'add_task') {
        this.cardManager.addCard({
          title: 'New Seated Task',
          type: 'task',
          priority: 'HIGH',
          content: 'Operable within 24-inch seated lap radius without controllers.',
          tags: ['HandsFirst', 'Action']
        });
        this.updateHudToast('Created Task Capsule');
      } else if (toolId === 'add_note') {
        this.cardManager.addCard({
          title: 'Quick Spatial Note',
          type: 'note',
          priority: 'MEDIUM',
          content: 'Micro-gestures preserve natural shoulder relaxation.',
          tags: ['Research', 'Ergonomics']
        });
        this.updateHudToast('Created Note Capsule');
      } else if (toolId === 'add_idea') {
        this.cardManager.addCard({
          title: 'Emergent Concept',
          type: 'idea',
          priority: 'MEDIUM',
          content: 'Cross-capsule multi-modal synthesis by autonomous co-pilot.',
          tags: ['Innovation', 'CoPilot']
        });
        this.updateHudToast('Created Idea Capsule');
      }
      vault.save(this.cardManager.cards, this.agent.log);
      this.syncAgentTelemetry();
    };

    // 5. Connect HUD UI Controls & Modals
    this.bindHudControls();
    this.bindInspectorModal();
    this.syncAgentTelemetry();

    // 6. Setup WebXR Session Handling
    this.setupWebXR();

    // 7. Start Main Loop
    this.clock = new THREE.Clock();
    this.renderer.setAnimationLoop((time, frame) => this.renderLoop(time, frame));
  }

  markStepComplete(stepNum) {
    if (this.completedSteps.has(stepNum)) return;
    this.completedSteps.add(stepNum);

    const stepItem = document.getElementById(`step-${stepNum}`);
    const stepBadge = document.getElementById(`step-num-${stepNum}`);
    if (stepItem) stepItem.classList.add('completed');
    if (stepBadge) stepBadge.innerHTML = '✓';

    const score = document.getElementById('onboarding-score');
    if (score) {
      score.innerText = `${this.completedSteps.size}/4 DONE`;
      if (this.completedSteps.size === 4) {
        score.className = 'badge-emerald';
        score.innerText = '4/4 VERIFIED';
        const banner = document.getElementById('onboarding-complete-banner');
        if (banner) banner.classList.remove('hidden');
        sound.playChime();
        this.updateHudToast('🏆 5-Minute Heuristic Passed! Workspace Ready.');
      }
    }
  }

  syncAgentTelemetry() {
    const pill = document.getElementById('agent-state-pill');
    const statusText = document.getElementById('agent-status-text');
    const logMini = document.getElementById('agent-log-mini');

    if (pill) {
      pill.innerText = this.agent.state;
      pill.className = `agent-state-badge ${this.agent.state.toLowerCase()}`;
    }

    if (statusText) {
      statusText.innerText = this.agent.statusText;
    }

    if (logMini && this.agent.log.length > 0) {
      const recent = this.agent.log.slice(-3);
      logMini.innerHTML = recent.map((l) => `<div class="log-line">> ${l}</div>`).join('');
    }
  }

  bindHudControls() {
    // WebXR Button
    const enterVrBtn = document.getElementById('enter-vr-btn');
    if (enterVrBtn) {
      enterVrBtn.addEventListener('click', () => this.toggleWebXRSession());
    }

    // + Add Capsule
    const addCardBtn = document.getElementById('btn-add-card');
    if (addCardBtn) {
      addCardBtn.addEventListener('click', () => {
        sound.playClick();
        this.openInspectorModal(null); // Create mode
      });
    }

    // Auto-Organize Dock
    const organizeBtn = document.getElementById('btn-auto-organize');
    if (organizeBtn) {
      organizeBtn.addEventListener('click', () => {
        this.agent.autonomousAutoOrganize();
        this.markStepComplete(4);
        this.updateHudToast('Agent auto-aligning lap dock slots');
        vault.save(this.cardManager.cards, this.agent.log);
        this.syncAgentTelemetry();
      });
    }

    // Synthesize Workspace
    const synthesizeBtn = document.getElementById('btn-synthesize');
    if (synthesizeBtn) {
      synthesizeBtn.addEventListener('click', () => {
        this.agent.autonomousSynthesize(this.cardManager.cards);
        this.markStepComplete(4);
        this.updateHudToast('Agent synthesizing executive brief');
        vault.save(this.cardManager.cards, this.agent.log);
        this.syncAgentTelemetry();
      });
    }

    // Voice Dictate
    const voiceBtn = document.getElementById('btn-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        this.agent.toggleVoiceListening();
        this.syncAgentTelemetry();
      });
    }

    // Palm Palette Toggle
    const paletteBtn = document.getElementById('btn-palette');
    if (paletteBtn) {
      paletteBtn.addEventListener('click', () => {
        const isVis = this.handEngine.togglePalmPalette();
        this.markStepComplete(2);
        this.updateHudToast(isVis ? 'Palm Palette Summoned' : 'Palette Dismissed');
      });
    }

    // Export Modal
    const exportBtn = document.getElementById('btn-export');
    const exportModal = document.getElementById('export-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const copyMdBtn = document.getElementById('btn-copy-md');
    const downloadMdBtn = document.getElementById('btn-download-md');

    if (exportBtn && exportModal) {
      exportBtn.addEventListener('click', () => {
        sound.playClick();
        const md = vault.exportMarkdown(
          this.cardManager.cards,
          this.agent.statusText,
          this.agent.log
        );
        document.getElementById('export-textarea').value = md;
        exportModal.classList.remove('hidden');
      });
    }

    if (closeModalBtn && exportModal) {
      closeModalBtn.addEventListener('click', () => {
        exportModal.classList.add('hidden');
      });
    }

    if (copyMdBtn) {
      copyMdBtn.addEventListener('click', () => {
        const text = document.getElementById('export-textarea').value;
        navigator.clipboard.writeText(text);
        this.updateHudToast('Copied Markdown to clipboard!');
        sound.playSnap();
      });
    }

    if (downloadMdBtn) {
      downloadMdBtn.addEventListener('click', () => {
        const text = document.getElementById('export-textarea').value;
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AetherDesk-Session-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
        sound.playChime();
        this.updateHudToast('Downloaded Markdown File');
      });
    }

    // Reset Workspace
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset workspace to default competition setup?')) {
          const defaults = vault.resetToDefaults();
          this.cardManager.loadCards(defaults);
          this.updateHudToast('Workspace reset to pristine state');
          sound.playWoosh();
        }
      });
    }

    // Audio Mute Toggle
    const soundToggle = document.getElementById('btn-sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        soundToggle.innerText = isMuted ? '🔇 Audio Muted' : '🔊 Audio Active';
      });
    }
  }

  bindInspectorModal() {
    const modal = document.getElementById('inspector-modal');
    const closeBtn = document.getElementById('btn-close-inspector');
    const saveBtn = document.getElementById('btn-save-inspector');
    const deleteBtn = document.getElementById('btn-delete-card');
    const delegateBtn = document.getElementById('btn-delegate-from-modal');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const cardId = document.getElementById('card-edit-id').value;
        const title = document.getElementById('card-edit-title').value.trim() || 'Untitled Capsule';
        const type = document.getElementById('card-edit-type').value;
        const priority = document.getElementById('card-edit-priority').value;
        const slotIndex = parseInt(document.getElementById('card-edit-slot').value, 10);
        const rawTags = document.getElementById('card-edit-tags').value;
        const tags = rawTags.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
        const content = document.getElementById('card-edit-content').value.trim();

        if (cardId) {
          // Update existing
          this.cardManager.updateCard(cardId, {
            title,
            type,
            priority,
            slotIndex,
            tags,
            content
          });
          const mesh = this.cardManager.cardMeshes.get(cardId);
          if (mesh) {
            this.cardManager.positionMeshInSlot(mesh, slotIndex, true);
          }
          this.updateHudToast(`Updated "${title}"`);
        } else {
          // Create new
          this.cardManager.addCard({
            title,
            type,
            priority,
            slotIndex,
            tags,
            content,
            status: 'active'
          });
          this.updateHudToast(`Materialized "${title}"`);
        }

        vault.save(this.cardManager.cards, this.agent.log);
        modal.classList.add('hidden');
        sound.playSnap();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const cardId = document.getElementById('card-edit-id').value;
        if (cardId) {
          this.cardManager.removeCard(cardId);
          vault.save(this.cardManager.cards, this.agent.log);
          this.updateHudToast('Deleted Capsule');
          sound.playWoosh();
        }
        modal.classList.add('hidden');
      });
    }

    if (delegateBtn) {
      delegateBtn.addEventListener('click', () => {
        const cardId = document.getElementById('card-edit-id').value;
        const card = this.cardManager.getCard(cardId);
        if (card) {
          modal.classList.add('hidden');
          this.handEngine.onCardTossedToAgent(card);
        }
      });
    }
  }

  openInspectorModal(card) {
    const modal = document.getElementById('inspector-modal');
    const titleEl = document.getElementById('inspector-modal-title');
    const deleteBtn = document.getElementById('btn-delete-card');
    const delegateBtn = document.getElementById('btn-delegate-from-modal');

    if (!modal) return;

    if (card) {
      titleEl.innerText = `Inspect Capsule: ${card.title}`;
      document.getElementById('card-edit-id').value = card.id;
      document.getElementById('card-edit-title').value = card.title || '';
      document.getElementById('card-edit-type').value = card.type || 'task';
      document.getElementById('card-edit-priority').value = card.priority || 'MEDIUM';
      document.getElementById('card-edit-slot').value = card.slotIndex !== undefined ? card.slotIndex : 0;
      document.getElementById('card-edit-tags').value = (card.tags || []).join(', ');
      document.getElementById('card-edit-content').value = card.content || '';
      if (deleteBtn) deleteBtn.style.display = 'inline-flex';
      if (delegateBtn) delegateBtn.style.display = 'inline-flex';
    } else {
      titleEl.innerText = 'Create New Data Capsule';
      document.getElementById('card-edit-id').value = '';
      document.getElementById('card-edit-title').value = '';
      document.getElementById('card-edit-type').value = 'task';
      document.getElementById('card-edit-priority').value = 'HIGH';
      document.getElementById('card-edit-slot').value = 1;
      document.getElementById('card-edit-tags').value = 'HandsFirst, Action';
      document.getElementById('card-edit-content').value = '';
      if (deleteBtn) deleteBtn.style.display = 'none';
      if (delegateBtn) delegateBtn.style.display = 'none';
    }

    modal.classList.remove('hidden');
    sound.playClick();
  }

  updateHudToast(msg) {
    const toast = document.getElementById('hud-toast');
    if (toast) {
      toast.innerText = msg;
      toast.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  }

  async setupWebXR() {
    if ('xr' in navigator) {
      try {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        const enterVrBtn = document.getElementById('enter-vr-btn');
        if (enterVrBtn) {
          if (isSupported) {
            enterVrBtn.disabled = false;
            enterVrBtn.innerHTML = '🥽 Enter WebXR (Meta Quest)';
          } else {
            enterVrBtn.innerHTML = '🖥️ WebXR Simulator / Desktop Mode';
          }
        }
      } catch (e) {
        console.warn('WebXR check error:', e);
      }
    }
  }

  async toggleWebXRSession() {
    if (!this.xrSession) {
      try {
        const session = await navigator.xr.requestSession('immersive-vr', {
          requiredFeatures: ['local-floor'],
          optionalFeatures: ['hand-tracking']
        });
        this.renderer.xr.setSession(session);
        this.xrSession = session;
        this.xrRefSpace = await session.requestReferenceSpace('local-floor');

        const enterVrBtn = document.getElementById('enter-vr-btn');
        if (enterVrBtn) enterVrBtn.innerHTML = 'Exit VR';

        session.addEventListener('end', () => {
          this.xrSession = null;
          this.xrRefSpace = null;
          if (enterVrBtn) enterVrBtn.innerHTML = '🥽 Enter WebXR (Meta Quest)';
        });

        sound.playChime();
        this.updateHudToast('Connected to Meta Quest Seated VR');
      } catch (err) {
        console.warn('Could not launch WebXR session:', err);
        alert('WebXR immersive-vr requires Meta Quest Browser or a WebXR enabled device. You are currently in high-fidelity Desktop Simulator mode (click & drag cards, press P for palette)!');
      }
    } else {
      this.xrSession.end();
    }
  }

  renderLoop(time, frame) {
    const delta = this.clock.getDelta();

    // 1. WebXR Hand Tracking Update if active
    if (frame && this.xrRefSpace) {
      this.handEngine.updateXRHandFrame(frame, this.xrRefSpace);
    }

    // 2. Component Updates
    this.spatialScene.update(delta);
    this.cardManager.update(delta);
    this.handEngine.update(delta);
    this.agent.update(delta);

    // 3. Periodic telemetry sync
    this.syncAgentTelemetry();

    // 4. Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.aetherDeskApp = new AetherDeskApp();
});
