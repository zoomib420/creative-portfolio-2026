# AI_TASKS.md — กระดานงานสำหรับ AI agent

วิธีใช้: หยิบ task ที่ `status: todo`, อ่าน **Acceptance** ให้ครบ, ทำให้ `npm run build` ผ่าน,
แล้วอัปเดต `status` + ติ๊ก checkbox ใน [`ROADMAP.md`](./ROADMAP.md)

> ก่อนเริ่มทุก task: อ่าน [`../AGENTS.md`](../AGENTS.md) §3 (กฎ) และ section ที่เกี่ยวใน
> [`ARCHITECTURE.md`](./ARCHITECTURE.md)

ระดับ: 🟢 ง่าย · 🟡 กลาง · 🔴 ยาก/ต้องตั้งค่าภายนอก

---

### T-01 · เติมเนื้อหาจริง 🟢 — `status: todo`
แทนที่ placeholder ทั้งหมด (`[ชื่อคุณ]`, `[อีเมลคุณ]`, คำโปรย) และเติมผลงานจริง
- **ไฟล์**: `src/data/projects.ts`, `index.html`, `src/components/ui/{Nav,Overlay}.tsx`,
  `src/components/fallback/Grid2D.tsx`, `docs/CONTENT.md`
- **Acceptance**: ไม่เหลือ `[...]` placeholder; ผลงานแสดงครบทั้ง 2D และ 3D overlay

### T-10 · GSAP + Lenis scroll & camera 🟡 — `status: done`
Smooth scroll (Lenis) + GSAP ScrollTrigger director cues (camera waypoint ต่อ section)
- **ไฟล์**: `src/lib/scroll.ts` (Lenis+GSAP integration, `cameraState`, WAYPOINTS),
  `Experience3D.tsx` (`CameraRig` eases ตาม waypoint), `Overlay.tsx` (`id` + `data-reveal`)
- **ทำแล้ว**: smooth scroll, กล้องเปลี่ยนมุมต่อ section, content fade-in, ปิดเมื่อ reduced-motion
- **ต่อยอด (ถ้าต้องการ)**: pinning, timeline แบบ scrubbed, parallax

### T-11 · Audio reactive + Solfeggio 🟡 — `status: done (v1)`
Web Audio API วิเคราะห์ความถี่ → ขับวัตถุ; เพลงต่อห้องใช้ `project.ambientHz`
- **ทำแล้ว**: `audio.ts` (pad + LFO + `getLevel()` FFT), HeroObject pulse ตามเสียง,
  ProjectModal สลับ `ambientHz` ตามผลงาน, AudioToggle เริ่มหลัง gesture
- **ต่อยอด**: ขับ WebGPU shader ด้วย FFT bins, Tone.js สำหรับ texture เสียงที่รวยขึ้น

### T-12 · WebGPU rendering + shader 🔴 — `status: partial (renderer done)`
- **ทำแล้ว**: `src/lib/renderer.ts` — tier `high` render ด้วย `WebGPURenderer` จริง
  (dynamic import, fallback WebGL เมื่อ init fail) ใช้กับทุกฉาก
- **⚠️ ข้อควรรู้**: three/webgpu เวอร์ชันนี้ **shadow มาบั๊ก** (`ShadowNode setPipeline`) →
  ปิด shadow ทั้งหมดไว้ก่อน (ดูคอมเมนต์ใน `Experience3D.tsx`) เปิดกลับเมื่อ three เสถียร
- **เหลือ**: TSL/node-material shader สวย ๆ สำหรับคริสตัลบน high; เปิด shadow กลับ

### T-13 · Runtime fps downgrade 🟡 — `status: done`
วัด fps ถ้าตกต่อเนื่อง → `store.setTier()` ลดระดับ
- **ไฟล์**: `Experience3D.tsx` (`PerfGuard` — sample 1s, ลดระดับเมื่อ <30fps ติดกัน 4s)
- **ต่อยอด**: แยกเป็น `lib/perf.ts`, เพิ่ม hysteresis/อัปเกรดกลับเมื่อ fps ฟื้น

### T-14 · GLB loader + บีบอัด 🟡 — `status: todo`
โหลดโมเดล `project.model` แบบ lazy ต่อ section; Draco/Meshopt + KTX2; dispose ตอน unmount
- **Acceptance**: ไม่มี memory leak (เช็ค `renderer.info`); โหลดเฉพาะที่เห็น

### T-20 · Serverless AI proxy skeleton 🔴 — `status: done (skeleton)`
สร้าง `/api/*` ถือ secret, provider-agnostic (Anthropic/OpenAI)
- **ทำแล้ว**: `api/chat.ts` (Edge handler), `src/lib/ai.ts` (client เรียกผ่าน `VITE_API_BASE_URL`)
- **เหลือ (ผู้ใช้/AI)**: ใส่ key + deploy, เพิ่ม **rate-limit + origin allowlist**, แก้ `SYSTEM_PROMPT`

