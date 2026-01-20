"use client";

import React from "react";

interface RatingProps {
  rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const partialStarPercentage = (rating % 1) * 100;

  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) => {
        if (index < fullStars) {
          // Full star
          return (
            <span key={index} className="text-yellow-500 text-[21px]">
              ★
            </span>
          );
        } else if (index === fullStars && hasPartialStar) {
          // Partial star
          return (
            <span key={index} className="relative text-[21px]">
              <span className="text-gray-300">★</span>
              <span
                className="absolute left-0 top-0 text-yellow-500 overflow-hidden"
                style={{ width: `${partialStarPercentage}%` }}
              >
                ★
              </span>
            </span>
          );
        } else {
          // Empty star
          return (
            <span key={index} className="text-gray-300 text-[21px]">
              ★
            </span>
          );
        }
      })}
    </div>
  );
};

export default Rating;
