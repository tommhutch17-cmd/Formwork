import Link from 'next/link';
import Header from '@/components/Header';
import { tools } from '@/lib/tools';

export default function Home() {
  return (
    <>
      <Header />
      <section className="hero grid-bg">
        <div className="wrap">
          <div>
            <div className="eyebrow">Construction paperwork, digitised</div>
            <h1>Construction estimate generator with your logo already on it.</h1>
            <p className="lead">Formwork helps small contractors create branded estimates, variations, site diaries and snagging lists without faffing around with formatting.</p>
            <div className="hero-ctas">
              <Link href="/estimate-generator" className="btn btn-primary">View estimate generator →</Link>
              <Link href="/signup" className="btn btn-hivis">Create account</Link>
              <Link href="/#register" className="btn btn-ghost">Browse tools</Link>
            </div>
            <div className="hero-note">Add company details once. Every estimate and form comes out looking professional.</div>
          </div>

          <div className="doc-stage">
            <div className="doc">
              <div className="stamp">BRANDED</div>
              <div className="doc-head">
                <div>
                  <div className="code">EST-01 / QUOTATION</div>
                  <h3>Estimate No. 1024</h3>
                </div>
              </div>
              <div className="doc-row">
                <div className="doc-field"><label>Contractor</label><div className="val">Your Company Ltd</div></div>
                <div className="doc-field"><label>Client</label><div className="val">14 Marsh Lane</div></div>
              </div>
              <div className="doc-field"><label>Works</label><div className="val">Kitchen reinstatement following escape of water</div></div>
              <div className="doc-row">
                <div className="doc-field"><label>Total</label><div className="val">£4,812.00</div></div>
                <div className="doc-field"><label>Validity</label><div className="val">30 days</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="register">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Working tools</div>
            <h2>Four tools in the first proper version.</h2>
            <p>Start with the forms a small contractor can actually use on day one.</p>
          </div>
          <div className="register">
            {tools.map((tool) => (
              <div className="doc-card" key={tool.code}>
                <div className="code">{tool.code}</div>
                <div><div className="title">{tool.title}</div><div className="desc">{tool.desc}</div></div>
                <div className="price">{tool.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="wrap">
          <div>
            <h2>Sell the professional output, not a blank spreadsheet.</h2>
            <p>Customers add their logo, company details, VAT number, terms and quote validity once. Every project then creates branded paperwork automatically.</p>
          </div>
          <div className="terms">
            <div className="term-tag">Estimate generator</div><div className="term-tag">Variation tracker</div><div className="term-tag">Site diary</div><div className="term-tag">Snagging list</div><div className="term-tag">PDF export</div><div className="term-tag">XLSX export</div>
          </div>
        </div>
      </section>
      <footer><div className="wrap foot-bottom"><span>© 2026 FORMWORK</span><span>FORM FW-FOOT / REV C</span></div></footer>
    </>
  );
}
