import { type InferInsertModel, eq } from "drizzle-orm";
import { type PgTableWithColumns } from "drizzle-orm/pg-core";
import { db } from "..";
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

  async save(values: InferInsertModel<T>) {
    return safeAsync(
      db.insert(this.table).values(values).returning(),
      "Error saving activation request"
    );
  }

  async update(id: string, values: Partial<InferInsertModel<T>>) {
    const record = await safeAsync(
      this.findById(id),
      "Activation request not found"
    );
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
      "Error updating activation request"
    );
  }
}
