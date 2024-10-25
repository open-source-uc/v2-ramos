export default function Home() {
  return (
    <header className="w-full bg-lime-500 h-10 flex items-center justify-between px-4">

      <div className="flex items-center space-x-2">
        <img src="/assets/logo.jpg" alt="Logo" className="h-6 w-6" />
        <h1 className="text-white font-bold">Ramos UC</h1>
      </div>

      <button className="bg-white text-lime-500 text-sm px-2 py-1 rounded">
        Login
      </button>
    </header>
  );
}
