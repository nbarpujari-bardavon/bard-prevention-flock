import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db: NodePgDatabase<typeof schema> = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  },
  schema,
});
