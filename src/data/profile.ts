/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠️  ข้อมูลตัวตน — ตอนนี้เป็น "ตัวอย่าง (EXAMPLE)" ทั้งหมด
 *  แก้ไฟล์นี้ไฟล์เดียวจบ แล้วทั้งเว็บ (2D + 3D) จะอัปเดตตาม
 *  รายการที่ต้องแก้สรุปไว้ใน docs/USER_TODO.md
 * ─────────────────────────────────────────────────────────────────────────
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

// EXAMPLE DATA — แทนที่ด้วยข้อมูลจริงของคุณ
export const profile: Profile = {
  name: 'พีรพล จันทร์เกษม', // EXAMPLE
  handle: 'PEERA.DEV', // EXAMPLE
  role: 'Creative Technologist',
  tagline:
    'ผมออกแบบ "Living Experience" ที่หลอมรวม 3D แบบเรียลไทม์, Generative AI และอารมณ์ความรู้สึก ' +
    'ให้กลายเป็นโลกดิจิทัลที่ผู้คนจดจำได้', // EXAMPLE
  bio:
    'Creative Technologist ที่อยู่ตรงรอยต่อระหว่างศิลปะกับวิศวกรรม — ' +
    'หลงใหลการใช้โค้ดเป็นเครื่องมือสื่อสารความรู้สึก (creative coding) ' +
    'ทำงานกับ WebGPU, React Three Fiber และระบบ AI เพื่อสร้างประสบการณ์ที่ทั้งสวยและลื่นไหล ' +
    '5+ ปีกับงาน interactive installation, web experience และ AR/XR.', // EXAMPLE
  location: 'Bangkok, Thailand', // EXAMPLE
  email: 'hello@peera.dev', // EXAMPLE
  resumeUrl: '/resume.pdf', // EXAMPLE — วางไฟล์จริงใน public/resume.pdf หรือเอาออก
  socials: [
    { label: 'GitHub', url: 'https://github.com/your-handle' }, // EXAMPLE
    { label: 'Behance', url: 'https://www.behance.net/your-handle' }, // EXAMPLE
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle' }, // EXAMPLE
    { label: 'Instagram', url: 'https://instagram.com/your-handle' }, // EXAMPLE
  ],
};
