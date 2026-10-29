import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";
import { authRoute } from "./routes/auth-route";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({
    message: "Welcome to Elysia + Bun + Drizzle + MySQL API",
  }))
  .use(usersRoute)
  .use(authRoute)
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
