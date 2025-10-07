import { useState, useRef } from "react";
import { Input, Space, Button, Form, type InputRef } from "antd";

function TwoFactorForm() {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<InputRef | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = code.join("");
    console.log("Entered 2FA code:", enteredCode);
  };

  return (
    <Form onFinish={handleSubmit}>
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
            style={{ width: 40, textAlign: "center", fontSize: 24 }}
          />
        ))}
      </Space>
      <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
        Verify
      </Button>
    </Form>
  );
}

export default TwoFactorForm;
