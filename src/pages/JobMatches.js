import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkills, getJobListings } from '../utils/resumeService';
import Navbar from '../components/Navbar';

function JobMatches() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const loadMatches = async () => {
    setLoading(true);
    const skills = await getSkills(resumeId);
    const jobs = await getJobListings();

    const userSkills = skills.map((s) => s.skill_name.trim().toLowerCase());

    const scored = jobs.map((job) => {
      const requiredSkills = job.required_skills
        .split(',')
        .map((s) => s.trim().toLowerCase());

      const matchedSkills = requiredSkills.filter((rs) => userSkills.includes(rs));
      const missingSkills = requiredSkills.filter((rs) => !userSkills.includes(rs));
      const matchPercent = Math.round((matchedSkills.length / requiredSkills.length) * 100);

      return { ...job, matchPercent, matchedSkills, missingSkills };
    });

    scored.sort((a, b) => b.matchPercent - a.matchPercent);
    setMatches(scored);
    setLoading(false);
  };

  const getBadgeColor = (percent) => {
    if (percent >= 70) return 'bg-teal-100 text-teal-800';
    if (percent >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Finding matches...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-slate-800">Smart Job Matches</h1>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-teal-700 hover:underline">
            Back to Dashboard
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Based on the skills in your resume, here are jobs that match your profile.
        </p>

        {matches.length === 0 ? (
          <p className="text-gray-500">No job listings available right now.</p>
        ) : (
          <div className="space-y-4">
            {matches.map((job) => (
              <div key={job.job_id} className="bg-white rounded-xl shadow-md p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company} · {job.location} · {job.job_type}</p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getBadgeColor(job.matchPercent)}`}>
                    {job.matchPercent}% Match
                  </span>
                </div>

                <p className="text-gray-600 text-sm mt-3">{job.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.matchedSkills.map((s, i) => (
                    <span key={i} className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full">✓ {s}</span>
                  ))}
                  {job.missingSkills.map((s, i) => (
                    <span key={i} className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">+ {s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobMatches;