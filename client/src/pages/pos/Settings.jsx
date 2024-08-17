import {
  EditOutlined,
  BranchesOutlined,
  UserSwitchOutlined,
  InfoCircleOutlined,
  UserOutlined,
  GoogleOutlined,
  MailOutlined,
  KeyOutlined,
  LockOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import BranchImage from "@assets/branch _image.png";
import PlugIcon from "@assets/plug_icon.png";
import Franchise from "@assets/franchise.png";
import OTP_image from "@assets/otp_image.png";
import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  Form,
  Input,
  Upload,
  Select,
  Tabs,
  Tooltip,
  Modal,
  Radio,
  message,
} from "antd";
import {
  CheckCircleTwoTone,
  HeartTwoTone,
  SmileTwoTone,
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { useUser } from "@hooks/useUser";
import { Navigate } from "react-router-dom";
import validator from "validator";
import { gql, useQuery } from "@apollo/client";
import { Ollama } from "ollama/browser";
import { useDatabase } from "@/hooks/useDatabase";
import { useRef } from "react";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 20,
    offset: 2,
  },
};
const { TextArea } = Input;

const GET_BRANCHES = gql`
  query getBranches($userId: String!, $token: String!) {
    user(userId: $userId, token: $token) {
      branches {
        branchId
        name
      }
    }
  }
`;

const Settings = () => {
  const { currentUser, handleSignOut, updateUserInfo, changePassword } =
    useUser();

  function AccountSettings() {
    const [disableEditMode, setDisableEditMode] = useState(true);
    const [username, setUsername] = useState(currentUser.displayName);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const providerId = currentUser.providerData[0].providerId;
    const disableChangePassword = providerId == "google.com";

    return (
      <div className="account__settings">
        {contextHolder}
        <Form
          name="Main"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={(values) => {
            updateUserInfo(
              values.username,
              values.email,
              messageApi,
              setEmail,
              setUsername,
              ""
            );
          }}
        >
          <div className="account__settings__container">
            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 2,
              }}
            >
              <h2>Account Center</h2>
            </Form.Item>

            <Form.Item label="Account Name" name="username">
              <div className="account__settings__container__name">
                <Input
                  prefix={<UserOutlined />}
                  disabled={disableEditMode}
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  className="account__settings__container__name__input"
                />
                <div
                  className="account__settings__container__name__edit"
                  onClick={() => {
                    if (!disableEditMode) {
                      setUsername(currentUser.displayName);
                      setEmail(currentUser.email);
                    }
                    setDisableEditMode((mode) => !mode);
                  }}
                >
                  <EditOutlined />
                  <span>{disableEditMode ? "Edit" : "Close"}</span>
                </div>
              </div>
            </Form.Item>

            <Form.Item label="Email" name="email">
              <div className="account__settings__container__email">
                <Input
                  prefix={
                    providerId == "google.com" ? (
                      <GoogleOutlined />
                    ) : (
                      <MailOutlined />
                    )
                  }
                  disabled={disableEditMode || providerId == "google.com"}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="account__settings__container__email__input"
                />
                <Button
                  disabled={
                    currentUser.email == email &&
                    currentUser.displayName == username
                  }
                  type="primary"
                  onClick={() => {
                    updateUserInfo(
                      username,
                      email,
                      messageApi,
                      setEmail,
                      setUsername,
                      password
                    );
                    setDisableEditMode(true);
                  }}
                >
                  Save
                </Button>
              </div>
            </Form.Item>

            {!disableEditMode && currentUser.email != email ? (
              <Form.Item label="Password" name="password">
                <div className="account__settings__container__email">
                  <Input.Password
                    placeholder="Enter your password"
                    prefix={<KeyOutlined />}
                    onChange={(e) => setPassword(e.target.value)}
                    className="account__settings__container__email__input"
                  />
                </div>
              </Form.Item>
            ) : (
              <></>
            )}
          </div>
        </Form>

        <div className="account__settings__change__password">
          <Form
            name="current_password"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            onFinish={(values) => {
              changePassword(
                values.current_password,
                values.new_password,
                messageApi
              );
            }}
          >
            <Form.Item
              wrapperCol={{
                span: 10,
                offset: 2,
              }}
            >
              <h3>Change Password</h3>
            </Form.Item>
            <Form.Item name="current_password" label="Current Password">
              <PasswordInput disabled={disableChangePassword} />
            </Form.Item>
            <Form.Item name="new_password" label="New Password" hasFeedback>
              <PasswordInput disabled={disableChangePassword} />
            </Form.Item>

            <Form.Item
              name="retype_new_password"
              label="Retype New Password"
              dependencies={["new_password"]}
              hasFeedback
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    if (!validator.isLength(value, { min: 8, max: 20 })) {
                      return Promise.reject(
                        new Error("Password Length must be between 8 and 20")
                      );
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <PasswordInput disabled={disableChangePassword} />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 8,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={disableChangePassword}
              >
                Change
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        tabPosition={"left"}
        style={{
          height: 500,
          fontWeight: 600,
        }}
        items={[
          {
            label: (
              <span>
                <UserSwitchOutlined />
                Account
              </span>
            ),
            key: 1,
            children: (
              <div
                style={{
                  width: "55%",
                }}
              >
                <AccountSettings />
              </div>
            ),
          },
          {
            label: (
              <span>
                <BranchesOutlined />
                Branch
              </span>
            ),
            key: 2,
            children: (
              <div
                style={{
                  width: "55%",
                }}
              >
                {/* <BranchesSettings currentUser={currentUser} /> */}
              </div>
            ),
          },
          {
            label: (
              <span>
                <CloudServerOutlined />
                LLM
              </span>
            ),
            key: 3,
            children: (
              <div
                style={{
                  width: "55%",
                }}
              >
                <TrainingSection />
              </div>
            ),
          },
          {
            label: (
              <Button
                type="primary"
                onClick={() => handleSignOut()}
                style={{ marginTop: "9em" }}
              >
                Sign Out
              </Button>
            ),
            key: 4,
          },
        ]}
      />
    </div>
  );
};

