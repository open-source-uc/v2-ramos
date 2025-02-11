
export default function ReviewForm({ action }: { action: (formData: FormData) => void }) {

    return (
        <form action={action}>
            <label htmlFor="year">Año</label>
            <input type="number" name="year" id="year" />
            <label htmlFor="section_number">Número de sección</label>
            <input type="number" name="section_number" id="section_number" />
            <label htmlFor="liked">¿Te gustó?</label>
            <input type="checkbox" name="liked" id="liked" />
            <label htmlFor="comment">Comentario</label>
            <textarea name="comment" id="comment" />
            <label htmlFor="estimated_credits">Créditos estimados</label>
            <input type="number" name="estimated_credits" id="estimated_credits" />
            <button type="submit">Enviar</button>
        </form>
    )
}