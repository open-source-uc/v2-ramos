import { FormProvider, useForm } from "react-hook-form";
import { registerSchema, registerForm } from "../schemas/register";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "./InputForm";
import ButtonLarge from "./ButtonLarge";

// Las librerias zod y react-hook sirven para manejar de mejor manera los formularios
// zod valida los datos ingresados en el formulario [crea objetos de validacion]
// react-hook-form se encarga de manejar el estado del formulario, optimizando la renderizacion

type Props = {};

const FormRegister = ({}: Props) => {
  const methods = useForm<registerForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: registerForm) => {
    console.log(data); // enviar data a la api
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <InputForm label="Nombre" name="name" type="text" placeholder="Ingresa tu nombre" />
        <InputForm label="Apellido" name="lastname" type="text" placeholder="Ingresa tu apellido" />
        <InputForm label="E-mail" name="email" type="email" placeholder="Ingresa tu email (uc)" />
        <InputForm label="Constraseña" name="password" type="password" placeholder="Crea tu contraseña" />
        <InputForm
          label="Confirma tu constraseña"
          name="confirm_password"
          type="password"
          placeholder="Crea tu constraseña"
        />
        <div className="mt-6">
          <ButtonLarge>Registrarse</ButtonLarge>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-500 hover:underline dark:text-blue-300">
              Inicia sesión
            </a>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};
export default FormRegister;
