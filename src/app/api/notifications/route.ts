import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all notifications
export async function GET() {
  try {
    // Ambil semua notifikasi dari database, diurutkan berdasarkan createdAt (terbaru dulu)
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Kembalikan respons JSON dengan data notifikasi
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    // Tangani error jika terjadi kesalahan
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST: Create a new notification
export async function POST(request: Request) {
  try {
    // Parse body dari request
    const { message, type } = await request.json();

    // Validasi input
    if (!message || !type) {
      return NextResponse.json(
        { error: "Message and type are required" },
        { status: 400 }
      );
    }

    // Buat notifikasi baru di database
    const newNotification = await prisma.notification.create({
      data: {
        message,
        type,
      },
    });

    // Kembalikan respons JSON dengan notifikasi yang baru dibuat
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    // Tangani error jika terjadi kesalahan
    console.error("Failed to create notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}