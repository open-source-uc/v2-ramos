"use client";

import FormLogin from "@/app/components/FormLogin";

const sendLogin = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("No se pudo iniciar sesión");
    }

    const data = await response.json();
    console.log("Weho!", data);
    // cookie, token ...
  } catch (error) {
    console.error("Error:", error);
  }
};

export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    sendLogin(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-700">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-gray-600">
        <h1
          className="text-bold p-2 text-center text-4xl text-cyan-500 dark:text-cyan-300"
          style={{
            fontFamily: "Trebuchet MS, sans-serif",
          }}
        >
          UC
        </h1>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">Iniciar Sesión</h2>
        <FormLogin />
      </div>
    </div>
  );
}
