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

  // Fetch data event dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Event[] = await response.json();

        // Urutkan event berdasarkan tanggal terdekat
        const sortedEvents = data
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Grafik 10 Event Terdekat</h1>
      <div className="w-full h-[400px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              content={({ payload }: { payload: any }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-gray-200 rounded shadow">
                      <p className="font-semibold">Bulan: {data.month}</p>
                      <p>Total Durasi: {data.totalDuration} hari</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="totalDuration" fill="#8884d8" name="Total Durasi (hari)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel Data Event */}
      <h2 className="text-xl font-bold mb-4">Tabel Data Event</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">Judul Event</th>
              <th className="py-2 px-4 border-b">Tanggal Mulai</th>
              <th className="py-2 px-4 border-b">Tanggal Selesai</th>
              <th className="py-2 px-4 border-b">Durasi (hari)</th>
              <th className="py-2 px-4 border-b">Level</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => {
              const duration =
                (new Date(event.endDate).getTime() -
                  new Date(event.startDate).getTime()) /
                (1000 * 60 * 60 * 24);

              return (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{event.title}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(event.startDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(event.endDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {duration.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">{event.level}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}