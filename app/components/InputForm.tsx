import { get } from "http";
import path from "path";
import React from "react";
import { FieldErrors, FieldValues, Path, useFormContext, UseFormRegister } from "react-hook-form";

type InputProps = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
};

const InputForm = ({ name, label, type, placeholder }: InputProps) => {
  const { register, formState, getFieldState } = useFormContext();
  const { error } = getFieldState(name, formState);
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        id={name}
        className="form-control mt-1 w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-500 dark:text-gray-200"
        placeholder={placeholder}
      />
      {error?.message && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputForm;
