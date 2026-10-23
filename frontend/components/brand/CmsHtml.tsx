import { markBrandHtml } from "@/lib/brand";

export function CmsHtml({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: markBrandHtml(html) }} />;
}
