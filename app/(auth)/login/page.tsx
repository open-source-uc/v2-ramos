import FormLogin from "@/app/components/forms/FormLogin";

export default async function Page() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <FormLogin>
            </FormLogin>
        </div>
    )
}

export const runtime = "edge"