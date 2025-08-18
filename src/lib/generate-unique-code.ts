import crypto from "crypto";

// Generate a unique ID
export function generateUniqueCode(length = 8) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}
