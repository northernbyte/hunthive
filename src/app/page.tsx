export default function Home() {
  return (
    <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/your-image.jpg)' }}>
      <div className="flex flex-col items-center justify-center h-screen text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">GEAR UP FOR THE HUNT</h1>
        <div className="flex mt-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Search for gear..."
            className="flex-grow p-3 rounded-l-md text-black"
          />
          <button className="bg-green-700 hover:bg-green-800 px-4 py-3 rounded-r-md font-semibold">
            FIND YOUR GEAR
          </button>
        </div>
      </div>
    </main>
  );
}