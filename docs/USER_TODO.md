# ✋ USER_TODO — สิ่งที่ "คุณ" ต้องทำเอง

> ไฟล์นี้รวมทุกอย่างที่ AI ทำแทนไม่ได้ (ต้องใช้ข้อมูลจริง / บัญชี / การตัดสินใจของคุณ)
> ทุกอย่างที่ทำแทนได้ ผมทำไปแล้ว และใส่ "ข้อมูลตัวอย่าง (EXAMPLE)" ไว้ก่อน
> ค้นหาคำว่า `EXAMPLE` ในโปรเจกต์เพื่อเจอจุดที่ต้องแก้ทั้งหมด:
> ```bash
> # ดูทุกจุดที่ใส่ข้อมูลตัวอย่างไว้
> git grep -n "EXAMPLE"
> ```

ระดับความเร่งด่วน: 🔴 ต้องทำก่อนใช้จริง · 🟡 ควรทำ · 🟢 ทำเมื่อจะใช้ฟีเจอร์นั้น

---

## 🔴 1. ข้อมูลตัวตน — แก้ไฟล์เดียว: `src/data/profile.ts`
ทุกอย่างใน UI ดึงจากไฟล์นี้ แก้ที่เดียวอัปเดตทั้งเว็บ
- [ ] `name` — ชื่อจริง (ตอนนี้: "พีรพล จันทร์เกษม")
- [ ] `handle` — ชื่อแบรนด์บน nav (ตอนนี้: "PEERA.DEV")
- [ ] `role` — ตำแหน่ง (ตอนนี้: "Creative Technologist")
- [ ] `tagline` — คำโปรย hero
- [ ] `bio` — ประวัติย่อ
- [ ] `location`, `email`
- [ ] `resumeUrl` — วางไฟล์จริงที่ `public/resume.pdf` หรือเอา field นี้ออก
- [ ] `socials[]` — ลิงก์ GitHub/Behance/LinkedIn/IG จริง (ตอนนี้เป็น `your-handle`)

## 🔴 2. ข้อมูลผลงาน — แก้ `src/data/projects.ts`
มี 3 ผลงานตัวอย่างตามแผน (beginner/intermediate/advanced) แก้/เพิ่ม/ลบได้
- [ ] `title`, `tagline`, `description`, `year`, `role`
- [ ] `tools[]`, `features[]`
- [ ] `links[]` — ตอนนี้ชี้ไป `example.com` (แก้เป็นลิงก์จริง)
- [ ] `thumbnail` — วางรูปที่ `public/projects/<id>.jpg` (ดูข้อ 4)
- [ ] `model` — ไฟล์ `.glb` บีบอัด ถ้าจะทำห้อง 3D (ดูข้อ 4)
- [ ] `ambientHz` — ความถี่ Solfeggio ของผลงานนั้น (ปรับได้ตามอารมณ์)

## 🔴 3. ชื่อ/SEO ใน `index.html`
ไฟล์นี้เป็น HTML static (import TS ไม่ได้) ต้องแก้มือ — ค้นหา `EXAMPLE`
- [ ] `<title>` (ตอนนี้: "พีรพล จันทร์เกษม — Creative Technologist")
- [ ] `<meta property="og:title">` และ `og:description`

## 🟡 4. รูปภาพ / สื่อ (วางใน `public/`)
- [ ] `public/og-image.png` — รูปแชร์โซเชียล 1200×630 (ตอนนี้ลิงก์ค้างไว้ ยังไม่มีไฟล์)
- [ ] `public/favicon.svg` — มี placeholder อยู่ แก้เป็นโลโก้คุณได้
- [ ] `public/projects/*.jpg` — รูป thumbnail ของแต่ละผลงาน
- [ ] โมเดล `.glb` (ถ้าทำ 3D rooms) — บีบอัด Draco/Meshopt + KTX2 ก่อน commit
> หมายเหตุ: ผม generate รูปจริงให้ไม่ได้ ถ้าต้องการ บอกได้ว่าจะใช้เครื่องมือ AI image ตัวไหน

