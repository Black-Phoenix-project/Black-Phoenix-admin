import React, { useEffect, useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LoadingTemplate from "../components/LoadingTemplate";
import WorkerModal from "../components/WorkerModal";

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
    status: "Active"
  });

  const API_URL = "http://localhost:5000/api/workers";

  // Fetch workers
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

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = workers.filter((w) =>
      `${w.firstname} ${w.lastname} ${w.position}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredWorkers(filtered);
  }, [searchTerm, workers]);

  // Delete worker
  const deleteWorkerHandler = async (id) => {
    if (!window.confirm("Bu ishchini o'chirishga ishonchingiz komilmi?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete worker");
      setWorkers((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Open modal for add/edit
  const openModal = (worker = null) => {
    if (worker) {
      setEditWorker(worker);
      setFormData({
        firstname: worker.firstname,
        lastname: worker.lastname,
        position: worker.position,
        salary: worker.salary,
        phone: worker.phone || "",
        status: worker.status || "Active"
      });
    } else {
      setEditWorker(null);
      setFormData({
        firstname: "",
        lastname: "",
        position: "",
        salary: "",
        phone: "",
        status: "Active"
      });
    }
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditWorker(null);
    setFormData({
      firstname: "",
      lastname: "",
      position: "",
      salary: "",
      phone: "",
      status: "Active"
    });
  };

  // Add / Edit worker
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
        // Update
        const response = await fetch(`${API_URL}/${editWorker._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        if (!response.ok) throw new Error("Failed to update worker");
      } else {
        // Create
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        if (!response.ok) throw new Error("Failed to create worker");
      }
      closeModal();
      fetchWorkers();
    } catch (err) {
      alert(err.message);
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
      {/* Header with search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-warning">Ishchilarimiz</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          {/* Search input */}
          <div className="relative sm:w-64">
            <FiSearch className="absolute top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Ishchilarni qidiring..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered border-warning w-full  focus:outline-warning"
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
                        className={`badge bg-success text-black ${
                          worker.status === "Active"
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
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
                        onClick={() => deleteWorkerHandler(worker._id)}
                        title="O'chirish"
                      >
                        <FiTrash2 />
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