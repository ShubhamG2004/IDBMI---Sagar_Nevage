import { supabase } from './supabase';

export const emptyInquiry = {
  enrollment_number: '',
  date: '',
  name: '',
  qualification: '',
  address: '',
  category: '',
  contact_mobile: '',
  contact_home: '',
  email: '',
  course_name: 'AutoCAD',
  reference: '',
  other_reference: '',
  confirm: 'yes',
  receipt_number: '',
  office_enrollment_number: '',
  short_topic1: '',
  short_topic2: '',
  short_comments1: '',
  short_comments2: '',
  batch_timing: '',
  course_fees: '',
  application_fees: '',
};

export const courses = [
  'AutoCAD',
  'Creo',
  'Solidworks',
  'Catia',
  'NX',
  'CNC Programming',
  'MasterCAM',
  'Powermill',
  'Senior Product Manager (Aerospace Manufacturing)',
  'Jr.Designer - Tool',
  'Jr.Designer - CAD CAM',
  'Technical Supervisor - Additive Manufacturing',
  'Assistant Operator - CNC Milling (Tool Room)',
];

export const categories = ['SC', 'ST', 'NT', 'OBC', 'General'];
export const references = ['Student friend', 'Newspaper Adv.', 'Others'];

const normalizeInquiry = (payload) => ({
  ...emptyInquiry,
  ...payload,
  other_reference: payload.reference === 'Others' ? payload.other_reference : '',
  office_enrollment_number: payload.office_enrollment_number || payload.enrollment_number || '',
  receipt_number: payload.confirm === 'yes' ? payload.receipt_number : '',
});

export async function listInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getInquiry(id) {
  const { data, error } = await supabase.from('inquiries').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createInquiry(payload) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert(normalizeInquiry(payload))
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function updateInquiry(id, payload) {
  const { error } = await supabase.from('inquiries').update(normalizeInquiry(payload)).eq('id', id);
  if (error) throw error;
}

export async function deleteInquiry(id) {
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
}
