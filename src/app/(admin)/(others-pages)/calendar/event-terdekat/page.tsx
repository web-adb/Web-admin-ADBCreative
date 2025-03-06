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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

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

  // Data untuk card grafik
  const eventLevelData = [
    { name: "High", value: events.filter((e) => e.level === "High").length },
    { name: "Medium", value: events.filter((e) => e.level === "Medium").length },
    { name: "Low", value: events.filter((e) => e.level === "Low").length },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"]; // Warna untuk pie chart

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
              content={(props: TooltipProps<ValueType, NameType>) => {
                const { payload } = props;
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

      {/* 4 Card dengan Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Pie Chart Tingkat Event */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 dark:text-white">Tingkat Event</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={eventLevelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {eventLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Card 2: Line Chart Durasi Event */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 dark:text-white">Durasi Event</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalDuration"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Card 3: Bar Chart Jumlah Event per Bulan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 dark:text-white">Event per Bulan</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip />
              <Bar dataKey="totalDuration" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card 4: Statistik Event */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 dark:text-white">Statistik Event</h4>
          <div className="space-y-2">
            <p className="text-sm dark:text-gray-300">
              Total Event: <span className="font-bold">{events.length}</span>
            </p>
            <p className="text-sm dark:text-gray-300">
              Event Mendatang:{" "}
              <span className="font-bold">
                {events.filter((e) => new Date(e.startDate) > new Date()).length}
              </span>
            </p>
            <p className="text-sm dark:text-gray-300">
              Event Berlangsung:{" "}
              <span className="font-bold">
                {
                  events.filter(
                    (e) =>
                      new Date(e.startDate) <= new Date() &&
                      new Date(e.endDate) >= new Date()
                  ).length
                }
              </span>
            </p>
          </div>
        </div>
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
                    {new Date(event.startDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 px-4 border-b dark:border-gray-600">
                    {new Date(event.endDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 px-4 border-b dark:border-gray-600">
                    {duration.toFixed(2)} hari
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