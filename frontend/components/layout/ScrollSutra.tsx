"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollSutra() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.001 });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[2px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#c4a227]/45" />
      {reduce ? null : (
        <motion.div
          className="absolute inset-0 origin-left bg-linear-to-r from-[#e5c378] via-[#c4a227] to-[#8b6414]"
          style={{
            scaleX,
            boxShadow: "0 0 10px rgba(196, 162, 39, 0.55)",
          }}
        />
      )}
    </div>
  );
}
