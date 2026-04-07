"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getSupabase, type Photo } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";
import Image from "next/image";
import { X, Upload, Loader2, Pencil } from "lucide-react";

const CATEGORY_KEYS = ["todos", "viaje", "retrato", "urbano", "naturaleza", "otro"] as const;
type CategoryKey = typeof CATEGORY_KEYS[number];

const today = () => new Date().toISOString().slice(0, 10);

const getDisplayDate = (photo: Photo) =>
  new Date(photo.shot_at ?? photo.created_at).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

const getPhotoMeta = (photo: Photo) =>
  [
    photo.camera,
    photo.medium === "35mm" && photo.film_roll,
    photo.medium === "35mm" && photo.film_iso && `ISO ${photo.film_iso}`,
    photo.medium === "35mm" && photo.film_type && (photo.film_type === "bw" ? "B&W" : "Color"),
  ].filter(Boolean).join(" · ");

type Props = { medium?: "35mm" | "digital" };

type EditForm = {
  title: string;
  description: string;
  shot_at: string;
  category: string;
  camera: string;
  film_roll: string;
  film_iso: string;
  film_type: "color" | "bw";
};

export default function GalleryView({ medium }: Props) {
  const { t } = useLang();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CategoryKey>("todos");
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Per-photo edit modal
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "", description: "", shot_at: today(), category: "otro",
    camera: "", film_roll: "", film_iso: "", film_type: "color",
  });

  // Upload form
  const [uploadMedium, setUploadMedium] = useState<"35mm" | "digital">(medium ?? "35mm");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadDate, setUploadDate] = useState(today());
  const [uploadCamera, setUploadCamera] = useState("");
  const [uploadFilmRoll, setUploadFilmRoll] = useState("");
  const [uploadFilmIso, setUploadFilmIso] = useState("");
  const [uploadFilmType, setUploadFilmType] = useState<"color" | "bw">("color");

  const fileRef = useRef<HTMLInputElement>(null);
  const clickCount = useRef(0);
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
      if (e.key === "Escape") {
        setLightbox(null);
        setShowUploadModal(false);
        setShowAdminPrompt(false);
        setEditingPhoto(null);
      }
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
    } else { alert(t.gallery.adminKey + " incorrecta"); }
  };

  const openEditModal = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditForm({
      title: photo.title ?? "",
      description: photo.description ?? "",
      shot_at: (photo.shot_at ?? photo.created_at).slice(0, 10),
      category: photo.category,
      camera: photo.camera ?? "",
      film_roll: photo.film_roll ?? "",
      film_iso: photo.film_iso ?? "",
      film_type: photo.film_type ?? "color",
    });
  };

  const savePhotoEdit = async () => {
    if (!editingPhoto) return;
    const updates = {
      title: editForm.title.trim() || null,
      description: editForm.description.trim() || null,
      shot_at: editForm.shot_at || null,
      category: editForm.category,
      camera: editForm.camera.trim() || null,
      film_roll: editingPhoto.medium === "35mm" ? editForm.film_roll.trim() || null : null,
      film_iso: editingPhoto.medium === "35mm" ? editForm.film_iso.trim() || null : null,
      film_type: editingPhoto.medium === "35mm" ? editForm.film_type : null,
    };
    await getSupabase().from("photos").update(updates).eq("id", editingPhoto.id);
    setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? { ...p, ...updates } : p));
    setEditingPhoto(null);
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
        title: uploadTitle.trim() || null,
        description: uploadDescription.trim() || null,
        category: "otro",
        storage_path: path,
        public_url: urlData.publicUrl,
        frame_num: String(count).padStart(2, "0"),
        shot_at: uploadDate || null,
        medium: effectiveMedium,
        camera: uploadCamera.trim() || null,
        film_roll: effectiveMedium === "35mm" ? uploadFilmRoll.trim() || null : null,
        film_iso: effectiveMedium === "35mm" ? uploadFilmIso.trim() || null : null,
        film_type: effectiveMedium === "35mm" ? uploadFilmType : null,
      });
    }
    await fetchPhotos();
    setUploading(false);
    setUploadTitle(""); setUploadDescription(""); setUploadDate(today());
    setUploadCamera(""); setUploadFilmRoll(""); setUploadFilmIso(""); setUploadFilmType("color");
  };

  const handleDelete = async (photo: Photo) => {
    if (!adminMode || !confirm(t.gallery.deleteConfirm)) return;
    await getSupabase().storage.from("portfolio").remove([photo.storage_path]);
    await getSupabase().from("photos").delete().eq("id", photo.id);
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
  };

  const filtered = filter === "todos" ? photos : photos.filter(p => p.category === filter);

  // --- Reusable modal field components ---
  const Field = ({ label, value, onChange, placeholder, type = "text" }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string;
  }) => (
    <div>
      <label className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase block mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-transparent border border-film-brown/40 px-3 py-1.5 font-mono text-sm text-film-dark rounded-sm" />
    </div>
  );

  const Toggle = ({ label, options, value, onChange }: {
    label: string; options: [string, string][]; value: string; onChange: (v: string) => void;
  }) => (
    <div>
      <p className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase mb-2">{label}</p>
      <div className="flex gap-2">
        {options.map(([val, lbl]) => (
          <button key={val} onClick={() => onChange(val)}
            className={`flex-1 font-mono text-[10px] tracking-[0.1em] uppercase py-1.5 border rounded-sm transition-colors ${value === val ? "bg-film-dark text-film-cream border-film-dark" : "border-film-brown/40 text-film-dark hover:border-film-brown"}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );

  const TextArea = ({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  }) => (
    <div>
      <label className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase block mb-1">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2}
        className="w-full bg-transparent border border-film-brown/40 px-3 py-1.5 font-mono text-sm text-film-dark rounded-sm resize-none" />
    </div>
  );

  const ModalBtns = ({ onConfirm, onCancel, confirmLabel }: {
    onConfirm: () => void; onCancel: () => void; confirmLabel: string;
  }) => (
    <div className="flex gap-2 pt-1">
      <button onClick={onConfirm}
        className="flex-1 bg-film-dark text-film-cream font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-film-brown transition-colors">
        {confirmLabel}
      </button>
      <button onClick={onCancel}
        className="flex-1 border border-film-brown/40 text-film-dark font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:border-film-brown transition-colors">
        {t.gallery.cancel}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={handleTitleClick}
            className="font-mono text-[10px] tracking-[0.15em] text-film-brown uppercase select-none cursor-default">
            Roll 01 · {String(photos.length).padStart(2, "0")} {t.gallery.frames}
          </button>
          {adminMode && (
            <span className="font-mono text-[10px] tracking-[0.1em] text-film-orange border border-film-orange/40 px-2 py-0.5 rounded-sm">
              {t.gallery.admin}
            </span>
          )}
        </div>
        {adminMode && (
          <button onClick={() => setShowUploadModal(true)} disabled={uploading}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase bg-film-dark text-film-cream px-4 py-2 rounded-sm hover:bg-film-brown transition-colors disabled:opacity-50">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? t.gallery.uploading : t.gallery.upload}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleUpload(e.target.files)} />
      </div>

      {/* Admin password modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-film-dark/80 z-50 flex items-center justify-center p-4">
          <div className="bg-film-cream border border-film-brown/30 p-6 rounded-sm w-full max-w-sm">
            <p className="font-mono text-[11px] tracking-[0.12em] text-film-brown uppercase mb-4">{t.gallery.adminKey}</p>
            <input type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkAdminKey()} placeholder="••••••••"
              className="w-full bg-transparent border border-film-brown/40 px-3 py-2 font-mono text-sm text-film-dark mb-3 rounded-sm" />
            <div className="flex gap-2">
              <button onClick={checkAdminKey}
                className="flex-1 bg-film-dark text-film-cream font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-film-brown transition-colors">
                {t.gallery.enter}
              </button>
              <button onClick={() => setShowAdminPrompt(false)}
                className="flex-1 border border-film-brown/40 text-film-dark font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:border-film-brown transition-colors">
                {t.gallery.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-film-dark/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-film-cream border border-film-brown/30 p-6 rounded-sm w-full max-w-sm space-y-4 my-auto">
            <p className="font-mono text-[11px] tracking-[0.12em] text-film-brown uppercase">{t.gallery.newPhoto}</p>

            {!medium
              ? <Toggle label={t.gallery.cameraType}
                  options={[["35mm", "35mm"], ["digital", "Digital"]]}
                  value={uploadMedium}
                  onChange={v => setUploadMedium(v as "35mm" | "digital")} />
              : <p className="font-mono text-[10px] tracking-[0.1em] text-film-brown/60 uppercase">
                  {t.gallery.uploadingAs}: <span className="text-film-orange">{medium}</span>
                </p>
            }

            <Field label={t.gallery.title} value={uploadTitle} onChange={setUploadTitle} placeholder={t.gallery.optional} />
            <TextArea label={t.gallery.description} value={uploadDescription} onChange={setUploadDescription} placeholder={t.gallery.optional} />
            <Field label={t.gallery.date} value={uploadDate} onChange={setUploadDate} type="date" />
            <Field label={t.gallery.camera} value={uploadCamera} onChange={setUploadCamera} placeholder="Canon AE-1" />

            {effectiveMedium === "35mm" && (
              <>
                <Field label={t.gallery.filmRoll} value={uploadFilmRoll} onChange={setUploadFilmRoll} placeholder="Kodak Gold 200" />
                <Field label={t.gallery.iso} value={uploadFilmIso} onChange={setUploadFilmIso} placeholder="400" />
                <Toggle label={t.gallery.filmType}
                  options={[["color", t.gallery.color], ["bw", t.gallery.bw]]}
                  value={uploadFilmType}
                  onChange={v => setUploadFilmType(v as "color" | "bw")} />
              </>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-film-dark text-film-cream font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:bg-film-brown transition-colors">
                <Upload size={12} /> {t.gallery.selectPhotos}
              </button>
              <button onClick={() => setShowUploadModal(false)}
                className="flex-1 border border-film-brown/40 text-film-dark font-mono text-[11px] tracking-[0.1em] uppercase py-2 rounded-sm hover:border-film-brown transition-colors">
                {t.gallery.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Per-photo edit modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-film-dark/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-film-cream border border-film-brown/30 p-6 rounded-sm w-full max-w-sm space-y-4 my-auto">
            <p className="font-mono text-[11px] tracking-[0.12em] text-film-brown uppercase">{t.gallery.editPhoto}</p>

            <Field label={t.gallery.title} value={editForm.title} onChange={v => setEditForm(f => ({ ...f, title: v }))} placeholder={t.gallery.optional} />
            <TextArea label={t.gallery.description} value={editForm.description} onChange={v => setEditForm(f => ({ ...f, description: v }))} placeholder={t.gallery.optional} />
            <Field label={t.gallery.date} value={editForm.shot_at} onChange={v => setEditForm(f => ({ ...f, shot_at: v }))} type="date" />

            <div>
              <label className="font-mono text-[10px] tracking-[0.1em] text-film-brown/70 uppercase block mb-1">{t.gallery.category}</label>
              <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-transparent border border-film-brown/40 px-3 py-1.5 font-mono text-sm text-film-dark rounded-sm">
                {CATEGORY_KEYS.filter(c => c !== "todos").map(c => (
                  <option key={c} value={c}>{t.categories[c]}</option>
                ))}
              </select>
            </div>

            <Field label={t.gallery.camera} value={editForm.camera} onChange={v => setEditForm(f => ({ ...f, camera: v }))} placeholder="Canon AE-1" />

            {editingPhoto.medium === "35mm" && (
              <>
                <Field label={t.gallery.filmRoll} value={editForm.film_roll} onChange={v => setEditForm(f => ({ ...f, film_roll: v }))} placeholder="Kodak Gold 200" />
                <Field label={t.gallery.iso} value={editForm.film_iso} onChange={v => setEditForm(f => ({ ...f, film_iso: v }))} placeholder="400" />
                <Toggle label={t.gallery.filmType}
                  options={[["color", t.gallery.color], ["bw", t.gallery.bw]]}
                  value={editForm.film_type}
                  onChange={v => setEditForm(f => ({ ...f, film_type: v as "color" | "bw" }))} />
              </>
            )}

            <ModalBtns onConfirm={savePhotoEdit} onCancel={() => setEditingPhoto(null)} confirmLabel={t.gallery.save} />
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-0 border-b border-film-brown/20 mb-8 overflow-x-auto">
        {CATEGORY_KEYS.map((cat, i) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`font-mono text-[11px] tracking-[0.12em] uppercase px-4 py-2 transition-colors whitespace-nowrap
              ${i < CATEGORY_KEYS.length - 1 ? "border-r border-film-brown/20" : ""}
              ${filter === cat ? "text-film-dark underline underline-offset-4 decoration-film-brown" : "text-film-brown hover:text-film-orange"}`}>
            {t.categories[cat]}
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
            {[...Array(5)].map((_, i) => <div key={i} className="w-12 h-9 border border-film-brown rounded-sm bg-film-brown/10" />)}
          </div>
          <p className="font-mono text-[12px] tracking-[0.1em] text-film-brown uppercase leading-relaxed">
            {photos.length === 0 ? t.gallery.blankRoll : t.gallery.noPhotos}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="columns-2 md:columns-3 gap-3">
          {filtered.map(photo => {
            const meta = getPhotoMeta(photo);
            return (
              <div key={photo.id} className="break-inside-avoid mb-3">
                <div className="bg-white border border-film-brown/25 p-1.5 pb-7 cursor-pointer relative"
                  onClick={() => setLightbox(photo)}>
                  <Image src={photo.public_url} alt={photo.title ?? photo.frame_num}
                    width={600} height={400} className="w-full h-auto block film-photo" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between">
                    <span className="font-mono text-[9px] text-film-brown/70 tracking-[0.1em]">{photo.frame_num}</span>
                    <span className="font-mono text-[9px] text-film-orange tracking-[0.08em] uppercase">{t.categories[photo.category as CategoryKey] ?? photo.category}</span>
                  </div>
                </div>
                <div className="mt-1.5 px-0.5">
                  {photo.title && <p className="font-serif text-sm italic text-film-dark truncate">{photo.title}</p>}
                  {photo.description && <p className="font-mono text-[10px] text-film-dark/60 leading-relaxed mt-0.5">{photo.description}</p>}
                  {meta && <p className="font-mono text-[9px] text-film-brown/50 tracking-[0.06em] mt-0.5">{meta}</p>}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-film-brown/60">{getDisplayDate(photo)}</span>
                    {adminMode && (
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button onClick={() => openEditModal(photo)}
                          className="text-film-brown/50 hover:text-film-orange transition-colors">
                          <Pencil size={9} />
                        </button>
                        <button onClick={() => handleDelete(photo)}
                          className="font-mono text-[9px] text-film-brown/50 hover:text-red-600 transition-colors">
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (() => {
        const meta = getPhotoMeta(lightbox);
        return (
          <div className="fixed inset-0 bg-film-dark/92 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightbox(null)}>
            <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <button onClick={() => setLightbox(null)}
                className="absolute -top-9 right-0 font-mono text-[11px] tracking-[0.15em] text-film-tan/70 hover:text-film-cream uppercase flex items-center gap-1">
                <X size={12} /> {t.gallery.close}
              </button>
              <div className="bg-white p-2 pb-12 relative">
                <Image src={lightbox.public_url} alt={lightbox.title ?? lightbox.frame_num}
                  width={1200} height={800} className="w-full h-auto block film-photo" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end gap-4">
                  <div className="min-w-0">
                    {lightbox.title && <p className="font-serif text-sm italic text-film-dark">{lightbox.title}</p>}
                    {lightbox.description && <p className="font-mono text-[10px] text-film-dark/60 leading-relaxed mt-0.5">{lightbox.description}</p>}
                  </div>
                  <p className="font-mono text-[10px] text-film-brown tracking-[0.08em] text-right shrink-0">
                    {lightbox.frame_num} — {(t.categories[lightbox.category as CategoryKey] ?? lightbox.category).toUpperCase()}
                    {meta && <><br />{meta}</>}
                    <br />{getDisplayDate(lightbox)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
