"use client";
import { useLang } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLang();
  const a = t.about;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.15em] text-film-brown uppercase mb-2">{a.section}</p>
        <h1 className="font-serif text-5xl text-film-dark italic">Seb</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="bg-white border border-film-brown/25 p-2 pb-8 relative mb-4">
            <div className="aspect-[3/4] bg-film-light flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-film-brown/20 flex items-center justify-center">
                  <span className="font-serif text-2xl italic text-film-brown">S</span>
                </div>
                <p className="font-mono text-[9px] tracking-[0.1em] text-film-brown/50 uppercase">{a.photoHere}</p>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
              <span className="font-mono text-[9px] text-film-brown/70 tracking-[0.1em]">01</span>
              <span className="font-mono text-[9px] text-film-orange tracking-[0.08em]">RETRATO</span>
            </div>
          </div>
          <p className="font-mono text-[9px] tracking-[0.1em] text-film-brown/60 uppercase">Mérida, Yucatán · México</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-2">{a.bio}</p>
            <p className="font-serif text-base text-film-dark leading-relaxed">{a.bioText}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-2">{a.equipment}</p>
            <p className="font-serif italic text-film-dark/70 text-sm leading-relaxed">{a.equipmentText}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-3">{a.categories}</p>
            <div className="flex flex-wrap gap-2">
              {a.tags.map(tag => (
                <span key={tag} className="font-mono text-[10px] tracking-[0.1em] uppercase border border-film-brown/30 text-film-brown px-3 py-1 rounded-sm hover:border-film-orange hover:text-film-orange transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-film-brown/15">
            <p className="font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-2">{a.social}</p>
            <div className="flex flex-col gap-1">
              {[
                { label: "Instagram", url: "https://instagram.com/" },
                { label: "GitHub", url: "https://github.com/SebMay99" },
              ].map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[0.08em] text-film-brown hover:text-film-orange transition-colors underline underline-offset-3">
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex items-center gap-2 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex-1 h-8 border border-film-brown rounded-sm bg-film-brown/5" />
        ))}
      </div>
    </div>
  );
}
