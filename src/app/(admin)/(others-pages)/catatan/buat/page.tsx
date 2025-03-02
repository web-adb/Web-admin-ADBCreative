"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaMagic, FaSpinner, FaUndo, FaHistory, FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Catatan() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [originalContent, setOriginalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState<"summarize" | "format" | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const router = useRouter();

  // Inisialisasi Gemini
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

  // Handle perubahan input pada form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fungsi untuk menyimpan catatan ke database notes
  const saveNote = async (title: string, content: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const data = await response.json();
      console.log("Note saved:", data);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Fungsi untuk meringkas teks dengan AI
  const handleSummarize = async () => {
    setIsLoading(true);
    setIsModalLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Ringkas teks berikut dengan jelas dan padat:\n\n${formData.content}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Simpan teks asli sebelum diubah
      if (!originalContent) {
        setOriginalContent(formData.content);
      }

      // Update isi catatan dengan hasil ringkasan
      setFormData((prev) => ({
        ...prev,
        content: text,
      }));

      // Simpan ke database notes
      await saveNote(formData.title, text);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      alert("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsLoading(false);
      setIsModalLoading(false);
      setShowConfirmationModal(false);
    }
  };

  // Fungsi untuk merapikan teks dengan AI
  const handleFormatText = async () => {
    setIsLoading(true);
    setIsModalLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Perbaiki dan rapikan teks berikut dengan struktur yang jelas:\n\n${formData.content}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Simpan teks asli sebelum diubah
      if (!originalContent) {
        setOriginalContent(formData.content);
      }

      // Update isi catatan dengan hasil yang lebih rapi
      setFormData((prev) => ({
        ...prev,
        content: text,
      }));

      // Simpan ke database notes
      await saveNote(formData.title, text);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      alert("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsLoading(false);
      setIsModalLoading(false);
      setShowConfirmationModal(false);
    }
  };

  // Fungsi untuk mengembalikan teks ke keadaan semula
  const handleRevert = () => {
    setFormData((prev) => ({
      ...prev,
      content: originalContent,
    }));
    setOriginalContent("");
  };

  // Fungsi untuk menampilkan modal konfirmasi
  const handleConfirmation = (type: "summarize" | "format") => {
    setActionType(type);
    setShowConfirmationModal(true);
  };

  // Fungsi untuk menjalankan aksi setelah konfirmasi
  const handleConfirmAction = () => {
    if (actionType === "summarize") {
      handleSummarize();
    } else if (actionType === "format") {
      handleFormatText();
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
        Catatan
      </h1>

      {/* Form Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Catatan berhasil disimpan!");
        }}
        className="mb-8"
      >
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
            rows={8}
            required
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleConfirmation("summarize")}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>
                <FaMagic />
                Ringkas dengan AI
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleConfirmation("format")}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>
                <FaMagic />
                Rapikan dengan AI
              </>
            )}
          </button>

          {/* Tombol Kembalikan Catatan */}
          {originalContent && (
            <button
              type="button"
              onClick={handleRevert}
              className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <FaUndo />
              Kembalikan Catatan
            </button>
          )}

          {/* Tombol Lihat Log */}
          <button
            type="button"
            onClick={() => router.push("/log")}
            className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <FaHistory />
            Lihat Log
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-600 dark:hover:bg-brand-700"
        >
          Simpan Catatan
        </button>
      </form>

      {/* Modal Konfirmasi */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaMagic />
              Apakah Anda yakin ingin{" "}
              {actionType === "summarize" ? "meringkas" : "merapikan"} catatan ini?
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmAction}
                disabled={isModalLoading}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isModalLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaCheck />
                    Ya
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirmationModal(false)}
                disabled={isModalLoading}
                className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
              >
                <FaTimes />
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}