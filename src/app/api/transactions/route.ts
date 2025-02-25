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