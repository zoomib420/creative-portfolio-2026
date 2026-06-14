# ARCHITECTURE.md — สถาปัตยกรรมเชิงเทคนิค

## 1. Multi-tier Fidelity (หัวใจของระบบ)

ระบบตรวจจับความสามารถอุปกรณ์ครั้งเดียวตอน mount แล้วเลือก "ระดับประสบการณ์":

| Tier | เงื่อนไข | ได้อะไร |
| --- | --- | --- |
| `high` | WebGPU + ไม่ใช่เครื่อง low-power | 3D เต็ม, effect หนัก, เป้า 120fps |
| `standard` | WebGL2 (ไม่มี WebGPU) | 3D ลดแสง/เงา/DPR |
| `basic` | ไม่มี WebGL2 / low-power / `prefers-reduced-motion` | 2D grid (ไม่โหลด bundle 3D) |

**โค้ดที่เกี่ยว**
- ตรวจจับ: [`src/lib/capabilities.ts`](../src/lib/capabilities.ts) — dependency-free, async
  (เพราะ `requestAdapter()` ของ WebGPU เป็น async) คืน `Capabilities { tier, hasWebGPU, ... , reason }`
- state: [`src/lib/store.ts`](../src/lib/store.ts) — `tier` ใช้ทั้งแอป, แก้ runtime ได้ (downgrade เมื่อ fps ตก)
- สลับ: [`src/App.tsx`](../src/App.tsx) — `high|standard` → `<Experience3D>` (lazy), `basic` → `<Grid2D>`

**Override สำหรับทดสอบ**: `?tier=high|standard|basic` หรือ `VITE_FORCE_TIER`

### Runtime downgrade (วางแผน — T-13)
ถ้า fps ตกต่อเนื่อง ให้เรียก `store.setTier('standard'|'basic')` เพื่อลดระดับกลางคัน
(ใช้ `AdaptiveDpr`/`AdaptiveEvents` ของ drei ช่วยอยู่แล้วระดับหนึ่ง)

## 2. Rendering layers

```
[ Canvas (R3F)  z-0, position:fixed ]  ← โลก 3D อยู่พื้นหลัง
[ Overlay HTML  z-1 ]                  ← ข้อความ/UI อยู่ใน DOM (คมชัด เลือกได้ a11y)
[ Nav / Badge   z-20+ ]
```

ข้อความสำคัญ **อยู่ใน DOM เสมอ** ไม่วาดเป็น texture ใน canvas (เพื่อ SEO + a11y + ความคม)

## 3. Code-splitting / bundle

- `Experience3D` โหลดด้วย `lazy(() => import(...))` → tier `basic` ไม่ดาวน์โหลด Three.js เลย
- `vite.config.ts` แยก manualChunks: `three`, `r3f` ออกจาก main
- ผลตอนนี้: main ~10kB gzip / three+r3f โหลดเฉพาะเมื่อเข้า 3D

## 4. AI / Secrets architecture (สำคัญด้านความปลอดภัย)

```
Browser (src/)  ──fetch──►  Serverless proxy (/api/*)  ──►  OpenAI / ElevenLabs / Replicate
   ไม่มี secret             ถือ secret จาก env             API จริง
```

- โค้ดใน `src/` **ห้าม** import secret key ใด ๆ — เรียกผ่าน `VITE_API_BASE_URL` เท่านั้น
- secret อยู่ใน `.env` (ฝั่ง server) ตัวแปรที่ขึ้นต้น `VITE_` เท่านั้นที่ถึง client (ดู `.env.example`)
- แนะนำ deploy proxy เป็น Edge/Serverless function (Vercel/Cloudflare/Supabase Edge)
- ใส่ rate-limit + ตรวจ origin ที่ proxy เพื่อกัน abuse คีย์

GenUI 3 รูปแบบ (จากแผน) — implement ทีหลัง:
- **Static GenUI**: frontend คุม layout, AI แค่เลือก component สำเร็จรูป (เริ่มจากอันนี้ก่อน ปลอดภัยสุด)
- **Declarative GenUI**: AI ส่งโครงสร้าง UI (JSON) มา render ภายใต้ constraint/theme
- **Open-ended GenUI**: ขั้นสูงผ่าน MCP — ระวังเรื่องความปลอดภัย sanitize ทุกอย่าง

## 5. Performance budget

| รายการ | เป้า |
| --- | --- |
| FPS (high) | 120+ (อย่างน้อย 60) |
| Raycasting / picking | คุมที่ ~30fps เพื่อประหยัด CPU/GPU |
| Render loop | หยุดทันทีเมื่อเปิด modal / แท็บไม่ active / เปลี่ยนหน้า |
| Asset 3D | GLB/GLTF บีบอัด (Draco/Meshopt + KTX2 texture) |
| Initial JS (basic tier) | < 50kB gzip |
| Lighthouse (mobile) | Perf ≥ 90, A11y ≥ 95 |

เทคนิค: `frameloop="demand"` เมื่อฉากนิ่ง, lazy-load โมเดลต่อห้อง/ต่อ section, dispose
geometry/material/texture เมื่อ unmount, `AdaptiveDpr`/`AdaptiveEvents`

## 6. ตัดสินใจเชิงสถาปัตยกรรมที่บันทึกไว้ (ADR ย่อ)

- **เลือก R3F แทน Three.js ดิบ**: ผูกกับ React lifecycle/Suspense ได้สะอาด จัดการ unmount/dispose ง่าย
- **Tailwind v4 + tokens ใน `@theme`**: theme เดียวคุม vibe ทั้งเว็บ เปลี่ยนอารมณ์ได้จากที่เดียว
- **Zustand**: store เล็ก เบา ไม่ต้อง provider — เหมาะกับ state ข้าม canvas/DOM
- **ข้อความใน DOM ไม่ใช่ canvas**: แลก "ความว้าว" บางส่วน เพื่อ a11y + SEO + ความคมที่สำคัญกว่า
