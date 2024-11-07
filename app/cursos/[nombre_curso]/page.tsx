"use client";

import { useParams, useRouter } from 'next/navigation';

export default function CoursePage(){
    const curso = useParams();
    const nombre_curso = curso.nombre_curso;

    return (
    <div className='pt-5 text-center'>
    <h1 className='text-4xl font-bold my-5 mx-5'>Cursos {nombre_curso}</h1>
    <div id='buscador' className='flex justify-center m-4 py-4'>
    <input className='border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none'
    type='search' name='search' placeholder='Buscar por nombre ...'/>
    <button type='submit' className='bg-amarillo rounded-md px-3 mx-3 hover:bg-orange-200'>Buscar </button>
    </div>
    <svg className='text-gray-600 h-4 w-4 fill-current' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <path fill='none' d='M0 0h24v24H0z'/>
    <path d='M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7c1.54 0 2.94-.5 4.09-1.35l5.61 5.61 1.41-1.41L14.41 14C15.35 12.85 16 11.44 16 10c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z'/>
    </svg>
    </div>

    );
};


