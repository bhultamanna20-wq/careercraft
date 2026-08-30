import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import {
  getResumeById, getPersonalDetails, getEducation, getSkills,
  getProjects, getExperience, getCertifications, getLanguages, getAchievements,
} from '../utils/resumeService';
import Navbar from '../components/Navbar';

function Preview() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [personal, setPersonal] = useState(null);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const loadAllData = async () => {
    setLoading(true);
    const [r, p, edu, sk, proj, exp, cert, lang, ach] = await Promise.all([
      getResumeById(resumeId),
      getPersonalDetails(resumeId),
      getEducation(resumeId),
      getSkills(resumeId),
      getProjects(resumeId),
      getExperience(resumeId),
      getCertifications(resumeId),
      getLanguages(resumeId),
      getAchievements(resumeId),
    ]);
    setResume(r);
    setPersonal(p);
    setEducation(edu);
    setSkills(sk);
    setProjects(proj);
    setExperience(exp);
    setCertifications(cert);
    setLanguages(lang);
    setAchievements(ach);
    setLoading(false);
  };

  const handleDownload = () => {
    setDownloading(true);
    const element = resumeRef.current;
    const opt = {
      margin: 0.3,
      filename: `${personal?.full_name || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save().then(() => setDownloading(false));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const hardSkills = skills.filter((s) => s.skill_type !== 'Soft Skill');
  const softSkills = skills.filter((s) => s.skill_type === 'Soft Skill');
  const isSidebar = resume?.template?.template_style === 'sidebar';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <button onClick={() => navigate(`/editor/${resumeId}`)} className="text-sm text-blue-600 hover:underline">
            ← Back to Editor
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-teal-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-teal-800 transition"
          >
            {downloading ? 'Generating PDF...' : '⬇ Download PDF'}
          </button>
        </div>

        {isSidebar ? (
          /* ================= SIDEBAR TEMPLATE ================= */
          <div ref={resumeRef} className="bg-white shadow-md flex flex-col sm:flex-row min-h-[1000px]">
            {/* LEFT SIDEBAR */}
            <div className="sm:w-[32%] bg-slate-800 text-white p-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-700 mx-auto mb-4 border-4 border-teal-500 flex items-center justify-center text-3xl font-bold text-slate-400">
                {personal?.full_name?.charAt(0).toUpperCase() || '?'}
              </div>

              <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wide mb-2 mt-6">Contact</h2>
              <div className="text-xs space-y-2 text-slate-200 mb-6">
                {personal?.phone && <p>📞 {personal.phone}</p>}
                {personal?.email && <p className="break-words">📧 {personal.email}</p>}
                {personal?.address && <p>📍 {personal.address}</p>}
                {personal?.linkedin_url && <p className="break-words">🔗 {personal.linkedin_url}</p>}
                {personal?.portfolio_url && <p className="break-words">🌐 {personal.portfolio_url}</p>}
              </div>

              {skills.length > 0 && (
                <>
                  <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wide mb-2">Skills</h2>
                  {hardSkills.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-slate-400 mb-1">Hard Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {hardSkills.map((s) => (
                          <span key={s.skill_id} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">{s.skill_name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {softSkills.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[10px] font-semibold text-slate-400 mb-1">Soft Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {softSkills.map((s) => (
                          <span key={s.skill_id} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">{s.skill_name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {languages.length > 0 && (
                <>
                  <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wide mb-2">Languages</h2>
                  <div className="text-xs space-y-1 mb-6 text-slate-200">
                    {languages.map((lang) => (
                      <p key={lang.language_id}>{lang.language_name} — {lang.proficiency_level}</p>
                    ))}
                  </div>
                </>
              )}

              {certifications.length > 0 && (
                <>
                  <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wide mb-2">Certifications</h2>
                  <div className="text-xs space-y-2 text-slate-200">
                    {certifications.map((cert) => (
                      <div key={cert.cert_id}>
                        <p className="font-medium">{cert.certificate_name}</p>
                        <p className="text-slate-400 text-[10px]">{cert.issuing_organization}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="sm:w-[68%] p-8">
              <div className="mb-5 pb-4 border-b-2 border-slate-800">
                <h1 className="text-3xl font-bold text-slate-800">{personal?.full_name || 'Your Name'}</h1>
                {personal?.professional_title && (
                  <p className="text-md text-teal-700 font-medium mt-1">{personal.professional_title}</p>
                )}
              </div>

              {resume?.summary && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Summary</h2>
                  <p className="text-sm text-gray-700">{resume.summary}</p>
                </div>
              )}

              {experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wide border-b mb-3 pb-1">Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.experience_id} className="mb-3">
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm">{exp.position} — {exp.company_name}</p>
                        <p className="text-xs text-gray-500">{exp.start_date} – {exp.end_date || 'Present'}</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wide border-b mb-3 pb-1">Education</h2>
                  {education.map((edu) => (
                    <div key={edu.education_id} className="mb-2">
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm">{edu.degree} — {edu.college}</p>
                        <p className="text-xs text-gray-500">{edu.passing_year}</p>
                      </div>
                      <p className="text-xs text-gray-500">{edu.university} {edu.percentage && `· ${edu.percentage}%`}</p>
                    </div>
                  ))}
                </div>
              )}

              {projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wide border-b mb-3 pb-1">Projects</h2>
                  {projects.map((proj) => (
                    <div key={proj.project_id} className="mb-3">
                      <p className="font-semibold text-sm">{proj.project_title}</p>
                      <p className="text-xs text-gray-600">{proj.description}</p>
                      {proj.technologies_used && <p className="text-xs text-gray-500 mt-1">Tech: {proj.technologies_used}</p>}
                    </div>
                  ))}
                </div>
              )}

              {achievements.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wide border-b mb-3 pb-1">Achievements & Activities</h2>
                  {achievements.map((ach) => (
                    <div key={ach.achievement_id} className="mb-2">
                      <p className="text-sm font-medium">{ach.title}</p>
                      {ach.description && <p className="text-xs text-gray-600">{ach.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= CLASSIC TEMPLATE ================= */
          <div ref={resumeRef} className="bg-white shadow-md p-8 sm:p-10 text-gray-800">
            <div className="border-b-2 border-slate-800 pb-4 mb-5">
              <h1 className="text-3xl font-bold text-slate-800">{personal?.full_name || 'Your Name'}</h1>
              {personal?.professional_title && (
                <p className="text-md text-teal-700 font-medium mt-1">{personal.professional_title}</p>
              )}
              <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {personal?.phone && <span>📞 {personal.phone}</span>}
                {personal?.email && <span>📧 {personal.email}</span>}
                {personal?.address && <span>📍 {personal.address}</span>}
                {personal?.linkedin_url && <span>🔗 {personal.linkedin_url}</span>}
                {personal?.portfolio_url && <span>🌐 {personal.portfolio_url}</span>}
              </div>
            </div>

            {resume?.summary && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Summary</h2>
                <p className="text-sm text-gray-700">{resume.summary}</p>
              </div>
            )}

            {education.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Education</h2>
                {education.map((edu) => (
                  <div key={edu.education_id} className="mb-2">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">{edu.degree} — {edu.college}</p>
                      <p className="text-xs text-gray-500">{edu.passing_year}</p>
                    </div>
                    <p className="text-xs text-gray-500">{edu.university} {edu.percentage && `· ${edu.percentage}%`}</p>
                  </div>
                ))}
              </div>
            )}

            {experience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.experience_id} className="mb-3">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">{exp.position} — {exp.company_name}</p>
                      <p className="text-xs text-gray-500">{exp.start_date} to {exp.end_date || 'Present'}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Projects</h2>
                {projects.map((proj) => (
                  <div key={proj.project_id} className="mb-3">
                    <p className="font-semibold text-sm">{proj.project_title}</p>
                    <p className="text-xs text-gray-600">{proj.description}</p>
                    {proj.technologies_used && <p className="text-xs text-gray-500 mt-1">Tech: {proj.technologies_used}</p>}
                  </div>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Skills</h2>
                {hardSkills.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Hard Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {hardSkills.map((s) => (
                        <span key={s.skill_id} className="text-xs bg-gray-100 px-2 py-1 rounded">{s.skill_name} ({s.skill_level})</span>
                      ))}
                    </div>
                  </div>
                )}
                {softSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Soft Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {softSkills.map((s) => (
                        <span key={s.skill_id} className="text-xs bg-gray-100 px-2 py-1 rounded">{s.skill_name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {certifications.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Certifications</h2>
                {certifications.map((cert) => (
                  <div key={cert.cert_id} className="mb-2 flex justify-between">
                    <p className="text-sm font-medium">{cert.certificate_name}</p>
                    <p className="text-xs text-gray-500">{cert.issuing_organization}</p>
                  </div>
                ))}
              </div>
            )}

            {languages.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span key={lang.language_id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {lang.language_name} ({lang.proficiency_level})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {achievements.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide border-b mb-2 pb-1">Achievements & Activities</h2>
                {achievements.map((ach) => (
                  <div key={ach.achievement_id} className="mb-2">
                    <p className="text-sm font-medium">{ach.title}</p>
                    {ach.description && <p className="text-xs text-gray-600">{ach.description}</p>}
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

export default Preview;