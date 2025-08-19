"use client";

import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";

export const useHookForm = <
  T extends Record<string, any> = Record<string, any>,
>(
  options?: UseFormProps<T>,
): UseFormReturn<T> => {
  return useForm<T>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    shouldUnregister: false,
    criteriaMode: "firstError",
    delayError: undefined,
    ...options,
  });
};
