import { Elysia, t } from "elysia";
import { loginUser } from "../services/auth-service";

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
  );
