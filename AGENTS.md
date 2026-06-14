# AGENTS.md — คู่มือสำหรับ AI ที่เข้ามาช่วยพัฒนาโปรเจกต์นี้

> ไฟล์นี้คือ **single source of truth** สำหรับ AI agent ทุกตัว (Claude Code, Cursor, Copilot,
> Lovable ฯลฯ) ที่เข้ามาทำงานในโปรเจกต์นี้ อ่านไฟล์นี้ก่อนเริ่มงานเสมอ
> มนุษย์ควรอ่าน [`README.md`](./README.md) แทน

---

## 0. TL;DR สำหรับ AI (อ่าน 30 วินาที)

- **โปรเจกต์**: Portfolio ของ Creative Technologist — "Living Experience" แบบ Interactive 3D + AI
- **Stack**: Vite + React 19 + TypeScript + React Three Fiber (Three.js) + Tailwind v4 + Zustand
- **หัวใจสถาปัตยกรรม**: **Multi-tier Fidelity** — `high` (WebGPU) → `standard` (WebGL2) → `basic` (2D)
  ตรวจจับใน [`src/lib/capabilities.ts`](./src/lib/capabilities.ts) เก็บ state ที่
  [`src/lib/store.ts`](./src/lib/store.ts)
- **กฎเหล็ก**: ทุกฟีเจอร์ 3D **ต้องมี fallback 2D เสมอ** และ **secret key ห้ามอยู่ฝั่ง client**
- **งานที่หยิบทำได้**: ดู [`docs/AI_TASKS.md`](./docs/AI_TASKS.md) (มี task id `T-xx` พร้อม acceptance criteria)
- **สิ่งที่ต้องให้มนุษย์ทำ** (ข้อมูลจริง/key/deploy): [`docs/USER_TODO.md`](./docs/USER_TODO.md) — เนื้อหาตอนนี้เป็น `EXAMPLE`
- **ก่อนบอกว่าเสร็จ**: ต้องผ่าน `npm run build` (typecheck + build) เสมอ

---

## 1. คำสั่งที่ใช้บ่อย

```bash
npm install        # ติดตั้ง dependencies
npm run dev        # dev server (http://localhost:5173)
npm run build      # typecheck + production build — ต้องผ่านก่อน commit
npm run preview    # ดู production build จริง
npm run typecheck  # เช็ค type อย่างเดียว
```

ทดสอบแต่ละ fidelity tier โดยไม่ต้องเปลี่ยนเครื่อง:
`http://localhost:5173/?tier=high` · `?tier=standard` · `?tier=basic`
(หรือกำหนด `VITE_FORCE_TIER` ใน `.env`)

---

## 2. โครงสร้างโปรเจกต์ (map ก่อนแก้)

```
src/
├── main.tsx                    # entry
├── App.tsx                     # ตรวจ capability → เลือก 3D หรือ 2D, จัดการ user-gesture
├── index.css                   # Tailwind v4 + design tokens (@theme)
├── lib/
│   ├── capabilities.ts         # ★ ตรวจ WebGPU/WebGL2 → FidelityTier
│   └── store.ts                # ★ Zustand global state
├── data/
│   └── projects.ts             # ★ เนื้อหาผลงาน (data-driven, ใช้ร่วมกัน 3D + 2D)
├── components/
│   ├── ui/                     # Nav, Loader, FidelityBadge, Overlay (HTML layer)
│   ├── three/                  # Experience3D (lazy), HeroObject — โค้ด 3D ทั้งหมด
│   └── fallback/               # Grid2D — เวอร์ชัน 2D
docs/                           # ★ เอกสารทั้งหมด (อ่านก่อนทำงานในส่วนที่เกี่ยว)
```

`★` = ไฟล์แกนหลัก แก้อย่างระมัดระวัง

---

## 3. กฎการทำงาน (Rules — ห้ามฝ่าฝืน)

1. **Fallback เสมอ** — ทุกอย่างที่พึ่ง WebGPU/WebGL ต้องเสื่อมระดับลงได้อย่างนุ่มนวล (graceful
   degradation) จนถึง 2D สำหรับ tier `basic` ห้ามให้หน้าจอขาว
