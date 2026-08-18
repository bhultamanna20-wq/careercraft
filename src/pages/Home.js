import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-4 leading-tight">
          Build Your Perfect Resume
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-xl mb-8">
          CareerCraft helps you create a professional, AI-enhanced resume in minutes —
          no design skills needed.
        </p>
      </div>
    </div>
  );
}

export default Home;