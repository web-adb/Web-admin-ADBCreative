import React from "react";
import prisma from "@/lib/prisma";

interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
}

export default async function NoteDetail({ params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!note) {
    return <p>Catatan tidak ditemukan</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <p className="mt-4">{note.content}</p>
      <p className="mt-4 text-sm text-gray-500">
        Dibuat pada: {new Date(note.createdAt).toLocaleDateString("id-ID")}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Status: {note.archived ? "Diarsipkan" : "Tidak Diarsipkan"}
      </p>
    </div>
  );
}