import { Elysia, t } from "elysia";
import { loginUser, getCurrentUser } from "../services/auth-service";

export const authRoute = new Elysia({ prefix: "/api" })
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const token = await loginUser(body.email, body.password);
        set.status = 200;
        return {
          data: token,
        };
      } catch (err: any) {
        set.status = 400;
        return {
          error: err.message || "Email atau Password salah",
        };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get("/login/current", async ({ headers, set }) => {
    const authHeader = headers["authorization"] || headers["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      return {
        error: "Unauthorized",
      };
    }

    const token = authHeader.slice(7).trim();

    try {
      const user = await getCurrentUser(token);
      set.status = 200;
      return {
        data: user,
      };
    } catch {
      set.status = 401;
      return {
        error: "Unauthorized",
      };
    }
  });
