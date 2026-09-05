import React, { useCallback, useEffect, useState } from "react";
import { FiSave, FiRefreshCw, FiInfo } from "react-icons/fi";
import { toast } from "../lib/toast";
import { authFetch } from "../lib/authFetch";
import { useLanguage } from "../i18n/LanguageContext";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;

const empty = {
  companyName: "Black Phoenix",
  description: "",
  phone: "+998770902226",
  email: "",
  address: "",
  aboutText: "",
  socials: { telegram: "https://t.me/SardorXojimurodov", instagram: "" },
};

const CompanySettings = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/settings`);
      const data = await res.json();
      const s = data.data || {};
      setForm({
        companyName: s.companyName || empty.companyName,
        description: s.description || "",
        phone: s.phone || "",
        email: s.email || "",
        address: s.address || "",
        aboutText: s.aboutText || "",
        socials: {
          telegram: s.socials?.telegram || "",
          instagram: s.socials?.instagram || "",
        },
      });
    } catch {
      toast.error(t("company.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSocial = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, socials: { ...p.socials, [name]: value } }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch(`${BASE_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("company.error"));
      toast.success(t("company.saved"));
    } catch (err) {
      toast.error(err.message || t("company.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-warning" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-warning/30 bg-base-200 px-6 py-7 shadow-lg">
          <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-warning/15 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-warning/15 flex items-center justify-center shrink-0">
                <FiInfo className="text-warning text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-warning">{t("company.title")}</h1>
                <p className="mt-0.5 text-sm text-base-content/60">{t("company.subtitle")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchSettings}
              className="btn border-none bg-warning text-warning-content hover:bg-warning/80 gap-2"
            >
              <FiRefreshCw /> {t("company.refresh")}
            </button>
          </div>
        </section>

        <form className="rounded-3xl border border-warning/20 bg-base-100 p-5 md:p-6 shadow-md flex flex-col gap-4" onSubmit={save}>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.companyName")}</label>
            <input name="companyName" value={form.companyName} onChange={onChange}
              className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.shortDesc")}</label>
            <input name="description" value={form.description} onChange={onChange}
              className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.phone")}</label>
              <input name="phone" value={form.phone} onChange={onChange}
                className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.email")}</label>
              <input name="email" value={form.email} onChange={onChange}
                className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.address")}</label>
            <input name="address" value={form.address} onChange={onChange}
              className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.aboutText")}</label>
            <textarea name="aboutText" value={form.aboutText} onChange={onChange} rows={5}
              className="textarea textarea-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none resize-none w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.telegram")}</label>
              <input name="telegram" value={form.socials.telegram} onChange={onSocial}
                className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{t("company.instagram")}</label>
              <input name="instagram" value={form.socials.instagram} onChange={onSocial}
                className="input input-bordered bg-base-200 border-warning/25 focus:border-warning focus:outline-none w-full" />
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="btn w-full border-none bg-warning text-warning-content hover:bg-warning/80 mt-2 disabled:opacity-60">
            {saving ? <span className="loading loading-spinner loading-sm" /> : <FiSave />}
            {t("company.save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySettings;
