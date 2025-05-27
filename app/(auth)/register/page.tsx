import FormRegister from "@/app/components/forms/FormRegister";

export default async function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <FormRegister />
    </div>
  );
}

export const runtime = "edge";
