import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLogo } from "@/components/app-logo";
import type { Route } from "./+types/signup";
import { Link } from "react-router";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import { useForm, validationError } from "@rvf/react-router";
import { FormInput } from "@/components/forms/validated-input";
import { SignUpUseCase } from "@repo/domain/auth";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Preventure - Sign up" }];
}

const signupFormValidator = withZod(
  z.object({
    email: z.string().email(),
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    password: z.string().trim().min(8),
    password_confirmation: z.string().trim().min(8),
  })
);

export async function action({ request }: Route.ActionArgs) {
  const submission = await signupFormValidator.validate(
    await request.formData()
  );
  if (submission.error) {
    return validationError(submission.error);
  }

  const { email, firstName, lastName, password, password_confirmation } =
    submission.data;

  if (password !== password_confirmation) {
    return validationError({
      fieldErrors: {
        password_confirmation: "Passwords do not match",
      },
    });
  }

  const signupUC = new SignUpUseCase();
  await signupUC.createUser(email, firstName, lastName, password);

  return null;
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm({
    method: "POST",
    validator: signupFormValidator,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-md">
            <AppLogo width={200} className="mb-4" />
            Sign up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form {...form.getFormProps()}>
            <div className="grid gap-6">
              <FormInput
                label="Email"
                scope={form.scope("email")}
                {...form.getInputProps("email")}
              />
              <FormInput
                label="First name"
                scope={form.scope("firstName")}
                {...form.getInputProps("firstName")}
              />
              <FormInput
                label="Last name"
                scope={form.scope("lastName")}
                {...form.getInputProps("lastName")}
              />
              <FormInput
                label="Password"
                type="password"
                scope={form.scope("password")}
                {...form.getInputProps("password")}
              />
              <FormInput
                label="Confirm password"
                type="password"
                scope={form.scope("password_confirmation")}
                {...form.getInputProps("password_confirmation")}
              />
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </div>
            <div className="mt-4 text-sm flex items-center justify-center gap-2">
              <span>Already have an account?</span>
              <Link to={"/login"} className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
