import { requireUser } from '@/lib/requireUser';
import { money } from '@/lib/currency';

export default async function PrintEstimatePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase, user } = await requireUser();
  const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
  const { data: company } = await supabase.from('companies').select('*').eq('id', project.company_id).single();
  const { data: estimate } = await supabase.from('estimates').select('*').eq('project_id', project.id).single();
  const { data: items } = await supabase.from('estimate_items').select('*').eq('estimate_id', estimate.id).order('sort_order');

  const netBeforeMarkup = (items || []).reduce((sum:any, r:any)=>sum + Number(r.qty||0)*Number(r.rate||0),0);
  const markupValue = netBeforeMarkup * (Number(estimate.markup_percent||0)/100);
  const net = netBeforeMarkup + markupValue;
  const vat = net * (Number(estimate.vat_rate||0)/100);
  const gross = net + vat;

  return (
    <main className="print-page">
      <div className="no-print actions" style={{marginBottom:20}}><button id="printBtn" className="btn btn-primary">Use browser print / save as PDF</button><script dangerouslySetInnerHTML={{__html:`document.getElementById('printBtn')?.addEventListener('click',()=>window.print())`}} /></div>
      <div className="print-head">
        <div>{company.logo_url && <img className="print-logo" src={company.logo_url} alt="Logo" />}<h1 style={{marginTop:12}}>Quotation</h1><p className="mono">{estimate.quote_number}</p></div>
        <div style={{textAlign:'right'}}><h2>{company.name}</h2><p style={{whiteSpace:'pre-line'}}>{company.address}</p><p>{company.email}<br />{company.phone}</p><p className="mono">VAT: {company.vat_number || 'N/A'}<br />Co No: {company.company_number || 'N/A'}</p></div>
      </div>
      <section className="card" style={{boxShadow:'none'}}><h2>{estimate.title}</h2><div className="form-grid"><p><strong>Client</strong><br />{project.client_name}<br />{project.client_email}</p><p><strong>Project address</strong><br />{project.project_address}</p></div></section>
      <table className="table"><thead><tr><th>Category</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th></tr></thead><tbody>{(items||[]).map((r:any)=><tr key={r.id}><td>{r.category}</td><td>{r.description}</td><td>{r.qty}</td><td>{r.unit}</td><td>{money(r.rate)}</td><td>{money(Number(r.qty)*Number(r.rate))}</td></tr>)}</tbody></table>
      <div className="totals" style={{marginTop:28}}><div className="row"><span>Net before markup</span><strong>{money(netBeforeMarkup)}</strong></div><div className="row"><span>Markup</span><strong>{money(markupValue)}</strong></div><div className="row"><span>Net</span><strong>{money(net)}</strong></div><div className="row"><span>VAT</span><strong>{money(vat)}</strong></div><div className="row grand"><span>Total</span><strong>{money(gross)}</strong></div></div>
      {estimate.notes && <section style={{marginTop:30}}><h3>Notes / exclusions</h3><p style={{whiteSpace:'pre-line'}}>{estimate.notes}</p></section>}
      <section style={{marginTop:30}}><p><strong>Payment terms:</strong> {company.payment_terms}</p><p><strong>Quote validity:</strong> {company.quote_validity}</p><p>{company.footer_note}</p></section>
    </main>
  );
}
