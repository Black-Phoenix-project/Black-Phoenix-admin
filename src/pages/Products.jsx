import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TiThLarge } from "react-icons/ti";
import { FaRegPenToSquare, FaPlus } from "react-icons/fa6";
import { LiaSearchSolid } from "react-icons/lia";
import { IoMdReorder } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiPlusCircle, FiUploadCloud, FiX } from "react-icons/fi";
import LoadingTemplate from "../components/LoadingTemplate";
import AppToast from "../components/AppToast";
import { authFetch } from "../lib/authFetch";
import { useLanguage } from "../i18n/LanguageContext";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;

const CATEGORIES = [
  { value: 'spetsodezhda', key: 'products.cat.spetsodezhda' },
  { value: 'spetsobov', key: 'products.cat.spetsobov' },
  { value: 'sredstva-zashchity', key: 'products.cat.sredstva-zashchity' },
  { value: 'trikotazh', key: 'products.cat.trikotazh' },
  { value: 'khoztovary', key: 'products.cat.khoztovary' },
  { value: 'uniforma', key: 'products.cat.uniforma' },
  { value: 'novinki', key: 'products.cat.novinki' },
];

const getCategoryLabel = (value, t) => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? t(cat.key) : value || '—';
};

/* ─── Kichik tugma ─── */
const ActionBtn = ({ icon, bg, color, label, onClick }) => (
  <button
    className="flex flex-col items-center justify-center gap-0.5 group/btn"
    onClick={onClick}
    title={label}
  >
    <div className={`${bg} ${color} p-1.5 rounded-lg text-base transition-all group-hover/btn:scale-110`}>
      {icon}
    </div>
    {label && <span className="text-[10px] text-base-content/40">{label}</span>}
  </button>
);

