import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPersonalDetails, savePersonalDetails,
  getEducation, addEducation, deleteEducation,
  getSkills, addSkill, deleteSkill,
  getProjects, addProject, deleteProject,
  getExperience, addExperience, deleteExperience,
} from '../utils/resumeService';
import Navbar from '../components/Navbar';

function Editor() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  const [personalInfo, setPersonalInfo] = useState({
    full_name: '', email: '', phone: '', address: '', dob: '', linkedin_url: '', portfolio_url: '',
  });

  const [educationList, setEducationList] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: '', college: '', university: '', passing_year: '', percentage: '',
  });

  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill_name: '', skill_level: 'Intermediate' });

  const [projectsList, setProjectsList] = useState([]);
  const [newProject, setNewProject] = useState({
    project_title: '', description: '', technologies_used: '', project_url: '', start_date: '', end_date: '',
  });

  const [experienceList, setExperienceList] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company_name: '', position: '', start_date: '', end_date: '', description: '',
  });

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
      setEducationList(await getEducation(resumeId));
    } else if (step === 3) {
      setSkillsList(await getSkills(resumeId));
    } else if (step === 4) {
      setProjectsList(await getProjects(resumeId));
    } else if (step === 5) {
      setExperienceList(await getExperience(resumeId));
    }
    setLoading(false);
  };

  // ===== Personal Info =====
  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };
  const saveAndNext = async () => {
    setSaving(true);
    await savePersonalDetails(resumeId, personalInfo);
    setSaving(false);
    setStep(2);
  };

  // ===== Education =====
  const handleNewEducationChange = (e) => {
    setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
  };
  const handleAddEducation = async () => {
    if (!newEducation.degree || !newEducation.college) return;
    const added = await addEducation(resumeId, newEducation);
    setEducationList([...educationList, added]);
    setNewEducation({ degree: '', college: '', university: '', passing_year: '', percentage: '' });
  };
  const handleDeleteEducation = async (id) => {
    await deleteEducation(id);
    setEducationList(educationList.filter((e) => e.education_id !== id));
  };

  // ===== Skills =====
  const handleNewSkillChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };
  const handleAddSkill = async () => {
    if (!newSkill.skill_name) return;
    const added = await addSkill(resumeId, newSkill);
    setSkillsList([...skillsList, added]);
    setNewSkill({ skill_name: '', skill_level: 'Intermediate' });
  };
  const handleDeleteSkill = async (id) => {
    await deleteSkill(id);
    setSkillsList(skillsList.filter((s) => s.skill_id !== id));
  };

  // ===== Projects =====
  const handleNewProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };
  const handleAddProject = async () => {
    if (!newProject.project_title) return;
    const added = await addProject(resumeId, newProject);
    setProjectsList([...projectsList, added]);
    setNewProject({ project_title: '', description: '', technologies_used: '', project_url: '', start_date: '', end_date: '' });
  };
  const handleDeleteProject = async (id) => {
    await deleteProject(id);
    setProjectsList(projectsList.filter((p) => p.project_id !== id));
  };

  // ===== Experience =====
  const handleNewExperienceChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };
  const handleAddExperience = async () => {
    if (!newExperience.company_name || !newExperience.position) return;
    const added = await addExperience(resumeId, newExperience);
    setExperienceList([...experienceList, added]);
    setNewExperience({ company_name: '', position: '', start_date: '', end_date: '', description: '' });
  };
  const handleDeleteExperience = async (id) => {
    await deleteExperience(id);
    setExperienceList(experienceList.filter((x) => x.experience_id !== id));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
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
                <button onClick={handleAddEducation} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Education</button>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="text-gray-500">Back</button>
                <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Next (Skills)</button>
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
                <input type="text" name="skill_name" placeholder="Skill (e.g. React, Python)" value={newSkill.skill_name} onChange={handleNewSkillChange} className="w-full mb-3 p-2 border rounded" />
                <select name="skill_level" value={newSkill.skill_level} onChange={handleNewSkillChange} className="w-full mb-4 p-2 border rounded">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button onClick={handleAddSkill} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Skill</button>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="text-gray-500">Back</button>
                <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Next (Projects)</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Projects</h2>
              {projectsList.map((proj) => (
                <div key={proj.project_id} className="flex justify-between items-start bg-gray-50 p-3 rounded mb-2">
                  <div>
                    <p className="font-semibold">{proj.project_title}</p>
                    <p className="text-sm text-gray-600">{proj.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Tech: {proj.technologies_used}</p>
                  </div>
                  <button onClick={() => handleDeleteProject(proj.project_id)} className="text-red-600 text-sm">Delete</button>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <input type="text" name="project_title" placeholder="Project Title" value={newProject.project_title} onChange={handleNewProjectChange} className="w-full mb-3 p-2 border rounded" />
                <textarea name="description" placeholder="Description" value={newProject.description} onChange={handleNewProjectChange} className="w-full mb-3 p-2 border rounded" rows="3" />
                <input type="text" name="technologies_used" placeholder="Technologies Used (e.g. React, Node.js)" value={newProject.technologies_used} onChange={handleNewProjectChange} className="w-full mb-3 p-2 border rounded" />
                <input type="text" name="project_url" placeholder="Project URL (optional)" value={newProject.project_url} onChange={handleNewProjectChange} className="w-full mb-3 p-2 border rounded" />
                <div className="flex gap-3 mb-4">
                  <input type="date" name="start_date" value={newProject.start_date} onChange={handleNewProjectChange} className="w-1/2 p-2 border rounded" />
                  <input type="date" name="end_date" value={newProject.end_date} onChange={handleNewProjectChange} className="w-1/2 p-2 border rounded" />
                </div>
                <button onClick={handleAddProject} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Project</button>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(3)} className="text-gray-500">Back</button>
                <button onClick={() => setStep(5)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Next (Experience)</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Experience</h2>
              {experienceList.map((exp) => (
                <div key={exp.experience_id} className="flex justify-between items-start bg-gray-50 p-3 rounded mb-2">
                  <div>
                    <p className="font-semibold">{exp.position} - {exp.company_name}</p>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{exp.start_date} to {exp.end_date || 'Present'}</p>
                  </div>
                  <button onClick={() => handleDeleteExperience(exp.experience_id)} className="text-red-600 text-sm">Delete</button>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <input type="text" name="company_name" placeholder="Company Name" value={newExperience.company_name} onChange={handleNewExperienceChange} className="w-full mb-3 p-2 border rounded" />
                <input type="text" name="position" placeholder="Position/Role" value={newExperience.position} onChange={handleNewExperienceChange} className="w-full mb-3 p-2 border rounded" />
                <div className="flex gap-3 mb-3">
                  <input type="date" name="start_date" value={newExperience.start_date} onChange={handleNewExperienceChange} className="w-1/2 p-2 border rounded" />
                  <input type="date" name="end_date" value={newExperience.end_date} onChange={handleNewExperienceChange} className="w-1/2 p-2 border rounded" />
                </div>
                <textarea name="description" placeholder="Description of your role" value={newExperience.description} onChange={handleNewExperienceChange} className="w-full mb-4 p-2 border rounded" rows="3" />
                <button onClick={handleAddExperience} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Experience</button>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(4)} className="text-gray-500">Back</button>
                <button onClick={() => navigate('/dashboard')} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                  Finish & Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;