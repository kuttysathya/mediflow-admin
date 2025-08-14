import React, { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";

const DoctorsList = () => {
  const { doctors, handleAvailabilityChange} = useContext(AdminContext);

  const toggleAvailability = (id, currentStatus) => {
    handleAvailabilityChange(id, !currentStatus);
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-xl font-bold mb-4">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {
        doctors.map((doc) => (
          <div key={doc.id} className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group">
            <img src={doc.image} alt={doc.name} className="bg-indigo-50 group-hover:bg-primary transition-all duration-300" />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{doc.name}</p>
              <p className="text-sm text-zinc-600">{doc.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input type="checkbox" onChange={() => toggleAvailability(doc.id, doc.availability)} checked={doc.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
