"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { JOURNEY_CREAM, journeyCanvas } from "@/lib/rashis";

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(seed: number, count: number) {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, id) => ({
    id,
    top: `${(rand() * 100).toFixed(2)}%`,
    left: `${(rand() * 100).toFixed(2)}%`,
    size: rand() > 0.88 ? 2.2 : 1,
    delay: `${(rand() * 6).toFixed(2)}s`,
    duration: `${(2.8 + rand() * 3.4).toFixed(2)}s`,
    gold: rand() > 0.75,
  }));
}

const STARS = makeStars(20260918, 70);
const MOTES = [
  { top: "18%", left: "8%", size: 7 },
  { top: "42%", left: "88%", size: 5 },
  { top: "68%", left: "12%", size: 6 },
  { top: "28%", left: "72%", size: 4 },
  { top: "82%", left: "64%", size: 5 },
];

export function UniverseBackground() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const nebulaY = useTransform(scrollY, [0, 2400], [0, 70]);
  const starsY = useTransform(scrollY, [0, 2400], [0, -55]);
  const motesY = useTransform(scrollY, [0, 2400], [0, 120]);
  const canvas = useTransform(scrollYProgress, (progress) => (reduce ? JOURNEY_CREAM : journeyCanvas(progress)));

  return (
    <motion.div className="universe-bg" aria-hidden="true" style={{ backgroundColor: canvas }}>
      <motion.div className="universe-nebula" style={reduce ? undefined : { y: nebulaY }} />
      <motion.div className="universe-star-drift universe-star-drift-a" style={reduce ? undefined : { y: starsY }} />
      <motion.div className="universe-star-drift universe-star-drift-b" style={reduce ? undefined : { y: starsY }} />
      {STARS.map((star) => (
        <span
          key={star.id}
          className={`universe-star ${star.gold ? "universe-star-gold" : ""}`}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
      {!reduce
        ? MOTES.map((mote) => (
            <motion.span
              key={`${mote.top}-${mote.left}`}
              className="absolute rounded-full bg-primary-container/45 blur-[1px]"
              style={{
                top: mote.top,
                left: mote.left,
                width: mote.size,
                height: mote.size,
                y: motesY,
                boxShadow: "0 0 16px rgba(229, 195, 120, 0.55)",
              }}
            />
          ))
        : null}
    </motion.div>
  );
}