## 🟢 5. ฟีเจอร์ AI (เปิดเมื่อพร้อม deploy backend)
โครงเสร็จแล้ว (`api/chat.ts` + `src/lib/ai.ts` + วิดเจ็ต `AIGuide`) แต่ต้องมี key + deploy
- [ ] สมัคร key: **Anthropic** (แนะนำ) หรือ **OpenAI**
- [ ] คัดลอก `.env.example` → `.env` แล้วเติม `ANTHROPIC_API_KEY` (หรือ `OPENAI_API_KEY`)
- [ ] ตั้ง `VITE_ENABLE_AI_GUIDE="true"` เพื่อโชว์ปุ่ม AI
- [ ] Deploy `api/` เป็น serverless (Vercel จะรู้จัก `api/chat.ts` อัตโนมัติ)
- [ ] แก้ `SYSTEM_PROMPT` ใน `api/chat.ts` ให้ใส่ bio/ผลงานจริงของคุณ
- [ ] เพิ่ม rate-limit + ตรวจ origin ใน `api/chat.ts` ก่อนใช้งานจริง (กันคนแอบใช้ key)
> ⚠️ ห้ามใส่ key ลงในโค้ด `src/` เด็ดขาด — มันจะหลุดไปกับ bundle ฝั่งผู้ใช้

## 🟢 6. ฟีเจอร์ที่ยังไม่ทำ (รอ assets/บัญชี/ตัดสินใจ)
ดูเป็น task พร้อม acceptance ใน `docs/AI_TASKS.md` — สั่ง AI ทำต่อได้เมื่อพร้อม
- [ ] เสียงพากย์ + QR Code Talk (ElevenLabs/Botnoi) — T-23 (ต้องมี key + ไฟล์เสียง)
- [ ] AI Image Remix (Replicate) — T-24 (ต้องมี token)
- [ ] เลือกโมเดลนำเสนอหลัก: Walk-through / Scroll-story / Floating Island — T-30..32
- [ ] WebGPU shader คุณภาพสูง + audio-reactive — T-11, T-12
- [ ] Blockchain certificate verify — T-40 (ต้องตัดสินใจ chain/ผู้ให้บริการ)

## 🟡 7. Deploy (Phase 5) — T-50
- [ ] เลือก host: **Vercel** (ง่ายสุด รองรับ `api/` ทันที) / Cloudflare / Netlify
- [ ] เชื่อม repo → ตั้ง env vars บน dashboard ของ host (ไม่ใช่ commit `.env`)
- [ ] ตรวจ HTTPS/CDN ทำงาน + ทดสอบ `?tier=high|standard|basic` บนเครื่องจริง
- [ ] (ถ้ามีโดเมน) ตั้ง custom domain + อัปเดต `VITE_SITE_URL`

## 🟢 8. Git / เวอร์ชัน
- [ ] ผม `git init` + stage ไว้แล้ว **แต่ยังไม่ commit** — สั่งผม commit ได้ หรือทำเอง:
  ```bash
  git commit -m "Initial portfolio foundation"
  ```
- [ ] (ถ้าต้องการ) สร้าง repo บน GitHub แล้ว push

---

## ✅ สิ่งที่ทำเสร็จแล้ว (ไม่ต้องแตะ เว้นแต่อยากปรับ)
- รากฐานรันได้ + `npm run build` ผ่าน + ทดสอบบนเบราว์เซอร์จริง (HIGH/BASIC ผ่าน)
- ระบบ Multi-tier Fidelity (WebGPU→WebGL→2D) + override `?tier=`
- Hero 3D + กล้องเลื่อนตาม scroll (Lenis) + 2D fallback
- Project Modal (คลิกการ์ดดูรายละเอียด) ใช้ได้ทั้ง 2D/3D
- ระบบเสียง Solfeggio + ปุ่ม toggle (เริ่มหลัง user gesture)
- โครง AI proxy + วิดเจ็ต AI Guide (รอแค่ key)
- เอกสารครบชุดสำหรับ AI (`AGENTS.md`, `docs/`)

> เคล็ดลับ: เปิด `npm run dev` แล้วลอง `http://localhost:5173/?tier=basic` เทียบกับ `?tier=high`
