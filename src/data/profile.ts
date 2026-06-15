/**
 * ข้อมูลตัวตน (จริงแล้ว) — แก้ไฟล์นี้ไฟล์เดียว แล้วทั้งเว็บ (2D + 3D) อัปเดตตาม.
 * ที่ยังเหลือ: โดเมนจริง + SEO/OG ใน index.html ตอน deploy (ดู docs/USER_TODO.md).
 */

export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  /** ชื่อแบรนด์/handle สั้น ๆ ที่โชว์บน nav */
  handle: string;
  role: string;
  /** คำโปรย hero สั้น ๆ — บอกตัวตนใน 1–2 ประโยค */
  tagline: string;
  /** ประวัติย่อสำหรับ section About */
  bio: string;
  location: string;
  email: string;
  resumeUrl?: string;
  socials: SocialLink[];
}

export const profile: Profile = {
  name: 'ปวสิทธิ์ ไชยรัตน์ (ซูม)',
  handle: 'ZOOM',
  role: 'AI-Powered Builder',
  tagline: 'บอกสิ่งที่อยากได้ แล้วผมจะสร้างมันให้ — เว็บ แอป เกม ระบบอัตโนมัติ ทุกอย่างขับเคลื่อนด้วย AI',
  bio: 'สวัสดีครับ ผมซูม — จบมนุษยศาสตร์ (ภาษาอังกฤษ) แต่ชีวิตพาเลี้ยวเยอะ: เคยเป็นครู เปิดร้านอาหาร เรียนทำอาหารไทย ผ่านงาน retail & hospitality มาหลายสาย ทุกประสบการณ์สอนให้เข้าใจคน เข้าใจระบบ และรู้ว่า "ปัญหาซ้ำๆ ต้องแก้ด้วยระบบ ไม่ใช่แรงคน"\n\nตอนนี้ทุ่มเต็มที่กับ AI & Automation — ใช้ AI เป็นเครื่องมือสร้างทุกอย่างตั้งแต่เว็บ แอป เกม ไปจนถึงระบบอัตโนมัติที่ลดงานจากหลายชั่วโมงเหลือไม่กี่คลิก มี cert ด้าน Cybersecurity จาก Future Skills & TryHackMe ถ้ามีโปรเจกต์ที่ท้าทาย — คุยกันได้เลยครับ',
  location: 'Bangkok, Thailand · Remote-first',
  email: 'zoomib420@gmail.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/zoomib420/' },
  ],
};
