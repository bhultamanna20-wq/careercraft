import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getResumeById, updateResumeMeta,
  getPersonalDetails, savePersonalDetails,
  getEducation, addEducation, deleteEducation,
  getSkills, addSkill, deleteSkill,
  getProjects, addProject, deleteProject,
  getExperience, addExperience, deleteExperience,
  getCertifications, addCertification, deleteCertification,
  getLanguages, addLanguage, deleteLanguage,
  getAchievements, addAchievement, deleteAchievement,
  getTemplates,
} from '../utils/resumeService';
import Navbar from '../components/Navbar';

const STEPS = [
  { num: 1, label: 'Personal Info' },
  { num: 2, label: 'Summary' },
  { num: 3, label: 'Education' },
  { num: 4, label: 'Skills' },
  { num: 5, label: 'Projects' },
  { num: 6, label: 'Experience' },
  { num: 7, label: 'Certifications' },
  { num: 8, label: 'Languages' },
  { num: 9, label: 'Achievements' },
  { num: 10, label: 'Template' },
];

const EXPERIENCE_TIPS = [
  { title: 'Job Titles & Companies', text: 'List each job you\'ve held, including the company name and dates of employment.' },
  { title: 'Responsibilities & Achievements', text: 'Describe what you did and what you achieved — focus on results, not just duties.' },
  { title: 'Action Verbs & Results', text: 'Start bullet points with strong action verbs and include measurable results where possible.' },
];

const EDUCATION_TIPS = [
  { title: 'Degree', text: 'List your highest degree first, along with the institution and the graduation year.' },
  { title: 'Coursework or Honors', text: 'Mention relevant coursework, honors, or academic achievements if you\'re early in your career.' },
];

const SKILLS_TIPS = [
  { title: 'Hard Skills', text: 'Technical abilities learned through education or practice — software, programming languages, tools, or certifications.' },
  { title: 'Soft Skills', text: 'Personal traits and interpersonal abilities — communication, teamwork, leadership, problem-solving.' },
];

