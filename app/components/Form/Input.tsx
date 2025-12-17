// ReusableInput.tsx
"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  [key: string]: any;
}

const CustomInput: React.FC<InputProps> = ({
  label,
  id,
  type = "text",
  error,
  registration,
  ...rest
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm text-gray-600 font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`block w-full p-2 rounded-md border ${
          error ? "border-red-500" : "border-gray-400"
        } focus:ring-indigo-500 focus:border-indigo-500`}
        {...registration}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
