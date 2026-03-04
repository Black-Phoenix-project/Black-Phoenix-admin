import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { TrendingUp, PieChart, AlertCircle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export default function DashboardCharts({
  lineData,
  lineOpts,
  topProducts,
  doughnutData,
  doughnutOpts,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-3 md:px-6">
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
  );
}
