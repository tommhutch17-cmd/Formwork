import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/requireUser';

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const { supabase, user } = await requireUser();
    const body = await req.json();

    const { data: project, error: projectError } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
    if (projectError || !project) return NextResponse.json({ ok:false, error:'Project not found' }, { status:404 });

    const { data: estimate, error: estimateError } = await supabase.from('estimates').upsert({
      owner_id: user.id,
      company_id: project.company_id,
      project_id: project.id,
      quote_number: body.quoteNumber,
      title: body.title,
      notes: body.notes,
      vat_rate: body.vatRate,
      markup_percent: body.markup,
      status: 'draft',
      updated_at: new Date().toISOString()
    }, { onConflict: 'project_id' }).select('*').single();
    if (estimateError) return NextResponse.json({ ok:false, error:estimateError.message }, { status:400 });

    await supabase.from('estimate_items').delete().eq('estimate_id', estimate.id);
    const rows = (body.rows || []).map((r:any, i:number) => ({
      owner_id: user.id,
      company_id: project.company_id,
      estimate_id: estimate.id,
      category: r.category,
      description: r.description,
      qty: Number(r.qty || 0),
      unit: r.unit,
      rate: Number(r.rate || 0),
      sort_order: i
    }));
    if (rows.length) {
      const { error: rowsError } = await supabase.from('estimate_items').insert(rows);
      if (rowsError) return NextResponse.json({ ok:false, error:rowsError.message }, { status:400 });
    }
    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e.message }, { status:500 });
  }
}
