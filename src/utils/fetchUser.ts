import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "~/lib";

interface User {
  username: string;
  email: string;
}

export const fetchUser = async () => {
  try {
    const ref = collection(db, "users");
    const q = query(ref, where("email", "==", auth.currentUser?.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData as User;
    }
  } catch (error) {
    console.error("Error occurred during user fetch:", error);
    return null;
  }
};
