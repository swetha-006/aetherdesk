AetherDesk: Seated Hands-First Spatial Agentic Workspace
Meta VR Start 2026
Track: Productivity
Special: Agentic Interaction
WebXR Hand Tracking
License: MIT

Submission for Meta VR Start Developer Competition 2026
Tagline: The seated, hands-first spatial workspace. Turn complex thoughts into tactile data capsules coordinated by an embodied autonomous AI agent.
Live WebXR Demo: AetherDesk Studio

📖 Table of Contents
Executive Overview & Vision
The Core Problem: Why Spatial Productivity Fails Today
The Solution: AetherDesk Spatial Engine
Compliance with Meta's 4 Core Heuristic Tests
Hands-First Micro-Gesture Architecture
Embodied Spatial Agent: 'Aether' ($25,000 Award Focus)
The First 5 Minutes & Daily Retention Loop
System Architecture & Technology Stack
Project Directory Layout
Local Development & Deployment Guide
Testing on Meta Quest Headsets
Official Devpost Submission Kit
License
🌟 Executive Overview & Vision
AetherDesk is an ergonomics-first, seated spatial productivity environment built exclusively for hands-first interaction on Meta Quest 3, Meta Quest 3S, and Meta VR Glasses.

Instead of forcing users to reach out to giant floating 2D browser windows—a paradigm that induces severe shoulder fatigue ("Gorilla Arm") within minutes—AetherDesk concentrates high-utility productivity into a seated 24-inch tactile micro-sphere directly in front of the user's lap and chest.

Within this physical envelope, users manipulate tangible, lightweight Data Capsules, dynamic Spatial Slates, and interact with Aether, an embodied, multimodal spatial co-pilot. Aether observes spatial context (gaze, card proximity, clustering) and autonomously plans, organizes, and synthesizes work without requiring typing or controller manipulation.

code


