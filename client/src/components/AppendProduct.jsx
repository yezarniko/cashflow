import React, { useState } from "react";
import { Button, Modal, Form, Input, InputNumber } from "antd";
import "./_appendProduct.scss";

export default function AppendProduct({ open, setOpen }) {
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    console.log(e);
    setOpen(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };
  //

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onReset = () => {
    // formRef.current?.resetFields();
  };
  return (
    <>
     
    </>
  );
}
