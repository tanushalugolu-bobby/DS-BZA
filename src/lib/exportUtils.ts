import * as XLSX from 'xlsx';
import { Member } from '../data';

export const exportToCSV = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToXLSX = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const parseExcelImport = async (file: File): Promise<{ staff: Member[], dogs: Member[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

        const importedStaff: Member[] = [];
        const importedDogs: Member[] = [];

        jsonData.forEach((row, index) => {
          const type = row.Type?.toLowerCase();
          const pfNumber = row['PF Number'] || row.PFNumber || `24409813${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
          const member: Member = {
            id: `imported-${index}-${Date.now()}`,
            name: row.Name || 'Unknown',
            pfNumber: pfNumber,
            role: row.Role || 'Unit Member',
            bio: row.Bio || '',
            image: `https://picsum.photos/seed/${index}-${Date.now()}/600/800`,
            documents: [],
            details: []
          };

          // Any other keys are considered details
          Object.keys(row).forEach(key => {
            if (!['Type', 'Name', 'Role', 'Bio', 'PF Number', 'PFNumber'].includes(key)) {
              member.details.push({ label: key, value: String(row[key]) });
            }
          });

          if (type === 'dog' || type === 'dogs') {
            importedDogs.push(member);
          } else {
            importedStaff.push(member);
          }
        });

        resolve({ staff: importedStaff, dogs: importedDogs });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
