'use server';

import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).maybeSingle();
  if (!company) redirect('/settings/company?error=' + encodeURIComponent('Set up your company profile before creating a project.'));

  const payload = {
    owner_id: user.id,
    company_id: company.id,
    project_name: String(formData.get('project_name') || ''),
    project_address: String(formData.get('project_address') || ''),
    client_name: String(formData.get('client_name') || ''),
    client_email: String(formData.get('client_email') || ''),
    client_address: String(formData.get('client_address') || ''),
    status: 'active'
  };
  const { data, error } = await supabase.from('projects').insert(payload).select('id').single();
  if (error) redirect('/projects?error=' + encodeURIComponent(error.message));
  redirect(`/projects/${data.id}/estimate`);
}
