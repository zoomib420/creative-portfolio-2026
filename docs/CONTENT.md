# CONTENT.md — เช็คลิสต์เนื้อหาที่ต้องเติม

แทนที่ placeholder ทุกตัว แล้วติ๊ก checkbox (นี่คือ task T-01)

## ข้อมูลตัวตน
- [ ] ชื่อ-สกุล / ชื่อที่ใช้ในวงการ → `[ชื่อคุณ]` ใน `index.html`, `src/components/ui/Nav.tsx`
- [ ] ตำแหน่ง/คำนิยามตัวเอง (เช่น "Creative Technologist")
- [ ] อีเมลติดต่อ → `[อีเมลคุณ]` ใน `Nav`/`Overlay`/`Grid2D`
- [ ] ลิงก์โซเชียล/GitHub/Behance/LinkedIn
- [ ] คำโปรย hero (1–2 ประโยคที่บอกตัวตน)
- [ ] ประวัติย่อ (About) → ดูไฟล์ `Overlay.tsx`, `Grid2D.tsx`

## ผลงาน — แก้ที่ `src/data/projects.ts`
ตอนนี้มี 3 ตัวอย่างตามแผน (beginner/intermediate/advanced) เติม/แก้ให้เป็นของจริง:
- [ ] `title`, `tagline`, `description`
- [ ] `tools[]`, `features[]`
- [ ] `thumbnail` (วางใน `public/`)
- [ ] `model` (.glb บีบอัดแล้ว ใน `public/` — สำหรับห้อง 3D)
- [ ] `ambientHz` (ความถี่ Solfeggio ของห้องนั้น)
- [ ] `links[]`

## สื่อ/asset
- [ ] `public/og-image.png` (1200×630) สำหรับแชร์
- [ ] favicon ปรับเป็นแบรนด์คุณ (`public/favicon.svg` มี placeholder)
- [ ] เสียงพากย์/ดนตรี (จัดการผ่าน task เสียง ไม่ commit ไฟล์ใหญ่ดิบ)

## เกียรติบัตร (ถ้าทำ T-40)
- [ ] รายการ cert + ไฟล์/hash + วิธีตรวจสอบ

> เคล็ด: เนื้อหาเป็น **data-driven** — แก้ที่ `src/data/` ที่เดียว แล้วทั้ง 2D และ 3D อัปเดตตาม
