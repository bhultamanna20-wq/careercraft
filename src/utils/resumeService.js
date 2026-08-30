import { supabase } from './supabaseClient';

// ===== RESUME (main table) =====

export async function createResume(userId) {
  const { data, error } = await supabase
    .from('resume')
    .insert([{ user_id: userId, resume_title: 'Untitled Resume' }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function getUserResumes(userId) {
  const { data, error } = await supabase
    .from('resume')
    .select('*')
    .eq('user_id', userId)
    .order('updated_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getResumeById(resumeId) {
  const { data, error } = await supabase
    .from('resume')
    .select('*, template(*)')
    .eq('resume_id', resumeId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateResumeMeta(resumeId, updates) {
  const { data, error } = await supabase
    .from('resume')
    .update({ ...updates, updated_date: new Date().toISOString() })
    .eq('resume_id', resumeId)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteResume(resumeId) {
  const { error } = await supabase
    .from('resume')
    .delete()
    .eq('resume_id', resumeId);
  if (error) throw error;
}

// ===== PERSONAL DETAILS =====

export async function getPersonalDetails(resumeId) {
  const { data, error } = await supabase
    .from('personal_details')
    .select('*')
    .eq('resume_id', resumeId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function savePersonalDetails(resumeId, details) {
  const existing = await getPersonalDetails(resumeId);
  if (existing) {
    const { data, error } = await supabase
      .from('personal_details')
      .update(details)
      .eq('resume_id', resumeId)
      .select();
    if (error) throw error;
    return data[0];
  } else {
    const { data, error } = await supabase
      .from('personal_details')
      .insert([{ resume_id: resumeId, ...details }])
      .select();
    if (error) throw error;
    return data[0];
  }
}

// ===== EDUCATION =====

export async function getEducation(resumeId) {
  const { data, error } = await supabase.from('education').select('*').eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}
export async function addEducation(resumeId, entry) {
  const { data, error } = await supabase.from('education').insert([{ resume_id: resumeId, ...entry }]).select();
  if (error) throw error;
  return data[0];
}
export async function deleteEducation(educationId) {
  const { error } = await supabase.from('education').delete().eq('education_id', educationId);
  if (error) throw error;
}

// ===== SKILLS =====

export async function getSkills(resumeId) {
  const { data, error } = await supabase.from('skills').select('*').eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}
export async function addSkill(resumeId, entry) {
  const { data, error } = await supabase.from('skills').insert([{ resume_id: resumeId, ...entry }]).select();
  if (error) throw error;
  return data[0];
}
export async function deleteSkill(skillId) {
  const { error } = await supabase.from('skills').delete().eq('skill_id', skillId);
  if (error) throw error;
}

// ===== PROJECT =====

export async function getProjects(resumeId) {
  const { data, error } = await supabase.from('project').select('*').eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}
export async function addProject(resumeId, entry) {
  const { data, error } = await supabase.from('project').insert([{ resume_id: resumeId, ...entry }]).select();
  if (error) throw error;
  return data[0];
}
export async function deleteProject(projectId) {
  const { error } = await supabase.from('project').delete().eq('project_id', projectId);
  if (error) throw error;
}

// ===== EXPERIENCE =====

export async function getExperience(resumeId) {
  const { data, error } = await supabase.from('experience').select('*').eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}
export async function addExperience(resumeId, entry) {
  const { data, error } = await supabase.from('experience').insert([{ resume_id: resumeId, ...entry }]).select();
  if (error) throw error;
  return data[0];
}
export async function deleteExperience(experienceId) {
  const { error } = await supabase.from('experience').delete().eq('experience_id', experienceId);
  if (error) throw error;
}

// ===== CERTIFICATION =====

export async function getCertifications(resumeId) {
  const { data, error } = await supabase.from('certification').select('*').eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}
export async function addCertification(resumeId, entry) {
  const { data, error } = await supabase.from('certification').insert([{ resume_id: resumeId, ...entry }]).select();
  if (error) throw error;
  return data[0];
}
export async function deleteCertification(certId) {
  const { error } = await supabase.from('certification').delete().eq('cert_id', certId);
  if (error) throw error;
}

// ===== LANGUAGE =====

export async function getLanguages(resumeId) {
  const { data, error } = await supabase.from('language').select('*').eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}
export async function addLanguage(resumeId, entry) {
  const { data, error } = await supabase.from('language').insert([{ resume_id: resumeId, ...entry }]).select();
  if (error) throw error;
  return data[0];
}
export async function deleteLanguage(languageId) {
  const { error } = await supabase.from('language').delete().eq('language_id', languageId);
  if (error) throw error;
}

// ===== JOB LISTINGS / MATCHING =====

export async function getJobListings() {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ===== ACHIEVEMENTS =====

export async function getAchievements(resumeId) {
  const { data, error } = await supabase.from('achievement').select('*').eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}
export async function addAchievement(resumeId, entry) {
  const { data, error } = await supabase.from('achievement').insert([{ resume_id: resumeId, ...entry }]).select();
  if (error) throw error;
  return data[0];
}
export async function deleteAchievement(achievementId) {
  const { error } = await supabase.from('achievement').delete().eq('achievement_id', achievementId);
  if (error) throw error;
}

// ===== PHOTO UPLOAD =====

export async function uploadPhoto(userId, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('resume-photos')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('resume-photos').getPublicUrl(fileName);
  return data.publicUrl;
}
export const getTemplates = async () => {
  return [
    {
      id: "modern",
      name: "Modern",
    },
    {
      id: "professional",
      name: "Professional",
    },
    {
      id: "simple",
      name: "Simple",
    },
  ];
};