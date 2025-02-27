"use client";
import { useEffect, useState } from "react";

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

  // Fetch data transaksi dari API
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

    fetchTransactions();
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Total Transaksi</h1>

      {/* Card untuk menampilkan total pemasukan, pengeluaran, dan saldo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Total Pemasukan */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-green-700">Total Pemasukan</h2>
          <p className="text-2xl font-bold text-green-900 mt-2">
            Rp {totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Card Total Pengeluaran */}
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-red-700">Total Pengeluaran</h2>
          <p className="text-2xl font-bold text-red-900 mt-2">
            Rp {totalExpense.toLocaleString()}
          </p>
        </div>

        {/* Card Total Saldo */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-700">Total Saldo</h2>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            Rp {totalBalance.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}