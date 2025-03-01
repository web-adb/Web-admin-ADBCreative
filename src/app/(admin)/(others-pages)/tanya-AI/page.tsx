"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

export default function TanyaAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; formattedText?: JSX.Element }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Inisialisasi Gemini
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Tambahkan pesan pengguna ke history chat
      setMessages((prev) => [...prev, { text: input, isUser: true }]);
      setInput("");
      setIsLoading(true);

      try {
        // Gunakan model 'gemini-2.0-flash'
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(input);
        const response = await result.response;
        const text = response.text();

        // Format respons AI
        const formattedText = formatResponse(text);

        // Tambahkan respons AI ke history chat
        setMessages((prev) => [...prev, { text, isUser: false, formattedText }]);
      } catch (error) {
        console.error("Error fetching response from Gemini:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Maaf, terjadi kesalahan saat memproses permintaan.",
            isUser: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fungsi untuk memformat respons AI
  const formatResponse = (text: string): JSX.Element => {
    // Pisahkan teks berdasarkan baris baru
    const lines = text.split("\n");

    // Cek apakah ada tabel dalam respons
    const tableLines = lines.filter((line) => line.includes("|"));
    if (tableLines.length > 0) {
      return (
        <div className="space-y-2">
          {renderTable(tableLines)}
          {lines
            .filter((line) => !line.includes("|"))
            .map((line, index) => (
              <p key={index}>{line}</p>
            ))}
        </div>
      );
    }

    // Default: tampilkan teks biasa
    return <p>{text}</p>;
  };

  // Fungsi untuk merender tabel
  const renderTable = (lines: string[]): JSX.Element => {
    // Ambil header dan baris data
    const header = lines[0]
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "");
    const rows = lines.slice(2).map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell !== "")
    );

    return (
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
        <thead>
          <tr>
            {header.map((cell, index) => (
              <th
                key={index}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dark:from-gray-900 dark:to-gray-800 p-3">
      <div className="max-w-6xl mx-auto">
        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Chat History */}
          <div className="h-[400px] overflow-y-auto mb-4 space-y-4 scrollbar-hide">
            {/* Header */}
            {messages.length === 0 && (
              <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-200">
                  Tanya AI
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Tanyakan apa saja, dan AI akan membantu Anda.
                </p>
              </header>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {message.isUser ? (
                    message.text
                  ) : (
                    message.formattedText || message.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Memproses...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-700 flex items-center justify-center w-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}