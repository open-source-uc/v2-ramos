interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export default function Input({ label, name, type = "text", ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col space-y-2">
      <label htmlFor={name} className="text-lg font-semibold text-white">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-lg border-2 border-gray-600 bg-gray-700 p-4 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
        {...props}
      />
    </div>
  );
}
