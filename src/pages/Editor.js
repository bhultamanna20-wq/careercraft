import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPersonalDetails, savePersonalDetails,
  getEducation, addEducation, deleteEducation,
  getSkills, addSkill, deleteSkill,
} from '../utils/resumeService';

function Editor() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    linkedin_url: '',
    portfolio_url: '',
  });

  const [educationList, setEducationList] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: '',
    college: '',
    university: '',
    passing_year: '',
    percentage: '',
  });

  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill_name: '', skill_level: 'Intermediate' });

  useEffect(() => {
    loadStepData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId, step]);

  const loadStepData = async () => {
    setLoading(true);
    if (step === 1) {
      const details = await getPersonalDetails(resumeId);
      if (details) setPersonalInfo(details);
    } else if (step === 2) {
      const eduData = await getEducation(resumeId);
      setEducationList(eduData);
    } else if (step === 3) {
      const skillsData = await getSkills(resumeId);
      setSkillsList(skillsData);
    }
    setLoading(false);
  };

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const saveAndNext = async () => {
    setSaving(true);
    await savePersonalDetails(resumeId, personalInfo);
    setSaving(false);
    setStep(2);
  };

  const handleNewEducationChange = (e) => {
    setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
  };

  const handleAddEducation = async () => {
    if (!newEducation.degree || !newEducation.college) return;
    const added = await addEducation(resumeId, newEducation);
    setEducationList([...educationList, added]);
    setNewEducation({ degree: '', college: '', university: '', passing_year: '', percentage: '' });
  };

  const handleDeleteEducation = async (educationId) => {
    await deleteEducation(educationId);
    setEducationList(educationList.filter((e) => e.education_id !== educationId));
  };

  const handleNewSkillChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleAddSkill = async () => {
    if (!newSkill.skill_name) return;
    const added = await addSkill(resumeId, newSkill);
    setSkillsList([...skillsList, added]);
    setNewSkill({ skill_name: '', skill_level: 'Intermediate' });
  };

  const handleDeleteSkill = async (skillId) => {
    await deleteSkill(skillId);
    setSkillsList(skillsList.filter((s) => s.skill_id !== skillId));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-lg shadow-md">
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

            <input type="text" name="full_name" placeholder="Full Name" value={personalInfo.full_name || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
            <input type="email" name="email" placeholder="Email" value={personalInfo.email || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
            <input type="text" name="phone" placeholder="Phone Number" value={personalInfo.phone || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
            <input type="text" name="address" placeholder="Address" value={personalInfo.address || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
            <input type="date" name="dob" value={personalInfo.dob || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
            <input type="text" name="linkedin_url" placeholder="LinkedIn URL" value={personalInfo.linkedin_url || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
            <input type="text" name="portfolio_url" placeholder="Portfolio/GitHub URL" value={personalInfo.portfolio_url || ''} onChange={handlePersonalInfoChange} className="w-full mb-6 p-2 border rounded" />

            <button onClick={saveAndNext} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {saving ? 'Saving...' : 'Save & Next'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Education</h2>

            {educationList.map((edu) => (
              <div key={edu.education_id} className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2">
                <div>
                  <p className="font-semibold">{edu.degree} - {edu.college}</p>
                  <p className="text-sm text-gray-500">{edu.university} | {edu.passing_year} | {edu.percentage}%</p>
                </div>
                <button onClick={() => handleDeleteEducation(edu.education_id)} className="text-red-600 text-sm">Delete</button>
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
              <input type="text" name="degree" placeholder="Degree (e.g. B.Tech)" value={newEducation.degree} onChange={handleNewEducationChange} className="w-full mb-3 p-2 border rounded" />
              <input type="text" name="college" placeholder="College Name" value={newEducation.college} onChange={handleNewEducationChange} className="w-full mb-3 p-2 border rounded" />
              <input type="text" name="university" placeholder="University" value={newEducation.university} onChange={handleNewEducationChange} className="w-full mb-3 p-2 border rounded" />
              <input type="text" name="passing_year" placeholder="Passing Year" value={newEducation.passing_year} onChange={handleNewEducationChange} className="w-full mb-3 p-2 border rounded" />
              <input type="text" name="percentage" placeholder="Percentage/CGPA" value={newEducation.percentage} onChange={handleNewEducationChange} className="w-full mb-4 p-2 border rounded" />
              <button onClick={handleAddEducation} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                + Add Education
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="text-gray-500">Back</button>
              <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Next (Skills)
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {skillsList.map((skill) => (
                <span key={skill.skill_id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {skill.skill_name} ({skill.skill_level})
                  <button onClick={() => handleDeleteSkill(skill.skill_id)} className="text-red-600 font-bold">×</button>
                </span>
              ))}
            </div>

            <div className="border-t pt-4">
              <input
                type="text"
                name="skill_name"
                placeholder="Skill (e.g. React, Python)"
                value={newSkill.skill_name}
                onChange={handleNewSkillChange}
                className="w-full mb-3 p-2 border rounded"
              />
              <select
                name="skill_level"
                value={newSkill.skill_level}
                onChange={handleNewSkillChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button onClick={handleAddSkill} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                + Add Skill
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(2)} className="text-gray-500">Back</button>
              <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Next (Projects)
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Projects (Coming next)</h2>
            <button onClick={() => setStep(3)} className="text-gray-500">Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;