"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  level: string;
}

interface ChartData {
  month: string;
  totalDuration: number;
}

export default function EventChartPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch data event dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Event[] = await response.json();

        // Filter event yang sudah lewat dari hari ini
        const today = new Date();
        const filteredEvents = data.filter(
          (event) => new Date(event.endDate) >= today
        );

        // Urutkan event berdasarkan tanggal terdekat
        const sortedEvents = filteredEvents
          .sort(
            (a: Event, b: Event) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          .slice(0, 10); // Ambil 10 event terdekat

        setEvents(sortedEvents);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="dark:text-white">Loading...</p>;
  }

  if (error) {
    return <p className="dark:text-white">Error: {error}</p>;
  }

  // Kelompokkan data berdasarkan bulan dan hitung total durasi
  const monthlyData: { [key: string]: number } = {};

  events.forEach((event) => {
    const month = new Date(event.startDate).toLocaleDateString("id-ID", {
      month: "long",
    });
    const duration =
      (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
      (1000 * 60 * 60 * 24);

    if (monthlyData[month]) {
      monthlyData[month] += duration;
    } else {
      monthlyData[month] = duration;
    }
  });

  // Format data untuk chart
  const chartData: ChartData[] = Object.keys(monthlyData).map((month) => ({
    month,
    totalDuration: monthlyData[month],
  }));

  // Warna untuk dark mode dan light mode
  const gridColor = isDarkMode ? "#374151" : "#e5e7eb"; // gray-700 untuk dark, gray-200 untuk light
  const axisColor = isDarkMode ? "#9ca3af" : "#6b7280"; // gray-400 untuk dark, gray-500 untuk light
  const barColor = isDarkMode ? "#4f46e5" : "#6366f1"; // indigo-600 untuk dark, indigo-500 untuk light
  const tooltipBgColor = isDarkMode ? "#1f2937" : "#ffffff"; // gray-800 untuk dark, white untuk light
  const tooltipTextColor = isDarkMode ? "#f3f4f6" : "#111827"; // gray-100 untuk dark, gray-900 untuk light

  // Fungsi untuk membuat badge
  const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}
      >
        {children}
      </span>
    );
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Grafik 10 Event Terdekat</h1>
      <div className="w-full h-[400px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip
              content={({ payload }: { payload: any }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div
                      className="p-2 border rounded shadow"
                      style={{
                        backgroundColor: tooltipBgColor,
                        color: tooltipTextColor,
                      }}
                    >
                      <p className="font-semibold">Bulan: {data.month}</p>
                      <p>Total Durasi: {data.totalDuration} hari</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="totalDuration" fill={barColor} name="Total Durasi (hari)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel Data Event */}
      <h2 className="text-xl font-bold mb-4 dark:text-white">Tabel Data Event</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left">No</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left">Judul Event</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left">Tanggal Mulai</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left">Tanggal Selesai</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left">Durasi (hari)</th>
              <th className="py-3 px-4 border-b dark:border-gray-600 text-left">Level</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => {
              const duration =
                (new Date(event.endDate).getTime() -
                  new Date(event.startDate).getTime()) /
                (1000 * 60 * 60 * 24);

              return (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 border-b dark:border-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 border-b dark:border-gray-600 whitespace-normal">
                    {event.title}
                  </td>
                  <td className="py-3 px-4 border-b dark:border-gray-600">
                    <Badge color="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {new Date(event.startDate).toLocaleDateString("id-ID")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 border-b dark:border-gray-600">
                    <Badge color="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {new Date(event.endDate).toLocaleDateString("id-ID")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 border-b dark:border-gray-600">
                    <Badge color="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                      {duration.toFixed(2)} hari
                    </Badge>
                  </td>
                  <td className="py-3 px-4 border-b dark:border-gray-600">{event.level}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}