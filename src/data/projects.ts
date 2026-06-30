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
  caseStudyId?: string;
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
  /** Fine-tune thumbnail cropping when a screenshot needs a custom focal point. */
  thumbnailPosition?: string;
  /** Full, uncropped image for the modal detail view. */
  fullImage?: string;
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
      en: 'A Python-based scheduling bot using Selenium. It logs into the university portal, extracts course schedules and student lists, then automatically creates corresponding Google Classrooms via the API.'
    },
    thumbnail: '/projects/Project-automator.png',
    fullImage: '/projects/Project-automator2.png',
    tools: ['Python', 'Selenium', 'Google Classroom API', 'Chromedriver'],
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
      en: 'A diet and calorie tracking application featuring Thai food databases. It allows users to set goals, track daily intake, and monitor their progress with intuitive data visualization.'
    },
    thumbnail: '/projects/Project-caloriesbook.png',
    fullImage: '/projects/Project-caloriesbook2.jpg',
    tools: ['React Native', 'Firebase', 'Redux', 'Chart.js'],
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
      en: 'A web quiz that helps you discover your introversion type — psychology-based questions and polished visual effects resolve into one of 12 character archetypes, each with its own description. Built end-to-end with AI tooling, with results shareable as a social card.'
    },
    thumbnail: '/projects/Project-introvert.png',
    thumbnailPosition: '50% 0%',
    fullImage: '/projects/Project-introvert2.png',
    tools: ['AI-assisted web build'],
    features: [
      { th: 'วิเคราะห์ผลลัพธ์ 12 รูปแบบ', en: '12-archetype result analysis' },
      { th: 'เอฟเฟกต์ภาพลื่นไหล', en: 'Smooth visual effects' },
      { th: 'Generate card แชร์ลงโซเชียล', en: 'Generate shareable social cards' }
    ],
    links: [
      { label: 'Live', url: 'https://introvert-eosin.vercel.app' },
      { label: 'Code', url: 'https://github.com/zoomib420/Introvert' },
    ],
    ambientHz: 417,
  },
  {
    id: 'intake-pilot',
    title: 'Intake Pilot',
    level: 'advanced',
    category: 'automation',
    caseStudyId: 'intake-pilot',
    year: 2026,
    role: 'Creator & Developer',
    tagline: {
      th: 'แชทบอท AI รับลูกค้าและประเมินงานอัตโนมัติ',
      en: 'AI Chatbot for client intake & estimation'
    },
    description: {
      th: 'ระบบ AI รับลูกค้าหน้าด่านผ่าน LINE และเว็บแชท คอยสอบถามบัดเจท ความต้องการเบื้องต้น ประเมินความยากง่ายและราคาคร่าวๆ พร้อมแยกประเภทงานและความเร่งด่วน แล้วส่งข้อมูลจัดเรียงลง Notion อัตโนมัติ สร้างขึ้นมาเพื่อช่วยรับลูกค้าและเตรียมข้อมูลให้พร้อมก่อนคุยงานจริง\n\nมีการออกแบบ prompt และประเมินคุณภาพคำตอบของ AI — ตรงกับงาน AI Trainer / Evaluator โดยตรง',
      en: 'An AI-powered first-line customer service chatbot for LINE and Web. It interviews clients about their budget and requirements, estimates project complexity and cost, categorizes urgency, and automatically organizes everything into Notion.\n\nInvolves prompt design and evaluating AI response quality — directly relevant to AI Trainer / Evaluator work.'
    },
    thumbnail: '/projects/Project-intakepilot.png',
    thumbnailPosition: '50% 0%',
    fullImage: '/projects/Project-intakepilot2.png',
    tools: ['AI Chatbot', 'LINE API', 'Notion API'],
    features: [
      { th: 'AI สัมภาษณ์และประเมินราคาอัตโนมัติ', en: 'AI-driven client interview & estimation' },
      { th: 'บันทึกและจัดหมวดหมู่ลง Notion', en: 'Automated Notion data entry' },
      { th: 'คัดกรองความต้องการและความเร่งด่วน', en: 'Urgency & requirement categorization' }
    ],
    links: [
      { label: 'Live Demo', url: 'https://intake-pilot.vercel.app' },
    ],
    ambientHz: 741,
  },
  {
    id: 'fignest',
    title: 'FigNest',
    level: 'advanced',
    category: 'website',
    caseStudyId: 'fignest',
    year: 2026,
    role: 'Creator & Developer',
    tagline: {
      th: 'เว็บรวมฟิกเกอร์อนิเมะ พร้อมลิงก์ affiliate และตลาดมือสอง',
      en: 'Anime figure marketplace guide with affiliate links and a second-hand board',
    },
    description: {
      th: 'แพลตฟอร์มสำหรับนักสะสมฟิกเกอร์ที่รวมสินค้าตามเรื่องดังอย่าง One Piece, Naruto, Dragon Ball, Jujutsu Kaisen และ Demon Slayer พร้อมจัดหมวดให้ค้นง่าย เทียบราคาและส่งต่อไปยังลิงก์ affiliate ของ Shopee/Lazada รวมถึงมีพื้นที่ตลาดมือสองสำหรับนักสะสมไทยและหน้าคอนเทนต์ที่ช่วยให้ซื้อขายได้ปลอดภัยขึ้น',
      en: 'A collector-focused figure discovery website that organizes anime figures by series, surfaces affiliate product listings from Shopee and Lazada, and adds a second-hand marketplace plus content pages for safer buying and selling.',
    },
    thumbnail: '/projects/Project-fignest.png',
    fullImage: '/projects/Project-fignest.png',
    tools: ['Next.js', 'TypeScript', 'Affiliate Commerce', 'Search & Filters'],
    features: [
      { th: 'คัดหมวดฟิกเกอร์ตามอนิเมะและแบรนด์ยอดนิยม', en: 'Figure discovery by anime franchise and brand' },
      { th: 'เปรียบเทียบสินค้าผ่านลิงก์ affiliate ของ Shopee/Lazada', en: 'Affiliate-driven product discovery across Shopee and Lazada' },
      { th: 'มีตลาดมือสองและหน้าคู่มือซื้อขายปลอดภัยสำหรับนักสะสมไทย', en: 'Second-hand marketplace and safe-trade content for Thai collectors' },
    ],
    links: [
      { label: 'Live', url: 'https://fignest.vercel.app/' },
    ],
    ambientHz: 639,
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
      en: 'An interactive e-learning platform designed for kindergarten and primary school children. Features gamified lessons, progress tracking, and parent dashboards to encourage self-directed learning.'
    },
    thumbnail: '/projects/Project-kids-plearn.png',
    fullImage: '/projects/Project-kids-plearn2.png',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
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
    thumbnail: '/projects/Project-Zworld.png',
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
      en: 'This very website! A multi-tier architecture featuring a 3D WebGPU elevator experience for high-end devices, gracefully degrading to WebGL2, and falling back to a clean 2D layout for mobile.'
    },
    thumbnail: '/projects/Project-portfolio.png',
    fullImage: '/projects/Project-portfolio2.png',
    tools: ['React', 'Three.js', 'React Three Fiber', 'Tailwind v4'],
    features: [
      { th: 'Metaphor ระบบนำทางด้วยลิฟต์ 3D', en: '3D Elevator navigation metaphor' },
      { th: 'Multi-tier fallback ไม่ให้เว็บค้าง', en: 'Multi-tier fallback preventing freezes' },
      { th: 'Audio reactive ตามเนื้อหา', en: 'Content-driven reactive audio' }
    ],
    links: [
      { label: 'Live', url: 'https://super-rooster.vercel.app' },
      { label: 'Code', url: 'https://github.com/zoomib420/creative-portfolio-2026' },
    ],
    ambientHz: 528,
  },
];

export const projectsById = Object.fromEntries(
  projects.map((p) => [p.id, p]),
) as Record<string, Project>;
