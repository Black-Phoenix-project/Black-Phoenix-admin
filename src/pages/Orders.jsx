import React, { useEffect, useState, useCallback } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import {
  Clock, CheckCircle, XCircle, Truck, Package,
  RefreshCw, Trash2, Eye, Search, Filter,
  ChevronLeft, ChevronRight, ShoppingBag,
  CreditCard, AlertCircle, User, Phone,
  FileText, Hash
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKENT_URL || "http://localhost:5000";
const currencyUZS = (v) => Number(v || 0).toLocaleString("uz-UZ") + " so'm";

const STATUS_CONFIG = {
  pending:    { label: "Kutilmoqda",    colorClass: "text-orange-500", bgClass: "bg-orange-500/10", borderClass: "border-orange-500/30", selectClass: "text-orange-500 border-orange-500/40", icon: <Clock size={12} /> },
  confirmed:  { label: "Tasdiqlandi",   colorClass: "text-blue-500", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/30", selectClass: "text-blue-500 border-blue-500/40", icon: <CheckCircle size={12} /> },
  processing: { label: "Jarayonda",     colorClass: "text-violet-400", bgClass: "bg-violet-400/10", borderClass: "border-violet-400/30", selectClass: "text-violet-400 border-violet-400/40", icon: <RefreshCw size={12} /> },
  shipped:    { label: "Yuborildi",     colorClass: "text-cyan-500", bgClass: "bg-cyan-500/10", borderClass: "border-cyan-500/30", selectClass: "text-cyan-500 border-cyan-500/40", icon: <Truck size={12} /> },
  delivered:  { label: "Yetkazildi",    colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30", selectClass: "text-emerald-500 border-emerald-500/40", icon: <Package size={12} /> },
  cancelled:  { label: "Bekor qilindi", colorClass: "text-red-500", bgClass: "bg-red-500/10", borderClass: "border-red-500/30", selectClass: "text-red-500 border-red-500/40", icon: <XCircle size={12} /> },
};

const PAYMENT_CONFIG = {
  unpaid:   { label: "To'lanmagan", colorClass: "text-red-500", bgClass: "bg-red-500/10", borderClass: "border-red-500/30", selectClass: "text-red-500 border-red-500/40" },
  paid:     { label: "To'langan",   colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30", selectClass: "text-emerald-500 border-emerald-500/40" },
  refunded: { label: "Qaytarildi",  colorClass: "text-amber-400", bgClass: "bg-amber-400/10", borderClass: "border-amber-400/30", selectClass: "text-amber-400 border-amber-400/40" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, colorClass: "text-zinc-400", bgClass: "bg-zinc-800", borderClass: "border-zinc-700", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.colorClass} ${cfg.bgClass} border ${cfg.borderClass} whitespace-nowrap`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function PayBadge({ status }) {
  const cfg = PAYMENT_CONFIG[status] || { label: status, colorClass: "text-zinc-400", bgClass: "bg-zinc-800", borderClass: "border-zinc-700" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.colorClass} ${cfg.bgClass} border ${cfg.borderClass} whitespace-nowrap`}>
      <CreditCard size={11} /> {cfg.label}
    </span>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl max-w-xs border transition-all duration-300 ${toast.type === "error" ? "bg-red-950 border-red-500 text-red-400" : "bg-emerald-950 border-emerald-500 text-emerald-400"}`}>
      {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
      {toast.msg}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const LIMIT = 10;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filterStatus) params.append("status", filterStatus);
      if (filterPayment) params.append("paymentStatus", filterPayment);
      const res = await fetch(`${BASE_URL}/api/orders?${params}`);
      const json = await res.json();
      if (json.success) {
        setOrders(Array.isArray(json.data) ? json.data : []);
        setTotalPages(json.totalPages || 1);
        setTotalCount(json.count || json.data?.length || 0);
      }
    } catch {
      showToast("Ma'lumotlarni yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterPayment]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [filterStatus, filterPayment]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(p => ({ ...p, [orderId + "_status"]: true }));
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?._id === orderId) setSelectedOrder(p => ({ ...p, status: newStatus }));
        showToast(`✅ Status: "${STATUS_CONFIG[newStatus]?.label}" ga o'zgartirildi`);
      } else showToast(json.message || "Xatolik", "error");
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setUpdating(p => ({ ...p, [orderId + "_status"]: false }));
    }
  };

  const updatePayment = async (orderId, newPayment) => {
    setUpdating(p => ({ ...p, [orderId + "_pay"]: true }));
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPayment }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: newPayment } : o));
        if (selectedOrder?._id === orderId) setSelectedOrder(p => ({ ...p, paymentStatus: newPayment }));
        showToast(`💳 To'lov: "${PAYMENT_CONFIG[newPayment]?.label}" ga o'zgartirildi`);
      } else showToast(json.message || "Xatolik", "error");
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setUpdating(p => ({ ...p, [orderId + "_pay"]: false }));
    }
  };

  const deleteOrder = async (orderId) => {
    setDeleting(orderId);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
        if (selectedOrder?._id === orderId) setSelectedOrder(null);
        showToast("🗑️ Buyurtma o'chirildi");
      } else showToast(json.message || "Xatolik", "error");
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setDeleting(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.username?.toLowerCase().includes(q) ||
           o.phoneNumber?.toLowerCase().includes(q) ||
           o.product?.productName?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-base-300 text-zinc-100 p-6 font-sans">
      <Toast toast={toast} />

      <div className="flex justify-between items-start flex-wrap gap-4 ">
        <div>
          <div className="flex items-center gap-3">
            <ShoppingBag size={32} className="text-amber-400" />
            <h1 className="text-4xl font-black text-amber-400">Orders</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Jami <span className="text-amber-400 font-bold">{totalCount}</span> ta buyurtma
          </p>
        </div>
        <button onClick={fetchOrders} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 text-amber-400 text-sm font-semibold transition-all active:scale-95">
          <RefreshCw size={16} /> Yangilash
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-amber-400/20 rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-amber-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-zinc-500" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-zinc-900 border border-amber-400/20 rounded-2xl px-4 py-3 text-sm focus:border-amber-400 focus:outline-none transition-colors cursor-pointer">
            <option value="">Barcha statuslar</option>
            {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
          </select>
        </div>

        <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className="bg-zinc-900 border border-amber-400/20 rounded-2xl px-4 py-3 text-sm focus:border-amber-400 focus:outline-none transition-colors cursor-pointer">
          <option value="">Barcha to'lovlar</option>
          {Object.entries(PAYMENT_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
        </select>

        {(filterStatus || filterPayment || search) && (
          <button onClick={() => { setFilterStatus(""); setFilterPayment(""); setSearch(""); }} className="inline-flex items-center gap-2 px-5 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-2xl text-sm font-semibold transition-all active:scale-95">
            <XCircle size={16} /> Tozalash
          </button>
        )}
      </div>

      {loading ? <LoadingTemplate /> : filteredOrders.length === 0 ? (
        <div className="bg-zinc-900 rounded-3xl border border-amber-400/10 p-16 text-center text-zinc-500">
          <Package size={64} className="mx-auto mb-6 opacity-40" />
          <p className="text-lg">Buyurtmalar topilmadi</p>
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-3xl border border-amber-400/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-amber-400/10">
                  {["#", "Mijoz", "Mahsulot", "Narx", "Status", "To'lov", "Sana", ""].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-zinc-400 font-semibold text-xs uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={order._id} className="border-b border-zinc-800 hover:bg-amber-400/5 transition-colors">
                    <td className="px-6 py-4 text-zinc-500 text-xs font-mono">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{order.username}</div>
                          <div className="text-xs text-zinc-500">{order.phoneNumber}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.product?.image ? (
                          <img src={order.product.image} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" onError={e => e.target.style.display = "none"} />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                            <Package size={18} className="text-amber-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold truncate max-w-[140px]">{order.product?.productName || "—"}</div>
                          <div className="text-xs text-zinc-500">
                            {order.product?.quantity || 1} dona × {currencyUZS(order.product?.price)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-amber-400 whitespace-nowrap">
                      {currencyUZS(order.totalAmount)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          disabled={!!updating[order._id + "_status"]}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className={`bg-zinc-900 border rounded-2xl px-4 py-2.5 text-sm font-medium transition-all focus:border-amber-400 focus:outline-none disabled:opacity-70 ${STATUS_CONFIG[order.status]?.selectClass}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                            <option key={v} value={v}>{c.label}</option>
                          ))}
                        </select>
                        {updating[order._id + "_status"] && <RefreshCw size={14} className="animate-spin text-amber-400" />}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <select
                          value={order.paymentStatus}
                          disabled={!!updating[order._id + "_pay"]}
                          onChange={e => updatePayment(order._id, e.target.value)}
                          className={`bg-zinc-900 border rounded-2xl px-4 py-2.5 text-sm font-medium transition-all focus:border-amber-400 focus:outline-none disabled:opacity-70 ${PAYMENT_CONFIG[order.paymentStatus]?.selectClass}`}
                        >
                          {Object.entries(PAYMENT_CONFIG).map(([v, c]) => (
                            <option key={v} value={v}>{c.label}</option>
                          ))}
                        </select>
                        {updating[order._id + "_pay"] && <RefreshCw size={14} className="animate-spin text-emerald-400" />}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          disabled={deleting === order._id}
                          className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {deleting === order._id ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 py-6 border-t border-amber-400/10">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-3 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-amber-400/30 transition-all active:scale-95 disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-all ${p === page ? "bg-amber-400 text-zinc-950 border-amber-400 font-bold" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-amber-400/30"}`}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="p-3 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-amber-400/30 transition-all active:scale-95 disabled:opacity-50">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="bg-zinc-900 rounded-3xl border border-amber-400/20 w-full max-w-md max-h-[90vh] overflow-y-auto p-8 shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Hash size={20} className="text-amber-400" />
                <span className="font-black text-xl">Buyurtma tafsiloti</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-red-400 hover:text-red-300 text-3xl leading-none">✕</button>
            </div>

            <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-5 mb-5">
              <p className="uppercase text-xs tracking-widest text-zinc-400 mb-4">Mijoz ma'lumotlari</p>
              <div className="flex items-center gap-3 mb-3">
                <User size={18} className="text-amber-400" />
                <span className="font-bold">{selectedOrder.username}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-zinc-400" />
                <span className="text-zinc-300">{selectedOrder.phoneNumber}</span>
              </div>
              {selectedOrder.description && (
                <div className="flex gap-3 mt-4">
                  <FileText size={18} className="text-zinc-400 mt-0.5" />
                  <span className="text-sm text-zinc-300">{selectedOrder.description}</span>
                </div>
              )}
            </div>

            <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-5 mb-5">
              <p className="uppercase text-xs tracking-widest text-zinc-400 mb-4">Mahsulot</p>
              <div className="flex gap-5">
                {selectedOrder.product?.image ? (
                  <img src={selectedOrder.product.image} alt="" className="w-14 h-14 rounded-2xl object-cover" onError={e => e.target.style.display = "none"} />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center">
                    <Package size={28} className="text-amber-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-bold">{selectedOrder.product?.productName}</div>
                  <div className="text-sm text-zinc-400 mt-1">
                    {(selectedOrder.product?.quantity || 1)} dona × {currencyUZS(selectedOrder.product?.price)}
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-3">
                    {currencyUZS(selectedOrder.totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="uppercase text-xs text-zinc-400 mb-2 tracking-widest">Status</p>
                <select
                  value={selectedOrder.status}
                  disabled={!!updating[selectedOrder._id + "_status"]}
                  onChange={e => updateStatus(selectedOrder._id, e.target.value)}
                  className={`w-full bg-zinc-900 border rounded-2xl px-5 py-3 text-sm transition-all focus:border-amber-400 ${STATUS_CONFIG[selectedOrder.status]?.selectClass}`}
                >
                  {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <p className="uppercase text-xs text-zinc-400 mb-2 tracking-widest">To'lov holati</p>
                <select
                  value={selectedOrder.paymentStatus}
                  disabled={!!updating[selectedOrder._id + "_pay"]}
                  onChange={e => updatePayment(selectedOrder._id, e.target.value)}
                  className={`w-full bg-zinc-900 border rounded-2xl px-5 py-3 text-sm transition-all focus:border-amber-400 ${PAYMENT_CONFIG[selectedOrder.paymentStatus]?.selectClass}`}
                >
                  {Object.entries(PAYMENT_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <StatusBadge status={selectedOrder.status} />
              <PayBadge status={selectedOrder.paymentStatus} />
            </div>

            <p className="text-xs text-zinc-500 text-right mb-8">
              📅 {new Date(selectedOrder.createdAt).toLocaleString("uz-UZ")}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { deleteOrder(selectedOrder._id); setSelectedOrder(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-2xl font-semibold transition-all active:scale-95"
              >
                <Trash2 size={18} /> O'chirish
              </button>
              <button onClick={() => setSelectedOrder(null)} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 text-amber-400 rounded-2xl font-semibold transition-all active:scale-95">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}