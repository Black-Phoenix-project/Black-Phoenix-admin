import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Phone, BadgeCheck, LogOut, Hash } from "lucide-react";

const variants = [
  {
    glow: "shadow-warning/30",
    border: "border-warning/30",
    soft: "bg-warning/10",
    ring: "ring-warning/40",
  },
  {
    glow: "shadow-amber-400/25",
    border: "border-amber-300/30",
    soft: "bg-amber-300/10",
    ring: "ring-amber-300/40",
  },
  {
    glow: "shadow-yellow-300/25",
    border: "border-yellow-300/30",
    soft: "bg-yellow-300/10",
    ring: "ring-yellow-300/40",
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

  const accent = useMemo(() => pickVariant(user), [user]);
  const displayName = user?.username || user?.name || "Admin";
  const avatar = user?.image || "https://placehold.co/180x180?text=ADMIN";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6"> 
        <div className="bg-base-300 border border-base-content/10 rounded-3xl px-8 py-10 text-center w-full max-w-md">
          <p className="text-base-content/70 text-lg font-semibold">Foydalanuvchi ma'lumoti topilmadi</p> 
          <p className="text-base-content/50 text-sm mt-1">Iltimos, qayta kiring.</p>
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
                      src={avatar}
                      alt={displayName}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-base-300"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/180x180?text=ADMIN";
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 badge badge-success">onlayn</span>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-warning">{displayName}</h1>
                    <p className="text-base-content/60 mt-1 text-sm md:text-base">Profil ko'rinishi</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className={`badge badge-lg ${accent.soft} ${accent.border} border`}>Admin panel</div>
                      <div className="badge badge-lg bg-base-300 border-base-content/10">Xavfsiz sessiya</div>
                    </div>
                  </div>

                  <button onClick={handleLogout} className={`btn bg-error text-black border-none hover:bg-warning/80 shadow-lg ${accent.glow}`}>
                    <LogOut size={16} />
                    Chiqish
                  </button>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3">
                <StatCard label="Holat" value="Faol" icon={<ShieldCheck size={18} />} accent={accent} />
                <StatCard label="Ruxsat" value="Admin" icon={<BadgeCheck size={18} />} accent={accent} />
                <StatCard label="Profil ID" value={user?.id || "Mavjud emas"} icon={<Hash size={18} />} accent={accent} />
                <StatCard label="Telefon" value={user?.phoneNumber || "Mavjud emas"} icon={<Phone size={18} />} accent={accent} />
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
