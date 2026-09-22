"use client";

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

export function UniverseBackground() {
  return (
    <div className="universe-bg" aria-hidden="true">
      <div className="universe-nebula" />
      <div className="universe-star-drift universe-star-drift-a" />
      <div className="universe-star-drift universe-star-drift-b" />
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
    </div>
  );
}
