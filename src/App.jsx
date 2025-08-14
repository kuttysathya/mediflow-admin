import { useContext } from "react";
import Login from "./Pages/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointments from "./Pages/Admin/AllApointments";
import AddDoctor from "./Pages/Admin/AddDoctor";
import DoctorsList from "./Pages/Admin/DoctorsList";
import { DoctorContext } from "./Context/DoctorContext";
import DoctorDashboard from "./Pages/Doctor/DoctorDashboard";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
import DoctorAppointments from "./Pages/Doctor/DoctorAppointments";
import DoctorCalender from "./Pages/Doctor/DoctorCalendar";
import DoctorPrescriptions from "./Pages/Doctor/DoctorPrescriptions";
import MedicalHistory from "./Pages/Doctor/MedicalHistory";
import DoctorReviews from "./Pages/Doctor/DoctorReviews";
import { AdminContext } from "./Context/AdminContext";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { doctorToken } = useContext(DoctorContext);

  return aToken || doctorToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* ---Admin Route--- */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-apointments" element={<AllApointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
          {/* ---Doctor Route--- */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-calender" element={<DoctorCalender />} />
          <Route path="/doctor-prescriptions" element={<DoctorPrescriptions />}/>
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/doctor-reviews" element={<DoctorReviews />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
    <Login />
    <ToastContainer />
  </>
  );
};

export default App;
