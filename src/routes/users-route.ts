import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-service";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersRoute = new Elysia({ prefix: "/api" })
  .group("/users", (app) =>
    app
      // Get all users
      .get("/", async () => {
        return await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
          })
          .from(users);
      })
      // Get user by ID
      .get("/:id", async ({ params: { id }, set }) => {
        const result = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(eq(users.id, Number(id)));

        if (!result.length) {
          set.status = 404;
          return { message: "User not found" };
        }
        return result[0];
      })
      // Register new user
      .post(
        "/",
        async ({ body, set }) => {
          try {
            const result = await registerUser(body.name, body.email, body.password);
            set.status = 200;
            return {
              data: result,
            };
          } catch (err: any) {
            set.status = 400;
            return {
              error: err.message || "Gagal registrasi user",
            };
          }
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
          }),
        }
      )
      // Delete user by ID
      .delete("/:id", async ({ params: { id } }) => {
        await db.delete(users).where(eq(users.id, Number(id)));
        return { message: "User deleted successfully" };
      })
  );
