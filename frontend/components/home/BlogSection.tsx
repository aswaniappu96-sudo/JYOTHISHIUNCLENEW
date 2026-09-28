"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useJuList } from "@/lib/useJuList";
import type { Article } from "@/types/wordpress";

export function BlogSection({ articles }: { articles: Article[] }) {
  const list = useJuList<Article>("/articles", articles);
  return (
    <section className="px-5 py-20">
      <SectionHeading eyebrow="Articles" title="Quiet reading for devotees" />
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
        {list.map((article, index) => (
          <Reveal key={article.id} delay={index * 0.08}>
            <Link href={`/blog/${article.slug}`} className="glass-card block rounded-3xl p-6 transition hover:border-primary/40">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                {article.categories[0] || "Guidance"}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-on-surface">{article.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">{article.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <ButtonLink href="/blog" variant="light">
          All articles
        </ButtonLink>
      </div>
    </section>
  );
}
