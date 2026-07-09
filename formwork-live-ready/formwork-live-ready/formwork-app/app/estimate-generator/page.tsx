import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'Construction Estimate Generator for UK Contractors | Formwork',
  description: 'Build professional branded construction estimates with your company logo, VAT details, markup, payment terms, PDF print view and XLSX export.'
};

export default function EstimateGeneratorPage() {
  return (
    <>
      <Header />
      <section className="hero grid-bg">
        <div className="wrap">
          <div>
            <div className="eyebrow">EST-01 / Estimate Generator</div>
            <h1>Construction estimate generator for small contractors.</h1>
            <p className="lead">Add your company logo and details once, then create professional client-ready estimates without messing around with spreadsheet formatting.</p>
            <div className="hero-ctas">
              <Link href="/signup" className="btn btn-primary">Start building estimates →</Link>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
            <div className="hero-note">Built for UK contractors, subcontractors, estimators and small building firms.</div>
          </div>
          <div className="doc-stage">
            <div className="doc">
              <div className="stamp">EST-01</div>
              <div className="doc-head"><div><div className="code">BRANDED QUOTATION</div><h3>Kitchen Reinstatement</h3></div></div>
              <div className="doc-field"><label>Client</label><div className="val">Mrs Smith — 14 Marsh Lane</div></div>
              <div className="doc-row"><div className="doc-field"><label>Net</label><div className="val">£3,950.00</div></div><div className="doc-field"><label>VAT</label><div className="val">£790.00</div></div></div>
              <div className="doc-field"><label>Total</label><div className="val">£4,740.00</div></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="section-head"><div className="eyebrow">What it does</div><h2>Professional estimate paperwork without the admin faff.</h2><p>Formwork stores your branding, project information and rows, then produces a clean estimate you can send to clients, insurers, builders or internal teams.</p></div>
          <div className="cards">
            <div className="card"><div className="stat">01</div><h2>Company branding</h2><p className="muted">Logo, address, email, VAT number, payment terms and footer notes saved once.</p></div>
            <div className="card"><div className="stat">02</div><h2>Estimate rows</h2><p className="muted">Labour, materials, plant, subcontractors, preliminaries, markup and VAT.</p></div>
            <div className="card"><div className="stat">03</div><h2>Exports</h2><p className="muted">Branded print/PDF view and proper XLSX export, not a broken CSV pretending to be Excel.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
