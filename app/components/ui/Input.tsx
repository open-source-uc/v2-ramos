interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
}

export default function Input({ label, name, type = "text", ...props }: InputProps) {
    return (
        <div className="w-full flex flex-col space-y-2">
            <label htmlFor={name} className="text-lg font-semibold text-white">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                className="w-full p-4 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                {...props}
            />
        </div>
    );
}
