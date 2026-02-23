import React, { useEffect, useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LoadingTemplate from "../components/LoadingTemplate";
import WorkerModal from "../components/WorkerModal";
import { CheckCircle, AlertCircle, Trash2, RefreshCw } from "lucide-react";

const API_URL = `${import.meta.env.VITE_BACKENT_URL}/api/workers` 

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium transition-all
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

function ConfirmDialog({ open, onConfirm, onCancel, name }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
          <Trash2 size={24} className="text-red-400" />
        </div>
        <h3 className="text-center font-bold text-zinc-100 text-lg mb-1">O'chirishni tasdiqlang</h3>
        <p className="text-center text-zinc-400 text-sm mb-6">
          <span className="text-zinc-200 font-medium">{name}</span> ni o'chirishga ishonchingiz komilmi?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 text-sm font-medium transition-all active:scale-95"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all active:scale-95"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

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
    status: "Active",
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
      if (!response.ok) throw new Error("Failed to fetch workers");
      const data = await response.json();
      setWorkers(data.data || []);
      setFilteredWorkers(data.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
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
      if (!response.ok) throw new Error("Failed to delete worker");
      setWorkers((prev) => prev.filter((w) => w._id !== id));
      setConfirmDialog({ open: false, id: null, name: "" });
      showToast(` ${name} o'chirildi`);
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
        status: worker.status || "Active",
      });
    } else {
      setEditWorker(null);
      setFormData({ firstname: "", lastname: "", position: "", salary: "", phone: "", status: "Active" });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditWorker(null);
    setFormData({ firstname: "", lastname: "", position: "", salary: "", phone: "", status: "Active" });
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
        if (!response.ok) throw new Error("Failed to update worker");
        showToast(` ${submitData.firstname} ${submitData.lastname} yangilandi`);
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        if (!response.ok) throw new Error("Failed to create worker");
        showToast(` ${submitData.firstname} ${submitData.lastname} qo'shildi`);
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
        <div className="text-error bg-error/10 px-6 py-3 rounded-lg">{error}</div>
      </div>
    );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Toast toast={toast} />
      <ConfirmDialog
        open={confirmDialog.open}
        name={confirmDialog.name}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ open: false, id: null, name: "" })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-warning">Ishchilarimiz</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          {/* Search */}
          <div className="relative sm:w-64">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Ishchilarni qidiring..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered border-warning w-full pl-9 focus:outline-warning"
            />
          </div>
          {/* Add button */}
          <button
            className="btn btn-warning text-base-300 gap-2"
            onClick={() => openModal()}
          >
            <TbUsersPlus size={20} />
            Qo'shish
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-warning text-base-300">
              <tr>
                <th className="rounded-tl-xl">#</th>
                <th>To'liq Ism</th>
                <th>Kasb</th>
                <th>Telefon</th>
                <th>Status</th>
                <th className="rounded-tr-xl text-center">Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredWorkers.map((worker, index) => (
                  <motion.tr
                    key={worker._id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    layout
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td className="font-mono">{index + 1}</td>
                    <td className="font-medium">
                      {worker.firstname} {worker.lastname}
                    </td>
                    <td>{worker.position}</td>
                    <td>{worker.phone || "—"}</td>
                    <td>
                      <span
                        className={`badge ${
                          worker.status === "Active" ? "badge-success" : "badge-success"
                        } text-black`}
                      >
                        {worker.status === "Active" ? "Faol" : "Faol"}
                      </span>
                    </td>
                    <td className="flex gap-2 justify-center">
                      <button
                        className="btn btn-sm btn-outline btn-warning"
                        onClick={() => openModal(worker)}
                        title="Tahrirlash"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => deleteWorkerHandler(worker)}
                        title="O'chirish"
                        disabled={deleting && confirmDialog.id === worker._id}
                      >
                        {deleting && confirmDialog.id === worker._id
                          ? <RefreshCw size={14} className="animate-spin" />
                          : <FiTrash2 />
                        }
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12 text-base-content/50">
            {searchTerm ? "Hech qanday ishchi topilmadi" : "Ishchilar mavjud emas"}
          </div>
        )}
      </div>

      {/* Modal */}
      <WorkerModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        formData={formData}
        setFormData={setFormData}
        editWorker={editWorker}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Workers;