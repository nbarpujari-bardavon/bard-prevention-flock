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
  return [{ title: "Preventure - Single Sign-On" }];
}

const loginFormValidator = withZod(
  z.object({
    email: z.string().email(),
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
            Login with Single Sign-On
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form {...form.getFormProps()}>
            <div className="flex flex-col gap-6">
              <FormInput
                label="Work email"
                scope={form.scope("email")}
                {...form.getInputProps("email")}
              />
              <Button type="submit" className="w-full">
                Continue
              </Button>
              <Button variant="outline" className="w-full no-underline" asChild>
                <Link to={"/login"}>Login with email</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
