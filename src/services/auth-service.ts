import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";

export async function loginUser(email: string, password: string): Promise<string> {
  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (foundUsers.length === 0) {
    throw new Error("Email atau Password salah");
  }

  const user = foundUsers[0]!;
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau Password salah");
  }

  const token = crypto.randomUUID();

  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return token;
}

export async function getCurrentUser(token: string) {
  const foundSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token));

  if (foundSessions.length === 0) {
    throw new Error("Unauthorized");
  }

  const session = foundSessions[0]!;
  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));

  if (foundUsers.length === 0) {
    throw new Error("Unauthorized");
  }

  const user = foundUsers[0]!;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt,
  };
}

export async function logoutUser(token: string): Promise<string> {
  const [result] = await db.delete(sessions).where(eq(sessions.token, token));

  if ((result as any).affectedRows === 0) {
    throw new Error("Unauthorized");
  }

  return "OK";
}