/* ─── Слот загрузки изображения ─── */
const ImageSlot = ({ index, url, uploading, onChange, onRemove }) => {
  const inputRef = useRef(null);
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-base-content/50">
        {t("products.photo", { n: index + 1 })} {index === 0 ? t("products.photoRequired") : t("products.photoOptional")}
      </label>

      {url ? (
        /* Preview */
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-warning/30">
          <img src={url} alt={`img-${index}`} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1.5 right-1.5 btn btn-xs btn-circle bg-error/90 border-none text-error-content hover:bg-error"
          >
            <FiX />
          </button>
        </div>
      ) : (
        /* Upload zone */
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 rounded-xl border-2 border-dashed border-warning/30 bg-base-200/60 flex flex-col items-center justify-center gap-2 hover:border-warning/60 hover:bg-warning/5 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <span className="loading loading-spinner loading-sm text-warning" />
          ) : (
            <>
              <FiUploadCloud className="text-2xl text-warning/60" />
              <span className="text-xs text-base-content/50">{t("products.selectFile")}</span>
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
          if (file) onChange(index, file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

/* ─── Asosiy komponent ─── */
const Products = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState([false, false, false]);
  const [saving, setSaving] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    images: ["", "", ""],
    description: "",
    price: "",
    category: "",
  });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const resetProductForm = () => {
    setNewProduct({ name: "", images: ["", "", ""], description: "", price: "", category: "" });
    setEditingProductId(null);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/product`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.products) ? data.products
          : Array.isArray(data.data) ? data.data
            : [];
      setProducts(list);
    } catch {
      showToast(t("products.loadError"), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* Fayl tanlanganda — cloudinaryga yuklash */
  const handleFileChange = async (index, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast(t("products.imageOnly"), "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast(t("products.fileTooBig"), "error");
      return;
    }
    setUploading((prev) => { const next = [...prev]; next[index] = true; return next; });
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await authFetch(`${BASE_URL}/api/upload/single`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || t("products.uploadError"));
      setNewProduct((prev) => {
        const next = [...prev.images];
        next[index] = data.url;
        return { ...prev, images: next };
      });
    } catch (err) {
      showToast(err.message || t("products.photoNotUploaded"), "error");
    } finally {
      setUploading((prev) => { const next = [...prev]; next[index] = false; return next; });
    }
  };

  const handleRemoveImage = (index) => {
    setNewProduct((prev) => {
      const next = [...prev.images];
      next[index] = "";
      return { ...prev, images: next };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const { name, images, description, price } = newProduct;
    const validImages = images.filter(Boolean);
    if (!name || !description || !price) {
      showToast(t("products.fillRequired"), "error");
      return false;
    }
    if (validImages.length < 1) {
      showToast(t("products.minOnePhoto"), "error");
      return false;
    }
    return true;
  };

  const openEditModal = (product) => {
    const rawImages = Array.isArray(product.image) ? product.image : [product.image];
    const cleanImages = rawImages.filter(Boolean).slice(0, 3);
    const filledImages = [...cleanImages, "", ""].slice(0, 3);
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      images: filledImages,
    });
    document.getElementById("product_modal").showModal();
  };

  const sendNewProduct = async () => {
    if (!validateInputs()) return;
    setSaving(true);
    try {
      const validImages = newProduct.images.filter(Boolean);
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        image: validImages,
        category: newProduct.category || null,
      };
      const res = await authFetch(`${BASE_URL}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || t("products.notAdded"));
      }
      const added = await res.json();
      setProducts((prev) => [...prev, added?.data || added]);
      showToast(t("products.addedSuccess"));
      resetProductForm();
      document.getElementById("product_modal").close();
    } catch (err) {
      showToast(err.message || t("products.addError"), "error");
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async () => {
    if (!validateInputs() || !editingProductId) return;
    setSaving(true);
    try {
      const validImages = newProduct.images.filter(Boolean);
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        image: validImages,
        category: newProduct.category || null,
      };
      const res = await authFetch(`${BASE_URL}/api/product/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || t("products.notUpdated"));
      }
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((item) => (item._id === editingProductId ? (updated?.data || updated) : item))
      );
      showToast(t("products.updatedSuccess"));
      resetProductForm();
      document.getElementById("product_modal").close();
    } catch (err) {
      showToast(err.message || t("products.updateError"), "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    const product = products.find((p) => p._id === id);
    const name = product?.name || "";
    if (!window.confirm(t("products.deleteConfirm", { name }))) return;
    try {
      const res = await authFetch(`${BASE_URL}/api/product/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast(t("products.deleted"));
    } catch {
      showToast(t("products.deleteError"), "error");
    }
  };

  const duplicateProduct = async (item) => {
    try {
      const { _id, ...rest } = item;
      const normalizedImages = Array.isArray(rest.image)
        ? rest.image.filter(Boolean).slice(0, 3)
        : [rest.image].filter(Boolean);
      const payload = { ...rest, price: Number(rest.price), image: normalizedImages };
      const res = await authFetch(`${BASE_URL}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      setProducts((prev) => [...prev, added?.data || added]);
      showToast(t("products.copied"));
    } catch {
      showToast(t("products.copyError"), "error");
    }
  };

  const filteredProducts = useMemo(
    () => products.filter((p) => {
      const matchSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = !categoryFilter || p.category === categoryFilter;
      return matchSearch && matchCategory;
    }),
    [products, searchQuery, categoryFilter]
  );

  const isAnyUploading = uploading.some(Boolean);

  return (
    <div className="min-h-screen bg-base-300 p-6">
      <AppToast toast={toast} />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border border-warning/40 rounded-xl px-4 py-2 bg-base-100 shadow-sm w-full md:w-72">
            <LiaSearchSolid className="text-xl text-warning" />
            <input
              type="text"
              placeholder={t("products.searchPlaceholder")}
              className="ml-2 w-full bg-transparent text-base-content border-none outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`p-2.5 rounded-xl border transition-all ${!showGrid ? "bg-warning text-warning-content border-warning" : "bg-base-100 border-base-content/20 text-base-content/50"}`}
              onClick={() => setShowGrid(false)}
              title={t("products.listView")}
            >
              <IoMdReorder className="text-2xl" />
            </button>
            <button
              className={`p-2.5 rounded-xl border transition-all ${showGrid ? "bg-warning text-warning-content border-warning" : "bg-base-100 border-base-content/20 text-base-content/50"}`}
              onClick={() => setShowGrid(true)}
              title={t("products.gridView")}
            >
              <TiThLarge className="text-2xl" />
            </button>
          </div>


        </div>

        <div>   
          <button
          className="btn bg-warning text-warning-content border-none hover:bg-warning/80 shadow-md gap-2 rounded-xl"
          onClick={() => { resetProductForm(); document.getElementById("product_modal").showModal(); }}
        >
          <FaPlus />
          {t("products.newProduct")}
        </button>
        </div>

      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoryFilter("")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${!categoryFilter ? "bg-warning text-warning-content border-warning" : "bg-base-100 border-base-content/20 text-base-content/60 hover:border-warning/50"}`}
        >
          {t("products.all")}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${categoryFilter === cat.value ? "bg-warning text-warning-content border-warning" : "bg-base-100 border-base-content/20 text-base-content/60 hover:border-warning/50"}`}
          >
            {t(cat.key)}
          </button>
        ))}
      </div>

      {/* Modal */}
      <dialog id="product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 border border-warning/30 shadow-2xl rounded-2xl max-w-lg">
          <h3 className="text-2xl font-bold text-warning text-center mb-6">
            {editingProductId ? t("products.editTitle") : t("products.addTitle")}
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { name: "name", placeholder: t("products.namePlaceholder") },
              { name: "description", placeholder: t("products.description") },
              { name: "price", placeholder: t("products.pricePlaceholder") },
            ].map((field) => (
              <input
                key={field.name}
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                className="input input-bordered border-warning/40 focus:border-warning bg-base-200 w-full rounded-xl"
                value={newProduct[field.name]}
                onChange={handleInputChange}
              />
            ))}

            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="select select-bordered border-warning/40 focus:border-warning bg-base-200 w-full rounded-xl"
            >
              <option value="">{t("products.categoryOptional")}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{t(cat.key)}</option>
              ))}
            </select>

            {/* Rasmlar */}
            <div className="grid grid-cols-3 gap-2 mt-1">
              {newProduct.images.map((url, index) => (
                <ImageSlot
                  key={index}
                  index={index}
                  url={url}
                  uploading={uploading[index]}
                  onChange={handleFileChange}
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>
          </div>

          <div className="modal-action flex gap-3 mt-6">
            <button
              className="btn flex-1 bg-warning text-warning-content border-none hover:bg-warning/80 rounded-xl disabled:opacity-60"
              disabled={saving || isAnyUploading}
              onClick={editingProductId ? updateProduct : sendNewProduct}
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <FaPlus className="mr-1" />
              )}
              {editingProductId ? t("products.save") : t("products.add")}
            </button>
            <form method="dialog" className="flex-1">
              <button className="btn w-full bg-base-300 border-none rounded-xl">
                {t("products.cancel")}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>{t("products.close")}</button>
        </form>
      </dialog>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoadingTemplate />
        </div>
      )}

      {/* Empty */}
      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl font-semibold text-base-content">{t("products.notFound")}</p>
          <p className="text-sm text-base-content/50 mt-1">{t("products.notFoundHint")}</p>
        </div>
      )}

      {/* Grid view */}
      {!loading && showGrid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4 pt-10">
          {filteredProducts.map((product) => {
            const productImage = Array.isArray(product.image) ? product.image[0] : product.image;
            return (
              <div
                key={product._id}
                className="bg-base-100 rounded-2xl shadow-md p-4 pt-14 relative mt-10 border border-warning/10 hover:border-warning/40 transition-all group"
              >
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-warning shadow-lg bg-base-300">
                  <img
                    src={productImage || "https://placehold.co/80x80?text=P"}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/80x80?text=P"; }}
                  />
                </div>
                <h3 className="text-base font-bold text-center text-warning truncate">{product.name}</h3>
                {product.category && (
                  <div className="flex justify-center mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/20 font-medium">
                      {getCategoryLabel(product.category, t)}
                    </span>
                  </div>
                )}
                <p className="text-sm text-center font-semibold text-base-content mt-1">sum{product.price}</p>
                <p className="text-xs text-center text-base-content/40 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex justify-center gap-2 mt-4">
                  <ActionBtn icon={<MdOutlineRemoveRedEye />} bg="bg-success/15" color="text-success" label={t("products.view")} onClick={() => showToast(t("products.viewing", { name: product.name }))} />
                  <ActionBtn icon={<FiPlusCircle />} bg="bg-base-200" color="text-base-content/60" label={t("products.copy")} onClick={() => duplicateProduct(product)} />
                  <ActionBtn icon={<FaRegPenToSquare />} bg="bg-warning/20" color="text-warning" label={t("products.editShort")} onClick={() => openEditModal(product)} />
                  <ActionBtn icon={<RiDeleteBinLine />} bg="bg-error/15" color="text-error" label={t("products.delete")} onClick={() => deleteProduct(product._id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {!loading && !showGrid && (
        <div className="space-y-2 mt-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-bold uppercase tracking-widest text-warning/70 bg-base-100 rounded-xl border border-warning/10">
            <div className="col-span-1">{t("products.colPhoto")}</div>
            <div className="col-span-2">{t("products.colName")}</div>
            <div className="col-span-2">{t("products.colCategory")}</div>
            <div className="col-span-2">{t("products.colPrice")}</div>
            <div className="col-span-3">{t("products.colDescription")}</div>
            <div className="col-span-2 text-right">{t("products.colActions")}</div>
          </div>

          {filteredProducts.map((product, index) => {
            const productImage = Array.isArray(product.image) ? product.image[0] : product.image;
            return (
              <div
                key={product._id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-5 py-4 md:py-3 rounded-2xl md:rounded-xl border transition-all hover:border-warning/40 ${index % 2 === 0 ? "bg-base-100 border-base-content/10" : "bg-base-200 border-base-content/5"}`}
              >
                <div className="col-span-1 flex justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-warning/30 bg-base-300">
                    <img
                      src={productImage || "https://placehold.co/40x40?text=P"}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://placehold.co/40x40?text=P"; }}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-sm text-warning truncate block">{product.name}</span>
                </div>
                <div className="col-span-2">
                  {product.category ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/20 font-medium">
                      {getCategoryLabel(product.category, t)}
                    </span>
                  ) : (
                    <span className="text-xs text-base-content/30">—</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-success text-sm">{product.price} S</span>
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-base-content/50 truncate">{product.description || "—"}</p>
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-center md:justify-end gap-2 md:gap-1.5">
                  <ActionBtn icon={<MdOutlineRemoveRedEye />} bg="bg-success/15" color="text-success" onClick={() => showToast(t("products.viewing", { name: product.name }))} />
                  <ActionBtn icon={<FiPlusCircle />} bg="bg-base-300" color="text-base-content/60" onClick={() => duplicateProduct(product)} />
                  <ActionBtn icon={<FaRegPenToSquare />} bg="bg-warning/20" color="text-warning" onClick={() => openEditModal(product)} />
                  <ActionBtn icon={<RiDeleteBinLine />} bg="bg-error/15" color="text-error" onClick={() => deleteProduct(product._id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
