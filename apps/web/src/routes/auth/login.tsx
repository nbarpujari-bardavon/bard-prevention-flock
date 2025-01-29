import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLogo } from "@/components/app-logo";
import type { Route } from "./+types/login";
import { Link } from "react-router";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import { useForm } from "@rvf/react-router";
import { FormInput } from "@/components/forms/validated-input";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Preventure - Login" }];
}

const loginFormValidator = withZod(
  z.object({
    email: z.string().email(),
    password: z.string().trim().min(8),
  })
);

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm({
    method: "POST",
    validator: loginFormValidator,
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-md">
            <AppLogo width={200} className="mb-4" />
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form {...form.getFormProps()}>
            <div className="flex flex-col gap-6">
              <FormInput
                label="Email"
                scope={form.scope("email")}
                {...form.getInputProps("email")}
              />
              <div className="grid gap-2">
                <FormInput
                  label="Password"
                  type="password"
                  scope={form.scope("password")}
                  {...form.getInputProps("password")}
                />
                <Link
                  to={"/login/password-reset"}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full no-underline" asChild>
                <Link to={"/login/sso"}>Login with Single Sign-On</Link>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={"/signup"} className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
