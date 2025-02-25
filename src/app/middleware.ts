import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Access denied. No token provided." },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Tambahkan data user ke request
    (request as any).user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 400 }
    );
  }
}