"use client";

import { useActionState, useEffect } from "react";

import { ActionRegister } from "@/app/actions/auth";

import ButtonSubmit from "../ui/ButtonSubmit";
import Form from "../ui/Form";
import Input from "../ui/Input";

export default function FormRegister() {
  const [state, action, pending] = useActionState(ActionRegister, {
    errors: 0,
    success: 0,
    message: "",
    body: {
      nickname: "",
      email: "",
      password: "",
      career_id: -1,
      admission_year: 2025,
    },
  });

  useEffect(() => {
  }, [])

  return (
    <Form action={action}>
      <Input
        label="Nickname"
        name="nickname"
        type="text"
        placeholder="Tu nickname"
        defaultValue={state.body.nickname}
      />
      <Input label="Email" name="email" type="email" placeholder="Correo electrónico" defaultValue={state.body.email} />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="Tu contraseña"
        defaultValue={state.body.password}
      />
      <label>
        Carrera
        <select name="career_id" defaultValue={state.body.career_id}>
          <option value="-1" disabled>
            Selecciona tu carrera
          </option>
          <option value="1">Ingeniería de Software</option>
          <option value="2">Ciencias de la Computación</option>
          <option value="3">Sistemas de Información</option>
        </select>
      </label>
      <Input
        label="Año de admisión"
        name="admission_year"
        type="number"
        min="2013"
        defaultValue={state.body.admission_year}
      />
      <p>{state.message}</p>
      <ButtonSubmit processing={<span>Registrando...</span>}>Registrarse</ButtonSubmit>
    </Form>
  );
}
