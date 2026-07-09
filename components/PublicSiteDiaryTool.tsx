'use client';

import { useState } from 'react';
import Link from 'next/link';

type Row = { date: string; weather: string; labour: string; works: string; deliveries: string; issues: string };
const demoRows: Row[] = [
  { date:'2026-07-09', weather:'Dry, warm', labour:'2 joiners, 1 labourer', works:'Kitchen strip out and protection installed', deliveries:'Plasterboard delivered 10:30', issues:'Awaiting client material choice' },
  { date:'2026-07-10', weather:'Light rain AM', labour:'1 plasterer, 1 labourer', works:'Ceiling boarding completed', deliveries:'No deliveries', issues:'None' }
];
function downloadBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
export default function PublicSiteDiaryTool() {
  const [project, setProject] = useState('14 Marsh Lane — kitchen reinstatement');
  const [rows, setRows] = useState<Row[]>(demoRows);
  function updateRow(index:number, patch:Partial<Row>) { setRows(rows.map((row,i)=>i===index?{...row,...patch}:row)); }
  async function downloadXlsx() { const response = await fetch('/api/export/xlsx', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ workbookName:`Site Diary - ${project}`, sheets:[{ name:'Site diary', headings:['Date','Weather','Labour','Works','Deliveries','Issues'], rows: rows.map(r=>[r.date,r.weather,r.labour,r.works,r.deliveries,r.issues]) }] }) }); downloadBlob(await response.blob(), 'site-diary.xlsx'); }
  return <div className="tool-page"><div className="wrap"><div className="page-title no-print"><div><div className="eyebrow">DIA-03 / Working tool</div><h1>Site diary</h1><p className="muted">Keep a proper daily record of labour, weather, works, deliveries and issues.</p></div><div className="actions"><Link className="btn btn-ghost" href="/tools">All tools</Link><button className="btn btn-primary" onClick={()=>window.print()}>Print / save PDF</button><button className="btn btn-hivis" onClick={downloadXlsx}>Download XLSX</button></div></div>
  <div className="card form-grid no-print"><div className="field full"><label>Project</label><input value={project} onChange={e=>setProject(e.target.value)} /></div></div>
  <div className="card no-print"><div className="page-title"><div><h2>Diary entries</h2><p className="muted">One row per site day.</p></div><div className="actions"><button className="btn btn-ghost" onClick={()=>setRows(demoRows)}>Demo rows</button><button className="btn btn-hivis" onClick={()=>setRows([...rows,{date:new Date().toISOString().slice(0,10),weather:'',labour:'',works:'',deliveries:'',issues:''}])}>Add day</button></div></div><div className="table-wrap"><table className="table"><thead><tr><th>Date</th><th>Weather</th><th>Labour</th><th>Works</th><th>Deliveries</th><th>Issues</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><input type="date" value={r.date} onChange={e=>updateRow(i,{date:e.target.value})} /></td><td><input value={r.weather} onChange={e=>updateRow(i,{weather:e.target.value})} /></td><td><input value={r.labour} onChange={e=>updateRow(i,{labour:e.target.value})} /></td><td><input value={r.works} onChange={e=>updateRow(i,{works:e.target.value})} /></td><td><input value={r.deliveries} onChange={e=>updateRow(i,{deliveries:e.target.value})} /></td><td><input value={r.issues} onChange={e=>updateRow(i,{issues:e.target.value})} /></td><td><button className="btn btn-ghost" onClick={()=>setRows(rows.filter((_,x)=>x!==i))}>Remove</button></td></tr>)}</tbody></table></div></div>
  <div className="print-page"><div className="print-head"><div><div className="eyebrow">DIA-03 / SITE DIARY</div><h1>Site diary</h1><p>{project}</p></div></div><div className="table-wrap"><table className="table"><thead><tr><th>Date</th><th>Weather</th><th>Labour</th><th>Works</th><th>Deliveries</th><th>Issues</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td>{r.date}</td><td>{r.weather}</td><td>{r.labour}</td><td>{r.works}</td><td>{r.deliveries}</td><td>{r.issues}</td></tr>)}</tbody></table></div></div>
  </div></div>;
}
