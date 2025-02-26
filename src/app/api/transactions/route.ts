import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all transactions
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: "desc", // Urutkan berdasarkan tanggal terbaru
      },
    });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST: Create a new transaction
export async function POST(request: Request) {
  try {
    const { type, amount, description, date } = await request.json();

    const newTransaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount), // Pastikan amount adalah number
        description,
        date: new Date(date), // Konversi ke format Date
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a transaction by ID
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // Ambil ID dari body request

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Hapus transaksi dari database
    await prisma.transaction.delete({
      where: {
        id: parseInt(id), // Konversi ID ke number
      },
    });

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}