import Navbar from '../components/Navbar';

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">About CareerCraft</h1>
        <p className="text-gray-600 leading-relaxed">
          CareerCraft is an AI-powered resume builder designed to help students and
          job seekers create professional resumes quickly and easily.
        </p>
      </div>
    </div>
  );
}

export default About;