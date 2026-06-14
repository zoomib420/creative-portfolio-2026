# ROADMAP.md — แผนพัฒนา 5 เฟส

สถานะ: `[x]` เสร็จ · `[~]` กำลังทำ · `[ ]` ยังไม่เริ่ม
รายละเอียดงานย่อยพร้อม acceptance criteria อยู่ใน [`AI_TASKS.md`](./AI_TASKS.md)

---

## ✅ Phase 0 — Foundation (เสร็จแล้ว)
- [x] Scaffold Vite + React 19 + TS strict
- [x] React Three Fiber + Tailwind v4 + Zustand
- [x] ระบบ Multi-tier Fidelity (WebGPU → WebGL → 2D) + override ผ่าน `?tier=`
- [x] Hero 3D scene + 2D fallback grid (data-driven จาก `src/data/projects.ts`)
- [x] Code-splitting bundle 3D, performance-aware Canvas
- [x] เอกสารชุด AI (AGENTS / docs)
- [x] `npm run build` ผ่าน

## Phase 1 — Storyboarding & Vibe Mapping
- [ ] กำหนด Emotional Resonance + Mood/Tone ต่อ section (→ `DESIGN.md`)
- [ ] เลือกโมเดลการนำเสนอหลัก: Walk-through / Scroll-story / Floating Island
- [ ] เก็บ reference (Samsy.ninja เป็น gold standard ด้านความลื่น)
- [ ] เติมเนื้อหาจริงลง `src/data/projects.ts` + `CONTENT.md`

## Phase 2 — Scaffolding with AI (Vibe Coding)
- [x] โครงสร้างพื้นฐาน (ทำใน Phase 0)
- [ ] ตั้ง serverless proxy skeleton สำหรับ AI (T-20)
- [ ] วาง component library / design system เล็ก ๆ

## Phase 3 — Core 3D Development
- [x] Lenis + GSAP ScrollTrigger smooth scroll & camera director cues (T-10)
- [x] ครบ 3 โมเดลนำเสนอ: Island (T-32) · Walk-through (T-30) · Scroll-story (T-31) + ปุ่มสลับ
- [x] WebGPU rendering จริงบน tier high (T-12 renderer) · TSL shader + shadow ยัง
- [x] Audio-reactive crystal + Solfeggio ต่อผลงาน (T-11 v1)
- [x] Runtime fps downgrade (T-13)
- [ ] โหลด/บีบอัด GLB ต่อ section (T-14) — รอไฟล์โมเดลจริง

## Phase 4 — AI & Media Integration
- [~] AI proxy skeleton + AI Guide UI (T-20 done, T-21 รอ backend/key) · GenUI (T-22) ยัง
- [x] ดนตรี Solfeggio เริ่มหลัง user gesture (T-11 v1) · audio-reactive ยังเหลือ
- [ ] เสียงพากย์ ElevenLabs/Botnoi + QR Code Talk (T-23)
- [ ] AI Image Remix (Replicate/TensorFlow.js) (T-24)

## Phase 5 — Deployment & Optimization
- [ ] Blockchain certificate verify ผ่าน QR (T-40)
- [ ] Deploy + SSL + CDN (Vercel/Cloudflare) (T-50)
- [ ] Lighthouse budget + ทดสอบครบ 3 tier บนเครื่องจริง
- [ ] Final Checklist (ด้านล่าง)

---

## Final Checklist (จากแผนต้นฉบับ)
- [ ] โต้ตอบลื่น + fallback 2D สำหรับเครื่องไม่รองรับ WebGPU
- [ ] Raycasting คุมที่ ~30fps
- [ ] ภาพ AR tracking เป็น high-contrast
- [ ] เสียงพากย์/ดนตรีเริ่มที่ user gesture แรก
- [ ] ข้อมูลเกียรติบัตรบน blockchain ตรวจสอบผ่าน QR ได้