const TrainingSection = () => {
  const [modelDetails, setModelDetails] = useState(null);
  const [modifiedDate, setModifiedDate] = useState("");
  const [ollama, setOllama] = useState(null);
  const { trainDataSet } = useDatabase();
  const [consoleOutput, setConsoleOutput] = useState("");
  const [baseURL, setBaseURL] = useState("http://192.168.16.147:11434");
  const [messageApi, contextHolder] = message.useMessage();

  const teX = useRef(null);

  async function testRequest() {
    const response = await ollama.show({ model: "llama3.1-cashflow" });
    setModifiedDate(response.modified_at);
    setConsoleOutput((output) => output + "\n\n\nSuccessfully feeded data!");
    teX.current.scrollTop = teX.current.scrollHeight;
  }

  useEffect(() => {
    const modelName = "llama3.1-cashflow";

    const ollama = new Ollama({ host: baseURL });

    ollama
      .show({
        model: modelName,
      })
      .then((data) => {
        setModelDetails(data.details);
        setModifiedDate(data.modified_at);
      })
      .catch((error) => {
        console.log(error);
        setModelDetails(null);
      });

    setOllama(ollama);
  }, [baseURL]);

  return (
    <div className="h-[90vh] w-full border-2">
      {contextHolder}
      <h2 className="mt-6 ml-6 text-base">LLM Training Section</h2>
      <div className="ml-6 mt-6">
        <span className="mr-5">Ollama Server:</span>
        <input
          type="url"
          className="w-72 border-2 outline-none font-mono text-slate-500 p-2"
          spellCheck={false}
          defaultValue={baseURL}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              console.log(event.key);
              console.log(event.target.value);
              setBaseURL(event.target.value);
            }
          }}
        />
        <span
          className={
            (modelDetails ? "bg-emerald-500 " : "bg-amber-500 ") +
            "ml-4  scale-[80%] inline-block font-mono text-sm text-slate-100 p-2 rounded-xl"
          }
        >
          {modelDetails ? "Connected" : "Disconnect"}
        </span>
      </div>
      {modelDetails && (
        <>
          <div className="flex mx-auto  items-center ml-6 mt-6 font-sans text-base font-normal">
            <div className="mr-6 text-slate-500">
              <div>Model: </div>
              <div>Parameter Size: </div>
              <div>Family: </div>
              <div>Format: </div>
              <div>Quantization Level: </div>
              <div>Last Trained Date: </div>
            </div>
            <div className="text-slate-700/80">
              <div className="text-blue-500">{modelDetails.parent_model}</div>
              <div className="text-orange-500">
                {modelDetails.parameter_size}
              </div>
              <div>{modelDetails.family.toUpperCase()}</div>
              <div>{modelDetails.format.toUpperCase()}</div>
              <div>{modelDetails.quantization_level}</div>
              <div className="font-mono">
                {new Date(modifiedDate).toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <div
              onClick={() =>
                trainDataSet(
                  "main",
                  ollama,
                  messageApi,
                  testRequest,
                  setConsoleOutput
                )
              }
              className="cursor-pointer p-2 bg-emerald-500/80 rounded text-slate-50 font-sans inline-block ml-6 mt-6"
            >
              Train Model
            </div>
          </div>
          <div className="flex items-center">
            <textarea
              ref={teX}
              value={consoleOutput}
              readOnly={true}
              className="w-[95%] font-normal mx-auto h-[420px] p-6 font-mono text-xs bg-slate-200 text-slate-600 mt-6"
            ></textarea>
          </div>
        </>
      )}
    </div>
  );
};

