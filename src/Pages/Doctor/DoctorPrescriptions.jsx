import React, { useContext, useState } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { assets } from "../../assets/assets";

const DoctorPrescriptions = () => {
  const {
    prescriptions,
    deletePrescription,
    addPrescription,
    editPrescription,
  } = useContext(DoctorContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const initialPrescription = { medicine: "", dosage: "", duration: "", interval: "" };
const initialFormData = {
  patientName: "",
  diagnoses: "",
  allergies: "",
  prescriptions: [initialPrescription],
  notes: "",
  datetime: new Date().toISOString().slice(0, 16),
};

const [formData, setFormData] = useState(initialFormData);

const updateForm = (updates) => setFormData((prev) => ({ ...prev, ...updates }));

const handlePrescriptionChange = (index, field, value) => {
  updateForm({
    prescriptions: formData.prescriptions.map((pres, i) =>
      i === index ? { ...pres, [field]: value } : pres
    ),
  });
};

const addPrescriptionRow = () => {
  updateForm({ prescriptions: [...formData.prescriptions, initialPrescription] });
};

const removePrescriptionRow = (index) => {
  updateForm({
    prescriptions: formData.prescriptions.filter((_, i) => i !== index),
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = { ...formData, datetime: new Date(formData.datetime).toISOString() };

  if (selectedPrescription) {
    await editPrescription(selectedPrescription.id, payload);
  } else {
    await addPrescription(payload);
  }

  setFormData(initialFormData);
  setSelectedPrescription(null);
  setShowForm(false);
};

const filteredPrescriptions = prescriptions.filter((p) => {
  const matchesSearch =
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.prescriptions?.some((med) =>
      med.medicine.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return matchesSearch && (!selectedPatient || p.patientName === selectedPatient);
});


  const uniquePatients = [...new Set(prescriptions.map((p) => p.patientName))];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">🩺 Prescriptions</h1>
        <button
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            setSelectedPrescription(null);
            setFormData({
              patientName: "",
              diagnoses: "",
              allergies: "",
              prescriptions: [
                { medicine: "", dosage: "", duration: "", interval: "" },
              ],
              notes: "",
              datetime: new Date().toISOString().slice(0, 16),
            });
            setShowForm(true);
          }}
        >
          + Add Prescription
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border p-4 rounded-lg shadow-md mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="👤 Patient Name"
              value={formData.patientName}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
              required
              className="border px-3 py-2 rounded"
            />

            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) =>
                setFormData({ ...formData, datetime: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
          </div>
          <input
            type="text"
            placeholder="🩺 Diagnoses"
            value={formData.diagnoses}
            onChange={(e) =>
              setFormData({ ...formData, diagnoses: e.target.value })
            }
            className="border px-3 py-2 rounded w-full mt-4"
          />

          <input
            type="text"
            placeholder="🤧 Allergies"
            value={formData.allergies}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            className="border px-3 py-2 rounded w-full mt-2"
          />

          <div className="mt-4">
            {formData.prescriptions.map((pres, idx) => (
              <div key={idx} className="border p-3 rounded-md mb-2 relative">
                <input
                  type="text"
                  placeholder="💊 Medicine"
                  value={pres.medicine}
                  onChange={(e) =>
                    handlePrescriptionChange(idx, "medicine", e.target.value)
                  }
                  className="border px-3 py-2 rounded w-full mb-2"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="📋 Dosage"
                    value={pres.dosage}
                    onChange={(e) =>
                      handlePrescriptionChange(idx, "dosage", e.target.value)
                    }
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="⏳ Duration"
                    value={pres.duration}
                    onChange={(e) =>
                      handlePrescriptionChange(idx, "duration", e.target.value)
                    }
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="eg. Before Sleep..."
                    value={pres.interval}
                    onChange={(e) =>
                      handlePrescriptionChange(idx, "interval", e.target.value)
                    }
                    className="border px-3 py-2 rounded w-full mb-2"
                    required
                  />
                </div>
                {formData.prescriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrescriptionRow(idx)}
                    className="absolute -top-2 -right-2 text-red-500 text-sm"
                  >
                    <img className="w-10" src={assets.cancel_icon} alt="" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="bg-green-500 text-white px-3 py-1 rounded mt-2 text-sm"
            >
              ➕ Add Medicine
            </button>
          </div>

          <textarea
            placeholder="📝 Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="border px-3 py-2 rounded w-full mt-4"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedPrescription(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {selectedPrescription ? "Update" : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/2"
        />
        <select
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Filter by Patient</option>
          {uniquePatients.map((patient, idx) => (
            <option key={idx} value={patient}>
              {patient}
            </option>
          ))}
        </select>
      </div>

      {/* Prescription List */}
      {filteredPrescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    👤 {prescription.patientName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {new Date(prescription.datetime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium text-indigo-600">
                    🩺 Diagnoses:
                  </span>{" "}
                  {prescription.diagnoses || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-pink-600">
                    🤧 Allergies:
                  </span>{" "}
                  {prescription.allergies || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </p>

                {/* Medicines List */}
                {prescription.prescriptions?.length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      💊 Prescriptions
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {prescription.prescriptions.map((item, idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="font-medium">{item.medicine}</span> —{" "}
                          {item.dosage} for {item.duration} ({item.interval})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-gray-700 mt-2">
                  <span className="font-medium text-amber-600">📝 Notes:</span>{" "}
                  {prescription.notes || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm"
                  onClick={() => {
                    setSelectedPrescription(prescription);
                    setFormData({
                      patientName: prescription.patientName,
                      diagnoses: prescription.diagnoses || "",
                      allergies: prescription.allergies || "",
                      prescriptions: prescription.prescriptions || [{ medicine: "", dosage: "", duration: "", interval: "" }],
                      notes: prescription.notes,
                      datetime: new Date(prescription.datetime)
                        .toISOString()
                        .slice(0, 16),
                    });
                    setShowForm(true);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm"
                  onClick={() => deletePrescription(prescription.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No prescriptions found 😕
        </p>
      )}
    </div>
  );
};

export default DoctorPrescriptions;
