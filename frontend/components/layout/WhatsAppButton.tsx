import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppButton({ number, message }: { number: string; message: string }) {
  if (!number) return null;

  return (
    <a
      href={whatsappUrl(number, message)}
      target="_blank"
      rel="noreferrer"
      className="group fixed right-4 bottom-7 z-50 flex items-center md:right-7"
      aria-label="Chat with JyothishiUncle on WhatsApp"
    >
      <span className="mr-2 hidden rounded-full bg-surface-high/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary opacity-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition group-hover:opacity-100 md:inline">
        ॐ Chat with JyothishiUncle
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-[0_0_30px_rgba(229,195,120,0.4)] transition hover:scale-105 hover:shadow-[0_0_40px_rgba(229,195,120,0.75)]">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-25" />
        <span className="relative font-serif text-2xl leading-none">ॐ</span>
      </span>
    </a>
  );
}
