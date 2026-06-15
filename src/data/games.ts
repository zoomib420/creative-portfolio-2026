import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Props every mini-game accepts (the modal passes an exit handler). */
export interface GameProps {
  onExit?: () => void;
}

export interface GameMeta {
  id: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail?: string;
  keyboard: boolean;
  reducedMotionOk: boolean;
  component: LazyExoticComponent<ComponentType<GameProps>>;
}

export const games: GameMeta[] = [
  {
    id: 'rooster-run',
    title: 'Rooster Run',
    tagline: 'ช่วยไก่ Super Rooster วิ่งหลบสิ่งกีดขวาง!',
    description: 'Endless runner game เล่นง่ายๆ ใช้ Spacebar กระโดด หรือลูกศรลงเพื่อก้มหลบ',
    keyboard: true,
    reducedMotionOk: false,
    component: lazy(() => import('../components/games/RoosterRun')),
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    tagline: 'ทดสอบความจำ จับคู่เครื่องมือที่ผมใช้',
    description: 'เกมจับคู่การ์ด 8 คู่ แข่งกับเวลาและจำนวนครั้งในการเปิด',
    keyboard: true,
    reducedMotionOk: true,
    component: lazy(() => import('../components/games/MemoryMatch')),
  },
];

export const gamesById = Object.fromEntries(
  games.map((g) => [g.id, g])
) as Record<string, GameMeta>;
