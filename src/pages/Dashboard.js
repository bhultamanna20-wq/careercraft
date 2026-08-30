import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { createResume, getUserResumes, deleteResume } from '../utils/resumeService';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserAndResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserAndResumes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
    const userResumes = await getUserResumes(user.id);
    setResumes(userResumes);
    setLoading(false);
  };

  const handleCreateNew = async () => {
    const newResume = await createResume(user.id);
    navigate(`/editor/${newResume.resume_id}`);
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    await deleteResume(resumeId);
    setResumes(resumes.filter((r) => r.resume_id !== resumeId));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile header card */}
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-700 text-white flex items-center justify-center text-xl font-bold">
              {initial}
            </div>
            <div>
              <h2 className="font-semibold text-lg text-slate-800">{displayName}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-teal-700 text-white px-5 py-2 rounded-md font-semibold hover:bg-teal-800 transition"
          >
            + Build New Resume
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6 text-sm font-medium">
          <button
            onClick={() => setTab('overview')}
            className={`pb-3 ${tab === 'overview' ? 'border-b-2 border-teal-700 text-slate-800' : 'text-gray-400'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('resumes')}
            className={`pb-3 ${tab === 'resumes' ? 'border-b-2 border-teal-700 text-slate-800' : 'text-gray-400'}`}
          >
            My Resumes ({resumes.length})
          </button>
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Account Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Total Resumes</p>
                  <p className="text-slate-700 font-medium">{resumes.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Account Status</p>
                  <p className="text-teal-700 font-medium">● Active</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-semibold mb-2">Ready to build?</h3>
              <p className="text-slate-300 text-sm mb-4">
                Start a new resume or continue editing an existing one.
              </p>
              <button
                onClick={() => setTab('resumes')}
                className="bg-white text-slate-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-100"
              >
                View My Resumes →
              </button>
            </div>
          </div>
        )}

        {tab === 'resumes' && (
          <div>
            {resumes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-10 text-center">
                <p className="text-gray-500 mb-4">No resumes yet. Create your first one!</p>
                <button onClick={handleCreateNew} className="bg-teal-700 text-white px-6 py-2 rounded-md hover:bg-teal-800">
                  + Create New Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumes.map((resume) => (
                  <div key={resume.resume_id} className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{resume.resume_title}</h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Last updated: {new Date(resume.updated_date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4 text-sm font-medium">
  <button onClick={() => navigate(`/editor/${resume.resume_id}`)} className="text-teal-700 hover:underline">
    Edit
  </button>
  <button onClick={() => navigate(`/jobs/${resume.resume_id}`)} className="text-slate-700 hover:underline">
    Job Matches
  </button>
  <button onClick={() => handleDelete(resume.resume_id)} className="text-red-600 hover:underline">
    Delete
  </button>
</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;