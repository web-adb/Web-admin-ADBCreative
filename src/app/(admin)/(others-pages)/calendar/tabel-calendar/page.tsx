"use client";
import React, { useState, useEffect } from "react";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  level: string;
}

export default function EventCalendarTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data event dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Urutkan event berdasarkan tanggal terdekat
        const sortedEvents = data.sort(
          (a: Event, b: Event) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        setEvents(sortedEvents);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fungsi untuk mengelompokkan event berdasarkan bulan
  const groupEventsByMonth = (events: Event[]) => {
    const groupedEvents: { [key: string]: Event[] } = {};

    events.forEach((event) => {
      const monthYear = new Date(event.startDate).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });

      if (!groupedEvents[monthYear]) {
        groupedEvents[monthYear] = [];
      }

      groupedEvents[monthYear].push(event);
    });

    return groupedEvents;
  };

  // Fungsi untuk menghasilkan warna unik berdasarkan nama bulan
  const getUniqueColor = (monthYear: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
    ];

    // Hash sederhana untuk memilih warna berdasarkan nama bulan
    const hash = monthYear.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % colors.length;

    return colors[index];
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Kelompokkan event berdasarkan bulan
  const groupedEvents = groupEventsByMonth(events);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <h3 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
        Kalender Event
      </h3>

      {Object.keys(groupedEvents).map((monthYear) => {
        const colorClass = getUniqueColor(monthYear); // Dapatkan warna unik untuk bulan ini

        return (
          <div key={monthYear} className="mb-8">
            <div className="flex items-center mb-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colorClass}`}
              >
                {monthYear}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tanggal Mulai
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tanggal Berakhir
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tingkat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {groupedEvents[monthYear].map((event) => (
                    <tr key={event.id}>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                        {event.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                        {new Date(event.startDate).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                        {new Date(event.endDate).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            event.level === "High"
                              ? "bg-red-100 text-red-800"
                              : event.level === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {event.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}