"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LAYERS = [
  { x: -9, y: 6, r: -11 },
  { x: 9, y: 6, r: 11 },
  { x: 0, y: 0, r: 0 },
] as const;

function cardNameLines(name: string) {
  const ofMatch = name.match(/^(.+ of)\s+(.+)$/i);
  if (ofMatch) return [ofMatch[1], ofMatch[2]];
  const theMatch = name.match(/^(The)\s+(.+)$/i);
  if (theMatch) {
    const rest = theMatch[2].trim().split(/\s+/);
    if (rest.length >= 2) return [theMatch[1], ...rest];
    if (theMatch[2].length > 7) return [theMatch[1], theMatch[2]];
  }
  return [name];
}

export function TarotFace({ name, size = "pile", caption }: { name: string; size?: "pile" | "panel"; caption?: string }) {
  const tall = size === "panel";
  const lines = cardNameLines(name);
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-[14px] border-2 border-[#e5c378] bg-[#fff8ec] px-1 text-center shadow-[0_10px_22px_-12px_rgba(26,17,6,0.4)] ${
        tall ? "rounded-[18px] px-2.5" : ""
      }`}
    >
      <span className={`font-serif text-[#c9a227] ${tall ? "text-3xl" : "text-lg"}`}>ॐ</span>
      <span
        className={`mt-1 block w-full font-serif font-medium leading-snug text-[#1A1106] [overflow-wrap:normal] [word-break:keep-all] hyphens-none ${
          tall ? "text-[13px] sm:text-[15px]" : "text-[9px] sm:text-[10px]"
        }`}
      >
        {lines.map((line) => (
          <span
            key={line}
            className={`block whitespace-nowrap ${
              line.length > 11 ? (tall ? "text-[11px] sm:text-sm" : "text-[8px] sm:text-[9px]") : ""
            }`}
          >
            {line}
          </span>
        ))}
      </span>
      {caption ? (
        <span className="mt-1 text-[9px] font-bold tracking-[0.12em] text-[#9A6F3A] uppercase">{caption}</span>
      ) : null}
    </div>
  );
}

function CardBack({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center rounded-[14px] border-2 font-serif text-[26px] sm:text-[30px] shadow-[0_10px_18px_-10px_rgba(26,17,6,0.55)] ${
        active ? "border-[#e5c378] bg-[#2a1d0c] text-[#e5c378]" : "border-[#c9a227] bg-[#1A1106] text-[#e5c378]/90"
      }`}
    >
      ॐ
    </span>
  );
}

type Phase = "idle" | "shuffle" | "lift" | "flip" | "shown";

export function TarotPiles({
  labels,
  cards,
  drawKeys,
  onPick,
}: {
  labels: { title: string; role: string }[];
  cards: Record<number, string>;
  drawKeys: Record<number, number>;
  onPick: (pile: number) => void;
}) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const run = useRef(0);
  const prevKeys = useRef(drawKeys);

  useEffect(() => {
    const changed = ([1, 2, 3] as const).find((id) => (drawKeys[id] || 0) !== (prevKeys.current[id] || 0) && (drawKeys[id] || 0) > 0);
    prevKeys.current = drawKeys;
    if (!changed || !cards[changed]) return;
    const token = ++run.current;
    if (reduce) {
      setPlaying(changed);
      setPhase("shown");
      return;
    }
    setPlaying(changed);
    setPhase("shuffle");
    const a = window.setTimeout(() => token === run.current && setPhase("lift"), 880);
    const b = window.setTimeout(() => token === run.current && setPhase("flip"), 1220);
    const c = window.setTimeout(() => token === run.current && setPhase("shown"), 1780);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      window.clearTimeout(c);
    };
  }, [cards, drawKeys, reduce]);

  const busy = phase === "shuffle" || phase === "lift" || phase === "flip";

  return (
    <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
      {labels.map((label, index) => {
        const id = index + 1;
        const cardName = cards[id] || "";
        const live = playing === id && phase !== "idle";
        const shown = Boolean(cardName) && (playing !== id || phase === "flip" || phase === "shown" || phase === "idle");
        const flipped = live ? phase === "flip" || phase === "shown" : shown;
        const lifting = live && (phase === "lift" || phase === "flip" || phase === "shown");
        const on = Boolean(cardName);
        return (
          <button
            key={id}
            type="button"
            disabled={busy}
            onClick={() => onPick(id)}
            className={`rounded-2xl border-2 px-1.5 py-3 transition sm:px-2 ${
              on ? "border-[#e5c378] bg-[#fff8ec]" : "border-[#e5c378]/45 bg-white hover:border-[#e5c378]"
            } disabled:cursor-wait`}
            aria-pressed={on}
          >
            <span className="relative mx-auto block h-[128px] w-[90px] overflow-visible sm:h-[142px] sm:w-[98px]" style={{ perspective: 1000 }}>
              {LAYERS.map((layer, layerIndex) => {
                const front = layerIndex === 2;
                const shuffle = live && phase === "shuffle";
                return (
                  <span key={layerIndex} className="pointer-events-none absolute inset-0 flex items-start justify-center pt-2">
                    <motion.span
                      className="relative h-[104px] w-[70px] sm:h-[116px] sm:w-[78px]"
                      style={{ zIndex: front ? 6 : layerIndex, transformStyle: "preserve-3d" }}
                      initial={{ x: layer.x, y: layer.y, rotate: layer.r, rotateY: 0 }}
                      animate={
                        shuffle
                          ? {
                              x: [layer.x, layer.x - 16, layer.x + 18, layer.x - 12, layer.x],
                              y: [layer.y, layer.y - 24, layer.y - 8, layer.y - 28, lifting && front ? layer.y - 30 : layer.y],
                              rotate: [layer.r, layer.r - 18, layer.r + 20, layer.r - 10, layer.r],
                              rotateY: 0,
                            }
                          : {
                              x: layer.x,
                              y: lifting && front ? layer.y - 30 : layer.y,
                              rotate: layer.r,
                              rotateY: front && flipped ? 180 : 0,
                            }
                      }
                      transition={
                        shuffle
                          ? { duration: 0.85, ease: "easeInOut" }
                          : { duration: front && flipped ? 0.58 : 0.34, ease: "easeOut" }
                      }
                    >
                      {front ? (
                        <>
                          <span className="absolute inset-0 [backface-visibility:hidden]">
                            <CardBack active={on} />
                          </span>
                          <span className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                            {on && cardName ? <TarotFace name={cardName} /> : <CardBack active={on} />}
                          </span>
                        </>
                      ) : (
                        <CardBack active={on} />
                      )}
                    </motion.span>
                  </span>
                );
              })}
            </span>
            <span className="mt-1 block text-center text-[11px] font-bold text-[#1A1106] sm:text-[12px]">{label.title}</span>
            <span className="block text-center text-[10px] font-semibold tracking-[0.12em] text-[#9A6F3A] uppercase">{label.role}</span>
          </button>
        );
      })}
    </div>
  );
}
