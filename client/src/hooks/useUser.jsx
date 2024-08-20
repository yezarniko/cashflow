import React, { useState, useContext, useEffect } from "react";
import useFireBase from "@hooks/useFirebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { gql, useMutation } from "@apollo/client";

const app = useFireBase();
const auth = getAuth(app);

const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signInWithGoogle({ messageApi }) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((auth) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = auth.user;

        // console.log(token);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        // The email of the user's account used.
        // The AuthCredential type that was used.
        // ...
        if (errorCode == "auth/internal-error") {
          messageApi.open({
            type: "error",
            content: "Network Request Failed",
          });
        }
      });
  }
  function handleSignOut() {
    signOut(auth)
      .then(() => {
        console.log(auth);
      })
      .catch((e) => console(e));
  }
  function signUpWithEmail(username, email, password, messageApi, signInState) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        updateProfile(user, { displayName: username });
        sendEmailVerification(user);
        signInState(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        if (errorCode == "auth/network-request-failed") {
          messageApi.open({
            type: "error",
            content: "Network Request Failed",
          });
        } else if (errorCode == "auth/email-already-in-use") {
          messageApi.open({
            type: "error",
            content: "Email address is already in use.",
          });
        }
      });
  }
  function signInWithEmail(email, password, messageApi) {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode == "auth/network-request-failed") {
        messageApi.open({
          type: "error",
          content: "Network Request Failed",
        });
      } else if (errorCode == "auth/invalid-login-credentials") {
        messageApi.open({
          type: "error",
          content: "Invalid Email or Password",
        });
      } else if (errorCode == "auth/too-many-requests") {
        messageApi.open({
          type: "error",
          content: "Your Account is Temporary Disabled Due to Too Many Request",
        });
      } else {
        console.log(errorCode);
        messageApi.open({
          type: "error",
          content: errorMessage,
        });
      }
    });
  }
  function resetPassword(email, messageApi) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Password Reset Mail was sent to" + email,
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        messageApi.open({
          type: "error",
          content: errorMessage,
        });
      });
  }

  async function updateUserInfo(
    username,
    email,
    messageApi,
    setEmail,
    setUsername
  ) {
    const providerId = currentUser.providerData[0].providerId;

    if (currentUser.displayName != username) {
      try {
        await updateProfile(currentUser, { displayName: username });

        setUsername(username);
        messageApi.open({
          type: "success",
          content: "Successfully Change Username",
        });
      } catch (error) {
        setUsername(currentUser.username);
        messageApi.open({
          type: "error",
          content: error.message,
        });
      }
    }

    if (currentUser.email != email && providerId != "google.com") {
      if (password != "") {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          password
        );
        try {
          await reauthenticateWithCredential(currentUser, credential);

          await updateEmail(currentUser, email);

          await sendEmailVerification(currentUser);

          console.log(currentUser);
        } catch (error) {
          setEmail(currentUser.email);
          let errorMessage = error.message;
          console.log(error.code);
          if (error.code == "auth/invalid-login-credentials") {
            errorMessage = "Invalid Password!";
          } else if (error.code == "auth/too-many-requests") {
            errorMessage = "Too Many Requests! Try Again Later";
          }
          messageApi.open({
            type: "error",
            content: errorMessage,
          });
        }
      }
    }
  }
  async function changePassword(current_password, new_password, messageApi) {
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      current_password
    );
    try {
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, new_password);

      messageApi.open({
        type: "success",
        content: "New Password has been updated!",
      });
    } catch (error) {
      let errorMessage = error.message;

      if (error.code == "auth/invalid-login-credentials") {
        errorMessage = "Invalid Password!";
      } else if (error.code == "auth/too-many-requests") {
        errorMessage = "Too Many Requests! Try Again Later";
      }
      messageApi.open({
        type: "error",
        content: errorMessage,
      });
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("current User: ", user);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        handleSignOut,
        resetPassword,
        updateUserInfo,
        changePassword,
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
