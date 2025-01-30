import { UserRepo } from "@repo/database/repos";
import { AwsCognitoService } from "@repo/services/aws-cognito";
import type { Result } from "@repo/utils/safe-exec";

export class SignUpUseCase {
  async createUser(
    email: string,
    first_name: string,
    last_name: string,
    password: string
  ) {
    const cognitoService = new AwsCognitoService();
    const signupResponse = await cognitoService.createUserWithoutPassword({
      email,
      first_name,
      last_name,
      suppressWelcomeMessage: true,
    });
    console.log(signupResponse);

    if (!signupResponse.success) {
      return signupResponse;
    }

    if (signupResponse.value.kind === "cognito_challenge") {
      if (signupResponse.value.challengeName === "NEW_PASSWORD_REQUIRED") {
        const result = await cognitoService.adminChangePassword({
          username: email,
          password,
        });
        if (!result.success) {
          console.error(result.error, result.originalError);
          return result;
        }
      }
    }

    const userRepo = new UserRepo();
    return await userRepo.createUser({
      email,
      first_name,
      last_name,
      status: "pending",
    });
  }

  async listUsers(): Promise<Result<any[]>> {
    const cognitoService = new AwsCognitoService();
    return await cognitoService.adminListUsers('email ^= "nilo"');
  }

  async deleteUser(email: string): Promise<Result<void>> {
    const cognitoService = new AwsCognitoService();
    return await cognitoService.adminDeleteUser({ username: email });
  }
}
