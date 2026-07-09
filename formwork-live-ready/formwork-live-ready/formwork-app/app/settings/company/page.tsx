import AppShell from '@/components/AppShell';
import { requireUser } from '@/lib/requireUser';
import { saveCompany } from './actions';

export default async function CompanyPage({ searchParams }: { searchParams: Promise<{ saved?: string, error?: string }> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: company } = await supabase.from('companies').select('*').eq('owner_id', user.id).maybeSingle();

  return (
    <AppShell>
      <div className="page-title"><div><div className="eyebrow">Company Profile</div><h1>Branding used on every estimate</h1><p className="muted">Upload the logo and details once. Formwork pulls them into PDFs and Excel exports automatically.</p></div></div>
      {params.saved && <div className="notice success">Company profile saved.</div>}
      {params.error && <div className="notice danger">{params.error}</div>}
      <form action={saveCompany} className="card form-grid">
        <input type="hidden" name="existingLogoUrl" value={company?.logo_url || ''} />
        <div className="field full">
          <label>Company logo</label>
          {company?.logo_url && <img className="logo-preview" src={company.logo_url} alt="Company logo" />}
          <input name="logo" type="file" accept="image/*" />
        </div>
        <div className="field"><label>Company name</label><input name="name" defaultValue={company?.name || ''} required /></div>
        <div className="field"><label>Email</label><input name="email" type="email" defaultValue={company?.email || ''} /></div>
        <div className="field"><label>Phone</label><input name="phone" defaultValue={company?.phone || ''} /></div>
        <div className="field"><label>VAT number</label><input name="vat_number" defaultValue={company?.vat_number || ''} /></div>
        <div className="field"><label>Company number</label><input name="company_number" defaultValue={company?.company_number || ''} /></div>
        <div className="field"><label>Quote validity</label><input name="quote_validity" defaultValue={company?.quote_validity || 'Quote valid for 30 days'} /></div>
        <div className="field full"><label>Address</label><textarea name="address" defaultValue={company?.address || ''} /></div>
        <div className="field full"><label>Payment terms</label><textarea name="payment_terms" defaultValue={company?.payment_terms || 'Payment due within 14 days of invoice.'} /></div>
        <div className="field full"><label>Footer note</label><textarea name="footer_note" defaultValue={company?.footer_note || 'Thank you for the opportunity to quote for these works.'} /></div>
        <button className="btn btn-primary full">Save company profile</button>
      </form>
    </AppShell>
  );
}
