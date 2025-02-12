export default function Form({
  action,
  children,
}: {
  action: (formData: FormData) => void;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl border-4 border-red-500 bg-gray-800 p-8 shadow-xl"
    >
      {children}
    </form>
  );
}
