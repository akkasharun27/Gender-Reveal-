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

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  try {
    const clientObj = await getClient();
    const client = clientObj as any;
    if (typeof client.connect === 'function') await client.connect();

    // Ensure flags exist in the `constants` table. Use 'no' as default.
    await client.query(
      `INSERT INTO constants (name, value)
         SELECT 'dad_revelead', 'no'
         WHERE NOT EXISTS (SELECT 1 FROM constants WHERE name = 'dad_revelead');`
    );
    await client.query(
      `INSERT INTO constants (name, value)
         SELECT 'mom_revelead', 'no'
         WHERE NOT EXISTS (SELECT 1 FROM constants WHERE name = 'mom_revelead');`
    );

    const result = await client.query(
      `SELECT name, value FROM constants WHERE name IN ('dad_revelead','mom_revelead','gender')`
    );
    const rows = result?.rows ?? [];
    const map: Record<string, string> = {};
    for (const r of rows) map[r.name] = r.value;
    const row = {
      dad_revealed: map['dad_revelead'] === 'yes',
      mom_revealed: map['mom_revelead'] === 'yes',
      gender: map['gender'] === 'boy' || map['gender'] === 'girl' ? map['gender'] : null,
    };

    if (typeof client.end === 'function') await client.end();

    return NextResponse.json({ ok: true, dadRevealed: row.dad_revealed, momRevealed: row.mom_revealed, gender: row.gender });
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
      `SELECT u.id, u.user_role FROM users u
       INNER JOIN sessions s ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > now()`,
      [sessionToken]
    );

    if (!authResult?.rows?.length) {
      if (typeof client.end === 'function') await client.end();
      return NextResponse.json({ error: 'Session expired or invalid' }, { status: 401 });
    }

    const userRole = authResult.rows[0].user_role ?? 'guest';
    if ((who === 'dad' && userRole !== 'dad') || (who === 'mom' && userRole !== 'mom')) {
      if (typeof client.end === 'function') await client.end();
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure the flag rows exist
    await client.query(
      `INSERT INTO constants (name, value)
         SELECT 'dad_revelead', 'no'
         WHERE NOT EXISTS (SELECT 1 FROM constants WHERE name = 'dad_revelead');`
    );
    await client.query(
      `INSERT INTO constants (name, value)
         SELECT 'mom_revelead', 'no'
         WHERE NOT EXISTS (SELECT 1 FROM constants WHERE name = 'mom_revelead');`
    );

    const updateQuery =
      who === 'dad'
        ? "UPDATE constants SET value = 'yes' WHERE name = 'dad_revelead' RETURNING name, value"
        : "UPDATE constants SET value = 'yes' WHERE name = 'mom_revelead' RETURNING name, value";

    await client.query(updateQuery);

    const result = await client.query(`SELECT name, value FROM constants WHERE name IN ('dad_revelead','mom_revelead','gender')`);
    const rows = result?.rows ?? [];
    const map: Record<string, string> = {};
    for (const r of rows) map[r.name] = r.value;
    const row = {
      dad_revealed: map['dad_revelead'] === 'yes',
      mom_revealed: map['mom_revelead'] === 'yes',
      gender: map['gender'] === 'boy' || map['gender'] === 'girl' ? map['gender'] : null,
    };

    if (typeof client.end === 'function') await client.end();

    return NextResponse.json({ ok: true, dadRevealed: row.dad_revealed, momRevealed: row.mom_revealed, gender: row.gender });
  } catch (err) {
    console.error('Reveal update error', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

