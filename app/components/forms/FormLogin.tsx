"use client";

import { useActionState } from "react";

import { ActionLogin } from "@/app/actions/auth";

import ButtonSubmit from "../ui/ButtonSubmit";
import Form from "../ui/Form";
import Input from "../ui/Input";

export default function FormLogin() {
  const [state, action, pending] = useActionState(ActionLogin, {
    errors: 0,
    success: 0,
    message: "",
    body: {
      email: "",
      password: "",
    },
  });

  return (
    <Form action={action}>
      <Input label="Email" name="email" type="email" placeholder="Correo electrónico" defaultValue={state.body.email} />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="Tu contraseña"
        defaultValue={state.body.password}
      />
      <p>{state.message}</p>
      <ButtonSubmit processing={<span>Cargando...</span>}>Login</ButtonSubmit>
    </Form>
  );
}