function BranchesSettings({ currentUser }) {
  const [isCreateBranchModalOpen, setIsCreateBranchModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState("Main");

  const { data, loading, error } = useQuery(GET_BRANCHES, {
    variables: { userId: currentUser.uid, token: currentUser.accessToken },
  });

  useEffect(() => {
    if (data) {
      console.log(currentUser.accessToken);
      console.log(currentUser.uid);
    }
  });

  if (loading) return <div>Loading</div>;
  // if (error) return <div>error.message</div>

  function createBranch(values) {
    setIsCreateBranchModalOpen(false);
    setIsOTPModalOpen(true);
    console.log(values);
  }

  function closeCreateBranchModal() {
    setIsCreateBranchModalOpen(false);
  }

  return (
    !loading && (
      <div className="branch__settings">
        <Modal
          width="25%"
          justify-content="space-between"
          open={isOTPModalOpen}
          footer={null}
          onCancel={() => setIsOTPModalOpen(false)}
        >
          <div className="branch__settings__otp">
            <img src={OTP_image} />
            <span>Please Enter Verification Code Sent To</span>
            <span>Admin Mail</span>
            <Input name="otp_code" placeholder="Enter 4 digit code" />
            <Button type="primary" onClick={() => setIsOTPModalOpen(false)}>
              Verify
            </Button>
          </div>
        </Modal>
        <Modal
          width="28%"
          open={isCreateBranchModalOpen}
          onCancel={closeCreateBranchModal}
          footer={null}
          closeIcon={null}
        >
          <div className="branch__settings__create">
            <div className="branch__settings__create__title">
              <h2>Create New Branch</h2>
              <img src={Franchise} />
            </div>
            <div className="branch__settings__create__form">
              <Form name="create_branch" onFinish={createBranch}>
                <Form.Item
                  name="branch_name"
                  rules={[
                    {
                      required: true,
                      message: "Enter your new branch name!",
                    },
                  ]}
                >
                  <Input placeholder="Branch Name *" />
                </Form.Item>
                <Form.Item
                  name="agent_name"
                  rules={[
                    {
                      required: true,
                      message: "Enter your agent name!",
                    },
                  ]}
                >
                  <Input placeholder="Agent name *" />
                </Form.Item>
                <Form.Item
                  name="agent_phone"
                  rules={[
                    {
                      required: true,
                      message: "Enter your agent phone number!",
                    },
                  ]}
                >
                  <Input placeholder="Phone Number *" />
                </Form.Item>
                <Form.Item name="address">
                  <TextArea rows={4} placeholder="Address *" />
                </Form.Item>
                <FormItem>
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Button type="primary" htmlType="submit" block>
                      Create
                    </Button>
                    <Button
                      block
                      type="secondary"
                      style={{
                        background: "rgba(130, 112, 112, 0.61)",
                        color: "#ffffff",
                      }}
                      onClick={closeCreateBranchModal}
                    >
                      Cancel
                    </Button>
                  </Space>
                </FormItem>
              </Form>
            </div>
          </div>
        </Modal>
        <div className="branch__settings__container">
          <div className="branch__settings__container__main">
            <h2>Branches</h2>

            <Radio.Group
              defaultValue={currentBranch}
              onChange={(v) => {
                setCurrentBranch(v);
                console.log(currentBranch);
              }}
            >
              <div className="branch__settings__container__main__radio">
                {data.user.branches.map((branch) => (
                  <Radio value={branch.name} key={branch.branchId}>
                    <span>{branch.name}</span>
                  </Radio>
                ))}
              </div>
            </Radio.Group>
          </div>

          <div className="branch__settings__container__image">
            <div className="branch__settings__container__image__icon">
              <img src={PlugIcon} />
              <span onClick={() => setIsCreateBranchModalOpen(true)}>
                Crate New Branch
              </span>
            </div>

            <img src={BranchImage} width={"120px"} />
          </div>
        </div>
        <div className="branch__settings__bottom">
          <div className="branch__settings__bottom__info">
            <div className="branch__settings__bottom__field">
              <div className="branch__settings__bottom__field__name">
                Branch Name
              </div>
              <div className="branch__settings__bottom__field__phone">
                Phone
              </div>
              <div className="branch__settings__bottom__field__address">
                Address
              </div>
              <div className="branch__settings__bottom__field__agent">
                Agent Name
              </div>
            </div>
            <div className="branch__settings__bottom__data">
              <div className="branch__settings__bottom__data__name">
                {
                  data.user.branches.filter(
                    (branch) => branch.name === currentBranch
                  )[0].name
                }
              </div>
              <div className="branch__settings__bottom__data__phone">
                {data.user.branches.filter(
                  (branch) => branch.name === currentBranch
                )[0].phone || "-"}
              </div>
              <div className="branch__settings__bottom__data__address">
                {data.user.branches.filter(
                  (branch) => branch.name === currentBranch
                )[0].address || "-"}
              </div>
              <div className="branch__settings__bottom__data__agent">
                {data.user.branches.filter(
                  (branch) => branch.name === currentBranch
                )[0].agentName || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

function PasswordInput(props) {
  return (
    <div className="account__settings__change__password__input">
      <Input.Password {...props} />
    </div>
  );
}

export default Settings;
