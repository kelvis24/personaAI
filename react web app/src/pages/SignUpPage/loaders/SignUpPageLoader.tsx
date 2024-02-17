import { Result, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  isRouteErrorResponse,
  json,
  redirect,
  useRouteError,
} from "react-router-dom";
import { auth } from "~/lib";
import { addUser } from "~/services/server";
import { INTENTS } from "~/utils";

export const SignUpPageLoader = async ({ request }: LoaderFunctionArgs) => {
  return {};
};

export const SignUpPageAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case INTENTS._signup: {
      const payload = JSON.parse(formData.get("body") as string);
      const newUser = await addUser(payload);
      if (!newUser.success) {
        throw json({ error: newUser.error, isSignUp: true }, { status: 500 });
      }
      return {};
    }
    case INTENTS._signin: {
      try {
        const payload = JSON.parse(formData.get("body") as string);
        // Sign in user with email and password
        await signInWithEmailAndPassword(auth, payload.email, payload.password);
        message.success("Login successful!");
        return redirect("/home");
      } catch (error) {
        throw json({ error: error, isSignUp: false }, { status: 500 });
      }
    }
  }
  return {};
};

export const SignUpPageErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Result
        status={500}
        title={
          <>
            An Error occured during{" "}
            {error.data.isSignUp ? "sign up" : "sign in"}. Please try again
          </>
        }
      />
    );
  }
  return <Result status={500} title={<>An Error occured</>} />;
};
