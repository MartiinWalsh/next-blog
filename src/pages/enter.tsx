/* eslint-disable @next/next/no-img-element */
import { auth, db, signInWithGoogleFirebase } from "@/lib/firebase";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/context";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutWithGoogleButton />
        )
      ) : (
        <SignInWithGoogleButton />
      )}
    </main>
  );
}

function SignInWithGoogleButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithGoogleFirebase();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src="/google.png" alt="Google Logo" />
      Sign in with Google
    </button>
  );
}

function SignOutWithGoogleButton() {
  return (
    <button
      onClick={() => {
        auth.signOut();
      }}
    >
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e: any) => {
    try {
      e.preventDefault();

      // Create refs for both documents
      const userDoc = doc(db, `users`, user.uid);
      const usernameDoc = doc(db, `usernames`, formValue);

      // Commit both docs together as a batch write.
      const batch = writeBatch(db);
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event: any) => {
    // validate length
    const val = event.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    const length = val.length;

    if (length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Check the database for username after each debounced change
  // useCallback is required for debounce to work in order to stop the
  // function from being recreated on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = await doc(db, "usernames", username);
        const docSnap = await getDoc(ref);
        console.log("Firestore read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [checkUsername, formValue]);
  console.log("usernames", username);

  return !username ? (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="myname"
          value={formValue}
          onChange={onChange}
        />
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
        />
        <button type="submit" className="btn-green" disabled={!isValid}>
          Choose
        </button>

        <h3>Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div>
      </form>
    </section>
  ) : null;
}

function UsernameMessage({ username, isValid, loading }: any) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
