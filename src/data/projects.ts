/**
 * Portfolio content lives here as data, decoupled from presentation.
 * Replace placeholders with real content. Each project can be rendered in
 * the 3D world (rooms / islands) OR the 2D grid fallback from the same source.
 */

export type ProjectLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProjectCategory = 'automation' | 'website' | 'application' | 'games';

/** Ordered categories used to group the Work section. */
export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: 'automation', label: 'Automation' },
  { id: 'website', label: 'Website' },
  { id: 'application', label: 'Application' },
  { id: 'games', label: 'Games' },
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
    id: 'schedule-automator',
    title: 'Schedule Automator & Classroom Creator',
    level: 'advanced',
    category: 'automation',
    year: 2024,
    role: 'Solo Developer',
    tagline: 'ลดงานสถาบันพัฒนาสมองจากชั่วโมงเหลือไม่กี่คลิก',
    description: 'โปรแกรมช่วยเหลือสถาบันพัฒนาสมอง ลดงานทำมือโดยโอนข้อมูลจาก ERP ไป Google Sheet ได้อย่างแม่นยำ มีหน้า Preview ก่อนรันจริง มีแดชบอร์ด ระบบล็อค และโปรแกรมสร้าง classroom ใน ERP โดยไม่ต้องมี API (ใช้วิธี reverse engineering)',
    tools: ['Google Apps Script', 'Chrome Extension', 'Node.js'],
    features: ['Reverse engineering ERP', 'โอนข้อมูลข้ามระบบแบบอัตโนมัติ', 'แดชบอร์ดสรุปและระบบตรวจสอบก่อนทำงานจริง'],
    ambientHz: 528,
  },
  {
    id: 'calories-book',
    title: 'Calories Book',
    level: 'intermediate',
    category: 'application',
    year: 2025,
    role: 'Creator & Developer',
    tagline: 'แอปนับแคลอรี่อัจฉริยะ วิเคราะห์อาหารจากรูปด้วย AI',
    description: 'แอปนับแคลอรี่ในแต่ละวันสำหรับเป้าหมายที่ต่างกัน (เพิ่ม/ลด/รักษาน้ำหนัก) โดยคำนวณแคลที่ควรได้รับจากอายุ น้ำหนัก ส่วนสูง และกิจกรรม ใช้ AI ในการประเมินแคลอรี่จากรูปถ่ายอาหาร พร้อมสรุปผลแชร์เป็นการ์ดสวยงาม',
    tools: ['React Native (Expo)', 'AI Vision', 'Database'],
    features: ['AI ถอดรหัสแคลอรี่จากรูปภาพ', 'คำนวณเป้าหมายรายบุคคล', 'สรุปการ์ดแชร์ลงโซเชียล'],
    ambientHz: 639,
  },
  {
    id: 'introvert-mind',
    title: 'Introvert Mind',
    level: 'beginner',
    category: 'website',
    year: 2025,
    role: 'Solo Developer',
    tagline: 'เว็บประเมินความเป็นอินโทรเวิร์ต 12 รูปแบบ',
    description: 'เว็บแอปแบบทดสอบเพื่อค้นหาความเป็นอินโทรเวิร์ตในตัวคุณ ด้วยคำถามจิตวิทยา เอฟเฟกต์ภาพสวยงาม ประเมินผลออกมาเป็นตัวละคร 12 แบบพร้อมคำอธิบาย สร้างด้วย AI ทั้งกระบวนการและแชร์ผลลัพธ์เป็นการ์ดได้',
    tools: ['Web Tech', 'AI Content', 'UI/UX'],
    features: ['วิเคราะห์ผลลัพธ์ 12 รูปแบบ', 'เอฟเฟกต์ภาพลื่นไหล', 'Generate card แชร์ลงโซเชียล'],
    ambientHz: 417,
  },
  {
    id: 'kids-plearn',
    title: 'Kids Plearn',
    level: 'intermediate',
    category: 'games',
    year: 2026,
    role: 'Game Developer',
    tagline: 'เกมทดสอบความรู้เด็ก แลกของรางวัลในชีวิตจริง',
    description: 'เว็บแอปเกมสำหรับเด็กหลายช่วงวัย ตอบคำถามเพื่อเก็บเหรียญรางวัล สามารถนำเหรียญไปแลกคำใบ้ หรือให้ผู้ปกครองตั้งรางวัลในชีวิตจริง (ใส่รูปเองได้) แล้วให้เด็กมากดแลก (กำลังพัฒนาเปิดให้ทดลองเล่นแล้ว)',
    tools: ['Web Game Engine', 'Database', 'Frontend Framework'],
    features: ['ระบบสะสมเหรียญ/ของรางวัล', 'ปรับระดับความยากตามวัย', 'ผู้ปกครองกำหนดรางวัลเองได้'],
    ambientHz: 852,
  },
  {
    id: 'z-world',
    title: 'Z World',
    level: 'advanced',
    category: 'games',
    year: 2026,
    role: 'Game Developer',
    tagline: 'เกม Roblox แนว Open-World Zombie Survival',
    description: 'เกมเอาชีวิตรอดในโลกซอมบี้บน Roblox มีระบบความหิว ล่าสัตว์ การโจมตีอิงตามชิ้นส่วน (ยิงหัวตาย แขน/ขาขาดส่งผลกับความสามารถ) ผู้เล่นเลือกได้ว่าจะเล่นตามเนื้อเรื่องหรือสำรวจอิสระ (กำลังพัฒนา)',
    tools: ['Roblox Studio', 'Luau', '3D Modeling'],
    features: ['ระบบความบาดเจ็บเฉพาะส่วน', 'โลก Open-World อิสระ', 'ระบบเอาชีวิตรอด (หิว/หาอาหาร)'],
    ambientHz: 396,
  },
  {
    id: 'portfolio',
    title: 'Interactive 3D Portfolio',
    level: 'advanced',
    category: 'website',
    year: 2026,
    role: 'Creative Technologist',
    tagline: 'พอร์ตโฟลิโอ 3D นำทางด้วยลิฟต์',
    description: 'โปรเจกต์เว็บส่วนตัวนี้เลย! สร้างระบบนำทางแบบลิฟต์ 3D มีระบบตรวจสอบสเปคเครื่อง (Multi-tier Fidelity) แสดงผลแบบ WebGPU สำหรับเครื่องแรง และ 2D สำหรับมือถือ เพื่อประสบการณ์ที่ลื่นไหลทุกคน',
    tools: ['React Three Fiber', 'Zustand', 'Tailwind v4'],
    features: ['Metaphor ระบบนำทางด้วยลิฟต์ 3D', 'Multi-tier fallback ไม่ให้เว็บค้าง', 'Audio reactive ตามเนื้อหา'],
    ambientHz: 528,
  },
];

export const projectsById = Object.fromEntries(
  projects.map((p) => [p.id, p]),
) as Record<string, Project>;
