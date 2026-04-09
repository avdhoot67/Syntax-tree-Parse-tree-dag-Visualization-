import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = getPool();
    if (!pool) {
      // Return from localStorage fallback (handled client-side)
      return NextResponse.json({ items: [], source: 'client' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM analyses ORDER BY created_at DESC LIMIT 50'
    );
    return NextResponse.json({ items: rows, source: 'mysql' });
  } catch {
    return NextResponse.json({ items: [], source: 'client' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const pool = getPool();

    if (!pool) {
      return NextResponse.json({ saved: false, source: 'client' });
    }

    await pool.query(
      `INSERT INTO analyses (expression, tokens, parse_tree, syntax_tree, dag, tac, quadruples, triples, optimized)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.expression,
        JSON.stringify(data.tokens),
        JSON.stringify(data.parseTree),
        JSON.stringify(data.syntaxTree),
        JSON.stringify(data.dag),
        JSON.stringify(data.tac),
        JSON.stringify(data.quadruples),
        JSON.stringify(data.triples),
        JSON.stringify(data.optimization),
      ]
    );

    return NextResponse.json({ saved: true, source: 'mysql' });
  } catch {
    return NextResponse.json({ saved: false, source: 'client' });
  }
}
