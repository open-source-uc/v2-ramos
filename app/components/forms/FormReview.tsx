import Form from "../ui/Form";
import ButtonSubmit from "../ui/ButtonSubmit";
import Input from "../ui/Input";

export default function FormReview({ state, action }: {
    action: (formData: FormData) => void
    state: {
        errors: number,
        success: number,
        message: string,
        body: {
            course_id: number;
            year: number;
            section_number: number;
            liked: boolean;
            comment: string;
            estimated_credits: number;
        }
    }
}) {
    return (
        <Form action={action}>
            <Input label="Año" name="year" type="number" defaultValue={state.body.year}></Input>
            <Input label="Sección" name="section_number" type="number" defaultValue={state.body.section_number}></Input>
            <Input label="Comentario" name="comment" type="text" defaultValue={state.body.comment}></Input>
            <Input label="Créditos estimados" name="estimated_credits" type="number" defaultValue={state.body.estimated_credits}></Input>
            <Input label="Te gusto el curso?" name="liked" type="checkbox" defaultChecked={state.body.liked}></Input>
            <ButtonSubmit processing={<span>Cargando...</span>}>Inviar</ButtonSubmit>
        </Form>
    )
}