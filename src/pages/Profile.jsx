import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Phone, BadgeCheck, LogOut, Hash } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const variants = [
  {
    glow: "shadow-warning/30",
    border: "border-warning/30",
    soft: "bg-warning/10",
    ring: "ring-warning/40",
  },
  {
    glow: "shadow-primary/25",
    border: "border-primary/30",
    soft: "bg-primary/10",
    ring: "ring-primary/40",
  },
  {
    glow: "shadow-accent/25",
    border: "border-accent/30",
    soft: "bg-accent/10",
    ring: "ring-accent/40",
  },
];

const pickVariant = (user) => {
  const seed = `${user?.id || ""}${user?.phoneNumber || ""}${user?.username || ""}`;
  const hash = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return variants[hash % variants.length];
};

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const accent = useMemo(() => pickVariant(user), [user]);
  const displayName = user?.username || user?.name || t("profile.admin");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6"> 
        <div className="bg-base-300 border border-base-content/10 rounded-3xl px-8 py-10 text-center w-full max-w-md">
          <p className="text-base-content/70 text-lg font-semibold">{t("profile.notFound")}</p> 
          <p className="text-base-content/50 text-sm mt-1">{t("profile.pleaseLogin")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden bg-base-200  shadow-2xl">
          <div className={`absolute -top-16 -left-14 h-64 w-64 rounded-full  ${accent.soft}`} />
          <div className="absolute -bottom-24 -right-14 h-72 w-72 rounded-full " />

          <div className="relative z-10 p-5 md:p-9">
            <div className="grid lg:grid-cols-[1.45fr,1fr] gap-6">
              <section className="rounded-3xl border border-base-content/10 bg-base-200/70 p-5 md:p-7">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className={`relative p-1 rounded-full ring-4 ${accent.ring}`}>
                    <img
                      src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&s'}
                      alt={displayName}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-base-300"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/180x180?text=ADMIN";
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 badge badge-success">{t("profile.online")}</span>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-warning">{displayName}</h1>
                    <p className="text-base-content/60 mt-1 text-sm md:text-base">{t("profile.view")}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className={`badge badge-lg ${accent.soft} ${accent.border} border`}>{t("profile.adminPanel")}</div>
                      <div className="badge badge-lg bg-base-300 border-base-content/10">{t("profile.secureSession")}</div>
                    </div>
                  </div>

                  <button onClick={handleLogout} className={`btn bg-error text-error-content border-none hover:bg-error/80 shadow-lg ${accent.glow}`}>
                    <LogOut size={16} />
                    {t("profile.logout")}
                  </button>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3">
                <StatCard label={t("profile.status")} value={t("profile.active")} icon={<ShieldCheck size={18} />} accent={accent} />
                <StatCard label={t("profile.role")} value={t("profile.admin")} icon={<BadgeCheck size={18} />} accent={accent} />
                <StatCard label={t("profile.id")} value={user?.id || t("profile.na")} icon={<Hash size={18} />} accent={accent} />
                <StatCard label={t("profile.phone")} value={user?.phoneNumber || t("profile.na")} icon={<Phone size={18} />} accent={accent} />
              </section>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, accent }) => {
  return (
    <div className={`rounded-2xl border p-4 bg-base-200/70 border-base-content/10 ${accent.soft}`}>
      <div className="flex items-center justify-between text-base-content/70">
        <span className="text-xs uppercase tracking-wider">{label}</span>
        <span className="text-warning">{icon}</span>
      </div>
      <p className="mt-2 font-bold text-sm md:text-base break-all">{value}</p>
    </div>
  );
};

export default Profile;
