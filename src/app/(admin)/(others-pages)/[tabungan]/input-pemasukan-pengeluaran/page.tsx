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
    <div>
      <PageBreadcrumb pageTitle="Tabungan" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Catatan Pemasukan dan Pengeluaran
          </h3>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Jenis
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Jumlah
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deskripsi
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-600 dark:hover:bg-brand-700"
            >
              Tambah Catatan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}