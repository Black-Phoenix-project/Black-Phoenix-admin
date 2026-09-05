import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { logout } from '../redux/slices/authSlice'
import ThemeToggle from './ThemeToggle'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from '../i18n/LanguageSwitcher'

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const user = useSelector(state => state.auth.user)

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  const panel = (width) => (
    <div
      tabIndex="0"
      className={`dropdown-content z-10 mt-3 ${width} p-3 bg-base-100 rounded-2xl border border-base-300 shadow-xl`}
    >
      <Link
        to="/profile"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-base-200 transition-all"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-warning">
          <img
            src={user?.image || 'https://cdn-icons-png.flaticon.com/512/219/219983.png'}
            alt="User Avatar"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate">{user?.phoneNumber || 'admin'}</p>
          <p className="text-[11px] text-base-content/50">{t("nav.profile")}</p>
        </div>
        <span className="badge badge-warning badge-sm">{t("nav.new")}</span>
      </Link>

      <div className="divider my-2.5" />

      <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-base-content/40">
        {t("nav.language")}
      </p>
      <LanguageSwitcher vertical />

      <div className="divider my-2.5" />

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-error font-bold hover:bg-error/10 transition-all"
      >
        <LogOut size={16} />
        {t("nav.logout")}
      </button>
    </div>
  )

  return (
    <nav className="bg-base-300 border-b-2 border-warning shadow-sm rounded-r-2xl relative">
      <div className="hidden md:flex justify-between items-center px-6 py-3">
        <div>
          <span className="text-sm font-bold">
            {t("nav.welcome", { name: user?.phoneNumber || 'admin' })}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
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
            {panel("w-72")}
          </div>
        </div>
      </div>

      <div className="flex md:hidden justify-between w-full items-center px-4 py-3">
        <u className="text-sm font-medium underline-offset-4">
          {t("nav.brand")}
        </u>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user?.image || "https://cdn-icons-png.flaticon.com/512/219/219983.png"}
                  alt="User Avatar"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            {panel("w-64")}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
