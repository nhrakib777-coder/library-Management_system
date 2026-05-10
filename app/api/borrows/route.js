import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const borrowsPath = path.join(process.cwd(), 'data', 'borrows.json');

const readBorrows = () => JSON.parse(fs.readFileSync(borrowsPath, 'utf8'));
const writeBorrows = (data) => fs.writeFileSync(borrowsPath, JSON.stringify(data, null, 2));

export async function GET() {
  const borrows = readBorrows();
  return NextResponse.json(borrows);
}

export async function POST(req) {
  const newBorrow = await req.json();
  const borrows = readBorrows();
  borrows.push({ id: Date.now().toString(), ...newBorrow });
  writeBorrows(borrows);
  return NextResponse.json({ success: true });
}