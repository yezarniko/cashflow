import React, { useRef } from "react";
import validator from "validator";
import Background from "@assets/background.svg";
import MailIcon from "@assets/mail-inbox.svg";
import Padlock from "@assets/padlock.svg";
import Logo from "@assets/Logo.svg";
import GoogleLogo from "@assets/google_logo.svg";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, message, Form } from "antd";
import { Link } from "react-router-dom";
import { useUser } from "@hooks/useUser";

const MailOutlined = () => <img src={MailIcon} />;
const PadlockOutlined = () => <img src={Padlock} />;

function Login() {
  const { signInWithGoogle, signInWithEmail } = useUser();
  const [messageApi, contextHolder] = message.useMessage();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <div className="login">
      {contextHolder}
      <div className="login__container">
        <div className="login__polygon">
          <img src={Background} />
        </div>

        <Form
          onFinish={(values) =>
            signInWithEmail(values.email, values.password, messageApi)
          }
        >
          <div className="login__container__content">
            <div className="login__container__content__logo">
              <img src={Logo} />
            </div>

            <Form.Item
              style={{ marginBlock: ".5em" }}
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
                ref={emailRef}
                className="login__container__content__input"
                size="large"
                placeholder="Enter your mail *"
                prefix={<MailOutlined />}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBlock: ".5em" }}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                ref={passwordRef}
                className="login__container__content__input"
                size="large"
                placeholder="Enter your password *"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                prefix={<PadlockOutlined />}
              />
            </Form.Item>

            <Link to="/forgetpassword">
              <div className="login__container__content__forgot">
                Forgot password?
              </div>
            </Link>
            <Form.Item style={{ marginBlock: "1em" }}>
              <Button
                type="primary"
                htmlType="submit"
                // className="login__container__content__button"
                className="signUp__container__content__form__button"
              >
                Login
              </Button>
            </Form.Item>
            <div className="login__container__content__option">
              <div className="login__container__content__option__line"></div>
              <div className="login__container__content__option__or">or</div>
              <div className="login__container__content__option__line"></div>
            </div>
            <div className="login__container__content__gmail">
              <div className="login__container__content__gmail__item">
                <div className="login__container__content__gmail__item__logo">
                  <img src={GoogleLogo} />
                </div>
                <div
                  className="login__container__content__gmail__item__text"
                  onClick={() => signInWithGoogle({ messageApi })}
                >
                  Continue with google
                </div>
              </div>
            </div>
            <div className="login__container__content__signup">
              Don't you have an account?
              <Link to="/signup">
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
