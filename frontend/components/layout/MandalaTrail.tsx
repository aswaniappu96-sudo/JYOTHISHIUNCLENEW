"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const YATRA =
  "M 40 8 C 40 64, 16 88, 40 128 C 64 168, 40 192, 40 236 C 40 268, 68 292, 40 336 C 12 380, 40 404, 40 448 C 40 486, 18 508, 40 552 C 62 596, 40 620, 40 664 C 40 702, 70 724, 40 768 C 10 812, 40 836, 40 880 C 40 922, 18 946, 40 990 C 62 1034, 40 1058, 40 1110 C 40 1148, 22 1170, 40 1216";

function TrailColumn({ side }: { side: "left" | "right" }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const raw = useTransform(scrollYProgress, [0, 0.08, 1], [1, 0.92, 0]);
  const offset = useSpring(raw, { stiffness: 70, damping: 28, restDelta: 0.001 });

  return (
    <svg
      aria-hidden
      className={`pointer-events-none fixed top-24 bottom-0 z-[6] hidden w-14 text-primary md:block lg:w-[4.5rem] ${
        side === "left" ? "left-0" : "right-0 -scale-x-100"
      }`}
      fill="none"
      preserveAspectRatio="xMidYMin meet"
      viewBox="0 0 80 1240"
    >
      <motion.path
        d={YATRA}
        pathLength={1}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.15"
        style={{
          opacity: 0.28,
          strokeDasharray: 1,
          strokeDashoffset: reduce ? 0 : offset,
        }}
      />
      {[128, 236, 336, 448, 552, 664, 768, 880, 990, 1110].map((cy) => (
        <motion.circle
          key={cy}
          cx="40"
          cy={cy}
          fill="none"
          pathLength={1}
          r="11"
          stroke="currentColor"
          strokeWidth="0.9"
          style={{
            opacity: 0.26,
            strokeDasharray: 1,
            strokeDashoffset: reduce ? 0 : offset,
          }}
        />
      ))}
    </svg>
  );
}

export function MandalaTrail() {
  return (
    <>
      <TrailColumn side="left" />
      <TrailColumn side="right" />
    </>
  );
}
