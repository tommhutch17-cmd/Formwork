import Header from '@/components/Header';

export const metadata = {
  title: 'Pricing | Formwork Construction Estimate Generator',
  description: 'Pricing for Formwork: branded construction estimate generator, variation tracker, site diary and snagging list.'
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <section className="section grid-bg">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Pricing</div>
            <h2>Start small, prove people will pay.</h2>
            <p>Use Stripe Payment Links first while testing. After you get paying users, connect the full Stripe checkout/webhook automation.</p>
          </div>
          <div className="pricing-grid">
            <div className="plan">
              <div className="plan-name">Early Access</div>
              <div className="price-big">£49<span> one-off</span></div>
              <div className="plan-desc">Best first offer while the product is young.</div>
              <ul><li>Estimate generator</li><li>Variation tracker</li><li>Site diary</li><li>Snagging list</li><li>Company logo/profile</li><li>PDF and XLSX export</li></ul>
              <form action="/api/checkout" method="POST"><input type="hidden" name="plan" value="full"/><button className="btn btn-ghost btn-block">Buy early access</button></form>
            </div>
            <div className="plan featured">
              <div className="plan-name">Pro Monthly</div>
              <div className="price-big">£9<span> / month</span></div>
              <div className="plan-desc">Recurring revenue once you have usage proof.</div>
              <ul><li>All current tools</li><li>Saved projects</li><li>Branded paperwork</li><li>Cancel any time</li></ul>
              <form action="/api/checkout" method="POST"><input type="hidden" name="plan" value="monthly"/><button className="btn btn-primary btn-block">Start subscription</button></form>
            </div>
            <div className="plan">
              <div className="plan-name">Manual Trial</div>
              <div className="price-big">Free<span> test mode</span></div>
              <div className="plan-desc">Use this while testing with mates/contractors.</div>
              <ul><li>Create projects</li><li>Use the four core tools</li><li>Collect feedback before ads</li></ul>
              <a href="/signup" className="btn btn-ghost btn-block">Create account</a>
            </div>
          </div>
          <div className="notice" style={{marginTop:22}}>For the first live version, put a Stripe Payment Link behind the buy button or manually approve accounts after payment. Full checkout automation can come after people actually pay.</div>
        </div>
      </section>
    </>
  );
}
