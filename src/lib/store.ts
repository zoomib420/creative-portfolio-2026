import { create } from 'zustand';
import type { Capabilities, FidelityTier } from './capabilities';

interface AppState {
  /** null until capability detection finishes. */
  capabilities: Capabilities | null;
  /** Effective tier (may be downgraded at runtime, e.g. on perf drops). */
  tier: FidelityTier;
  /** True if the user manually toggled the tier, bypassing auto-capability checks. */
  manualTierOverride: boolean;
  /** Selected language for the UI and content */
  language: 'th' | 'en';
  /** Whether the user has interacted yet (gate for audio per browser policy). */
  hasUserGesture: boolean;
  audioEnabled: boolean;
  /** Currently open project modal, or null. */
  activeProjectId: string | null;
  /** Currently open game modal, or null. */
  activeGameId: string | null;
  /** Section the visitor is currently viewing (drives the elevator panel). */
  activeSection: string;
  /** Floor the camera has zoomed INTO (entered), or null. Objects become clickable. */
  focusedFloor: string | null;
  /** Floor whose content panel is open (opened by clicking an object), or null. */
  roomPanel: string | null;
  /** Whether the elevator navigation panel is open. */
  isNavPanelOpen: boolean;

  setCapabilities: (caps: Capabilities) => void;
  setTier: (tier: FidelityTier, manual?: boolean) => void;
  setLanguage: (lang: 'th' | 'en') => void;
  markUserGesture: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  openGame: (id: string) => void;
  closeGame: () => void;
  setActiveSection: (id: string) => void;
  openFloor: (id: string) => void;
  closeFloor: () => void;
  openRoomPanel: (id: string) => void;
  closeRoomPanel: () => void;
  setNavPanelOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  capabilities: null,
  tier: 'basic',
  manualTierOverride: false,
  language: 'th',
  hasUserGesture: false,
  audioEnabled: false,
  activeProjectId: null,
  activeGameId: null,
  activeSection: 'hero',
  focusedFloor: null,
  roomPanel: null,
  isNavPanelOpen: false,

  setCapabilities: (caps) => set((state) => {
    // If the user already manually picked a tier, don't overwrite it with capability check
    if (state.manualTierOverride) return { capabilities: caps };
    return { capabilities: caps, tier: caps.tier };
  }),
  setTier: (tier, manual = false) => set((state) => ({ 
    tier, 
    manualTierOverride: manual ? true : state.manualTierOverride 
  })),
  setLanguage: (lang) => set({ language: lang }),
  markUserGesture: () => set({ hasUserGesture: true }),
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  openProject: (id) => set({ activeProjectId: id }),
  closeProject: () => set({ activeProjectId: null }),
  openGame: (id) => set({ activeGameId: id }),
  closeGame: () => set({ activeGameId: null }),
  setActiveSection: (id) => set({ activeSection: id }),
  openFloor: (id) => set({ focusedFloor: id }),
  closeFloor: () => set({ focusedFloor: null, roomPanel: null }),
  openRoomPanel: (id) => set({ focusedFloor: id, roomPanel: id }),
  closeRoomPanel: () => set({ roomPanel: null }),
  setNavPanelOpen: (open) => set({ isNavPanelOpen: open }),
}));
