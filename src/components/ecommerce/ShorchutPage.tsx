"use client";
import React from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUserPlus,
  FaStickyNote,
  FaMoneyBillAlt,
  FaPodcast,
  FaRobot,
  FaBell,
} from "react-icons/fa";


export default function ShortcutPage() {
  const shortcuts = [
    {
      title: "Buat Acara",
      icon: <FaCalendarAlt className="w-12 h-12 text-blue-500" />,
      path: "/calendar",
    },
    {
      title: "Tambah Anggota",
      icon: <FaUserPlus className="w-12 h-12 text-green-500" />,
      path: "/tambah-anggota",
    },
    {
      title: "Buat Catatan",
      icon: <FaStickyNote className="w-12 h-12 text-yellow-500" />,
      path: "/catatan/buat",
    },
    {
      title: "Tambah Tabungan",
      icon: <FaMoneyBillAlt className="w-12 h-12 text-purple-500" />,
      path: "/tabungan/input-pemasukan-pengeluaran",
    },
    {
      title: "Tambah Podcast",
      icon: <FaPodcast className="w-12 h-12 text-pink-500" />,
      path: "/tambah-program",
    },
    {
      title: "Tanya AI",
      icon: <FaRobot className="w-12 h-12 text-teal-500" />,
      path: "/tanya-AI",
    },
    {
        title: "Log Notifikasi",
        icon: <FaBell className="w-12 h-12 text-yellow-500" />,
        path: "/notifications",
      },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 p-6">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Akses Langsung
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Navigasi cepat ke fitur utama
          </p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-7">
        {shortcuts.map((shortcut, index) => (
          <Link
            key={index}
            href={shortcut.path}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg  p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">{shortcut.icon}</div>
            <h2 className="font-semibold text-gray-800 font-semibold dark:text-white">
              {shortcut.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}