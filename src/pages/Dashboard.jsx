import React, { useEffect, useMemo, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import LoadingTemplate from "../components/LoadingTemplate";
import {
  TrendingUp, ShoppingBag, CheckCircle, Clock,
  XCircle, Package, RefreshCw, DollarSign,
  BarChart2, PieChart, AlertCircle
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKENT_URL || "http://localhost:5000";
const currencyUZS = (v) => Number(v || 0).toLocaleString("uz-UZ") + " so'm";

function KpiCard({ icon, label, value, colorClass, sub }) {
  return (
    <div className="card bg-base-100 shadow border border-base-300 p-5 flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <p className="text-xs text-base-content/50 uppercase tracking-widest font-semibold">{label}</p>
        <span className={`${colorClass} opacity-80`}>{icon}</span>
      </div>
      <p className={`text-2xl font-black break-all leading-tight ${colorClass}`}>{value}</p>
      {sub && <p className="text-xs text-base-content/30 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DentistChartsDashboard() {
  const [orders, setOrders]         = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      // ✅ ONLY delivered + paid = real profit
      const [ordersRes, statsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/orders?status=delivered&paymentStatus=paid&limit=1000`),
        fetch(`${BASE_URL}/api/orders/stats`),
      ]);
      const ordersJson = await ordersRes.json();
      const statsJson  = await statsRes.json();
      if (ordersJson.success) setOrders(Array.isArray(ordersJson.data) ? ordersJson.data : []);
      if (statsJson.success)  setStats(statsJson.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ✅ Revenue = sum of order.totalAmount (price * quantity, saved in backend)
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
    [orders]
  );

  const last7DaysRevenue = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const label = date.toLocaleDateString("uz-UZ", { weekday: "short" });
      const amt = orders
        .filter((o) => new Date(o.createdAt).toDateString() === date.toDateString())
        .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
      return { d: label, amt };
    });
  }, [orders]);

  const last7Total = last7DaysRevenue.reduce((s, d) => s + d.amt, 0);

  const productRevenueMap = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const name = o.product?.productName || "Noma'lum";
      map[name] = (map[name] || 0) + (Number(o.totalAmount) || 0);
    });
    return map;
  }, [orders]);

  const topProducts = Object.entries(productRevenueMap).sort((a, b) => b[1] - a[1]);

  // Chart configs
  const lineData = {
    labels: last7DaysRevenue.map((x) => x.d),
    datasets: [{
      label: "Sof foyda",
      data: last7DaysRevenue.map((x) => x.amt),
      fill: true,
      tension: 0.4,
      backgroundColor: "rgba(234,179,8,0.1)",
      borderColor: "#eab308",
      pointBackgroundColor: "#eab308",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 9,
    }],
  };

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => ` ${currencyUZS(c.raw)}` },
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(234,179,8,0.08)" },
        ticks: {
          color: "#94a3b8",
          callback: (v) => v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + "M" : v.toLocaleString(),
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  const doughnutColors = ["#eab308","#f59e0b","#f97316","#fbbf24","#ca8a04","#fde68a"];

  const doughnutData = {
    labels: Object.keys(productRevenueMap),
    datasets: [{
      data: Object.values(productRevenueMap),
      backgroundColor: doughnutColors,
      borderWidth: 3,
      borderColor: "hsl(var(--b1))",
      hoverOffset: 10,
    }],
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      tooltip: {
        callbacks: { label: (c) => ` ${c.label}: ${currencyUZS(c.raw)}` },
      },
    },
  };

  if (loading) return <LoadingTemplate />;

  return (
    <div className="min-h-screen bg-base-300 p-4 md:p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="text-warning" size={28} />
            <h1 className="text-3xl font-black text-warning">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <AlertCircle size={13} className="text-base-content/40" />
            <p className="text-xs text-base-content/40">
              Foyda faqat{" "}
              <span className="badge badge-success badge-xs font-bold">delivered</span>
              {" "}+{" "}
              <span className="badge badge-info badge-xs font-bold">paid</span>
              {" "}orderlardan hisoblanadi
            </p>
          </div>
          {lastUpdated && (
            <p className="text-xs text-base-content/25 mt-1">
              Yangilandi: {lastUpdated.toLocaleTimeString("uz-UZ")}
            </p>
          )}
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="btn btn-warning btn-outline btn-sm gap-2"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Yuklanmoqda..." : "Yangilash"}
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <KpiCard
          icon={<DollarSign size={20} />}
          label="Sof foyda"
          value={currencyUZS(totalRevenue)}
          colorClass="text-warning"
          sub="delivered + paid"
        />
        <KpiCard
          icon={<TrendingUp size={20} />}
          label="7 kun"
          value={currencyUZS(last7Total)}
          colorClass="text-success"
          sub="oxirgi 7 kun"
        />
        <KpiCard
          icon={<CheckCircle size={20} />}
          label="Yetkazildi"
          value={stats?.completedOrders ?? orders.length}
          colorClass="text-info"
          sub="delivered"
        />
        <KpiCard
          icon={<Clock size={20} />}
          label="Kutilmoqda"
          value={stats?.pendingOrders ?? "—"}
          colorClass="text-orange-400"
          sub="pending"
        />
        <KpiCard
          icon={<ShoppingBag size={20} />}
          label="Jami"
          value={stats?.totalOrders ?? "—"}
          colorClass="text-primary"
          sub="barcha buyurtmalar"
        />
        <KpiCard
          icon={<XCircle size={20} />}
          label="Bekor"
          value={stats?.cancelledOrders ?? "—"}
          colorClass="text-error"
          sub="cancelled"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

        {/* Line Chart */}
        <div className="card bg-base-100 shadow border border-base-300 p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-warning" />
            <span className="font-bold text-sm">So'nggi 7 kun tushum</span>
          </div>
          <p className="text-xs text-base-content/35 mb-4">Faqat yakunlangan buyurtmalar</p>
          <div className="h-56">
            <Line data={lineData} options={lineOpts} />
          </div>
        </div>

        {/* Doughnut */}
        <div className="card bg-base-100 shadow border border-base-300 p-5">
          <div className="flex items-center gap-2 mb-1">
            <PieChart size={16} className="text-warning" />
            <span className="font-bold text-sm">Mahsulotlar bo'yicha</span>
          </div>
          <p className="text-xs text-base-content/35 mb-4">Har mahsulotdan tushgan foyda</p>
          <div className="h-56">
            {topProducts.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOpts} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-base-content/30">
                <Package size={36} />
                <span className="text-sm">Ma'lumot yo'q</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Products Table ── */}
      {topProducts.length > 0 && (
        <div className="card bg-base-100 shadow border border-base-300 p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={16} className="text-warning" />
            <span className="font-bold text-sm">Mahsulotlar reytingi</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-base-300">
                  <th className="text-base-content/40 font-semibold text-xs">#</th>
                  <th className="text-base-content/40 font-semibold text-xs">Mahsulot</th>
                  <th className="text-base-content/40 font-semibold text-xs text-right">Tushum</th>
                  <th className="text-base-content/40 font-semibold text-xs text-right">Ulush</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(([name, amt], i) => (
                  <tr key={name} className="border-base-300 hover">
                    <td>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${i < 3 ? "bg-warning/20 text-warning" : "text-base-content/30"}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="font-semibold">{name}</td>
                    <td className="text-right font-black text-warning">{currencyUZS(amt)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <progress
                          className="progress progress-warning w-14 h-1.5"
                          value={totalRevenue > 0 ? (amt / totalRevenue) * 100 : 0}
                          max="100"
                        />
                        <span className="text-xs text-base-content/40 w-9 text-right">
                          {totalRevenue > 0 ? ((amt / totalRevenue) * 100).toFixed(1) + "%" : "0%"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Stats cards from API ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Jami buyurtmalar", value: stats.totalOrders,     color: "text-warning"      },
            { label: "Kutilmoqda",        value: stats.pendingOrders,   color: "text-orange-400"   },
            { label: "Yetkazildi",        value: stats.completedOrders, color: "text-success"      },
            { label: "Bekor qilindi",     value: stats.cancelledOrders, color: "text-error"        },
          ].map((s) => (
            <div key={s.label} className="card bg-base-100 shadow border border-base-300 p-4 text-center">
              <p className="text-xs text-base-content/40 mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <footer className="text-center text-xs text-base-content/20 py-4">
        © {new Date().getFullYear()} PRODUCT WARIORS
      </footer>
    </div>
  );
}