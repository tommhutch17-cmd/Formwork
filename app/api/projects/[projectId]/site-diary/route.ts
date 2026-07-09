import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/requireUser';

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const { supabase, user } = await requireUser();
    const body = await req.json();
    const { data: project, error: projectError } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
    if (projectError || !project) return NextResponse.json({ ok:false, error:'Project not found' }, { status:404 });
    await supabase.from('site_diary_entries').delete().eq('project_id', projectId).eq('owner_id', user.id);
    const rows = (body.rows || []).map((r:any) => ({
      owner_id: user.id,
      company_id: project.company_id,
      project_id: project.id,
      diary_date: r.diary_date || new Date().toISOString().slice(0,10),
      weather: r.weather,
      labour: r.labour,
      works: r.works,
      deliveries: r.deliveries,
      delays: r.delays,
      instructions: r.instructions
    }));
    if (rows.length) {
      const { error } = await supabase.from('site_diary_entries').insert(rows);
      if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 });
    }
    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e.message }, { status:500 });
  }
}
