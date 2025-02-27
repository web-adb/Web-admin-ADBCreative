"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface PodcastProgram {
  id: number;
  title: string;
  schedule: string;
  host: string;
  source: string;
}

export default function EditPodcastProgram({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    schedule: "",
    host: "",
    source: "",
  });

  // Fetch data program podcast berdasarkan ID
  useEffect(() => {
    const fetchProgram = async () => {
      const response = await fetch(`/api/podcast-program?id=${params.id}`);
      if (!response.ok) {
        console.error("Failed to fetch program data");
        return;
      }
      const data: PodcastProgram = await response.json();
      setFormData({
        title: data.title,
        schedule: format(new Date(data.schedule), "yyyy-MM-dd'T'HH:mm"), // Format untuk input datetime-local
        host: data.host,
        source: data.source,
      });
    };

    fetchProgram();
  }, [params.id]);

  // Handle form submit (update program)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/podcast-program", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Number(params.id), // Pastikan ID dikirim sebagai number
        title: formData.title,
        schedule: new Date(formData.schedule).toISOString(), // Konversi ke ISO string
        host: formData.host,
        source: formData.source,
      }),
    });

    if (response.ok) {
      router.push("/admin-podcast-program"); // Redirect ke halaman daftar setelah berhasil update
    } else {
      console.error("Failed to update program");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Program Podcast</h1>

      {/* Form edit program */}
      <div className="bg-white p-6 rounded-lg shadow-md">
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
              Update Program
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin-podcast-program")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}