import React, { useEffect, useState } from "react";
import validator from "validator";
import { useUser } from "@hooks/useUser";
import { Navigate, Link } from "react-router-dom";

import MailIcon from "@assets/mail-inbox.svg";
import Padlock from "@assets/padlock.svg";
import NameLogo from "@assets/name_logo.svg";
import GoogleLogo from "@assets/google_logo.svg";

import { Button, Input, Form, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const MailOutlined = () => <img src={MailIcon} />;
const PadlockOutlined = () => <img src={Padlock} />;
const NameLogoOutlined = () => <img src={NameLogo} />;

function SignUp() {
  const { signInWithGoogle, signUpWithEmail } = useUser();
  const [messageApi, contextHolder] = message.useMessage();
  const [signInState, setSignInState] = useState(true);

  if (!signInState) {
    return <Navigate to="/verification" />;
  }

  return (
    <div className="signUp">
      {contextHolder}
      <div className="signUp__container">
        <div className="signUp__container__content">
          <div className="signUp__container__content__title">
            <div className="signUp__container__content__title__upper">
              Sign Up
            </div>
            <div className="signUp__container__content__title__under">
              Create your <span>C</span>ash<span>F</span>low Account
            </div>
          </div>
          <div className="signUp__container__content__form">
            <Form
              name="sign_up"
              onFinish={(values) => {
                signUpWithEmail(
                  values.username,
                  values.email,
                  values.password,
                  messageApi,
                  setSignInState
                );
              }}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input user name!",
                  },
                ]}
              >
                <Input
                  size="large"
                  name="user_name"
                  placeholder="Your name *"
                  className="signUp__container__content__form__input"
                  prefix={<NameLogoOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your eamil address!",
                  },
                  ({}) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve(); // Allow an empty field
                      }

                      if (!validator.isEmail(value)) {
                        return Promise.reject(
                          new Error("Invalid email address")
                        );
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  size="large"
                  placeholder="Email *"
                  className="signUp__container__content__form__input"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  // name="password"
                  className="signUp__container__content__form__input"
                  placeholder="Enter your password *"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  prefix={<PadlockOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Renter your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve(); // Allow an empty field
                      }

                      if (getFieldValue("password") !== value) {
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
                      }

                      if (!validator.isLength(value, { min: 8, max: 20 })) {
                        return Promise.reject(
                          new Error("Password Length must be between 8 and 20")
                        );
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  className="signUp__container__content__form__input"
                  placeholder="confirm password *"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  prefix={<PadlockOutlined />}
                />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="signUp__container__content__form__button"
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="signUp__container__content__option">
            <div className="signUp__container__content__option__line"></div>
            <div className="signUp__container__content__option__or">or</div>
            <div className="signUp__container__content__option__line"></div>
          </div>
          <div
            className="signUp__container__content__gmail"
            onClick={() => {
              signInWithGoogle({messageApi});
            }}
          >
            <div className="signUp__container__content__gmail__item">
              <div className="signUp__container__content__gmail__item__logo">
                <img src={GoogleLogo} />
              </div>
              <div className="signUp__container__content__gmail__item__text">
                Continue with google
              </div>
            </div>
          </div>
          <div className="signUp__container__content__signup">
            Already have an account?
            <Link to="/login"><span>Log in</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
