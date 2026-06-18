import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../lib/store';

const CERTS = [
  {
    file: 'cert-thm-pre-security.png',
    title: 'Pre Security Learning Path',
    issuer: 'TryHackMe',
    date: '13 Apr 2026',
  },
  {
    file: 'cert-fs-fundamentals.png',
    title: 'พื้นฐาน Cybersecurity ที่สำคัญ',
    issuer: 'FutureSkill',
    date: '02 Apr 2026',
  },
  {
    file: 'cert-fs-cryptography.png',
    title: 'การเข้ารหัสและมาตรการพื้นฐาน',
    issuer: 'FutureSkill',
    date: '03 Apr 2026',
  },
  {
    file: 'cert-fs-network-security.png',
    title: 'Network Security & Penetration Testing',
    issuer: 'FutureSkill',
    date: '04 Apr 2026',
  },
  {
    file: 'cert-fs-app-cloud-security.png',
    title: 'Cybersecurity สำหรับแอปพลิเคชันและคลาวด์',
    issuer: 'FutureSkill',
    date: '05 Apr 2026',
  },
  {
    file: 'cert-fs-grc.png',
    title: 'GRC — กำกับดูแล บริหารความเสี่ยง และปฏิบัติตามกฎ',
    issuer: 'FutureSkill',
    date: '06 Apr 2026',
  },
  {
    file: 'cert-fs-incident-forensics.png',
    title: 'Incident Response & Digital Forensics',
    issuer: 'FutureSkill',
    date: '06 Apr 2026',
  },
  {
    file: 'cert-fs-ethical-hacking.png',
    title: 'Ethical Hacking & Penetration Testing',
    issuer: 'FutureSkill',
    date: '09 Apr 2026',
  },
];

export function CertViewer() {
  const roomPanel = useAppStore((s) => s.roomPanel);
  const close = useAppStore((s) => s.closeRoomPanel);
  const [idx, setIdx] = useState(0);
  const open = roomPanel === 'about-certs';

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + CERTS.length) % CERTS.length),
    [],
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % CERTS.length),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    const prev_ = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev_;
    };
  }, [open, close, prev, next]);

  if (!open) return null;

  const cert = CERTS[idx];

  return (
    <div
      className="content-layer fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 sm:p-10"
      role="dialog"
      aria-modal="true"
      aria-label="ใบรับรอง"
      onClick={close}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label="ปิด"
          className="absolute -top-10 right-0 text-2xl leading-none text-white/60 transition-colors hover:text-white"
        >
          ✕
        </button>

        {/* Frame — gold gradient border + dark inner bevel */}
        <div
          className="w-full"
          style={{
            padding: '14px',
            background:
              'linear-gradient(135deg, #b8860b 0%, #daa520 25%, #8b6914 50%, #daa520 75%, #b8860b 100%)',
            borderRadius: '3px',
            boxShadow:
              '0 0 0 3px #3d281c, 0 25px 70px rgba(0,0,0,0.85)',
          }}
        >
          {/* Inner bevel line */}
          <div
            className="w-full"
            style={{
              border: '3px solid #5a3a1a',
              outline: '2px solid rgba(255,215,0,0.4)',
              outlineOffset: '-1px',
            }}
          >
            <img
              src={`/certs/${cert.file}`}
              alt={cert.title}
              className="block h-auto w-full select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Nav + info */}
        <div className="flex w-full items-center justify-between gap-3">
          <button
            onClick={prev}
            aria-label="ใบก่อนหน้า"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/25"
          >
            ‹
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-[var(--font-display)] text-base font-bold leading-snug text-[#ffd479]">
              {cert.title}
            </p>
            <p className="mt-0.5 text-sm text-white/50">
              {cert.issuer} · {cert.date}
            </p>
            <p className="mt-1 text-xs text-white/30">
              {idx + 1} / {CERTS.length}
            </p>
          </div>

          <button
            onClick={next}
            aria-label="ใบถัดไป"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/25"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
