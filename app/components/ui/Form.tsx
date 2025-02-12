export default function Form({ action, children }: { action: (formData: FormData) => void; children: React.ReactNode }) {
    return (
        <form
            action={action}
            className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-xl border-4 border-red-500 gap-3 flex flex-col"
        >
            {children}
        </form>
    );
}
