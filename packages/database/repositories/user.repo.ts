import { eq, type InferInsertModel } from "drizzle-orm";
import { users } from "../schema";
import { BaseRepo } from "./base.repo";
import { db } from "..";
import { Err } from "@repo/utils/safe-exec";

export class UserRepo extends BaseRepo<typeof users> {
  constructor() {
    super(users);
  }

  async findByEmail(email: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user[0];
  }

  /**
   * Create a new user
   * @param values
   * @returns
   */
  async createUser(values: InferInsertModel<typeof users>) {
    const user = await this.findByEmail(values.email);
    if (user) {
      return Err("user_already_exists");
    }
    return await this._save(values);
  }
}
