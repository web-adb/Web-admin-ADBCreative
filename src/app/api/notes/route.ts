import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: "desc", // Urutkan berdasarkan tanggal terbaru
      },
    });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST: Create a new note
export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        archived: false, // Default: belum diarsipkan
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

// PUT: Archive a note
export async function PUT(request: Request) {
  try {
    const { id, archived } = await request.json();

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { archived },
    });

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}