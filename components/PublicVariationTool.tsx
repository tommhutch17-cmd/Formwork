'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { money } from '@/lib/currency';

type Row = { no: string; description: string; instructedBy: string; status: string; amount: number; notes: string };
const demoRows: Row[] = [
  { no: 'VAR-001', description: 'Additional plasterboard repairs to kitchen ceiling', instructedBy: 'Client', status: 'Submitted', amount: 485, notes: 'Photos saved to job file.' },
  { no: 'VAR-002', description: 'Upgrade skirting from MDF pencil round to ogee profile', instructedBy: 'Client', status: 'Approved', amount: 220, notes: 'Approved by email.' },
  { no: 'VAR-003', description: 'Extra decoration to utility room following survey', instructedBy: 'Surveyor', status: 'Awaiting approval', amount: 375, notes: 'Needs client sign-off.' }
];

function downloadBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }

export default function PublicVariationTool() {
  const [project, setProject] = useState('14 Marsh Lane — kitchen reinstatement');
  const [client, setClient] = useState('Mrs Smith');
  const [rows, setRows] = useState<Row[]>(demoRows);
  const total = useMemo(() => rows.reduce((sum, r) => sum + Number(r.amount || 0), 0), [rows]);
  function updateRow(index: number, patch: Partial<Row>) { setRows(rows.map((row, i) => i === index ? { ...row, ...patch } : row)); }
  async function downloadXlsx() {
    const response = await fetch('/api/export/xlsx', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ workbookName: `Variation Tracker - ${project}`, sheets: [{ name:'Variations', headings:['No','Description','Instructed by','Status','Amount','Notes'], rows: rows.map(r => [r.no, r.description, r.instructedBy, r.status, r.amount, r.notes]) }, { name:'Summary', headings:['Field','Value'], rows:[['Project', project], ['Client', client], ['Total variations', total]] }] }) });
    downloadBlob(await response.blob(), 'variation-tracker.xlsx');
  }
  return <div className="tool-page"><div className="wrap"><div className="page-title no-print"><div><div className="eyebrow">VAR-02 / Working tool</div><h1>Variation tracker</h1><p className="muted">Track extra works, approvals and values without losing them in WhatsApp or email threads.</p></div><div className="actions"><Link className="btn btn-ghost" href="/tools">All tools</Link><button className="btn btn-primary" onClick={()=>window.print()}>Print / save PDF</button><button className="btn btn-hivis" onClick={downloadXlsx}>Download XLSX</button></div></div>
    <div className="card form-grid no-print"><div className="field"><label>Project</label><input value={project} onChange={e=>setProject(e.target.value)} /></div><div className="field"><label>Client</label><input value={client} onChange={e=>setClient(e.target.value)} /></div></div>
    <div className="card no-print"><div className="page-title"><div><h2>Variation rows</h2><p className="muted">Set each variation as draft, submitted, awaiting approval, approved or rejected.</p></div><div className="actions"><button className="btn btn-ghost" onClick={()=>setRows(demoRows)}>Demo rows</button><button className="btn btn-hivis" onClick={()=>setRows([...rows,{ no:`VAR-${String(rows.length+1).padStart(3,'0')}`, description:'', instructedBy:'', status:'Draft', amount:0, notes:'' }])}>Add variation</button></div></div><div className="table-wrap"><table className="table"><thead><tr><th>No</th><th>Description</th><th>Instructed by</th><th>Status</th><th>Amount</th><th>Notes</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><input value={r.no} onChange={e=>updateRow(i,{no:e.target.value})} style={{width:95}} /></td><td><input value={r.description} onChange={e=>updateRow(i,{description:e.target.value})} /></td><td><input value={r.instructedBy} onChange={e=>updateRow(i,{instructedBy:e.target.value})} style={{width:130}} /></td><td><select value={r.status} onChange={e=>updateRow(i,{status:e.target.value})}><option>Draft</option><option>Submitted</option><option>Awaiting approval</option><option>Approved</option><option>Rejected</option></select></td><td><input type="number" value={r.amount} onChange={e=>updateRow(i,{amount:Number(e.target.value)})} style={{width:110}} /></td><td><input value={r.notes} onChange={e=>updateRow(i,{notes:e.target.value})} /></td><td><button className="btn btn-ghost" onClick={()=>setRows(rows.filter((_,x)=>x!==i))}>Remove</button></td></tr>)}</tbody></table></div></div>
    <div className="print-page"><div className="print-head"><div><div className="eyebrow">VAR-02 / REGISTER</div><h1>Variation tracker</h1><p>{project}</p></div><div><strong>Client</strong><p>{client}</p><strong>Total variations</strong><p>{money(total)}</p></div></div><div className="table-wrap"><table className="table"><thead><tr><th>No</th><th>Description</th><th>Instructed by</th><th>Status</th><th>Amount</th><th>Notes</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td>{r.no}</td><td>{r.description}</td><td>{r.instructedBy}</td><td>{r.status}</td><td>{money(r.amount)}</td><td>{r.notes}</td></tr>)}</tbody></table></div></div>
  </div></div>;
}
