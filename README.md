<div align="center">

# 🥽 AetherDesk

### The Seated, Hands-First Spatial Agentic Workspace

*Turn complex thoughts into tactile data capsules, coordinated by an embodied autonomous AI agent.*

![Meta VR Start 2026](https://img.shields.io/badge/Meta%20VR%20Start-2026-0467DF?style=for-the-badge)
![Track](https://img.shields.io/badge/Track-Productivity-06B6D4?style=for-the-badge)
![Special](https://img.shields.io/badge/Special-Agentic%20Interaction-10B981?style=for-the-badge)
![WebXR](https://img.shields.io/badge/WebXR-Hand%20Tracking-F59E0B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

**[▶ Live WebXR Demo](https://your-domain.vercel.app)** · **[Quick Start](#-quick-start)** · **[Testing on Quest](#-testing-on-meta-quest)**

</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [The Problem](#-the-problem)
3. [The Solution](#-the-solution)
4. [Meta's Four Heuristic Tests](#-metas-four-heuristic-tests)
5. [Hands-First Gesture Design](#-hands-first-gesture-design)
6. [Aether: The Embodied Agent](#-aether-the-embodied-agent)
7. [Tech Stack](#-tech-stack)
8. [Project Structure](#-project-structure)
9. [Quick Start](#-quick-start)
10. [Testing on Meta Quest](#-testing-on-meta-quest)
11. [Deployment](#-deployment)
12. [Devpost Submission Kit](#-devpost-submission-kit)
13. [License](#-license)

---

## 🌟 Overview

AetherDesk is an ergonomics-first, seated spatial productivity environment built for **hands-only** interaction on **Meta Quest 3, Quest 3S, and Meta VR Glasses**.

Instead of making users reach toward giant floating 2D browser windows, a pattern that causes shoulder fatigue ("Gorilla Arm") within minutes, AetherDesk concentrates its interface into a **24-inch tactile micro-sphere** above the user's lap and chest.

Inside that space, users manipulate:

- **Data Capsules**: lightweight, tangible cards for tasks, notes, ideas, and briefs
- **Spatial Slates**: a curved lap console with magnetic dock slots
- **Aether**: an embodied, multimodal co-pilot that observes spatial context (what you hold, what you look at, how cards are clustered) and plans, organizes, and synthesizes work without typing or controllers

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      AETHERDESK SEATED 24" ENVELOPE                    │
│                                                                        │
│               [   HMD / User Seated Eye Level   ]                      │
│                                  │                                     │
│                     (24" / 0.6 m Radius Semi-Sphere)                   │
│                                  ▼                                     │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │                      EMBODIED AGENT                        │     │
│     │                     'AETHER' AVATAR                        │     │
│     │            (Gyroscopic Rings & Autonomous AI)              │     │
│     ├─────────────────────────────┬──────────────────────────────┤     │
│     │  LEFT PALM PALETTE          │     CURVED LAP CONSOLE       │     │
│     │  • Radial Quick Actions     │  • [ Slot 0 ]: Triage        │     │
│     │  • Mic Voice Dictation      │  • [ Slot 1 ]: Active Focus  │     │
│     │  • Capsule Dispenser        │  • [ Slot 2 ]: Synthesis     │     │
│     │  • Wrist-Anchored Ring      │  • [ Slot 3 ]: Executive Pad │     │
│     └─────────────────────────────┴──────────────────────────────┘     │
│                                                                        │
│          Elbows rest naturally on armrests / lap • Low fatigue         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 The Problem

Spatial productivity apps today share three architectural flaws:

| # | Flaw | Why it matters |
|---|------|----------------|
| 1 | **"Gorilla Arm" fatigue** | Apps replicate 2D monitors floating ~1.5 m away, forcing constant outstretched reaching. Shoulders tire within roughly 3–5 minutes. |
| 2 | **Flat screens in 3D space** | Placing 2D browser windows in a 6DoF headset wastes depth, micro-manipulation, and spatial memory (locational indexing). |
| 3 | **Passive chatbot AI** | AI in VR is typically a chat sidebar: no embodiment, no awareness of what the user touches or sees, and no ability to act on 3D objects. |

---

## 💡 The Solution

AetherDesk answers each flaw with one paradigm:

1. **Seated 24-inch lap desk.** All interactive surfaces live within a 0.35–0.55 m semi-sphere above the lap. Elbows rest on armrests or a chair tray while hands work via micro-pinches.
2. **Tangible 3D data capsules.** Information becomes physical cards (Tasks, Notes, Ideas, Executive Briefs) that snap into magnetic slots, group, stack, and respond with procedurally synthesized mechanical sound.
3. **Embodied autonomous co-pilot.** A 3D particle avatar on a console pedestal perceives spatial context, performs autonomous tool calls, and reorganizes your cards in real time.

---

## 🎯 Meta's Four Heuristic Tests

| Test | Requirement | How AetherDesk complies |
|------|-------------|-------------------------|
| **1. Airplane Seat** | Stationary, seated, operable within a 2-foot radius with no large swings | Built inside a 24-inch semi-sphere above the lap. All operations use micro-pinches and wrist tilts. |
| **2. One Bus Stop** | Fast cold start; value in under 10 minutes | Cold start under 4 seconds. Dictate a thought, have Aether organize it, and export a project brief in under 90 seconds. |
| **3. Take-It-Away** | Must remain a standalone product without third-party AI | Card physics, magnetic docking, sound synthesis, and note organization all work offline with no API keys. |
| **4. Hands-First** | Fully operable with natural hands, zero controllers | Implements the WebXR Hand Tracking API (25 joints per hand, pinch detection, palm-up summoning), with a mouse fallback on desktop. |

---

## ✋ Hands-First Gesture Design

| Gesture | Hand | Detection | Result |
|---------|------|-----------|--------|
| **Micro-Pinch Grab** | Dominant | Index-tip to thumb-tip distance below **2.4 cm** | Grab and drag any capsule along an ergonomic view plane; a tactile audio click confirms the grab |
| **Palm Summon** | Non-dominant (left) | Palm faces up toward the headset | A glowing radial **Palette Ring** appears over the wrist with 4 buttons: **+ Task**, **+ Note**, **+ Idea**, **🎤 Voice** |
| **Magnetic Dock Snap** | Either | Release a capsule near a tray slot | Spring-damper lerp pulls it into the slot with a deep magnetic snap sound |
| **Throw to Agent** | Dominant | Drag and release a capsule toward Aether's pedestal | Assigns the card to the agent, triggering goal decomposition or research expansion |

---

## 🤖 Aether: The Embodied Agent

AetherDesk targets the **Best Agentic Interaction** prize with spatial agency rather than a text prompt box. Aether has a visible state machine so users always know what it is doing.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      AETHER AGENT STATE MACHINE                        │
├───────────────┬────────────────────────────────────────────────────────┤
│ State         │ Behavior & Spatial Visual Feedback                     │
├───────────────┼────────────────────────────────────────────────────────┤
│ IDLE          │ Soft rhythmic breathing pulse; slow gyroscopic rings   │
│               │ at base frequency. Core: Electric Cyan.                │
├───────────────┼────────────────────────────────────────────────────────┤
│ OBSERVING     │ Gyro rings accelerate; avatar tilts toward the capsule │
│               │ held by the user or focused by user gaze.              │
├───────────────┼────────────────────────────────────────────────────────┤
│ THINKING      │ High-speed counter-rotational spin; core shifts to     │
│               │ Cyber Amber; harmonic resonant audio pulse fires.      │
├───────────────┼────────────────────────────────────────────────────────┤
│ ACTUATING     │ Core shifts to Emerald Green; fires spatial tool calls │
│               │ to reposition or spawn 3D cards.                       │
└───────────────┴────────────────────────────────────────────────────────┘
```

### Autonomous Spatial Tools

| Tool | What it does |
|------|--------------|
| `autonomousAutoOrganize()` | Scans all active capsules, sorts by priority and type, and aligns them into the optimal lap dock slots |
| `autonomousSynthesize(cards)` | Reads text across active cards, extracts key topics, and materializes a new **Executive Brief** capsule in Slot 3 |
| `autonomousDecomposeGoal(card)` | Takes a complex goal card tossed to the agent and breaks it into two sequential, actionable subtask capsules |

---


### Daily Retention Loop

- **Morning commute launchpad:** 10-minute triage of the day's tasks into 4 ergonomic slots.
- **Evening session export:** export structured notes for Obsidian or Notion.
- **Persistent vault:** every card position, note edit, and agent log is saved across sessions via IndexedDB and LocalStorage.

---

## 🛠️ Tech Stack

100% free and open source, with **no paid APIs**.

| Layer | Technology |
|-------|------------|
| 3D graphics & scene graph | [Three.js](https://threejs.org/) (r170+) |
| Spatial platform | WebXR Device API (`immersive-vr`, `local-floor`, `hand-tracking`) |
| Build tooling | [Vite](https://vitejs.dev/) (v6+) |
| Audio | Web Audio API, fully procedural synthesis (no WAV/MP3 files) |
| Voice input | Web Speech API (`webkitSpeechRecognition`) |
| Persistence | LocalStorage / IndexedDB with Markdown serialization |

**Design palette:** Obsidian `#090D12` · Cyan `#06B6D4` · Amber `#F59E0B` · Emerald `#10B981`

---

## 📂 Project Structure

```text
aetherdesk/
├── index.html        # Entry point: WebXR HUD and onboarding
├── package.json      # Vite & Three.js dependencies
├── README.md
├── LICENSE
├── public/           # Static assets & icons
└── src/
    ├── main.js       # App orchestrator & WebXR render loop
    ├── scene.js      # Three.js scene, lighting, 24" curved lap dock
    ├── cards.js      # 3D Data Capsules, CanvasTexture, magnetic snap
    ├── hands.js      # WebXR Hand Tracking (25 joints), palm palette, desktop simulator
    ├── agent.js      # Embodied agent 'Aether': avatar, autonomous tool calling
    ├── audio.js      # Procedural Web Audio synthesizer
    ├── vault.js      # Persistent session storage & Markdown exporter
    └── style.css     # Obsidian / cyan / amber design system
```

---

## 🚀 Quick Start

**Prerequisites:** Node.js v20+ (or v22+) and npm v10+.

```bash
# 1. Clone and install
git clone https://github.com/your-username/aetherdesk.git
cd aetherdesk
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Build for production (outputs to dist/)
npm run build
```

> **Note:** WebXR requires a secure context. `localhost` works for development; deployed builds must be served over HTTPS.

---

## 🥽 Testing on Meta Quest

### Method A: On-headset (no sideloading)

1. Put on your Meta Quest 3 / 3S / Pro.
2. Open the built-in **Meta Quest Browser**.
3. Go to your deployed URL (for example `https://your-domain.vercel.app`).
4. Press the blue **🥽 Enter WebXR (Meta Quest)** button at the top right.
5. Put your controllers down; your real hands render in 3D.
6. Rest your elbows on the armrests and enjoy the seated 24-inch workspace.

### Method B: Desktop browser

**With an emulator:** install the free *WebXR API Emulator* extension in Chrome or Edge, then open `http://localhost:5173`.

**With the built-in mouse simulator:**

| Input | Action |
|-------|--------|
| Left-click + drag | Pinch and drag a card |
| `P` | Summon the palm palette |

---

## ☁️ Deployment

The app is entirely client-side; no backend is required.

**Vercel**

```bash
npx vercel --prod
```

**GitHub Pages**

Push the contents of `dist/` to your `gh-pages` branch.

---

## 📝 Devpost Submission Kit

| Field | Value |
|-------|-------|
| **Submission Name** | AetherDesk: Seated Hands-First Spatial Agentic Workspace |
| **Track** | Productivity ($70,000 Top Prize) |
| **Division** | New Experience |
| **Tagline (138 / 140 chars)** | `Seated, hands-first spatial workspace turning complex thoughts into tactile data capsules guided by an embodied autonomous AI agent.` |
| **Target Special Awards** | Best Agentic Interaction ($25k) · Best Reason to Come Back ($25k) · Best First Five Minutes ($25k) · Best Accessibility Forward ($25k) |

### ✋ Hand Interaction Statement

> AetherDesk eliminates arm fatigue by constraining interaction to a 24-inch semi-sphere above the lap. Using WebXR Hand Tracking with a 25-joint articulated visual skeleton, users employ micro-pinches to grab data capsules and turn their non-dominant palm face-up to summon a wrist palette. Cards tossed toward the embodied agent trigger autonomous spatial synthesis. Zero controllers required.

### 📄 500-Word Project Description (Devpost Text Field)

```markdown
### 1. Inspiration
Spatial computing promised infinite monitors, but reality gave us "Gorilla Arm" shoulder fatigue in minutes. Reaching for floating 2D browser windows 1.5 meters away violates human biomechanics. We asked: What if spatial productivity respected the body? What if your entire workspace lived in an ergonomic 24-inch tactile micro-sphere above your lap, completely controller-free, operating seamlessly in a coach airplane seat or a morning commute?

### 2. How We Built It
Built 100% from scratch for Meta VR Start 2026, AetherDesk combines:
• WebXR Hand Tracking API: 25-joint articulated cybernetic hand skeleton, 2.4cm micro-pinch detection, and palm-up wrist palette summoning.
• Ergonomic 24-inch Curved Lap Console: Three.js magnetic slots snapping 3D data capsules (Tasks, Notes, Ideas, Briefs) directly within the seated rest zone.
• Procedural Web Audio Engine: Synthesizing tactile mechanical clicks, magnetic snaps, and harmonic chimes entirely client-side without external audio files.
• Embodied Autonomous Co-Pilot ("Aether"): A 3D gyroscopic avatar that perceives proximity, tracks held capsules, and autonomously executes spatial tool calls (auto-organizing slots, decomposing complex goals into subtasks, and synthesizing cross-card executive rollups).
• 100% Free & Offline-First: Zero paid third-party APIs. Operates completely standalone via local spatial NLP rules, Web Speech API, and persistent IndexedDB/LocalStorage vault.

### 3. Meta Heuristic Compliance
• Airplane Seat Test: Constrained within a 2-foot stationary radius; elbows rest comfortably on armrests.
• One Bus Stop Test: Cold start in <2 seconds. Daily rituals (Morning Triage, Focus Sprint, Evening Review) deliver immediate clarity in under 5 minutes.
• Take-It-Away Test: Completely entrant-built; no OpenAI or cloud dependencies.

### 4. Future Plans
Expanding multi-user collaborative lap docking over WebRTC, integrating local on-device small language models (SLMs) via WebGPU, and shipping directly as an optimized PWA on the Meta Quest Store.
```

### 📹 3-Minute Demonstration Video Storyboard & Script

```text
[0:00 - 0:25] THE HOOK & ERGONOMIC PROBLEM
• Visual: User seated comfortably in chair, putting on Quest 3. Hands rest on lap/armrests.
• VO: "Spatial productivity apps promised infinite screens, but reaching for floating windows causes shoulder fatigue in minutes. Meet AetherDesk—the seated, hands-first spatial workspace designed for Meta Quest 3 and Meta VR Glasses."

[0:25 - 0:55] AIRPLANE SEAT ERGONOMICS & HAND TRACKING
• Visual: 24-inch curved console glowing softly above lap. 25-joint articulated hand skeleton tracking finger movement.
• VO: "Every interaction operates within a two-foot radius. Notice how elbows stay anchored. Using natural micro-pinches under 2.4 centimeters, we lift and inspect tangible 3D data capsules with instant tactile audio feedback."

[0:55 - 1:35] PALM PALETTE & TACTILE DOCKING
• Visual: Turn non-dominant left palm face-up. Holographic radial palette blooms over wrist. User micro-taps '+ Task' and dictates thought.
• VO: "Turning your palm face-up summons the wrist palette. Voice thoughts instantly materialize into structured 3D cards, magnetically snapping into curved lap slots."

[1:35 - 2:20] BEST AGENTIC INTERACTION: EMBODIED CO-PILOT
• Visual: Drag a goal capsule and toss it toward Aether's pedestal. The avatar's gyroscopic rings accelerate into Cyber Amber (THINKING), emit harmonic resonance, and shatter the goal into two sequential subtasks in Emerald (ACTUATING). User hits 'Synthesize' to generate an Executive Rollup.
• VO: "Aether isn't a 2D chatbot sidebar. It is an embodied co-pilot that perceives spatial proximity, autonomously decomposes complex projects, and synthesizes executive rollups directly in 3D space."

[2:20 - 2:50] DAILY RETENTION & ACCESSIBILITY
• Visual: Switch between Morning Triage, Deep Focus Sprint (ambient dimming), and Evening Wind-Down. Show 1-click Markdown export to Obsidian/Notion.
• VO: "With daily habit presets, session streak tracking, and height calibration for wheelchair accessibility, AetherDesk gives you a compelling reason to come back every day."

[2:50 - 3:00] CONCLUSION
• VO: "Hands-first, zero controllers, 100% free and offline. The future of VR productivity is in your hands."
```

---

## 📄 License

Released under the [MIT License](LICENSE).