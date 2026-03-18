import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import LoadingTemplate from "../components/LoadingTemplate";
import {
  Clock, CheckCircle, XCircle, Truck, Package, RefreshCw,
  Trash2, Search, Filter, ChevronLeft, ChevronRight,
  ShoppingBag, CreditCard, AlertCircle, User, Phone,
  FileText, ChevronDown, Check, Calendar,
  SquarePen,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;
const currencyUZS = (v) => Number(v || 0).toLocaleString("uz-UZ") + " so'm";

const STATUS_CONFIG = {
  pending:    { label: "Ожидает",    colorClass: "text-warning",   bgClass: "bg-warning/10",   borderClass: "border-warning/30",   dotColor: "bg-warning",   icon: <Clock size={12} /> },
  confirmed:  { label: "Подтверждён",   colorClass: "text-info",      bgClass: "bg-info/10",      borderClass: "border-info/30",      dotColor: "bg-info",      icon: <CheckCircle size={12} /> },
  processing: { label: "В обработке",     colorClass: "text-secondary", bgClass: "bg-secondary/10", borderClass: "border-secondary/30", dotColor: "bg-secondary", icon: <RefreshCw size={12} /> },
  shipped:    { label: "Отправлен",     colorClass: "text-accent",    bgClass: "bg-accent/10",    borderClass: "border-accent/30",    dotColor: "bg-accent",    icon: <Truck size={12} /> },
  delivered:  { label: "Доставлен",    colorClass: "text-success",   bgClass: "bg-success/10",   borderClass: "border-success/30",   dotColor: "bg-success",   icon: <Package size={12} /> },
  cancelled:  { label: "Отменён", colorClass: "text-error",     bgClass: "bg-error/10",     borderClass: "border-error/30",     dotColor: "bg-error",     icon: <XCircle size={12} /> },
};

const PAYMENT_CONFIG = {
  unpaid:   { label: "Не оплачен", colorClass: "text-error",   bgClass: "bg-error/10",   borderClass: "border-error/30",   dotColor: "bg-error" },
  paid:     { label: "Оплачен",   colorClass: "text-success", bgClass: "bg-success/10", borderClass: "border-success/30", dotColor: "bg-success" },
  refunded: { label: "Возврат",  colorClass: "text-warning", bgClass: "bg-warning/10", borderClass: "border-warning/30", dotColor: "bg-warning" },
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
          hover:border-warning/50 focus:outline-none
          disabled:opacity-60 disabled:cursor-not-allowed
          ${current?.borderClass || "border-base-300"}
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
            bg-base-300 border border-base-300
            rounded-xl shadow-2xl shadow-base-content/30 overflow-hidden
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
                ${opt.disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:bg-base-content/5"}
                ${opt.value === value ? "bg-base-content/5" : ""}
                ${opt.colorClass || "text-base-content/80"}
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
          ? "bg-error/15 border-error/40 text-error"
          : "bg-success/15 border-success/40 text-success"
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

        
        <span className="text-base-content/40 font-mono text-xs w-5 shrink-0 hidden sm:block">
          {(page - 1) * LIMIT + idx + 1}
        </span>

        
        <div className="flex items-center gap-2.5 w-44 shrink-0">
          <div className="w-8 h-8 rounded-xl  flex items-center justify-center shrink-0">
            <User size={13} className="text-base-content/50" />
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
              loading="lazy"
              decoding="async"
              className="w-9 h-9 rounded-xl object-cover border border-base-300 shrink-0"
              onError={e => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-base-300 flex items-center justify-center shrink-0">
              <Package size={13} className="text-base-content/50" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-base-content truncate leading-tight max-w-[180px]">
              {order.product?.productName || "—"}
            </p>
            <p className="text-xs text-base-content/50">{order.product?.quantity || 1} шт.</p>
          </div>
        </div>

        <div className="w-36 shrink-0 text-right hidden md:block">
          <p className="text-sm font-bold text-warning">{currencyUZS(order.totalAmount)}</p>
          <p className="text-xs text-base-content/50">{currencyUZS(order.product?.price)} / шт.</p>
        </div>

        <div className="hidden lg:block w-px h-8  shrink-0" />

        <div className="hidden lg:block w-36 shrink-0">
          <CustomSelect
            value={order.status}
            onChange={v => onStatusChange(order._id, v, order.status)}
            disabled={updating[order._id + "_status"]}
            options={buildStatusOptions(order.status)}
          />
        </div>

        <div className="hidden lg:block w-32 shrink-0">
          <CustomSelect
            value={order.paymentStatus}
            onChange={v => onPaymentChange(order._id, v)}
            disabled={updating[order._id + "_pay"]}
            options={buildPaymentOptions()}
          />
        </div>

        <div className="w-full lg:hidden grid grid-cols-2 gap-2 mt-1">
          <CustomSelect
            value={order.status}
            onChange={v => onStatusChange(order._id, v, order.status)}
            disabled={updating[order._id + "_status"]}
            options={buildStatusOptions(order.status)}
          />
          <CustomSelect
            value={order.paymentStatus}
            onChange={v => onPaymentChange(order._id, v)}
            disabled={updating[order._id + "_pay"]}
            options={buildPaymentOptions()}
          />
        </div>

        <div className="hidden lg:block w-px h-8  shrink-0" />

        <div className="items-center gap-1.5 text-base-content/50 text-xs w-24 shrink-0 hidden xl:flex">
          <Calendar size={11} className="shrink-0" />
          <span>
            {new Date(order.createdAt).toLocaleDateString("ru-RU", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {(updating[order._id + "_status"] || updating[order._id + "_pay"]) && (
            <RefreshCw size={12} className="animate-spin text-warning" />
          )}
          <button
            onClick={() => onView(order)}
            className="p-2 rounded-xl bg-info/10 border cursor-pointer border-info/30 text-info hover:bg-info/20 transition-all active:scale-95"
            title="Просмотр"
          >
            <SquarePen size={14} />
          </button>
          <button
            onClick={() => onDelete(order._id)}
            disabled={deleting === order._id}
            className="p-2 rounded-xl bg-error/10 cursor-pointer border border-error/30 text-error hover:bg-error/20 transition-all active:scale-95 disabled:opacity-50"
            title="Удалить"
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
      showToast("Ошибка загрузки данных", "error");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterPayment]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [filterStatus, filterPayment]);

  const updateStatus = async (orderId, newStatus, currentStatus) => {
    if (newStatus === "delivered" && !isDeliveredAllowed(currentStatus)) {
      showToast("«Доставлен» можно выбрать только после «Подтверждён»", "error");
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
        showToast(`Статус изменён на "${STATUS_CONFIG[newStatus]?.label}"`);
      } else showToast(json.message || "Ошибка", "error");
    } catch {
      showToast("Ошибка сервера", "error");
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
        showToast(`Оплата изменена на "${PAYMENT_CONFIG[newPayment]?.label}"`);
      } else showToast(json.message || "Ошибка", "error");
    } catch {
      showToast("Ошибка сервера", "error");
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
        showToast("Заказ удалён");
      } else showToast(json.message || "Ошибка", "error");
    } catch {
      showToast("Ошибка сервера", "error");
    } finally {
      setDeleting(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) => (
      o.username?.toLowerCase().includes(q) ||
      o.phoneNumber?.toLowerCase().includes(q) ||
      o.product?.productName?.toLowerCase().includes(q)
    ));
  }, [orders, search]);

  return (
    <div className="min-h-screen bg-base-300 p-4 text-base-content ">
      <Toast toast={toast} />

      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-warning">
            <ShoppingBag size={22} className="text-warning" />
            Заказы
          </h1>
          <p className="text-base-content/50 text-sm mt-0.5">
            Всего <span className="text-warning font-semibold">{totalCount}</span> заказов
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-base-200 border border-base-300 hover:border-warning/40 rounded-2xl text-sm transition-all active:scale-95"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>

      
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none" />
          <input
            value={search}
            placeholder="Поиск..."
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-base-200 border border-warning rounded-xl pl-9 pr-4 py-2.5 text-sm focus:border-warning focus:outline-none transition-colors"
          />
        </div>

        <CustomSelect
          value={filterStatus}
          onChange={v => setFilterStatus(v)}
          className="w-44"
          options={[
            {
              value: "", label: "Все статусы",
              colorClass: "text-base-content/50", borderClass: "border-base-300",
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
              value: "", label: "Все платежи",
              colorClass: "text-base-content/50", borderClass: "border-base-300",
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
            className="flex items-center gap-1.5 px-4 py-2.5 bg-error/10 border border-error/30 hover:bg-error/20 text-error rounded-xl text-sm font-medium transition-all active:scale-95"
          >
            <XCircle size={14} />
            Сбросить
          </button>
        )}
      </div>

      
      {!loading && filteredOrders.length > 0 && (
        <div className="hidden lg:flex items-center gap-3 px-4 mb-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider">
          <span className="w-5 shrink-0">#</span>
          <span className="w-44 shrink-0">Клиент</span>
          <div className="w-px" />
          <span className="flex-1 min-w-[180px]">Товар</span>
          <span className="w-36 shrink-0 text-right hidden md:block">Сумма</span>
          <div className="w-px" />
          <span className="w-36 shrink-0">Статус</span>
          <span className="w-32 shrink-0">Оплата</span>
          <div className="w-px" />
          <span className="w-24 shrink-0 hidden xl:block">Дата</span>
          <span className="ml-auto w-20 text-right">Действия</span>
        </div>
      )}

      
      {loading ? (
        <LoadingTemplate />
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/50 gap-3">
          <ShoppingBag size={48} strokeWidth={1} />
          <p className="text-lg">Заказы не найдены</p>
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
                className="p-2.5 rounded-xl border border-base-300 text-base-content/60 hover:bg-base-200 hover:border-warning/40 transition-all active:scale-95 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium border transition-all ${
                    p === page
                      ? "bg-warning text-warning-content border-warning font-bold"
                      : "border-base-300 text-base-content/60 hover:bg-base-200 hover:border-warning/40"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="p-2.5 rounded-xl border border-base-300 text-base-content/60 hover:bg-base-200 hover:border-warning/40 transition-all active:scale-95 disabled:opacity-40"
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
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

            
            <div className="flex items-center justify-between px-6 py-5 border-b border-base-300">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FileText size={18} className="text-warning" />
                Детали заказа
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-base-content/60 hover:text-error hover:bg-error/10 transition-all"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">

              
              <div className="bg-base-300/40 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Данные клиента</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-base-300 flex items-center justify-center shrink-0">
                    <User size={18} className="text-base-content/60" />
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">{selectedOrder.username}</p>
                    <p className="text-base-content/60 text-sm flex items-center gap-1.5 mt-0.5">
                      <Phone size={12} />
                      {selectedOrder.phoneNumber}
                    </p>
                  </div>
                </div>
                {selectedOrder.description && (
                  <p className="text-base-content/60 text-sm bg-base-300 rounded-xl px-3 py-2 leading-relaxed">
                    {selectedOrder.description}
                  </p>
                )}
              </div>

              
              <div className="bg-base-300/40 rounded-2xl p-4">
                <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">Товар</p>
                <div className="flex items-center gap-3">
                  {selectedOrder.product?.image ? (
                    <img
                      src={selectedOrder.product.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-14 h-14 rounded-2xl object-cover border border-base-300 shrink-0"
                      onError={e => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-base-300 flex items-center justify-center shrink-0">
                      <Package size={22} className="text-base-content/50" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-base-content">{selectedOrder.product?.productName}</p>
                    <p className="text-base-content/50 text-sm">
                      {(selectedOrder.product?.quantity || 1)} шт. × {currencyUZS(selectedOrder.product?.price)}
                    </p>
                    <p className="text-warning font-bold mt-1">{currencyUZS(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-base-300/40 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Статус</p>
                  <CustomSelect
                    value={selectedOrder.status}
                    onChange={v => updateStatus(selectedOrder._id, v, selectedOrder.status)}
                    options={buildStatusOptions(selectedOrder.status)}
                    dropUp
                  />
                  {!isDeliveredAllowed(selectedOrder.status) && (
                    <p className="text-xs text-base-content/50 leading-tight">
                      ⚠️ «Доставлен» доступен только после «Подтверждён»
                    </p>
                  )}
                </div>
                <div className="bg-base-300/40 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Оплата</p>
                  <CustomSelect
                    value={selectedOrder.paymentStatus}
                    onChange={v => updatePayment(selectedOrder._id, v)}
                    options={buildPaymentOptions()}
                    dropUp
                  />
                </div>
              </div>

              
              <p className="text-xs text-center text-base-content/50 flex items-center justify-center gap-1.5">
                <Calendar size={11} />
                {new Date(selectedOrder.createdAt).toLocaleString("ru-RU")}
              </p>
            </div>

            
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { deleteOrder(selectedOrder._id); setSelectedOrder(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-error/10 border border-error/30 hover:bg-error/20 text-error rounded-2xl font-semibold text-sm transition-all active:scale-95"
              >
                <Trash2 size={15} />
                Удалить
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-warning/10 border border-warning/30 hover:bg-warning/20 text-warning rounded-2xl font-semibold text-sm transition-all active:scale-95"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


 

