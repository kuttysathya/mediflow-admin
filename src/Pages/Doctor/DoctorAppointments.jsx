import React, { useContext, useState } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const {
    appointments,
    handleUpdateStatus,
    addPrescription,
    editPrescription,
    handleAddPrescription,
    doctorToken,
  } = useContext(DoctorContext);

  const isBlobUrl = (url) => url?.startsWith("blob:");

  // --- NEW: state for Medical Notes editing ---
  const [isEditing, setIsEditing] = useState(false);
  const [editDiagnoses, setEditDiagnoses] = useState("");
  const [editAllergies, setEditAllergies] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const navigate = useNavigate();

  const handleViewMedicalHistory = (email) => {
    navigate(`/medical-history?email=${encodeURIComponent(email)}`);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    prescriptions: [{ medicine: "", dosage: "", duration: "", interval: "" }],
    notes: "",
  });

  const handlePrescriptionChange = (index, field, value) => {
    const updated = [...formData.prescriptions];
    updated[index][field] = value;
    setFormData({ ...formData, prescriptions: updated });
  };

  const addPrescriptionRow = () => {
    setFormData({
      ...formData,
      prescriptions: [
        ...formData.prescriptions,
        { medicine: "", dosage: "", duration: "", interval: "" },
      ],
    });
  };

  const removePrescriptionRow = (index) => {
    const updated = [...formData.prescriptions];
    updated.splice(index, 1);
    setFormData({ ...formData, prescriptions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prescriptionData = {
      ...formData,
      doctorId: doctorToken,
      datetime: new Date().toISOString(),
    };

    if (selectedAppointment?.prescriptionId) {
      await editPrescription(
        selectedAppointment.prescriptionId,
        prescriptionData
      );
    } else {
      await addPrescription(prescriptionData);
    }

    await handleAddPrescription(selectedAppointment.id, formData.prescriptions);

    setShowDetails(false);
    setFormData({
      patientName: "",
      prescriptions: [{ medicine: "", dosage: "", duration: "", interval: "" }],
      notes: "",
    });
    setSelectedAppointment(null);
  };

  // --- NEW: save diagnoses & allergies to json-server ---
  const handleSaveMedicalNotes = async () => {
    if (!selectedAppointment) return;
    setSaving(true);
    setSaveError("");

    try {
      const res = await fetch(
        `https://mediflow-backend-1.onrender.com/appointments/${selectedAppointment.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            diagnoses: editDiagnoses,
            allergies: editAllergies,
          }),
        }
      );

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to save changes");
      }
      setSelectedAppointment((prev) => ({
        ...prev,
        diagnoses: editDiagnoses,
        allergies: editAllergies,
      }));

      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_1.3fr_1fr_1.3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Date & Time</p>
          <p>Action</p>
          <p>Add Prescriptions</p>
          <p>👁️Details</p>
        </div>

        {[...appointments].reverse().map((a, i) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.3fr_1fr_1fr_1fr_0.8fr_1fr] items-center gap-1 py-3 px-6 text-gray-500 border-b hover:bg-gray-50"
            key={a.id}
          >
            <p className="max-sm:hidden">{i + 1}.</p>
            <div className="flex items-center gap-2">
              <img
                className="w-10 rounded-full"
                src={
                  isBlobUrl(a.patientImage)
                    ? "https://i.ibb.co/wZYqYwDK/upload-area.png"
                    : a.patientImage
                }
                alt="patient"
              />
              <p>{a.patientName}</p>
            </div>
            <p>{a.datetime}</p>
            <div>
              <select
                value={a.appstatus}
                onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                className={`text-sm px-2 py-1 rounded-full focus:outline-none ${
                  a.appstatus === "Confirmed"
                    ? "bg-green-100 text-green-600"
                    : a.appstatus === "Cancelled"
                    ? "bg-red-100 text-red-600"
                    : a.appstatus === "Completed"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedAppointment(a);
                setFormData({
                  patientName: a.patientName,
                  diagnoses: a.diagnoses || "",
                  allergies: a.allergies || "",
                  prescriptions: [{ medicine: "", dosage: "", duration: "" }],
                  notes: "",
                });
                setEditDiagnoses(a.diagnoses || "");
                setEditAllergies(a.allergies || "");
                setShowDetails(true);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600"
            >
              + Prescriptions
            </button>
            <button
              onClick={() => handleViewMedicalHistory(a.patientEmail)}
              className="text-blue-600 underline text-sm"
            >
              Details
            </button>
          </div>
        ))}
      </div>

      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Patient Info */}
              <div className="border rounded p-4 space-y-2 bg-gray-50">
                <h2 className="text-lg font-semibold mb-3">Patient Details</h2>
                <p>
                  <strong>Name:</strong> {selectedAppointment.patientName}
                </p>
                <p>
                  <strong>Age:</strong>{" "}
                  {selectedAppointment.patientAge || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedAppointment.patientEmail || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedAppointment.patientPhone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedAppointment.patientAddress || "N/A"}
                </p>
                <p>
                  <strong>Blood-Group:</strong>{" "}
                  {selectedAppointment.patientBloodGroup || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong>{" "}
                  {selectedAppointment.patientGender || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment.appstatus}
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  {selectedAppointment.paymentMethod || "-"}
                </p>
                <p>
                  <strong>Date & Time:</strong> {selectedAppointment.datetime}
                </p>
                {/* Editable Medical Notes */}
                <div className="mt-2 pt-3 border-t">
                  <h3 className="text-base font-semibold mb-2">
                    Medical Notes
                  </h3>

                  {/* Diagnoses */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Diagnoses
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editDiagnoses}
                        onChange={(e) => setEditDiagnoses(e.target.value)}
                        className="mt-1 border px-3 py-2 rounded w-full"
                        placeholder="Enter diagnoses"
                      />
                    ) : (
                      <p className="mt-1">
                        {selectedAppointment.diagnoses || "N/A"}
                      </p>
                    )}
                  </div>

                  {/* Allergies */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Allergies
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editAllergies}
                        onChange={(e) => setEditAllergies(e.target.value)}
                        className="mt-1 border px-3 py-2 rounded w-full"
                        placeholder="Enter allergies"
                      />
                    ) : (
                      <p className="mt-1">
                        {selectedAppointment.allergies || "N/A"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveMedicalNotes}
                          disabled={saving}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-60"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditDiagnoses(
                              selectedAppointment.diagnoses || ""
                            );
                            setEditAllergies(
                              selectedAppointment.allergies || ""
                            );
                            setSaveError("");
                          }}
                          disabled={saving}
                          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {saveError && (
                      <span className="ml-2 text-sm text-red-600">
                        {saveError}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right - Prescription Form */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Add Prescription</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {formData.prescriptions.map((pres, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 border p-2 rounded relative"
                    >
                      <input
                        placeholder="💊 Medicine Name"
                        value={pres.medicine}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            idx,
                            "medicine",
                            e.target.value
                          )
                        }
                        className="border px-3 py-2 rounded"
                        required
                      />
                      <input
                        placeholder="📋 Dosage"
                        value={pres.dosage}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            idx,
                            "dosage",
                            e.target.value
                          )
                        }
                        className="border px-3 py-2 rounded"
                      />
                      <input
                        placeholder="⏳ Duration"
                        value={pres.duration}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            idx,
                            "duration",
                            e.target.value
                          )
                        }
                        className="border px-3 py-2 rounded"
                      />
                      <input
                        placeholder="Eg. Before sleep..."
                        value={pres.interval}
                        onChange={(e) =>
                          handlePrescriptionChange(
                            idx,
                            "interval",
                            e.target.value
                          )
                        }
                        className="border px-3 py-2 rounded"
                        required
                      />
                      {formData.prescriptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePrescriptionRow(idx)}
                          className="absolute top-0 right-0"
                        >
                          <img
                            className="w-10"
                            src={assets.cancel_icon}
                            alt=""
                          />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPrescriptionRow}
                    className="px-3 py-1 rounded bg-green-500 text-white text-sm w-fit"
                  >
                    ➕ Add More
                  </button>
                  <textarea
                    placeholder="📝 Notes/Instructions"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="border px-3 py-2 rounded"
                  ></textarea>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDetails(false)}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
