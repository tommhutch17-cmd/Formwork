import Link from 'next/link';
import Header from '@/components/Header';
import { tools } from '@/lib/tools';

const routes: Record<string, string> = {
  'EST-01': '/tools/estimate-generator',
  'VAR-02': '/tools/variation-tracker',
  'DIA-03': '/tools/site-diary',
  'SNG-04': '/tools/snagging-list'
};

export const metadata = {
  title: 'Construction Tools | Formwork',
  description: 'Try Formwork tools: construction estimate generator, variation tracker, site diary and snagging list.'
};

export default function ToolsPage() {
  return <><Header /><main className="section grid-bg"><div className="wrap"><div className="section-head"><div className="eyebrow">Working tools</div><h1>Use the tools directly.</h1><p>No “coming soon” list. These four tools are the first version: estimating, variations, diary and snagging.</p></div><div className="tool-card-grid">{tools.map((tool)=><Link className="tool-card" href={routes[tool.code]} key={tool.code}><div className="code">{tool.code}</div><h2>{tool.title}</h2><p>{tool.desc}</p><span className="btn btn-primary">Open tool →</span></Link>)}</div></div></main></>;
}
