import React, { useEffect, useState, useCallback, useRef } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import {
  Clock, CheckCircle, XCircle, Truck, Package, RefreshCw,
  Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight,
  ShoppingBag, CreditCard, AlertCircle, User, Phone,
  FileText, ChevronDown, Check, Calendar,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;
const currencyUZS = (v) => Number(v || 0).toLocaleString("uz-UZ") + " so'm";

const STATUS_CONFIG = {
  pending:    { label: "Kutilmoqda",    colorClass: "text-orange-400",  bgClass: "bg-orange-500/10",  borderClass: "border-orange-500/30",  dotColor: "bg-orange-400",  icon: <Clock size={12} /> },
  confirmed:  { label: "Tasdiqlandi",   colorClass: "text-blue-400",    bgClass: "bg-blue-500/10",    borderClass: "border-blue-500/30",    dotColor: "bg-blue-400",    icon: <CheckCircle size={12} /> },
  processing: { label: "Jarayonda",    colorClass: "text-violet-400",  bgClass: "bg-violet-500/10",  borderClass: "border-violet-500/30",  dotColor: "bg-violet-400",  icon: <RefreshCw size={12} /> },
  shipped:    { label: "Yuborildi",    colorClass: "text-cyan-400",    bgClass: "bg-cyan-500/10",    borderClass: "border-cyan-500/30",    dotColor: "bg-cyan-400",    icon: <Truck size={12} /> },
  delivered:  { label: "Yetkazildi",   colorClass: "text-emerald-400", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30", dotColor: "bg-emerald-400", icon: <Package size={12} /> },
  cancelled:  { label: "Bekor qilindi",colorClass: "text-red-400",    bgClass: "bg-red-500/10",     borderClass: "border-red-500/30",     dotColor: "bg-red-400",     icon: <XCircle size={12} /> },
};

const PAYMENT_CONFIG = {
  unpaid:   { label: "To'lanmagan", colorClass: "text-red-400",     bgClass: "bg-red-500/10",     borderClass: "border-red-500/30",     dotColor: "bg-red-400" },
  paid:     { label: "To'langan",   colorClass: "text-emerald-400", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30", dotColor: "bg-emerald-400" },
  refunded: { label: "Qaytarildi",  colorClass: "text-amber-400",   bgClass: "bg-amber-400/10",   borderClass: "border-amber-400/30",   dotColor: "bg-amber-400" },
};

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

function isDeliveredAllowed(currentStatus) {
  const confirmedIdx = STATUS_ORDER.indexOf("confirmed");
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  return currentIdx >= confirmedIdx && currentStatus !== "cancelled";
}
function CustomSelect({ value, onChange, options, disabled, className, dropUp }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative select-none ${className || ""}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(p => !p)}
        className={`
          w-full flex items-center justify-between gap-2
          bg-base-100 border rounded-xl px-3 py-2
          text-xs font-medium transition-all
          hover:border-amber-400/50 focus:outline-none
          disabled:opacity-60 disabled:cursor-not-allowed
          ${current?.borderClass || "border-zinc-700"}
          ${current?.colorClass || "text-base-content"}
        `}
      >
        <span className="flex items-center gap-1.5 truncate">
          {current?.dotEl}
          <span className="truncate">{current?.label}</span>
        </span>
        <ChevronDown
          size={12}
          className={`shrink-0 transition-transform duration-200 opacity-60 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`
            absolute z-50 w-full min-w-[150px]
            bg-base-300 border border-zinc-700/80
            rounded-xl shadow-2xl shadow-black/60 overflow-hidden
            ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}
          `}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              disabled={opt.disabled}
              onClick={() => {
                if (!opt.disabled) { onChange(opt.value); setOpen(false); }
              }}
              className={`
                w-full flex items-center justify-between px-3.5 py-2.5 text-xs
                transition-colors duration-100 cursor-pointer
                ${opt.disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}
                ${opt.value === value ? "bg-white/5" : ""}
                ${opt.colorClass || "text-zinc-300"}
              `}
            >
              <span className="flex items-center gap-2">
                {opt.dotEl}
                <span>{opt.label}</span>
              </span>
              {opt.value === value && <Check size={11} className="opacity-70 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function buildStatusOptions(currentStatus) {
  return Object.entries(STATUS_CONFIG).map(([v, c]) => ({
    value: v,
    label: c.label,
    colorClass: c.colorClass,
    borderClass: c.borderClass,
    disabled: v === "delivered" && !isDeliveredAllowed(currentStatus),
    dotEl: <span className={`inline-block w-2 h-2 rounded-full ${c.dotColor} shrink-0`} />,
  }));
}

function buildPaymentOptions() {
  return Object.entries(PAYMENT_CONFIG).map(([v, c]) => ({
    value: v,
    label: c.label,
    colorClass: c.colorClass,
    borderClass: c.borderClass,
    dotEl: <span className={`inline-block w-2 h-2 rounded-full ${c.dotColor} shrink-0`} />,
  }));
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium
        ${toast.type === "error"
          ? "bg-red-950 border-red-500/40 text-red-300"
          : "bg-zinc-900 border-emerald-500/40 text-emerald-300"
        }`}
    >
      {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {toast.msg}
    </div>
  );
}
function OrderCard({ order, idx, page, LIMIT, updating, deleting, onView, onDelete, onStatusChange, onPaymentChange }) {
  return (
    <div className={`w-full rounded-2xl border px-4 py-3.5   transition-all hover:border-warning/40 ${
      idx % 2 === 0 ? "bg-base-100 border-base-content/10" : "bg-base-200 border-base-content/5"
    }`}>
      <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">

        
        <span className="text-zinc-600 font-mono text-xs w-5 shrink-0 hidden sm:block">
          {(page - 1) * LIMIT + idx + 1}
        </span>

        
        <div className="flex items-center gap-2.5 w-44 shrink-0">
          <div className="w-8 h-8 rounded-xl  flex items-center justify-center shrink-0">
            <User size={13} className="text-zinc-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-base-content truncate leading-tight">{order.username}</p>
            <p className="text-xs text-base-content/50 truncate">{order.phoneNumber}</p>
          </div>
        </div>

        <div className="hidden lg:block w-px h-8 shrink-0" />

        <div className="flex items-center gap-2.5 flex-1 min-w-[180px]">
          {order.product?.image ? (
            <img
              src={order.product.image}
              alt=""
              className="w-9 h-9 rounded-xl object-cover border border-zinc-700/60 shrink-0"
              onError={e => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
              <Package size={13} className="text-zinc-500" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-base-content truncate leading-tight max-w-[180px]">
              {order.product?.productName || "—"}
            </p>
            <p className="text-xs text-base-content/50">{order.product?.quantity || 1} dona</p>
          </div>
        </div>

        <div className="w-36 shrink-0 text-right hidden md:block">
          <p className="text-sm font-bold text-warning">{currencyUZS(order.totalAmount)}</p>
          <p className="text-xs text-base-content/50">{currencyUZS(order.product?.price)} / dona</p>
        </div>

        <div className="hidden lg:block w-px h-8  shrink-0" />

        <div className="w-36 shrink-0">
          <CustomSelect
            value={order.status}
            onChange={v => onStatusChange(order._id, v, order.status)}
            disabled={updating[order._id + "_status"]}
            options={buildStatusOptions(order.status)}
          />
        </div>

        <div className="w-32 shrink-0">
          <CustomSelect
            value={order.paymentStatus}
            onChange={v => onPaymentChange(order._id, v)}
            disabled={updating[order._id + "_pay"]}
            options={buildPaymentOptions()}
          />
        </div>

        <div className="hidden lg:block w-px h-8  shrink-0" />

        <div className="items-center gap-1.5 text-zinc-500 text-xs w-24 shrink-0 hidden xl:flex">
          <Calendar size={11} className="shrink-0" />
          <span>
            {new Date(order.createdAt).toLocaleDateString("uz-UZ", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {(updating[order._id + "_status"] || updating[order._id + "_pay"]) && (
            <RefreshCw size={12} className="animate-spin text-amber-400" />
          )}
          <button
            onClick={() => onView(order)}
            className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95"
            title="Ko'rish"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onDelete(order._id)}
            disabled={deleting === order._id}
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all active:scale-95 disabled:opacity-50"
            title="O'chirish"
          >
            {deleting === order._id
              ? <RefreshCw size={14} className="animate-spin" />
              : <Trash2 size={14} />
            }
          </button>
        </div>

      </div>
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

  const updateStatus = async (orderId, newStatus, currentStatus) => {
    if (newStatus === "delivered" && !isDeliveredAllowed(currentStatus)) {
      showToast("⚠️ Yetkazildi faqat Tasdiqlandi dan keyin belgilanadi", "error");
      return;
    }
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
        showToast(`✅ Holat: "${STATUS_CONFIG[newStatus]?.label}" ga o'zgartirildi`);
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
    return (
      o.username?.toLowerCase().includes(q) ||
      o.phoneNumber?.toLowerCase().includes(q) ||
      o.product?.productName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-base-300 p-4 text-zinc-100 ">
      <Toast toast={toast} />

    {/* project */}
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingBag size={22} className="text-amber-400" />
            Buyurtmalar
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Jami <span className="text-amber-400 font-semibold">{totalCount}</span> ta buyurtma
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-amber-400/40 rounded-2xl text-sm transition-all active:scale-95"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Yangilash
        </button>
      </div>

      
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            value={search}
            placeholder="Qidirish..."
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-warning rounded-xl pl-9 pr-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none transition-colors"
          />
        </div>

        <CustomSelect
          value={filterStatus}
          onChange={v => setFilterStatus(v)}
          className="w-44"
          options={[
            {
              value: "", label: "Barcha statuslar",
              colorClass: "text-zinc-400", borderClass: "border-zinc-700",
              dotEl: <Filter size={12} className="opacity-50 shrink-0" />,
            },
            ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({
              value: v, label: c.label, colorClass: c.colorClass, borderClass: c.borderClass,
              dotEl: <span className={`inline-block w-2 h-2 rounded-full ${c.dotColor} shrink-0`} />,
            })),
          ]}
        />

        <CustomSelect
          value={filterPayment}
          onChange={v => setFilterPayment(v)}
          className="w-40"
          options={[
            {
              value: "", label: "Barcha to'lovlar",
              colorClass: "text-zinc-400", borderClass: "border-zinc-700",
              dotEl: <CreditCard size={12} className="opacity-50 shrink-0" />,
            },
            ...Object.entries(PAYMENT_CONFIG).map(([v, c]) => ({
              value: v, label: c.label, colorClass: c.colorClass, borderClass: c.borderClass,
              dotEl: <span className={`inline-block w-2 h-2 rounded-full ${c.dotColor} shrink-0`} />,
            })),
          ]}
        />

        {(filterStatus || filterPayment || search) && (
          <button
            onClick={() => { setFilterStatus(""); setFilterPayment(""); setSearch(""); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-all active:scale-95"
          >
            <XCircle size={14} />
            Tozalash
          </button>
        )}
      </div>

      
      {!loading && filteredOrders.length > 0 && (
        <div className="hidden lg:flex items-center gap-3 px-4 mb-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
          <span className="w-5 shrink-0">#</span>
          <span className="w-44 shrink-0">Mijoz</span>
          <div className="w-px" />
          <span className="flex-1 min-w-[180px]">Mahsulot</span>
          <span className="w-36 shrink-0 text-right hidden md:block">Narx</span>
          <div className="w-px" />
          <span className="w-36 shrink-0">Holat</span>
          <span className="w-32 shrink-0">To'lov</span>
          <div className="w-px" />
          <span className="w-24 shrink-0 hidden xl:block">Sana</span>
          <span className="ml-auto w-20 text-right">Amallar</span>
        </div>
      )}

      
      {loading ? (
        <LoadingTemplate />
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600 gap-3">
          <ShoppingBag size={48} strokeWidth={1} />
          <p className="text-lg">Buyurtmalar topilmadi</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {filteredOrders.map((order, idx) => (
              <OrderCard
                key={order._id}
                order={order}
                idx={idx}
                page={page}
                LIMIT={LIMIT}
                updating={updating}
                deleting={deleting}
                onView={setSelectedOrder}
                onDelete={deleteOrder}
                onStatusChange={updateStatus}
                onPaymentChange={updatePayment}
              />
            ))}
          </div>

          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="p-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-amber-400/30 transition-all active:scale-95 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium border transition-all ${
                    p === page
                      ? "bg-amber-400 text-zinc-950 border-amber-400 font-bold"
                      : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-amber-400/30"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="p-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-amber-400/30 transition-all active:scale-95 disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}

      
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-base-300 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

            
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FileText size={18} className="text-amber-400" />
                Buyurtma tafsiloti
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">

              
              <div className="bg-zinc-800/40 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mijoz ma'lumotlari</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-700 flex items-center justify-center shrink-0">
                    <User size={18} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-100">{selectedOrder.username}</p>
                    <p className="text-zinc-400 text-sm flex items-center gap-1.5 mt-0.5">
                      <Phone size={12} />
                      {selectedOrder.phoneNumber}
                    </p>
                  </div>
                </div>
                {selectedOrder.description && (
                  <p className="text-zinc-400 text-sm bg-zinc-800 rounded-xl px-3 py-2 leading-relaxed">
                    {selectedOrder.description}
                  </p>
                )}
              </div>

              
              <div className="bg-zinc-800/40 rounded-2xl p-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Mahsulot</p>
                <div className="flex items-center gap-3">
                  {selectedOrder.product?.image ? (
                    <img
                      src={selectedOrder.product.image}
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover border border-zinc-700 shrink-0"
                      onError={e => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-zinc-700 flex items-center justify-center shrink-0">
                      <Package size={22} className="text-zinc-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-100">{selectedOrder.product?.productName}</p>
                    <p className="text-zinc-500 text-sm">
                      {(selectedOrder.product?.quantity || 1)} dona × {currencyUZS(selectedOrder.product?.price)}
                    </p>
                    <p className="text-amber-400 font-bold mt-1">{currencyUZS(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/40 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Holat</p>
                  <CustomSelect
                    value={selectedOrder.status}
                    onChange={v => updateStatus(selectedOrder._id, v, selectedOrder.status)}
                    options={buildStatusOptions(selectedOrder.status)}
                    dropUp
                  />
                  {!isDeliveredAllowed(selectedOrder.status) && (
                    <p className="text-xs text-zinc-600 leading-tight">
                      ⚠️ "Yetkazildi" faqat "Tasdiqlandi" dan keyin
                    </p>
                  )}
                </div>
                <div className="bg-zinc-800/40 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">To'lov</p>
                  <CustomSelect
                    value={selectedOrder.paymentStatus}
                    onChange={v => updatePayment(selectedOrder._id, v)}
                    options={buildPaymentOptions()}
                    dropUp
                  />
                </div>
              </div>

              
              <p className="text-xs text-center text-zinc-600 flex items-center justify-center gap-1.5">
                <Calendar size={11} />
                {new Date(selectedOrder.createdAt).toLocaleString("uz-UZ")}
              </p>
            </div>

            
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { deleteOrder(selectedOrder._id); setSelectedOrder(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              >
                <Trash2 size={15} />
                O'chirish
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 text-amber-400 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


 