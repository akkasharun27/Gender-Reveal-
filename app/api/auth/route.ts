import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConfig from "../../../lib/db-config";

const { getDatabaseConnectionString } = dbConfig as {
  getDatabaseConnectionString: (value?: string | null) => string | undefined;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function getClient() {
  const connectionString = getDatabaseConnectionString(process.env.DATABASE_URL);
  try {
    const neon = await import('@neondatabase/serverless');
    if (typeof (neon as any).createClient === 'function') {
      return (neon as any).createClient({ connectionString });
    }
    if ((neon as any).default && typeof (neon as any).default.createClient === 'function') {
      return (neon as any).default.createClient({ connectionString });
    }
  } catch {
    // ignore
  }

  try {
    const { Client } = await import('pg');
    return new Client({ connectionString });
  } catch {
    throw new Error('No suitable DB client found. Install @neondatabase/serverless or pg.');
  }
}

function generateToken(): string {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ ok: true, signedIn: false });
    }

    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    const res = await client.query(
      `SELECT u.id, u.name, u.user_role FROM users u
       INNER JOIN sessions s ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > now()`,
      [sessionToken]
    );
    const row = res?.rows?.[0] ?? null;

    if (typeof client.end === 'function') await client.end();
    if (!row) return NextResponse.json({ ok: true, signedIn: false });

    return NextResponse.json({ ok: true, signedIn: true, name: row.name, role: row.user_role ?? 'guest' });
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

    // Verify credentials
    const result = await client.query('SELECT id, user_role FROM users WHERE name = $1 AND password = $2 LIMIT 1', [name, password]);
    if (result?.rows?.length === 0) {
      if (typeof client.end === 'function') await client.end();
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const userId = result.rows[0].id;
    const role = result.rows[0].user_role ?? 'guest';
    const token = generateToken();

    // Create session
    await client.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, now() + interval \'30 days\')',
      [userId, token]
    );

    if (typeof client.end === 'function') await client.end();

    const response = NextResponse.json({ ok: true, signedIn: true, name, role });
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Sign in error', err);
    return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ ok: true });
    }

    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    // Delete session
    await client.query('DELETE FROM sessions WHERE token = $1', [sessionToken]);
    if (typeof client.end === 'function') await client.end();

    const response = NextResponse.json({ ok: true });
    const store = await cookies();
    store.delete('session_token');

    return response;
  } catch (err) {
    console.error('Sign out error', err);
    return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
  }
}

