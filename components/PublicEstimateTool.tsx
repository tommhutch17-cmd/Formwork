'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { money } from '@/lib/currency';

type Row = { category: string; description: string; qty: number; unit: string; rate: number };

const demoRows: Row[] = [
  { category: 'Preliminaries', description: 'Protect existing finishes and set up works area', qty: 1, unit: 'sum', rate: 185 },
  { category: 'Strip out', description: 'Remove damaged plasterboard and dispose from site', qty: 18, unit: 'm²', rate: 14.5 },
  { category: 'Boarding', description: 'Supply and install 12.5mm plasterboard', qty: 18, unit: 'm²', rate: 32 },
  { category: 'Plastering', description: 'Skim coat walls ready for decoration', qty: 18, unit: 'm²', rate: 16.5 },
  { category: 'Decoration', description: 'Mist coat plus two coats emulsion', qty: 42, unit: 'm²', rate: 8.75 },
  { category: 'Flooring', description: 'Supply and fit vinyl plank flooring', qty: 14, unit: 'm²', rate: 38 }
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PublicEstimateTool() {
  const [logo, setLogo] = useState('');
  const [company, setCompany] = useState('Your Company Ltd');
  const [companyDetails, setCompanyDetails] = useState('Address line • hello@yourcompany.co.uk • 01234 567890');
  const [client, setClient] = useState('Mrs Smith');
  const [project, setProject] = useState('Kitchen reinstatement following escape of water');
  const [quoteNo, setQuoteNo] = useState('EST-2026-001');
  const [validity, setValidity] = useState('30 days');
  const [markup, setMarkup] = useState(10);
  const [vatRate, setVatRate] = useState(20);
  const [notes, setNotes] = useState('Price based on normal working hours. Hidden defects excluded unless noted.');
  const [rows, setRows] = useState<Row[]>(demoRows);

  const totals = useMemo(() => {
    const base = rows.reduce((sum, row) => sum + Number(row.qty || 0) * Number(row.rate || 0), 0);
    const markupValue = base * (Number(markup || 0) / 100);
    const net = base + markupValue;
    const vat = net * (Number(vatRate || 0) / 100);
    return { base, markupValue, net, vat, gross: net + vat };
  }, [rows, markup, vatRate]);

  function updateRow(index: number, patch: Partial<Row>) {
    setRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function downloadXlsx() {
    const response = await fetch('/api/export/xlsx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workbookName: `${quoteNo} ${client}`,
        sheets: [
          {
            name: 'Estimate',
            headings: ['Category', 'Description', 'Qty', 'Unit', 'Rate', 'Total'],
            rows: rows.map((r) => [r.category, r.description, r.qty, r.unit, r.rate, Number(r.qty || 0) * Number(r.rate || 0)])
          },
          {
            name: 'Summary',
            headings: ['Field', 'Value'],
            rows: [
              ['Company', company], ['Company details', companyDetails], ['Client', client], ['Project', project],
              ['Quote number', quoteNo], ['Validity', validity], ['Net before markup', totals.base], ['Markup', totals.markupValue], ['Net', totals.net], ['VAT', totals.vat], ['Total', totals.gross], ['Notes', notes]
            ]
          }
        ]
      })
    });
    downloadBlob(await response.blob(), `${quoteNo}.xlsx`);
  }

  return (
    <div className="tool-page">
      <div className="wrap">
        <div className="page-title no-print">
          <div>
            <div className="eyebrow">EST-01 / Working tool</div>
            <h1>Construction estimate generator</h1>
            <p className="muted">Upload a logo, add company details, build estimate rows, then print/save PDF or export a proper XLSX file.</p>
          </div>
          <div className="actions"><Link className="btn btn-ghost" href="/tools">All tools</Link><button className="btn btn-primary" onClick={() => window.print()}>Print / save PDF</button><button className="btn btn-hivis" onClick={downloadXlsx}>Download XLSX</button></div>
        </div>

        <div className="tool-grid no-print">
          <div className="card form-grid">
            <div className="field"><label>Logo</label><input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setLogo(String(reader.result)); reader.readAsDataURL(file); }} /></div>
            <div className="field"><label>Company name</label><input value={company} onChange={(e) => setCompany(e.target.value)} /></div>
            <div className="field full"><label>Company details</label><input value={companyDetails} onChange={(e) => setCompanyDetails(e.target.value)} /></div>
            <div className="field"><label>Client</label><input value={client} onChange={(e) => setClient(e.target.value)} /></div>
            <div className="field"><label>Quote number</label><input value={quoteNo} onChange={(e) => setQuoteNo(e.target.value)} /></div>
            <div className="field full"><label>Project / works</label><input value={project} onChange={(e) => setProject(e.target.value)} /></div>
            <div className="field"><label>Markup %</label><input type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} /></div>
            <div className="field"><label>VAT %</label><input type="number" value={vatRate} onChange={(e) => setVatRate(Number(e.target.value))} /></div>
            <div className="field"><label>Quote validity</label><input value={validity} onChange={(e) => setValidity(e.target.value)} /></div>
            <div className="field full"><label>Notes / exclusions</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
        </div>

        <div className="card no-print">
          <div className="page-title"><div><h2>Estimate rows</h2><p className="muted">Add labour, materials, plant, subcontractors, prelims or anything else.</p></div><div className="actions"><button className="btn btn-ghost" onClick={() => setRows(demoRows)}>Demo rows</button><button className="btn btn-hivis" onClick={() => setRows([...rows, { category: 'Labour', description: '', qty: 1, unit: 'item', rate: 0 }])}>Add row</button></div></div>
          <div className="table-wrap"><table className="table"><thead><tr><th>Category</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th><th></th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}><td><input value={r.category} onChange={(e) => updateRow(i, { category: e.target.value })} /></td><td><input value={r.description} onChange={(e) => updateRow(i, { description: e.target.value })} /></td><td><input type="number" value={r.qty} onChange={(e) => updateRow(i, { qty: Number(e.target.value) })} style={{ width: 90 }} /></td><td><input value={r.unit} onChange={(e) => updateRow(i, { unit: e.target.value })} style={{ width: 80 }} /></td><td><input type="number" value={r.rate} onChange={(e) => updateRow(i, { rate: Number(e.target.value) })} style={{ width: 110 }} /></td><td>{money(Number(r.qty || 0) * Number(r.rate || 0))}</td><td><button className="btn btn-ghost" onClick={() => setRows(rows.filter((_, x) => x !== i))}>Remove</button></td></tr>)}</tbody></table></div>
        </div>

        <div className="print-page">
          <div className="print-head">
            <div>{logo ? <img className="print-logo" src={logo} alt="Company logo" /> : <h2>{company}</h2>}<p className="muted">{companyDetails}</p></div>
            <div><div className="eyebrow">EST-01 / QUOTATION</div><h1>{quoteNo}</h1><p><strong>Validity:</strong> {validity}</p></div>
          </div>
          <div className="doc-row"><div><strong>Client</strong><p>{client}</p></div><div><strong>Works</strong><p>{project}</p></div></div>
          <div className="table-wrap"><table className="table"><thead><tr><th>Category</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Total</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}><td>{r.category}</td><td>{r.description}</td><td>{r.qty}</td><td>{r.unit}</td><td>{money(r.rate)}</td><td>{money(Number(r.qty || 0) * Number(r.rate || 0))}</td></tr>)}</tbody></table></div>
          <div className="totals"><div className="row"><span>Net before markup</span><strong>{money(totals.base)}</strong></div><div className="row"><span>Markup</span><strong>{money(totals.markupValue)}</strong></div><div className="row"><span>Net</span><strong>{money(totals.net)}</strong></div><div className="row"><span>VAT</span><strong>{money(totals.vat)}</strong></div><div className="row grand"><span>Total</span><strong>{money(totals.gross)}</strong></div></div>
          <p><strong>Notes:</strong> {notes}</p>
        </div>
      </div>
    </div>
  );
}
