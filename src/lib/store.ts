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

  setCapabilities: (caps: Capabilities) => void;
  setTier: (tier: FidelityTier) => void;
  markUserGesture: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  capabilities: null,
  tier: 'basic',
  hasUserGesture: false,
  audioEnabled: false,
  activeProjectId: null,

  setCapabilities: (caps) => set({ capabilities: caps, tier: caps.tier }),
  setTier: (tier) => set({ tier }),
  markUserGesture: () => set({ hasUserGesture: true }),
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  openProject: (id) => set({ activeProjectId: id }),
  closeProject: () => set({ activeProjectId: null }),
}));
