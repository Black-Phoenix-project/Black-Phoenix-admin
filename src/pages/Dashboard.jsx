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
    <div className="card bg-base-200 p-3 md:p-4 flex flex-col justify-between gap-1">
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] md:text-xs text-base-content/50 font-medium uppercase tracking-wide">
          {label}
        </span>
        <span className={`hidden md:flex items-center justify-center ${colorClass}`}>
          {icon}
        </span>
      </div>
      {/* Value */}
      <div className={`font-bold text-sm md:text-base leading-tight break-all ${colorClass}`}>
        {value}
      </div>
      {/* Sub */}
      {sub && (
        <div className="flex items-center gap-1">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${colorClass} opacity-60`} />
          <span className="text-[10px] text-base-content/40">{sub}</span>
        </div>
      )}
    </div>
  );
}

export default function DentistChartsDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/orders?status=confirmed&paymentStatus=paid&limit=1000`),
        fetch(`${BASE_URL}/api/orders/stats`),
      ]);
      const ordersJson = await ordersRes.json();
      const statsJson = await statsRes.json();
      if (ordersJson.success) setOrders(Array.isArray(ordersJson.data) ? ordersJson.data : []);
      if (statsJson.success) setStats(statsJson.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
      tooltip: { callbacks: { label: (c) => ` ${currencyUZS(c.raw)}` } },
    },
    scales: {
      y: {
        grid: { color: "rgba(234,179,8,0.08)" },
        ticks: {
          color: "#94a3b8",
          maxTicksLimit: 4,
          callback: (v) => v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + "M" : v.toLocaleString(),
        },
      },
      x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
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
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => ` ${c.label}: ${currencyUZS(c.raw)}` } },
    },
  };

  if (loading) return <LoadingTemplate />;

  return (
    <div className="min-h-screen flex flex-col gap-5 md:gap-6 pb-8">

      {/* ── Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-3 md:px-6 py-3 md:py-4 border-b border-base-300">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-warning" size={20} />
          <h1 className="text-base md:text-xl font-bold">Dashboard</h1>
          <span className="badge badge-warning badge-xs md:badge-sm">delivered + paid</span>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          {lastUpdated && (
            <span className="text-[10px] md:text-xs text-base-content/40">
              {lastUpdated.toLocaleTimeString("uz-UZ")}
            </span>
          )}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="btn btn-warning btn-outline btn-xs md:btn-sm gap-1"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "..." : "Yangilash"}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 px-3 md:px-6">
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
          icon={<Package size={20} />}
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
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-3 md:px-6">

        {/* Line Chart */}
        <div className="card bg-base-200 flex-1 flex flex-col p-3 md:p-4">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div>
              <div className="font-semibold text-xs md:text-sm flex items-center gap-2">
                <TrendingUp size={13} className="text-warning" />
                So'nggi 7 kun tushum
              </div>
              <div className="text-[10px] md:text-xs text-base-content/50 mt-0.5">
                Faqat yakunlangan buyurtmalar
              </div>
            </div>
          </div>
          <div className="flex-1" style={{ height: "clamp(160px, 30vw, 240px)" }}>
            <Line data={lineData} options={lineOpts} />
          </div>
        </div>

        {/* Doughnut */}
        <div className="card bg-base-200 w-full lg:w-72 flex flex-col p-3 md:p-4">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div>
              <div className="font-semibold text-xs md:text-sm flex items-center gap-2">
                <PieChart size={13} className="text-warning" />
                Mahsulotlar bo'yicha
              </div>
              <div className="text-[10px] md:text-xs text-base-content/50 mt-0.5">
                Har mahsulotdan tushgan foyda
              </div>
            </div>
          </div>
          <div className="flex-1" style={{ height: "clamp(150px, 28vw, 210px)" }}>
            {topProducts.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOpts} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-base-content/30">
                  <AlertCircle size={28} className="mx-auto mb-2" />
                  <p className="text-xs">Ma'lumot yo'q</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Products Table ── */}
      {topProducts.length > 0 && (
        <div className="px-3 md:px-6">
          <div className="font-semibold text-sm md:text-base flex items-center gap-2 mb-2 md:mb-3">
            <ShoppingBag size={15} className="text-warning" />
            Mahsulotlar reytingi
          </div>
          <div className="overflow-x-auto rounded-xl">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-[10px] md:text-xs">
                  <th>#</th>
                  <th>Mahsulot</th>
                  <th>Tushum</th>
                  <th className="hidden sm:table-cell">Ulush</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(([name, amt], i) => (
                  <tr key={name}>
                    <td className="font-bold text-warning text-xs md:text-sm">{i + 1}</td>
                    <td className="text-xs md:text-sm max-w-[100px] md:max-w-none truncate">{name}</td>
                    <td className="font-semibold text-xs md:text-sm whitespace-nowrap">{currencyUZS(amt)}</td>
                    <td className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <progress
                          className="progress progress-warning w-14 md:w-20"
                          value={totalRevenue > 0 ? (amt / totalRevenue) * 100 : 0}
                          max="100"
                        />
                        <span className="text-[10px] md:text-xs text-base-content/60">
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
        <div className="px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {[
              { label: "Jami buyurtmalar", value: stats.totalOrders, color: "text-warning" },
              { label: "Kutilmoqda", value: stats.pendingOrders, color: "text-orange-400" },
              { label: "Yetkazildi", value: stats.completedOrders, color: "text-success" },
              { label: "Bekor qilindi", value: stats.cancelledOrders, color: "text-error" },
            ].map((s) => (
              <div
                key={s.label}
                className="card bg-base-200 p-3 md:p-4 flex flex-col items-center justify-center gap-1 text-center"
              >
                <div className="text-[10px] md:text-xs text-base-content/50">{s.label}</div>
                <div className={`text-xl md:text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="flex items-center justify-center text-[10px] md:text-xs text-base-content/30 mt-auto pt-3">
        © {new Date().getFullYear()} PRODUCT WARIORS
      </footer>

    </div>
  );
}