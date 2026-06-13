import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function getClient() {
  try {
    const neon = await import('@neondatabase/serverless');
    if (typeof (neon as any).createClient === 'function') {
      return (neon as any).createClient({ connectionString: process.env.DATABASE_URL });
    }
    if ((neon as any).default && typeof (neon as any).default.createClient === 'function') {
      return (neon as any).default.createClient({ connectionString: process.env.DATABASE_URL });
    }
  } catch {
    // ignore
  }

  // fallback to pg
  try {
    const { Client } = await import('pg');
    return new Client({ connectionString: process.env.DATABASE_URL });
  } catch {
    throw new Error('No suitable DB client found. Install @neondatabase/serverless or pg.');
  }
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  try {
    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    const countRes = await client.query('SELECT COUNT(*)::int AS total FROM wishes');
    const total = countRes?.rows?.[0]?.total ?? 0;

    if (typeof client.end === 'function') await client.end();

    return NextResponse.json({ ok: true, total });
  } catch (err) {
    console.error('DB count error', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  const data = await req.json();
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const gender = typeof data.gender === 'string' ? data.gender.trim() : '';
  const prayer = typeof data.prayer === 'string' ? data.prayer.trim() : '';

  // Server-side validation
  const errors: Record<string, string> = {};
  if (!gender || (gender !== 'boy' && gender !== 'girl')) {
    errors.gender = 'Please select Boy or Girl.';
  }
  if (name && name.length > 100) errors.name = 'Name is too long (max 100 characters).';
  if (prayer && prayer.length > 1000) errors.prayer = 'Prayer is too long (max 1000 characters).';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  try {
    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    const text = 'INSERT INTO wishes(name, gender, prayer) VALUES($1, $2, $3) RETURNING id, created_at';
    const values: any[] = [name || null, gender, prayer || null];

    const res = await client.query(text, values);

    // get new total count
    const countRes = await client.query('SELECT COUNT(*)::int AS total FROM wishes');
    const total = countRes?.rows?.[0]?.total ?? null;

    if (typeof client.end === 'function') await client.end();

    return NextResponse.json({ ok: true, row: res?.rows?.[0] ?? null, total });
  } catch (err) {
    console.error('DB insert error', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
