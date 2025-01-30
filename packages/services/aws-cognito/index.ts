import {
  CognitoIdentityProviderClient,
  //   SignUpCommand,
  //   SignUpCommandInput,
  SignUpCommandOutput,
  //   ConfirmSignUpCommand,
  //   ConfirmSignUpCommandInput,
  //   ConfirmSignUpCommandOutput,
  //   ResendConfirmationCodeCommand,
  //   ResendConfirmationCodeCommandInput,
  //   ResendConfirmationCodeCommandOutput,
  //   ForgotPasswordCommand,
  //   ForgotPasswordCommandInput,
  //   ForgotPasswordCommandOutput,
  //   ConfirmForgotPasswordCommand,
  //   ConfirmForgotPasswordCommandInput,
  //   ConfirmForgotPasswordCommandOutput,
  //   UpdateUserAttributesCommand,
  //   UpdateUserAttributesCommandInput,
  //   UpdateUserAttributesCommandOutput,
  //   GetUserCommand,
  //   GetUserCommandInput,
  //   GetUserCommandOutput,
  //   AdminGetUserCommand,
  //   AdminGetUserCommandInput,
  //   AdminGetUserCommandOutput,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  InitiateAuthCommand,
  ChallengeNameType,
  AttributeType,
  GetUserCommand,
  AuthFlowType,
  ChangePasswordCommand,
  AdminSetUserPasswordCommand,
  ListUsersCommand,
  DeleteUserCommand,
  AdminDeleteUserCommand,
  //   AdminCreateUserCommandOutput,
  //   AdminDeleteUserCommand,
  //   AdminDeleteUserCommandInput,
  //   AdminDeleteUserCommandOutput,
  //   AdminUpdateUserAttributesCommand,
  //   AdminUpdateUserAttributesCommandInput,
  //   AdminUpdateUserAttributesCommandOutput,
  //   AdminConfirmSignUpCommand,
  //   AdminConfirmSignUpCommandInput,
  //   AdminConfirmSignUpCommandOutput,
  //   AdminSetUserPasswordCommand,
  //   AdminSetUserPasswordCommandInput,
  //   AdminSetUserPasswordCommandOutput,
  //   AdminResetUserPasswordCommand,
  //   AdminResetUserPasswordCommandInput,
  //   AdminResetUserPasswordCommandOutput,
  //   AdminAddUserToGroupCommand,
  //   AdminAddUserToGroupCommandInput,
  //   AdminAddUserToGroupCommandOutput,
  //   AdminRemoveUserFromGroupCommand,
  //   AdminRemoveUserFromGroupCommandInput,
  //   AdminRemoveUserFromGroupCommandOutput,
  //   AdminListGroupsForUserCommand,
  //   AdminListGroupsForUserCommandInput,
  //   AdminListGroupsForUserCommandOutput,
  //   AdminListUserAuthEventsCommand,
  //   AdminListUserAuthEventsCommandInput,
  //   AdminListUserAuthEventsCommandOutput,
  //   ListUsersCommand,
  //   ListUsersCommandInput,
  //   ListUsersCommandOutput,
  //   ListGroupsCommand,
  //   ListGroupsCommandInput,
  //   ListGroupsCommandOutput,
  //   ListUserPoolsCommand,
  //   ListUserPoolsCommandInput,
  //   ListUserPoolsCommandOutput,
  //   DescribeUserPoolCommand,
  //   DescribeUserPoolCommandInput,
  //   DescribeUserPoolCommandOutput,
  //   CreateUserPoolCommand,
  //   CreateUserPoolCommandInput,
  //   CreateUserPoolCommandOutput,
  //   UpdateUserPoolCommand,
  //   UpdateUserPoolCommandInput,
  //   UpdateUserPoolCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { Err, Ok, Result, safeAsync } from "@repo/utils/safe-exec";
import { generateSecureRandomPassword } from "@repo/utils/password-gen";

interface CognitoProfile {
  /*
      Cognito user id
      */
  sub: string;
  /*
      Cognito user email
      */
  email: string;
  /*    Cognito user username */
  username: string;
  /*
    Cognito user email verified status
  */
  email_verified: boolean;
  /*
      Cognito user given name
      */
  given_name: string;
  /*
      Cognito user family name
      */
  family_name: string;
  timezone: string;
  locale: string;
}

interface CognitoSessionData {
  kind: "cognito_session_data";
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  cognitoProfile: CognitoProfile;
  isAdmin?: "true" | "false";
}

interface CognitoChallenge {
  kind: "cognito_challenge";
  email: string;
  challengeName: ChallengeNameType;
  session?: string;
  challengeParameters?: Record<string, string>;
}

export class AwsCognitoService {
  async createUserWithoutPassword({
    email,
    first_name,
    last_name,
    suppressWelcomeMessage,
  }: {
    email: string;
    first_name: string;
    last_name: string;
    suppressWelcomeMessage: boolean;
  }): Promise<Result<CognitoSessionData | CognitoChallenge>> {
    const client = new CognitoIdentityProviderClient({
      region: CognitoRegionConfiguration.au.Region,
    });
    const sanitizedEmail = email.trim().toLowerCase();
    const temporaryPassword = await generateSecureRandomPassword(21);
    const command = new AdminCreateUserCommand({
      Username: sanitizedEmail,
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "given_name", Value: first_name },
        { Name: "family_name", Value: last_name },
      ],
      ValidationData: [{ Name: "email", Value: email }],
      UserPoolId: CognitoRegionConfiguration.au.UserPoolId,
      MessageAction: suppressWelcomeMessage ? "SUPPRESS" : null,
    } as AdminCreateUserCommandInput);

    const createUserResult = await safeAsync(
      client.send(command),
      "cognito_create_user_failed"
    );

    if (!createUserResult.success) {
      return Err(createUserResult.error, createUserResult.originalError);
    }

    // sign in the user, this will generate a NEW_PASSWORD_REQUIRED challenge
    const authCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: sanitizedEmail,
        PASSWORD: temporaryPassword,
      },
      ClientId: CognitoRegionConfiguration.au.ClientId,
    });

    const authResponse = await safeAsync(
      client.send(authCommand),
      "cognito_auth_failed"
    );

    if (!authResponse.success) {
      return Err(authResponse.error, authResponse.originalError);
    }

    if (authResponse.value.ChallengeName) {
      // if (authResponse.ChallengeName !== "NEW_PASSWORD_REQUIRED") {
      // const newPasswordCommand = new AdminSetUserPasswordCommand({
      //   UserPoolId: CognitoRegionConfiguration.au.UserPoolId,
      //   Username: sanitizedEmail,
      //   Password: password,
      //   Permanent: true,
      // });
      // const newPasswordResponse = await safeAsync(
      //   client.send(newPasswordCommand),
      //   "cognito_set_password_failed"
      // );

      // }
      return Ok({
        kind: "cognito_challenge",
        email: sanitizedEmail,
        challengeName: authResponse.value.ChallengeName,
        session: authResponse.value.Session,
        challengeParameters: authResponse.value.ChallengeParameters,
      });
    }

    if (authResponse.value.AuthenticationResult) {
      const getUserCommand = new GetUserCommand({
        AccessToken: authResponse.value.AuthenticationResult.AccessToken,
      });
      const userResponse = await client.send(getUserCommand);
      return Ok({
        kind: "cognito_session_data",
        accessToken: authResponse.value.AuthenticationResult.AccessToken,
        idToken: authResponse.value.AuthenticationResult.IdToken,
        refreshToken: authResponse.value.AuthenticationResult.RefreshToken,
        cognitoProfile: this.buildProfile(userResponse.UserAttributes || []),
        isAdmin: this.lookupAttribute(
          "custom:is_admin",
          userResponse.UserAttributes
        ),
      });
    }

    return Err("cognito_unexpected_response");
  }

  async adminChangePassword({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const client = new CognitoIdentityProviderClient({
      region: CognitoRegionConfiguration.au.Region,
    });
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: CognitoRegionConfiguration.au.UserPoolId,
      Username: username,
      Password: password,
      Permanent: true,
    });

    const response = await safeAsync(
      client.send(command),
      "cognito_set_password_failed"
    );

    if (!response.success) {
      return Err(response.error, response.originalError);
    }

    return Ok(undefined);
  }

  async adminListUsers(filter?: string): Promise<Result<CognitoProfile[]>> {
    const client = new CognitoIdentityProviderClient({
      region: CognitoRegionConfiguration.au.Region,
    });
    const command = new ListUsersCommand({
      UserPoolId: CognitoRegionConfiguration.au.UserPoolId,
      Filter: filter,
    });

    const response = await safeAsync(
      client.send(command),
      "cognito_list_users_failed"
    );

    if (!response.success) {
      return Err(response.error, response.originalError);
    }

    return Ok(
      response.value.Users?.map((user) =>
        this.buildProfile(user.Attributes || [])
      ) || []
    );
  }

  async adminDeleteUser({
    username,
  }: {
    username: string;
  }): Promise<Result<void>> {
    const client = new CognitoIdentityProviderClient({
      region: CognitoRegionConfiguration.au.Region,
    });
    const command = new AdminDeleteUserCommand({
      UserPoolId: CognitoRegionConfiguration.au.UserPoolId,
      Username: username,
    });

    const response = await safeAsync(
      client.send(command),
      "cognito_delete_user_failed"
    );

    if (!response.success) {
      return Err(response.error, response.originalError);
    }

    return Ok(undefined);
  }

  buildProfile(attributes: AttributeType[]): CognitoProfile {
    return {
      sub: this.lookupAttribute("sub", attributes),
      email: this.lookupAttribute("email", attributes),
      username: this.lookupAttribute("username", attributes),
      email_verified: this.lookupAttribute("email_verified", attributes),
      given_name: this.lookupAttribute("given_name", attributes),
      family_name: this.lookupAttribute("family_name", attributes),
      timezone: this.lookupAttribute("custom:timezone", attributes),
      locale: this.lookupAttribute("custom:language", attributes),
    };
  }

  lookupAttribute<T>(key: string, attributes?: AttributeType[]): T {
    const attribute = attributes?.find((attr) => attr.Name === key);
    return attribute?.Value as T;
  }
}

const CognitoRegionConfiguration = {
  au: {
    Region: "us-east-1",
    UserPoolId: "us-east-1_bQmx4Mmmx",
    ClientId: "eoqbircged9op94l0h19ap93q",
  },
} as const;
