"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Animated "tape" — signature Šafy design element.
 * Slides + rotates into place when scrolled into view.
 */
export default function Tape({
  src,
  className = "",
  from = "translateY(60px) rotate(-4deg)",
  to = "rotate(-8deg)",
  delay = 0,
  width = 1200,
  height = 75,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="contents" aria-hidden>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className={`pointer-events-none max-w-none ${visible ? "tape-anim" : "opacity-0"} ${className}`}
        style={{ "--tape-from": from, "--tape-to": to, animationDelay: `${delay}s` }}
      />
    </span>
  );
}
