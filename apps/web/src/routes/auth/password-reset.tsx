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

export function meta({}: Route.MetaArgs) {
  return [{ title: "Preventure - Password reset" }];
}

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
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-md">
            <AppLogo width={200} className="mb-4" />
            Reset your password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
                <p className="text-sm text-muted-foreground">
                  We'll send you a link to reset your password
                </p>
              </div>
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
