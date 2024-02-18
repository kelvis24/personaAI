import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "~/lib";

export const addUser = async (payload: any) => {
  // Create user with email and password
  await createUserWithEmailAndPassword(auth, payload.email, payload.password);

  // Make object with user data
  const userObject = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    username: payload.username,
    activeId: "",
    activeType: "",
    organizationID: "",
  };

  try {
    const usernameRef = collection(db, "users");
    const userRef = await addDoc(usernameRef, userObject);
    return {
      success: true,
      data: userRef,
    };
  } catch (error: any) {
    // message.error(error.message);
    console.error("add new user", error);
    return {
      success: false,
      data: {},
      error,
    };
  }
};
