// Persistent Vault & Session Sync Engine
const STORAGE_KEY = 'aetherdesk_vault_v1';

const DEFAULT_CARDS = [
  {
    id: 'card-1',
    title: 'Meta VR Start Submission Plan',
    type: 'task',
    priority: 'HIGH',
    content: 'Finalize seated 24-inch lap dock ergonomics, record 3-min video, and submit to Devpost before deadline.',
    tags: ['Hackathon', 'Devpost', 'VRStart2026'],
    status: 'active',
    slotIndex: 0
  },
  {
    id: 'card-2',
    title: 'Airplane Seat Ergonomics Test',
    type: 'note',
    priority: 'HIGH',
    content: 'Verify all gestures operate within a 2-foot radius with zero reaching or arm fatigue. Elbows resting comfortably.',
    tags: ['UX', 'Ergonomics', 'MicroGestures'],
    status: 'active',
    slotIndex: 1
  },
  {
    id: 'card-3',
    title: 'Agentic Tool Synthesis Architecture',
    type: 'idea',
    priority: 'MEDIUM',
    content: 'Enable Aether to autonomously cluster research cards, synthesize executive briefs, and execute spatial layout actions.',
    tags: ['AI', 'Agentic', 'SpatialNLP'],
    status: 'active',
    slotIndex: 2
  },
  {
    id: 'card-4',
    title: 'Executive Brief: AetherDesk Launch',
    type: 'brief',
    priority: 'HIGH',
    content: 'Revolutionary hands-first spatial workspace designed specifically for seated productivity and zero-controller VR.',
    tags: ['Overview', 'MetaQuest', 'Productivity'],
    status: 'docked',
    slotIndex: 3
  }
];

