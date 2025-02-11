"use client"

import { createUser } from "@/app/actions/auth"
import { useActionState } from "react"

export default function CreateUserForm() {

    const [state, formAction, pending] = useActionState(createUser, {
        errors: 0,
        success: 0,
        message: '',
        data: {
            email: '',
            password: '',
            nickname: '',
            admission_year: '',
            carrer_name: ''
        }
    })

    return (

        <form action={formAction} className="p-5">
            {pending.toString()}
            {JSON.stringify(state.message)}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo UC</label>
                    <input type="email" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required name="email" defaultValue={state.data.email} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                    <input type="password" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required name="password" defaultValue={state.data.password} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de ususario</label>
                    <input type="text" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required name="nickname" defaultValue={state.data.nickname} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Año de admision</label>
                    <input type="numer" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required name="admission_year" min={2013} defaultValue={state.data.admission_year} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de carrera</label>
                    <input type="text" id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="flowbite.com" required name="carrer_name" defaultValue={state.data.carrer_name} />
                </div>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>

    )
}