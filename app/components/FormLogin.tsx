import { FormProvider, useForm } from "react-hook-form";
import { loginSchema, loginForm } from "../schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "./InputForm";
import ButtonLarge from "./ButtonLarge";

// Las librerias zod y react-hook sirven para manejar de mejor manera los formularios
// zod valida los datos ingresados en el formulario [crea objetos de validacion]
// react-hook-form se encarga de manejar el estado del formulario, optimizando la renderizacion

type Props = {};

const FormLogin = ({}: Props) => {
  const methods = useForm<loginForm>({
    resolver: zodResolver(loginSchema), // validacion de los datos ingresados segun el esquema ../schemas/login.ts
  });

  const onSubmit = (data: loginForm) => {
    // tenemos el formato email : string, password : string
    // ej : {email: "alberto@uc.cl", password: "123456"}
    console.log(data);
  };
  // formProvider permite acceder a los estados del formulario desde los componentes hijos
  // en este caso los Inputs [para validar los datos]
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <InputForm label="E-mail" name="email" type="email" placeholder="Ingresa tu correo" />
        <InputForm label="Contraseña" name="password" type="password" placeholder="Ingresa tu contraseña" />
        <div className="mt-6">
          <ButtonLarge>Ingresar</ButtonLarge>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            ¿No tienes una cuenta?{" "}
            <a href="/registro" className="text-blue-500 hover:underline dark:text-blue-300">
              Regístrate
            </a>
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue-500 hover:underline dark:text-blue-300">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};
export default FormLogin;
