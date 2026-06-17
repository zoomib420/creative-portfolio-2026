import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Props every mini-game accepts (the modal passes an exit handler). */
export interface GameProps {
  onExit?: () => void;
}

import type { LocalizedString } from './profile';

export interface GameMeta {
  id: string;
  title: string;
  tagline: LocalizedString;
  description: LocalizedString;
  thumbnail?: string;
  keyboard: boolean;
  reducedMotionOk: boolean;
  component: LazyExoticComponent<ComponentType<GameProps>>;
}

export const games: GameMeta[] = [
  {
    id: 'rooster-run',
    title: 'Rooster Run',
    tagline: { 
      th: 'ช่วยไก่ Super Rooster วิ่งหลบสิ่งกีดขวาง!', 
      en: 'Help Super Rooster dodge the obstacles!' 
    },
    description: {
      th: 'Endless runner game เล่นง่ายๆ ใช้ Spacebar กระโดด หรือลูกศรลงเพื่อก้มหลบ',
      en: 'An endless runner game. Simple to play: Spacebar to jump, Down Arrow to duck.'
    },
    keyboard: true,
    reducedMotionOk: false,
    component: lazy(() => import('../components/games/RoosterRun')),
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    tagline: {
      th: 'ทดสอบความจำ จับคู่เครื่องมือที่ผมใช้',
      en: 'Test your memory, match the tools I use'
    },
    description: {
      th: 'เกมจับคู่การ์ด 8 คู่ แข่งกับเวลาและจำนวนครั้งในการเปิด',
      en: 'An 8-pair card matching game. Race against time and flip count.'
    },
    keyboard: true,
    reducedMotionOk: true,
    component: lazy(() => import('../components/games/MemoryMatch')),
  },
];

export const gamesById = Object.fromEntries(
  games.map((g) => [g.id, g])
) as Record<string, GameMeta>;
