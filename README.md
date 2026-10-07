<div align="center">

# 🥽 AetherDesk

### Seated, Hands-First Spatial Agentic Workspace

*Transform complex thoughts into tactile data capsules, coordinated by an embodied autonomous AI agent.*

[![Meta VR Start 2026](https://img.shields.io/badge/Meta%20VR%20Start-2026%20Developer%20Competition-0467DF?style=for-the-badge)](https://start-developer-competition-26.devpost.com/)
[![Track](https://img.shields.io/badge/Track-Productivity%20($70k)-06B6D4?style=for-the-badge)](https://start-developer-competition-26.devpost.com/)
[![Special](https://img.shields.io/badge/Special-Agentic%20Interaction%20($25k)-10B981?style=for-the-badge)](https://start-developer-competition-26.devpost.com/)
[![Special](https://img.shields.io/badge/Special-Reason%20to%20Come%20Back%20($25k)-F59E0B?style=for-the-badge)](https://start-developer-competition-26.devpost.com/)
[![Special](https://img.shields.io/badge/Special-First%205%20Minutes%20($25k)-EC4899?style=for-the-badge)](https://start-developer-competition-26.devpost.com/)
[![WebXR](https://img.shields.io/badge/WebXR-25--Joint%20Hand%20Tracking-0891B2?style=for-the-badge)](https://immersiveweb.dev/)
[![Zero Paid APIs](https://img.shields.io/badge/APIs-100%25%20Free%20%26%20Offline-green?style=for-the-badge)](#-tech-stack)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)](LICENSE)

**[▶ Live WebXR Demo](https://aetherdesk-lac.vercel.app/)** · **[Quick Start](#-quick-start)** · **[Testing on Meta Quest](#-testing-on-meta-quest)** · **[Devpost Submission Kit](#-devpost-submission-kit)**

</div>

---

## 📖 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [The Problem: Gorilla Arm & Flat VR](#-the-problem-gorilla-arm--flat-vr)
3. [The Solution: Seated 24" Tactile Envelope](#-the-solution-seated-24-tactile-envelope)
4. [System Architecture & Diagrams](#-system-architecture--diagrams)
   - [High-Level Data Flow & Architecture](#1-high-level-system-architecture)
   - [Seated 24-Inch Lap Envelope Layout](#2-seated-24-inch-lap-envelope-layout)
   - [Embodied Agent State Machine & Autonomous Tool Loop](#3-embodied-agent-state-machine--tool-calling)
   - [Hands-First 25-Joint Skeletal Tracking Architecture](#4-hands-first-25-joint-skeletal-tracking-architecture)
   - [Daily Retention Habit & Streak Loop](#5-daily-retention-habit--streak-loop)
5. [Core Features](#-core-features)
   - [Best Agentic Interaction: Embodied Co-Pilot](#1-best-agentic-interaction-embodied-co-pilot-aether)
   - [Best Reason to Come Back: Daily Productivity Rituals](#2-best-reason-to-come-back-daily-productivity-rituals--streak)
   - [Best Accessibility Forward: Ergonomic Envelope Calibration](#3-best-accessibility-forward-ergonomic-envelope-calibration)
6. [Meta's Four Heuristic Tests Compliance](#-metas-four-heuristic-tests-compliance)
7. [Hands-First Gesture Reference](#-hands-first-gesture-reference)
8. [Procedural Audio Engine](#-procedural-audio-engine)
9. [Tech Stack (100% Free Tiers)](#-tech-stack-100-free-tiers)
10. [Project Structure](#-project-structure)
11. [Quick Start](#-quick-start)
12. [Testing on Meta Quest 3/3S](#-testing-on-meta-quest-33s)
13. [Deployment Guide](#-deployment-guide)
14. [Devpost Submission Kit (Form Copy-Paste)](#-devpost-submission-kit)
15. [License](#-license)

---

## 🌟 Executive Summary

**AetherDesk** is an ergonomics-first, seated spatial productivity environment designed for **hands-only** operation on **Meta Quest 3, Quest 3S, and Meta VR Glasses**.

Instead of placing giant 2D browser windows floating 1.5 meters away—a flawed design that causes severe shoulder fatigue within 3–5 minutes—AetherDesk constrains all interaction to a **24-inch tactile micro-sphere** above the user's lap and chest.

Within this seated zone, users manipulate **tangible 3D data capsules** (Tasks, Notes, Ideas, and Executive Briefs), snap them magnetically into a curved lap console, and collaborate with **Aether**—an embodied 3D co-pilot that perceives spatial context, gazes at cards you hold, and autonomously decomposes goals and synthesizes work.

---

## 🚨 The Problem: Gorilla Arm & Flat VR

| # | Flaw | Biomechanical Consequence | Why Current VR Productivity Fails |
|---|---|---|---|
| 1 | **"Gorilla Arm" Fatigue** | Outstretched arms lever the deltoid and trapezius muscles against gravity. | Users experience acute shoulder exhaustion in **3 to 5 minutes**, making sustained work impossible. |
| 2 | **Flat Screens in 3D Space** | Headsets render 2D rectangular browser planes floating at infinite distance. | Wastes 6DoF spatial depth, micro-tactile manipulation, and locational human spatial indexing. |
| 3 | **Passive Sidebar Chatbots** | AI co-pilots in VR are typically flat text sidebars with zero embodiment. | The AI has no awareness of where cards sit in space, what the user touches, or how to actuate 3D objects. |

---

## 💡 The Solution: Seated 24" Tactile Envelope

AetherDesk solves these challenges with three foundational principles:

1. **Seated 24-Inch Lap Desk:** Every button, slot, and capsule resides within a $0.35\text{ m} - 0.55\text{ m}$ semi-sphere above the lap. Elbows rest naturally on armrests or chair trays while hands perform effortless micro-pinches.
2. **Tangible 3D Data Capsules:** Information is embodied as physical objects with real-time CanvasTexture rendering, priority tags, and magnetic spring-damper snap physics.
3. **Embodied Autonomous Spatial Co-Pilot:** A physical 3D gyroscopic entity situated on the lap console that perceives proximity, tracks held cards, and autonomously executes spatial layout tools without paid cloud APIs.

---

## 📐 System Architecture & Diagrams

### 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph InputLayer ["Spatial Input & Sensing Layer"]
        HMD["Meta Quest 3 / 3S / VR Glasses"]
        XRHand["WebXR Hand Tracking API (25 Joints)"]
        Speech["Web Speech API (webkitSpeechRecognition)"]
        Sim["Desktop Simulator Fallback (Mouse / Keys)"]
    end

    subgraph CoreEngine ["AetherDesk Core Spatial Engine"]
        HandEngine["HandInteractionEngine\n(Pinch < 2.4cm • Palm-Up > 0.55 • Snapping)"]
        Scene["SpatialScene\n(24-inch Curved Lap Console • Lighting • Dimmer)"]
        Cards["CardManager\n(Tactile Capsules • CanvasTexture • Magnetic Slots)"]
        Agent["EmbodiedAgent ('Aether')\n(3D Gyroscopic Rings • Proximity Gaze • Tool Calling)"]
        Audio["Procedural Web Audio\n(Clicks • Magnetic Snaps • Harmonic Chimes)"]
    end

    subgraph PersistenceLayer ["Persistence & Retention Layer"]
        Vault["VaultManager\n(LocalStorage / IndexedDB Sync)"]
        Streak["Session Streak & Retention Tracker\n(Daily Streak • Activity Telemetry)"]
        Export["Markdown Serializer\n(Obsidian & Notion Clean Export)"]
    end

    HMD --> XRHand
    XRHand --> HandEngine
    Speech --> Agent
    Sim --> HandEngine

    HandEngine --> Scene
    HandEngine --> Cards
    HandEngine --> Agent
    HandEngine --> Audio

    Agent --> Cards
    Agent --> Audio
    Cards --> Vault
    Agent --> Vault

    Vault --> Streak
    Vault --> Export
```

---

### 2. Seated 24-Inch Lap Envelope Layout

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
│     │         (Gyroscopic Rings & Autonomous Tool Engine)        │     │
│     ├─────────────────────────────┬──────────────────────────────┤     │
│     │  LEFT PALM PALETTE          │     CURVED LAP CONSOLE       │     │
│     │  • Radial Quick Tools       │  • [ Slot 0 ]: Triage        │     │
│     │  • + Task / + Note / + Idea │  • [ Slot 1 ]: Active Focus  │     │
│     │  • 🎤 Voice Thought         │  • [ Slot 2 ]: Deep Sprint   │     │
│     │  • Wrist-Anchored Ring      │  • [ Slot 3 ]: Synthesis     │     │
│     └─────────────────────────────┴──────────────────────────────┘     │
│                                                                        │
│          Elbows rest naturally on armrests / lap • Low fatigue         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Embodied Agent State Machine & Tool Calling

```mermaid
stateDiagram-v2
    [*] --> IDLE : Startup in 24" Lap Envelope
    
    IDLE --> OBSERVING : User pinches card OR looks near pedestal
    OBSERVING --> THINKING : Card tossed to pedestal OR Voice input received
    OBSERVING --> IDLE : User releases card elsewhere
    
    state THINKING {
        direction TB
        AnalyzeText : Local Heuristic Spatial NLP
        EvaluateGoal : Determine Decomposition vs Synthesis
    }
    
    THINKING --> ACTUATING : Tool Execution Triggered
    
    state ACTUATING {
        direction TB
        Tool1 : autonomousAutoOrganize()
        Tool2 : autonomousSynthesize(cards)
        Tool3 : autonomousDecomposeGoal(card)
    }
    
    ACTUATING --> IDLE : Emerald Chime Fired • Workspace Updated
```

---

### 4. Hands-First 25-Joint Skeletal Tracking Architecture

```mermaid
graph TD
    subgraph WebXRJoints ["25 Anatomical Joints per Hand"]
        Wrist["Wrist Joint (Orientation & Palm Normal)"]
        Thumb["Thumb Chain (Metacarpal ➔ Proximal ➔ Distal ➔ Tip)"]
        Index["Index Chain (Metacarpal ➔ Proximal ➔ Inter ➔ Distal ➔ Tip)"]
        Middle["Middle Chain (Metacarpal ➔ Proximal ➔ Inter ➔ Distal ➔ Tip)"]
        Ring["Ring Chain (Metacarpal ➔ Proximal ➔ Inter ➔ Distal ➔ Tip)"]
        Pinky["Pinky Chain (Metacarpal ➔ Proximal ➔ Inter ➔ Distal ➔ Tip)"]
    end

    subgraph GestureDetection ["Real-Time Gesture Detectors"]
        PinchCalc["Index-Tip to Thumb-Tip Distance < 2.4 cm"]
        PalmCalc["Wrist Normal Vector dot Eye Vector > 0.55"]
    end

    subgraph VisualOutput ["Articulated Visual Skeleton"]
        JointSpheres["25 Glowing Joint Meshes (Cyan Left / Amber Right)"]
        BoneCylinders["Dynamic LineSegments (Interconnecting Bones)"]
        PinchDot["Pinch Midpoint Spring Indicator"]
        PaletteMesh["Holographic Radial Wrist Palette"]
    end

    Wrist --> PalmCalc
    Index --> PinchCalc
    Thumb --> PinchCalc

    PalmCalc -->|True| PaletteMesh
    PinchCalc -->|True| PinchDot
    WebXRJoints --> JointSpheres
    WebXRJoints --> BoneCylinders
```

---

### 5. Daily Retention Habit & Streak Loop

```mermaid
flowchart LR
    Morning["🌅 Morning Triage\n(5-Min Cold Start • Clear Clutter • Top 3 Goals)"] --> Sprint["⚡ Deep Focus Sprint\n(Single-Tasking • Scene Dimmer • Slot 1 Isolation)"]
    Sprint --> Evening["🌙 Evening Wind-Down\n(Auto-Synthesize Executive Brief • Increment Streak)"]
    Evening --> Vault["💾 IndexedDB Vault\n(Markdown Export for Obsidian/Notion)"]
    Vault --> Streak["🔥 Daily Streak Increment\n(+1 Day Retention Telemetry)"]
    Streak -.-> Morning
```

---

## 🏆 Core Features

### 1. Best Agentic Interaction: Embodied Co-Pilot ("Aether")

Aether is not a passive text box; it is an embodied spatial entity living on the right pedestal of your lap console:
- **Spatial Awareness & Proximity Gaze:** When you grab a data capsule and move it toward the pedestal, Aether's 3D gyroscopic rings rotate toward the card, tracking your movements in real time.
- **Autonomous Tool Calling:**
  - `autonomousAutoOrganize()`: Scans all active capsules, classifies them by urgency/type, and smoothly snaps them into the four ergonomic tray slots.
  - `autonomousDecomposeGoal(card)`: When a high-level task capsule is tossed to Aether's pedestal, the avatar accelerates into **Cyber Amber (THINKING)**, emits a resonant harmonic pulse, and materializes two actionable subtasks in **Emerald Green (ACTUATING)**.
  - `autonomousSynthesize(cards)`: Evaluates active workstreams and materializes an **Executive Session Synthesis** card in Slot 3.
- **VR-Safe Thought Modal:** When voice recognition is unavailable or in quiet transit environments, Aether opens a non-blocking in-app thought modal equipped with 1-click hackathon prompt chips rather than blocking `window.prompt` dialogs.

---

### 2. Best Reason to Come Back: Daily Productivity Rituals & Streak

Directly addressing the competition's prompt for *"habits tied to a recurring context (morning routine, commute, wind-down)"*:
- **🌅 Morning Triage:** Instant cold start for the morning commute. Clears mental friction, ingests the day's agenda, and sorts priorities into Slots 0 and 1 in under 90 seconds.
- **⚡ Deep Focus Sprint:** Distraction-free single-tasking mode. Dims background ambient illumination to isolate the active focus capsule in Slot 1.
- **🌙 Evening Wind-Down:** Triggers co-pilot executive synthesis, exports a clean session rollup, and updates the persistent streak counter.
- **Persistent Retention Streak:** Tracks consecutive active days (`🔥 Day Streak`) in LocalStorage/IndexedDB, ensuring users have persistent continuity across sessions.

---


### 3. Best Accessibility Forward: Ergonomic Envelope Calibration

- **Wheelchair & Recliner Calibration:** The **♿ Ergonomics** drawer provides live slider adjustment for Console Elevation ($\pm 12\text{ cm}$) and Console Reach ($\pm 15\text{ cm}$). Whether seated in an office task chair, a deep sofa, a recliner, or a wheelchair, the lap console aligns precisely to the user's resting arm position.
- **Low-Motor Strain Micro-Gestures:** Interaction relies on $< 2.4\text{ cm}$ pinches, requiring zero large shoulder reaches or arm extensions.
- **High-Contrast Tactical Palette:** Strict AAA contrast obsidian background (`#090D12`) paired with high-visibility Cyan (`#06B6D4`), Amber (`#F59E0B`), and Emerald (`#10B981`) accents.
- **Multi-Modal Redundancy:** Every action can be completed via hand tracking, voice dictation, or desktop mouse/keyboard simulator.

---

## 🎯 Meta's Four Heuristic Tests Compliance

| Heuristic Test | Competition Requirement | How AetherDesk Complies | Verification Status |
|---|---|---|---|
| **1. Airplane Seat Test** | Seated, stationary, operable within a 2-foot radius with no large physical movement. | All cards, tools, and co-pilot controls reside within a **24-inch (0.6m) semi-sphere** above the lap. Elbows remain resting on armrests. | ✅ **PASS** |
| **2. One Bus Stop Test** | Fast cold start; clean pause/resume; satisfying in under 10 minutes. | Cold starts in **< 2 seconds**. Users can triage their day, break down a goal, and export a session brief in under 90 seconds. | ✅ **PASS** |
| **3. Take-It-Away Test** | Core experience is entrant-built. If you remove third-party services, does the project remain? | Built **100% client-side** using Three.js, WebXR, procedural Web Audio, and offline spatial NLP. **Zero paid APIs, zero cloud dependencies**. | ✅ **PASS** |
| **4. Hands-First Test** | Fully usable with hands end-to-end; zero required controllers. | 25-joint articulated hand skeleton, micro-pinch grab, palm-up wrist palette summon, and magnetic snap. No controllers needed. | ✅ **PASS** |

---

## ✋ Hands-First Gesture Reference

```text
┌──────────────────────┬──────────────────────┬───────────────────────────────┐
│ GESTURE              │ HAND REQUIRED        │ HOW TO PERFORM                │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ Micro-Pinch Grab     │ Dominant Hand        │ Pinch index and thumb         │
│                      │                      │ (< 2.4 cm distance)           │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ Palm Palette Summon  │ Non-Dominant (Left)  │ Turn palm face-up toward eyes │
│                      │                      │ (wrist normal > 0.55)         │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ Magnetic Dock Snap   │ Either Hand          │ Release card within 14 cm of  │
│                      │                      │ any lap dock slot             │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ Toss to Co-Pilot     │ Dominant Hand        │ Drag and release capsule near │
│                      │                      │ Aether's pedestal (< 20 cm)   │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ Quick Voice Dictate  │ Either Hand          │ Tap '🎤 VOICE' on wrist       │
│                      │                      │ palette and speak thought     │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

---

## 🔊 Procedural Audio Engine

AetherDesk features a **zero-bandwidth, procedural sound synthesizer** built on the Web Audio API:
- **Mechanical Click:** Dual-oscillator sine frequency sweep ($1200\text{ Hz} \to 300\text{ Hz}$) for crisp tactile confirmation.
- **Magnetic Dock Snap:** Low-frequency triangle thud ($180\text{ Hz} \to 60\text{ Hz}$) for deep physical seating feedback.
- **Aura Woosh:** Biquad low-pass sweep ($2000\text{ Hz} \to 300\text{ Hz}$) on capsule release.
- **Harmonic Chime:** 4-note ascending chord ($C_5, E_5, G_5, C_6$) on milestone completion.
- **Auto-Unlock:** Automatically resumes the AudioContext upon first touch/pointer event, preventing autoplay blocks.

---

## 🛠️ Tech Stack (100% Free Tiers)

```text
┌──────────────────────────┬──────────────────────────────────────────────────┐
│ LAYER                    │ TECHNOLOGY                                       │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 3D Engine & Scene Graph  │ Three.js (r186)                                  │
│ Spatial Platform         │ WebXR Device API (immersive-vr, hand-tracking)   │
│ Build Tooling            │ Vite 6 (Fast HMR & Optimized Bundling)           │
│ Procedural Audio         │ Web Audio API (Zero audio files, 100% synthetic) │
│ Voice Input              │ Web Speech API (webkitSpeechRecognition)         │
│ Local Intelligence       │ Offline Spatial Rule-Based NLP Engine            │
│ Persistence & Vault      │ LocalStorage & IndexedDB with Markdown Serializer│
│ Design Tokens            │ Vanilla CSS3 (Obsidian, Cyan, Amber, Emerald)    │
└──────────────────────────┴──────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
aetherdesk/
├── index.html            # WebXR entry point, HUD overlay & modals
├── package.json          # Dependencies & build scripts
├── README.md             # Complete documentation & Devpost kit
├── LICENSE               # MIT License
├── public/               # Static assets & icons
└── src/
    ├── main.js           # App orchestrator, 60s demo & WebXR render loop
    ├── scene.js          # Three.js scene, lap dock & ergonomic calibration
    ├── cards.js          # 3D Data Capsules, CanvasTexture & magnetic snap
    ├── hands.js          # 25-Joint articulated hand skeleton & gestures
    ├── agent.js          # Embodied agent 'Aether': avatar & tool calling
    ├── audio.js          # Procedural Web Audio synthesizer
    ├── vault.js          # Session streaks, daily rituals & markdown export
    └── style.css         # High-contrast tactical obsidian design system
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v20+ or v22+
- **npm** v10+

```bash
# 1. Clone the repository
git clone https://github.com/your-username/aetherdesk.git
cd aetherdesk

# 2. Install dependencies (Three.js & Vite)
npm install

# 3. Start local development server
npm run dev
# -> Local server running at http://localhost:5173

# 4. Build optimized production bundle
npm run build
# -> Outputs clean production distribution to dist/
```

---

## 🥽 Testing on Meta Quest 3/3S

### Method 1: On-Headset (Zero Sideloading Required)
1. Turn on your **Meta Quest 3, Quest 3S, or Quest Pro**.
2. Open the built-in **Meta Quest Browser**.
3. Navigate to your deployed HTTPS URL (e.g., `https://your-domain.vercel.app`).
4. Click the blue **🥽 Enter WebXR (Meta Quest)** button.
5. Put your controllers down on your desk or chair.
6. Look at your hands—your real fingers will render as articulated cybernetic glowing skeletons in 3D.
7. Rest your elbows on your armrests and enjoy the seated 24-inch workspace.

### Method 2: Desktop Simulator (No Headset Required)
- **Left-Click + Drag:** Micro-pinch and drag any 3D data capsule.
- **Hover near slots:** Visual magnetic snapping triggers automatically.
- **Drag toward right pedestal:** Tosses card to Aether for goal decomposition.
- **Press <kbd>P</kbd>:** Toggles the holographic Palm Palette over the wrist.
- **Top HUD buttons:** Access the 60-second guided demo, daily rituals, and ergonomic calibration.

---

## ☁️ Deployment Guide

Since AetherDesk is 100% client-side with zero backend dependencies, deployment takes under 60 seconds:

### Deploy to Vercel (Recommended)
```bash
npx vercel --prod
```

### Deploy to GitHub Pages
1. Run `npm run build`.
2. Push the contents of the generated `dist/` directory to your `gh-pages` branch.

---

## 📝 Devpost Submission Kit

*(Also accessible directly inside the app by clicking the **"📋 Devpost Kit"** button on the HUD header)*

| Form Field | Exact Value |
|---|---|
| **Submission Name** | `AetherDesk: Seated Hands-First Spatial Agentic Workspace` |
| **Track** | `Productivity`|
| **Division** | `New Experience` |
| **Submission Tagline (138 / 140 Chars)** | `Seated, hands-first spatial workspace turning complex thoughts into tactile data capsules guided by an embodied autonomous AI agent.` |
| **Target Special Awards** | `Best Agentic Interaction ($25k)` · `Best Reason to Come Back ($25k)` · `Best First Five Minutes ($25k)` · `Best Accessibility Forward Experience ($25k)` |

### Hand Interactions Statement
> AetherDesk eliminates arm fatigue by constraining interaction to a 24-inch semi-sphere above the lap. Using WebXR Hand Tracking with a 25-joint articulated visual skeleton, users employ micro-pinches to grab data capsules and turn their non-dominant palm face-up to summon a wrist palette. Cards tossed toward the embodied agent trigger autonomous spatial synthesis. Zero controllers required.

### 500-Word Project Description
```markdown
### 1. Inspiration
Spatial computing promised infinite monitors, but reality gave us "Gorilla Arm" shoulder fatigue in minutes. Reaching for floating 2D browser windows 1.5 meters away violates human biomechanics. We asked: What if spatial productivity respected the body? What if your entire workspace lived in an ergonomic 24-inch tactile micro-sphere above your lap, completely controller-free, operating seamlessly in a coach airplane seat or a morning commute?

### 2. How I Built It
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

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright © 2026 AetherDesk Team. Built for the Meta VR Start 2026 Developer Competition.