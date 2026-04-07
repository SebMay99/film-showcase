"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getSupabase, type Photo } from "@/lib/supabase";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";

const CATEGORIES = ["todos", "viaje", "retrato", "urbano", "naturaleza", "otro"];

type Props = {
  medium?: "35mm" | "digital";
};

export default function GalleryView({ medium }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload form fields
  const [uploadMedium, setUploadMedium] = useState<"35mm" | "digital">(medium ?? "35mm");
  const [uploadCamera, setUploadCamera] = useState("");
  const [uploadFilmRoll, setUploadFilmRoll] = useState("");
  const [uploadFilmIso, setUploadFilmIso] = useState("");
  const [uploadFilmType, setUploadFilmType] = useState<"color" | "bw">("color");

  const fileRef = useRef<HTMLInputElement>(null);
  const clickCount = useRef(0);

  // When medium prop is provided, the upload always goes to that medium
  const effectiveMedium = medium ?? uploadMedium;

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    let query = getSupabase().from("photos").select("*").order("created_at", { ascending: false });
    if (medium) query = query.eq("medium", medium);
    const { data } = await query;
    setPhotos((data as Photo[]) || []);
    setLoading(false);
  }, [medium]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(null); setShowUploadModal(false); setShowAdminPrompt(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleTitleClick = () => {
    clickCount.current++;
    if (clickCount.current >= 5) { clickCount.current = 0; setShowAdminPrompt(true); }
  };

  const checkAdminKey = () => {
    if (adminKey === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setAdminMode(true); setShowAdminPrompt(false); setAdminKey("");
    } else { alert("Clave incorrecta"); }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || !adminMode) return;
    setUploading(true);
    setShowUploadModal(false);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await getSupabase().storage.from("portfolio").upload(path, file, { contentType: file.type });
      if (error) { console.error(error); continue; }
      const { data: urlData } = getSupabase().storage.from("portfolio").getPublicUrl(path);
      const count = photos.length + 1;
      await getSupabase().from("photos").insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        category: "otro",
        storage_path: path,
        public_url: urlData.publicUrl,
        frame_num: String(count).padStart(2, "0"),
        medium: effectiveMedium,
        camera: uploadCamera || null,
        film_roll: effectiveMedium === "35mm" ? uploadFilmRoll || null : null,
        film_iso: effectiveMedium === "35mm" ? uploadFilmIso || null : null,
        film_type: effectiveMedium === "35mm" ? uploadFilmType : null,
      });
    }
    await fetchPhotos();
    setUploading(false);
    setUploadCamera("");
    setUploadFilmRoll("");
    setUploadFilmIso("");
    setUploadFilmType("color");
  };

  const handleDelete = async (photo: Photo) => {
    if (!adminMode || !confirm(`¿Eliminar "${photo.title}"?`)) return;
    await getSupabase().storage.from("portfolio").remove([photo.storage_path]);
    await getSupabase().from("photos").delete().eq("id", photo.id);
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
  };

  const handleCategoryChange = async (photo: Photo, cat: string) => {
    await getSupabase().from("photos").update({ category: cat }).eq("id", photo.id);
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, category: cat } : p));
  };

  const handleTitleEdit = async (photo: Photo, newTitle: string) => {
    if (!newTitle.trim()) return;
    await getSupabase().from("photos").update({ title: newTitle }).eq("id", photo.id);
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, title: newTitle } : p));
  };

  const filtered = filter === "todos" ? photos : photos.filter(p => p.category === filter);

  const lightboxMeta = lightbox ? [
    lightbox.camera,
    lightbox.medium === "35mm" && lightbox.film_roll,
    lightbox.medium === "35mm" && lightbox.film_iso && `ISO ${lightbox.film_iso}`,
    lightbox.medium === "35mm" && lightbox.film_type && (lightbox.film_type === "bw" ? "B&W" : "Color"),
  ].filter(Boolean).join(" · ") : "";

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleTitleClick}
            className="font-mono text-[10px] tracking-[0.15em] text-film-brown uppercase select-none cursor-default"
          >
            Roll 01 · {String(photos.length).padStart(2, "0")} frames · ISO 400
          </button>
          {adminMode && (
            <span className="font-mono text-[10px] tracking-[0.1em] text-film-orange border border-film-orange/40 px-2 py-0.5 rounded-sm">
              ADMIN
            </span>
          )}
        </div>
        {adminMode && (
          <button
            onClick={() => setShowUploadModal(true)}
            disabled={uploading}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase bg-film-dark text-film-cream px-4 py-2 rounded-sm border border-film-dark hover:bg-film-brown transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Subiendo..." : "Subir fotos"}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleUpload(e.target.files)}
        />
      </div>

      {/* Admin password modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-film-dark/80 z-50 flex items-center justify-center p-4">
          <div className="bg-film-cream border border-film-brown/30 p-6 rounded-sm w-full max-w-sm">
            <p className="font-mono text-[11px] tracking-[0.12em] text-film-brown uppercase mb-4">
              Clave de administrador
            </p>
            <input
              type="password"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkAdminKey()}
              placeholder="••••••••"
              className="w-full bg-transparent border border-film-brown/40 px-3 py-2 font-mono text-sm text-film-dark mb-3 rounded-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={checkAdminKey}
                className="flex-1 bg-film-dark text-film-cream font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-film-brown transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => setShowAdminPrompt(false)}
                className="flex-1 border border-film-brown/40 text-film-dark font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:border-film-brown transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-film-dark/80 z-50 flex items-center justify-center p-4">
          <div className="bg-film-cream border border-film-brown/30 p-6 rounded-sm w-full max-w-sm space-y-4">
            <p className="font-mono text-[11px] tracking-[0.12em] text-film-brown uppercase">Nueva foto</p>

            {/* Medium selector — only shown on the main (all) page */}
            {!medium ? (
              <div>
                <p className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase mb-2">Tipo de cámara</p>
                <div className="flex gap-2">
                  {(["35mm", "digital"] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setUploadMedium(m)}
                      className={`flex-1 font-mono text-[10px] tracking-[0.1em] uppercase py-1.5 border rounded-sm transition-colors ${uploadMedium === m ? "bg-film-dark text-film-cream border-film-dark" : "border-film-brown/40 text-film-dark hover:border-film-brown"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="font-mono text-[10px] tracking-[0.1em] text-film-brown/60 uppercase">
                Subiendo como: <span className="text-film-orange">{medium}</span>
              </p>
            )}

            {/* Camera */}
            <div>
              <label className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase block mb-1">Cámara</label>
              <input
                value={uploadCamera}
                onChange={e => setUploadCamera(e.target.value)}
                placeholder="ej. Canon AE-1"
                className="w-full bg-transparent border border-film-brown/40 px-3 py-1.5 font-mono text-sm text-film-dark rounded-sm"
              />
            </div>

            {/* Film-only fields */}
            {effectiveMedium === "35mm" && (
              <>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase block mb-1">Marca del rollo</label>
                  <input
                    value={uploadFilmRoll}
                    onChange={e => setUploadFilmRoll(e.target.value)}
                    placeholder="ej. Kodak Gold 200"
                    className="w-full bg-transparent border border-film-brown/40 px-3 py-1.5 font-mono text-sm text-film-dark rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase block mb-1">ISO</label>
                  <input
                    value={uploadFilmIso}
                    onChange={e => setUploadFilmIso(e.target.value)}
                    placeholder="ej. 400"
                    className="w-full bg-transparent border border-film-brown/40 px-3 py-1.5 font-mono text-sm text-film-dark rounded-sm"
                  />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase mb-2">Tipo de rollo</p>
                  <div className="flex gap-2">
                    {(["color", "bw"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setUploadFilmType(t)}
                        className={`flex-1 font-mono text-[10px] tracking-[0.1em] uppercase py-1.5 border rounded-sm transition-colors ${uploadFilmType === t ? "bg-film-dark text-film-cream border-film-dark" : "border-film-brown/40 text-film-dark hover:border-film-brown"}`}
                      >
                        {t === "color" ? "Color" : "B&W"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-film-dark text-film-cream font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-film-brown transition-colors"
              >
                <Upload size={12} /> Seleccionar fotos
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 border border-film-brown/40 text-film-dark font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:border-film-brown transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-0 border-b border-film-brown/20 mb-8 overflow-x-auto">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`font-mono text-[11px] tracking-[0.12em] uppercase px-4 py-2 transition-colors whitespace-nowrap
              ${i < CATEGORIES.length - 1 ? "border-r border-film-brown/20" : ""}
              ${filter === cat ? "text-film-dark underline underline-offset-4 decoration-film-brown" : "text-film-brown hover:text-film-orange"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-24">
          <Loader2 size={24} className="animate-spin text-film-brown" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="flex justify-center gap-2 mb-6 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-12 h-9 border border-film-brown rounded-sm bg-film-brown/10" />
            ))}
          </div>
          <p className="font-mono text-[12px] tracking-[0.1em] text-film-brown uppercase leading-relaxed">
            {photos.length === 0 ? "El carrete está en blanco" : "Sin fotos en esta categoría"}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="columns-2 md:columns-3 gap-3">
          {filtered.map(photo => (
            <div key={photo.id} className="break-inside-avoid mb-3 group">
              <div
                className="bg-white border border-film-brown/25 p-1.5 pb-7 cursor-pointer relative"
                onClick={() => setLightbox(photo)}
              >
                <Image
                  src={photo.public_url}
                  alt={photo.title}
                  width={600}
                  height={400}
                  className="w-full h-auto block film-photo"
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between">
                  <span className="font-mono text-[9px] text-film-brown/70 tracking-[0.1em]">{photo.frame_num}</span>
                  <span className="font-mono text-[9px] text-film-orange tracking-[0.08em] uppercase">{photo.category}</span>
                </div>
              </div>
              <div className="mt-1.5 px-0.5">
                {adminMode
                  ? <input
                      defaultValue={photo.title}
                      onBlur={e => handleTitleEdit(photo, e.target.value)}
                      className="font-serif text-sm italic text-film-dark bg-transparent border-b border-transparent hover:border-film-brown/30 focus:border-film-orange w-full outline-none"
                    />
                  : <p className="font-serif text-sm italic text-film-dark truncate">{photo.title}</p>
                }
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-film-brown/60">
                    {new Date(photo.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  {adminMode && (
                    <>
                      <select
                        value={photo.category}
                        onChange={e => handleCategoryChange(photo, e.target.value)}
                        onClick={e => e.stopPropagation()}
                        className="font-mono text-[9px] text-film-orange bg-transparent border-none cursor-pointer outline-none uppercase tracking-wide"
                      >
                        {CATEGORIES.filter(c => c !== "todos").map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDelete(photo)}
                        className="font-mono text-[9px] text-film-brown/50 hover:text-red-600 transition-colors ml-auto"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-film-dark/92 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-9 right-0 font-mono text-[11px] tracking-[0.15em] text-film-tan/70 hover:text-film-cream uppercase flex items-center gap-1"
            >
              <X size={12} /> cerrar
            </button>
            <div className="bg-white p-2 pb-10 relative">
              <Image
                src={lightbox.public_url}
                alt={lightbox.title}
                width={1200}
                height={800}
                className="w-full h-auto block film-photo"
              />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <p className="font-serif text-sm italic text-film-dark">{lightbox.title}</p>
                <p className="font-mono text-[10px] text-film-brown tracking-[0.08em] text-right">
                  {lightbox.frame_num} — {lightbox.category.toUpperCase()}
                  {lightboxMeta && <><br />{lightboxMeta}</>}
                  <br />
                  {new Date(lightbox.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
