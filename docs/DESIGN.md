# DESIGN.md — Vibe, Mood & Emotional Resonance

> เป้าหมายสูงสุดคือ **Emotional Resonance** — ให้ผู้ชม (กรรมการ/ผู้จ้าง) "รู้สึก" และจำตัวตนเราได้
> ไม่ใช่แค่ดูรายการผลงาน

## 1. Core vibe
- **โทน**: ลึก สงบ แต่ล้ำ — อวกาศ/ห้วงดิจิทัลยามค่ำ มี accent เรืองแสง
- **มาตรฐานความลื่น**: Samsy.ninja (gold standard) — ทุก interaction ต้องไม่สะดุด
- **อารมณ์เป้าหมายต่อช่วง**: Hero = ทึ่ง/อยากสำรวจ → Work = ภูมิใจ/น่าเชื่อถือ → About = เชื่อมโยง/ไว้ใจ

## 2. Design tokens (แก้ที่เดียว: `src/index.css` → `@theme`)

| Token | ค่า | ใช้ทำอะไร |
| --- | --- | --- |
| `--color-void` | `#05060a` | พื้นหลังหลัก (ห้วงลึก) |
| `--color-ink` | `#0b0e16` | การ์ด/พื้นผิวยกระดับ |
| `--color-mist` | `#e8eaf2` | ตัวอักษรหลัก |
| `--color-muted` | `#8b90a6` | ตัวอักษรรอง |
| `--color-accent` | `#6ee7ff` | ไฮไลต์หลัก (cyan เรืองแสง) |
| `--color-accent-2` | `#b78bff` | ไฮไลต์รอง (ม่วง) |
| `--color-glow` | `#1a2440` | เส้นขอบ/แสงนวล |

ฟอนต์: display = Space Grotesk, body = Inter, ไทย = IBM Plex Sans Thai
(ปัจจุบันยังไม่ได้โหลด webfont จริง — เป็น task เสริม: เพิ่ม `@font-face`/preconnect และ self-host)

## 3. Motion principles
- **Director's cue**: กล้องเคลื่อนเหมือนผู้กำกับเล่า ไม่ใช่ผู้ใช้ควบคุมอิสระมั่ว
- **Easing**: นุ่ม (ease-out / custom cubic) หลีกเลี่ยง linear
- **ความถี่เสียง (Solfeggio)**: 528Hz, 639Hz, 852Hz ฯลฯ ต่อบริบทห้อง/ผลงาน (`project.ambientHz`)
- **Reduced motion**: ตัด animation ทั้งหมด → ใช้ 2D narrative (ทำให้แล้วใน CSS + tier logic)

## 4. โครงการเล่าเรื่อง (เลือก 1 เป็นหลักใน Phase 1)
1. **3D Walk-through** (แรงบันดาลใจ Hot Dogtor) — อาคาร/ห้องเชื่อมกัน
2. **Scroll-driven story** (Bilal El Moussaoui) — ฉากเปลี่ยนตาม scroll
3. **Floating Island** (Jordan Breton) — เกาะลอยฟ้า fixed points

## 5. Accessibility & inclusivity
- Contrast ตัวอักษรผ่าน WCAG AA (เช็คคู่ accent กับพื้น)
- ทุกข้อความอยู่ใน DOM, มี `alt`/`aria-label`
- คีย์บอร์ดนำทางได้, focus state ชัด
- เคารพ `prefers-reduced-motion` และ data-saver
