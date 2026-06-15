# PROZILLA_PLAN.md — แผน Refocus พอร์ตให้เข้าใกล้ prozilla.dev (เวอร์ชันที่ "ส่งจริงได้")

> เอกสารนี้คือ **แผนแม่บทรอบใหม่** ของโปรเจกต์ เขียนหลังวิเคราะห์ทั้ง prozilla.dev (เว็บอ้างอิง)
> และโค้ดปัจจุบันแบบจริงจัง เป้าหมาย: เปลี่ยนจาก "โปรเจกต์ใหญ่ที่กระจัดกระจายและยังเป็น stub เยอะ"
> ให้เป็น **พอร์ตที่โฟกัส น่ารัก เล่นสนุก และ deploy ขึ้นจริงได้** แบบ prozilla.dev
>
> **ทิศทางที่ผู้ใช้เลือกแล้ว (2026-06-15):**
> 1. **ต่อยอดของเดิม** — เก็บฐาน R3F / multi-tier ไว้ แล้วเติมสิ่งที่ prozilla.dev มีแต่เรายังขาด
> 2. **ตัดเหลือแกนที่ส่งจริง** — โฟกัส + deploy ก่อน ของหนักพักเป็น optional
> 3. **เก็บข้อมูลจริงผ่านแบบสอบถาม** — มีชุดคำถาม intake อยู่ใน §9
>
> เอกสารพี่น้อง: [`AGENTS.md`](../AGENTS.md) · [`DESIGN.md`](./DESIGN.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) ·
> [`ROADMAP.md`](./ROADMAP.md) · [`AI_TASKS.md`](./AI_TASKS.md) · [`USER_TODO.md`](./USER_TODO.md)

---

