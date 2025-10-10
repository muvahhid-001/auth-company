import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { InputRef } from "antd";

interface UseTwoFactorFormProps {
  generatedCode: string | null;
  onExpire: () => void;
  onSuccess: () => void;
}

export function useTwoFactorForm({
  generatedCode,
  onExpire,
  onSuccess,
}: UseTwoFactorFormProps) {
  const [code, setCode] = useState<string[]>(() => Array(6).fill(""));
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const inputsRef = useRef<(InputRef | null)[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!generatedCode) return;

    setExpired(false);
    setSuccess(false);
    setError(false);
    setCode(Array(6).fill(""));
    setTimeLeft(30);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generatedCode]);

  const handleChange = useCallback((index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      setCode((prev) => {
        const newCode = [...prev];
        newCode[index] = value;
        return newCode;
      });
      setError(false);
      if (value && index < 5) inputsRef.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handleSubmit = useCallback(() => {
    const enteredCode = code.join("");
    if (expired || enteredCode.length !== 6)
      return { status: "invalid" as const };
    if (enteredCode === generatedCode) {
      setSuccess(true);
      if (timerRef.current) clearInterval(timerRef.current);
      onSuccess();
      return { status: "success" as const };
    } else {
      setError(true);
      return { status: "error" as const };
    }
  }, [code, expired, generatedCode, onSuccess]);

  const handleGetNew = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setExpired(false);
    setSuccess(false);
    setError(false);
    setCode(Array(6).fill(""));
    setTimeLeft(30);
    onExpire();
  }, [onExpire]);

  const isAnyFilled = useMemo(() => code.some((digit) => digit !== ""), [code]);

  return {
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
  };
}
