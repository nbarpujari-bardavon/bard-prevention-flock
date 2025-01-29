import { sql } from "drizzle-orm";
import { boolean } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  email: text("email").notNull().unique(),
  external_id: text("external_id"),
  first_name: text("first_name"),
  last_name: text("last_name"),
  status: text("status"),
  email_verified: boolean("email_verified").notNull().default(false),
  auto_generated_email: text("auto_generated_email"),
  personnel_number: text("personnel_number"),
  pin_login_enabled: boolean("pin_login_enabled").notNull().default(false),
  user_name_slug: text("user_name_slug"),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});
