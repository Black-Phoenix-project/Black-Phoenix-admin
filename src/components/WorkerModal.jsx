import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbUsersPlus, TbUserCircle } from "react-icons/tb";
import {
  FiX,
  FiEdit,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiPhone,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";

const WorkerModal = ({
  modalOpen,
  closeModal,
  formData,
  setFormData,
  editWorker,
  handleFormSubmit,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="bg-gradient-to-r from-warning to-warning/80 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <TbUserCircle className="text-white text-3xl" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {editWorker ? "Ishchini Tahrirlash" : "Yangi Ishchi Qo'shish"}
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {editWorker
                          ? "Ishchi ma'lumotlarini yangilash"
                          : "Quyidagi ma'lumotlarni to'ldiring"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:rotate-90 shrink-0"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>

              
              <form
                onSubmit={handleFormSubmit}
                className="overflow-y-auto max-h-[calc(90vh-200px)]"
              >
                <div className="p-6 sm:p-8 space-y-8">
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 pb-2 border-b-2 border-warning/20">
                      <FiUser className="text-warning text-xl" />
                      <h3 className="text-base sm:text-lg font-bold text-base-content">
                        Shaxsiy Ma'lumotlar
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            Ism <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          placeholder="Ismni kiriting"
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                          required
                        />
                      </div>

                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            Familiya <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          placeholder="Familiyani kiriting"
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>

                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 pb-2 border-b-2 border-warning/20">
                      <FiBriefcase className="text-warning text-xl" />
                      <h3 className="text-base sm:text-lg font-bold text-base-content">
                        Ish Ma'lumotlari
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            Lavozim <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          placeholder="Masalan: Dasturchi"
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                          required
                        />
                      </div>

                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FiPhone className="text-warning" />
                            Telefon Raqami
                          </span>
                        </label>
                        <input
                          type="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+998 (XX) XXX-XX-XX"
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                        />
                      </div>

                      
                      <div className="form-control lg:col-span-2">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FiDollarSign className="text-warning" />
                            Maosh <span className="text-error">*</span>
                          </span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/60 font-semibold">
                            $
                          </span>
                          <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="input input-bordered w-full pl-8 pr-4 h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                  

                  </motion.div>
                </div>

                
                <div className="px-6 sm:px-8 py-4 sm:py-6 bg-base-200/50 border-t border-base-300 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-ghost h-12 px-6 sm:px-8 hover:bg-base-300 order-2 sm:order-1"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning text-base-300 h-12 px-6 sm:px-8 shadow-lg shadow-warning/30 hover:shadow-xl hover:shadow-warning/40 transition-all duration-200 order-1 sm:order-2"
                  >
                    {editWorker ? (
                      <>
                        <FiEdit className="text-lg" />
                        <span className="hidden sm:inline">Yangilash</span>
                        <span className="sm:hidden">Yangilash</span>
                      </>
                    ) : (
                      <>
                        <TbUsersPlus className="text-xl" />
                        <span className="hidden sm:inline">Qo'shish</span>
                        <span className="sm:hidden">Qo'shish</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WorkerModal;