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

  try {
    const { Client } = await import('pg');
    return new Client({ connectionString: process.env.DATABASE_URL });
  } catch {
    throw new Error('No suitable DB client found. Install @neondatabase/serverless or pg.');
  }
}

export async function GET() {
  try {
    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    const res = await client.query('SELECT id, name FROM users WHERE signed_in = true LIMIT 1');
    const row = res?.rows?.[0] ?? null;

    if (typeof client.end === 'function') await client.end();
    if (!row) return NextResponse.json({ ok: true, signedIn: false });

    return NextResponse.json({ ok: true, signedIn: true, name: row.name });
  } catch (err) {
    console.error('Auth status error', err);
    return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const password = typeof data.password === 'string' ? data.password : '';

  if (!name || !password) {
    return NextResponse.json({ ok: false, error: 'Name and password are required' }, { status: 400 });
  }

  try {
    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    const result = await client.query('SELECT id FROM users WHERE name = $1 AND password = $2 LIMIT 1', [name, password]);
    if (result?.rows?.length === 0) {
      if (typeof client.end === 'function') await client.end();
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    await client.query('UPDATE users SET signed_in = false');
    await client.query('UPDATE users SET signed_in = true WHERE id = $1', [result.rows[0].id]);

    if (typeof client.end === 'function') await client.end();
    return NextResponse.json({ ok: true, signedIn: true, name });
  } catch (err) {
    console.error('Sign in error', err);
    return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    await client.query('UPDATE users SET signed_in = false');
    if (typeof client.end === 'function') await client.end();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Sign out error', err);
    return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
  }
}
