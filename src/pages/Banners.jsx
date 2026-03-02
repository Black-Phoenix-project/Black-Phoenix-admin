import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FiImage, FiPlus, FiRefreshCw, FiTrash2, FiX, FiCheck, FiGrid, FiLink } from "react-icons/fi";
import { MdOutlineSlideshow } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;

const initialForm = { title: "", image: "", description: "" };

const normalizeSwiperData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.swipers)) return payload.swipers;
  return [];
};

const normalizeGalleryData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.images)) return payload.images;
  if (Array.isArray(payload?.gallery)) return payload.gallery;
  return [];
};

const getImageUrl = (item) =>
  item?.url || item?.imageUrl || item?.image || item?.src || "";

/* ─── Gallery Picker Modal ─── */
const GalleryModal = ({ onSelect, onClose }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/gallery`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setImages(normalizeGalleryData(data));
      } catch {
        toast.error("Galereyani yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(getImageUrl(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-warning/25 bg-base-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning/15 flex items-center justify-center">
              <FiGrid className="text-warning text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-base-content text-lg">Galereya</h3>
              <p className="text-xs text-base-content/50">Rasm tanlang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost btn-circle text-base-content/60 hover:text-base-content"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <span className="loading loading-spinner loading-lg text-warning" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
              <FiImage className="text-4xl text-warning/40" />
              <p className="text-base-content/50 text-sm">Galereya bo'sh</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => {
                const url = getImageUrl(img);
                const isSelected = selected?._id === img._id || selected?.url === url;
                return (
                  <button
                    key={img._id || url}
                    type="button"
                    onClick={() => setSelected(img)}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 aspect-square ${
                      isSelected
                        ? "border-warning shadow-lg shadow-warning/20 scale-[0.97]"
                        : "border-transparent hover:border-warning/40"
                    }`}
                  >
                    <img
                      src={url}
                      alt={img.title || img.name || ""}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/200x200?text=IMG";
                      }}
                    />
                    <div
                      className={`absolute inset-0 transition-opacity duration-200 ${
                        isSelected
                          ? "bg-warning/20 opacity-100"
                          : "bg-black/0 group-hover:bg-black/10"
                      }`}
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-warning flex items-center justify-center shadow-md">
                        <FiCheck className="text-warning-content text-xs font-bold" />
                      </div>
                    )}
                    {img.title && (
                      <div className="absolute bottom-0 inset-x-0  from-black/70 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{img.title}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-base-200 bg-base-100">
          <p className="text-sm text-base-content/50">
            {selected ? (
              <span className="text-warning font-medium">1 ta rasm tanlandi</span>
            ) : (
              "Rasm tanlanmagan"
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost border border-base-300"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selected}
              className="btn btn-sm border-none bg-warning text-warning-content hover:bg-warning/80 disabled:opacity-40"
            >
              <FiCheck />
              Tanlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const Banners = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [showGallery, setShowGallery] = useState(false);
  const [imageMode, setImageMode] = useState("gallery"); // "gallery" | "url"

  const hasItems = useMemo(() => items.length > 0, [items]);
  const previewImage =
    formData.image.trim() ||
    "https://placehold.co/800x420?text=Preview";

  const fetchSwipers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/swiper`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(normalizeSwiperData(data));
    } catch {
      toast.error("Swiper ma'lumotlarini yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSwipers();
  }, [fetchSwipers]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGallerySelect = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const validate = () => {
    const { title, image, description } = formData;
    if (!title.trim() || !image.trim() || !description.trim()) {
      toast.error("Barcha maydonlarni to'ldiring");
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
      toast.success("Swiper muvaffaqiyatli qo'shildi");
    } catch (error) {
      toast.error(error.message || "Swiper yaratishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSwiper = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/swiper/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Swiper o'chirildi");
    } catch {
      toast.error("Swiper o'chirishda xatolik");
    }
  };

  return (
    <>
      {showGallery && (
        <GalleryModal
          onSelect={handleGallerySelect}
          onClose={() => setShowGallery(false)}
        />
      )}

      <div className="min-h-screen bg-base-300 p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">

          {/* ── Header ── */}
          <section className="relative overflow-hidden rounded-3xl border border-warning/30 bg-base-200 px-6 py-7 shadow-lg">
            <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-warning/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-warning/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-warning/15 flex items-center justify-center shrink-0">
                  <MdOutlineSlideshow className="text-warning text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-warning">
                    Swiper Boshqaruvi
                  </h1>
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

          {/* ── Body Grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* ── Form ── */}
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

                {/* Image Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                    Rasm
                  </label>

                  {/* Toggle */}
                  <div className="flex rounded-xl overflow-hidden border border-base-300 p-0.5 bg-base-200 gap-0.5">
                    <button
                      type="button"
                      onClick={() => setImageMode("gallery")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        imageMode === "gallery"
                          ? "bg-warning text-warning-content shadow"
                          : "text-base-content/50 hover:text-base-content"
                      }`}
                    >
                      <FiGrid className="text-sm" />
                      Galereya
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        imageMode === "url"
                          ? "bg-warning text-warning-content shadow"
                          : "text-base-content/50 hover:text-base-content"
                      }`}
                    >
                      <FiLink className="text-sm" />
                      URL
                    </button>
                  </div>

                  {imageMode === "gallery" ? (
                    <button
                      type="button"
                      onClick={() => setShowGallery(true)}
                      className={`w-full flex items-center gap-3 rounded-2xl border-2 border-dashed p-3 transition-all hover:border-warning/60 group ${
                        formData.image
                          ? "border-warning/40 bg-warning/5"
                          : "border-base-300 bg-base-200/50"
                      }`}
                    >
                      {formData.image ? (
                        <>
                          <img
                            src={formData.image}
                            alt="selected"
                            className="w-12 h-12 rounded-xl object-cover border border-warning/20 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/100x100?text=IMG";
                            }}
                          />
                          <div className="text-left min-w-0">
                            <p className="text-xs font-semibold text-warning">
                              Rasm tanlandi
                            </p>
                            <p className="text-xs text-base-content/50 truncate max-w-[160px]">
                              {formData.image}
                            </p>
                          </div>
                          <FiCheck className="ml-auto text-warning text-base shrink-0" />
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-base-300 flex items-center justify-center shrink-0 group-hover:bg-warning/10 transition-colors">
                            <FiGrid className="text-base-content/40 group-hover:text-warning transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-base-content/70">
                              Galereya ochish
                            </p>
                            <p className="text-xs text-base-content/40">
                              Rasmni tanlash uchun bosing
                            </p>
                          </div>
                        </>
                      )}
                    </button>
                  ) : (
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={onChange}
                      placeholder="https://..."
                      className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full"
                    />
                  )}
                </div>

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
                  disabled={submitting}
                  className="btn w-full border-none bg-warning text-warning-content hover:bg-warning/80 mt-1"
                >
                  <FiPlus />
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
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/800x420?text=Preview";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <p className="absolute left-3 bottom-2 text-xs text-white/90 font-semibold truncate max-w-[90%] drop-shadow">
                    {formData.title || "Sarlavha preview"}
                  </p>
                </div>
              </div>
            </section>

            {/* ── Preview + List ── */}
            <section className="xl:col-span-3 rounded-3xl border border-warning/20 bg-base-100 p-5 md:p-6 shadow-md flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-warning">Jonli preview</h2>
                <span className="badge border border-warning/30 bg-base-200 text-base-content">
                  {items.length} ta slide
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center min-h-[280px]">
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
                      <div className="relative h-[240px] md:h-[320px]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/800x420?text=Swiper";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute left-0 right-0 bottom-0 p-5 text-white">
                          <p className="text-xl md:text-2xl font-bold leading-tight">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-white/80 line-clamp-2 max-w-2xl">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="min-h-[280px] rounded-2xl border-2 border-dashed border-warning/25 bg-base-200/40 flex flex-col items-center justify-center text-center px-4 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center">
                    <FiImage className="text-2xl text-warning" />
                  </div>
                  <div>
                    <p className="font-bold text-base-content">Swiper mavjud emas</p>
                    <p className="text-sm text-base-content/50 mt-0.5">
                      Chap formadan birinchi slaydingizni yarating
                    </p>
                  </div>
                </div>
              )}

              {/* Slide cards list */}
              {items.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">
                    Barcha slaydlar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {items.map((item) => (
                      <article
                        key={item._id}
                        className="group flex gap-3 items-start rounded-2xl border border-base-300 bg-base-200/40 p-3 transition-all hover:border-warning/30 hover:shadow hover:-translate-y-0.5"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-base-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/120x120?text=IMG";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-warning truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-base-content/55 line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => deleteSwiper(item._id)}
                            className="mt-2 btn btn-xs border-none bg-red-500/90 text-white hover:bg-red-600 gap-1"
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