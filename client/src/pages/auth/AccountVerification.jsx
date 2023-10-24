import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Mailverify from "@assets/mail_verify.svg";
import { useUser } from "@hooks/useUser";

function AccountVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      setIsVerified(currentUser.emailVerified);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />; // Redirect to the custom URL
  }

  if (isVerified) {
    return <Navigate to="/" />; // Redirect to the custom URL
  }

  return (
    <div className="email__verify">
      <div className="email__verify__image">
        <img src={Mailverify} />
      </div>
      <div className="email__verify__title">Verify your eamil address</div>
      <div className="email__verify__text">
        A varification email has been sent to your email
        <span> {currentUser.email} </span>
        Please check your email address and click the link provided in the email
        to complete your account registration.
      </div>
    </div>
  );
}

export default AccountVerification;
