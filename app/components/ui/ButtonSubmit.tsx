"use client";

import { useFormStatus } from "react-dom";

interface ButtonSubmitProps {
  children: React.ReactNode;
  processing: React.ReactNode;
}

export default function ButtonSubmit({ children, processing }: ButtonSubmitProps) {
  const status = useFormStatus();

  return (
    <button
      type="submit"
      disabled={status.pending}
      className={`w-full rounded-lg p-4 font-semibold text-white ${status.pending ? "bg-gray-600" : "bg-red-500 hover:bg-red-600"} focus:outline-none focus:ring-2 focus:ring-red-500`}
    >
      {status.pending ? processing : children}
    </button>
  );
}
