/**
 * Floor directory — the single source of truth for the elevator metaphor.
 * The elevator nav, the 3D shaft (ElevatorScene) and the 2D directory all read
 * from here, so adding or reordering a floor happens in exactly one place.
 *
 * `id` matches the DOM section id (so smooth-scroll + ScrollTrigger waypoints
 * line up) and the value stored in `activeSection`. `ready: false` keeps a
 * floor out of the nav while its section is still being built (none right now).
 */

import type { LocalizedString } from './profile';

export interface Floor {
  /** Stable key — also the DOM section id and the `activeSection` value. */
  id: string;
  /** Elevator button label (the "floor number"). */
  n: string;
  /** Display name. */
  label: LocalizedString;
  /** Accent colour for this floor (from the cozy token palette). */
  accent: string;
  /** Vertical index in the shaft (0 = ground). Drives the 3D ride height. */
  level: number;
  /** Shown in the elevator nav. false = scaffolded for a later phase. */
  ready: boolean;
  /** Short blurb shown on the building front (click "เข้าไปดู" to open the room). */
  teaser?: LocalizedString;
}

export const floors: Floor[] = [
  { 
    id: 'hero', 
    n: 'L', 
    label: { th: 'ล็อบบี้', en: 'Lobby' }, 
    accent: '#ffd479', 
    level: 0, 
    ready: true 
  },
  {
    id: 'about',
    n: '1',
    label: { th: 'เกี่ยวกับผม', en: 'About Me' },
    accent: '#56c2b0',
    level: 1,
    ready: true,
    teaser: { 
      th: 'ซูม — สายมนุษยศาสตร์ที่เลี้ยวมาสร้างของด้วย AI', 
      en: 'Zoom — Humanities major turned AI Builder' 
    },
  },
  {
    id: 'work',
    n: '2',
    label: { th: 'ผลงาน', en: 'Works' },
    accent: '#ff9a62',
    level: 2,
    ready: true,
    teaser: { 
      th: 'Automation · เว็บไซต์ · แอป · เกม', 
      en: 'Automation · Websites · Apps · Games' 
    },
  },
  {
    id: 'tech',
    n: '3',
    label: { th: 'เทค & เครื่องมือ', en: 'Tech & Tools' },
    accent: '#c7a6e6',
    level: 3,
    ready: true,
    teaser: { 
      th: 'สแต็ก/เครื่องมือที่ใช้ + แวะเล่นเกมตรงนี้', 
      en: 'Tech stack / Tools + Play games here' 
    },
  },
  {
    id: 'contact',
    n: '4',
    label: { th: 'ติดต่อ', en: 'Contact' },
    accent: '#7fd093',
    level: 4,
    ready: true,
    teaser: { 
      th: 'อยากคุยหรือจ้างงาน ทักมาได้เลย', 
      en: 'Let\'s talk or work together' 
    },
  },
  {
    id: 'work-games',
    n: '2',
    label: { th: 'ผลงาน — เกม', en: 'Works — Games' },
    accent: '#ff9a62',
    level: 2,
    ready: false,
  },
  {
    id: 'tech-games',
    n: '3',
    label: { th: 'เลือกเกม', en: 'Pick a Game' },
    accent: '#c7a6e6',
    level: 3,
    ready: false,
  },
  {
    id: 'thanks',
    n: '5',
    label: { th: 'ขอบคุณ', en: 'Thanks' },
    accent: '#f4a3c0',
    level: 5,
    ready: true,
    teaser: { 
      th: 'ขอบคุณที่แวะเข้ามาชม', 
      en: 'Thanks for dropping by' 
    },
  },
];

/** Vertical spacing between floors, in world units (used by ElevatorScene). */
export const FLOOR_SPACING = 1.6;

export const floorsById = Object.fromEntries(floors.map((f) => [f.id, f])) as Record<
  string,
  Floor
>;

/** Floors shown in the elevator nav (have a real section to ride to). */
export const navFloors = floors.filter((f) => f.ready);
