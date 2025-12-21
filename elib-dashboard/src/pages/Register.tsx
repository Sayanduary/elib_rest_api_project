import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { register } from "@/http/api";

import useTokenStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      console.log("Registration Successful");
      setToken(response.data.accessToken);
      navigate("/dashboard/home");
    },
  });

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    const name = nameRef.current?.value;
    if (!email || !password || !name) {
      return alert("Please enter email and password");
    }
    mutation.mutate({ email, password, name });
  };

  return (
    <div>
      <section className="flex justify-center items-center h-screen">
        <Card className="w-full md:w-87.5">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    ref={nameRef}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    ref={emailRef}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" required ref={passRef} />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && (
                      <LoaderCircle className="animate-spin" />
                    )}
                    Create Account
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link to={"/auth/login"} className="underline">
                      Sign In
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Register;