2. **Secret อยู่ฝั่ง server เท่านั้น** — `OPENAI_API_KEY`, `ELEVENLABS_API_KEY` ฯลฯ ห้าม import
   ในโค้ด `src/` เด็ดขาด ให้เรียกผ่าน serverless proxy (`VITE_API_BASE_URL`) ดู
   [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) §AI
3. **Data-driven** — เนื้อหาผลงานอยู่ใน `src/data/`, ห้าม hardcode เนื้อหาผลงานลงใน component
4. **Performance budget** — ดู [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) §Performance
   (เป้า 120fps บน high, raycasting คุมที่ ~30fps, หยุด render loop เมื่อเปิด modal/เปลี่ยนหน้า)
5. **Audio/heavy motion ต้องรอ user gesture** — เริ่มเสียง/AudioContext หลังการแตะครั้งแรกเท่านั้น
   (`store.hasUserGesture`) ตามนโยบาย autoplay ของเบราว์เซอร์
6. **Accessibility** — เคารพ `prefers-reduced-motion` (จัด tier เป็น `basic` ให้แล้ว), ใส่ alt/aria,
   ข้อความอยู่ใน DOM ไม่ใช่ใน canvas
7. **3D bundle ต้อง lazy** — โค้ด Three.js โหลดผ่าน `lazy()` เท่านั้น เพื่อให้ tier `basic` ไม่ดาวน์โหลด

---

## 4. มาตรฐานโค้ด

- **TypeScript strict** — ไม่มี `any` แบบมักง่าย, ไม่มี unused (build จะ fail)
- **Import alias** `@/` → `src/` (เช่น `import { useAppStore } from '@/lib/store'`)
- **คอมเมนต์**: เขียนเท่าที่จำเป็นเพื่ออธิบาย "ทำไม" ไม่ใช่ "ทำอะไร" — ดูสไตล์จากไฟล์ที่มีอยู่
- **Tailwind v4**: theme token อยู่ใน `src/index.css` (`@theme`) ใช้ `var(--color-xxx)` หรือ utility
- **ภาษา**: UI/เนื้อหา = ไทยได้, โค้ด/identifier/คอมเมนต์เชิงเทคนิค = อังกฤษ

---

## 5. Workflow ที่คาดหวังจาก AI

1. อ่าน task ที่เกี่ยวใน [`docs/AI_TASKS.md`](./docs/AI_TASKS.md) + section ที่เกี่ยวใน `docs/`
2. ทำงานให้เล็กและตรงจุด (surgical) — อย่า refactor ทั้งโลกถ้าไม่จำเป็น
3. ทดสอบทั้ง 3 tier ด้วย `?tier=` ถ้าแตะส่วน rendering/UX
4. รัน `npm run build` ให้ผ่าน
5. อัปเดต checkbox/สถานะใน `docs/AI_TASKS.md` และ `docs/ROADMAP.md` ถ้างานคืบ
6. สรุปสั้น ๆ ว่าแก้อะไร ไฟล์ไหน ทดสอบยังไง

---

## 6. สิ่งที่ "ยังไม่ทำ" (ตั้งใจเว้นไว้ให้ทำต่อ)

ดูรายละเอียดเป็น task ใน [`docs/AI_TASKS.md`](./docs/AI_TASKS.md):
- GSAP/Lenis scroll-driven camera & storytelling (T-10)
- WebGPU shader / Solfeggio-frequency audio reactive (T-11, T-12)
- AI Guide (GPT-4) + GenUI + serverless proxy (T-20..T-22)
- QR Code Talk narration (ElevenLabs/Botnoi) (T-23)
- AI Image Remix (Replicate/TensorFlow.js) (T-24)
- 3 โมเดลการนำเสนอ: Walk-through / Scroll-story / Floating Island (T-30..T-32)
- Blockchain certificate verify (T-40)
- Deployment + CDN + Lighthouse budget (T-50)

> **อย่าสร้างของหลอก (mock) แล้วบอกว่าเสร็จ** ถ้ายังต่อ API ไม่ได้ ให้ทำ interface + TODO ที่ชัดเจน
> และระบุไว้ในสรุป
