import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ** Handle GET request - Fetch semua event **
export async function GET() {
  try {
    const { data, error } = await supabase.from("Event").select("*");

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: "Failed to fetch event", error: error.message }, { status: 500 });
  }
}

// ** Handle POST request - Tambah event baru **
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, startDate, endDate, level } = body;

    const { data, error } = await supabase.from("event").insert([{ title, startDate, endDate, level }]);
    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Event created successfully", data }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: "Failed to create event", error: error.message }, { status: 500 });
  }
}

// ** Handle PUT request - Update event **
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updatedEvent } = body;

    const { data, error } = await supabase.from("event").update(updatedEvent).eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Event updated successfully", data }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: "Failed to update event", error: error.message }, { status: 500 });
  }
}

// ** Handle DELETE request - Hapus event **
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    const { error } = await supabase.from("event").delete().eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: "Failed to delete event", error: error.message }, { status: 500 });
  }
}
