'use server';

import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';

export async function saveCompany(formData: FormData) {
  const { supabase, user } = await requireUser();
  let logoUrl = String(formData.get('existingLogoUrl') || '');
  const logo = formData.get('logo');

  if (logo instanceof File && logo.size > 0) {
    const ext = logo.name.split('.').pop() || 'png';
    const path = `${user.id}/${Date.now()}.${ext}`;
    const arrayBuffer = await logo.arrayBuffer();
    const { error: uploadError } = await supabase.storage.from('company-logos').upload(path, arrayBuffer, {
      contentType: logo.type || 'image/png',
      upsert: true
    });
    if (uploadError) redirect('/settings/company?error=' + encodeURIComponent(uploadError.message));
    const { data } = supabase.storage.from('company-logos').getPublicUrl(path);
    logoUrl = data.publicUrl;
  }

  const payload = {
    owner_id: user.id,
    name: String(formData.get('name') || ''),
    address: String(formData.get('address') || ''),
    email: String(formData.get('email') || ''),
    phone: String(formData.get('phone') || ''),
    vat_number: String(formData.get('vat_number') || ''),
    company_number: String(formData.get('company_number') || ''),
    payment_terms: String(formData.get('payment_terms') || ''),
    quote_validity: String(formData.get('quote_validity') || ''),
    footer_note: String(formData.get('footer_note') || ''),
    logo_url: logoUrl
  };

  const { error } = await supabase.from('companies').upsert(payload, { onConflict: 'owner_id' });
  if (error) redirect('/settings/company?error=' + encodeURIComponent(error.message));
  redirect('/settings/company?saved=1');
}
