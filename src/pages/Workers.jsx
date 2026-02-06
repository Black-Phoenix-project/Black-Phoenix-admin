import React, { useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { FiEdit, FiTrash2 } from "react-icons/fi";

/* ================= STATIC DATA ================= */

const STATIC_WORKERS = [
  {
    id: 1,
    firstname: "Sardor",
    lastname: "Xojimurodov",
    profession: "Frontend Developer",
    branch: "Main Branch",
    phone: "+998 90 123 45 67",
    status: "Active",
  },
  {
    id: 2,
    firstname: "Ali",
    lastname: "Karimov",
    profession: "Backend Developer",
    branch: "Chilonzor",
    phone: "+998 93 777 88 99",
    status: "Active",
  },
  {
    id: 3,
    firstname: "Malika",
    lastname: "Usmonova",
    profession: "HR Manager",
    branch: "Yunusobod",
    phone: "+998 99 555 44 33",
    status: "Inactive",
  },
];

/* ================= COMPONENT ================= */

const Workers = () => {
  const [workers, setWorkers] = useState(STATIC_WORKERS);

  const deleteWorkerHandler = (id) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-warning">Workers</h1>
        <button className="btn btn-warning text-base-300">
          <TbUsersPlus size={20} />
          Add Worker
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
        <table className="table">
          <thead className="bg-warning text-base-300">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Profession</th>
              <th>Branch</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {workers.map((worker, index) => (
              <tr key={worker.id} className="hover">
                <td>{index + 1}</td>
                <td className="font-medium">
                  {worker.firstname} {worker.lastname}
                </td>
                <td>{worker.profession}</td>
                <td>{worker.branch}</td>
                <td>{worker.phone}</td>
                <td>
                  <span
                    className={`badge ${worker.status === "Active"
                      ? "badge-success"
                      : "badge-error"
                      }`}
                  >
                    {worker.status}
                  </span>
                </td>
                <td className="flex gap-2 justify-center">
                  <button className="btn btn-sm btn-outline btn-warning">
                    <FiEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => deleteWorkerHandler(worker.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {workers.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No workers available
          </div>
        )}
      </div>
    </div>
  );
};

export default Workers;
