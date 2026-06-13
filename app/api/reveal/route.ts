import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  try {
    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    await client.query(`
      INSERT INTO reveal_state (dad_revealed, mom_revealed)
      SELECT false, false
      WHERE NOT EXISTS (SELECT 1 FROM reveal_state);
    `);

    const result = await client.query('SELECT dad_revealed, mom_revealed FROM reveal_state LIMIT 1');
    const row = result?.rows?.[0] ?? { dad_revealed: false, mom_revealed: false };

    if (typeof client.end === 'function') await client.end();

    return NextResponse.json({ ok: true, dadRevealed: row.dad_revealed, momRevealed: row.mom_revealed });
  } catch (err) {
    console.error('Reveal state load error', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  const data = await req.json();
  const who = data?.who;
  if (who !== 'dad' && who !== 'mom') {
    return NextResponse.json({ error: 'Invalid reveal target' }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    // Verify session is valid
    const authResult = await client.query(
      `SELECT u.id FROM users u
       INNER JOIN sessions s ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > now()`,
      [sessionToken]
    );

    if (!authResult?.rows?.length) {
      if (typeof client.end === 'function') await client.end();
      return NextResponse.json({ error: 'Session expired or invalid' }, { status: 401 });
    }

    await client.query(`
      INSERT INTO reveal_state (dad_revealed, mom_revealed)
      SELECT false, false
      WHERE NOT EXISTS (SELECT 1 FROM reveal_state);
    `);

    const updateQuery =
      who === 'dad'
        ? 'UPDATE reveal_state SET dad_revealed = true WHERE true RETURNING dad_revealed, mom_revealed'
        : 'UPDATE reveal_state SET mom_revealed = true WHERE true RETURNING dad_revealed, mom_revealed';

    const result = await client.query(updateQuery);
    const row = result?.rows?.[0] ?? { dad_revealed: who === 'dad', mom_revealed: who === 'mom' };

    if (typeof client.end === 'function') await client.end();

    return NextResponse.json({ ok: true, dadRevealed: row.dad_revealed, momRevealed: row.mom_revealed });
  } catch (err) {
    console.error('Reveal update error', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

