import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  const user = useSelector(state => state.auth.user)

  console.log(user)

  return (
    <nav className="bg-base-300 border-b-2 border-warning shadow-sm rounded-r-2xl relative">
      <div className="hidden md:flex justify-between items-center px-6 py-3">
        <div>
          <span className="text-sm font-bold">
            Добро пожаловать, <span className="text-warning font-bold ">{user?.username || 'admin'}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&s'}
                  alt="User Avatar"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link className="justify-between" to={`/profile`}>
                  Профиль
                  <span className="badge">Новый</span>
                </Link>
              </li>
              <li>
                <button className="text-error font-bold" onClick={handleLogout}>
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex md:hidden justify-between w-full items-center px-4 py-3">
        <u className="text-sm font-medium underline-offset-4">
          Black Phoenix
        </u>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={
                  user?.image || "https://cdn-icons-png.flaticon.com/512/219/219983.png"

                }
                alt="User Avatar"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link className="justify-between" to={`/profile`}>
                Profil
                <span className="badge">Yangi</span>
              </Link>
            </li>
            <li>
              <button className="text-error font-bold" onClick={handleLogout}>
                Chiqish
              </button>
            </li>
          </ul>
        </div>
      </div>


    </nav>
  )
}

export default Navbar
