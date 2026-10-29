import { Elysia, t } from "elysia";
import { loginUser, getCurrentUser } from "../services/auth-service";
import { extractBearerToken } from "../middlewares/auth-middleware";

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
    try {
      const token = extractBearerToken(headers);
      const user = await getCurrentUser(token);
      set.status = 200;
      return {
        data: user,
      };
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        set.status = 401;
        return {
          error: "Unauthorized",
        };
      }
      set.status = 500;
      return {
        error: "Internal Server Error",
      };
    }
  });
