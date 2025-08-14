
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
      const { data } = await axios.get("http://localhost:5000/doctors");
      setDoctors(data);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  const addDoctor = async (doctor) => {
    try {
      const { data } = await axios.post("http://localhost:5000/doctors", doctor);
      setDoctors((prev) => [...prev, data]);
      toast.success("Doctor added");
    } catch {
      toast.error("Error adding doctor");
    }
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/appointments");
      setAppointments(data);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  const addAppointment = async (appt) => {
    try {
      const { data } = await axios.post("http://localhost:5000/appointments", appt);
      setAppointments((prev) => [...prev, data]);
      toast.success("Appointment added");
    } catch {
      toast.error("Error adding appointment");
    }
  };

  const handleAvailabilityChange = async (doctorId, newStatus) => {
  try {
    await axios.patch(`http://localhost:5000/doctors/${doctorId}`, {
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
