import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase.from('Team').select('*');
  if (data) {}
  if (error) {
    return NextResponse.json({ message: 'Error fetching team members', error }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
