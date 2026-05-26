import { supabase } from './supabase';

export async function listCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createCourse(name) {
  const { data, error } = await supabase
    .from('courses')
    .insert({ name })
    .select('id, name')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id) {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}

export async function updateCourse(id, name) {
  const { data, error } = await supabase
    .from('courses')
    .update({ name })
    .eq('id', id)
    .select('id, name')
    .single();

  if (error) throw error;
  return data;
}
