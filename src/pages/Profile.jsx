import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        No user data
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-base-100 shadow-2xl rounded-3xl p-6 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.image}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-warning object-cover"
          />

          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">Admin</h2>
            <p className="text-sm text-gray-500">Personal information</p>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-error text-black font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Info section */}
        <div className="grid md:grid-cols-2 gap-5 mt-10">

          <InfoCard title="User ID" value={user.id} />

          <InfoCard title="Phone Number" value={user.phoneNumber} />

        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value }) => {
  return (
    <div className="bg-warning/10 border border-warning rounded-2xl p-5">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="font-semibold break-all">{value}</p>
    </div>
  );
};

export default Profile;
