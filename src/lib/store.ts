import { create } from 'zustand';
import type { Capabilities, FidelityTier } from './capabilities';

interface AppState {
  /** null until capability detection finishes. */
  capabilities: Capabilities | null;
  /** Effective tier (may be downgraded at runtime, e.g. on perf drops). */
  tier: FidelityTier;
  /** Whether the user has interacted yet (gate for audio per browser policy). */
  hasUserGesture: boolean;
  audioEnabled: boolean;
  /** Currently open project modal, or null. */
  activeProjectId: string | null;
  /** Currently open game modal, or null. */
  activeGameId: string | null;
  /** Section the visitor is currently viewing (drives the elevator panel). */
  activeSection: string;

  setCapabilities: (caps: Capabilities) => void;
  setTier: (tier: FidelityTier) => void;
  markUserGesture: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  openGame: (id: string) => void;
  closeGame: () => void;
  setActiveSection: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  capabilities: null,
  tier: 'basic',
  hasUserGesture: false,
  audioEnabled: false,
  activeProjectId: null,
  activeGameId: null,
  activeSection: 'hero',

  setCapabilities: (caps) => set({ capabilities: caps, tier: caps.tier }),
  setTier: (tier) => set({ tier }),
  markUserGesture: () => set({ hasUserGesture: true }),
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  openProject: (id) => set({ activeProjectId: id }),
  closeProject: () => set({ activeProjectId: null }),
  openGame: (id) => set({ activeGameId: id }),
  closeGame: () => set({ activeGameId: null }),
  setActiveSection: (id) => set({ activeSection: id }),
}));
