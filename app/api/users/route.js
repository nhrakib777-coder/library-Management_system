import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const usersPath = path.join(process.cwd(), 'data', 'users.json');

const readUsers = () => JSON.parse(fs.readFileSync(usersPath, 'utf8'));
const writeUsers = (data) => fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));

export async function GET() {
  const users = readUsers();
  return NextResponse.json(users);
}

export async function POST(req) {
  const newUser = await req.json();
  const users = readUsers();
  const exists = users.find(u => u.email === newUser.email);
  if(exists) return NextResponse.json({error:"Email already exists"},{status:400});
  
  users.push({ id: Date.now().toString(), ...newUser });
  writeUsers(users);
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  let users = readUsers();
  users = users.filter(u => u.id !== id);
  writeUsers(users);
  return NextResponse.json({ success: true });
}