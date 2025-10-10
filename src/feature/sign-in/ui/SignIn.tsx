import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import st from "./SignIn.module.scss";
import { emailRules, passwordRules } from "../model/validation";
import type { SignInFormValues } from "../model/types";
import { TwoFactorForm } from "@/feature/two-factor-form/ui/TwoFactorForm";
import { useSignIn } from "../model/useSignIn";

function SignIn() {
  const [form] = Form.useForm<SignInFormValues>();
  const {
    isFilled,
    isTwoFactor,
    generatedCode,
    isLoading,
    hasError,
    onFinish,
    onValuesChange,
    handleExpire,
    handleSuccess,
  } = useSignIn({ form });

  return (
    <section className={st.signIn}>
      <h1 className={st.logo}>Company</h1>
      <h2 className={st.title}>
        {isTwoFactor ? "Two-Factor Authentication" : "Sign in to your account"}
      </h2>

      {!isTwoFactor ? (
        <Form
          form={form}
          className={st.form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <Form.Item name="email" rules={emailRules}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              disabled={isLoading}
            />
          </Form.Item>
          <Form.Item name="password" rules={passwordRules}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              disabled={isLoading}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!isFilled}
              loading={isLoading}
              className={`${st.submitButton} ${hasError ? st.error : ""}`}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <>
          <p className={st.helperText}>Enter the 6-digit code from the app</p>
          <TwoFactorForm
            generatedCode={generatedCode}
            onExpire={handleExpire}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </section>
  );
}

export default SignIn;
