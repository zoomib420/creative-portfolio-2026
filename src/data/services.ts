/**
 * Service packages shown in the "Business Systems" room — productized offers
 * for SME buyers (clinic/tutoring-school owners etc.), as opposed to
 * src/data/projects.ts which is portfolio proof-pieces for any visitor.
 * Pricing reflects the "Founding Client" band (see internal pricing notes) —
 * deliberately not the cheapest first-client rate, since that one is for
 * direct negotiation only, not public display.
 */

import type { LocalizedString } from './profile';

export interface ServicePackage {
  id: string;
  title: LocalizedString;
  /** Business-outcome headline — leads with the result, not the tech stack. */
  outcome: LocalizedString;
  description: LocalizedString;
  scope: LocalizedString[];
  notIncluded?: LocalizedString[];
  /** Display string, e.g. "฿3,000–6,000" or a "contact for quote" phrase. */
  priceRange: LocalizedString;
  /** Links to a src/data/caseStudies.ts entry, if a real one backs this package. */
  caseStudyId?: string;
}

export const servicePackages: ServicePackage[] = [
  {
    id: 'single-point-automation',
    title: { th: 'Automation จุดเดียว', en: 'Single-Point Automation' },
    outcome: {
      th: 'เลิกพิมพ์ข้อมูลซ้ำมือทุกสัปดาห์ — ให้ระบบโอนข้อมูลข้ามระบบให้อัตโนมัติ',
      en: 'Stop re-typing the same data every week — let automation move it across systems for you',
    },
    description: {
      th: 'ซิงก์ข้อมูลข้ามระบบ 1 จุด เช่น ระบบเดิม/ฟอร์ม → Google Sheet/Notion หรือ Sheet ↔ Notion สองทาง พร้อมหน้า Preview ให้ตรวจสอบก่อนรันจริงทุกครั้ง กันข้อมูลผิดพลาดหลุดเข้าระบบจริง',
      en: 'Syncs data across one connection point — your existing system/forms → Google Sheet/Notion, or two-way Sheet ↔ Notion — with a preview step before every real run so mistakes never hit production data.',
    },
    scope: [
      { th: '1 จุดเชื่อมต่อ', en: '1 connection point' },
      { th: 'ทดสอบ 1 รอบก่อนส่งมอบ', en: '1 testing round before delivery' },
      { th: 'คู่มือใช้งานสั้นๆ', en: 'A short usage guide' },
    ],
    notIncluded: [
      { th: 'ดูแลต่อเนื่องหลังส่งมอบ (แยกเป็นแพ็กเกจ maintenance ได้)', en: 'Ongoing maintenance after delivery (available as a separate package)' },
    ],
    priceRange: { th: '฿3,000–6,000', en: '฿3,000–6,000' },
    caseStudyId: 'schedule-automator',
  },
  {
    id: 'quiz-funnel',
    title: { th: 'เว็บแบบทดสอบเก็บ Lead', en: 'Quiz Funnel — Lead Capture' },
    outcome: {
      th: 'เปลี่ยนฟอร์ม "กรอกอีเมลรับโปรโมชัน" ที่คนไม่กรอก ให้เป็นแบบทดสอบที่ลูกค้าอยากกรอกเอง',
      en: 'Turn the email-signup form nobody fills in into a quiz customers actually want to take',
    },
    description: {
      th: 'เว็บแบบทดสอบ/แบบประเมินที่มีคำถามออกแบบเฉพาะธุรกิจคุณ เอฟเฟกต์ภาพสวยงาม ประเมินผลออกมาเป็นกลุ่ม/ตัวละครหลายแบบพร้อมคำอธิบาย เก็บอีเมล/LINE ก่อนโชว์ผลลัพธ์ แล้วแชร์ผลเป็นการ์ดลงโซเชียลได้ — โครงเดียวกับที่พิสูจน์มาแล้วกับ Introvert Mind',
      en: 'A quiz/assessment web app with questions tailored to your business, polished visuals, and multiple result archetypes with their own descriptions. Captures an email or LINE contact before revealing the result, then lets visitors share it as a social card — the same format proven on Introvert Mind.',
    },
    scope: [
      { th: 'ออกแบบคำถาม + ผลลัพธ์ 1 ชุด ตามธุรกิจคุณ', en: '1 set of questions + results, tailored to your business' },
      { th: 'ระบบเก็บอีเมล/LINE ก่อนโชว์ผล', en: 'Email/LINE capture before results are revealed' },
      { th: 'การ์ดผลลัพธ์แชร์ลงโซเชียลได้', en: 'Shareable result card for social media' },
    ],
    notIncluded: [
      { th: 'ค่าโดเมน/hosting รายปี (ถ้าต้องการแยกจากของที่มีอยู่)', en: 'Annual domain/hosting costs (if you need one separate from what you already have)' },
    ],
    priceRange: { th: '฿4,000–7,000', en: '฿4,000–7,000' },
    caseStudyId: 'introvert-mind',
  },
  {
    id: 'ai-intake-bot',
    title: { th: 'AI Intake Bot เริ่มต้น', en: 'AI Intake Bot — Starter' },
    outcome: {
      th: 'ลูกค้าทักมาเมื่อไหร่ก็มี AI คอยสัมภาษณ์แทนทันที ไม่ต้องรอแอดมินตอบ',
      en: 'Whenever a customer messages, AI interviews them instantly — no waiting on an admin to reply',
    },
    description: {
      th: 'ผูก LINE OA หรือเว็บแชท ให้ AI สัมภาษณ์ลูกค้าหน้าด่านแทนคุณ ถามงบ ความต้องการ ประเมินความเร่งด่วนคร่าวๆ แล้วจัดเรียงข้อมูลเข้า Notion ให้พร้อมอ่านทันทีที่คุณเปิดดู',
      en: 'Connects to your LINE OA or web chat so AI interviews incoming customers for you — budget, needs, rough urgency — then sorts everything into Notion, ready to read the moment you open it.',
    },
    scope: [
      { th: 'ตั้งคำถามสัมภาษณ์ตามธุรกิจคุณ (แก้ไขได้ 1 รอบหลังส่งมอบ)', en: 'Interview questions tailored to your business (1 revision round after delivery)' },
      { th: 'เชื่อม LINE OA ที่มีอยู่แล้ว', en: 'Connects to your existing LINE OA' },
      { th: 'ส่งข้อมูลเข้า Notion อัตโนมัติ', en: 'Auto-organizes data into Notion' },
    ],
    notIncluded: [
      { th: 'ค่า API ของผู้ให้บริการ AI ต่อเดือน (เปิดบัญชีเองหรือคิดแยกเป็นค่าดูแลรายเดือน)', en: 'Monthly AI provider API costs (self-managed account, or billed separately as a maintenance fee)' },
    ],
    priceRange: { th: '฿5,000–8,000', en: '฿5,000–8,000' },
    caseStudyId: 'intake-pilot',
  },
  {
    id: 'custom-automation',
    title: { th: 'Automation/ERP แบบกำหนดเอง', en: 'Custom Automation / ERP Integration' },
    outcome: {
      th: 'ระบบเดิมซับซ้อนกว่านี้? คุยรายละเอียดแล้วประเมินราคาให้ตรงงานจริง',
      en: 'Got something more complex? Let\'s scope it together and quote a price that matches the real work',
    },
    description: {
      th: 'สำหรับงานที่ใหญ่กว่าจุดเชื่อมต่อเดียว เช่น เชื่อมหลายระบบพร้อมกัน หรือ workflow เฉพาะของธุรกิจคุณที่ไม่มีในแพ็กเกจสำเร็จรูป',
      en: 'For work bigger than a single connection point — multiple systems wired together, or a workflow custom-built around how your business actually runs.',
    },
    scope: [],
    priceRange: { th: 'ประเมินราคาตาม scope งานจริง (คุยก่อนเริ่ม)', en: 'Quoted after scoping the real work (let\'s talk first)' },
  },
];

/** Shown once, under the package list — sets payment expectations upfront. */
export const depositTerms: LocalizedString = {
  th: 'มัดจำ 50% ก่อนเริ่มงาน และอีก 50% ก่อนส่งมอบไฟล์/เปิดใช้งานจริง — ชัดเจนตั้งแต่ต้น',
  en: '50% deposit before starting, the remaining 50% before delivery/go-live — clear from day one.',
};

export const servicesById = Object.fromEntries(
  servicePackages.map((s) => [s.id, s]),
) as Record<string, ServicePackage>;
