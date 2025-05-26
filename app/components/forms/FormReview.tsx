import ButtonSubmit from "../ui/ButtonSubmit";
import Form from "../ui/Form";
import Input from "../ui/Input";

export default function FormReview({
  state,
  action,
}: {
  action: (formData: FormData) => void;
  state: {
    errors: number;
    success: number;
    message: string;
    body: {
      course_id: number;
      year: number;
      section_number: number;
      liked: boolean;
      comment: string;
      estimated_credits: number;
    };
  };
}) {
  return (
    <Form action={action}>
      <Input label="Año" name="year" type="number" defaultValue={state.body.year} />
      <Input label="Sección" name="section_number" type="number" defaultValue={state.body.section_number} />
      <Input label="Comentario" name="comment" type="text" defaultValue={state.body.comment} />
      <Input
        label="Créditos estimados"
        name="estimated_credits"
        type="number"
        defaultValue={state.body.estimated_credits}
      />
      <Input label="Te gusto el curso?" name="liked" type="checkbox" defaultChecked={state.body.liked} />
      <ButtonSubmit processing={<span>Cargando...</span>}>Inviar</ButtonSubmit>
    </Form>
  );
}
