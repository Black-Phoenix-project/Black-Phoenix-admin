import React, { useEffect, useMemo, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import LoadingTemplate from "../components/LoadingTemplate";

const currencyUZS = (v) =>
  Number(v || 0).toLocaleString("uz-UZ") + " so'm";

export default function DentistChartsDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product");
        const json = await res.json();

        if (json.success) {
          // if API returns single object
          if (Array.isArray(json.data)) {
            setProducts(json.data);
          } else {
            setProducts([json.data]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= KPI CALCULATIONS =================
  const totalRevenue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [products]);

  const totalProducts = products.length;

  const last7DaysRevenue = useMemo(() => {
    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const label = date.toLocaleDateString("uz-UZ", { weekday: "short" });

      const dayRevenue = products
        .filter(
          (p) =>
            new Date(p.createdAt).toDateString() === date.toDateString()
        )
        .reduce((sum, p) => sum + p.price, 0);

      return { d: label, amt: dayRevenue };
    });

    return last7;
  }, [products]);

  // ================= CHART DATA =================
  const revenueLine = useMemo(() => ({
    labels: last7DaysRevenue.map((x) => x.d),
    datasets: [
      {
        label: "So‘nggi 7 kun daromad",
        data: last7DaysRevenue.map((x) => x.amt),
        fill: true,
        tension: 0.35,
        backgroundColor: "rgba(234,179,8,0.2)", // warning light
        borderColor: "rgba(234,179,8,1)", // warning
        pointRadius: 4,
      },
    ],
  }), [last7DaysRevenue]);

  const revenueLineOpts = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const productsDoughnut = useMemo(() => ({
    labels: products.map((p) => p.name),
    datasets: [
      {
        data: products.map((p) => p.price),
        backgroundColor: [
          "#facc15",
          "#fbbf24",
          "#f59e0b",
          "#d97706",
          "#b45309",
        ],
        borderWidth: 0,
      },
    ],
  }), [products]);

  // ================= UI =================
  if (loading) {
    return <div>
      <LoadingTemplate/>
    </div>;
  }

  return (
    <div className="min-h-screen bg-base-300 rounded-2xl">
    <div className="p-6">
      <h1 className="text-2xl text-warning font-bold">Dashboard</h1>
    </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="card bg-base-100 border border-warning shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs">Total Products</p>
              <h3 className="text-2xl font-bold text-warning">
                {totalProducts}
              </h3>
            </div>
          </div>

          <div className="card bg-base-100 border border-warning shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs">Umumiy summa</p>
              <h3 className="text-2xl font-bold text-success">
                {currencyUZS(totalRevenue)}
              </h3>
            </div>
          </div>

          <div className="card bg-base-100 border border-warning shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs">So'nggi 7 kunda</p>
              <h3 className="text-2xl font-bold text-success">
                {currencyUZS(
                  last7DaysRevenue.reduce((s, d) => s + d.amt, 0)
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="card bg-base-100 border border-warning shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-base text-warning">
                So‘nggi 7 kun tushum
              </h2>
              <div className="h-64">
                <Line data={revenueLine} options={revenueLineOpts} />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-warning shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-base text-warning">
                Mahsulot narxlari
              </h2>
              <div className="h-64">
                <Doughnut data={productsDoughnut} />
              </div>
            </div>
          </div>

        </div>

        <div className="text-xs text-center py-6 text-warning">
          © {new Date().getFullYear()} PRODUCT WARIORS !
        </div>
      </div>
    </div>
  );
}
