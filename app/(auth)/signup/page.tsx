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
import { ArrowLeftIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { PRODUCT_NAME } from "@/constants";
import { signup } from "@/lib/auth/signup";

export default function Signup() {
  const { email, password, setEmail, setPassword, isLoading, setIsLoading } =
    useAuthStore();

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const { error } = await signup(email, password);
      if (!error) {
        toast("Check your email", {
          description: "A confirmation link has been sent to your inbox",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{PRODUCT_NAME}</CardTitle>
          <CardDescription>
            Enter your email and password below to signup to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
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
          </div>
          <CardAction className="mt-4">
            <Button
              size={"sm"}
              type="submit"
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading && <Spinner className="w-4 h-4 mr-2 animate-spin" />}
              Signup
            </Button>
          </CardAction>
        </CardContent>
      </Card>
      <div className="flex justify-start w-full max-w-md">
        <Button variant={"link"} asChild>
          <Link href="/login">
            <ArrowLeftIcon className="w-4 h-4" />
            Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