export class VaultManager {
  constructor() {
    this.data = this.load();
    this.checkAndUpdateStreak();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.cards && parsed.cards.length > 0) {
          return {
            ...parsed,
            sessionStreak: parsed.sessionStreak || 1,
            totalSessions: parsed.totalSessions || 1,
            lastSessionDate: parsed.lastSessionDate || new Date().toISOString().split('T')[0]
          };
        }
      }
    } catch (e) {
      console.warn('Could not load from localStorage, using defaults', e);
    }
    return {
      version: 1,
      lastModified: new Date().toISOString(),
      sessionStreak: 1,
      totalSessions: 1,
      lastSessionDate: new Date().toISOString().split('T')[0],
      cards: [...DEFAULT_CARDS],
      agentLog: ['Workspace initialized in seated 24-inch lap configuration.']
    };
  }

  checkAndUpdateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.data.lastSessionDate !== today) {
      const lastDate = new Date(this.data.lastSessionDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.data.sessionStreak = (this.data.sessionStreak || 0) + 1;
      } else if (diffDays > 1) {
        this.data.sessionStreak = 1;
      }
      this.data.totalSessions = (this.data.totalSessions || 0) + 1;
      this.data.lastSessionDate = today;
      this.save(this.data.cards, this.data.agentLog);
    }
  }

  getRitualPreset(type) {
    if (type === 'morning') {
      return [
        {
          id: 'ritual-m1',
          title: '🌅 Morning Triage: Top 3 Priorities',
          type: 'task',
          priority: 'HIGH',
          content: 'Clear mental clutter. Allocate top tasks to lap dock slots for 10-minute commute planning.',
          tags: ['MorningTriage', 'Focus', 'Habit'],
          status: 'active',
          slotIndex: 0
        },
        {
          id: 'ritual-m2',
          title: 'Key Stakeholder Review',
          type: 'note',
          priority: 'MEDIUM',
          content: 'Ensure all hand interactions remain under 2.4cm pinch distance for effortless operation.',
          tags: ['UX', 'Review'],
          status: 'active',
          slotIndex: 1
        },
        {
          id: 'ritual-m3',
          title: 'Daily Breakthrough Opportunity',
          type: 'idea',
          priority: 'MEDIUM',
          content: 'Explore combining hands-free voice notes with Aether spatial card clustering.',
          tags: ['Innovation'],
          status: 'active',
          slotIndex: 2
        }
      ];
    } else if (type === 'sprint') {
      return [
        {
          id: 'ritual-s1',
          title: '⚡ Deep Focus Sprint (15-Min)',
          type: 'task',
          priority: 'CRITICAL',
          content: 'Single-tasking envelope. All other cards dimmed. Seated elbows resting on armrest.',
          tags: ['DeepSprint', 'Focus', 'Ergonomics'],
          status: 'active',
          slotIndex: 1
        },
        {
          id: 'ritual-s2',
          title: 'Immediate Action Checkpoint',
          type: 'note',
          priority: 'HIGH',
          content: 'Test spatial tool calling with Aether before time expires.',
          tags: ['Execution'],
          status: 'active',
          slotIndex: 2
        }
      ];
    } else if (type === 'evening') {
      return [
        {
          id: 'ritual-e1',
          title: '🌙 Evening Wind-Down & Review',
          type: 'task',
          priority: 'MEDIUM',
          content: 'Review active capsules. Clear completed items and trigger Executive Synthesis.',
          tags: ['EveningReview', 'WindDown'],
          status: 'active',
          slotIndex: 0
        },
        {
          id: 'ritual-e2',
          title: 'Executive Session Rollup',
          type: 'brief',
          priority: 'HIGH',
          content: 'Daily retention loop complete. Syncing markdown vault to Obsidian/Notion.',
          tags: ['Synthesis', 'VaultSync'],
          status: 'docked',
          slotIndex: 3
        }
      ];
    }
    return [...DEFAULT_CARDS];
  }

  save(cards, agentLog = []) {
    try {
      this.data = {
        version: 1,
        lastModified: new Date().toISOString(),
        sessionStreak: this.data?.sessionStreak || 1,
        totalSessions: this.data?.totalSessions || 1,
        lastSessionDate: this.data?.lastSessionDate || new Date().toISOString().split('T')[0],
        cards: cards,
        agentLog: agentLog.length > 0 ? agentLog.slice(-15) : (this.data?.agentLog || [])
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = {
      version: 1,
      lastModified: new Date().toISOString(),
      sessionStreak: 1,
      totalSessions: 1,
      lastSessionDate: new Date().toISOString().split('T')[0],
      cards: [...DEFAULT_CARDS],
      agentLog: ['Workspace reset to pristine competition state.']
    };
    return this.data.cards;
  }

  exportMarkdown(cards, agentSummary = '', agentLogs = []) {
    const timestamp = new Date().toLocaleString();
    let md = `# 🌌 AetherDesk Spatial Session Export\n\n`;
    md += `> **Platform:** Meta VR Start 2026 Developer Competition  \n`;
    md += `> **Track:** Productivity • **Focus:** Seated Hands-First Micro-Gestures  \n`;
    md += `> **Export Timestamp:** ${timestamp}  \n`;
    md += `> **Ergonomic Envelope:** Seated 24-inch Lap Arc (0.6m Radius)  \n\n`;

    md += `## 🤖 Embodied Agent Synthesis (Aether)\n`;
    md += agentSummary
      ? `> ${agentSummary}\n\n`
      : `> Autonomous spatial co-pilot observed and coordinated tactile data capsules across 4 ergonomic lap slots.\n\n`;

    if (agentLogs && agentLogs.length > 0) {
      md += `### 📡 Agent Telemetry Log\n`;
      agentLogs.slice(-6).forEach((log) => {
        md += `- \`${log}\`\n`;
      });
      md += `\n`;
    }

    md += `## 🎯 Actionable Tasks\n`;
    const tasks = cards.filter((c) => c.type === 'task');
    if (tasks.length === 0) md += `*No active tasks in session.*\n\n`;
    tasks.forEach((card) => {
      md += `- [ ] **${card.title}** \`[${card.priority || 'NORMAL'}]\` (Slot ${card.slotIndex})\n`;
      md += `  - ${card.content}\n`;
      if (card.tags?.length) md += `  - *Tags:* ${card.tags.map((t) => '#' + t).join(' ')}\n`;
    });
    md += `\n`;

    md += `## 💡 Emergent Ideas & Concepts\n`;
    const ideas = cards.filter((c) => c.type === 'idea');
    if (ideas.length === 0) md += `*No ideas recorded in session.*\n\n`;
    ideas.forEach((card) => {
      md += `### 💡 ${card.title}\n`;
      md += `${card.content}\n\n`;
      if (card.tags?.length) md += `*Tags:* ${card.tags.map((t) => '#' + t).join(' ')}\n\n`;
    });

    md += `## 📝 Spatial Research & Notes\n`;
    const notes = cards.filter((c) => c.type === 'note');
    if (notes.length === 0) md += `*No notes recorded in session.*\n\n`;
    notes.forEach((card) => {
      md += `### 📝 ${card.title}\n`;
      md += `${card.content}\n\n`;
      if (card.tags?.length) md += `*Tags:* ${card.tags.map((t) => '#' + t).join(' ')}\n\n`;
    });

    md += `## 📋 Executive Briefs\n`;
    const briefs = cards.filter((c) => c.type === 'brief');
    briefs.forEach((card) => {
      md += `### 📋 ${card.title}\n`;
      md += `${card.content}\n\n`;
    });

    md += `---\n`;
    md += `*Exported from AetherDesk Spatial Workspace — Ready for Obsidian, Notion, or Local Archives.*\n`;
    return md;
  }
}

export const vault = new VaultManager();
