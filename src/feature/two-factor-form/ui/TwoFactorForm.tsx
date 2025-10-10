import { Form, Space, Input, Button, message } from "antd";
import { memo } from "react";
import { useTwoFactorForm } from "../model/useTwoFactorForm";
import st from "./TwoFactorForm.module.scss";
import confetti from "canvas-confetti";

interface TwoFactorFormProps {
  generatedCode: string | null;
  onExpire: () => void;
  onSuccess: () => void;
}

export const TwoFactorForm = memo(
  ({ generatedCode, onExpire, onSuccess }: TwoFactorFormProps) => {
    const {
      code,
      expired,
      success,
      error,
      timeLeft,
      inputsRef,
      handleChange,
      handleKeyDown,
      handleSubmit,
      handleGetNew,
      isAnyFilled,
    } = useTwoFactorForm({ generatedCode, onExpire, onSuccess });

    const onFinish = () => {
      const res = handleSubmit();
      if (res?.status === "invalid")
        message.error("Code expired or incomplete");
      if (res?.status === "error") message.error("Invalid code");
      if (res?.status === "success") {
        message.success("Verified");
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    };

    return (
      <div className={st.container}>
        <Form onFinish={onFinish} className={st.form}>
          <Space>
            {code.map((num, idx) => (
              <Input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                value={num}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                maxLength={1}
                className={`${st.input} ${success ? st.success : ""} ${
                  error ? st.error : ""
                }`}
                disabled={expired || success}
              />
            ))}
          </Space>

          <div className={st.timer}>
            {!expired && !success && (
              <span className={timeLeft <= 10 ? st.warning : ""}>
                Time left: {timeLeft}s
              </span>
            )}
            {expired && <span className={st.expired}>Code expired</span>}
            {success && (
              <span className={st.successText}>Verified successfully!</span>
            )}
          </div>

          {isAnyFilled && !expired && !success && (
            <Button
              type="primary"
              htmlType="submit"
              className={st.verifyButton}
            >
              Continue
            </Button>
          )}

          {expired && (
            <Button
              type="primary"
              danger
              onClick={handleGetNew}
              className={st.verifyButton}
            >
              Get new
            </Button>
          )}

          {success && (
            <Button
              type="primary"
              style={{
                backgroundColor: "rgb(0, 183, 0)",
                borderColor: "green",
                color: "white",
              }}
              disabled
              className={st.verifyButton}
            >
              Verified
            </Button>
          )}
        </Form>
      </div>
    );
  }
);
