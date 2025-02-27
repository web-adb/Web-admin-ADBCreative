"use client";
import { useState, useEffect } from "react";
import { format, differenceInDays, isToday, isTomorrow } from "date-fns";
import { useRouter } from "next/navigation";

interface PodcastProgram {
  id: number;
  title: string;
  schedule: string;
  host: string;
  source: string;
}

export default function AdminPodcastProgram() {
  const [programs, setPrograms] = useState<PodcastProgram[]>([]);
  const router = useRouter();

  // Fetch data program podcast
  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await fetch("/api/podcast-program");
      const data = await response.json();
      setPrograms(data);
    };

    fetchPrograms();
  }, []);

  // Handle hapus program
  const handleDelete = async (id: number) => {
    const response = await fetch("/api/podcast-program", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setPrograms(programs.filter((program) => program.id !== id));
    }
  };

  // Fungsi untuk menghitung status
  const getStatus = (schedule: string) => {
    const scheduleDate = new Date(schedule);
    const today = new Date();

    if (isToday(scheduleDate)) {
      return { text: "Hari Ini", color: "bg-green-100 text-green-800" };
    } else if (isTomorrow(scheduleDate)) {
      return { text: "Besok", color: "bg-blue-100 text-blue-800" };
    } else {
      const daysLeft = differenceInDays(scheduleDate, today);
      return {
        text: `${daysLeft} Hari Lagi`,
        color: "bg-gray-100 text-gray-800",
      };
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">List Daftar Podcast</h1>

      {/* Tabel daftar program */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Nama Program</th>
              <th className="p-3 text-left">Jadwal</th>
              <th className="p-3 text-left">Host</th>
              <th className="p-3 text-left">Sumber</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => {
              const status = getStatus(program.schedule);
              return (
                <tr key={program.id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="p-3 text-gray-800">{program.title}</td>
                  <td className="p-3 text-gray-800">
                    {format(new Date(program.schedule), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="p-3 text-gray-800">{program.host}</td>
                  <td className="p-3 text-gray-800">{program.source}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/program-podcast/edit-program/${program.id}`)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(program.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}