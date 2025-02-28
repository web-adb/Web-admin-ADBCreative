'use client'
import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FaWallet, FaMoneyBillWave, FaClipboard, FaCalendarAlt } from "react-icons/fa";

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
}

export default function Pemasukan() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
          amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newTransaction = await response.json();
      setTransactions([newTransaction, ...transactions]);

      // Send notification
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `New transaction added: ${formData.description}`,
          type: "transaction",
        }),
      });

      setFormData({
        type: "income",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

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
          {/* Form Input */}
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-8 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Jenis Transaksi */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Transaksi
                </label>
                <div className="relative">
                  <FaWallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>
              </div>

              {/* Jumlah */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jumlah
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Masukkan jumlah"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi
                </label>
                <div className="relative">
                  <FaClipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Tanggal */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
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
            <p className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">
              Catatan berhasil ditambahkan!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}