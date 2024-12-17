"use client";

const sendLogin = async (email: string, password: string) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('No se pudo iniciar sesión');
        }

        const data = await response.json();
        console.log('Weho!', data);
        // cookie, token ... 
    } catch (error) {
        console.error('Error:', error);
        
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-700">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg dark:bg-gray-600">
                <h1 className="text-center p-2 text-4xl text-bold text-cyan-500 dark:text-cyan-300"
                    style={{
                        fontFamily: "Trebuchet MS, sans-serif",
                    }}>UC</h1>
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-500 dark:text-gray-200"
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-500 dark:text-gray-200"
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Ingresar
                        </button>
                    </div>

                    <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
                        <p>
                            ¿No tienes una cuenta?{" "}
                            <a
                                href="/registro"
                                className="text-blue-500 hover:underline dark:text-blue-300"
                            >
                                Regístrate
                            </a>
                        </p>
                        <p className="mt-2">
                            <a
                                href="#"
                                className="text-blue-500 hover:underline dark:text-blue-300"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}