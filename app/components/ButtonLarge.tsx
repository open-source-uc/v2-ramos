import React from "react";

type Props = {
  children: React.ReactNode;
};

const ButtonLarge = ({ children }: Props) => {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      {children}
    </button>
  );
};

export default ButtonLarge;
