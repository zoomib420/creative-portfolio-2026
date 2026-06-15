/**
 * Floor directory — the single source of truth for the elevator metaphor.
 * The elevator nav, the 3D shaft (ElevatorScene) and the 2D directory all read
 * from here, so adding or reordering a floor happens in exactly one place.
 *
 * `id` matches the DOM section id (so smooth-scroll + ScrollTrigger waypoints
 * line up) and the value stored in `activeSection`. `ready: false` keeps a
 * floor out of the nav while its section is still being built (none right now).
 */

export interface Floor {
  /** Stable key — also the DOM section id and the `activeSection` value. */
  id: string;
  /** Elevator button label (the "floor number"). */
  n: string;
  /** Display name. */
  label: string;
  /** Accent colour for this floor (from the cozy token palette). */
  accent: string;
  /** Vertical index in the shaft (0 = ground). Drives the 3D ride height. */
  level: number;
  /** Shown in the elevator nav. false = scaffolded for a later phase. */
  ready: boolean;
  /** Short blurb shown on the building front (click "เข้าไปดู" to open the room). */
  teaser?: string;
}

export const floors: Floor[] = [
  { id: 'hero', n: 'L', label: 'Lobby', accent: '#ffd479', level: 0, ready: true },
  {
    id: 'about',
    n: '1',
    label: 'เกี่ยวกับผม',
    accent: '#56c2b0',
    level: 1,
    ready: true,
    teaser: 'ซูม — สายมนุษยศาสตร์ที่เลี้ยวมาสร้างของด้วย AI',
  },
  {
    id: 'work',
    n: '2',
    label: 'ผลงาน',
    accent: '#ff9a62',
    level: 2,
    ready: true,
    teaser: 'Automation · เว็บไซต์ · แอป · เกม',
  },
  {
    id: 'tech',
    n: '3',
    label: 'เทค & เครื่องมือ',
    accent: '#c7a6e6',
    level: 3,
    ready: true,
    teaser: 'สแต็ก/เครื่องมือที่ใช้ + แวะเล่นเกมตรงนี้',
  },
  {
    id: 'contact',
    n: '4',
    label: 'ติดต่อ',
    accent: '#7fd093',
    level: 4,
    ready: true,
    teaser: 'อยากคุยหรือจ้างงาน ทักมาได้เลย',
  },
  {
    id: 'thanks',
    n: '5',
    label: 'ขอบคุณ',
    accent: '#f4a3c0',
    level: 5,
    ready: true,
    teaser: 'ขอบคุณที่แวะเข้ามาชม',
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
