import { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import st from "./SignIn.module.scss";
import type { SignInFormValues } from "../model/types";
import { emailRules, passwordRules } from "../model/validation";

function SignIn() {
  const [form] = Form.useForm<SignInFormValues>();
  const [isFilled, setIsFilled] = useState(false);

  const onFinish = (values: SignInFormValues) => {
    console.log("Form submitted:", values);
  };

  const onValuesChange = (
    _: Partial<SignInFormValues>,
    allValues: SignInFormValues
  ) => {
    setIsFilled(!!allValues.email && !!allValues.password);
  };

  return (
    <section className={st.signIn}>
      <h1 className={st.logo}>Company</h1>
      <p className={st.title}>Sign in to your account to continue</p>

      <Form
        form={form}
        className={st.form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item name="email" rules={emailRules}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={passwordRules}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={!isFilled}>
            Log In
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

export default SignIn;
