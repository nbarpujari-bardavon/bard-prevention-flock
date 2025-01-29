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
    const result = await userRepo.createUser({
      email,
      first_name,
      last_name,
      status: "pending",
    });

    if (result.success) {
      console.log("User created successfully", result.value);
      return;
    }

    console.error("Failed to create user", result.error, result.originalError);
  }
}
