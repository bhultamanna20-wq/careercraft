import Navbar from '../components/Navbar';

function About() {
  const stats = [
    { value: '5K+', label: 'Resumes Created' },
    { value: '90%', label: 'User Satisfaction' },
    { value: '10+', label: 'Templates Planned' },
    { value: '4.8/5', label: 'Feedback Rating' },
  ];

  const drivers = [
    { emoji: '🎯', title: 'Clarity First', desc: 'We help you present your skills and experience clearly, without design guesswork.' },
    { emoji: '⚡', title: 'Speed Matters', desc: 'Build a complete, structured resume in minutes, not hours.' },
    { emoji: '🌍', title: 'Built For Everyone', desc: 'Designed with students and first-time job seekers in mind — simple and guided.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <span className="inline-block text-xs font-semibold tracking-wide text-teal-700 mb-3">OUR MISSION</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Empowering Job Seekers Everywhere</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          CareerCraft is built to bridge the gap between talented individuals and their dream
          careers through smart, structured resume building.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-gradient-to-br from-teal-100 to-slate-100 rounded-2xl h-56 sm:h-72 flex items-center justify-center text-7xl shadow-inner">
          🤝
        </div>
      </div>

      <section className="bg-gray-100 py-14">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center px-4">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{s.value}</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-10">What Drives Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {drivers.map((d, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-3">{d.emoji}</div>
              <h3 className="font-semibold text-slate-800 mb-2">{d.title}</h3>
              <p className="text-gray-500 text-sm">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;