'use client';

import { useState } from 'react';

type Row = { id?: string; diary_date: string; weather: string; labour: string; works: string; deliveries: string; delays: string; instructions: string };

export default function SiteDiary({ projectId, rows: initialRows }: { projectId: string; rows: Row[] }) {
  const today = new Date().toISOString().slice(0,10);
  const [rows, setRows] = useState<Row[]>(initialRows?.length ? initialRows : [{ diary_date: today, weather:'Dry', labour:'', works:'', deliveries:'', delays:'', instructions:'' }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  function updateRow(index: number, patch: Partial<Row>) { setRows(rows.map((row, i) => i === index ? { ...row, ...patch } : row)); }
  function addDemoRows() { setRows([
    { diary_date: today, weather:'Dry', labour:'2 decorators, 1 labourer', works:'Protected work area, completed ceiling prep and first coat decoration.', deliveries:'Paint and protection materials delivered.', delays:'None', instructions:'Client requested works complete by Friday.' },
    { diary_date: today, weather:'Wet AM / Dry PM', labour:'1 plasterer, 1 labourer', works:'Skimmed kitchen ceiling and made good around window reveal.', deliveries:'Plasterboard sheets delivered AM.', delays:'Late material delivery caused 1 hour delay.', instructions:'Surveyor confirmed like-for-like finish.' }
  ]); }
  async function save() { setSaving(true); setMessage(''); const res = await fetch(`/api/projects/${projectId}/site-diary`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rows }) }); const data = await res.json(); setSaving(false); setMessage(data.ok ? 'Site diary saved.' : data.error || 'Could not save.'); }
  return <div>
    {message && <div className="notice success">{message}</div>}
    <div className="card">
      <div className="page-title"><div><h2>Daily records</h2><p className="muted">Record labour, weather, deliveries, delays, instructions and progress notes.</p></div><div className="actions"><button className="btn btn-ghost" onClick={addDemoRows}>Add demo rows</button><button className="btn btn-hivis" onClick={()=>setRows([{ diary_date: today, weather:'', labour:'', works:'', deliveries:'', delays:'', instructions:'' }, ...rows])}>Add diary entry</button></div></div>
      <div className="table-wrap"><table className="table"><thead><tr><th>Date</th><th>Weather</th><th>Labour</th><th>Works completed</th><th>Deliveries</th><th>Delays</th><th>Instructions</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><input type="date" value={r.diary_date} onChange={e=>updateRow(i,{diary_date:e.target.value})} /></td><td><input value={r.weather} onChange={e=>updateRow(i,{weather:e.target.value})} /></td><td><input value={r.labour} onChange={e=>updateRow(i,{labour:e.target.value})} /></td><td><textarea value={r.works} onChange={e=>updateRow(i,{works:e.target.value})} /></td><td><textarea value={r.deliveries} onChange={e=>updateRow(i,{deliveries:e.target.value})} /></td><td><textarea value={r.delays} onChange={e=>updateRow(i,{delays:e.target.value})} /></td><td><textarea value={r.instructions} onChange={e=>updateRow(i,{instructions:e.target.value})} /></td><td><button className="btn btn-ghost" onClick={()=>setRows(rows.filter((_,x)=>x!==i))}>Remove</button></td></tr>)}</tbody></table></div>
    </div>
    <div className="card actions"><button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save diary'}</button><button className="btn btn-ghost" onClick={()=>window.print()}>Print / save PDF</button></div>
  </div>;
}
