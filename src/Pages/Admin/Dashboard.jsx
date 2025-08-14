import { useContext } from "react";

import { Link } from "react-router-dom";
import { AdminContext } from "../../Context/AdminContext";

const Dashboard = () => {
  const { doctors, appointments } = useContext(AdminContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <Link to="/admin/doctor-list" className="p-4 bg-white shadow rounded">
          <h3 className="text-lg">Total Doctors</h3>
          <p className="text-2xl">{doctors.length}</p>
        </Link>
        <Link to="/admin/appointments" className="p-4 bg-white shadow rounded">
          <h3 className="text-lg">Appointments</h3>
          <p className="text-2xl">{appointments.length}</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
