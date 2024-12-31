import { FormProvider, useForm } from "react-hook-form";
import { commentSchema, CommentForm } from "../schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import InputForm from "./InputForm";
import ButtonLarge from "./ButtonLarge";

type Props = {};

const FormComment = ({}: Props) => {
  const methods = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
      vote: undefined,
    },
  });

  const onSubmit = (data: CommentForm) => {
    // lógica para enviar el comentario a la API
    console.log(data);
  };
  // html de https://flowbite.com/blocks/publisher/comments/
  return (
    <FormProvider {...methods}>
      <div className="dark: mx-auto max-w-2xl bg-slate-100 px-4 py-8 dark:bg-gray-800 dark:text-white">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="mb-4">
            <label htmlFor="comment" className="sr-only">
              Tu comentario
            </label>
            <textarea
              {...methods.register("comment")}
              id="comment"
              rows={6}
              className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
              placeholder="Escribe tu comentario ..."
            />
            {methods.formState.errors.comment && (
              <span className="text-sm text-red-500">{methods.formState.errors.comment.message}</span>
            )}
          </div>

          <div className="mb-4 flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Valora este curso</span>
            <button
              type="button"
              onClick={() => methods.setValue("vote", "positive")}
              className={`flex items-center space-x-2 rounded-lg p-2 transition-colors ${
                methods.watch("vote") === "positive"
                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ThumbsUp size={20} />
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("vote", "negative")}
              className={`flex items-center space-x-2 rounded-lg p-2 transition-colors ${
                methods.watch("vote") === "negative"
                  ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ThumbsDown size={20} />
            </button>
          </div>

          {methods.formState.errors.vote && (
            <span className="mb-4 block text-sm text-red-500">{methods.formState.errors.vote.message}</span>
          )}

          <ButtonLarge>Enviar comentario</ButtonLarge>
        </form>
      </div>
    </FormProvider>
  );
};

export default FormComment;
