import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { HiOutlineMenu, HiX } from 'react-icons/hi'
import { logout } from '../redux/slices/authSlice'

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout());      
    navigate("/login");
  }

  const user = useSelector(state => state.auth.user)

  console.log("user: ", user)

  return (
    <nav className="bg-base-300 border-b-2 border-warning shadow-sm rounded-r-2xl relative">
      <div className="hidden md:flex justify-between items-center px-6 py-3">
        <div>
          <span className="text-sm font-bold">
            Welcome back, <span className="text-warning font-bold">{user?.username || 'admin'}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user?.image}
                  alt="User Avatar"
                />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link className="justify-between" to={`/profile`}>
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <button className="text-error font-bold" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex md:hidden justify-between w-full items-center px-4 py-3">
        <span className="text-sm italic">
          Welcome, <span className="text-warning font-bold">{user?.username}</span>
        </span>

        <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user.image}
                  alt="User Avatar"
                />
              </div>
            </div>
      </div>

      
    </nav>
  )
}

export default Navbar
