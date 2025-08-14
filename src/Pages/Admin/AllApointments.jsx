import React, { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";

const AllAppointments = () => {
  const { appointments } = useContext(AdminContext);
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Appointments</h2>
      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a.id} className="bg-white p-3 shadow rounded">
            <p> <strong>Patient:</strong> {a.patientName}</p>
            <p> <strong>Doctor:</strong> {a.doctorName} </p>
            <p> <strong>Date/Time:</strong> {a.datetime} </p>
            <p> <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  a.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                {a.status || "Unpaid"}
              </span>
            </p>
            {a.paymentMethod && (
              <p>
                <strong>Method:</strong> {a.paymentMethod}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
