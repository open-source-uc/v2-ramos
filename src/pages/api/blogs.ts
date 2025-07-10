import type { APIRoute } from 'astro';

interface BlogCreateRequest {
  title: string;
  faculty: string;
  readtime: string;
  description: string;
  content: string;
  contentType: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const requestData = await request.json() as BlogCreateRequest;
    const { title, faculty, readtime, description, content, contentType } = requestData;

    // Validar que todos los campos requeridos estén presentes
    if (!title || !faculty || !readtime || !description || !content) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Todos los campos son obligatorios' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validar que el tiempo de lectura sea un número válido
    const readTimeNumber = parseInt(readtime);
    if (isNaN(readTimeNumber) || readTimeNumber <= 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'El tiempo de lectura debe ser un número válido' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Aquí podrías añadir lógica para:
    // 1. Validar que el usuario esté autenticado
    // 2. Guardar el blog en la base de datos
    // 3. Generar un slug único
    // 4. Procesar el contenido MDX
    
    // Por ahora, simulamos una respuesta exitosa
    const blogData = {
      id: Date.now(), // ID temporal
      title,
      faculty,
      readtime: readTimeNumber,
      description,
      content,
      contentType,
      createdAt: new Date().toISOString(),
      slug: title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    };

    // Aquí integrarías con tu sistema de base de datos
    // Por ejemplo, si usas un ORM o una base de datos específica
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: blogData,
        message: 'Blog creado exitosamente' 
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error al crear el blog:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Endpoint para obtener blogs (opcional)
export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URLSearchParams(url.search);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const faculty = searchParams.get('faculty');

    // Aquí implementarías la lógica para obtener blogs de la base de datos
    // Por ahora retornamos un ejemplo
    
    const blogs = [
      // Ejemplo de estructura de blog
      {
        id: 1,
        title: "Mi experiencia en Ingeniería de Sistemas",
        faculty: "Ingeniería",
        readtime: 5,
        description: "Comparto mi experiencia estudiando Ingeniería de Sistemas",
        createdAt: new Date().toISOString(),
        slug: "mi-experiencia-en-ingenieria-de-sistemas"
      }
    ];

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: blogs,
        pagination: {
          page,
          limit,
          total: blogs.length,
          pages: Math.ceil(blogs.length / limit)
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error al obtener blogs:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
