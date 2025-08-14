import React, { useEffect, useState, useContext } from "react";
import { DoctorContext } from "../../Context/DoctorContext";

const DoctorDashboard = () => {
  const { doctorProfile } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorProfile) return;

      try {
        // Appointments
        const resAppointments = await fetch("https://mediflow-backend-1.onrender.com/appointments");
        const dataAppointments = await resAppointments.json();
        const filteredAppointments = dataAppointments.filter(
          (a) => a.doctorId === doctorProfile.id
        );
        setAppointments(filteredAppointments);

        // Reviews
        const resReviews = await fetch("https://mediflow-backend-1.onrender.com/reviews");
        const dataReviews = await resReviews.json();
        const filteredReviews = dataReviews.filter(
          (r) => r.doctorId === doctorProfile.id
        );
        setReviews(filteredReviews);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorProfile]);

  if (loading) return <p className="text-center text-gray-500 mt-20">Loading...</p>;

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.appstatus?.toLowerCase() === "completed"
  ).length;
  const pendingAppointments = appointments.filter(
    (a) => a.appstatus?.toLowerCase() === "pending"
  ).length;
  const todaysAppointments = appointments.filter((app) => {
    const appDate = new Date(
      app.datetime.split(" at ")[0].split("/").reverse().join("-")
    );
    const appDateOnly = appDate.toISOString().split("T")[0];
    return appDateOnly === today;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        Welcome, <span className="text-blue-600">{doctorProfile?.name}</span>
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Total Appointments", value: totalAppointments, color: "blue" },
          { title: "Completed", value: completedAppointments, color: "green" },
          { title: "Pending", value: pendingAppointments, color: "yellow" },
          { title: "Reviews", value: reviews.length, color: "purple" },
        ].map((card) => (
          <div
            key={card.title}
            className={`bg-white shadow-md rounded-xl p-6 border-l-4 border-${card.color}-500 hover:shadow-xl transition`}
          >
            <h2 className="text-lg font-medium text-gray-600 mb-2">{card.title}</h2>
            <p className={`text-3xl font-bold text-${card.color}-600`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-700">Today's Appointments</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            {todaysAppointments.length}
          </span>
        </div>

        {todaysAppointments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {todaysAppointments.map((app, idx) => (
              <li
                key={app.id}
                className={`py-3 px-4 flex justify-between items-center rounded-md ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                }`}
              >
                <span className="font-medium text-gray-800">{app.patientName}</span>
                <span className="text-sm text-gray-700 bg-blue-100 px-3 py-1 rounded-full">
                  {app.datetime.split(" ")[1]} {app.datetime.split(" ")[2]}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No appointments for today.</p>
        )}
      </div>

      {/* Latest Reviews */}
      <div className="bg-white shadow rounded-xl p-6 mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Latest Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reviews.slice(-5).reverse().map((rev) => (
              <li key={rev.id} className="py-3">
                <p className="text-gray-800 font-medium">{rev.patientName}</p>
                <p className="text-gray-600 text-sm">{rev.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
