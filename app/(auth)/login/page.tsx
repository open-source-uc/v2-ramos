import FormLogin from "@/app/components/forms/FormLogin";

export default async function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <FormLogin />
    </div>
  );
}

export const runtime = "edge";
