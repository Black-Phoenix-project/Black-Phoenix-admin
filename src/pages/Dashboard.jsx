import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import {
  ShoppingBag, CheckCircle, Clock,
  XCircle, Package, RefreshCw,
  BarChart2
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;
const currencyUZS = (v) => Number(v || 0).toLocaleString("uz-UZ") + " so'm";
const DashboardCharts = lazy(() => import("../components/dashboard/DashboardCharts"));

function KpiCard({ icon, label, value, colorClass, sub }) {
  return (
    <div className="card bg-base-200 p-3 md:p-4 flex flex-col justify-between gap-1">
      
      <div className="flex items-center justify-between">
        <span className="text-[10px] md:text-xs text-base-content/50 font-medium uppercase tracking-wide">
          {label}
        </span> 
        <span className={`hidden md:flex items-center justify-center ${colorClass}`}>
          {icon}
        </span>
      </div>
      
      <div className={`font-bold text-sm md:text-base leading-tight break-all ${colorClass}`}>
        {value}
      </div>
      
      {sub && (
        <div className="flex items-center gap-1">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${colorClass} opacity-60`} />
          <span className="text-[10px] text-base-content/40">{sub}</span>
        </div>
      )}
    </div>
  );
}

function ChartsSectionSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-3 md:px-6">
      <div className="card bg-base-200 flex-1 p-3 md:p-4">
        <div className="h-[200px] animate-pulse rounded-xl bg-base-300/70" />
      </div>
      <div className="card bg-base-200 w-full lg:w-72 p-3 md:p-4">
        <div className="h-[200px] animate-pulse rounded-xl bg-base-300/70" />
      </div>
    </div>
  );
}

export default function DentistChartsDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const chartsGateRef = useRef(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const statsRes = await fetch(`${BASE_URL}/api/orders/stats`);
      const statsJson = await statsRes.json();
      if (statsJson.success) setStats(statsJson.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrdersData = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const ordersRes = await fetch(
        `${BASE_URL}/api/orders?status=confirmed&paymentStatus=paid&limit=300`
      );
      const ordersJson = await ordersRes.json();
      if (ordersJson.success) {
        setOrders(Array.isArray(ordersJson.data) ? ordersJson.data : []);
      }
    } catch (err) {
      console.error("Dashboard orders fetch error:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchStats(), showCharts ? fetchOrdersData() : Promise.resolve()]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    let timeoutId;
    let idleId;
    let observer;
    const start = () => setShowCharts(true);

    if (typeof window !== "undefined" && chartsGateRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            start();
            observer.disconnect();
          }
        },
        { rootMargin: "160px 0px" }
      );
      observer.observe(chartsGateRef.current);
    }

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 6000 });
    } else {
      timeoutId = window.setTimeout(start, 3500);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!showCharts) return;
    fetchOrdersData();
  }, [showCharts, fetchOrdersData]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
    [orders]
  );

  const last7DaysRevenue = useMemo(() => {
    const byDate = new Map();
    for (const o of orders) {
      const key = new Date(o.createdAt).toDateString();
      byDate.set(key, (byDate.get(key) || 0) + (Number(o.totalAmount) || 0));
    }
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const key = date.toDateString();
      return {
        d: date.toLocaleDateString("ru-RU", { weekday: "short" }),
        amt: byDate.get(key) || 0,
      };
    });
  }, [orders]);

  const productRevenueMap = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const name = o.product?.productName || "Неизвестно";
      map[name] = (map[name] || 0) + (Number(o.totalAmount) || 0);
    });
    return map;
  }, [orders]);

  const sortedProducts = useMemo(
    () => Object.entries(productRevenueMap).sort((a, b) => b[1] - a[1]),
    [productRevenueMap]
  );

  const topProducts = useMemo(() => sortedProducts.slice(0, 10), [sortedProducts]);

  const chartProducts = useMemo(() => {
    if (sortedProducts.length <= 8) return sortedProducts;
    const top = sortedProducts.slice(0, 8);
    const otherAmount = sortedProducts
      .slice(8)
      .reduce((sum, [, value]) => sum + value, 0);
    return [...top, ["Остальные", otherAmount]];
  }, [sortedProducts]);

  const lineData = useMemo(() => ({
    labels: last7DaysRevenue.map((x) => x.d),
    datasets: [{
      label: "Выручка",
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
  }), [last7DaysRevenue]);

  const lineOpts = useMemo(() => ({
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
  }), []);

  const doughnutColors = ["#eab308","#f59e0b","#f97316","#fbbf24","#ca8a04","#fde68a"];

  const doughnutData = useMemo(() => ({
    labels: chartProducts.map(([name]) => name),
    datasets: [{
      data: chartProducts.map(([, value]) => value),
      backgroundColor: doughnutColors,
      borderWidth: 3,
      borderColor: "hsl(var(--b1))",
      hoverOffset: 10,
    }],
  }), [chartProducts]);

  const doughnutOpts = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => ` ${c.label}: ${currencyUZS(c.raw)}` } },
    },
  }), []);

  if (loading && !stats) return <LoadingTemplate />;

  return (
    <div className="min-h-screen flex flex-col gap-5 md:gap-6 pb-8">

      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-3 md:px-6 py-3 md:py-4 border-b border-base-300">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-warning" size={20} />
          <h1 className="text-base md:text-xl font-bold">Панель управления</h1>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          {lastUpdated && (
            <span className="text-[10px] md:text-xs text-base-content/40">
              {lastUpdated.toLocaleTimeString("uz-UZ")}
            </span>
          )}
          <button
            onClick={refreshAll}
            disabled={refreshing}
            className="btn btn-warning btn-outline btn-xs md:btn-sm gap-1"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "..." : "Обновить"}
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 px-3 md:px-6">
        
       
        <KpiCard
          icon={<CheckCircle size={20} />}
          label="Доставлено"
          value={stats?.completedOrders ?? orders.length}
          colorClass="text-info"
          sub="доставлено"
        />
        <KpiCard
          icon={<Clock size={20} />}
          label="В ожидании"
          value={stats?.pendingOrders ?? "—"}
          colorClass="text-orange-400"
          sub="ожидает"
        />
        <KpiCard
          icon={<Package size={20} />}
          label="Всего"
          value={stats?.totalOrders ?? "—"}
          colorClass="text-primary"
          sub="все заказы"
        />
        <KpiCard
          icon={<XCircle size={20} />}
          label="Отменено"
          value={stats?.cancelledOrders ?? "—"}
          colorClass="text-error"
          sub="отменено"
        />
      </div>

      
      <div ref={chartsGateRef}>
        {!showCharts || ordersLoading ? (
          <ChartsSectionSkeleton />
        ) : (
          <Suspense fallback={<ChartsSectionSkeleton />}>
            <DashboardCharts
              lineData={lineData}
              lineOpts={lineOpts}
              topProducts={topProducts}
              doughnutData={doughnutData}
              doughnutOpts={doughnutOpts}
            />
          </Suspense>
        )}
      </div>

      
      {!ordersLoading && topProducts.length > 0 && (
        <div className="px-3 md:px-6">
          <div className="font-semibold text-sm md:text-base flex items-center gap-2 mb-2 md:mb-3">
            <ShoppingBag size={15} className="text-warning" />
            Рейтинг товаров
          </div>
          <div className="overflow-x-auto rounded-xl">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-[10px] md:text-xs">
                  <th>#</th>
                  <th>Товар</th>
                  <th>Выручка</th>
                  <th className="hidden sm:table-cell">Доля</th>
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

      
      {stats && (
        <div className="px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {[
              { label: "Всего заказов", value: stats.totalOrders, color: "text-warning" },
              { label: "В ожидании", value: stats.pendingOrders, color: "text-orange-400" },
              { label: "Доставлено", value: stats.completedOrders, color: "text-success" },
              { label: "Отменено", value: stats.cancelledOrders, color: "text-error" },
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

      
      <footer className="flex items-center justify-center text-[10px] md:text-xs text-base-content/30 mt-auto pt-3">
        © {new Date().getFullYear()} Black Phoenix
      </footer>

    </div>
  );
}
