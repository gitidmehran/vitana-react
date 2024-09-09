import { firstTimePass } from "../../../actions/Dashboard/Dashboard";
import { Button, Form, Input } from "antd";
import React from "react";
import { OpenNotification } from "./../../../Utilties/Utilties";
import { useState } from "react";

const Password = ({ setIsOpenModal }: { setIsOpenModal: any }) => {
  const [form] = Form.useForm();
  const [loading, setloading] = useState<boolean>(false);
  const userId = localStorage.getItem("user_id");
  const onFinish = (values: any) => {
    setloading(true);
    firstTimePass(userId, values).then(({ data: response }) => {
      localStorage.setItem("password_update", "1");
      setloading(false);
      setIsOpenModal(false);
      OpenNotification("success", response.message);
    });
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "86",
      }}
      scrollToFirstError
    >
      <Form.Item
        name="new_password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["new_password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("new_password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button loading={loading} type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Password;
