import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{review.patientName}</h3>
        <span className="text-yellow-500 font-bold">{review.rating}★</span>
      </div>
      <p className="text-gray-700 mb-2">{review.reviewText}</p>
      <p className="text-gray-400 text-sm">
        {new Date(review.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default ReviewCard;
