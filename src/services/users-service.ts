import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";

export async function registerUser(name: string, email: string, password: string): Promise<string> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return "OK";
}

export async function logoutUser(token: string): Promise<string> {
  const foundSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token));

  if (foundSessions.length === 0) {
    throw new Error("Unauthorized");
  }

  await db.delete(sessions).where(eq(sessions.token, token));

  return "OK";
}
