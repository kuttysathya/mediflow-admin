
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get("https://mediflow-backend-1.onrender.com/doctors");
      setDoctors(data);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  const addDoctor = async (doctor) => {
    try {
      const { data } = await axios.post("https://mediflow-backend-1.onrender.com/doctors", doctor);
      setDoctors((prev) => [...prev, data]);
      toast.success("Doctor added");
    } catch {
      toast.error("Error adding doctor");
    }
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get("https://mediflow-backend-1.onrender.com/appointments");
      setAppointments(data);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  const addAppointment = async (appt) => {
    try {
      const { data } = await axios.post("https://mediflow-backend-1.onrender.com/appointments", appt);
      setAppointments((prev) => [...prev, data]);
      toast.success("Appointment added");
    } catch {
      toast.error("Error adding appointment");
    }
  };

  const handleAvailabilityChange = async (doctorId, newStatus) => {
  try {
    await axios.patch(`https://mediflow-backend-1.onrender.com/doctors/${doctorId}`, {
      availability: newStatus,
    });
    toast.success("Availability updated");

  } catch (error) {
    toast.error("Failed to update availability");
  }
};

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      getAppointments();
    }
  }, [aToken]);

  return (
    <AdminContext.Provider
      value={{
        doctors,
        appointments,
        getAllDoctors,
        addDoctor,
        getAppointments,
        addAppointment,
        aToken,
        setAToken,
        handleAvailabilityChange, 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
