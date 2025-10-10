import { useState, useCallback } from "react";
import { message, type FormInstance } from "antd";
import type { SignInFormValues } from "./types";

interface UseSignInProps {
  form: FormInstance<SignInFormValues>;
}

export function useSignIn({ form }: UseSignInProps) {
  const [isFilled, setIsFilled] = useState(false);
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const generateCode = useCallback(() => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`Your 2FA code: ${code}`);
    setGeneratedCode(code);
  }, []);

  const onFinish = useCallback(
    async (values: SignInFormValues) => {
      setIsLoading(true);
      setHasError(false);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (values.email === "admin@mail.ru" && values.password === "admin") {
          setIsTwoFactor(true);
          generateCode();
        } else {
          setHasError(true);
          message.error("Incorrect email or password");

          setTimeout(() => setHasError(false), 2000);
          form.setFieldValue("password", "");
          form.resetFields(["password"]);
        }
      } catch (error) {
        setHasError(true);
        message.error(`An error occurred ${error}`);
        setTimeout(() => setHasError(false), 2000);
      } finally {
        setIsLoading(false);
      }
    },
    [form, generateCode]
  );

  const onValuesChange = useCallback(
    (_: Partial<SignInFormValues>, allValues: SignInFormValues) => {
      setIsFilled(!!allValues.email && !!allValues.password);
      if (hasError) setHasError(false);
    },
    [hasError]
  );

  const handleExpire = useCallback(() => generateCode(), [generateCode]);
  const handleSuccess = useCallback(() => console.log("2FA success"), []);

  return {
    form,
    isFilled,
    isTwoFactor,
    generatedCode,
    isLoading,
    hasError,
    onFinish,
    onValuesChange,
    handleExpire,
    handleSuccess,
  };
}
