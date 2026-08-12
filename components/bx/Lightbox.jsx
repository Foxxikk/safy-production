"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";

/** Fullscreen prohlížeč fotek — šipky, ESC, swipe na mobilu. */
export default function Lightbox({ images, index, onClose, onIndex, label = "" }) {
  const open = index !== null && index >= 0;
  const touchX = useRef(null);

  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex]
  );
  const next = useCallback(
    () => onIndex((index + 1) % images.length),
    [index, images.length, onIndex]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, prev, next]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 60) prev();
        if (dx < -60) next();
        touchX.current = null;
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Zavřít"
        className="absolute top-5 right-5 z-10 text-white/70 hover:text-white text-3xl leading-none p-3"
      >
        ×
      </button>

      <span className="absolute top-7 left-6 text-white/50 text-sm tracking-widest">
        {index + 1} / {images.length}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Předchozí"
        className="absolute left-2 md:left-6 z-10 text-white/60 hover:text-white text-5xl px-4 py-6"
      >
        ‹
      </button>

      <div
        className="relative w-[92vw] h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`${label} ${index + 1}`}
          fill
          sizes="92vw"
          className="object-contain"
          priority
        />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Další"
        className="absolute right-2 md:right-6 z-10 text-white/60 hover:text-white text-5xl px-4 py-6"
      >
        ›
      </button>
    </div>
  );
}
