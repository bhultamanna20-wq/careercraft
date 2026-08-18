import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResumeById, updateResume } from './utils/resumeService';

function Editor() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    portfolio: '',
  });

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    const resume = await getResumeById(resumeId);
    if (resume.personal_info && Object.keys(resume.personal_info).length > 0) {
      setPersonalInfo(resume.personal_info);
    }
    setLoading(false);
  };

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const saveAndNext = async () => {
    setSaving(true);
    await updateResume(resumeId, { personal_info: personalInfo });
    setSaving(false);
    setStep(2);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resume Editor</h1>
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:underline">
            Back to Dashboard
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">Step {step} of 5</p>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={personalInfo.fullName}
              onChange={handlePersonalInfoChange}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address (City, State)"
              value={personalInfo.address}
              onChange={handlePersonalInfoChange}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              name="portfolio"
              placeholder="Portfolio/GitHub URL"
              value={personalInfo.portfolio}
              onChange={handlePersonalInfoChange}
              className="w-full mb-6 p-2 border rounded"
            />

            <button
              onClick={saveAndNext}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {saving ? 'Saving...' : 'Save & Next'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Education (Coming next)</h2>
            <button onClick={() => setStep(1)} className="text-gray-500 mr-4">Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;