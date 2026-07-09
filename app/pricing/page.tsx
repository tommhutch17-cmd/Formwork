import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'Pricing | Formwork Construction Estimate Generator',
  description: 'Simple pricing for Formwork construction estimate generator, variation tracker, site diary and snagging list.'
};

export default function PricingPage() {
  return <><Header /><main className="section grid-bg"><div className="wrap"><div className="section-head"><div className="eyebrow">Pricing</div><h1>Start with the free working tools.</h1><p>The live version lets contractors try the tools first. Once feedback is strong, connect Stripe and sell paid access.</p></div><div className="pricing-grid"><div className="plan featured"><div className="plan-name">Free Tool Demo</div><div className="price-big">£0<span> while testing</span></div><div className="plan-desc">Best option right now: let people see the output before asking them to pay.</div><ul><li>Estimate generator</li><li>Variation tracker</li><li>Site diary</li><li>Snagging list</li><li>PDF print view</li><li>Proper XLSX export</li></ul><Link href="/tools/estimate-generator" className="btn btn-primary">Use estimate generator</Link></div><div className="plan"><div className="plan-name">Early Access</div><div className="price-big">£49<span> one-off</span></div><div className="plan-desc">Use this once you have tested with a few real contractors.</div><ul><li>Saved projects</li><li>Saved company branding</li><li>All four tools</li><li>Email support</li></ul><Link href="/tools" className="btn btn-ghost">Try tools first</Link></div><div className="plan"><div className="plan-name">Pro Monthly</div><div className="price-big">£9<span> / month</span></div><div className="plan-desc">Recurring version after people prove they use it.</div><ul><li>Cloud dashboard</li><li>Multiple projects</li><li>Logo and company profile</li><li>New tools added</li></ul><Link href="/tools" className="btn btn-ghost">View tools</Link></div></div><div className="notice" style={{marginTop:24}}>Payment buttons are deliberately not pretending to work yet. Add Stripe Payment Links once the tool pages feel good enough to sell.</div></div></main></>;
}
