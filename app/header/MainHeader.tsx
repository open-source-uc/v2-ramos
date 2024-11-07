export default function Home() {
  return (
    <header className="flex h-10 w-full items-center justify-between bg-celeste px-4">
      <div className="flex items-center space-x-2">
        <img src="/assets/logo.jpg" alt="Logo" className="h-6 w-6" />
        <a href="/"> 
        <h1 className="text-white font-bold">Ramos UC</h1>
        </a>
      </div>

      <button className="bg-amarillo text-white text-sm px-2 py-1 rounded hover:bg-orange-200">
        Login
      </button>
    </header>
  );
}