### T-21 · AI Guide (GPT-4/Claude) 🔴 — `status: partial (UI done)`
ผู้ช่วยตอบเรื่องผลงาน เรียกผ่าน proxy (T-20) + ปุ่ม toggle (`VITE_ENABLE_AI_GUIDE`)
- **ทำแล้ว**: วิดเจ็ต `AIGuide` (chat UI, loading/error, ซ่อนเมื่อ flag=false)
- **เหลือ**: ทดสอบกับ backend จริง; ใส่ context ผลงาน; streaming response

### T-22 · GenUI (Static ก่อน) 🟡 — `status: partial (registry done)`
AI เลือก component สำเร็จรูปมาแสดงตามบริบท (ยังไม่ทำ open-ended)
- **ทำแล้ว**: `src/lib/genui.tsx` — allowlist registry + `renderGenUI()` (fail-safe, ไม่ inject markup)
- **เหลือ**: ให้ backend (T-21) ส่ง descriptor มา แล้ว render ใน AIGuide; เพิ่ม component ตามต้องการ

### T-23 · QR Code Talk (เสียงพากย์) 🔴 — `status: todo`
หน้า `/p/:id` เล่นเสียงบรรยายผลงาน (ElevenLabs/Botnoi ผ่าน proxy) + สร้าง QR
- **Acceptance**: สแกน QR → เปิดหน้า → เล่นเสียงหลัง user gesture; มี transcript ข้อความ

### T-24 · AI Image Remix 🔴 — `status: todo`
อัปโหลดภาพ → แปลงสไตล์ผ่าน Replicate (proxy) หรือ TensorFlow.js (ฝั่ง client)
- **Acceptance**: จำกัดขนาด/ชนิดไฟล์; แสดง before/after; จัดการ error

### T-30 · โมเดล 3D Walk-through 🔴 — `status: done (v1)`
เดินผ่านห้อง (ห้องละผลงาน) กล้อง dolly ตาม scroll
- **ไฟล์**: `src/components/three/scenes/WalkthroughScene.tsx`
- **ทำแล้ว**: corridor + ห้อง/พาเนลเรืองแสงคลิกเปิด modal, กล้องเดินหน้าตาม scroll, fallback 2D
- **ต่อยอด**: streaming GLB ต่อห้อง, เพลงต่อห้อง, ผนัง/บรรยากาศรวยขึ้น

### T-31 · โมเดล Scroll-driven story 🟡 — `status: done (v1)`
ตัวละคร orb เคลื่อนไปข้างหน้า ฉาก/สีเปลี่ยนตาม scroll
- **ไฟล์**: `src/components/three/scenes/ScrollstoryScene.tsx`
- **ทำแล้ว**: orb นำทาง, กล้องตามหลัง, mood color lerp ตาม progress, floating shapes, fallback 2D
- **ต่อยอด**: ตัวละครจริง (GLB rigged), เหตุการณ์ต่อ section, reduced-motion narrative

### T-32 · โมเดล Floating Island 🔴 — `status: done (v1)`
เกาะลอยฟ้า + องค์ประกอบธรรมชาติ (procedural ไม่ใช้ไฟล์โมเดล)
- **ไฟล์**: `src/components/three/Island.tsx` (base + grass สั่นไหว + motes ลอย + rocks),
  detail ตาม tier, นำทางด้วย camera waypoints (T-10)
- **ทำแล้ว**: เกาะ, หญ้า instanced สั่นไหว, แสง motes ลอย, idle rotation, fallback 2D
- **ต่อยอด**: น้ำตก (shader), ผีเสื้อ (sprite), fixed-point click navigation, GLB props

### T-40 · Blockchain certificate verify 🔴 — `status: todo`
เก็บ hash เกียรติบัตรบน ledger + ตรวจสอบผ่าน QR
- **Acceptance**: ตรวจสอบ cert ปลอม/จริงได้; มี doc วิธีออก cert

### T-50 · Deploy + CDN + Lighthouse 🟡 — `status: todo`
Deploy (Vercel/Cloudflare) + SSL/CDN + ตั้ง performance budget
- **Acceptance**: เว็บ live ผ่าน HTTPS; Lighthouse mobile Perf ≥90 A11y ≥95; ทดสอบ 3 tier บนเครื่องจริง

---

## เทมเพลตเพิ่ม task ใหม่
```
### T-xx · ชื่อ <ระดับ> — status: todo
คำอธิบายสั้น
- ไฟล์: ...
- Acceptance: เงื่อนไขที่วัดได้ + build ผ่าน
```
