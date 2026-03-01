import React, { useEffect, useMemo, useState } from "react";
import {
  WalletCards,
  TrendingUp,
  RefreshCw,
  CreditCard,
  CircleDollarSign,
  Clock3,
  RotateCcw,
  ReceiptText,
} from "lucide-react";
import LoadingTemplate from "../components/LoadingTemplate";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;
const asUZS = (v) => Number(v || 0).toLocaleString("uz-UZ") + " so'm";

const paymentStyle = {
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  unpaid: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  refunded: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const paymentLabel = {
  paid: "To'langan",
  unpaid: "To'lanmagan",
  refunded: "Qaytarilgan",
};

function MetricCard({ icon, label, value, sub, tone }) {
  return (
    <div className={`rounded-2xl border p-4 bg-base-200/80 border-base-content/10 ${tone || ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-base-content/60">{label}</span>
        <span className="text-warning">{icon}</span>
      </div>
      <p className="mt-2 text-xl md:text-2xl font-black text-success">{value}</p>
      {sub && <p className="text-xs text-base-content/50 mt-1">{sub}</p>}
    </div>
  );
}

const Wallet = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWalletData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${BASE_URL}/api/orders/stats`),
        fetch(`${BASE_URL}/api/orders?page=1&limit=200`),
      ]);
      const statsJson = await statsRes.json();
      const ordersJson = await ordersRes.json();

      if (statsJson?.success) setStats(statsJson.data);
      if (ordersJson?.success) setOrders(Array.isArray(ordersJson.data) ? ordersJson.data : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Hamyon ma'lumotini yuklashda xatolik:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const paymentCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        const key = order.paymentStatus || "unpaid";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { paid: 0, unpaid: 0, refunded: 0 }
    );
  }, [orders]);

  const income7Days = useMemo(() => {
    const today = new Date();
    const rows = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      return { key, label: d.toLocaleDateString("uz-UZ", { weekday: "short" }), amount: 0 };
    });

    const map = Object.fromEntries(rows.map((r) => [r.key, r]));
    orders.forEach((o) => {
      if (o.paymentStatus !== "paid") return;
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (map[key]) map[key].amount += Number(o.totalAmount) || 0;
    });

    return rows;
  }, [orders]);

  const incomeMax = Math.max(...income7Days.map((d) => d.amount), 1);
  const recentOrders = orders.slice(0, 8);

  if (loading) return <LoadingTemplate />;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-300 p-5 md:p-7 shadow-2xl">
          <div className="absolute -top-20 -left-12 w-72 h-72 rounded-full bg-warning/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-8 w-64 h-64 rounded-full bg-warning/10 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-warning flex items-center gap-2">
                <WalletCards size={28} />
                Hamyon
              </h1>
              <p className="text-base-content/60 mt-1 text-sm">To'lovlar, tushumlar va tranzaksiyalar nazorati</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <p className="text-xs text-base-content/50">
                  Yangilandi: {lastUpdated.toLocaleTimeString("uz-UZ")}
                </p>
              )}
              <button
                onClick={() => fetchWalletData(true)}
                className="btn btn-warning btn-outline rounded-xl gap-2"
                disabled={refreshing}
              >
                <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Yangilanmoqda..." : "Yangilash"}
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            icon={<CircleDollarSign size={18} />}
            label="Jami tushum"
            value={asUZS(stats?.totalRevenue || 0)}
            sub="To'langan buyurtmalar bo'yicha"
          />
          <MetricCard
            icon={<CreditCard size={18} />}
            label="To'langanlar"
            value={paymentCounts.paid}
            sub="Tranzaksiya soni"
          />
          <MetricCard
            icon={<Clock3 size={18} />}
            label="Kutilayotgan to'lov"
            value={paymentCounts.unpaid}
            sub="To'lanmagan buyurtmalar"
          />
          <MetricCard
            icon={<RotateCcw size={18} />}
            label="Qaytarilgan"
            value={paymentCounts.refunded}
            sub="Refund qilinganlar"
          />
        </section>

        <section className="grid lg:grid-cols-[1.3fr,1fr] gap-4">
          <div className="rounded-3xl border border-base-content/10 bg-base-300 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-warning" />
              <h2 className="font-bold text-base md:text-lg">Oxirgi 7 kun tushumi</h2>
            </div>
            <div className="h-52 flex items-end gap-3">
              {income7Days.map((day) => {
                const h = Math.max((day.amount / incomeMax) * 100, day.amount > 0 ? 8 : 2);
                return (
                  <div key={day.key} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-[10px] text-base-content/50">{day.amount > 0 ? `${Math.round((day.amount / incomeMax) * 100)}%` : "0%"}</div>
                    <div className="w-full rounded-xl bg-base-200 h-36 flex items-end overflow-hidden border border-base-content/10">
                      <div
                        className="w-full bg-gradient-to-t from-warning to-warning/50 rounded-xl transition-all duration-500"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <div className="text-xs text-base-content/70">{day.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-base-content/10 bg-base-300 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ReceiptText size={16} className="text-warning" />
              <h2 className="font-bold text-base md:text-lg">To'lov holati</h2>
            </div>
            <div className="space-y-3">
              {["paid", "unpaid", "refunded"].map((k) => {
                const total = orders.length || 1;
                const share = Math.round(((paymentCounts[k] || 0) / total) * 100);
                return (
                  <div key={k} className="rounded-2xl border border-base-content/10 bg-base-200/70 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs border ${paymentStyle[k]}`}>
                        {paymentLabel[k]}
                      </span>
                      <span className="text-sm font-bold">{paymentCounts[k] || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
                      <div className="h-full bg-warning rounded-full" style={{ width: `${share}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-base-content/50">Ulush: {share}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-base-content/10 bg-base-300 p-5 md:p-6">
          <h2 className="font-bold text-base md:text-lg mb-4">So'nggi tranzaksiyalar</h2>
          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-base-content/50">Tranzaksiya ma'lumoti topilmadi</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-xs">
                    <th>Mijoz</th>
                    <th>Mahsulot</th>
                    <th>Summa</th>
                    <th>To'lov</th>
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <div className="font-semibold text-sm">{order.username}</div>
                        <div className="text-xs text-base-content/50">{order.phoneNumber}</div>
                      </td>
                      <td className="text-sm">{order.product?.productName || "Noma'lum"}</td>
                      <td className="font-bold text-warning">{asUZS(order.totalAmount)}</td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-full text-xs border ${paymentStyle[order.paymentStatus] || paymentStyle.unpaid}`}>
                          {paymentLabel[order.paymentStatus] || "To'lanmagan"}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/60">
                        {new Date(order.createdAt).toLocaleString("uz-UZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Wallet;
