import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [doctorToken, setDoctorToken] = useState(
    localStorage.getItem("doctorToken") || ""
  );
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);


  const loadDoctorProfile = async () => {
    try {
      const { data } = await axios.get(
        `https://mediflow-backend-1.onrender.com/doctors/${doctorToken}`
      );
      
      setDoctorProfile(data);
    } catch (error) {
      toast.error("Failed to load doctor profile");
    }
  };

  const updateDoctorProfile = async (updatedDoctor) => {
    try {
      const res = await axios.put(`https://mediflow-backend-1.onrender.com/doctors/${updatedDoctor.id}`, updatedDoctor);
      return res.data;
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("https://mediflow-backend-1.onrender.com/appointments");
      const doctorId = doctorToken;
      const filtered = res.data.filter((a) => a.doctorId === doctorId);
      setAppointments(filtered);
      console.log(filtered);
    } catch (err) {
      toast.error("Failed to fetch appointments");
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`https://mediflow-backend-1.onrender.com/appointments/${appointmentId}`, {
        appstatus: newStatus,
      });
      fetchAppointments();
      toast.success(`Appointment ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await axios.delete(`https://mediflow-backend-1.onrender.com/appointments/${appointmentId}`);
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const updateAppointmentStatus = async (appointmentId, updatedData) => {
    try {
      await axios.patch(
        `https://mediflow-backend-1.onrender.com/appointments/${appointmentId}`,
        updatedData
      );
      toast.success("Appointment rescheduled");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update appointment:", error);
      toast.error("Rescheduling failed");
    }
  };

  // ------------Add Prescription-------------

  // GET
const fetchPrescriptions = async () => {
  try {
    const res = await axios.get("https://mediflow-backend-1.onrender.com/prescriptions");
    const doctorId = doctorToken;
    const filtered = res.data.filter((p) => p.doctorId === doctorId);
    setPrescriptions(filtered);
  } catch (err) {
    toast.error("Failed to fetch prescriptions");
  }
};

// POST
const addPrescription = async (newPrescription) => {
  try {
    await axios.post("https://mediflow-backend-1.onrender.com/prescriptions", newPrescription);
    fetchPrescriptions();
    toast.success("Prescription added");
  } catch (err) {
    toast.error("Failed to add prescription");
  }
};

// DELETE
const deletePrescription = async (id) => {
  try {
    await axios.delete(`https://mediflow-backend-1.onrender.com/prescriptions/${id}`);
    fetchPrescriptions();
    toast.success("Prescription deleted");
  } catch (err) {
    toast.error("Failed to delete prescription");
  }
};

//  PUT
const editPrescription = async (id, updatedData) => {
  try {
    await axios.put(`https://mediflow-backend-1.onrender.com/prescriptions/${id}`, {
      ...updatedData,
      doctorId: doctorToken,
    });
    fetchPrescriptions(); 
    toast.success("Prescription updated");
  } catch (err) {
    toast.error("Failed to update prescription");
  }
};

const handleAddPrescription = async (id, prescription) => {
  try {
    await axios.patch(`https://mediflow-backend-1.onrender.com/appointments/${id}`, {
      prescription: prescription,
    });
    fetchAppointments(); 
  } catch (err) {
    console.error(err);
    toast.error("Failed to save prescription");
  }
};


  useEffect(() => {
    if (doctorToken) {
      loadDoctorProfile();
      fetchAppointments();
      fetchPrescriptions();
    }
  }, [doctorToken]);

  const value = {
    doctorToken,
    setDoctorToken,
    appointments,
    setAppointments,
    fetchAppointments,
    doctorProfile,
    setDoctorProfile,
    handleUpdateStatus,
    loadDoctorProfile,
    updateDoctorProfile,
    handleCancel,
    updateAppointmentStatus,
    prescriptions,
    fetchPrescriptions,
    addPrescription,
    deletePrescription,
    editPrescription,
    handleAddPrescription
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
