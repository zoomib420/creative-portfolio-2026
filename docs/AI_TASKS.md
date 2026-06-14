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

### T-10 · GSAP + Lenis scroll & camera 🟡 — `status: done (v1)`
Smooth scroll (Lenis) + ผูกตำแหน่ง scroll กับการเคลื่อนกล้อง/วัตถุ
- **ไฟล์**: `src/lib/scroll.ts` (Lenis + `scrollState`), `Experience3D.tsx` (`CameraRig`)
- **ทำแล้ว**: smooth scroll, กล้อง orbit/dolly ตาม scroll, ปิดเมื่อ reduced-motion
- **ต่อยอด**: GSAP ScrollTrigger สำหรับ section-based director cues; pin/timeline

### T-11 · Audio reactive + Solfeggio 🟡 — `status: partial`
Web Audio API/Tone.js วิเคราะห์ความถี่ → ขับ shader/วัตถุ; เพลงต่อห้องใช้ `project.ambientHz`
- **ทำแล้ว**: `src/lib/audio.ts` (ambient Solfeggio pad) + ปุ่ม `AudioToggle` เริ่มหลัง gesture
- **เหลือ**: FFT analyser → ส่งค่าเข้า shader/วัตถุ; สลับ `ambientHz` ตาม section/ผลงาน
- **Acceptance**: ไม่มี error autoplay; ปิดเสียงได้; วัตถุ react กับเสียงจริง

### T-12 · WebGPU shader hero (tier high) 🔴 — `status: todo`
อัปเกรด `HeroObject` เป็น shader/material คุณภาพสูงบน `high` พร้อม fallback `standard`
- **ไฟล์**: `src/components/three/HeroObject.tsx`
- **Acceptance**: high สวยขึ้นจริง; standard ยังรันได้; ไม่พังบน basic (ไม่ถูกโหลด)

### T-13 · Runtime fps downgrade 🟡 — `status: todo`
วัด fps ถ้าตกต่อเนื่อง → `store.setTier()` ลดระดับ
- **ไฟล์**: ใหม่ `src/lib/perf.ts`, แก้ `Experience3D.tsx`
- **Acceptance**: จำลอง fps ต่ำแล้ว downgrade จริง ไม่กระตุก/วน

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

### T-22 · GenUI (Static ก่อน) 🟡 — `status: todo`
AI เลือก component สำเร็จรูปมาแสดงตามบริบท (ยังไม่ทำ open-ended)
- **Acceptance**: render เฉพาะ component ใน allowlist; sanitize input

### T-23 · QR Code Talk (เสียงพากย์) 🔴 — `status: todo`
หน้า `/p/:id` เล่นเสียงบรรยายผลงาน (ElevenLabs/Botnoi ผ่าน proxy) + สร้าง QR
- **Acceptance**: สแกน QR → เปิดหน้า → เล่นเสียงหลัง user gesture; มี transcript ข้อความ

### T-24 · AI Image Remix 🔴 — `status: todo`
อัปโหลดภาพ → แปลงสไตล์ผ่าน Replicate (proxy) หรือ TensorFlow.js (ฝั่ง client)
- **Acceptance**: จำกัดขนาด/ชนิดไฟล์; แสดง before/after; จัดการ error

### T-30 · โมเดล 3D Walk-through 🔴 — `status: todo`
อาคาร/ห้องเชื่อมกัน (streaming rooms) เพลงต่อห้องตาม Solfeggio
- **Acceptance**: เดินผ่านห้องลื่น; โหลดห้องแบบ stream; fallback 2D ครบ

### T-31 · โมเดล Scroll-driven story 🟡 — `status: todo`
ตัวละคร/ฉากเปลี่ยนตาม scroll (ต้องมี T-10)
- **Acceptance**: เล่าเรื่องครบตาม scroll; reduced-motion ใช้ 2D narrative

### T-32 · โมเดล Floating Island 🔴 — `status: todo`
เกาะลอยฟ้า นำทางด้วย fixed points (หญ้า/น้ำตก/ผีเสื้อ)
- **Acceptance**: nav จุดต่อจุดลื่น; องค์ประกอบธรรมชาติ animate; fallback 2D

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
