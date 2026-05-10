import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const booksPath = path.join(process.cwd(), 'data', 'books.json');

// Read JSON helper
const readBooks = () => JSON.parse(fs.readFileSync(booksPath, 'utf8'));
// Write JSON helper
const writeBooks = (data) => fs.writeFileSync(booksPath, JSON.stringify(data, null, 2));

// GET all books
export async function GET() {
  const books = readBooks();
  return NextResponse.json(books);
}

// POST add new book
export async function POST(req) {
  const newBook = await req.json();
  const books = readBooks();
  books.push({ id: Date.now().toString(), ...newBook });
  writeBooks(books);
  return NextResponse.json({ success: true });
}

// PUT update book
export async function PUT(req) {
  const { id, updatedData } = await req.json();
  let books = readBooks();
  books = books.map(b => b.id === id ? {...b, ...updatedData} : b);
  writeBooks(books);
  return NextResponse.json({ success: true });
}

// DELETE book
export async function DELETE(req) {
  const { id } = await req.json();
  let books = readBooks();
  books = books.filter(b => b.id !== id);
  writeBooks(books);
  return NextResponse.json({ success: true });
}