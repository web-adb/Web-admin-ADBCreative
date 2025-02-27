"use client";
import { useState, useEffect } from "react";
import Notification from "./Notification"; // Sesuaikan path sesuai struktur proyek Anda

interface PodcastProgram {
  id: number;
  title: string;
  schedule: string;
  host: string;
  source: string;
}

export default function AdminPodcastProgram() {
  const [programs, setPrograms] = useState<PodcastProgram[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    schedule: "",
    host: "",
    source: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch data program podcast
  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await fetch("/api/podcast-program");
      const data = await response.json();
      setPrograms(data);
    };

    fetchPrograms();
  }, []);

  // Handle form submit (tambah/edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editId ? `/api/podcast-program` : `/api/podcast-program`;
    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editId,
        ...formData,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (editId) {
        // Update program yang sudah ada
        setPrograms(
          programs.map((program) =>
            program.id === editId ? result : program
          )
        );
      } else {
        // Tambah program baru
        setPrograms([result, ...programs]);
      }
      resetForm();
      setNotification({
        message: editId
          ? "Program berhasil diperbarui!"
          : "Program berhasil ditambahkan!",
        type: "success",
      });
    } else {
      setNotification({
        message: "Terjadi kesalahan. Silakan coba lagi.",
        type: "error",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      schedule: "",
      host: "",
      source: "",
    });
    setEditId(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Program Podcast</h1>

      {/* Form tambah/edit program */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Program"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="datetime-local"
              value={formData.schedule}
              onChange={(e) =>
                setFormData({ ...formData, schedule: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Nama Host"
              value={formData.host}
              onChange={(e) =>
                setFormData({ ...formData, host: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Nama Sumber"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {editId ? "Update Program" : "Tambah Program"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Notifikasi */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}