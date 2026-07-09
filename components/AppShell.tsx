import Link from 'next/link';
import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="app-shell">
        <aside className="sidebar">
          <div className="logo" style={{color:'#fff', marginBottom: 22}}>FORMWORK <span className="code" style={{color:'#dbe2ef', borderColor:'#445a80'}}>APP</span></div>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/settings/company">Company Profile</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/pricing">Billing</Link>
        </aside>
        <main className="app-main">{children}</main>
      </div>
    </>
  );
}
