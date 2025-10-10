import type { Rule } from "antd/es/form";

export const emailRules: Rule[] = [
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      if (!/\S+@\S+\.\S+/.test(value))
        return Promise.reject("Please enter a valid email!");
      return Promise.resolve();
    },
  },
];

export const passwordRules: Rule[] = [
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      if (value.length < 4)
        return Promise.reject("Password must be at least 4 characters!");
      if (value.length > 16)
        return Promise.reject("Password cannot exceed 16 characters!");
      return Promise.resolve();
    },
  },
];
