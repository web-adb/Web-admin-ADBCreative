"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LineChart, Line } from "recharts"; // Import LineChart dan Line

interface Transaction {
  id: number;
  type: string; // "income" atau "expense"
  amount: number;
  description: string;
  date: string;
}

export default function TransactionsDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cek tema dark mode
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
  }, []);

  // Fetch data transaksi dari API secara berkala
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    // Ambil data pertama kali
    fetchTransactions();

    // Set interval untuk mengambil data setiap 5 detik
    const interval = setInterval(fetchTransactions, 5000);

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, []);

  // Hitung total pemasukan, pengeluaran, dan saldo
  useEffect(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += transaction.amount;
      } else if (transaction.type === "expense") {
        expense += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(income - expense);
  }, [transactions]);

  // Data untuk diagram batang
  const barChartData = [
    { name: "Pemasukan", total: totalIncome },
    { name: "Pengeluaran", total: totalExpense },
  ];

  // Fungsi untuk mendapatkan rentang tanggal (7 hari terakhir)
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString());
    }
    return dates;
  };

  // Filter transaksi untuk 7 hari terakhir
  const last7DaysTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date).toLocaleDateString();
    const last7Days = getLast7Days();
    return last7Days.includes(transactionDate);
  });

  // Kelompokkan transaksi berdasarkan tanggal dan hitung total transaksi per hari
  const groupedTransactions = last7DaysTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString(); // Format tanggal
    if (!acc[date]) {
      acc[date] = 0; // Inisialisasi jika tanggal belum ada
    }
    acc[date] += transaction.amount; // Jumlahkan transaksi untuk tanggal yang sama
    return acc;
  }, {} as Record<string, number>);

  // Format data untuk LineChart (pastikan semua tanggal dalam 7 hari terakhir ada)
  const lineChartData = getLast7Days().map((date) => ({
    name: date, // Tanggal
    total: groupedTransactions[date] || 0, // Total transaksi untuk tanggal tersebut (default 0 jika tidak ada transaksi)
  }));

  // Warna untuk dark mode dan light mode
  const gridColor = isDarkMode ? "#374151" : "#e5e7eb"; // gray-700 untuk dark, gray-200 untuk light
  const axisColor = isDarkMode ? "#9ca3af" : "#6b7280"; // gray-400 untuk dark, gray-500 untuk light
  const barColor = isDarkMode ? "#4f46e5" : "#6366f1"; // indigo-600 untuk dark, indigo-500 untuk light
  const tooltipBgColor = isDarkMode ? "#1f2937" : "#ffffff"; // gray-800 untuk dark, white untuk light
  const tooltipTextColor = isDarkMode ? "#f3f4f6" : "#111827"; // gray-100 untuk dark, gray-900 untuk light

  return (
    <div className="p-6 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Total Transaksi</h1>

      {/* Card untuk menampilkan total pemasukan, pengeluaran, dan saldo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Total Pemasukan */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md dark:bg-green-900">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-200">Total Pemasukan</h2>
          <p className="text-2xl font-bold text-green-900 mt-2 dark:text-green-50">
            Rp {totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Card Total Pengeluaran */}
        <div className="bg-red-50 p-6 rounded-lg shadow-md dark:bg-red-900">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-200">Total Pengeluaran</h2>
          <p className="text-2xl font-bold text-red-900 mt-2 dark:text-red-50">
            Rp {totalExpense.toLocaleString()}
          </p>
        </div>

        {/* Card Total Saldo */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md dark:bg-blue-900">
          <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Saldo</h2>
          <p className="text-2xl font-bold text-blue-900 mt-2 dark:text-blue-50">
            Rp {totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Diagram Batang */}
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-gray-200">
          Perbandingan Pemasukan dan Pengeluaran
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBgColor,
                borderColor: gridColor,
                borderRadius: "8px",
                color: tooltipTextColor,
              }}
            />
            <Legend />
            <Bar dataKey="total" fill={barColor} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LineChart */}
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-gray-200">
          Grafik Transaksi Harian (7 Hari Terakhir)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width={600}
            height={300}
            data={lineChartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBgColor,
                borderColor: gridColor,
                borderRadius: "8px",
                color: tooltipTextColor,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}