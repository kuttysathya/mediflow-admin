import { useContext } from "react"
import { assets } from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import { AdminContext } from "../Context/AdminContext"
import { DoctorContext } from "../Context/DoctorContext"


const Navbar = () => {

    const {aToken, setAToken} = useContext(AdminContext)
    const {doctorToken, setDoctorToken} = useContext(DoctorContext)

    const navigate = useNavigate()

    const logout = () =>{
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        navigate('/')
        doctorToken && setDoctorToken('')
        doctorToken && localStorage.removeItem('doctorToken')
    }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border border-b bg-white">
      <div className="flex items-center gap-1 text-xs">
        <img className="w-56 cursor-pointer" src={assets.admin_logo} alt="" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logout} className="bg-primary text-white text-sm px-10 py-2 rounded-md">Logout</button>
    </div>
  )
}

export default Navbar
