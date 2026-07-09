'use client';

import { useMemo, useState } from 'react';
import { money } from '@/lib/currency';

type Item = { id?: string; category: string; description: string; qty: number; unit: string; rate: number };

export default function EstimateBuilder({ projectId, estimate, items }: { projectId: string; estimate: any; items: Item[] }) {
  const [quoteNumber, setQuoteNumber] = useState(estimate?.quote_number || `EST-${new Date().getFullYear()}-001`);
  const [title, setTitle] = useState(estimate?.title || 'Estimate for works');
  const [notes, setNotes] = useState(estimate?.notes || '');
  const [vatRate, setVatRate] = useState(Number(estimate?.vat_rate ?? 20));
  const [markup, setMarkup] = useState(Number(estimate?.markup_percent ?? 0));
  const [rows, setRows] = useState<Item[]>(items?.length ? items : [
    { category:'Labour', description:'Site labour', qty:1, unit:'day', rate:250 },
    { category:'Materials', description:'Materials allowance', qty:1, unit:'sum', rate:500 }
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const totals = useMemo(() => {
    const netBeforeMarkup = rows.reduce((sum, r) => sum + Number(r.qty || 0) * Number(r.rate || 0), 0);
    const markupValue = netBeforeMarkup * (Number(markup || 0) / 100);
    const net = netBeforeMarkup + markupValue;
    const vat = net * (Number(vatRate || 0) / 100);
    return { netBeforeMarkup, markupValue, net, vat, gross: net + vat };
  }, [rows, markup, vatRate]);

  function updateRow(index: number, patch: Partial<Item>) {
    setRows(rows.map((row, i) => i === index ? { ...row, ...patch } : row));
  }

  async function save() {
    setSaving(true); setMessage('');
    const res = await fetch(`/api/projects/${projectId}/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteNumber, title, notes, vatRate, markup, rows })
    });
    const data = await res.json();
    setSaving(false);
    setMessage(data.ok ? 'Saved.' : data.error || 'Could not save.');
  }

  function addDemoRows() {
    setRows([
      { category:'Preliminaries', description:'Protect existing finishes and set up works area', qty:1, unit:'sum', rate:185 },
      { category:'Strip out', description:'Remove damaged plasterboard and dispose from site', qty:18, unit:'m²', rate:14.5 },
      { category:'Boarding', description:'Supply and install 12.5mm plasterboard', qty:18, unit:'m²', rate:32 },
      { category:'Plastering', description:'Skim coat walls ready for decoration', qty:18, unit:'m²', rate:16.5 },
      { category:'Decoration', description:'Mist coat plus two coats emulsion', qty:42, unit:'m²', rate:8.75 },
      { category:'Flooring', description:'Supply and fit vinyl plank flooring', qty:14, unit:'m²', rate:38 }
    ]);
  }

  return (
    <div>
      {message && <div className="notice success">{message}</div>}
      <div className="card form-grid">
        <div className="field"><label>Quote number</label><input value={quoteNumber} onChange={e=>setQuoteNumber(e.target.value)} /></div>
        <div className="field"><label>Estimate title</label><input value={title} onChange={e=>setTitle(e.target.value)} /></div>
        <div className="field"><label>Markup %</label><input type="number" value={markup} onChange={e=>setMarkup(Number(e.target.value))} /></div>
        <div className="field"><label>VAT %</label><input type="number" value={vatRate} onChange={e=>setVatRate(Number(e.target.value))} /></div>
        <div className="field full"><label>Notes / exclusions</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} /></div>
      </div>

      <div className="card">
        <div className="page-title"><div><h2>Estimate rows</h2><p className="muted">Labour, materials, plant, subcontractors, prelims — whatever you need.</p></div><div className="actions"><button className="btn btn-ghost" onClick={addDemoRows}>Add demo rows</button><button className="btn btn-hivis" onClick={()=>setRows([...rows,{category:'Labour',description:'',qty:1,unit:'item',rate:0}])}>Add row</button></div></div>
        <div className="table-wrap"><table className="table"><thead><tr><th>Category</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><input value={r.category} onChange={e=>updateRow(i,{category:e.target.value})} /></td><td><input value={r.description} onChange={e=>updateRow(i,{description:e.target.value})} /></td><td><input type="number" value={r.qty} onChange={e=>updateRow(i,{qty:Number(e.target.value)})} style={{width:90}} /></td><td><input value={r.unit} onChange={e=>updateRow(i,{unit:e.target.value})} style={{width:90}} /></td><td><input type="number" value={r.rate} onChange={e=>updateRow(i,{rate:Number(e.target.value)})} style={{width:110}} /></td><td>{money(Number(r.qty||0)*Number(r.rate||0))}</td><td><button className="btn btn-ghost" onClick={()=>setRows(rows.filter((_,x)=>x!==i))}>Remove</button></td></tr>)}</tbody></table></div>
      </div>

      <div className="card">
        <h2>Totals</h2>
        <div className="totals">
          <div className="row"><span>Net before markup</span><strong>{money(totals.netBeforeMarkup)}</strong></div>
          <div className="row"><span>Markup</span><strong>{money(totals.markupValue)}</strong></div>
          <div className="row"><span>Net</span><strong>{money(totals.net)}</strong></div>
          <div className="row"><span>VAT</span><strong>{money(totals.vat)}</strong></div>
          <div className="row grand"><span>Total</span><strong>{money(totals.gross)}</strong></div>
        </div>
        <div className="actions" style={{marginTop:22}}>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save estimate'}</button>
          <a className="btn btn-ghost" href={`/projects/${projectId}/estimate/print`} target="_blank">Open branded PDF / print view</a>
          <a className="btn btn-hivis" href={`/projects/${projectId}/estimate/export/xlsx`}>Download proper XLSX</a>
        </div>
      </div>
    </div>
  );
}
