"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from "react";

// Definisikan tipe data untuk transaksi
interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string; // Format: YYYY-MM-DD
}

export default function Pemasukan() {
  // State untuk menyimpan daftar transaksi
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk form input
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
  });

  // State untuk notifikasi
  const [showNotification, setShowNotification] = useState(false);

  // Fetch data transaksi dari API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Pastikan data sesuai dengan tipe Transaction
        const formattedData = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          amount: parseFloat(item.amount),
          description: item.description,
          date: item.date,
        }));

        setTransactions(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle perubahan input pada form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount), // Konversi ke number
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newTransaction = await response.json();
      setTransactions([newTransaction, ...transactions]); // Tambahkan transaksi baru ke daftar

      // Reset form
      setFormData({
        type: "income",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      // Tampilkan notifikasi
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000); // Sembunyikan notifikasi setelah 3 detik
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tabungan" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-5 py-7 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px]">
          <h3 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white/90 text-center">
            Catatan Pemasukan dan Pengeluaran
          </h3>

          {/* Form Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Jenis
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95"
              >
                Tambah Catatan
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Notifikasi Pop-up di Tengah */}
      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-center animate-fade-in">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
              Catatan berhasil ditambahkan!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}