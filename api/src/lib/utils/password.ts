import { createHash } from "crypto";

export function hashPassword(username: string, password: string) {
  const hash = createHash("sha256");
  hash.update(username + password);
  return hash.digest("hex");
}
