import { type InferInsertModel, eq } from "drizzle-orm";
import { type PgTableWithColumns } from "drizzle-orm/pg-core";
import { db } from "..";
import pg from "pg";
import { Err, safeAsync } from "@repo/utils/safe-exec";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDrizzleSchema = any;
export class BaseRepo<T extends PgTableWithColumns<AnyDrizzleSchema>> {
  private table: T;
  constructor(table: T) {
    this.table = table;
  }
  async beginTransaction() {
    return db.execute("BEGIN");
  }

  async commitTransaction() {
    return db.execute("COMMIT");
  }

  async rollbackTransaction() {
    return db.execute("ROLLBACK");
  }

  async findById(id: string) {
    const activationRequest = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);

    return activationRequest[0];
  }

  protected async _save(values: InferInsertModel<T>) {
    const result = await safeAsync(
      db.insert(this.table).values(values).returning(),
      "db_save_failed"
    );

    if (result.success) {
      return result;
    }

    if (result.originalError instanceof pg.DatabaseError) {
      return Err(
        PgErrorCodes[result.originalError.code || ""] || "db_save_failed",
        result.originalError
      );
    }

    return result;
  }

  protected async _update(id: string, values: Partial<InferInsertModel<T>>) {
    const record = await safeAsync(this.findById(id), "record_not_found");
    if (!record.success) {
      return Err(record.error, record.originalError);
    }
    const merged = {
      ...record,
      ...values,
      id,
    };

    return await safeAsync(
      db
        .update(this.table)
        .set(merged)
        .where(eq(this.table.id, id))
        .returning(),
      "db_update_failed"
    );
  }
}

const PgErrorCodes: { [code: string]: string } = {
  "23505": "unique_violation",
  "23503": "foreign_key_violation",
  "23502": "not_null_violation",
  "23514": "check_violation",
};
