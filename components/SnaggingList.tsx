'use client';

import { useState } from 'react';

type Row = { id?: string; location: string; trade: string; description: string; priority: string; status: string; due_date: string; notes: string };

export default function SnaggingList({ projectId, rows: initialRows }: { projectId: string; rows: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows?.length ? initialRows : [{ location:'', trade:'', description:'', priority:'Normal', status:'Open', due_date:'', notes:'' }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  function updateRow(index: number, patch: Partial<Row>) { setRows(rows.map((row, i) => i === index ? { ...row, ...patch } : row)); }
  function addDemoRows() { setRows([
    { location:'Kitchen', trade:'Decorator', description:'Touch up emulsion above window reveal', priority:'Normal', status:'Open', due_date:'', notes:'Check after second coat dries.' },
    { location:'Utility', trade:'Joiner', description:'Adjust plinth under sink unit', priority:'Low', status:'Open', due_date:'', notes:'' },
    { location:'Hallway', trade:'Flooring', description:'Seal threshold trim at doorway', priority:'High', status:'Closed', due_date:'', notes:'Completed and photographed.' }
  ]); }
  async function save() { setSaving(true); setMessage(''); const res = await fetch(`/api/projects/${projectId}/snags`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rows }) }); const data = await res.json(); setSaving(false); setMessage(data.ok ? 'Snagging list saved.' : data.error || 'Could not save.'); }
  return <div>
    {message && <div className="notice success">{message}</div>}
    <div className="card">
      <div className="page-title"><div><h2>Snagging rows</h2><p className="muted">Track defects by location, trade, priority and status until close out.</p></div><div className="actions"><button className="btn btn-ghost" onClick={addDemoRows}>Add demo rows</button><button className="btn btn-hivis" onClick={()=>setRows([...rows,{location:'',trade:'',description:'',priority:'Normal',status:'Open',due_date:'',notes:''}])}>Add snag</button></div></div>
      <div className="table-wrap"><table className="table"><thead><tr><th>Location</th><th>Trade</th><th>Description</th><th>Priority</th><th>Status</th><th>Due date</th><th>Notes</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><input value={r.location} onChange={e=>updateRow(i,{location:e.target.value})} /></td><td><input value={r.trade} onChange={e=>updateRow(i,{trade:e.target.value})} /></td><td><input value={r.description} onChange={e=>updateRow(i,{description:e.target.value})} /></td><td><select value={r.priority} onChange={e=>updateRow(i,{priority:e.target.value})}><option>Low</option><option>Normal</option><option>High</option><option>Urgent</option></select></td><td><select value={r.status} onChange={e=>updateRow(i,{status:e.target.value})}><option>Open</option><option>In progress</option><option>Closed</option></select></td><td><input type="date" value={r.due_date || ''} onChange={e=>updateRow(i,{due_date:e.target.value})} /></td><td><input value={r.notes} onChange={e=>updateRow(i,{notes:e.target.value})} /></td><td><button className="btn btn-ghost" onClick={()=>setRows(rows.filter((_,x)=>x!==i))}>Remove</button></td></tr>)}</tbody></table></div>
    </div>
    <div className="card actions"><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save snags'}</button><button className="btn btn-ghost" onClick={()=>window.print()}>Print / save PDF</button></div>
  </div>;
}
