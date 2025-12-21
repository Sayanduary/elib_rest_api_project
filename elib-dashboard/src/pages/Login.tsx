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
import { login } from "@/http/api";
import useTokenStore from "@/store";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      console.log("Login Successful");
      setToken(response.data.accessToken);
      navigate("/dashboard/home");
    },
  });

  const handleLoginSubmit = () => {
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    if (!email || !password) {
      return alert("Please enter email and password");
    }
    // mutation
    mutation.mutate({ email, password });
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
              {mutation.isPending && <div>Loading...</div>}
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
            <div className="w-full flex flex-col items-center gap-3">
              <Button
                onClick={handleLoginSubmit}
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}

                <span>Login</span>
              </Button>
            </div>
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
