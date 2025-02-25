"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  level: string;
}

export const EcommerceMetrics = () => {
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [nearestEvent, setNearestEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data anggota dari API /api/team
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/team");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTotalMembers(data.length); // Hitung jumlah anggota
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMembers();
  }, []);

  // Fetch data event dari API /api/event
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const events: Event[] = await response.json();

        // Temukan event terdekat berdasarkan startDate
        const now = new Date();
        const nearest = events
          .filter((event) => new Date(event.startDate) >= now) // Hanya event di masa depan
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]; // Urutkan dan ambil yang terdekat

        setNearestEvent(nearest || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Hitung selisih hari hingga event terdekat
  const calculateDaysUntilEvent = (startDate: string): number => {
    const now = new Date();
    const eventDate = new Date(startDate);
    const timeDifference = eventDate.getTime() - now.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Konversi ke hari
    return daysDifference;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Anggota
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalMembers}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Event Terdekat
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {nearestEvent ? nearestEvent.title : "Tidak ada event"}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {nearestEvent
                ? new Date(nearestEvent.startDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>

          <Badge color={nearestEvent ? "success" : "error"}>
            {nearestEvent ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {nearestEvent
              ? `${calculateDaysUntilEvent(nearestEvent.startDate)} hari lagi`
              : "Tidak Ada"}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};