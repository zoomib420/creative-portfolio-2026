# DESIGN.md — Vibe, Mood & Emotional Resonance

> เป้าหมายสูงสุดคือ **Emotional Resonance** — ให้ผู้ชม (กรรมการ/ผู้จ้าง) "รู้สึก" และจำตัวตนเราได้
> ไม่ใช่แค่ดูรายการผลงาน

## 1. Core vibe — Cozy / Cute (prozilla.dev-inspired)
- **โทน**: อบอุ่น สว่าง น่ารัก เป็นมิตร — ไดโอรามาของเล่น/diorama, voxel/low-poly,
  เงานุ่ม, ลายเส้นวาดมือ (toon + ink outline) แทนลุค dark/neon เดิม
- **Signature**: navigation แบบ **แผงลิฟต์ (ElevatorNav)** — เลือก "ชั้น" ไปแต่ละ section
- **อารมณ์เป้าหมาย**: น่ารัก เข้าถึงง่าย playful — อยากกดเล่น ไม่ใช่อลังเท่

## 2. Design tokens (แก้ที่เดียว: `src/index.css` → `@theme`)

| Token | ค่า | ใช้ทำอะไร |
| --- | --- | --- |
| `--color-void` | `#fdf3e7` | พื้นหลังหลัก (ครีมอุ่น) |
| `--color-ink` | `#fffaf2` | การ์ด/พื้นผิว |
| `--color-mist` | `#4a3f37` | ตัวอักษรหลัก (น้ำตาลอุ่น) |
| `--color-muted` | `#9b8b7b` | ตัวอักษรรอง |
| `--color-accent` | `#ff9a62` | ไฮไลต์หลัก (coral) |
| `--color-accent-2` | `#56c2b0` | ไฮไลต์รอง (mint) |
| `--color-butter` | `#ffd479` | ไฮไลต์อุ่น |
| `--color-glow` | `#ecdcc6` | เส้นขอบนุ่ม |

ฟอนต์ (โหลดผ่าน Google Fonts ใน `index.html`): display/label = **Baloo 2 + Baloo Thai 2** (มน น่ารัก),
body = **Nunito** + Baloo Thai 2 (ไทย). โทนภาพ: post นุ่ม (bloom เบา + vignette อ่อน), grain บางมาก

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
