import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search courses..."
          className="w-full dark:bg-gray-700  dark:text-slate-100 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="w-5 h-5 dark:bg-gray-700 text-gray-400 absolute left-3 top-2.5" />
      </div>
    );
  }