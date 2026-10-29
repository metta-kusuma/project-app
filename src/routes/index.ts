import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const routes = new Elysia({ prefix: "/api" })
  .group("/users", (app) =>
    app
      // Get all users
      .get("/", async () => {
        return await db.select().from(users);
      })
      // Get user by ID
      .get("/:id", async ({ params: { id }, set }) => {
        const result = await db.select().from(users).where(eq(users.id, Number(id)));
        if (!result.length) {
          set.status = 404;
          return { message: "User not found" };
        }
        return result[0];
      })
      // Create a new user
      .post(
        "/",
        async ({ body, set }) => {
          await db.insert(users).values({
            name: body.name,
            email: body.email,
          });
          set.status = 201;
          return { message: "User created successfully" };
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String(),
          }),
        }
      )
      // Delete user by ID
      .delete("/:id", async ({ params: { id } }) => {
        await db.delete(users).where(eq(users.id, Number(id)));
        return { message: "User deleted successfully" };
      })
  );
