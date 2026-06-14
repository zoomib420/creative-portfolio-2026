# Creative Portfolio 2026 — Interactive 3D + AI

Portfolio แบบ "Living Experience" สำหรับ Creative Technologist หลอมรวม **WebGPU, Generative AI
และ Spatial UI** เข้าด้วยกัน พร้อมระบบ **Multi-tier Fidelity** ที่ปรับประสบการณ์ตามอุปกรณ์ผู้ชม
โดยอัตโนมัติ (3D เต็มรูปแบบ → WebGL → 2D)

> 🤖 ถ้าคุณเป็น AI agent ที่เข้ามาช่วยพัฒนา ให้อ่าน **[AGENTS.md](./AGENTS.md)** ก่อน

---

## ✨ คุณสมบัติเด่น

- **Adaptive Fidelity** — ตรวจจับ WebGPU/WebGL2 + reduced-motion + สเปกเครื่อง แล้วเลือกระดับ
  ประสบการณ์ที่เหมาะสมอัตโนมัติ ไม่มีหน้าจอขาวบนเครื่องสเปกต่ำ
- **3D world** ด้วย React Three Fiber (โหลดแบบ code-split — เครื่องที่ไม่รองรับไม่ต้องดาวน์โหลด)
- **2D fallback** ที่เนื้อหาตรงกับเวอร์ชัน 3D (data-driven จากแหล่งเดียว)
- โครงพร้อมต่อยอด **AI Guide / GenUI / เสียงพากย์ / AI Image Remix** (ดู roadmap)

## 🧱 Tech Stack

| ด้าน | เทคโนโลยี |
| --- | --- |
| Build / Framework | Vite 6, React 19, TypeScript (strict) |
| 3D | React Three Fiber 9, Three.js, drei |
| Styling | Tailwind CSS v4 (design tokens ใน `@theme`) |
| State | Zustand |
| Motion (วางแผน) | GSAP, Lenis |
| AI (วางแผน) | GPT-4, ElevenLabs/Botnoi, Replicate — ผ่าน serverless proxy |

## 🚀 เริ่มใช้งาน

```bash
npm install
cp .env.example .env     # แล้วเติมค่าตามต้องการ (ไม่จำเป็นสำหรับรันพื้นฐาน)
npm run dev              # http://localhost:5173
```

Build จริง:

```bash
npm run build
npm run preview
```

### ทดสอบแต่ละ Fidelity Tier

เปิดด้วย query เพื่อบังคับ tier (ไม่ต้องเปลี่ยนเครื่อง):

- `http://localhost:5173/?tier=high` — 3D เต็ม (WebGPU)
- `http://localhost:5173/?tier=standard` — WebGL
- `http://localhost:5173/?tier=basic` — 2D grid

## 📁 โครงสร้าง

ดูแผนผังเต็มและกฎการทำงานใน [AGENTS.md](./AGENTS.md) · สถาปัตยกรรมเชิงลึกใน
[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 🗺️ Roadmap

แบ่งเป็น 5 เฟส ดู [docs/ROADMAP.md](./docs/ROADMAP.md) และ task ที่หยิบทำได้ใน
[docs/AI_TASKS.md](./docs/AI_TASKS.md)

## 📝 ใส่เนื้อหาของคุณ

ตอนนี้ใช้ **ข้อมูลตัวอย่าง (EXAMPLE)** ไว้ก่อน — รายการที่ต้องแก้เองสรุปครบใน
**[docs/USER_TODO.md](./docs/USER_TODO.md)** (เริ่มที่ `src/data/profile.ts` — แก้ไฟล์เดียวจบ)

หาทุกจุดที่ต้องแก้ได้ด้วย:

```bash
git grep -n "EXAMPLE"
```