┌────────────────────────────────────────────────────────────────────────┐
│                      AETHERDESK SEATED 24" ENVELOPE                    │
│                                                                        │
│               [   HMD / User Seated Eye Level   ]                      │
│                                  │                                     │
│                     (24" / 0.6m Radius Semi-Sphere)                    │
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
│          Elbows Rest Naturally on Armrests / Lap • Zero Fatigue        │
└────────────────────────────────────────────────────────────────────────┘
🚨 The Core Problem: Why Spatial Productivity Fails Today
Current spatial computing productivity applications suffer from three critical architectural flaws:

The "Gorilla Arm" Fatigue Epidemic:
Most apps duplicate 2D monitors floating 1.5 meters away in mid-air. Interacting with them requires reaching out continuously. Human shoulder anatomy cannot sustain outstretched arm elevation for more than 3 to 5 minutes without trapezius exhaustion.
The "Flat Screen in 3D Space" Waste:
Placing flat 2D browser windows inside a 6DoF stereoscopic headset squanders the power of spatial computing. True spatial computing requires tangible depth, micro-manipulation, and spatial memory (locational indexing).
The Passive Chatbot Paradigm:
Current AI in VR is merely a ChatGPT sidebar floating in a webview. It has no physical embodiment, has zero awareness of what the user is touching or looking at, and cannot manipulate 3D objects in the room.
💡 The Solution: AetherDesk Spatial Engine
AetherDesk addresses these failures with three foundational paradigms:

The Seated 24-Inch Lap Desk: Keeps all interactive surfaces within an ergonomic semi-sphere directly above the user's lap (0.35m to 0.55m radius). Elbows can rest on armrests or chair trays while hands manipulate UI elements via micro-pinches.
Tangible 3D Data Capsules: Information is embodied as tactile physical cards (Tasks, Notes, Ideas, Executive Briefs) that snap into magnetic slots, group, stack, and respond with procedural mechanical sound synthesis.
Embodied Autonomous Co-Pilot ("Aether"): A dedicated 3D particle avatar hovering on a console pedestal that perceives spatial context, executes autonomous spatial tool calling, and reorganizes your cards in real-time.



🎯 Compliance with Meta's 4 Core Heuristic Tests


Meta Filter Test	Hackathon Requirement	How AetherDesk Complies & Scores 10/10
1. The Airplane Seat Test	Experience must be stationary, seated, and operable within a 2-foot radius with zero large physical swings.	Built strictly inside a 24-inch semi-sphere above the lap. Elbows rest comfortably on armrests; all operations use micro-pinches and wrist tilts.
2. The One Bus Stop Test	Fast cold start; delivers tangible value or satisfaction in under 10 minutes.	Cold start is under 4 seconds. The user can dictate a thought, have Aether organize it, and export a clean project brief in under 90 seconds.
3. The Take-It-Away Test	Must be entrant-built; if external third-party AI is removed, the project must remain an engaging, standalone product.	100% of spatial card physics, magnetic docking, sound synthesis, and local note organization work offline without any API keys.
4. The Hands-First Mandate	Complete experience operable end-to-end with natural hands; zero controllers required.	Fully implements the WebXR Hand Tracking API (25 joints/hand, pinch detection, palm-up radial summoning) with mouse fallback.
✋ Hands-First Micro-Gesture Architecture
AetherDesk is engineered for zero-controller interaction:

1. Micro-Pinch Grab (Index + Thumb):
Detects when index-finger-tip and thumb-tip distance drops below 2.4 cm. Grabs and drags any capsule along an ergonomic view-plane.
2. The Palm Summon (Non-Dominant Hand):
When the left palm turns face-up toward the headset, a glowing radial Palette Ring spawns over the wrist with 4 instant tool buttons (+ Task, + Note, + Idea, 🎤 Voice).
3. Magnetic Dock Snapping:
Releasing a capsule within proximity of any of the curved tray slots triggers a spring-damper lerp and plays a deep magnetic snap sound.
4. Contextual Throw to Agent:
Dragging and releasing any capsule toward Aether's pedestal assigns the task to the agent, triggering autonomous goal decomposition or research expansion.
🤖 Embodied Spatial Agent: 'Aether' ($25,000 Award Focus)
Meta established a dedicated $25,000 prize for Best Agentic Interaction. AetherDesk targets this directly by implementing true spatial agency, not a chatbot text prompt:

code


┌────────────────────────────────────────────────────────────────────────┐
│                      AETHER AGENT STATE MACHINE                        │
├───────────────┬────────────────────────────────────────────────────────┤
│ State         │ Behavior & Spatial Visual Feedback                     │
├───────────────┼────────────────────────────────────────────────────────┤
│ IDLE          │ Soft rhythmic breathing pulse; slow gyroscopic rings   │
│               │ rotating at base frequency. Core: Electric Cyan.       │
├───────────────┼────────────────────────────────────────────────────────┤
│ OBSERVING     │ Gyro rings accelerate; avatar tilts toward the capsule  │
│               │ held by the user or focused by user gaze.              │
├───────────────┼────────────────────────────────────────────────────────┤
│ THINKING      │ High-speed counter-rotational spin; core shifts to     │
│               │ Cyber Amber; harmonic resonant audio pulse fires.      │
├───────────────┼────────────────────────────────────────────────────────┤
│ ACTUATING     │ Core shifts to Emerald Green; fires spatial tool       │
│               │ calls to physically reposition or spawn 3D cards.      │
└───────────────┴────────────────────────────────────────────────────────┘
Autonomous Spatial Tools:
autonomousAutoOrganize(): Scans all active capsules, sorts them by priority and type, and aligns them into optimal lap dock slots.
autonomousSynthesize(cards): Reads the text content across active cards, extracts key topics, and materializes a new Executive Brief Capsule in Slot 3.
autonomousDecomposeGoal(card): Evaluates a complex goal card tossed to the agent and breaks it into two sequential actionable subtask capsules.
⚡ The First 5 Minutes & Daily Retention Loop
First 5 Minutes Flow ($25,000 Award Criterion)
00:00 - 00:30: Instant load in Meta Quest Browser (<3 seconds). User sees passthrough or obsidian spatial environment with the curved lap dock.
00:30 - 01:15: User pinches index finger and thumb to pick up a pre-loaded card; procedural tactile audio click confirms grab.
01:15 - 02:30: Left hand palm turned face-up spawns the radial Palette Ring. User taps Voice Note or types an idea.
02:30 - 03:45: User drags the card and tosses it toward Aether. Aether's rings spin, chimes sound, and an executive plan is materialized.
03:45 - 05:00: User clicks "Export Session" to download clean Markdown. Judge completes the loop in under 5 minutes with zero arm fatigue.
Daily Retention Loop ($25,000 Award Criterion)
Morning Commute Launchpad: 10-minute rapid triage of daily tasks into 4 ergonomic slots.
Evening Session Export: Export structured notes directly to Obsidian or Notion.
Persistent Vault: Every card position, note edit, and agent log is saved across sessions via IndexedDB and LocalStorage.
🛠️ System Architecture & Technology Stack
Built using 100% free, open-source, zero-cost technologies with no paid API requirements:

3D Graphics & Scene Graph: Three.js (r170+)
Spatial Platform: WebXR Device API (immersive-vr, local-floor, hand-tracking)
Build & Development Tooling: Vite (v6+)
Audio Engine: Web Audio API (100% procedural sound synthesis, zero external WAV/MP3 files)
Voice Recognition: Web Speech API (webkitSpeechRecognition)
Persistence Layer: LocalStorage / IndexedDB with Markdown serialization
Color Palette: High-contrast Obsidian (#090D12), Cyan (#06B6D4), Amber (#F59E0B), and Emerald (#10B981) — Zero purple gradients.
📂 Project Directory Layout
code


aetherdesk/
├── index.html              # Main HTML entry with WebXR HUD and onboarding
├── package.json            # Vite & Three.js dependencies
├── README.md               # Complete project documentation
├── public/                 # Static assets & icons
└── src/
    ├── main.js             # Main application orchestrator & WebXR render loop
    ├── scene.js            # Three.js 3D scene, lighting, 24" curved lap dock
    ├── cards.js            # 3D Data Capsules, CanvasTexture, magnetic snap
    ├── hands.js            # WebXR Hand Tracking (25 joints), palm palette, desktop simulator
    ├── agent.js            # Embodied agent 'Aether', avatar, autonomous tool calling
    ├── audio.js            # Procedural Web Audio API sound synthesizer
    ├── vault.js            # Persistent session storage and Markdown exporter
    └── style.css           # High-contrast obsidian/cyan/amber design system
🚀 Local Development & Deployment Guide
Prerequisites
Node.js v20+ or v22+
npm v10+
1. Clone & Install
bash


git clone https://github.com/your-username/aetherdesk.git
cd aetherdesk
npm install
2. Start Development Server
bash


npm run dev
# Server boots at http://localhost:5173
3. Build for Production
bash


npm run build
# Compiles minified bundle into dist/ directory
4. Deploy to GitHub Pages or Vercel
Deploying to Vercel (single command):

bash


npx vercel --prod
Deploying to GitHub Pages:
Push the contents of the dist/ directory to your gh-pages branch. The app runs completely client-side without any backend server.

🥽 Testing on Meta Quest Headsets
Method A: Single-Click WebXR (Zero Sideloading)
Put on your Meta Quest 3 / Quest 3S / Quest Pro.
Open the built-in Meta Quest Browser.
Navigate to your deployed URL (e.g. https://your-domain.vercel.app or live sandbox URL).
Click the blue "🥽 Enter WebXR (Meta Quest)" button on the top right.
Put your controllers down! Your physical hands will be rendered in 3D.
Rest your elbows on your chair armrests and experience the seated 24-inch workspace.
Method B: Desktop Browser with WebXR Simulator
Open Google Chrome or Microsoft Edge on PC or Mac.
Install the free WebXR API Emulator extension from Chrome Web Store.
Open http://localhost:5173.
Alternatively, use AetherDesk's built-in desktop mouse simulator: left-click to pinch and drag cards, press P to summon the palm palette.
📝 Official Devpost Submission Kit
Submission Title: AetherDesk: Seated Hands-First Spatial Agentic Workspace
Track: Productivity
Division: New Experience
Tagline (138 / 140 chars):
The seated, hands-first spatial workspace. Turn complex thoughts into tactile data capsules coordinated by an embodied autonomous AI agent.
Target Special Awards:
Best Agentic Interaction ($25,000)
Best First Five Minutes ($25,000)
Best Reason to Come Back ($25,000)
Hand Interaction Statement:
AetherDesk eliminates arm fatigue by constraining interaction to a 24-inch semi-sphere above the lap. Using WebXR Hand Tracking, users employ micro-pinches to grab data capsules and turn their non-dominant palm face-up to summon a wrist palette. Cards tossed toward the embodied agent trigger autonomous spatial synthesis.
📄 License
This project is licensed under the MIT License — see the LICENSE file for details.