import { useState, useEffect } from 'react';
import { auth, firestore } from './firebase';


export const useUserData = () => {
 const [userData, setUserData] = useState(null);
 const [loading, setLoading] = useState(true);


 useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged(async (user) => {
     if (user) {
       // retrieve user data from Firestore
       const userDoc = await firestore.collection('users').doc(user.uid).get();
       setUserData({
         uid: user.uid,
         email: user.email,
         name: user.displayName || userDoc.data()?.name,
       });
     } else {
       setUserData(null);
     }
     setLoading(false);
   });


   return unsubscribe;
 }, []);


 return { userData, loading };
};
