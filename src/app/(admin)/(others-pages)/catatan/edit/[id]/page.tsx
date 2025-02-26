"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditNote({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`/api/notes/${params.id}`);
      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
    };

    fetchNote();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/notes/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      router.push("/notes");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Edit Catatan</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Konten"
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}