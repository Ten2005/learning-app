"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { PRODUCT_NAME } from "@/constants";

export default function Signup() {
  const router = useRouter();
  const { email, password, setEmail, setPassword } = useAuthStore();

  const handleSignup = () => {
    console.log(email, password);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{PRODUCT_NAME}</CardTitle>
          <CardDescription>
            Enter your email and password below to signup to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" type="submit" onClick={handleSignup}>
              Signup
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="flex justify-start w-full max-w-md">
        <Button variant={"link"} asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
