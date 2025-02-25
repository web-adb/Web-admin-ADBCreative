import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validasi input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}