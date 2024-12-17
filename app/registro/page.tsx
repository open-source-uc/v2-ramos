"use client";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-700">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 dark:bg-gray-600">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 dark:text-gray-200">
          Registro de Usuario
        </h2>
        <form>
          {/* nombre */}
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-500 dark:text-gray-200"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          {/* apellido */}
          <div className="mb-4">
            <label
              htmlFor="apellido"
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            >
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-500 dark:text-gray-200"
              placeholder="Ingresa tu apellido"
              required
            />
          </div>

          {/* mail */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-500 dark:text-gray-200"
              placeholder="Ingresa tu correo"
              required
            />
          </div>

          {/* pass */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-500 dark:text-gray-200"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* confirm pass */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-500 dark:text-gray-200"
              placeholder="Confirma tu contraseña"
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}