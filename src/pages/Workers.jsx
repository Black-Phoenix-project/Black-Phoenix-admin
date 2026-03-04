import React, { useEffect, useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import LoadingTemplate from "../components/LoadingTemplate";
import WorkerModal from "../components/WorkerModal";
import { CheckCircle, AlertCircle, Trash2, RefreshCw, Users } from "lucide-react";

const API_URL = `${import.meta.env.VITE_BACKENT_URL}/api/workers`;

/* ── Toast ─────────────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5
        rounded-2xl shadow-2xl border text-sm font-medium
        animate-[slideUp_0.3s_ease-out]
        ${toast.type === "error"
          ? "bg-red-950/95 border-red-500/40 text-red-300"
          : "bg-zinc-900/95 border-amber-500/40 text-amber-300"
        }`}
    >
      {toast.type === "error"
        ? <AlertCircle size={16} />
        : <CheckCircle size={16} />}
      {toast.msg}
    </div>
  );
}

/* ── Confirm Dialog ─────────────────────────────────────────────── */
function ConfirmDialog({ open, onConfirm, onCancel, name }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 border border-zinc-700/60 rounded-3xl p-8 w-full max-w-sm shadow-2xl
          animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-5">
          <Trash2 size={26} className="text-red-400" />
        </div>
        <h3 className="text-center font-bold text-zinc-100 text-xl mb-2">
          O'chirishni tasdiqlang
        </h3>
        <p className="text-center text-zinc-400 text-sm mb-7 leading-relaxed">
          <span className="text-amber-300 font-semibold">{name}</span>
          {" "}ni o'chirishga ishonchingiz komilmi?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-zinc-700 text-zinc-400
              hover:bg-zinc-800 hover:text-zinc-200 text-sm font-medium transition-all
              active:scale-95"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-500/10 border border-red-500/30
              hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all
              active:scale-95"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Worker Row ─────────────────────────────────────────────────── */
function WorkerRow({ worker, index, onEdit, onDelete, deleting, confirmId }) {
  const isDeleting = deleting && confirmId === worker._id;
  const initials = `${worker.firstname?.[0] ?? ""}${worker.lastname?.[0] ?? ""}`.toUpperCase();
  const colors = [
    "bg-amber-500/20 text-amber-300",
    "bg-sky-500/20 text-sky-300",
    "bg-emerald-500/20 text-emerald-300",
    "bg-violet-500/20 text-violet-300",
    "bg-rose-500/20 text-rose-300",
    "bg-orange-500/20 text-orange-300",
  ];
  const color = colors[index % colors.length];

  return (
    <tr className="group border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors duration-150">
      <td className="px-5 py-4 text-zinc-500 text-sm font-mono w-12">{index + 1}</td>

      {/* Avatar + Name */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
            {initials}
          </div>
          <div>
            <p className="font-semibold text-zinc-100 text-sm leading-tight">
              {worker.firstname} {worker.lastname}
            </p>
          </div>
        </div>
      </td>

      {/* Position */}
      <td className="px-5 py-4">
        <span className="text-zinc-300 text-sm">{worker.position}</span>
      </td>

      {/* Phone */}
      <td className="px-5 py-4">
        <span className="text-zinc-400 text-sm font-mono tracking-wide">
          {worker.phone || "—"}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
          bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {worker.status || "Faol"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(worker)}
            title="Tahrirlash"
            className="w-8 h-8 rounded-xl flex items-center justify-center
              text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10
              border border-transparent hover:border-amber-500/20
              transition-all duration-150 active:scale-90"
          >
            <FiEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(worker)}
            title="O'chirish"
            disabled={isDeleting}
            className="w-8 h-8 rounded-xl flex items-center justify-center
              text-red-400/70 hover:text-red-300 hover:bg-red-500/10
              border border-transparent hover:border-red-500/20
              transition-all duration-150 active:scale-90 disabled:opacity-50"
          >
            {isDeleting
              ? <RefreshCw size={13} className="animate-spin" />
              : <FiTrash2 size={14} />}
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editWorker, setEditWorker] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    position: "",
    salary: "",
    phone: "",
    status: "Faol",
  });
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, name: "" });
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Ishchilarni yuklashda xatolik");
      const data = await response.json();
      setWorkers(data.data || []);
      setFilteredWorkers(data.data || []);
    } catch (err) {
      setError(err.message || "Nimadir xato ketdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  useEffect(() => {
    const filtered = workers.filter((w) =>
      `${w.firstname} ${w.lastname} ${w.position}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredWorkers(filtered);
  }, [searchTerm, workers]);

  const deleteWorkerHandler = (worker) => {
    setConfirmDialog({
      open: true,
      id: worker._id,
      name: `${worker.firstname} ${worker.lastname}`,
    });
  };

  const confirmDelete = async () => {
    const { id, name } = confirmDialog;
    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Ishchini o'chirishda xatolik");
      setWorkers((prev) => prev.filter((w) => w._id !== id));
      setConfirmDialog({ open: false, id: null, name: "" });
      showToast(`${name} o'chirildi`);
    } catch (err) {
      showToast(err.message || "O'chirishda xatolik", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openModal = (worker = null) => {
    if (worker) {
      setEditWorker(worker);
      setFormData({
        firstname: worker.firstname,
        lastname: worker.lastname,
        position: worker.position,
        salary: worker.salary,
        phone: worker.phone || "",
        status: worker.status || "Faol",
      });
    } else {
      setEditWorker(null);
      setFormData({ firstname: "", lastname: "", position: "", salary: "", phone: "", status: "Faol" });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditWorker(null);
    setFormData({ firstname: "", lastname: "", position: "", salary: "", phone: "", status: "Faol" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      position: formData.position,
      salary: Number(formData.salary),
      phone: formData.phone,
      status: formData.status,
    };
    try {
      if (editWorker) {
        const response = await fetch(`${API_URL}/${editWorker._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        if (!response.ok) throw new Error("Ishchini yangilashda xatolik");
        showToast(`${submitData.firstname} ${submitData.lastname} yangilandi`);
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        if (!response.ok) throw new Error("Ishchi qo'shishda xatolik");
        showToast(`${submitData.firstname} ${submitData.lastname} qo'shildi`);
      }
      closeModal();
      fetchWorkers();
    } catch (err) {
      showToast(err.message || "Xatolik yuz berdi", "error");
    }
  };

  if (loading) return <LoadingTemplate />;

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20
          text-red-400 px-6 py-4 rounded-2xl text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      </div>
    );

  return (
    <>
      {/* Keyframe styles */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen px-4 md:px-8 py-8 space-y-6"
        style={{ animation: "fadeIn 0.4s ease-out" }}>

        <Toast toast={toast} />
        <ConfirmDialog
          open={confirmDialog.open}
          name={confirmDialog.name}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog({ open: false, id: null, name: "" })}
        />

        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25
              flex items-center justify-center">
              <Users size={20} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100 leading-tight">
                Ishchilarimiz
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">
                {workers.length} ta xodim ro'yxatda
              </p>
            </div>
          </div>

          {/* Search + Add */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2.5">
            <div className="relative">
              <FiSearch
                size={14}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 h-10 pl-9 pr-4 rounded-xl text-sm
                  bg-zinc-800/60 border border-zinc-700/60 text-zinc-200
                  placeholder-zinc-500 outline-none
                  focus:border-amber-500/50 focus:bg-zinc-800
                  transition-all duration-200"
              />
            </div>

            <button
              onClick={() => openModal()}
              className="h-10 px-4 rounded-xl flex items-center justify-center gap-2
                bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                text-zinc-900 text-sm font-semibold
                transition-all duration-150 active:scale-95 shadow-lg shadow-amber-500/20"
            >
              <TbUsersPlus size={17} />
              Qo'shish
            </button>
          </div>
        </div>

        {/* ── Stats bar ────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Jami xodimlar", value: workers.length, accent: "text-amber-400" },
            {
              label: "Faol xodimlar",
              value: workers.filter((w) => w.status === "Faol").length,
              accent: "text-emerald-400",
            },
            {
              label: "Qidiruv natijasi",
              value: filteredWorkers.length,
              accent: "text-sky-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl px-5 py-4"
            >
              <p className="text-zinc-500 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Xodim
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Kasb
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Holat
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker, index) => (
                  <WorkerRow
                    key={worker._id}
                    worker={worker}
                    index={index}
                    onEdit={openModal}
                    onDelete={deleteWorkerHandler}
                    deleting={deleting}
                    confirmId={confirmDialog.id}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredWorkers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <Users size={22} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm">
                {searchTerm ? "Hech qanday ishchi topilmadi" : "Ishchilar mavjud emas"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => openModal()}
                  className="mt-1 text-amber-400 text-sm hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                  Birinchi xodimni qo'shing
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────── */}
      <WorkerModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        formData={formData}
        setFormData={setFormData}
        editWorker={editWorker}
        handleFormSubmit={handleFormSubmit}
      />
    </>
  );
};

export default Workers;