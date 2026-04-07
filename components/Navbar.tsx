"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  const links = [
    { href: "/", label: t.nav.all },
    { href: "/35mm", label: "35mm" },
    { href: "/digital", label: "Digital" },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const portfolioLabel =
    pathname === "/35mm" ? "35mm" :
    pathname === "/digital" ? "Digital" :
    "Portfolio";

  return (
    <header className="border-b border-film-brown/20 bg-film-cream/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.15em] text-film-brown uppercase mb-1 flex items-center gap-2">
            <span className="inline-block w-4 h-2 border border-film-brown rounded-[1px] bg-[repeating-linear-gradient(90deg,#8c6e4b_0,#8c6e4b_2px,transparent_2px,transparent_4px)]" />
            {portfolioLabel}
          </p>
          <Link href="/" className="font-serif text-3xl text-film-dark italic hover:text-film-orange transition-colors">
            Seb
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-0">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[11px] tracking-[0.12em] uppercase px-4 py-1 transition-colors
                  ${i < links.length - 1 ? "border-r border-film-brown/20" : ""}
                  ${pathname === link.href
                    ? "text-film-dark underline underline-offset-4 decoration-film-brown"
                    : "text-film-brown hover:text-film-orange"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language toggle */}
          <div className="flex items-center border border-film-brown/30 rounded-sm overflow-hidden shrink-0">
            <button
              onClick={() => setLang("es")}
              className={`font-mono text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 transition-colors ${lang === "es" ? "bg-film-dark text-film-cream" : "text-film-brown hover:text-film-orange"}`}
            >
              ES
            </button>
            <span className="w-px h-3.5 bg-film-brown/30" />
            <button
              onClick={() => setLang("en")}
              className={`font-mono text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 transition-colors ${lang === "en" ? "bg-film-dark text-film-cream" : "text-film-brown hover:text-film-orange"}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
