import React from "react";

interface ErrorCardProps {
  message: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/10 md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-800">
        <svg
          className="text-red-800 size-6 dark:text-red-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>

      <div className="mt-5">
        <h4 className="font-bold text-red-800 text-title-sm dark:text-red-200">
          Terjadi Kesalahan
        </h4>
        <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
      </div>
    </div>
  );
};