import { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../Context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../Context/DoctorContext';

const Login = () => {

    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const{setAToken} = useContext(AdminContext)
    const {setDoctorToken} = useContext(DoctorContext)

    const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  const endpoint =
    state === "Admin" ? "admins" : "doctors";

  if (!email || !password) {
    toast.error("Please enter email and password");
    return;
  }

  try {

    const res = await axios.get(`https://mediflow-backend-1.onrender.com/${endpoint}?email=${email}&password=${password}`);
    if (res.data.length > 0) {
      if (state === "Admin") {
        localStorage.setItem("aToken", res.data[0].id);
        setAToken(res.data[0].id);
        toast.success("Admin Login Successful");
        navigate("/admin-dashboard");
      } else {
        localStorage.setItem("doctorToken", res.data[0].id);
        setDoctorToken(res.data[0].id);
        toast.success("Doctor Login Successful");
        navigate("/doctor-dashboard");
      }
      return;
    }

    toast.error("Invalid credentials");

  } catch (error) {
    toast.error("Login failed. Please try again.");
    console.error(error);
  }
};

  return (
    <form className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span>Login</p>
        <div className='w-full'>
            <p>Email:</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required/>
        </div>
        <div className='w-full'>
            <p>Password:</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required/>
        </div>
        <button onClick={handleLogin} className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
        {
            state === 'Admin'
            ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=> setState('Doctor')}>Click Here</span></p>
            : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=> setState('Admin')}>Click Here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
