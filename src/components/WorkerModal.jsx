import React from "react";
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
import { useLanguage } from "../i18n/LanguageContext";

const WorkerModal = ({
  modalOpen,
  closeModal,
  formData,
  setFormData,
  editWorker,
  handleFormSubmit,
}) => {
  const { t } = useLanguage();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeModal}
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="bg-gradient-to-r from-warning to-warning/80 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-warning-content/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <TbUserCircle className="text-warning-content text-3xl" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-warning-content">
                        {editWorker ? t("wm.editTitle") : t("wm.addTitle")}
                      </h2>
                      <p className="text-warning-content/80 text-sm mt-1">
                        {editWorker
                          ? t("wm.editSub")
                          : t("wm.addSub")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-10 h-10 rounded-xl bg-warning-content/20 hover:bg-warning-content/30 backdrop-blur-sm flex items-center justify-center text-warning-content transition-all duration-200 hover:rotate-90 shrink-0"
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
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b-2 border-warning/20">
                      <FiUser className="text-warning text-xl" />
                      <h3 className="text-base sm:text-lg font-bold text-base-content">
                        {t("wm.personal")}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            {t("wm.firstName")} <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          placeholder={t("wm.firstNamePh")}
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                          required
                        />
                      </div>

                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            {t("wm.lastName")} <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          placeholder={t("wm.lastNamePh")}
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b-2 border-warning/20">
                      <FiBriefcase className="text-warning text-xl" />
                      <h3 className="text-base sm:text-lg font-bold text-base-content">
                        {t("wm.job")}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            {t("wm.position")} <span className="text-error">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          placeholder={t("wm.positionPh")}
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                          required
                        />
                      </div>

                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FiPhone className="text-warning" />
                            {t("wm.phone")}
                          </span>
                        </label>
                        <input
                          type="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t("wm.phonePh")}
                          className="input input-bordered w-full h-12 focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                        />
                      </div>

                      
                      <div className="form-control lg:col-span-2">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FiDollarSign className="text-warning" />
                            {t("wm.salary")} <span className="text-error">*</span>
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
                  </div>

                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b-2 border-warning/20">
                      <FiToggleRight className="text-warning text-xl" />
                      <h3 className="text-base sm:text-lg font-bold text-base-content">
                        {t("wm.status")}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {["Faol", "Dam olishda"].map((status) => {
                        const active = formData.status === status;
                        const label = status === "Faol" ? t("workers.active") : t("workers.onLeave");
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, status }))
                            }
                            className={`flex items-center justify-center gap-2 h-12 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 ${
                              active
                                ? status === "Faol"
                                  ? "bg-success/10 border-success/40 text-success"
                                  : "bg-warning/10 border-warning/40 text-warning"
                                : "bg-base-200 border-base-300 text-base-content/50 hover:border-warning/30"
                            }`}
                          >
                            {active
                              ? <FiToggleRight className="text-lg" />
                              : <FiToggleLeft className="text-lg opacity-50" />}
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                
                <div className="px-6 sm:px-8 py-4 sm:py-6 bg-base-200/50 border-t border-base-300 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-ghost h-12 px-6 sm:px-8 hover:bg-base-300 order-2 sm:order-1"
                  >
                    {t("wm.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning text-warning-content h-12 px-6 sm:px-8 shadow-lg shadow-warning/30 hover:shadow-xl hover:shadow-warning/40 transition-all duration-200 order-1 sm:order-2"
                  >
                    {editWorker ? (
                      <>
                        <FiEdit className="text-lg" />
                        <span className="hidden sm:inline">{t("wm.update")}</span>
                        <span className="sm:hidden">{t("wm.update")}</span>
                      </>
                    ) : (
                      <>
                        <TbUsersPlus className="text-xl" />
                        <span className="hidden sm:inline">{t("wm.add")}</span>
                        <span className="sm:hidden">{t("wm.add")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WorkerModal;
