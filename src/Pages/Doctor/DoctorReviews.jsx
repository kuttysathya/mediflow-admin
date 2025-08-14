import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../Context/DoctorContext";

const DoctorReviews = () => {
  const { doctorProfile } = useContext(DoctorContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!doctorProfile) return; // wait until profile is loaded
      try {
        const res = await axios.get(
          `http://localhost:5000/reviews?doctorName=${encodeURIComponent(doctorProfile.name)}`
        );
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [doctorProfile]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded mb-3 shadow">
            <p>
              <strong>{r.patientName}</strong> rated: {r.rating}★
            </p>
            <p>{r.reviewText}</p>
            <p className="text-sm text-gray-500">
              {new Date(r.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorReviews;
