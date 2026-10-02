import type { ReactNode } from "react";

export function HScroll({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-0 md:px-0">
      {children}
    </div>
  );
}
