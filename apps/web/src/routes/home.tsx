import { AppLogo } from "@/components/app-logo";
import type { Route } from "./+types/home";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Relay" }];
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <span className="flex items-center gap-2 self-center font-medium">
          <AppLogo />
        </span>

        <div className="flex justify-center items-center gap-x-2">
          <Button variant={"outline"} asChild>
            <Link to={"/login"} className="no-underline">
              Login
            </Link>
          </Button>
          <span>or</span>
          <Link to={"/signup"} className="">
            Get started for free
          </Link>
        </div>
      </div>
    </div>
  );
}
