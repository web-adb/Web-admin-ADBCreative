"use client";
import React, { useState, useEffect } from "react";

// Definisikan tipe data untuk catatan
interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
}

export default function Catatan() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

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

  // Handle perubahan input pada form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newNote = await response.json();
      setNotes([newNote, ...notes]); // Tambahkan catatan baru ke daftar

      // Reset form
      setFormData({
        title: "",
        content: "",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle toggle arsip catatan
  const handleToggleArchive = async (id: number, archived: boolean) => {
    try {
      const response = await fetch(`/api/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, archived: !archived }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedNote = await response.json();

      // Perbarui daftar catatan
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id ? { ...note, archived: updatedNote.archived } : note
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Tampilkan loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Tampilkan error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
        Catatan
      </h1>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Judul
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Isi Catatan
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-600 dark:hover:bg-brand-700"
        >
          Buat Catatan
        </button>
      </form>
   </div>
  );
}