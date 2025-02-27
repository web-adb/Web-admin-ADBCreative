// components/LoadingBall.tsx
import React from "react";

export const LoadingBall = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Bola pertama */}
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-75"></div>
      {/* Bola kedua */}
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
      {/* Bola ketiga */}
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></div>
    </div>
  );
};