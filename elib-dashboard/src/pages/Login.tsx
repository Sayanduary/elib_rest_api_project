import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Link } from "react-router";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log("Login Successful");
    },
  });
  const handleLoginSubmit = () => {
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    // mutation

    // make server call
  };

  return (
    <div>
      <section className="flex justify-center items-center h-screen">
        {" "}
        <Card className="w-full md:w-87.5">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />

                <p className="mt-1 text-sm text-red-500"></p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  ref={passRef}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />

                <p className="mt-1 text-sm text-red-500"></p>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleLoginSubmit}
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </CardFooter>
          <Field>
            <FieldDescription className="text-center">
              Don't have an Account?{" "}
              <Link to={"/auth/register"} className="underline">
                Register
              </Link>
            </FieldDescription>
          </Field>
        </Card>
      </section>
    </div>
  );
};

export default Login;
