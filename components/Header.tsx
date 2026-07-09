import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="wrap nav">
        <Link href="/" className="logo">FORMWORK <span className="code">FW/01</span></Link>
        <nav className="nav-links">
          <Link href="/tools">Tools</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/tools/estimate-generator">Estimate generator</Link>
        </nav>
        <div className="actions">
          <Link href="/tools/estimate-generator" className="btn btn-hivis">Try free</Link>
        </div>
      </div>
    </header>
  );
}
