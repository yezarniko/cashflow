import React, { useEffect, useState } from "react";
import validator from "validator";
import MailOTP from "@assets/mail_OTP.svg";
import PolygonRight from "@assets/polygon_right.svg";
import MailIcon from "@assets/mail-inbox.svg";
import { Button, Input, Form, message } from "antd";
import { useUser } from "@/hooks/useUser";

const MailOutlined = () => <img src={MailIcon} />;

function ForgotPassword() {
  const { resetPassword } = useUser();
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="forgotPassword">
      {contextHolder}
      <Form
        onFinish={(values) => {
          resetPassword(values.email, messageApi);
        }}
      >
        <div className="forgotPassword__container">
          <div className="forgotPassword__polygon">
            <img src={PolygonRight} />
          </div>
          <div className="forgotPassword__container__content">
            <div className="forgotPassword__container__content__logo">
              <img src={MailOTP} />
            </div>
            <div className="forgotPassword__container__content__verify">
              <div className="forgotPassword__container__content__verify__firstLine">
                Please Enter Your Email Address To
              </div>
              <div className="forgotPassword__container__content__verify__secLine">
                Receive A Verification Code
              </div>
            </div>
            <Form.Item
              style={{ marginBlock: ".2em" }}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input email address!",
                },
                ({}) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve(); // Allow an empty field
                    }

                    if (!validator.isEmail(value)) {
                      return Promise.reject(new Error("Invalid email address"));
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                className="forgotPassword__container__content__input"
                size="large"
                placeholder="Enter your mail *"
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item style={{ marginTop: "1em" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="signUp__container__content__form__button"
              >
                Send Code
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
}
export default ForgotPassword;
