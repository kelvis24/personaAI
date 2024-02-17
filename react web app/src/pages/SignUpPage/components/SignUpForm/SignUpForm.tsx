import { useState } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { auth, db } from "~/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDocs, query, where  } from "firebase/firestore";
const { Title, Text } = Typography;

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [emailValue, setEmailValue] = useState(""); 
  const navigate = useNavigate();


  const handleFormToggle = () => {
    setIsSignUp(!isSignUp);
  };

   const handleEmailChange = (e: any) => {
    setEmailValue(e.target.value);
  };

const checkUsernameUniqueness = async (username: string) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("username", "==", username));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.size > 0) {
    return false;
  }
  return true; // Username is unique
};

  const handleSubmit = async (values: any) => {
    const { email, password, username } = values;
    setLoading(true);
    try {
      if (isSignUp) {
        const isUnique = await checkUsernameUniqueness(username);
        if (!isUnique) {
          throw new Error("Username already exists");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Add additional user info to Firestore (e.g., username)
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          username: username
        });
        // Handle post-sign-up logic (e.g., redirecting the user)
      } else {
        // Sign in logic
        await signInWithEmailAndPassword(auth, emailValue, password);
        // Handle post-sign-in logic (e.g., redirecting the user)
        navigate("/home");
      }
    } catch (error: any) {
      message.error(error.message);
      console.error('Error during form submission:', error);
      // Handle the error as needed, e.g., show a message to the user
    } finally {
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, emailValue); // Use the stored email value
      message.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      message.error("Failed to send a password reset email. Please check your email address if correct/exists.");
    }
  };

  return (
    <div className="signup-form">
      <Title className="signup-form-title" level={1}>
        {isSignUp ? "Sign Up" : "Sign In"}
      </Title>
      <Form form={form} onFinish={handleSubmit}>
        {!isSignUp && (
          <>
    <Form.Item
              className="signup-form-item"
              label="Email"
              name="email"
              rules={[
                // { required: false, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input onChange={handleEmailChange} /> {/* Add onChange event handler */}
            </Form.Item>
           <Form.Item
              className="signup-form-item"
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className="signup-form-forgot-password">
              <Button type="link" onClick={handleForgotPassword}>
                Forgot Password
              </Button>
            </Form.Item>
          </>
        )}
        {isSignUp && (
          <>
            <Form.Item
              className="signup-form-item"
              label="First Name"
              name="firstName"
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="signup-form-item"
              label="Last Name"
              name="lastName"
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="signup-form-item"
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="signup-form-item"
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="signup-form-item"
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}
        <Form.Item className="signup-form-submit-button">
          <Button type="primary" htmlType="submit" loading={loading} block>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </Form.Item>
        <Form.Item className="signup-form-toggle">
          <Text>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <Button type="link" onClick={handleFormToggle}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </Text>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpForm;
