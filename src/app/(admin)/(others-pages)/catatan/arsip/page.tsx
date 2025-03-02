"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrashBinIcon } from "@/icons";
import { PencilIcon } from "@/icons";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch data catatan dari API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/notes");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setNotes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Fungsi untuk menghapus catatan
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus catatan");
      }

      // Hapus catatan dari state
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Fungsi untuk mengarahkan ke halaman edit
  const handleEdit = (id: number) => {
    router.push(`/notes/edit/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <h3 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
        Semua Catatan
      </h3>

      {notes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Tidak ada catatan yang tersedia.
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => router.push(`/catatan/${note.id}`)} // Navigasi ke detail catatan
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {note.title}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Mencegah navigasi ke detail
                      handleEdit(note.id);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Mencegah navigasi ke detail
                      handleDelete(note.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashBinIcon />
                  </button>
                </div>
              </div>
              {/* Gunakan komponen kustom untuk menambahkan class */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400" {...props} />
                  ),
                }}
              >
                {note.content}
              </ReactMarkdown>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Status: {note.archived ? "Diarsipkan" : "Tidak Diarsipkan"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}