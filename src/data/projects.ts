/**
 * Portfolio content lives here as data, decoupled from presentation.
 * Replace placeholders with real content. Each project can be rendered in
 * the 3D world (rooms / islands) OR the 2D grid fallback from the same source.
 */

export type ProjectLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Project {
  id: string;
  title: string;
  level: ProjectLevel;
  /** Year shown on the card / modal. */
  year: number;
  /** Your role on the project. */
  role: string;
  /** One-line hook shown in the grid / room label. */
  tagline: string;
  /** Longer description for the modal. */
  description: string;
  tools: string[];
  features: string[];
  /** Optional media. Put compressed assets in /public. */
  thumbnail?: string;
  model?: string; // path to a .glb for the 3D room
  /** Solfeggio frequency (Hz) used for ambient audio in this project's room. */
  ambientHz?: number;
  links?: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    id: 'ar-business-card',
    title: 'AR Virtual Business Card',
    level: 'beginner',
    year: 2024, // EXAMPLE
    role: 'Solo · Design & Dev', // EXAMPLE
    tagline: 'สแกนนามบัตร แล้วตัวตนดิจิทัลปรากฏขึ้น',
    description:
      'นามบัตรที่มีชีวิต — สแกนภาพ high-contrast เพื่อแสดงไอคอน 3D และวิดีโอแนะนำตัวที่ตอบสนองการสัมผัส ' +
      'ออกแบบ marker ให้คอนทราสต์สูงเพื่อ tracking ที่เสถียรแม้แสงน้อย', // EXAMPLE
    tools: ['Unity 3D', 'Vuforia Engine', 'C#'],
    features: [
      'High-contrast image tracking เพื่อความแม่นยำ',
      'ไอคอน 3D ลอยเหนือนามบัตร',
      'วิดีโอแนะนำตัวแบบ interactive',
    ],
    thumbnail: '/projects/ar-business-card.jpg', // EXAMPLE — วางไฟล์ใน public/projects/
    ambientHz: 528,
    links: [
      { label: 'Case study', url: 'https://example.com/ar-card' }, // EXAMPLE
    ],
  },
  {
    id: 'anatomy-visualizer',
    title: 'Interactive Human Anatomy Visualizer',
    level: 'intermediate',
    year: 2025, // EXAMPLE
    role: 'Lead Developer', // EXAMPLE
    tagline: 'ปอก layer ร่างกายทีละชั้น Skin → Muscle → Bone',
    description:
      'โมเดลร่างกายมนุษย์ที่ปรับความโปร่งใสของแต่ละเลเยอร์ได้ ใช้ raycasting เลือกอวัยวะเพื่อดูข้อมูลเชิงลึก ' +
      'พัฒนาเป็นสื่อการสอนสำหรับนักศึกษาแพทย์', // EXAMPLE
    tools: ['RealityKit', 'Swift', 'Raycasting'],
    features: [
      'ปรับ opacity ทีละเลเยอร์ (Skin > Muscle > Bone)',
      'Raycasting เลือกอวัยวะ',
      'แสดงข้อมูลเชิงลึกแบบ contextual',
    ],
    thumbnail: '/projects/anatomy.jpg', // EXAMPLE
    ambientHz: 639,
    links: [
      { label: 'Demo video', url: 'https://example.com/anatomy' }, // EXAMPLE
    ],
  },
  {
    id: 'generative-ar-avatar',
    title: 'AI-Powered Generative AR Avatar',
    level: 'advanced',
    year: 2026, // EXAMPLE
    role: 'Creative Technologist', // EXAMPLE
    tagline: 'คุยกับอวตาร AR ที่ขยับปากตามเสียง AI แบบเรียลไทม์',
    description:
      'ตัวละครเสมือนใน AR ใช้ PBR shaders เพื่อความสมจริงของวัสดุ พร้อม lip-sync ที่สัมพันธ์กับเสียงจาก GPT-4 + ElevenLabs ' +
      'ผู้ชมพูดคุยได้จริงแบบ real-time พร้อมการตอบสนองทางสีหน้า', // EXAMPLE
    tools: ['OpenAI GPT-4', 'ElevenLabs', 'Lipsync API', 'PBR Shaders'],
    features: [
      'สนทนากับอวตารแบบ real-time',
      'PBR materials (โลหะ/แก้ว/ผิว)',
      'Lip-sync ตามเสียง AI',
    ],
    thumbnail: '/projects/avatar.jpg', // EXAMPLE
    ambientHz: 852,
    links: [
      { label: 'Live demo', url: 'https://example.com/avatar' }, // EXAMPLE
      { label: 'Source', url: 'https://github.com/your-handle/ar-avatar' }, // EXAMPLE
    ],
  },
];

export const projectsById = Object.fromEntries(
  projects.map((p) => [p.id, p]),
) as Record<string, Project>;
