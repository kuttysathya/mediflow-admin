import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function MedicalHistory() {
  const query = useQuery();
  const patientEmail = query.get("email");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState({ from: "", to: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!patientEmail) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const patientRes = await fetch(
          `https://mediflow-backend-1.onrender.com/patients?email=${encodeURIComponent(
            patientEmail
          )}`
        );
        if (!patientRes.ok) throw new Error("Failed to fetch patient info");
        const patientData = await patientRes.json();
        if (patientData.length === 0) throw new Error("Patient not found");
        setPatient(patientData[0]);

        const appRes = await fetch(
          `https://mediflow-backend-1.onrender.com/appointments?patientEmail=${encodeURIComponent(
            patientEmail
          )}`
        );
        if (!appRes.ok) throw new Error("Failed to fetch appointments");
        const appData = await appRes.json();

        const sorted = appData.sort((a, b) => {
          const parseDate = (dt) => {
            const [datePart] = dt.split(" at ");
            const [dd, mm, yyyy] = datePart.split("/");
            return new Date(`${yyyy}-${mm}-${dd}`);
          };
          return parseDate(b.datetime) - parseDate(a.datetime);
        });

        setAppointments(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [patientEmail]);

  const filteredAppointments = appointments.filter((app) => {
    if (!filter.from && !filter.to) return true;
    const [datePart] = app.datetime.split(" at ");
    const [dd, mm, yyyy] = datePart.split("/");
    const appDate = new Date(`${yyyy}-${mm}-${dd}`);

    if (filter.from && new Date(filter.from) > appDate) return false;
    if (filter.to && new Date(filter.to) < appDate) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-xl animate-pulse font-semibold">
          Loading medical history...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <p className="text-red-600 text-lg font-bold text-center">{error}</p>
      </div>
    );

  if (!patient)
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <p className="text-gray-700 text-lg font-semibold text-center">
          Patient not found.
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14 sm:px-8">
      <div className="flex justify-between ">
        <button
          onClick={() => window.history.back()}
          className="mb-6 px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
        >
          ← Back
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={filteredAppointments.length === 0}
          className="mb-6 items-center gap-3 rounded bg-indigo-600 px-6 py-2 font-semibold sm:font-thin sm: text-white shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          View Medical History
        </button>
      </div>

      {/* Main page content outside modal */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl md:text-4xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm mb-3">
          Medical History
        </h1>
        <p className="text-2xl text-gray-700 font-medium">{patient.name}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-7 mb-10 text-center">
        {[
          { label: "Age", value: patient.age },
          { label: "Gender", value: patient.gender },
          { label: "Blood Group", value: patient.bloodGroup },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-indigo-50 rounded-lg p-6 shadow hover:shadow-lg transition-shadow cursor-default"
          >
            <p className="text-indigo-700 text-sm font-semibold uppercase tracking-wide mb-2">
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="mb-12 text-center">
        <p className="text-gray-700 font-semibold text-lg">
          Total Appointments:{" "}
          <span className="text-indigo-600">
            {" "}
            {filteredAppointments.length}
          </span>{" "}
          | Total Prescriptions:{" "}
          <span className="text-indigo-600">
            {filteredAppointments.reduce(
              (acc, app) =>
                acc + (app.prescription ? app.prescription.length : 0),
              0
            )}
          </span>
        </p>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          ></div>

          <section
            className="fixed inset-10 bg-white rounded-lg shadow-xl z-50 overflow-y-auto p-8"
            id="printableArea"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-8 text-gray-500 hover:text-black text-4xl z-10"
              aria-label="Close preview"
            >
              ×
            </button>

            {/* Header */}
            <div className="flex items-center border-b pb-4 mb-4">
              <div className="text-center flex-1">
                <img
                  src="https://i.ibb.co/F4g71TpB/logo.png"
                  alt="MediFlow Logo"
                  className="mx-auto w-18 h-12"
                />
                <h1 className="text-gray-600 text-sm">
                  Mediflow Healthcare Pvt. Ltd. 123 Health Street, 2nd Floor,
                  <br />
                  tirupati, Andhra Pradesh - 517501 <br />
                  <span className="text-md font-bold text-gray-500">
                    📞 +91 98765 43210 | 📧 support@mediflow.com
                  </span>
                </h1>
              </div>
              <img
                src="https://i.ibb.co/8DzyJMrv/header-img.png"
                alt="header-img"
                className="w-48 h-38 mr-8"
              />
            </div>

            {/* Patient Info Header */}
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm mb-3">
                Medical History
              </h1>
              <p className="text-xl text-gray-700 font-medium">
                {patient.name}
              </p>
            </header>

            {/* Filters + Open Modal Button */}
            <div className="flex flex-wrap gap-5 items-center mb-8">
              <label className="flex flex-col font-medium text-gray-700">
                From
                <input
                  type="date"
                  value={filter.from}
                  onChange={(e) =>
                    setFilter({ ...filter, from: e.target.value })
                  }
                  className="mt-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="flex flex-col font-medium text-gray-700">
                To
                <input
                  type="date"
                  value={filter.to}
                  onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                  className="mt-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>

            {/* Patient Details */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-center">
              {[
                { label: "Age", value: patient.age },
                { label: "Gender", value: patient.gender },
                { label: "Blood Group", value: patient.bloodGroup },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-indigo-50 rounded-lg p-6 shadow cursor-default"
                >
                  <p className="text-indigo-700 text-sm font-semibold uppercase tracking-wide mb-1">
                    {label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </section>

            {/* Stats */}
            <section className="mb-10 text-center">
              <p className="text-gray-700 font-semibold text-lg">
                Total Appointments:{" "}
                <span className="text-indigo-600">
                  {filteredAppointments.length}
                </span>{" "}
                | Total Prescriptions:{" "}
                <span className="text-indigo-600">
                  {filteredAppointments.reduce(
                    (acc, app) =>
                      acc + (app.prescription ? app.prescription.length : 0),
                    0
                  )}
                </span>
              </p>
            </section>

            {/* Appointment Cards */}
            <section className="space-y-8">
              {filteredAppointments.length === 0 ? (
                <p className="text-center text-gray-500 text-xl font-semibold">
                  No appointments found for selected date range.
                </p>
              ) : (
                filteredAppointments.map((app) => (
                  <article
                    key={app.id}
                    className="border rounded-lg shadow-md p-6 bg-white hover:shadow-xl transition-shadow"
                    role="region"
                    aria-label={`Appointment on ${app.datetime} with ${app.doctorName}`}
                  >
                    <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
                      <h3 className="text-2xl font-semibold text-indigo-700 mb-2 sm:mb-0">
                        {app.datetime}
                      </h3>
                      <span
                        className={`inline-block px-4 py-1 rounded-full font-semibold text-sm ${
                          app.appstatus === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : app.appstatus === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : app.appstatus === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.appstatus}
                      </span>
                    </header>
                    <p className="text-lg font-medium mb-2">
                      Doctor: {app.doctorName}
                    </p>
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Diagnoses
                      </h4>
                      <p className="text-gray-700">
                        {app.diagnoses ? (
                          app.diagnoses .split(",") .map((d, i) => <li key={i}>{d.trim()}</li>)
                        ) : (
                          <p className="italic text-gray-600">No diagnoses</p>
                        )}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Prescriptions
                      </h4>
                      {app.prescription && app.prescription.length > 0 ? (
                        <ul className="list-disc ml-6 space-y-1 text-gray-700">
                          {app.prescription.map((p, i) => (
                            <li key={i}>
                              {p.medicine} - {p.dosage} - {p.duration} -{" "}
                              {p.interval}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 italic">
                          No prescriptions.
                        </p>
                      )}
                    </div>
                  </article>
                ))
              )}
            </section>

            {/* Modal Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={handlePrint}
                className="px-6 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Print
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 font-semibold"
              >
                Close
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
