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

export default function PemasukanTabel() {
  // State untuk menyimpan daftar transaksi pemasukan
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [selectedId, setSelectedId] = useState<number | null>(null); // State untuk menyimpan ID yang dipilih

  // Fetch data transaksi dari API
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Filter hanya transaksi dengan jenis "income"
      const filteredIncomes = data
        .filter((item: any) => item.type === "income")
        .map((item: any) => ({
          id: item.id,
          type: item.type,
          amount: parseFloat(item.amount),
          description: item.description,
          date: item.date,
        }));

      setIncomes(filteredIncomes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membuka modal konfirmasi
  const openDeleteModal = (id: number) => {
    setSelectedId(id); // Simpan ID yang dipilih
    setShowModal(true); // Tampilkan modal
  };

  // Fungsi untuk menutup modal konfirmasi
  const closeDeleteModal = () => {
    setShowModal(false); // Sembunyikan modal
    setSelectedId(null); // Reset ID yang dipilih
  };

  // Fungsi untuk menghapus transaksi
  const handleDelete = async () => {
    if (!selectedId) return; // Jika tidak ada ID yang dipilih, hentikan proses

    try {
      // Hapus transaksi
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedId }), // Kirim ID transaksi yang akan dihapus
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      // Kirim notifikasi setelah transaksi berhasil dihapus
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Transaksi masuk berhasil dihapus",
          type: "transaction",
        }),
      });

      // Refresh data setelah menghapus
      fetchTransactions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      closeDeleteModal(); // Tutup modal setelah proses selesai
    }
  };

  // Hitung total pemasukan
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);

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
      <PageBreadcrumb pageTitle="Pemasukan" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1200px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Daftar Pemasukan
          </h3>

          {/* Tabel Pemasukan */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {incomes.map((income, index) => (
                  <tr key={income.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {income.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                      + Rp {income.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                      {new Date(income.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openDeleteModal(income.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Pemasukan */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Total Pemasukan:
            </h4>
            <p className="text-2xl font-bold text-green-500">
              Rp {totalIncome.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6">Apakah Anda yakin ingin menghapus transaksi ini?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}