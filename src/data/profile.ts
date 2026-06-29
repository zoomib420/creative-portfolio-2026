/**
 * ข้อมูลตัวตน (จริงแล้ว) — แก้ไฟล์นี้ไฟล์เดียว แล้วทั้งเว็บ (2D + 3D) อัปเดตตาม.
 * ที่ยังเหลือ: โดเมนจริง + SEO/OG ใน index.html ตอน deploy (ดู docs/USER_TODO.md).
 */

export interface SocialLink {
  label: string;
  url: string;
}

export interface LocalizedString {
  th: string;
  en: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  name: LocalizedString;
  /** ชื่อแบรนด์/handle สั้น ๆ ที่โชว์บน nav */
  handle: string;
  portraitUrl: string;
  portraitAlt: LocalizedString;
  role: LocalizedString;
  /** คำโปรย hero สั้น ๆ — บอกตัวตนใน 1–2 ประโยค */
  tagline: LocalizedString;
  /** ประวัติย่อสำหรับ section About */
  bio: LocalizedString;
  location: LocalizedString;
  email: string;
  resumeUrl?: string;
  socials: SocialLink[];
  /** ข้อความ CTA สั้น ๆ ที่โชว์เหนือช่องทางติดต่อ */
  contactCta: LocalizedString;
}

export const profile: Profile = {
  name: { 
    th: 'ปวสิทธิ์ ไชยรัตน์ (ซูม)', 
    en: 'Pawasit Chairat (Zoom)' 
  },
  handle: 'ZOOM',
  portraitUrl: '/profile-photo.jpg',
  portraitAlt: {
    th: 'รูปโปรไฟล์ของซูม ปวสิทธิ์ ไชยรัตน์',
    en: 'Portrait photo of Zoom Pawasit Chairat',
  },
  role: { 
    th: 'AI-Powered Builder', 
    en: 'AI-Powered Builder' 
  },
  tagline: { 
    th: 'บอกสิ่งที่อยากได้ แล้วผมจะสร้างมันให้ — เว็บ แอป เกม ระบบอัตโนมัติ\nทุกอย่างขับเคลื่อนด้วย AI ทำทุกอย่างให้กลายเป็นเรื่องง่าย ที่คุณก็ทำได้\nแต่ถ้าทำไม่ได้ เอามาให้ผมทำให้ครับ', 
    en: 'Tell me what you want, and I will build it — Web, Apps, Games, Automations.\nAll powered by AI, making everything so easy that even you can do it.\nBut if you can\'t, leave it to me.' 
  },
  bio: { 
    th: 'สวัสดีครับ ผมชื่อซูม ปวสิทธิ์ ไชยรัตน์ หรือเรียกผมว่า สุดยอดไก่ชน ก็ได้ครับ — จบมนุษยศาสตร์ (ภาษาอังกฤษ) แต่ชีวิตพาเลี้ยวเยอะ: เคยเป็นครู เปิดร้านอาหาร เรียนทำอาหารไทย ผ่านงาน retail & hospitality มาหลายสาย ทุกประสบการณ์สอนให้เข้าใจคน เข้าใจระบบ และรู้ว่า "ปัญหาซ้ำๆ ต้องแก้ด้วยระบบ ไม่ใช่แรงคน"\n\nตอนนี้ทุ่มเต็มที่กับ AI & Automation — ใช้ AI เป็นเครื่องมือสร้างทุกอย่างตั้งแต่เว็บ แอป เกม ไปจนถึงระบบอัตโนมัติที่ลดงานจากหลายชั่วโมงเหลือไม่กี่คลิก มี cert ด้าน Cybersecurity จาก Future Skills & TryHackMe ถ้ามีโปรเจกต์ที่ท้าทาย — คุยกันได้เลยครับ', 
    en: 'Hi, my name is Zoom Pawasit Chairat, or you can call me "Super Rooster". I graduated in Humanities (English) but my life took many turns: I\'ve been a teacher, opened a restaurant, studied Thai cooking, and worked across retail & hospitality. Every experience taught me to understand people, systems, and the truth that "repetitive problems must be solved by systems, not human effort."\n\nNow I am fully dedicated to AI & Automation. I use AI to build everything from websites and apps to games and automations that reduce hours of work to just a few clicks. I hold a Cybersecurity certificate from Future Skills & TryHackMe. If you have a challenging project — let\'s talk!'
  },
  location: { 
    th: 'Bangkok, Thailand · Remote-first', 
    en: 'Bangkok, Thailand · Remote-first' 
  },
  email: 'zoomib420@gmail.com',
  socials: [
    { label: 'คุยกับ Intake Pilot (LINE)', url: 'https://lin.ee/w3Fw9o6R' },
    { label: 'GitHub', url: 'https://github.com/zoomib420/' },
  ],
  contactCta: {
    th: 'อยากได้เว็บ แอป ระบบอัตโนมัติ หรือ AI workflow ให้ธุรกิจคุณ? ทักคุยกับ Intake Pilot — AI ผู้ช่วยรับงานของผม — เล่าปัญหาให้ฟังได้เลย แล้วผมจะติดต่อกลับพร้อมราคาคร่าวๆ',
    en: 'Want a website, app, automation, or AI workflow for your business? Chat with Intake Pilot — my AI intake assistant — tell it about your problem and I will follow up with a rough quote.',
  },
};
