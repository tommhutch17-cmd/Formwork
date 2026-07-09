import AppShell from '@/components/AppShell';
import VariationTracker from '@/components/VariationTracker';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

export default async function VariationsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase, user } = await requireUser();
  const { data: project, error } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
  if (error || !project) return <AppShell><div className="notice danger">Project not found.</div></AppShell>;
  const { data: rows } = await supabase.from('variation_items').select('*').eq('project_id', projectId).eq('owner_id', user.id).order('created_at');
  return <AppShell><div className="page-title"><div><div className="eyebrow">VAR-02</div><h1>{project.project_name} — variations</h1><p className="muted">Client: {project.client_name} · <Link href={`/projects/${projectId}`} style={{textDecoration:'underline'}}>back to project</Link></p></div></div><VariationTracker projectId={projectId} rows={rows || []} /></AppShell>;
}