## สารบัญ
1. [TL;DR](#1-tldr)
2. [prozilla.dev — ถอดรหัสเว็บอ้างอิง](#2-prozilladev--ถอดรหัสเว็บอ้างอิง)
3. [Audit โค้ดปัจจุบัน (ของจริง ไม่ใช่ของในเอกสาร)](#3-audit-โค้ดปัจจุบัน)
4. [ช่องว่าง (Gap analysis)](#4-ช่องว่าง-gap-analysis)
5. [ภาพปลายทาง: "ลิฟต์" คือหัวใจเดียวของทุกอย่าง](#5-ภาพปลายทาง)
6. [การตัดสินใจขอบเขต: In / Out / Later](#6-ขอบเขต-in--out--later)
7. [Information Architecture & ผังชั้น (Floor map)](#7-information-architecture--ผังชั้น)
8. [แผนเทคนิค (จะ "ต่อยอด" ยังไงให้สะอาด)](#8-แผนเทคนิค)
9. [แบบสอบถามเก็บเนื้อหาจริง (Content intake)](#9-แบบสอบถามเก็บเนื้อหาจริง)
10. [Roadmap เป็นเฟส + งานย่อย (PZ-xx) พร้อม acceptance](#10-roadmap--งานย่อย-pz-xx)
11. [ความเสี่ยง & คิดเผื่อ](#11-ความเสี่ยง--คิดเผื่อ)
12. [คำถาม/การตัดสินใจที่ค้างอยู่](#12-คำถามการตัดสินใจที่ค้างอยู่)
13. [Definition of Done & เช็คลิสต์ก่อนปล่อย](#13-definition-of-done)

---

## 1. TL;DR

- prozilla.dev เด่นเพราะ **โฟกัสและจบ**: ลิฟต์ 3D เป็น metaphor นำทาง + 3 หมวดผลงานชัด (โปรเจกต์ / อาร์ต 3D / มินิเกม) + ติดต่อ
- โปรเจกต์เราตอนนี้ **มีของเยอะแต่ครึ่ง ๆ กลาง ๆ**: ลิฟต์เป็นแค่ปุ่ม emoji, มี 3 "โลก" (Island/Walkthrough/Story) ที่ stub, ฟีเจอร์หนัก (AI/WebGPU/blockchain/QR/remix) ยังไม่จบ, **เนื้อหาเป็น EXAMPLE ทั้งหมด**, และ **ยังไม่มี section เกมกับแกลเลอรีอาร์ต** ซึ่งเป็นจุดเด่นของ prozilla
- แผนนี้: **ยุบ 3 โลกให้เหลือ "ลิฟต์" อันเดียวเป็นแกนเดียวของทั้งเว็บ** → เพิ่ม 2 ชั้นใหม่ (**Gallery อาร์ต 3D**, **Arcade มินิเกม**) → เก็บเนื้อหาจริงผ่านแบบสอบถาม → **deploy** → แล้วค่อยเปิดของหนักทีหลังเป็น optional
- ผลลัพธ์: เว็บที่ "เล่นได้ น่ารัก จำได้" และ **ส่งงานจริงได้ใน ~4 เฟส** ไม่ใช่โปรเจกต์ไม่จบ

---

## 2. prozilla.dev — ถอดรหัสเว็บอ้างอิง

| แกน | prozilla.dev ทำอะไร | บทเรียนสำหรับเรา |
| --- | --- | --- |
| **Metaphor นำทาง** | **แผงปุ่มลิฟต์** — เลือก "ชั้น" เพื่อไปแต่ละ section เหมือนลิฟต์จริง | นี่คือ signature — เราต้องทำให้ "เป็นลิฟต์จริง ๆ" ไม่ใช่แค่ปุ่มลอย |
| **Landing** | ฉาก **3D (Three.js)** + โมเดลทำใน **Blender** ปรับ perf ให้ลื่นทุกอุปกรณ์ | เรามี R3F อยู่แล้ว ทำ landing เป็น "ห้องลิฟต์/ปล่องลิฟต์" ได้ |
| **หมวดเนื้อหา** | **Projects** (เว็บ/งานต่าง ๆ) · **3D Art** (แกลเลอรีงานปั้น) · **Minigames** (เกมเล่นบนเว็บ) · **Contact** | เพิ่ม **Gallery** + **Arcade** ให้เรา (ตอนนี้ขาดทั้งคู่) |
| **อารมณ์** | playful, สะอาด, เข้าถึงง่าย (รองรับ touch), กระชับ | ตรงกับ DESIGN.md ของเราอยู่แล้ว (cozy/cute) — รักษาไว้ |
| **Stack** | Express + vanilla JS/HTML/CSS + Three.js + Figma | เราใช้ React/R3F ซึ่ง "เหนือกว่าเชิงโครงสร้าง" อยู่แล้ว ไม่ต้องถอย |

> **หมายเหตุ:** เจ้าของ prozilla.dev ยังมีงานเด่นอีกตัวคือ **ProzillaOS** (os.prozilla.dev) — เดสก์ท็อป OS จำลองบนเว็บ
> ผู้ใช้เลือก **ไม่** เดินทางนั้น (เป็นงานคนละทิศ) เราอ้างอิงเฉพาะ **prozilla.dev (ลิฟต์ portfolio)** เป็นหลัก
>
> **สิ่งที่เราจะ "ไม่ลอก"**: นี่คือ *แรงบันดาลใจ* ไม่ใช่ pixel-clone — เราคงเอกลักษณ์ cozy/cute (ครีมอุ่น, Baloo, เงานุ่ม) ของเราไว้

---

## 3. Audit โค้ดปัจจุบัน

อ่านจากโค้ดจริง ไม่ใช่จากเอกสาร (เอกสารบางจุด optimistic กว่าของจริง)

**โครงที่แข็งแรงอยู่แล้ว (เก็บไว้):**
- Multi-tier fidelity ทำงานจริง: [`capabilities.ts`](../src/lib/capabilities.ts) → `high|standard|basic`, override `?tier=`, cap mobile/หน้าจอเล็ก, runtime fps-downgrade ใน [`Experience3D.tsx`](../src/components/three/Experience3D.tsx) (`PerfGuard`)
- Layer แยกสะอาด: Canvas (z0, fixed) + Overlay HTML (z1) — ข้อความอยู่ใน DOM (ดีต่อ a11y/SEO)
- Data-driven: [`profile.ts`](../src/data/profile.ts) + [`projects.ts`](../src/data/projects.ts) → ใช้ร่วมทั้ง 2D/3D
- 2D fallback ([`Grid2D.tsx`](../src/components/fallback/Grid2D.tsx)) มีจริงและครบ section
- Code-split 3D ผ่าน `lazy()` — tier `basic` ไม่โหลด Three.js
- Look hand-drawn (toon + outline) renderer-agnostic, โทน cozy ใน [`index.css`](../src/index.css) สวยแล้ว
- Lenis + GSAP smooth scroll + camera waypoints ต่อ section

**จุดที่ "ครึ่ง ๆ" / ทำให้เป๋:**
- **ลิฟต์ยังไม่ใช่ลิฟต์**: [`ElevatorNav.tsx`](../src/components/ui/ElevatorNav.tsx) เป็นแค่แผงปุ่ม emoji ลอยขวาจอ (🛗/🏝️) + ปุ่มสลับ 3 โลก — โชว์เฉพาะ tier 3D
- **3 โลกซ้อนกัน**: `PresentationMode = 'island'|'walkthrough'|'scrollstory'` ([`store.ts`](../src/lib/store.ts)) → 3 ฉากใน [`scenes/`](../src/components/three/scenes/) ทุกฉากเป็น procedural v1 (ยังไม่มีโมเดลจริง) ทำให้ "เลือกอะไรก็ได้แต่ไม่มีอันไหนจบ"
- **เนื้อหา EXAMPLE 100%**: profile = "พีรพล จันทร์เกษม", 3 ผลงานตัวอย่าง (AR card/anatomy/avatar), ลิงก์ชี้ `example.com`
- **ยังขาดหมวดของ prozilla**: ไม่มี section เกม, ไม่มีแกลเลอรีอาร์ต 3D
- **section ปัจจุบันมีแค่**: `hero` · `work` · `about` · `contact` (ดู [`Overlay.tsx`](../src/components/ui/Overlay.tsx))
- **ของหนักที่เป็น stub**: AI Guide (UI เสร็จ ไม่มี backend/key), WebGPU shader (renderer มี แต่ shadow บั๊ก ปิดไว้), audio-reactive (v1), blockchain cert / QR talk / image remix = `todo`
- **ยังไม่ deploy**

---

## 4. ช่องว่าง (Gap analysis)

| prozilla.dev มี | เรามี | ต้องทำ |
| --- | --- | --- |
| ลิฟต์ที่ "เป็นลิฟต์จริง" เป็นแกนนำทาง | แผงปุ่ม emoji ลอย ๆ + 3 โลกที่ไม่จบ | **ยุบ 3 โลก → ทำลิฟต์เป็นแกนเดียว** (PZ-A) |
| หมวด **Minigames** เล่นได้ | ไม่มี | **เพิ่มชั้น Arcade + 1–2 เกมเล็ก** (PZ-B2) |
| หมวด **3D Art** แกลเลอรี | ไม่มี | **เพิ่มชั้น Gallery** (PZ-B1) |
| เนื้อหาจริง จบ พร้อมโชว์ | EXAMPLE ล้วน | **intake → เติมจริง** (PZ-C1, §9) |
| ขึ้นจริง (deploy/โดเมน) | ยังไม่ deploy | **deploy** (PZ-D) |
| โฟกัส/จบ | ของหนัก stub เยอะ | **ตัด/พัก optional** (§6) |

---

## 5. ภาพปลายทาง

> **หลักการเดียวที่คุมทั้งเว็บ:** *ทุกอย่างคือ "อาคารหนึ่งหลัง" และผู้ชมขึ้น "ลิฟต์" ไปเยี่ยมแต่ละชั้น*

แทนที่จะมี 3 โลกให้เลือก (ซึ่งทำให้พลังกระจาย) เรารวมเป็น **metaphor เดียว = ลิฟต์ในอาคาร**:

- **Landing = ในห้องลิฟต์** (lobby) — เห็นแผงปุ่มลิฟต์เป็น nav จริง ๆ (ไม่ใช่ปุ่มลอย)
- **กดชั้น = "ขึ้นลิฟต์"** — กล้องไถลขึ้น/ลงตามปล่อง แล้ว "ประตูเปิด" สู่ฉากของชั้นนั้น (เริ่มจากใช้ scroll-section เดิมที่ wire ไว้แล้ว แล้วรีสกินเป็นการเคลื่อนแนวตั้ง)
- **แต่ละชั้น = หนึ่งหมวด** — มีบรรยากาศ/สีของตัวเอง (ผูกกับโทน cozy)
- **2D fallback** — ลิฟต์กลายเป็น "ป้ายบอกชั้น (directory)" + เนื้อหาวางซ้อนแบบ Grid2D เดิม → ไม่มีจอขาว (กฎเหล็ก AGENTS.md §3)

ทำไมดี:
- ได้ signature ของ prozilla เป๊ะ (ลิฟต์ = ทั้ง nav + storytelling + 3D ในอันเดียว)
- **ตัดงานซ้ำซ้อน** (เลิก maintain 3 ฉาก) = สอดคล้องกับ "ตัดเหลือแกนที่ส่งจริง"
- ขยายง่าย: เพิ่มหมวด = เพิ่ม "ชั้น" หนึ่งชั้น (Gallery, Arcade เสียบเข้าโครงนี้พอดี)

> โมเดลลิฟต์ v1 = **procedural** (สร้างห้อง/ปล่องด้วย primitive + toon look) ไม่ผูกกับไฟล์ Blender จริง
> เพื่อ **ไม่บล็อกรอ asset** — เปิดช่องเสียบ GLB จริงไว้ทำทีหลัง (PZ-Later)

---

## 6. ขอบเขต: In / Out / Later

### ✅ IN — แกนที่ต้องส่งจริง (v1)
- ลิฟต์เป็นแกนนำทางเดียว (3D + 2D directory)
- ชั้น: **Lobby · Work · Gallery (อาร์ต 3D) · Arcade (เกม) · About · Contact**
- เนื้อหาจริง (profile + projects + artworks + games) จากแบบสอบถาม §9
- Look cozy ขัดเงา (transition, microcopy, เสียง "ติ๊ง" ลิฟต์แบบ optional เบา ๆ)
- a11y (คีย์บอร์ด, reduced-motion, contrast) + SEO/OG ด้วยตัวตนจริง
- Deploy ขึ้น HTTPS + ทดสอบ 3 tier บนเครื่องจริง

### ⏸️ LATER — ของดีแต่เปิดทีหลัง (optional หลัง deploy)
- **AI Guide** (T-21): เก็บวิดเจ็ตไว้หลัง flag `VITE_ENABLE_AI_GUIDE=false` → ต่อ backend จริงทีหลัง
- โมเดล **Blender ลิฟต์จริง** มาแทน procedural (PZ-Later, ผูก T-14 GLB loader)
- **WebGPU shader** คุณภาพสูง + เปิด shadow กลับ (T-12)
- **เสียงพากย์ / QR Code Talk** (T-23), **AI Image Remix** (T-24)
- Leaderboard ของเกม (ต้องมี backend)
- โหมด "ขึ้นลิฟต์แบบ discrete" (กดแล้วเด้งทีละชั้น แทน scroll อิสระ)

### ❌ OUT — ตัดออกจากแผนนี้ (รื้อทิ้ง/พักไม่มีกำหนด)
- **3 โลก (Island/Walkthrough/Story)** ในรูปแบบ "ให้ผู้ใช้สลับ" — ยุบรวมเป็นลิฟต์ (ดู §11 เรื่องลบโค้ดอย่างปลอดภัย)
- **Blockchain certificate verify** (T-40) — เกินความจำเป็นของพอร์ต ตัดออก (เก็บไอเดียไว้ใน ROADMAP ได้)
- audio-reactive crystal แบบซับซ้อน — ลดเหลือ ambient เบา ๆ optional

> **ตารางสถานะ task เดิม → แผนนี้** (ดู AI_TASKS.md):
> T-10 ✅ใช้ต่อ · T-11 ⏸️ลดเหลือ ambient · T-12 ⏸️Later · T-13 ✅ใช้ต่อ · T-14 ⏸️Later(ผูก Gallery/Blender) ·
> T-20/21/22 ⏸️Later(AI) · T-23/24 ⏸️Later · T-30/31/32 ❌ยุบเป็นลิฟต์ · T-40 ❌Out · T-50 ✅กลายเป็น PZ-D

---

## 7. Information Architecture & ผังชั้น

ผังชั้นแนะนำ (ยืดหยุ่นได้ตามเนื้อหาจริง):

| ชั้น | id | ป้าย | หมวด | ฉาก 3D | 2D fallback |
| --- | --- | --- | --- | --- | --- |
| **L** | `lobby` | Lobby | intro/ตัวตน + hero | ในห้องลิฟต์ | hero block |
| **1** | `work` | Work | โปรเจกต์ | ห้อง/ผนังโชว์การ์ด | grid การ์ด (มีอยู่แล้ว) |
| **2** | `gallery` | Gallery | อาร์ต 3D | แท่นวางงานปั้น หมุนดูได้ | gallery รูป + lightbox |
| **3** | `arcade` | Arcade | มินิเกม | ตู้เกม/จอเรืองแสง | การ์ดเกม → เล่นเต็มจอ |
| **4** | `about` | About | ประวัติ | — (โอเวอร์เลย์) | about block (มีอยู่แล้ว) |
| **5** | `contact` | Contact | ติดต่อ | — (โอเวอร์เลย์) | footer (มีอยู่แล้ว) |

> ปรับได้: ถ้าอยากกระชับแบบ prozilla อาจรวม **About+Contact** เป็นชั้นเดียว หรือย้าย About ไปไว้ใน Lobby
> → เป็น "การตัดสินใจเนื้อหา" ใน §12
>
> **อัปเดต (ทำจริง 2026-06-15):** v1 ตัด **Gallery** ออก → เหลือ **L · Work · Arcade · About · Contact** (Arcade เลื่อนขึ้นเป็นชั้น 2) ดู `src/data/floors.ts`

**Single source of truth ใหม่:** สร้าง `src/data/floors.ts` ที่ระบุชั้นทั้งหมด (id, ป้าย, เลข, สี/อารมณ์, ความถี่เสียง) แล้วให้
ทั้ง **ElevatorNav**, **ฉาก 3D (ปล่องลิฟต์)** และ **2D directory** อ่านจากที่เดียว — แก้ชั้นที่เดียวเปลี่ยนทั้งเว็บ (สไตล์เดียวกับ data-driven เดิม)

---

## 8. แผนเทคนิค

ทำแบบ **surgical** — ต่อยอด ไม่รื้อโลก (ตาม AGENTS.md §5)

### 8.1 Data layer (ทำก่อน เพราะทุกอย่างพึ่งมัน)
- `src/data/floors.ts` ⟵ ใหม่ — นิยามชั้น (เป็น SoT ของ nav/ฉาก/fallback)
- `src/data/artworks.ts` ⟵ ใหม่ — `Artwork { id, title, year, medium, tools[], blurb, model?, thumbnail, links? }`
- `src/data/games.ts` ⟵ ใหม่ — `GameMeta { id, title, blurb, thumbnail, component: lazy(), reducedMotionOk, keyboard }`
- `projects.ts` / `profile.ts` ⟵ คงเดิม (เติมของจริงทีหลัง)

### 8.2 State (store.ts)
- **ลบ** `PresentationMode` + `presentationMode`/`setPresentationMode` (ไม่มี 3 โลกแล้ว)
- **เพิ่ม** (ถ้าจะทำ discrete-floor ทีหลัง) `targetFloor` — v1 ใช้ `activeSection` เดิมได้เลย
- เพิ่ม `activeGameId` (คล้าย `activeProjectId`) สำหรับเปิดเกมเต็มจอ

### 8.3 ฉาก 3D (รวมเหลือหนึ่ง)
- **ลบ** [`scenes/IslandScene`](../src/components/three/scenes/IslandScene.tsx), `WalkthroughScene`, `ScrollstoryScene` + [`Island.tsx`](../src/components/three/Island.tsx) ที่ไม่ใช้แล้ว
- **เพิ่ม** `components/three/ElevatorScene.tsx` — ห้องลิฟต์ + ปล่อง + "ชั้น" ตาม `floors.ts`; กล้องไถลแนวตั้งตาม scroll waypoint (ใช้ [`scroll.ts`](../src/lib/scroll.ts) เดิม รีแมป waypoint เป็นแกน Y)
- `Experience3D.tsx`: เอา `mode` switch ออก เหลือ `<ElevatorScene/>` อันเดียว (โค้ดลดลง = perf/bundle ดีขึ้น)
- คง toon/outline + PostFX (bloom/grain/vignette) เดิม

### 8.4 ชั้นใหม่
- **Gallery (PZ-B1)**: `components/three/floors/GalleryFloor.tsx` — แท่นวาง artwork (อ่านจาก `artworks.ts`), คลิกเปิด `ArtworkModal` (orbit ดูใกล้ + ข้อมูล); โหลด GLB แบบ lazy ต่อชิ้น + dispose ตอน unmount (ผูก T-14: Draco/Meshopt + KTX2); **2D**: grid รูป + lightbox
- **Arcade (PZ-B2)**: `components/ui/Arcade.tsx` อ่าน `games.ts`; แต่ละเกม **lazy()** (code-split, ไม่ถ่วง initial/basic); เปิดเล่นใน `GameModal` เต็มจอ
  - v1 ทำ **1–2 เกมเล็กมาก ไม่ต้องมี backend**: เช่น *Memory match* (การ์ดธีมงานเรา) หรือ *typing/avoid* สั้น ๆ
  - กติกาเกม: เล่นด้วยคีย์บอร์ดได้, มี pause-on-blur, มี variant สำหรับ reduced-motion, ไม่มีไฟล์ asset ใหญ่
  - **2D/basic**: การ์ดเกมยังเล่นได้ (เกมเป็น canvas/DOM ล้วน ไม่พึ่ง WebGL)

### 8.5 Nav (ลิฟต์จริง)
- `ElevatorNav.tsx`: อ่านชั้นจาก `floors.ts`, ดีไซน์ใหม่ให้เป็น **แผงปุ่มลิฟต์จริง** (ปุ่มกลมเรียงแนวตั้ง, ไฟชั้นปัจจุบันติด, ป้าย "▲ กำลังขึ้น"), เอาปุ่มสลับโลกออก
- โชว์บนทุก tier (เวอร์ชัน 2D = directory ง่าย ๆ) — ปัจจุบันโชว์เฉพาะ 3D
- `Nav.tsx` ด้านบน: เพิ่มลิงก์ Gallery/Arcade ให้ครบชั้น

### 8.6 Routing
- v1: คง **single-page + hash/scroll** (Lenis+GSAP) — รื้อน้อยสุด, ลิฟต์ = การเคลื่อนกล้องแนวตั้งระหว่าง section
- เพิ่ม deep-link ราย artwork/เกมได้ทีหลัง (`?art=` / `?game=`) — optional

### 8.7 Performance / bundle (คุมตาม ARCHITECTURE.md §5)
- ทุกเกม + GLB อาร์ต = lazy/code-split; basic tier ยังไม่โหลด 3D
- เป้าเดิม: initial JS (basic) < 50kB gzip, Lighthouse mobile Perf ≥90 / A11y ≥95
- `frameloop="demand"` เมื่อฉากนิ่ง/เปิด modal; dispose ทุก geometry/material/texture

---

## 9. แบบสอบถามเก็บเนื้อหาจริง

> ตอบเป็นข้อ ๆ ในแชตได้เลย (ข้ามข้อที่ยังไม่มีได้ ผมจะใส่ placeholder ที่ดูสมจริงไว้ก่อนแล้วมาร์คให้)
> ผมจะแปลงคำตอบลง `profile.ts` / `projects.ts` / `artworks.ts` / `games.ts` + `index.html` (SEO) ให้เอง

### A. ตัวตน & การวางตำแหน่ง
1. ชื่อจริง + ชื่อที่ใช้ในวงการ/handle (เช่นบน nav) =
2. ตำแหน่ง/นิยามตัวเองสั้น ๆ (เช่น "Creative Technologist", "Game Dev", "3D Artist") =
3. คำโปรย hero 1–2 ประโยค ("ผมทำ ___ ให้ ___") =
4. ประวัติย่อ (About) 3–5 บรรทัด =
5. เมือง/ประเทศ + อีเมลติดต่อ =
6. โทนเสียง: เป็นทางการ / กันเอง / ตลก / มินิมอล ? =

### B. โปรเจกต์ (Work) — ตอบซ้ำต่อชิ้น (แนะนำ 3–6 ชิ้น)
ต่อชิ้น: `ชื่อ | ปี | บทบาท | 1 บรรทัดสรุป | คำอธิบาย 2–3 ประโยค | เครื่องมือ[] | ไฮไลต์ 3 ข้อ | ลิงก์ (live/source/case) | มีรูปไหม`

### C. อาร์ต 3D (Gallery) — ตอบซ้ำต่อชิ้น
ต่อชิ้น: `ชื่อ | ปี | สื่อ/เทคนิค (เช่น Blender sculpt, voxel) | คำบรรยายสั้น | มีไฟล์ .glb ไหม (หรือให้ทำ procedural) | รูป preview`

### D. มินิเกม (Arcade)
1. อยากมีกี่เกมใน v1 (แนะนำ 1–2) =
2. ธีม/ไอเดียเกม (หรือให้ผมเสนอ เช่น memory match ธีมผลงานคุณ) =
3. อยากได้ระบบคะแนน/แชร์ไหม (ถ้าใช่ = ต้อง backend → จัดเป็น Later) =

### E. แบรนด์ & สื่อ
1. มีโลโก้/favicon/สีประจำตัวไหม (ตอนนี้ใช้ครีม+coral+mint) =
2. มีรูป/วิดีโอผลงานไหม (ส่งไฟล์ หรือบอกให้ผมเว้นช่องไว้) =
3. ต้องการ resume.pdf ไหม =

### F. โซเชียล & ปลายทาง
1. ลิงก์จริง: GitHub / Behance / LinkedIn / IG / X / อื่น ๆ =
2. โดเมนที่จะใช้ (มีแล้ว/ยัง) =
3. host ที่อยากใช้ (แนะนำ Vercel เพราะรองรับ `api/` ทันที) =

---

## 10. Roadmap & งานย่อย (PZ-xx)

`[ ]` ยังไม่เริ่ม · `[~]` กำลังทำ · `[x]` เสร็จ — แต่ละ task ต้องทำให้ `npm run build` ผ่านก่อนปิด

### Phase A — Refocus foundation (กระดูกสันหลัง) ✅ เสร็จ + verify แล้ว (branch `refocus/elevator-phase-a`)
- [x] **PZ-A1** สร้าง `src/data/floors.ts` เป็น SoT ของชั้น — ElevatorNav + ElevatorScene อ่านจากไฟล์นี้ (`navFloors`/`floorsById`/`FLOOR_SPACING`)
- [x] **PZ-A2** ยุบ 3 โลก → `ElevatorScene.tsx` เดียว; ลบ `PresentationMode`, 3 scenes, `Island.tsx`; เอาปุ่มสลับโลกออก — *verify:* `npm run build` + `npm run lint` ผ่าน, ไม่มี dead import, ไม่มีจอขาวทั้ง high/basic
- [x] **PZ-A3** ElevatorNav data-driven + โชว์ทุก tier (2D ด้วย) — *verify:* บน `?tier=basic` panel มองเห็น (floors 5·4·1·L) คลิกแล้วเลื่อนถึง section, `aria-current` อัปเดตถูก
- [x] **PZ-A4** camera waypoint แนวตั้ง ("ขึ้นลิฟต์") ใน `scroll.ts` + cabin car ไถลตามชั้น — *verify:* high tier เห็นห้องลิฟต์+โคมไฟในปล่อง, กล้องไถลตาม section; reduced-motion branch เดิมยังอยู่
> หมายเหตุ: ภาพ cabin/ปล่องทำงานดีระดับ v1 — โพลิช composition/แสง + เสียง "ติ๊ง" ยกไป **PZ-C2**; โมเดล Blender จริงเป็น **PZ-L1**

### Phase B — ชั้นใหม่ (อุดช่องว่าง prozilla) ✅ Arcade เสร็จ · Gallery ตัดออก
- [x] **PZ-B2** ชั้น **Arcade** เสร็จ: `data/games.ts` + `GameCard` + `GameModal` + ห้อง arcade ในฉาก 3D คลิกได้ + **2 เกม lazy** (`RoosterRun`, `MemoryMatch`) — code-split จริง (chunk แยก ~2–5kB), เปิดเล่นใน modal เต็มจอ, Esc ปิด + lock scroll, ambient 432Hz ตอนเล่น, เล่นบน basic tier ได้
  - ค้าง (polish, ยกไป PZ-C2): pause-on-blur, reduced-motion variant ของ `RoosterRun` (ตอนนี้ `reducedMotionOk:false`)
- [x] **Particles** ambient ในฉาก 3D (เพิ่มเข้ามาระหว่างทาง)
- [~] **PZ-B1** ชั้น **Gallery (อาร์ต 3D)** — **ตัดออกจาก v1** floors เหลือ L/Work/Arcade/About/Contact; `floors.ts` ยังรองรับถ้าจะกลับมาเพิ่มภายหลัง

### Phase C — เนื้อหาจริง & โพลิช
- [ ] **PZ-C1** รัน intake (§9) → เติม `profile/projects/artworks/games` + `index.html`/SEO/OG/JSON-LD ด้วยตัวตนจริง — *Acceptance:* `git grep EXAMPLE` ไม่เหลือ (หรือเหลือเฉพาะที่ผู้ใช้ยังไม่ส่งและมาร์คชัด)
- [ ] **PZ-C2** โพลิช cozy: transition ลิฟต์, เสียง "ติ๊ง" optional (หลัง gesture), microcopy, empty states — *Acceptance:* ไม่มีสะดุดทางสายตา, เสียงเริ่มหลัง user gesture เท่านั้น
- [ ] **PZ-C3** ภาพ/asset: favicon, og-image 1200×630, thumbnail ผลงาน/อาร์ต — *Acceptance:* แชร์ลิงก์แล้ว preview ขึ้นถูก

### Phase D — Ship
- [ ] **PZ-D1** Deploy Vercel + env บน dashboard (ไม่ commit `.env`) — *Acceptance:* เว็บ live ผ่าน HTTPS
- [ ] **PZ-D2** ทดสอบ `?tier=high|standard|basic` บนเครื่อง/มือถือจริง + Lighthouse — *Acceptance:* mobile Perf ≥90, A11y ≥95, ไม่มี error console
- [ ] **PZ-D3** (ถ้ามีโดเมน) custom domain + อัปเดต `VITE_SITE_URL`/canonical/sitemap — *Acceptance:* โดเมนจริงเสิร์ฟถูก, SEO ชี้โดเมนจริง

### Later (หลัง ship — optional)
- [ ] **PZ-L1** เสียบโมเดล Blender ลิฟต์จริงแทน procedural (ผูก T-14)
- [ ] **PZ-L2** เปิด AI Guide จริง (T-20/21) + rate-limit/origin allowlist
- [ ] **PZ-L3** WebGPU shader + เปิด shadow กลับ (T-12)
- [ ] **PZ-L4** discrete-floor mode, deep-link `?art=`/`?game=`, leaderboard

**ลำดับแนะนำ:** A → B → C → D (ship) → L ตามใจ
**ทางลัดถ้าอยากเห็นเร็ว:** A1–A3 ก่อน (เห็นลิฟต์ใหม่ทันที) แล้ว C1 (เนื้อหาจริง) สลับมาก่อน B ได้ ถ้าอยากโชว์ตัวตนก่อนเพิ่มหมวด

---

## 11. ความเสี่ยง & คิดเผื่อ

| ความเสี่ยง | ผลถ้าไม่กัน | วิธีกัน |
| --- | --- | --- |
| **ลบ 3 โลกทิ้งงานเดิม** | เสียโค้ดที่เคยทำ/ผู้ใช้เสียดาย | ทำใน branch แยก, ขอ **ยืนยันก่อนลบ** (§12), โค้ดอยู่ใน git history เรียกคืนได้ |
| **รอโมเดล Blender ลิฟต์** บล็อกงาน | ค้างรอ asset | v1 ใช้ **procedural** เปิดช่องเสียบ GLB ทีหลัง (PZ-L1) |
| **เกมบานปลาย** | ไม่จบสักเกม | cap v1 ที่ **2 เกมเล็ก ไม่มี backend**; leaderboard = Later |
| **เนื้อหาเป็น critical path** | เว็บสวยแต่ว่างเปล่า ไม่น่าเชื่อ | intake §9 ทำให้เป็นระบบ; ถ้ายังไม่มี ใช้ placeholder ที่มาร์คชัด |
| **perf มือถือกับลิฟต์ 3D** | กระตุก/ร้อน | cap tier (มีแล้ว), `frameloop="demand"`, lazy ทุกอย่าง, ทดสอบ coarse-pointer |
| **a11y ของเกม** | คนคีย์บอร์ด/สกรีนรีดเดอร์เล่นไม่ได้ | บังคับ keyboard + reduced-motion variant ตั้งแต่ออกแบบ |
| **bundle โตจาก games/art** | initial ช้า | enforce lazy + ตรวจ `manualChunks`, งบ <50kB basic |
| **ลอก prozilla เกินไป** | เสียเอกลักษณ์ตัวเอง | คงโทน cozy ของเรา (Baloo/ครีม/มินต์) — อ้างอิงไม่ใช่ clone |
| **autoplay เสียง** | โดนเบราว์เซอร์บล็อก | เริ่มเสียงหลัง `hasUserGesture` (มีแล้ว) |
| **เอกสารเก่าขัดกับแผนใหม่** | AI ตัวอื่นทำตามของเก่า | อัปเดต ROADMAP/AI_TASKS ให้ชี้มาที่ไฟล์นี้ (PZ-A เริ่ม) |

**คิดเผื่ออนาคต (ออกแบบเผื่อแต่ยังไม่ทำ):**
- `floors.ts` เป็น SoT → เพิ่มชั้นใหม่ในอนาคต (เช่น Blog, Lab) = เสียบชั้นเดียว
- `games.ts`/`artworks.ts` ใช้ interface + lazy → ใส่ของเพิ่มไม่กระทบ core
- AI Guide เก็บไว้หลัง flag → เปิดได้ทันทีเมื่อพร้อม backend ไม่ต้องรื้อ
- เผื่อช่อง deep-link/แชร์ราย artwork/เกม สำหรับ SEO/โซเชียลทีหลัง

---

## 12. คำถาม/การตัดสินใจที่ค้างอยู่

ต้องการคำยืนยัน/เลือกก่อนลงมือ Phase A:

1. **ยุบ 3 โลก (Island/Walkthrough/Story) ทิ้งจริงไหม?** แผนนี้แนะนำ "ยุบเป็นลิฟต์เดียว" (จะลบ 3 scenes + Island.tsx) — โอเคไหม หรืออยากเก็บ Island ไว้เป็น "ชั้นพิเศษ"?
2. **ลิฟต์ v1 ใช้ procedural ก่อน** (ไม่รอไฟล์ Blender) — รับได้ไหม?
3. **ผังชั้น** ตาม §7 (L/Work/Gallery/Arcade/About/Contact) — เอาตามนี้ หรือรวม About+Contact / ตัดชั้นไหนออก?
4. **จำนวน/ธีมมินิเกม** v1 — ให้ผมเสนอ 1–2 เกม หรือมีไอเดียอยู่แล้ว?
5. **AI Guide** — พักไว้หลัง flag (แนะนำ) หรืออยากเอาวิดเจ็ตออกจากหน้าจอไปเลย?
6. **เริ่มลงมือเลยหรือยัง** — เอกสารนี้คือ "แผน" ผมยังไม่แตะโค้ด รอบหน้าบอก "เริ่ม Phase A" ได้เลย

---

## 13. Definition of Done

เว็บ "เสร็จพร้อมโชว์" เมื่อครบทุกข้อ:
- [ ] ลิฟต์เป็นแกนนำทางเดียว ใช้ได้ทั้ง 3D และ 2D (ไม่มีจอขาวทุก tier)
- [ ] ครบชั้น: Lobby · Work · Gallery · Arcade · About · Contact
- [ ] มีอย่างน้อย: โปรเจกต์จริง ≥3, อาร์ต ≥3, เกมเล่นได้ ≥1
- [ ] `git grep EXAMPLE` ไม่เหลือ (หรือเหลือเฉพาะที่มาร์ค "รอผู้ใช้")
- [ ] keyboard นำทาง/เล่นเกมได้, reduced-motion เคารพ, contrast ผ่าน AA
- [ ] เกม + GLB อาร์ต lazy (ไม่อยู่ใน main chunk), basic tier ไม่โหลด 3D
- [ ] `npm run build` + `npm run lint` ผ่าน
- [ ] deploy live HTTPS, Lighthouse mobile Perf ≥90 / A11y ≥95, ทดสอบ 3 tier บนเครื่องจริง
- [ ] SEO/OG/JSON-LD ใช้ตัวตน+โดเมนจริง

---

> อัปเดตล่าสุด: 2026-06-15 · เจ้าของแผน: refocus ให้เข้าใกล้ prozilla.dev แบบ "ส่งจริงได้"
> ขั้นต่อไป: ตอบ §12 (โดยเฉพาะข้อ 1–3) แล้วสั่ง **"เริ่ม Phase A"**
