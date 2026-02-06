import React, { useState } from "react";

const Orders = () => {
  // ✅ Static orders (no backend)
  const [orders, setOrders] = useState([
    {
      _id: "1",
      buyerName: "Ali",
      product: { name: "iPhone 15" },
      quantity: 1,
      status: "pending",
    },
    {
      _id: "2",
      buyerName: "Sardor",
      product: { name: "MacBook Pro" },
      quantity: 2,
      status: "completed",
    },
    {
      _id: "3",
      buyerName: "John",
      product: { name: "Headphones" },
      quantity: 3,
      status: "cancelled",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ===============================
     Update Status (local)
  =============================== */
  const updateStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status } : order
      )
    );
  };

  /* ===============================
     Delete logic
  =============================== */

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setOrders((prev) =>
      prev.filter((order) => order._id !== selectedOrder._id)
    );
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div className="p-6 ">
      {/* Title */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-info">Orders</h1>
        <span className="badge badge-info badge-outline">
          Total: {orders.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl border-2 border-warning shadow">
        <table className="table">
          <thead className="bg-warning  text-black">
            <tr>
              <th>#</th>
              <th>Buyer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Action</th>
              
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover">
                <td>{index + 1}</td>
                <td className="font-semibold">{order.buyerName}</td>
                <td>{order.product?.name}</td>
                <td>{order.quantity}</td>

                {/* Status badge */}
                <td>
                  <span
                    className={`badge ${
                      order.status === "completed"
                        ? "badge-success"
                        : order.status === "pending"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="flex gap-2">
                  <select
                    className="select select-xs w-22 select-info"
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => openDeleteModal(order)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-10 text-base-content/50">
            No orders found
          </div>
        )}
      </div>

 
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-xl shadow-xl w-[320px]">
            <h2 className="text-lg font-bold mb-4">
              Do you want to delete this order?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                className="btn btn-sm"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-sm btn-error"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
