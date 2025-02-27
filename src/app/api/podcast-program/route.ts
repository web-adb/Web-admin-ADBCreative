import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.podcastProgram.findMany({
      orderBy: {
        schedule: "asc", // Urutkan berdasarkan jadwal terdekat
      },
    });
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch podcast programs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const { title, schedule, host, source } = await request.json();
  
      const newProgram = await prisma.podcastProgram.create({
        data: {
          title,
          schedule: new Date(schedule), // Konversi ke format DateTime
          host,
          source,
        },
      });
  
      return NextResponse.json(newProgram, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create podcast program" },
        { status: 500 }
      );
    }
  }

  export async function PUT(request: Request) {
    try {
      const { id, title, schedule, host, source } = await request.json();
  
      const updatedProgram = await prisma.podcastProgram.update({
        where: { id },
        data: {
          title,
          schedule: new Date(schedule), // Konversi ke format DateTime
          host,
          source,
        },
      });
  
      return NextResponse.json(updatedProgram, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update podcast program" },
        { status: 500 }
      );
    }
  }

  export async function DELETE(request: Request) {
    try {
      const { id } = await request.json();
  
      await prisma.podcastProgram.delete({
        where: { id },
      });
  
      return NextResponse.json(
        { message: "Podcast program deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete podcast program" },
        { status: 500 }
      );
    }
  }