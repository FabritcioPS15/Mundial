import ExcelJS from 'exceljs';

export interface ImportParticipant {
  DNI: string;
  Telefono: string;
  Placa: string;
  Sede?: string;
  Campeon?: string;
  Subcampeon?: string;
  TercerPuesto?: string;
}

export async function readExcelFile(file: File): Promise<ImportParticipant[]> {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No se encontró ninguna hoja en el archivo Excel');
  }

  const data: ImportParticipant[] = [];
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];

  headerRow.eachCell((cell) => {
    headers.push(cell.value?.toString().trim() || '');
  });

  let rowIndex = 2;
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const rowData: any = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        rowData[header] = cell.value;
      }
    });

    // Map Excel columns to ImportParticipant interface
    const participant: ImportParticipant = {
      DNI: rowData['DNI'] || rowData['dni'] || '',
      Telefono: rowData['Telefono'] || rowData['telefono'] || rowData['Teléfono'] || '',
      Placa: rowData['Placa'] || rowData['placa'] || '',
      Sede: rowData['Sede'] || rowData['sede'] || undefined,
      Campeon: rowData['Campeon'] || rowData['campeon'] || rowData['Campeón'] || undefined,
      Subcampeon: rowData['Subcampeon'] || rowData['subcampeon'] || rowData['Subcampeón'] || undefined,
      TercerPuesto: rowData['TercerPuesto'] || rowData['tercerPuesto'] || rowData['Tercer Puesto'] || undefined,
    };

    if (participant.DNI && participant.Telefono && participant.Placa) {
      data.push(participant);
    }

    rowIndex++;
  });

  return data;
}

export function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'RTP-2026-';

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}
