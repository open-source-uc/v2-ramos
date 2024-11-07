import DarkModeSelector from "./../components/DarkModeSelector";

export default function Home() {
  return (
    <header className="flex h-14 w-full items-center justify-between bg-celeste px-4">
      <div className="flex items-center space-x-2">
        <img src="/assets/logo.jpg" alt="Logo" className="h-6 w-6" />
        <h1 className="font-bold text-white">Ramos UC</h1>
      </div>

      <div className="flex">
        <DarkModeSelector />
        <button className="mx-4 rounded bg-amarillo px-2 py-1 text-sm text-white">Login</button>
      </div>
    </header>
  );
}
