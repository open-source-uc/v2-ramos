"use client";

import { FormProvider } from "react-hook-form";
import FormRegister from "../components/FormRegister";

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-700">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-600">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">Registro de Usuario</h2>

        <FormRegister />
      </div>
    </div>
  );
}
