import { type InferInsertModel } from "drizzle-orm";
import { users } from "../schema";
import { BaseRepo } from "./base.repo";
import { Err } from "@repo/utils/safe-exec";

export class UserRepo extends BaseRepo<typeof users> {
  constructor() {
    super(users);
  }

  /**
   * Create a new user
   * @param values
   * @returns
   */
  async createUser(values: InferInsertModel<typeof users>) {
    const result = await this._save(values);
    if (!result.success) {
      if (result.error === "unique_violation") {
        return Err("user_already_exists", result.originalError);
      }
    }

    return result;
  }
}
