/**
 * Portfolio content lives here as data, decoupled from presentation.
 * Replace placeholders with real content. Each project can be rendered in
 * the 3D world (rooms / islands) OR the 2D grid fallback from the same source.
 */

import type { LocalizedString } from './profile';

export type ProjectLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProjectCategory = 'automation' | 'website' | 'application' | 'games';

/** Ordered categories used to group the Work section. */
export const projectCategories: { id: ProjectCategory; label: LocalizedString }[] = [
  { id: 'automation', label: { th: 'ระบบอัตโนมัติ (Automation)', en: 'Automation' } },
  { id: 'website', label: { th: 'เว็บไซต์ (Website)', en: 'Website' } },
  { id: 'application', label: { th: 'แอปพลิเคชัน (Application)', en: 'Application' } },
  { id: 'games', label: { th: 'เกม (Games)', en: 'Games' } },
];

export interface Project {
  id: string;
  title: string;
  level: ProjectLevel;
  category: ProjectCategory;
  /** Year shown on the card / modal. */
  year: number;
  /** Your role on the project. */
  role: string;
  /** One-line hook shown in the grid / room label. */
  tagline: LocalizedString;
  /** Longer description for the modal. */
  description: LocalizedString;
  tools: string[];
  features: LocalizedString[];
  /** Optional media. Put compressed assets in /public. */
  thumbnail?: string;
  model?: string; // path to a .glb for the 3D room
  /** Solfeggio frequency (Hz) used for ambient audio in this project's room. */
  ambientHz?: number;
  links?: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    id: 'schedule-automator',
    title: 'Schedule Automator & Classroom Creator',
    level: 'advanced',
    category: 'automation',
    year: 2024,
    role: 'Solo Developer',
    tagline: { 
      th: 'ลดงานสถาบันพัฒนาสมองจากชั่วโมงเหลือไม่กี่คลิก',
      en: 'Reduced brain-training institute workload from hours to clicks'
    },
    description: {
      th: 'โปรแกรมช่วยเหลือสถาบันพัฒนาสมอง ลดงานทำมือโดยโอนข้อมูลจาก ERP ไป Google Sheet ได้อย่างแม่นยำ มีหน้า Preview ก่อนรันจริง มีแดชบอร์ด ระบบล็อค และโปรแกรมสร้าง classroom ใน ERP โดยไม่ต้องมี API (ใช้วิธี reverse engineering)',
      en: 'An assistant program for a brain-training institute. Eliminates manual work by accurately transferring data from ERP to Google Sheets. Includes a pre-run Preview, dashboard, lock system, and an ERP classroom creator built without APIs (using reverse engineering).'
    },
    tools: ['Google Apps Script', 'Chrome Extension', 'Node.js'],
    features: [
      { th: 'Reverse engineering ERP', en: 'Reverse engineering ERP' },
      { th: 'โอนข้อมูลข้ามระบบแบบอัตโนมัติ', en: 'Automated cross-system data transfer' },
      { th: 'แดชบอร์ดสรุปและระบบตรวจสอบก่อนทำงานจริง', en: 'Summary dashboard & pre-flight checks' }
    ],
    ambientHz: 528,
  },
  {
    id: 'calories-book',
    title: 'Calories Book',
    level: 'intermediate',
    category: 'application',
    year: 2025,
    role: 'Creator & Developer',
    tagline: {
      th: 'แอปนับแคลอรี่อัจฉริยะ วิเคราะห์อาหารจากรูปด้วย AI',
      en: 'Smart calorie counting app with AI food image analysis'
    },
    description: {
      th: 'แอปนับแคลอรี่ในแต่ละวันสำหรับเป้าหมายที่ต่างกัน (เพิ่ม/ลด/รักษาน้ำหนัก) โดยคำนวณแคลที่ควรได้รับจากอายุ น้ำหนัก ส่วนสูง และกิจกรรม ใช้ AI ในการประเมินแคลอรี่จากรูปถ่ายอาหาร พร้อมสรุปผลแชร์เป็นการ์ดสวยงาม',
      en: 'A daily calorie tracker tailored for different goals (gain/lose/maintain weight). Calculates required calories based on age, weight, height, and activity. Uses AI to estimate calories from food photos and generates beautiful shareable summary cards.'
    },
    tools: ['React Native (Expo)', 'AI Vision', 'Database'],
    features: [
      { th: 'AI ถอดรหัสแคลอรี่จากรูปภาพ', en: 'AI-powered calorie estimation from photos' },
      { th: 'คำนวณเป้าหมายรายบุคคล', en: 'Personalized goal calculation' },
      { th: 'สรุปการ์ดแชร์ลงโซเชียล', en: 'Generate social media share cards' }
    ],
    ambientHz: 639,
  },
  {
    id: 'introvert-mind',
    title: 'Introvert Mind',
    level: 'beginner',
    category: 'website',
    year: 2025,
    role: 'Solo Developer',
    tagline: {
      th: 'เว็บประเมินความเป็นอินโทรเวิร์ต 12 รูปแบบ',
      en: 'Web app assessing 12 types of introversion'
    },
    description: {
      th: 'เว็บแอปแบบทดสอบเพื่อค้นหาความเป็นอินโทรเวิร์ตในตัวคุณ ด้วยคำถามจิตวิทยา เอฟเฟกต์ภาพสวยงาม ประเมินผลออกมาเป็นตัวละคร 12 แบบพร้อมคำอธิบาย สร้างด้วย AI ทั้งกระบวนการและแชร์ผลลัพธ์เป็นการ์ดได้',
      en: 'A web application quiz to discover your inner introvert. Features psychological questions, beautiful visual effects, and evaluates you into 12 character archetypes with descriptions. Fully built with AI and includes shareable result cards.'
    },
    tools: ['Web Tech', 'AI Content', 'UI/UX'],
    features: [
      { th: 'วิเคราะห์ผลลัพธ์ 12 รูปแบบ', en: '12-archetype result analysis' },
      { th: 'เอฟเฟกต์ภาพลื่นไหล', en: 'Smooth visual effects' },
      { th: 'Generate card แชร์ลงโซเชียล', en: 'Generate shareable social cards' }
    ],
    ambientHz: 417,
  },
  {
    id: 'kids-plearn',
    title: 'Kids Plearn',
    level: 'intermediate',
    category: 'games',
    year: 2026,
    role: 'Game Developer',
    tagline: {
      th: 'เกมทดสอบความรู้เด็ก แลกของรางวัลในชีวิตจริง',
      en: 'Kids educational game with real-world rewards'
    },
    description: {
      th: 'เว็บแอปเกมสำหรับเด็กหลายช่วงวัย ตอบคำถามเพื่อเก็บเหรียญรางวัล สามารถนำเหรียญไปแลกคำใบ้ หรือให้ผู้ปกครองตั้งรางวัลในชีวิตจริง (ใส่รูปเองได้) แล้วให้เด็กมากดแลก (กำลังพัฒนาเปิดให้ทดลองเล่นแล้ว)',
      en: 'A web game for kids of various ages. Answer questions to collect coins, which can be exchanged for hints or real-world rewards set by parents (with custom photos). Currently in development with a playable demo.'
    },
    tools: ['Web Game Engine', 'Database', 'Frontend Framework'],
    features: [
      { th: 'ระบบสะสมเหรียญ/ของรางวัล', en: 'Coin & Reward collection system' },
      { th: 'ปรับระดับความยากตามวัย', en: 'Age-adaptive difficulty' },
      { th: 'ผู้ปกครองกำหนดรางวัลเองได้', en: 'Customizable parent-set rewards' }
    ],
    ambientHz: 852,
  },
  {
    id: 'z-world',
    title: 'Z World',
    level: 'advanced',
    category: 'games',
    year: 2026,
    role: 'Game Developer',
    tagline: {
      th: 'เกม Roblox แนว Open-World Zombie Survival',
      en: 'Roblox Open-World Zombie Survival Game'
    },
    description: {
      th: 'เกมเอาชีวิตรอดในโลกซอมบี้บน Roblox มีระบบความหิว ล่าสัตว์ การโจมตีอิงตามชิ้นส่วน (ยิงหัวตาย แขน/ขาขาดส่งผลกับความสามารถ) ผู้เล่นเลือกได้ว่าจะเล่นตามเนื้อเรื่องหรือสำรวจอิสระ (กำลังพัฒนา)',
      en: 'A zombie survival game on Roblox. Features hunger, hunting, and limb-based damage (headshots kill, missing limbs affect abilities). Players can follow the storyline or explore freely in an open world. (In Development)'
    },
    tools: ['Roblox Studio', 'Luau', '3D Modeling'],
    features: [
      { th: 'ระบบความบาดเจ็บเฉพาะส่วน', en: 'Limb-specific damage system' },
      { th: 'โลก Open-World อิสระ', en: 'Free-roam Open-World' },
      { th: 'ระบบเอาชีวิตรอด (หิว/หาอาหาร)', en: 'Survival mechanics (Hunger/Foraging)' }
    ],
    ambientHz: 396,
  },
  {
    id: 'portfolio',
    title: 'Interactive 3D Portfolio',
    level: 'advanced',
    category: 'website',
    year: 2026,
    role: 'Creative Technologist',
    tagline: {
      th: 'พอร์ตโฟลิโอ 3D นำทางด้วยลิฟต์',
      en: 'Interactive 3D Elevator-navigated Portfolio'
    },
    description: {
      th: 'โปรเจกต์เว็บส่วนตัวนี้เลย! สร้างระบบนำทางแบบลิฟต์ 3D มีระบบตรวจสอบสเปคเครื่อง (Multi-tier Fidelity) แสดงผลแบบ WebGPU สำหรับเครื่องแรง และ 2D สำหรับมือถือ เพื่อประสบการณ์ที่ลื่นไหลทุกคน',
      en: 'This very personal website! Features a 3D elevator navigation system and Multi-tier Fidelity capability detection. Renders in WebGPU for high-end devices and falls back to a 2D grid for mobile, ensuring a smooth experience for everyone.'
    },
    tools: ['React Three Fiber', 'Zustand', 'Tailwind v4'],
    features: [
      { th: 'Metaphor ระบบนำทางด้วยลิฟต์ 3D', en: '3D Elevator navigation metaphor' },
      { th: 'Multi-tier fallback ไม่ให้เว็บค้าง', en: 'Multi-tier fallback preventing freezes' },
      { th: 'Audio reactive ตามเนื้อหา', en: 'Content-driven reactive audio' }
    ],
    ambientHz: 528,
  },
];

export const projectsById = Object.fromEntries(
  projects.map((p) => [p.id, p]),
) as Record<string, Project>;
