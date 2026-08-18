import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { createResume, getUserResumes, deleteResume } from '../utils/resumeService';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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
    const confirmDelete = window.confirm('Are you sure you want to delete this resume?');
    if (!confirmDelete) return;
    await deleteResume(resumeId);
    setResumes(resumes.filter((r) => r.resume_id !== resumeId));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold">My Resumes</h1>
          </div>

          <button onClick={handleCreateNew} className="mb-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            + Create New Resume
          </button>

          {resumes.length === 0 ? (
            <p className="text-gray-500">No resumes yet. Create your first one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map((resume) => (
                <div key={resume.resume_id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{resume.resume_title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Last updated: {new Date(resume.updated_date).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/editor/${resume.resume_id}`)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(resume.resume_id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;