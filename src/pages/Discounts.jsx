import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiRefreshCw, FiTrash2, FiEdit, FiSave, FiX, FiTag } from "react-icons/fi";
import { toast } from "../lib/toast";
import { authFetch } from "../lib/authFetch";
import { useLanguage } from "../i18n/LanguageContext";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;

const emptyForm = {
  title: "",
  type: "percent",
  value: 0,
  scope: "global",
  productId: "",
  active: true,
};

const Discounts = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/discount`);
      const data = await res.json();
      setItems(data.data || []);
    } catch {
      toast.error(t("discounts.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/product`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      setProducts(list);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || form.value <= 0) {
      toast.error(t("discounts.titleValueRequired"));
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.scope !== "product") payload.productId = "";
      const url = editingId
        ? `${BASE_URL}/api/discount/${editingId}`
        : `${BASE_URL}/api/discount`;
      const res = await authFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("discounts.error"));
      toast.success(editingId ? t("discounts.updated") : t("discounts.added"));
      setEditingId(null);
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      toast.error(err.message || t("discounts.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      type: item.type || "percent",
      value: item.value || 0,
      scope: item.scope || "global",
      productId: item.productId || "",
      active: item.active !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm(t("discounts.deleteConfirm"))) return;
    try {
      const res = await authFetch(`${BASE_URL}/api/discount/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((p) => p.filter((i) => i._id !== id));
      toast.success(t("discounts.deleted"));
    } catch {
      toast.error(t("discounts.deleteError"));
    }
  };

  return (
    <div className="min-h-screen bg-base-300 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-warning/30 bg-base-200 px-6 py-7 shadow-lg">
          <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-warning/15 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-warning/15 flex items-center justify-center shrink-0">
                <FiTag className="text-warning text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-warning">{t("discounts.title")}</h1>
                <p className="mt-0.5 text-sm text-base-content/60">{t("discounts.subtitle")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchAll}
              disabled={loading}
              className="btn border-none bg-warning text-warning-content hover:bg-warning/80 gap-2"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              {t("discounts.refresh")}
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <section className="lg:col-span-2 rounded-3xl border border-warning/20 bg-base-100 p-5 md:p-6 shadow-md flex flex-col gap-4">
            <h2 className="text-lg font-bold text-warning">
              {editingId ? t("discounts.editTitle") : t("discounts.addTitle")}
            </h2>
            <form className="flex flex-col gap-3" onSubmit={submit}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("discounts.titleField")}</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder={t("discounts.titlePlaceholder")}
                  className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("discounts.type")}</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={onChange}
                    className="select select-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full"
                  >
                    <option value="percent">{t("discounts.typePercent")}</option>
                    <option value="fixed">{t("discounts.typeFixed")}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("discounts.value")}</label>
                  <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={onChange}
                    className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("discounts.scope")}</label>
                <select
                  name="scope"
                  value={form.scope}
                  onChange={onChange}
                  className="select select-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full"
                >
                  <option value="global">{t("discounts.scopeGlobal")}</option>
                  <option value="product">{t("discounts.scopeProduct")}</option>
                </select>
              </div>
              {form.scope === "product" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("discounts.product")}</label>
                  <select
                    name="productId"
                    value={form.productId}
                    onChange={onChange}
                    className="select select-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full"
                  >
                    <option value="">{t("discounts.productSelect")}</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-base-content/70 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={onChange}
                  className="checkbox checkbox-warning checkbox-sm"
                />
                {t("discounts.active")}
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="btn w-full border-none bg-warning text-warning-content hover:bg-warning/80 mt-1 disabled:opacity-60"
              >
                {submitting ? <span className="loading loading-spinner loading-sm" /> : editingId ? <FiSave /> : <FiPlus />}
                {editingId ? t("discounts.save") : t("discounts.add")}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(emptyForm); }}
                  className="btn w-full border-base-300 bg-base-200 text-base-content hover:bg-base-300"
                >
                  <FiX /> {t("discounts.cancel")}
                </button>
              )}
            </form>
          </section>

          <section className="lg:col-span-3 rounded-3xl border border-warning/20 bg-base-100 p-5 md:p-6 shadow-md flex flex-col gap-4">
            <h2 className="text-lg font-bold text-warning">{t("discounts.all")}</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg text-warning" />
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-warning/25 bg-base-200/40 flex flex-col items-center justify-center text-center px-4 gap-3 py-16">
                <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center">
                  <FiTag className="text-2xl text-warning" />
                </div>
                <p className="font-bold text-base-content">{t("discounts.empty")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => (
                  <article
                    key={item._id}
                    className="flex gap-3 items-start rounded-2xl border border-base-300 bg-base-200/40 p-3 transition-all hover:border-warning/30 hover:shadow"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-warning truncate">{item.title}</p>
                      <p className="text-xs text-base-content/55">
                        {item.type === "percent" ? `%${item.value}` : t("discounts.valueAmount", { value: item.value })} ·{" "}
                        {item.scope === "product" ? t("discounts.scopeProductLabel") : t("discounts.scopeGlobalLabel")}
                      </p>
                      <p className="text-[11px] text-base-content/40 mt-0.5">
                        {item.active === false ? t("discounts.statusInactive") : t("discounts.statusActive")}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="btn btn-xs border-none bg-warning/15 text-warning hover:bg-warning/25 gap-1"
                        >
                          <FiEdit className="text-xs" /> {t("discounts.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(item._id)}
                          className="btn btn-xs border-none bg-error/90 text-error-content hover:bg-error gap-1"
                        >
                          <FiTrash2 className="text-xs" /> {t("discounts.delete")}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Discounts;
