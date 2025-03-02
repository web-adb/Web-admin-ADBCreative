import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Handler untuk GET request
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// Handler untuk POST request
export async function POST(request: Request) {
  try {
    const { userInput, aiResponse } = await request.json();

    const conversation = await prisma.conversation.create({
      data: {
        userInput,
        aiResponse,
      },
    });
    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error saving conversation:", error);
    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    );
  }
}

// Handler untuk DELETE request
export async function DELETE(request: Request) {
  try {
    const { id, type } = await request.json(); // Tambahkan `type` untuk menentukan jenis chat yang dihapus

    if (type === 'user') {
      await prisma.conversation.update({
        where: { id },
        data: { userInput: '' }, // Hapus chat user
      });
    } else if (type === 'ai') {
      await prisma.conversation.update({
        where: { id },
        data: { aiResponse: '' }, // Hapus chat AI
      });
    } else {
      await prisma.conversation.delete({
        where: { id }, // Hapus seluruh percakapan
      });
    }

    return NextResponse.json({ message: "Conversation updated successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}