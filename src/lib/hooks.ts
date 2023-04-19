import { doc, onSnapshot } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;
    try {
      if (user) {
        const ref = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(ref, (doc) => {
          setUsername(doc.data()?.username);
        });
      } else {
        setUsername(null);
      }
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  return { user, username };
}
