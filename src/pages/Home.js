import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  const features = [
    { emoji: '📊', title: 'Real-time Resume Score', desc: 'Check your resume quality score instantly as you type and pass automated screening systems effortlessly.' },
    { emoji: '🎯', title: 'AI-Powered Suggestions', desc: 'Get smart, professional rewrites for your resume content in one click, tailored to your role.' },
    { emoji: '📄', title: '1-Click PDF Export', desc: 'Export recruiter-ready PDF resumes formatted to global hiring standards, ready to send.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1 border border-teal-200 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🚀 #1 AI-Powered Resume Builder
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-4">
            Craft Professional Resumes & Land Your Dream Job Fast
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-lg">
            Build polished, AI-enhanced resumes tailored to your skills and experience — no design
            skills needed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/signup" className="bg-teal-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-teal-800 transition">
              Create Resume Free →
            </Link>
            <Link to="/about" className="bg-slate-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-900 transition">
              How It Works
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-100 to-slate-100 rounded-2xl h-64 sm:h-80 flex items-center justify-center text-7xl shadow-inner">
          📝
        </div>
      </section>

      <section className="bg-slate-800 py-6">
        <p className="text-center text-slate-300 text-xs sm:text-sm tracking-wide font-medium">
          TRUSTED BY JOB SEEKERS BUILDING THEIR CAREERS EVERY DAY
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-10">
          Why Jobseekers Choose CareerCraft
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-slate-100 to-teal-50 h-32 flex items-center justify-center text-5xl">
                {f.emoji}
              </div>
              <div className="bg-slate-800 text-white p-5">
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-300 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;