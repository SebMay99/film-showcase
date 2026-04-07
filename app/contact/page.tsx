"use client";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

export default function ContactPage() {
  const { t } = useLang();
  const c = t.contact;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError(c.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.15em] text-film-brown uppercase mb-2">{c.section}</p>
        <h1 className="font-serif text-5xl text-film-dark italic">{c.heading}</h1>
      </div>

      {sent ? (
        <div className="border border-film-brown/20 p-8 text-center rounded-sm bg-film-brown/5">
          <CheckCircle size={24} className="text-film-orange mx-auto mb-3" />
          <p className="font-serif text-xl italic text-film-dark mb-1">{c.sent}</p>
          <p className="font-mono text-[11px] tracking-[0.1em] text-film-brown uppercase">{c.soon}</p>
          <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
            className="mt-6 font-mono text-[11px] tracking-[0.1em] uppercase text-film-brown hover:text-film-orange transition-colors underline underline-offset-4">
            {c.another}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-2">{c.name}</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={c.namePlaceholder}
                className="w-full bg-transparent border border-film-brown/30 px-3 py-2.5 font-mono text-sm text-film-dark placeholder:text-film-brown/40 rounded-sm hover:border-film-brown/50 transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-2">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="tu@email.com"
                className="w-full bg-transparent border border-film-brown/30 px-3 py-2.5 font-mono text-sm text-film-dark placeholder:text-film-brown/40 rounded-sm hover:border-film-brown/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-2">{c.message}</label>
            <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              placeholder={c.messagePlaceholder} rows={6}
              className="w-full bg-transparent border border-film-brown/30 px-3 py-2.5 font-mono text-sm text-film-dark placeholder:text-film-brown/40 rounded-sm hover:border-film-brown/50 transition-colors resize-none" />
          </div>

          {error && <p className="font-mono text-[11px] text-red-600 tracking-[0.08em]">{error}</p>}

          <button type="submit" disabled={loading}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase bg-film-dark text-film-cream px-6 py-3 rounded-sm hover:bg-film-brown transition-colors disabled:opacity-60">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? c.sending : c.send}
          </button>
        </form>
      )}

      <div className="mt-16 pt-8 border-t border-film-brown/15">
        <p className="font-mono text-[10px] tracking-[0.12em] text-film-brown uppercase mb-3">{c.alsoOn}</p>
        <div className="flex gap-4">
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
  );
}