function TipTabs({ tips }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mb-5 border rounded-lg overflow-hidden">
      <div className="flex flex-wrap border-b bg-gray-50">
        {tips.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-1 min-w-[120px] text-xs sm:text-sm font-semibold px-3 py-2 ${
              active === i ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            {t.title.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 p-3">{tips[active].text}</p>
    </div>
  );
}

function Editor() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const [personalInfo, setPersonalInfo] = useState({
    full_name: '', professional_title: '', email: '', phone: '', address: '', dob: '', linkedin_url: '', portfolio_url: '',
  });

  const [summary, setSummary] = useState('');
  
  const [enhancing, setEnhancing] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [newEducation, setNewEducation] = useState({ degree: '', college: '', university: '', passing_year: '', percentage: '' });

  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill_name: '', skill_level: 'Intermediate', skill_type: 'Hard Skill' });

  const [projectsList, setProjectsList] = useState([]);
  const [newProject, setNewProject] = useState({ project_title: '', description: '', technologies_used: '', project_url: '', start_date: '', end_date: '' });

  const [experienceList, setExperienceList] = useState([]);
  const [newExperience, setNewExperience] = useState({ company_name: '', position: '', start_date: '', end_date: '', description: '' });

  const [certList, setCertList] = useState([]);
  const [newCert, setNewCert] = useState({ certificate_name: '', issuing_organization: '', issue_date: '', credential_id: '', credential_url: '' });

  const [languageList, setLanguageList] = useState([]);
  const [newLanguage, setNewLanguage] = useState({ language_name: '', proficiency_level: 'Intermediate' });

  const [achievementList, setAchievementList] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', achievement_date: '' });

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

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
      const r = await getResumeById(resumeId);
      setSummary(r?.summary || '');
    } else if (step === 3) {
      setEducationList(await getEducation(resumeId));
    } else if (step === 4) {
      setSkillsList(await getSkills(resumeId));
    } else if (step === 5) {
      setProjectsList(await getProjects(resumeId));
    } else if (step === 6) {
      setExperienceList(await getExperience(resumeId));
    } else if (step === 7) {
      setCertList(await getCertifications(resumeId));
    } else if (step === 8) {
      setLanguageList(await getLanguages(resumeId));
    } else if (step === 9) {
      setAchievementList(await getAchievements(resumeId));
    } else if (step === 10) {
      const t = await getTemplates();
      setTemplates(t);
      const r = await getResumeById(resumeId);
      setSelectedTemplateId(r?.template_id || null);
    }
    setLoading(false);
  };

  const goToStep = (num) => setStep(num);
  const markCompleteAndGo = (current, next) => {
    if (!completedSteps.includes(current)) setCompletedSteps([...completedSteps, current]);
    setStep(next);
  };

  // Personal Info
  const handlePersonalInfoChange = (e) => setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  const savePersonalAndNext = async () => {
    setSaving(true);
    await savePersonalDetails(resumeId, personalInfo);
    setSaving(false);
    markCompleteAndGo(1, 2);
  };

  // Summary
  const saveSummaryAndNext = async () => {
    setSaving(true);
    await updateResumeMeta(resumeId, { summary });
    setSaving(false);
    markCompleteAndGo(2, 3);
  };
  
  const handleEnhanceSummary = async () => {
    if (!summary.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary, type: 'summary' }),
      });
      const data = await res.json();
      if (data.enhancedText) {
        setSummary(data.enhancedText);
      } else {
        alert('AI enhance failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('AI enhance failed. This feature only works after deploying to Vercel.');
    }
    setEnhancing(false);
  };

  const handleEnhanceExperience = async () => {
    if (!newExperience.description.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newExperience.description, type: 'experience' }),
      });
      const data = await res.json();
      if (data.enhancedText) {
        setNewExperience({ ...newExperience, description: data.enhancedText });
      } else {
        alert('AI enhance failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('AI enhance failed. This feature only works after deploying to Vercel.');
    }
    setEnhancing(false);
  };
  // Education
  const handleNewEducationChange = (e) => setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
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

  // Skills
  const handleNewSkillChange = (e) => setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  const handleAddSkill = async () => {
    if (!newSkill.skill_name) return;
    const added = await addSkill(resumeId, newSkill);
    setSkillsList([...skillsList, added]);
    setNewSkill({ skill_name: '', skill_level: 'Intermediate', skill_type: 'Hard Skill' });
  };
  const handleDeleteSkill = async (id) => {
    await deleteSkill(id);
    setSkillsList(skillsList.filter((s) => s.skill_id !== id));
  };

  // Projects
  const handleNewProjectChange = (e) => setNewProject({ ...newProject, [e.target.name]: e.target.value });
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

  // Experience
  const handleNewExperienceChange = (e) => setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
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

  // Certifications
  const handleNewCertChange = (e) => setNewCert({ ...newCert, [e.target.name]: e.target.value });
  const handleAddCert = async () => {
    if (!newCert.certificate_name) return;
    const added = await addCertification(resumeId, newCert);
    setCertList([...certList, added]);
    setNewCert({ certificate_name: '', issuing_organization: '', issue_date: '', credential_id: '', credential_url: '' });
  };
  const handleDeleteCert = async (id) => {
    await deleteCertification(id);
    setCertList(certList.filter((c) => c.cert_id !== id));
  };

  // Languages
  const handleNewLanguageChange = (e) => setNewLanguage({ ...newLanguage, [e.target.name]: e.target.value });
  const handleAddLanguage = async () => {
    if (!newLanguage.language_name) return;
    const added = await addLanguage(resumeId, newLanguage);
    setLanguageList([...languageList, added]);
    setNewLanguage({ language_name: '', proficiency_level: 'Intermediate' });
  };
  const handleDeleteLanguage = async (id) => {
    await deleteLanguage(id);
    setLanguageList(languageList.filter((l) => l.language_id !== id));
  };

  // Achievements
  const handleNewAchievementChange = (e) => setNewAchievement({ ...newAchievement, [e.target.name]: e.target.value });
  const handleAddAchievement = async () => {
    if (!newAchievement.title) return;
    const added = await addAchievement(resumeId, newAchievement);
    setAchievementList([...achievementList, added]);
    setNewAchievement({ title: '', description: '', achievement_date: '' });
  };
  const handleDeleteAchievement = async (id) => {
    await deleteAchievement(id);
    setAchievementList(achievementList.filter((a) => a.achievement_id !== id));
  };

  // Template
  const handleSelectTemplate = async (templateId) => {
    setSelectedTemplateId(templateId);
    await updateResumeMeta(resumeId, { template_id: templateId });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">

          {/* Sidebar */}
          <div className="md:w-56 shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-slate-800">Resume Editor</h2>
                <button onClick={() => navigate('/dashboard')} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <ul className="space-y-1">
                {STEPS.map((s) => {
                  const isActive = step === s.num;
                  const isDone = completedSteps.includes(s.num);
                  return (
                    <li key={s.num}>
                      <button
                        onClick={() => goToStep(s.num)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-md flex items-center gap-2 transition
                          ${isActive ? 'bg-teal-700 text-white font-medium' : 'text-slate-600 hover:bg-gray-100'}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0
                          ${isActive ? 'bg-white text-teal-700' : isDone ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-500'}`}>
                          {isDone && !isActive ? '✓' : s.num}
                        </span>
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Main form area */}
          <div className="flex-1 bg-white p-5 sm:p-8 rounded-lg shadow-md">
            <p className="text-sm text-gray-500 mb-6">Step {step} of {STEPS.length}</p>

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <input type="text" name="full_name" placeholder="Full Name" value={personalInfo.full_name || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
                <input type="text" name="professional_title" placeholder="Professional Title (e.g. Software Engineer)" value={personalInfo.professional_title || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
                <input type="email" name="email" placeholder="Email" value={personalInfo.email || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
                <input type="text" name="phone" placeholder="Phone Number" value={personalInfo.phone || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
                <input type="text" name="address" placeholder="Address" value={personalInfo.address || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
                <input type="date" name="dob" value={personalInfo.dob || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
                <input type="text" name="linkedin_url" placeholder="LinkedIn URL" value={personalInfo.linkedin_url || ''} onChange={handlePersonalInfoChange} className="w-full mb-4 p-2 border rounded" />
                <input type="text" name="portfolio_url" placeholder="Portfolio/GitHub URL" value={personalInfo.portfolio_url || ''} onChange={handlePersonalInfoChange} className="w-full mb-6 p-2 border rounded" />
                <button onClick={savePersonalAndNext} disabled={saving} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">
                  {saving ? 'Saving...' : 'Save & Next'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
                <p className="text-sm text-gray-500 mb-4">
                  A short introduction giving employers a quick overview of your qualifications.
                </p>
                                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Motivated Computer Science graduate with hands-on experience building web applications..."
                  rows="6"
                  className="w-full mb-3 p-3 border rounded"
                />
                <button
                  onClick={handleEnhanceSummary}
                  disabled={enhancing || !summary.trim()}
                  className="mb-6 bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-md font-medium hover:bg-purple-200 disabled:opacity-50"
                >
                  {enhancing ? '✨ Enhancing...' : '✨ AI Enhance'}
                </button>
                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="text-gray-500">Back</button>
                  <button onClick={saveSummaryAndNext} disabled={saving} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">
                    {saving ? 'Saving...' : 'Save & Next'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                <TipTabs tips={EDUCATION_TIPS} />
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
                  <button onClick={() => setStep(2)} className="text-gray-500">Back</button>
                  <button onClick={() => markCompleteAndGo(3, 4)} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">Next (Skills)</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                <TipTabs tips={SKILLS_TIPS} />
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillsList.map((skill) => (
                    <span key={skill.skill_id} className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                      skill.skill_type === 'Soft Skill' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {skill.skill_name} ({skill.skill_level}) · {skill.skill_type}
                      <button onClick={() => handleDeleteSkill(skill.skill_id)} className="text-red-600 font-bold">×</button>
                    </span>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <input type="text" name="skill_name" placeholder="Skill (e.g. React, Communication)" value={newSkill.skill_name} onChange={handleNewSkillChange} className="w-full mb-3 p-2 border rounded" />
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <select name="skill_type" value={newSkill.skill_type} onChange={handleNewSkillChange} className="p-2 border rounded">
                      <option value="Hard Skill">Hard Skill</option>
                      <option value="Soft Skill">Soft Skill</option>
                    </select>
                    <select name="skill_level" value={newSkill.skill_level} onChange={handleNewSkillChange} className="p-2 border rounded">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <button onClick={handleAddSkill} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Skill</button>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(3)} className="text-gray-500">Back</button>
                  <button onClick={() => markCompleteAndGo(4, 5)} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">Next (Projects)</button>
                </div>
              </div>
            )}

            {step === 5 && (
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
                  <input type="text" name="technologies_used" placeholder="Technologies Used" value={newProject.technologies_used} onChange={handleNewProjectChange} className="w-full mb-3 p-2 border rounded" />
                  <input type="text" name="project_url" placeholder="Project URL (optional)" value={newProject.project_url} onChange={handleNewProjectChange} className="w-full mb-3 p-2 border rounded" />
                  <div className="flex gap-3 mb-4">
                    <input type="date" name="start_date" value={newProject.start_date} onChange={handleNewProjectChange} className="w-1/2 p-2 border rounded" />
                    <input type="date" name="end_date" value={newProject.end_date} onChange={handleNewProjectChange} className="w-1/2 p-2 border rounded" />
                  </div>
                  <button onClick={handleAddProject} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Project</button>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(4)} className="text-gray-500">Back</button>
                  <button onClick={() => markCompleteAndGo(5, 6)} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">Next (Experience)</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Experience</h2>
                <TipTabs tips={EXPERIENCE_TIPS} />
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
                  <textarea name="description" placeholder="Description of your role" value={newExperience.description} onChange={handleNewExperienceChange} className="w-full mb-3 p-2 border rounded" rows="3" />
                  <button
                    onClick={handleEnhanceExperience}
                    disabled={enhancing || !newExperience.description.trim()}
                    className="mb-3 bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-md font-medium hover:bg-purple-200 disabled:opacity-50"
                  >
                    {enhancing ? '✨ Enhancing...' : '✨ AI Enhance'}
                  </button>
                  <br />
                  <button onClick={handleAddExperience} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Experience</button>
                  <button
                    onClick={handleEnhanceExperience}
                    disabled={enhancing || !newExperience.description.trim()}
                    className="mt-2 bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-md font-medium hover:bg-purple-200 disabled:opacity-50"
                  >
                    {enhancing ? '✨ Enhancing...' : '✨ AI Enhance'}
                  </button>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(5)} className="text-gray-500">Back</button>
                  <button onClick={() => markCompleteAndGo(6, 7)} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">Next (Certifications)</button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                {certList.map((cert) => (
                  <div key={cert.cert_id} className="flex justify-between items-start bg-gray-50 p-3 rounded mb-2">
                    <div>
                      <p className="font-semibold">{cert.certificate_name}</p>
                      <p className="text-sm text-gray-600">{cert.issuing_organization} {cert.issue_date && `· ${cert.issue_date}`}</p>
                    </div>
                    <button onClick={() => handleDeleteCert(cert.cert_id)} className="text-red-600 text-sm">Delete</button>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <input type="text" name="certificate_name" placeholder="Certificate Name" value={newCert.certificate_name} onChange={handleNewCertChange} className="w-full mb-3 p-2 border rounded" />
                  <input type="text" name="issuing_organization" placeholder="Issuing Organization" value={newCert.issuing_organization} onChange={handleNewCertChange} className="w-full mb-3 p-2 border rounded" />
                  <input type="date" name="issue_date" value={newCert.issue_date} onChange={handleNewCertChange} className="w-full mb-3 p-2 border rounded" />
                  <input type="text" name="credential_id" placeholder="Credential ID (optional)" value={newCert.credential_id} onChange={handleNewCertChange} className="w-full mb-3 p-2 border rounded" />
                  <input type="text" name="credential_url" placeholder="Credential URL (optional)" value={newCert.credential_url} onChange={handleNewCertChange} className="w-full mb-4 p-2 border rounded" />
                  <button onClick={handleAddCert} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Certification</button>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(6)} className="text-gray-500">Back</button>
                  <button onClick={() => markCompleteAndGo(7, 8)} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">Next (Languages)</button>
                </div>
              </div>
            )}

            {step === 8 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {languageList.map((lang) => (
                    <span key={lang.language_id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {lang.language_name} ({lang.proficiency_level})
                      <button onClick={() => handleDeleteLanguage(lang.language_id)} className="text-red-600 font-bold">×</button>
                    </span>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <input type="text" name="language_name" placeholder="Language (e.g. English, Hindi)" value={newLanguage.language_name} onChange={handleNewLanguageChange} className="w-full mb-3 p-2 border rounded" />
                  <select name="proficiency_level" value={newLanguage.proficiency_level} onChange={handleNewLanguageChange} className="w-full mb-4 p-2 border rounded">
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                  <button onClick={handleAddLanguage} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Language</button>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(7)} className="text-gray-500">Back</button>
                  <button onClick={() => markCompleteAndGo(8, 9)} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">Next (Achievements)</button>
                </div>
              </div>
            )}

            {step === 9 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Achievements & Activities</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Highlight awards, honors, volunteer work, or extra-curricular activities.
                </p>
                {achievementList.map((ach) => (
                  <div key={ach.achievement_id} className="flex justify-between items-start bg-gray-50 p-3 rounded mb-2">
                    <div>
                      <p className="font-semibold">{ach.title}</p>
                      <p className="text-sm text-gray-600">{ach.description}</p>
                      {ach.achievement_date && <p className="text-xs text-gray-500 mt-1">{ach.achievement_date}</p>}
                    </div>
                    <button onClick={() => handleDeleteAchievement(ach.achievement_id)} className="text-red-600 text-sm">Delete</button>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <input type="text" name="title" placeholder="Title (e.g. Best Innovator Award)" value={newAchievement.title} onChange={handleNewAchievementChange} className="w-full mb-3 p-2 border rounded" />
                  <textarea name="description" placeholder="Short description" value={newAchievement.description} onChange={handleNewAchievementChange} className="w-full mb-3 p-2 border rounded" rows="2" />
                  <input type="date" name="achievement_date" value={newAchievement.achievement_date} onChange={handleNewAchievementChange} className="w-full mb-4 p-2 border rounded" />
                  <button onClick={handleAddAchievement} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">+ Add Achievement</button>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(8)} className="text-gray-500">Back</button>
                  <button onClick={() => markCompleteAndGo(9, 10)} className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800">Next (Template)</button>
                </div>
              </div>
            )}

            {step === 10 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Choose a Template</h2>
                <p className="text-sm text-gray-500 mb-5">Pick a design for your resume. You can change this anytime.</p>

                {templates.length === 0 ? (
                  <p className="text-sm text-gray-500">No templates available yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {templates.map((t) => (
                      <button
                        key={t.template_id}
                        onClick={() => handleSelectTemplate(t.template_id)}
                        className={`text-left border-2 rounded-lg p-4 transition ${
                          selectedTemplateId === t.template_id ? 'border-teal-700 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="h-32 rounded mb-3 overflow-hidden">
                          {t.template_style === 'sidebar' ? (
                            <div className="flex h-full">
                              <div className="w-1/3 bg-slate-800"></div>
                              <div className="w-2/3 bg-white flex flex-col gap-1 p-2">
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-2 bg-gray-200 rounded w-2/3 mt-2"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 p-3 h-full bg-gray-50">
                              <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-2 bg-gray-200 rounded w-3/4 mt-2"></div>
                              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm">{t.template_name}</p>
                        {selectedTemplateId === t.template_id && (
                          <span className="text-xs text-teal-700 font-medium">✓ Selected</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(9)} className="text-gray-500">Back</button>
                  <button
                    onClick={() => {
                      if (!completedSteps.includes(10)) setCompletedSteps([...completedSteps, 10]);
                      navigate(`/preview/${resumeId}`);
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Finish & Preview Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;