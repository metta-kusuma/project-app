export function extractBearerToken(headers: Record<string, string | undefined>): string {
  const authHeader = headers["authorization"] || headers["Authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    throw new Error("Unauthorized");
  }

  return token;
}
