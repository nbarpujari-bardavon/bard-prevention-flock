import { UserRepo } from "@repo/database/repos";
import { Ok } from "../../utils/safe-exec.js";

export class SignUpUseCase {
  async createUser(
    email: string,
    first_name: string,
    last_name: string,
    password: string
  ) {
    const userRepo = new UserRepo();
    return await userRepo.createUser({
      email,
      first_name,
      last_name,
      status: "pending",
    });
  }
}
