import React from "react";
import Mailverify from "@assets/mail_verify.svg";
export default function EmailVerify() {
  return (
    <div className="email__verify">
      <div className="email__verify__image">
        <img src={Mailverify} />
      </div>
      <div className="email__verify__title">Verify your eamil address</div>
      <div className="email__verify__text">
        A varification email has been sent to your email
        <span> admin@gamil.com </span>
        Please check your email address and click the link provided in the email
        to complete your account registration.
      </div>
    </div>
  );
}
