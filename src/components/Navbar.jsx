import React, { use } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate()
    const handleLogout = () => {
        navigate('/login')
        localStorage.clear()
    }

    const user = useSelector(state => state.auth.user)

    console.log("user:", user);


    return (
        <div className='ml-1'>
            <div className="navbar border-b-2 border-warning shadow-sm bg-base-300 rounded-2xl">
                <div className="flex-1 ">
                    <i className='ml-4'>Welcome back, <span className='text-warning font-bold'>{user.name}</span></i>
                </div>
                <div className="flex gap-2 ">

              
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a className='text-error font-bold' onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar