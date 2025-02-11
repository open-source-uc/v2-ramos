"use client"

import { createReview } from "@/app/actions/reviews"
import { useActionState } from "react"

export default function ReviewForm({ course_id }: { course_id: number }) {

    const [state, action, pending] = useActionState(createReview, {
        data: {
            course_id: course_id,
            year: 0,
            section_number: 0,
            liked: false,
            comment: "",
            estimated_credits: 0
        },
        errors: 0,
        success: 0,
        message: ''
    })

    return (
        <form action={action} className="p-5">
            {pending.toString()}
            {JSON.stringify(state.message)}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Año</label>
                    <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required name="year" defaultValue={state.data.year} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seccion</label>
                    <input type="text" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required name="section_number" defaultValue={state.data.section_number} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Te gusto</label>
                    <input type="checkbox" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="admission_year" defaultChecked={state.data.liked} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Creditos estimados</label>
                    <input type="range" min={1} max={100} id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="flowbite.com" required name="estimated_credits" defaultValue={state.data.estimated_credits} />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comentario</label>
                    <input type="text" id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required name="comment" defaultValue={state.data.comment} />
                </div>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    )
}