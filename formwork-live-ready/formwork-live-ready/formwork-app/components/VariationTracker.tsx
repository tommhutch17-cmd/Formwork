'use client';

import { useMemo, useState } from 'react';
import { money } from '@/lib/currency';

type Row = { id?: string; variation_no: string; description: string; instructed_by: string; status: string; amount: number; notes: string };

export default function VariationTracker({ projectId, rows: initialRows }: { projectId: string; rows: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows?.length ? initialRows : [
    { variation_no: 'VAR-001', description: 'Additional works instructed on site', instructed_by: 'Client', status: 'Draft', amount: 0, notes: '' }
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const total = useMemo(() => rows.reduce((sum, r) => sum + Number(r.amount || 0), 0), [rows]);

  function updateRow(index: number, patch: Partial<Row>) { setRows(rows.map((row, i) => i === index ? { ...row, ...patch } : row)); }
  function addDemoRows() { setRows([
    { variation_no:'VAR-001', description:'Additional plasterboard repairs to kitchen ceiling', instructed_by:'Client', status:'Submitted', amount:485, notes:'Photos saved to job file.' },
    { variation_no:'VAR-002', description:'Upgrade skirting from MDF pencil round to ogee profile', instructed_by:'Client', status:'Approved', amount:220, notes:'Approved by email.' },
    { variation_no:'VAR-003', description:'Extra decoration to utility room following survey', instructed_by:'Surveyor', status:'Awaiting approval', amount:375, notes:'Needs client sign-off.' }
  ]); }

  async function save() {
    setSaving(true); setMessage('');
    const res = await fetch(`/api/projects/${projectId}/variations`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rows }) });
    const data = await res.json();
    setSaving(false); setMessage(data.ok ? 'Variation tracker saved.' : data.error || 'Could not save.');
  }

  return <div>
    {message && <div className="notice success">{message}</div>}
    <div className="card">
      <div className="page-title"><div><h2>Variation rows</h2><p className="muted">Track extra works, values and whether each variation is draft, submitted, approved or rejected.</p></div><div className="actions"><button className="btn btn-ghost" onClick={addDemoRows}>Add demo rows</button><button className="btn btn-hivis" onClick={()=>setRows([...rows,{variation_no:`VAR-${String(rows.length+1).padStart(3,'0')}`,description:'',instructed_by:'',status:'Draft',amount:0,notes:''}])}>Add variation</button></div></div>
      <div className="table-wrap"><table className="table"><thead><tr><th>No.</th><th>Description</th><th>Instructed by</th><th>Status</th><th>Value</th><th>Notes</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><input value={r.variation_no} onChange={e=>updateRow(i,{variation_no:e.target.value})} style={{width:100}} /></td><td><input value={r.description} onChange={e=>updateRow(i,{description:e.target.value})} /></td><td><input value={r.instructed_by} onChange={e=>updateRow(i,{instructed_by:e.target.value})} style={{width:130}} /></td><td><select value={r.status} onChange={e=>updateRow(i,{status:e.target.value})}><option>Draft</option><option>Submitted</option><option>Awaiting approval</option><option>Approved</option><option>Rejected</option></select></td><td><input type="number" value={r.amount} onChange={e=>updateRow(i,{amount:Number(e.target.value)})} style={{width:110}} /></td><td><input value={r.notes} onChange={e=>updateRow(i,{notes:e.target.value})} /></td><td><button className="btn btn-ghost" onClick={()=>setRows(rows.filter((_,x)=>x!==i))}>Remove</button></td></tr>)}</tbody></table></div>
    </div>
    <div className="card"><div className="totals"><div className="row grand"><span>Total variations</span><strong>{money(total)}</strong></div></div><div className="actions" style={{marginTop:22}}><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save variations'}</button><button className="btn btn-ghost" onClick={()=>window.print()}>Print / save PDF</button></div></div>
  </div>;
}
