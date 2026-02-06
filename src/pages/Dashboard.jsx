import React, { useMemo } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import Container from "../components/Container";

const currencyUZS = (v) =>
  Number(v || 0).toLocaleString("uz-UZ") + " so'm";

const kpi = {
  todayAppointments: 18,
  monthRevenue: 48600000,
  unpaidCount: 7,
  satisfaction: 92,
};

const last7DaysRevenue = [
  { d: "Du", amt: 6_200_000 },
  { d: "Se", amt: 7_450_000 },
  { d: "Ch", amt: 5_900_000 },
  { d: "Pa", amt: 8_300_000 },
  { d: "Ju", amt: 9_100_000 },
  { d: "Sh", amt: 6_750_000 },
  { d: "Ya", amt: 7_800_000 },
];

const services = [
  { label: "base-300ning", value: 23 },
  { label: "Filling", value: 31 },
  { label: "Root Canal", value: 12 },
  { label: "Scaling", value: 18 },
  { label: "Implant", value: 8 },
];

const weekAppointments = [
  { d: "Du", count: 16 },
  { d: "Se", count: 21 },
  { d: "Ch", count: 14 },
  { d: "Pa", count: 19 },
  { d: "Ju", count: 24 },
  { d: "Sh", count: 13 },
  { d: "Ya", count: 17 },
];

export default function DentistChartsDashboard() {
  const revenueLine = useMemo(() => {
    return {
      labels: last7DaysRevenue.map((x) => x.d),
      datasets: [
        {
          label: "So‘nggi 7 kun daromad",
          data: last7DaysRevenue.map((x) => x.amt),
          fill: true,
          tension: 0.35,
          backgroundColor: "rgba(59,130,246,0.15)",
          borderColor: "rgba(59,130,246,1)",
          pointRadius: 3,
        },
      ],
    };
  }, []);

  const revenueLineOpts = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => currencyUZS(ctx.parsed.y),
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) =>
              Number(v).toLocaleString("uz-UZ") + " so'm",
          },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
        x: { grid: { display: false } },
      },
    }),
    []
  );

  const servicesDoughnut = useMemo(() => {
    return {
      labels: services.map((s) => s.label),
      datasets: [
        {
          label: "Xizmatlar ulushi",
          data: services.map((s) => s.value),
          backgroundColor: [
            "rgba(59,130,246,0.8)",   // blue
            "rgba(34,197,94,0.8)",    // green
            "rgba(249,115,22,0.8)",   // orange
            "rgba(99,102,241,0.8)",   // indigo
            "rgba(236,72,153,0.8)",   // pink
          ],
          borderWidth: 0,
        },
      ],
    };
  }, []);

  const servicesDoughnutOpts = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
      cutout: "60%",
    }),
    []
  );

  const weekBar = useMemo(() => {
    return {
      labels: weekAppointments.map((x) => x.d),
      datasets: [
        {
          label: "Haftalik qabul (soni)",
          data: weekAppointments.map((x) => x.count),
          backgroundColor: "rgba(34,197,94,0.8)", // green-500
          borderRadius: 6,
          maxBarThickness: 42,
        },
      ],
    };
  }, []);

  const weekBarOpts = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: {
        y: {
          grid: { color: "rgba(148,163,184,0.2)" },
          ticks: { precision: 0 },
        },
        x: { grid: { display: false } },
      },
    }),
    []
  );

  return (
    <div className="min-h-screen bg-base-300 rounded-2xl ">
      <div className="navbar bg-base-300 rounded-2xl shadow-md border-b border-base-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto w-full px-4">
          <span className="text-lg font-bold">Dentist Dashboard</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs text-base-content/70">Bugungi qabul</p>
              <h3 className="text-2xl font-bold">{kpi.todayAppointments}</h3>
            </div>
          </div>
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs text-base-content/70">Oylik tushum</p>
              <h3 className="text-2xl font-bold">{currencyUZS(kpi.monthRevenue)}</h3>
            </div>
          </div>
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs text-base-content/70">To‘lanmagan</p>
              <h3 className="text-2xl font-bold">{kpi.unpaidCount}</h3>
            </div>
          </div>
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs text-base-content/70">Qoniqish</p>
              <h3 className="text-2xl font-bold">{kpi.satisfaction}%</h3>
            </div>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue line (span 2) */}
          <div className="card bg-base-100 border border-base-300 shadow-sm lg:col-span-2">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="card-title text-base">So‘nggi 7 kun tushum</h2>
                <span className="badge badge-outline">UZS</span>
              </div>
              <div className="h-64">
                <Line data={revenueLine} options={revenueLineOpts} />
              </div>
            </div>
          </div>

          {/* Services doughnut */}
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-base mb-2">Xizmatlar ulushi</h2>
              <div className="h-64">
                <Doughnut data={servicesDoughnut} options={servicesDoughnutOpts} />
              </div>
            </div>
          </div>

          {/* Weekly appointments bar (span 3 on lg) */}
          <div className="card bg-base-100 border border-base-300 shadow-sm lg:col-span-3">
            <div className="card-body p-5">
              <h2 className="card-title text-base mb-2">Haftalik qabul (soni)</h2>
              <div className="h-72">
                <Bar data={weekBar} options={weekBarOpts} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-base-content/60 text-center py-6">
          © {new Date().getFullYear()} Dentist Admin • Charts by Chart.js
        </div>
      </div>
    </div>
  );
}
