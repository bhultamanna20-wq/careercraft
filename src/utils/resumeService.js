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
    .select('*')
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

// ===== EDUCATION (multiple entries) =====

export async function getEducation(resumeId) {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}

export async function addEducation(resumeId, entry) {
  const { data, error } = await supabase
    .from('education')
    .insert([{ resume_id: resumeId, ...entry }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateEducation(educationId, entry) {
  const { data, error } = await supabase
    .from('education')
    .update(entry)
    .eq('education_id', educationId)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteEducation(educationId) {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('education_id', educationId);
  if (error) throw error;
}

// ===== SKILLS (multiple entries) =====

export async function getSkills(resumeId) {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}

export async function addSkill(resumeId, entry) {
  const { data, error } = await supabase
    .from('skills')
    .insert([{ resume_id: resumeId, ...entry }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteSkill(skillId) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('skill_id', skillId);
  if (error) throw error;
}

// ===== PROJECT (multiple entries) =====

export async function getProjects(resumeId) {
  const { data, error } = await supabase
    .from('project')
    .select('*')
    .eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}

export async function addProject(resumeId, entry) {
  const { data, error } = await supabase
    .from('project')
    .insert([{ resume_id: resumeId, ...entry }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteProject(projectId) {
  const { error } = await supabase
    .from('project')
    .delete()
    .eq('project_id', projectId);
  if (error) throw error;
}

// ===== EXPERIENCE (multiple entries) =====

export async function getExperience(resumeId) {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('resume_id', resumeId);
  if (error) throw error;
  return data;
}

export async function addExperience(resumeId, entry) {
  const { data, error } = await supabase
    .from('experience')
    .insert([{ resume_id: resumeId, ...entry }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteExperience(experienceId) {
  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('experience_id', experienceId);
  if (error) throw error;
}