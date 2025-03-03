"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaEdit, FaStar, FaBookOpen } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
}

export default function SemuaCatatan() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [recommendedNotes, setRecommendedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/notes");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setNotes(data);

        // Ambil 4 catatan terbaru untuk rekomendasi
        const sortedNotes = data.sort(
          (a: Note, b: Note) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecommendedNotes(sortedNotes.slice(0, 4));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus catatan");
      }

      setNotes(notes.filter((note) => note.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/notes/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Memuat catatan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Selamat Datang di Catatan Anda
      </h3>

      {/* Bagian Rekomendasi Catatan */}
      <div className="mb-12">
        <h4 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FaStar className="mr-2 text-yellow-500" /> Rekomendasi Catatan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105"
              onClick={() => router.push(`/catatan/${note.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaBookOpen className="text-blue-500 mr-2" />
                  <h4 className="text-xl font-semibold text-gray-800">
                    {note.title}
                  </h4>
                </div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        className="text-sm text-gray-600 line-clamp-3"
                        {...props}
                      />
                    ),
                  }}
                >
                  {note.content}
                </ReactMarkdown>
                <p className="mt-4 text-xs text-gray-500">
                  Dibuat pada:{" "}
                  {new Date(note.createdAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daftar Semua Catatan */}
      <div>
        <h4 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FaBookOpen className="mr-2 text-blue-500" /> Semua Catatan
        </h4>
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">Tidak ada catatan yang tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105"
                onClick={() => router.push(`/catatan/${note.id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold text-gray-800">
                      {note.title}
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(note.id);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="text-sm text-gray-600 line-clamp-3" {...props} />
                      ),
                    }}
                  >
                    {note.content}
                  </ReactMarkdown>
                  <p className="mt-4 text-xs text-gray-500">
                    Dibuat pada:{" "}
                    {new Date(note.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Status: {note.archived ? "Diarsipkan" : "Tidak Diarsipkan"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}