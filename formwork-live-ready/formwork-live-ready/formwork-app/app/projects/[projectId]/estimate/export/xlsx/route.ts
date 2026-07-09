import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/requireUser';
import ExcelJS from 'exceljs';

export const runtime = 'nodejs';

function money(n: number) { return Number(n || 0); }

export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase, user } = await requireUser();
  const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).eq('owner_id', user.id).single();
  const { data: company } = await supabase.from('companies').select('*').eq('id', project.company_id).single();
  const { data: estimate } = await supabase.from('estimates').select('*').eq('project_id', project.id).single();
  const { data: items } = await supabase.from('estimate_items').select('*').eq('estimate_id', estimate.id).order('sort_order');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Formwork';
  wb.created = new Date();
  const ws = wb.addWorksheet('Estimate', { views: [{ showGridLines: false }] });
  ws.columns = [
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Description', key: 'description', width: 55 },
    { header: 'Qty', key: 'qty', width: 10 },
    { header: 'Unit', key: 'unit', width: 10 },
    { header: 'Rate', key: 'rate', width: 14 },
    { header: 'Total', key: 'total', width: 14 }
  ];

  ws.mergeCells('A1:F1'); ws.getCell('A1').value = company.name || 'Company'; ws.getCell('A1').font = { size: 20, bold: true, color: { argb: '16233D' } };
  ws.mergeCells('A2:F2'); ws.getCell('A2').value = `${company.address || ''}  ${company.email || ''}  ${company.phone || ''}`;
  ws.mergeCells('A4:F4'); ws.getCell('A4').value = 'QUOTATION'; ws.getCell('A4').font = { size: 18, bold: true };
  ws.getCell('A5').value = 'Quote number'; ws.getCell('B5').value = estimate.quote_number;
  ws.getCell('A6').value = 'Project'; ws.getCell('B6').value = project.project_name;
  ws.getCell('A7').value = 'Client'; ws.getCell('B7').value = project.client_name;
  ws.getCell('A8').value = 'Project address'; ws.getCell('B8').value = project.project_address;

  const headerRow = ws.getRow(11);
  headerRow.values = ['Category','Description','Qty','Unit','Rate','Total'];
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '16233D' } };

  let rowNum = 12;
  for (const item of items || []) {
    const total = money(item.qty) * money(item.rate);
    const row = ws.getRow(rowNum++);
    row.values = [item.category, item.description, money(item.qty), item.unit, money(item.rate), total];
    row.getCell(5).numFmt = '£#,##0.00';
    row.getCell(6).numFmt = '£#,##0.00';
  }

  const netBeforeMarkup = (items || []).reduce((sum:any, r:any)=>sum + Number(r.qty||0)*Number(r.rate||0),0);
  const markupValue = netBeforeMarkup * (Number(estimate.markup_percent||0)/100);
  const net = netBeforeMarkup + markupValue;
  const vat = net * (Number(estimate.vat_rate||0)/100);
  const gross = net + vat;
  rowNum += 2;
  const totals = [['Net before markup', netBeforeMarkup], ['Markup', markupValue], ['Net', net], ['VAT', vat], ['Total', gross]];
  for (const [label, value] of totals) {
    ws.getCell(`E${rowNum}`).value = label;
    ws.getCell(`F${rowNum}`).value = Number(value);
    ws.getCell(`F${rowNum}`).numFmt = '£#,##0.00';
    if (label === 'Total') { ws.getRow(rowNum).font = { bold: true, size: 14 }; }
    rowNum++;
  }
  rowNum += 1;
  ws.mergeCells(`A${rowNum}:F${rowNum}`); ws.getCell(`A${rowNum}`).value = `Payment terms: ${company.payment_terms || ''}`;
  rowNum++;
  ws.mergeCells(`A${rowNum}:F${rowNum}`); ws.getCell(`A${rowNum}`).value = `Quote validity: ${company.quote_validity || ''}`;
  rowNum++;
  ws.mergeCells(`A${rowNum}:F${rowNum}`); ws.getCell(`A${rowNum}`).value = estimate.notes || '';

  ws.eachRow((row) => row.eachCell((cell) => { cell.border = { bottom: { style: 'thin', color: { argb: 'E5E0D3' } } }; }));
  const buffer = await wb.xlsx.writeBuffer();
  const safeName = String(project.project_name || 'estimate').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="formwork-${safeName}.xlsx"`
    }
  });
}
