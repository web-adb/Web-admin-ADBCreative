import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/team
export async function GET() {
  try {
    const teams = await prisma.team.findMany();
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/team
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileImage, name, major, teamDivision, status } = body;

    // Validasi semua field harus diisi
    if (!profileImage || !name || !major || !teamDivision || !status) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Membuat data baru di database
    const newTeam = await prisma.team.create({
      data: {
        profileImage,
        name,
        major,
        teamDivision,
        status,
      },
    });

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/team
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Ambil ID dari query parameter
    const body = await request.json();
    const { profileImage, name, major, teamDivision, status } = body;

    // Validasi ID harus ada
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Update data di database berdasarkan ID
    const updatedTeam = await prisma.team.update({
      where: { id: Number(id) },
      data: {
        profileImage,
        name,
        major,
        teamDivision,
        status,
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/team
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Ambil ID dari query parameter

    // Validasi ID harus ada
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Hapus data di database berdasarkan ID
    await prisma.team.delete({
      where: { id: Number(id) },
    });

    return new NextResponse(null, { status: 204 }); // Respon sukses tanpa konten
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}