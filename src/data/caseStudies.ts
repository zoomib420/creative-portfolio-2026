/**
 * Full case studies backing the service packages in src/data/services.ts.
 * Ported from C:\Roadmap\ai-software-company-blueprint\01-first-client\
 * (case-study-schedule-automator.md, case-study-intake-pilot.md,
 * case-study-introvert-mind.md) — kept strictly to the lines those files
 * mark as confirmed. Figures the source files flag as unconfirmed (🟡
 * placeholders) are intentionally left out; use qualitative language
 * instead of inventing numbers.
 */

import type { LocalizedString } from './profile';

export interface CaseStudy {
  id: string;
  projectTitle: string;
  context: LocalizedString;
  problem: LocalizedString;
  solution: LocalizedString;
  results: LocalizedString[];
  tools: string[];
  /** "What other businesses could use this for" — broadens beyond the one client. */
  applicableTo: LocalizedString[];
}

export const caseStudies: Record<string, CaseStudy> = {
  'schedule-automator': {
    id: 'schedule-automator',
    projectTitle: 'Schedule Automator & Classroom Creator',
    context: {
      th: 'สร้างให้สถาบันพัฒนาสมอง (brain-training institute) ที่ต้องจัดตารางเรียน/สร้างห้องเรียนใหม่อยู่เป็นประจำ',
      en: 'Built for a brain-training institute that regularly needed to schedule classes and create new classrooms.',
    },
    problem: {
      th: 'สถาบันใช้ระบบ ERP เดิมจัดตารางเรียน/จัดห้อง แต่ระบบนั้นไม่มี API เปิดให้เชื่อมต่อ ทำให้ทุกครั้งที่ต้องจัดตาราง/สร้างห้องเรียนใหม่ ต้องทำมือทั้งหมด: ดึงข้อมูลจาก ERP มาเรียบเรียงเอง แล้วไปสร้าง Google Classroom ทีละห้องด้วยมือ',
      en: 'The institute scheduled classes and rooms through a legacy ERP with no public API. Every new schedule or classroom meant manually pulling data from the ERP, then creating each Google Classroom by hand, one at a time.',
    },
    solution: {
      th: 'เขียนโปรแกรม Python ใช้ Selenium reverse-engineer ระบบ ERP เดิม (ไม่ต้องรอ vendor เปิด API ให้) ดึงข้อมูลตารางเรียน/รายชื่อนักเรียนออกมาอัตโนมัติ แปลงและซิงก์เข้า Google Sheet พร้อมหน้า Preview ก่อนรันจริง (กันความผิดพลาดก่อนกระทบข้อมูลจริง) แล้วต่อ Google Classroom API ให้สร้างห้องเรียนที่ตรงกันอัตโนมัติ มีแดชบอร์ดสรุปสถานะและระบบล็อคกันรันซ้ำ',
      en: 'Built a Python + Selenium tool that reverse-engineers the legacy ERP (no need to wait on the vendor for API access), pulls schedules and student lists automatically, and syncs them into Google Sheets with a preview step before any real run. It then drives the Google Classroom API to create matching classrooms automatically, with a status dashboard and a lock to prevent double-runs.',
    },
    results: [
      { th: 'ลดงานจัดตาราง/สร้างห้องเรียนจากงานที่ต้องทำมือหลายชั่วโมง เหลือไม่กี่คลิก', en: 'Cut scheduling/classroom-creation from hours of manual work down to a few clicks' },
      { th: 'มีหน้า Preview ตรวจสอบก่อนรันจริง ลดความเสี่ยงข้อมูลผิดพลาดเข้าระบบจริง', en: 'A preview step before every real run reduces the risk of bad data reaching production' },
      { th: 'ทำได้กับระบบที่ไม่มี API ทางการ — ไม่ต้องรอ vendor ของลูกค้าเปิดให้', en: 'Works even without an official API — no waiting on the vendor to grant access' },
    ],
    tools: ['Python', 'Selenium', 'ChromeDriver', 'Google Classroom API', 'Google Sheets'],
    applicableTo: [
      { th: 'โรงเรียน/สถาบันกวดวิชา/สถาบันสอนพิเศษที่จัดตารางเรียนด้วยระบบเดิม', en: 'Schools and tutoring institutes that schedule classes through a legacy system' },
      { th: 'คลินิก/ร้านที่มีระบบจองคิวเดิมแต่ต้องโอนข้อมูลไปทำรายงาน/นัดหมายต่อด้วยมือ', en: 'Clinics or shops with an existing booking system that still requires manual data transfer for reports or appointments' },
      { th: 'ธุรกิจที่ใช้ระบบ legacy ที่ไม่มีใครดูแล/อัปเดต API ให้แล้ว แต่เลิกใช้ระบบเดิมทั้งระบบไม่ได้', en: 'Any business stuck on an unmaintained legacy system it can\'t fully replace' },
    ],
  },
  'intake-pilot': {
    id: 'intake-pilot',
    projectTitle: 'Intake Pilot',
    context: {
      th: 'สร้างขึ้นเพื่อช่วยรับลูกค้าหน้าด่านของงานฟรีแลนซ์/รับงานของตัวเอง — ใช้กับธุรกิจอื่นที่รับงานแบบ custom/per-project ได้เหมือนกัน',
      en: 'Built to handle first-line client intake for freelance/project-based work — applicable to any business that takes on custom, per-project engagements.',
    },
    problem: {
      th: 'ลูกค้าที่ทักเข้ามาทาง LINE/เว็บแชทแต่ละราย ต้องคุยสัมภาษณ์เองทุกครั้งเพื่อรู้ budget ความต้องการเบื้องต้น ความยากง่ายของงาน และความเร่งด่วน — เป็นงานซ้ำที่กินเวลาในการคุยรอบแรกกับทุกราย ก่อนจะรู้ด้วยซ้ำว่ารายนั้น "คุ้มเวลาคุยต่อ" หรือไม่',
      en: 'Every customer messaging in through LINE or web chat had to be interviewed manually to learn their budget, basic needs, complexity, and urgency — a repetitive first conversation with every single lead, before even knowing whether that lead was worth the time.',
    },
    solution: {
      th: 'สร้าง AI chatbot ผูกกับ LINE OA + เว็บแชท ให้ AI เป็นคนสัมภาษณ์ลูกค้าหน้าด่านแทน: สอบถาม budget ความต้องการ ประเมินความยาก/ง่ายและราคาคร่าวๆ พร้อมแยกประเภทงานและความเร่งด่วนอัตโนมัติ จากนั้นส่งข้อมูลที่จัดหมวดหมู่แล้วเข้า Notion โดยอัตโนมัติ พร้อมให้คนจริงเข้ามารับช่วงต่อเฉพาะ lead ที่ผ่านการคัดกรองแล้ว',
      en: 'Built an AI chatbot connected to LINE OA and web chat that interviews incoming customers in place of a human: asking about budget and needs, estimating rough complexity and price, and auto-categorizing by job type and urgency. Categorized data flows straight into Notion, and a human only steps in once a lead has already been screened.',
    },
    results: [
      { th: 'ลูกค้าหน้าด่านถูกสัมภาษณ์และคัดกรองอัตโนมัติ ก่อนที่เจ้าของงานต้องเข้าไปคุยเอง', en: 'Customers are interviewed and screened automatically before the business owner ever has to step in' },
      { th: 'ข้อมูล budget/ความต้องการ/ความเร่งด่วน ถูกจัดหมวดหมู่ลง Notion พร้อมใช้ทันที ไม่ต้องพิมพ์สรุปเอง', en: 'Budget, needs, and urgency are categorized straight into Notion — ready to read, no manual summarizing' },
      { th: 'ใช้งานได้ทั้ง LINE OA (ช่องทางที่ธุรกิจไทยส่วนใหญ่ใช้อยู่แล้ว) และเว็บแชท', en: 'Works on both LINE OA — the channel most Thai businesses already use — and web chat' },
    ],
    tools: ['AI Chatbot (LLM)', 'LINE Messaging API', 'Notion API'],
    applicableTo: [
      { th: 'ธุรกิจรับงาน custom/per-project (ฟรีแลนซ์, เอเจนซี่ขนาดเล็ก, ช่างรับเหมา)', en: 'Custom/per-project businesses (freelancers, small agencies, contractors)' },
      { th: 'ร้านค้า/คลินิกที่รับนัดหมาย/สอบถามผ่าน LINE OA เป็นหลัก', en: 'Shops or clinics that mainly take bookings/inquiries through LINE OA' },
      { th: 'ธุรกิจที่ต้องการคัดกรองงบประมาณ/ความเร่งด่วนก่อนนัดคุยจริง เพื่อไม่เสียเวลากับ lead ที่ไม่พร้อมจ่าย', en: 'Any business that wants to screen budget/urgency before a real conversation, to avoid wasting time on leads who aren\'t ready to pay' },
    ],
  },
  'introvert-mind': {
    id: 'introvert-mind',
    projectTitle: 'Introvert Mind',
    context: {
      th: 'โปรเจกต์ทดลองทำเองในปี 2025 — เว็บแบบทดสอบจิตวิทยาประเมินความเป็นอินโทรเวิร์ต ไม่ใช่งานที่ลูกค้าจ่ายเงินแบบ Schedule Automator/Intake Pilot แต่ใช้พิสูจน์รูปแบบ "quiz funnel" ที่เอาไปปรับใช้กับธุรกิจอื่นได้',
      en: 'A self-initiated 2025 project — a psychology quiz assessing introversion type. Unlike Schedule Automator or Intake Pilot, this wasn\'t paid client work, but it proves out a "quiz funnel" format that adapts directly to other businesses.',
    },
    problem: {
      th: 'ธุรกิจจำนวนมาก (ร้านความงาม คลินิก ที่ปรึกษา คอร์สเรียน) ต้องเก็บอีเมล/LINE ของลูกค้าเป้าหมายก่อนจะขายของ แต่ฟอร์ม "กรอกอีเมลรับโปรโมชัน" ตรงๆ คนไม่ค่อยกรอก เพราะไม่ได้อะไรกลับมาในทันที',
      en: 'Many businesses (beauty salons, clinics, consultants, course providers) need to capture a lead\'s email or LINE before they can sell — but a plain "enter your email for a promotion" form gets ignored, because there\'s nothing in it for the visitor right away.',
    },
    solution: {
      th: 'Introvert Mind พิสูจน์ว่าทำเว็บแบบทดสอบที่มีคำถามจิตวิทยา เอฟเฟกต์ภาพสวยงาม ประเมินผลออกมาเป็นตัวละคร 12 แบบพร้อมคำอธิบาย แล้วแชร์ผลลัพธ์เป็นการ์ดได้ — คนกรอกง่ายกว่ามากเพราะอยากรู้ผลของตัวเอง โครงเดียวกันนี้ปรับให้ธุรกิจใช้ได้ทันที โดยเปลี่ยนคำถาม/ผลลัพธ์ให้ตรงกับสินค้า/บริการ แล้วเก็บอีเมล/LINE ก่อนโชว์ผลลัพธ์',
      en: 'Introvert Mind proved the format: a quiz web app with psychology-based questions, polished visual effects, and 12 character-archetype results each with its own description — shareable as a social card. People fill it in far more readily because they want to know their own result. The same structure adapts directly to a business by swapping the questions/results for whatever it sells, then capturing an email/LINE contact before the result is revealed.',
    },
    results: [
      { th: 'ทำแบบทดสอบที่ประเมินผลได้ 12 รูปแบบ พร้อมคำอธิบายเฉพาะแต่ละแบบ', en: 'Built a quiz that resolves into 12 distinct result archetypes, each with its own description' },
      { th: 'มีระบบ generate การ์ดผลลัพธ์ให้แชร์ลงโซเชียลได้', en: 'Includes a result-card generator for sharing straight to social media' },
    ],
    tools: ['AI-assisted web build'],
    applicableTo: [
      { th: 'ร้านความงาม/คลินิก: "แบบทดสอบหาสกินแคร์ที่เหมาะกับผิวคุณ"', en: 'Beauty salons/clinics: "find the skincare routine that matches your skin"' },
      { th: 'ที่ปรึกษา/คอร์สเรียน: "แบบทดสอบหาสไตล์การเรียน/การลงทุนที่เหมาะกับคุณ"', en: 'Consultants/course providers: "find the learning style or investment approach that fits you"' },
      { th: 'ร้านอาหาร/คาเฟ่: "แบบทดสอบหาเมนูที่ตรงกับบุคลิกคุณ" (แจกคูปองหลังทำแบบทดสอบ)', en: 'Restaurants/cafes: "find the menu item that matches your personality" (with a coupon after completing it)' },
    ],
  },
  fignest: {
    id: 'fignest',
    projectTitle: 'FigNest',
    context: {
      th: 'สร้างเป็นเว็บสำหรับนักสะสมฟิกเกอร์อนิเมะ โดยตั้งใจให้เป็นทั้งหน้ารวมสินค้า affiliate และพื้นที่ตลาดมือสองสำหรับชุมชนนักสะสมไทยในที่เดียว',
      en: 'Built as a collector-focused anime figure website that combines affiliate product discovery with a second-hand community board in one place.',
    },
    problem: {
      th: 'คนที่สะสมฟิกเกอร์มักต้องกระโดดข้ามหลายที่: หา reference จากโพสต์หรือกลุ่ม, กดดูสินค้าจากหลายร้าน, เทียบราคาเอง, แล้วค่อยกลับไปหาตลาดมือสองอีกที ทำให้การค้นหาของสะสมที่อยากได้ช้าและกระจัดกระจาย โดยเฉพาะเวลาตามเรื่องดังหรือไลน์ฟิกเกอร์เฉพาะแบรนด์',
      en: 'Figure collectors often have to bounce across multiple places: social posts for references, separate store listings for new products, manual price comparisons, then separate community spaces for second-hand deals. That makes discovery fragmented and slow, especially when browsing by franchise or brand.',
    },
    solution: {
      th: 'FigNest จัดสินค้าใหม่ตามอนิเมะและแบรนด์ให้ค้นง่ายขึ้น พร้อมลิงก์ affiliate ไปยัง Shopee/Lazada, หน้า category ตามเรื่องยอดนิยม, search flow, ตลาดมือสอง และหน้าเนื้อหาอย่าง safe-trade / affiliate disclosure เพื่อให้เว็บดูน่าเชื่อถือและใช้งานได้จริงสำหรับชุมชนนักสะสม',
      en: 'FigNest organizes new products by anime franchise and brand, adds affiliate paths to Shopee and Lazada, ships category pages for major series, supports search and browsing flows, and includes a second-hand board plus trust-building content such as safe-trade and affiliate disclosure pages.',
    },
    results: [
      { th: 'รวม flow ค้นของสะสมใหม่และของมือสองไว้ในเว็บเดียว ทำให้ user ไม่ต้องเริ่มจากศูนย์ทุกครั้งที่อยากหาฟิกเกอร์', en: 'Combines new-product discovery and second-hand browsing in one place, reducing the need to restart the hunt from scratch each time.' },
      { th: 'โครงสร้างตามอนิเมะดังช่วยให้เข้าหาของได้ไวกว่า listing รวมแบบไม่จัดหมวด', en: 'Series-first navigation helps collectors reach relevant items faster than a flat product feed.' },
      { th: 'เพิ่มความโปร่งใสด้วย affiliate disclosure และคู่มือซื้อขายปลอดภัย ซึ่งสำคัญมากกับตลาดสะสมและมือสอง', en: 'Adds trust through affiliate disclosure and safe-trade guidance, which is especially important for collectible and second-hand commerce.' },
    ],
    tools: ['Next.js', 'TypeScript', 'Affiliate Commerce', 'Search & Filters'],
    applicableTo: [
      { th: 'เว็บ affiliate ที่ต้องคัดสินค้าจากหลายร้านแล้วจัดประสบการณ์ให้ค้นง่ายกว่า marketplace ตรง ๆ', en: 'Affiliate sites that curate products from multiple marketplaces and need a better discovery experience than the raw marketplaces provide.' },
      { th: 'community commerce สำหรับงานสะสม/งานอดิเรก เช่น ของเล่น โมเดล การ์ด หรือ merchandise fandom', en: 'Community-commerce products for collectibles and fandom hobbies such as toys, models, cards, or merch.' },
      { th: 'ธุรกิจ content + commerce ที่ต้องสร้างความน่าเชื่อถือผ่าน disclosure, safe-trade, และโครงสร้างข้อมูลที่ชัดเจน', en: 'Content-plus-commerce businesses that need trust-building layers like disclosure, safe-trade guidance, and clear information architecture.' },
    ],
  },
};
