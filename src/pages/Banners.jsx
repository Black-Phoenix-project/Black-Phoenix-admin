import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiImage, FiPlus, FiRefreshCw, FiTrash2, FiX, FiUploadCloud,
} from "react-icons/fi";
import { MdOutlineSlideshow } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AppToast from "../components/AppToast";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;

const initialForm = { title: "", image: "", description: "" };

const normalizeSwiperData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.swipers)) return payload.swipers;
  return [];
};

/* ─── Rasm yuklash zone ─── */
const ImageUploadZone = ({ imageUrl, uploading, onFile, onRemove }) => {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
        Rasm
      </label>

      {imageUrl ? (
        /* Preview */
        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-warning/30">
          <img
            src={imageUrl}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/800x420?text=IMG"; }}
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 btn btn-xs btn-circle bg-error/90 border-none text-error-content hover:bg-error"
          >
            <FiX />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-base-content/60 to-transparent px-3 py-2">
            <p className="text-base-100 text-xs truncate">Rasm yuklandi</p>
          </div>
        </div>
      ) : (
        /* Upload zone */
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 rounded-2xl border-2 border-dashed border-warning/30 bg-base-200/60 flex flex-col items-center justify-center gap-3 hover:border-warning/60 hover:bg-warning/5 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <span className="loading loading-spinner loading-md text-warning" />
          ) : (
            <>
              <FiUploadCloud className="text-3xl text-warning/60" />
              <div className="text-center">
                <p className="text-sm font-semibold text-base-content/70">Fayl tanlash</p>
                <p className="text-xs text-base-content/40 mt-0.5">JPG, PNG, WEBP — max 10MB</p>
              </div>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

/* ─── Asosiy komponent ─── */
const Banners = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hasItems = useMemo(() => items.length > 0, [items]);

  const fetchSwipers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/swiper`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(normalizeSwiperData(data));
    } catch {
      showToast("Swiper ma'lumotlarini yuklab bo'lmadi", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchSwipers(); }, [fetchSwipers]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* Fayl tanlanganda — cloudinaryga yuklash */
  const handleFile = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${BASE_URL}/api/upload/single`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "Yuklash xatosi");
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      showToast(err.message || "Rasm yuklanmadi", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const validate = () => {
    const { title, image, description } = formData;
    if (!title.trim() || !image.trim() || !description.trim()) {
      showToast("Barcha maydonlarni to'ldiring", "error");
      return false;
    }
    return true;
  };

  const createSwiper = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/swiper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Create failed");
      setItems((prev) => [data?.data || data, ...prev]);
      setFormData(initialForm);
      showToast("Swiper muvaffaqiyatli qo'shildi");
    } catch (error) {
      showToast(error.message || "Swiper yaratishda xatolik", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSwiper = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/swiper/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item._id !== id));
      showToast("Swiper o'chirildi");
    } catch {
      showToast("Swiper o'chirishda xatolik", "error");
    }
  };

  return (
    <>
      <AppToast toast={toast} />

      <div className="min-h-screen bg-base-300 p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">

          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl border border-warning/30 bg-base-200 px-6 py-7 shadow-lg">
            <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-warning/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-warning/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-warning/15 flex items-center justify-center shrink-0">
                  <MdOutlineSlideshow className="text-warning text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-warning">Swiper Boshqaruvi</h1>
                  <p className="mt-0.5 text-sm text-base-content/60">
                    Slayder kontentini yarating va real vaqtda boshqaring
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="badge border border-warning/40 bg-base-100 text-base-content px-3 py-3">
                  {items.length} ta aktiv slayd
                </div>
                <button
                  type="button"
                  onClick={fetchSwipers}
                  disabled={loading}
                  className="btn border-none bg-warning text-warning-content hover:bg-warning/80 gap-2"
                >
                  <FiRefreshCw className={loading ? "animate-spin" : ""} />
                  Yangilash
                </button>
              </div>
            </div>
          </section>

          {/* Body */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* Form */}
            <section className="xl:col-span-2 rounded-3xl border border-warning/20 bg-base-100 p-5 md:p-6 shadow-md flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-warning">Yangi slide</h2>
                <span className="text-xs text-base-content/40 bg-base-200 px-2.5 py-1 rounded-full">Forma</span>
              </div>

              <form className="flex flex-col gap-3.5" onSubmit={createSwiper}>
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                    Sarlavha
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="Masalan: Yangi kolleksiya"
                    className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full"
                  />
                </div>

                {/* Image upload */}
                <ImageUploadZone
                  imageUrl={formData.image}
                  uploading={uploading}
                  onFile={handleFile}
                  onRemove={handleRemoveImage}
                />

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                    Tavsif
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows={3}
                    placeholder="Qisqa marketing matni..."
                    className="textarea textarea-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none resize-none w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="btn w-full border-none bg-warning text-warning-content hover:bg-warning/80 mt-1 disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <FiPlus />
                  )}
                  {submitting ? "Saqlanmoqda..." : "Slide qo'shish"}
                </button>
              </form>

              {/* Mini preview */}
              <div className="rounded-2xl border border-warning/15 bg-base-200/60 p-3">
                <p className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider mb-2">
                  Preview
                </p>
                <div className="relative overflow-hidden rounded-xl h-32">
                  <img
                    src={formData.image || "https://placehold.co/800x420?text=Preview"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/800x420?text=Preview"; }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-base-content/65 via-transparent to-transparent" />
                  <p className="absolute left-3 bottom-2 text-xs text-base-100/90 font-semibold truncate max-w-[90%] drop-shadow">
                    {formData.title || "Sarlavha preview"}
                  </p>
                </div>
              </div>
            </section>

            {/* Preview + List */}
            <section className="xl:col-span-3 rounded-3xl border border-warning/20 bg-base-100 p-5 md:p-6 shadow-md flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-warning">Jonli preview</h2>
                <span className="badge border border-warning/30 bg-base-200 text-base-content">
                  {items.length} ta slide
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-lg text-warning" />
                </div>
              ) : hasItems ? (
                <Swiper
                  loop
                  autoplay={{ delay: 2800, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay]}
                  className="rounded-2xl overflow-hidden border border-warning/15 w-full"
                >
                  {items.map((item) => (
                    <SwiperSlide key={item._id || item.image}>
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/800x420?text=Swiper"; }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-base-content/75 via-base-content/20 to-transparent" />
                        <div className="absolute left-0 right-0 bottom-0 p-5 text-base-100">
                          <p className="text-xl md:text-2xl font-bold leading-tight">{item.title}</p>
                          <p className="mt-1 text-sm text-base-100/80 line-clamp-2 max-w-2xl">{item.description}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-warning/25 bg-base-200/40 flex flex-col items-center justify-center text-center px-4 gap-3 py-16">
                  <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center">
                    <FiImage className="text-2xl text-warning" />
                  </div>
                  <div>
                    <p className="font-bold text-base-content">Swiper mavjud emas</p>
                    <p className="text-sm text-base-content/50 mt-0.5">Chap formadan birinchi slaydingizni yarating</p>
                  </div>
                </div>
              )}

              {/* Slide cards list */}
              {items.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">
                    Barcha slaydlar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <article
                        key={item._id}
                        className="group flex gap-3 items-start rounded-2xl border border-base-300 bg-base-200/40 p-3 transition-all hover:border-warning/30 hover:shadow hover:-translate-y-0.5"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-base-300"
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/120x120?text=IMG"; }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-warning truncate">{item.title}</p>
                          <p className="text-xs text-base-content/55 line-clamp-2 mt-0.5">{item.description}</p>
                          <button
                            type="button"
                            onClick={() => deleteSwiper(item._id)}
                            className="mt-2 btn btn-xs border-none bg-error/90 text-error-content hover:bg-error gap-1"
                          >
                            <FiTrash2 className="text-xs" />
                            O'chirish
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banners;
