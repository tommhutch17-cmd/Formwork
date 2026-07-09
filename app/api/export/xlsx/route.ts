import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

type SheetPayload = {
  name: string;
  headings: string[];
  rows: Array<Array<string | number>>;
};

function safeFileName(name: string) {
  return name.replace(/[^a-z0-9-_ ]/gi, '').trim().replace(/\s+/g, '-') || 'formwork-export';
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const workbookName = String(body.workbookName || 'Formwork Export');
  const sheets: SheetPayload[] = Array.isArray(body.sheets) ? body.sheets : [];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Formwork';
  workbook.created = new Date();

  if (!sheets.length) {
    sheets.push({ name: 'Export', headings: ['Item', 'Value'], rows: [['No data', '']] });
  }

  sheets.forEach((sheet) => {
    const ws = workbook.addWorksheet(sheet.name.slice(0, 31) || 'Sheet');
    ws.addRow([workbookName]);
    ws.mergeCells(1, 1, 1, Math.max(sheet.headings.length, 1));
    ws.getCell(1, 1).font = { bold: true, size: 16, color: { argb: 'FF16233D' } };
    ws.addRow([]);
    const header = ws.addRow(sheet.headings);
    header.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16233D' } };
      cell.alignment = { vertical: 'middle' };
    });
    sheet.rows.forEach((row) => ws.addRow(row));
    ws.columns.forEach((col) => { col.width = 22; });
    ws.views = [{ state: 'frozen', ySplit: 3 }];
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${safeFileName(workbookName)}.xlsx"`
    }
  });
}
