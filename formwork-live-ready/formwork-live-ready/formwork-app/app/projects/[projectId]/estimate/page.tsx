import AppShell from '@/components/AppShell';
import EstimateBuilder from '@/components/EstimateBuilder';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

async function ensureEstimate(supabase: any, userId: string, project: any) {
  const { data: existing } = await supabase.from('estimates').select('*').eq('project_id', project.id).maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase.from('estimates').insert({
    owner_id: userId,
    company_id: project.company_id,
    project_id: project.id,
    quote_number: `EST-${new Date().getFullYear()}-001`,
    title: `Estimate - ${project.project_name}`,
    vat_rate: 20,
    markup_percent: 0,
    status: 'draft'
  }).select('*').single();
  if (error) throw new Error(error.message);
  return data;
}

export default async function EstimatePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase, user } = await requireUser();
  const { data: project, error } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
  if (error || !project) return <AppShell><div className="notice danger">Project not found.</div></AppShell>;
  const estimate = await ensureEstimate(supabase, user.id, project);
  const { data: items } = await supabase.from('estimate_items').select('*').eq('estimate_id', estimate.id).order('sort_order');

  return (
    <AppShell>
      <div className="page-title"><div><div className="eyebrow">EST-01</div><h1>{project.project_name}</h1><p className="muted">Client: {project.client_name} · <Link href="/projects" style={{textDecoration:'underline'}}>back to projects</Link></p></div></div>
      <EstimateBuilder projectId={projectId} estimate={estimate} items={items || []} />
    </AppShell>
  );
}
