import { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000); // Notifikasi akan hilang setelah 3 detik

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`w-[400px] max-w-[90%] p-6 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } ${
          type === "success"
            ? "bg-green-100 border-2 border-green-500"
            : "bg-red-100 border-2 border-red-500"
        } pointer-events-auto`}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Ikon Besar */}
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${
              type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {type === "success" ? (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          {/* Pesan */}
          <p
            className={`text-center text-lg font-semibold ${
              type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {message}
          </p>

          {/* Tombol Tutup */}
          <button
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              type === "success"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            } transition-colors duration-200`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;