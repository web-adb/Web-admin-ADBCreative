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

  // Fetch data transaksi dari API
  useEffect(() => {
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

    fetchTransactions();
  }, []);

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}