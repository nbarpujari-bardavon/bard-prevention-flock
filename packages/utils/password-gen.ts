import { nanoid } from "./nanoid";
export async function generateSecureRandomPassword(
  length: number
): Promise<string> {
  // password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const policyPadding = "0aA!";
  return nanoid(length) + policyPadding;
}
