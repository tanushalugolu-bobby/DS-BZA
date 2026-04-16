import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Save, RefreshCcw, Download, FileJson, FileSpreadsheet, Upload } from 'lucide-react';
import { useDirectory } from '@/src/DirectoryContext';
import { exportToCSV, exportToXLSX, parseExcelImport } from '../lib/exportUtils';

export default function Settings() {
  const { staff, dogs, bulkImportMembers } = useDirectory();
  const [isResetting, setIsResetting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBulkExport = (format: 'csv' | 'xlsx') => {
    const allMembers = [...staff, ...dogs];
    const fileName = `Dog_Squad_Full_Backup_${new Date().toISOString().split('T')[0]}`;
    const dataForExport = allMembers.map(m => ({
      Type: staff.find(s => s.id === m.id) ? 'Staff' : 'Dog',
      'PF Number': m.pfNumber,
      Name: m.name,
      Role: m.role,
      Bio: m.bio,
      ...Object.fromEntries(m.details.map(d => [d.label, d.value]))
    }));

    if (format === 'csv') exportToCSV(dataForExport, fileName);
    else if (format === 'xlsx') exportToXLSX(dataForExport, fileName);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await parseExcelImport(file);
        if (data.staff.length === 0 && data.dogs.length === 0) {
          throw new Error("No valid data found in file.");
        }
        
        if (window.confirm(`Found ${data.staff.length} staff and ${data.dogs.length} dogs. Overwrite current directory?`)) {
          bulkImportMembers(data);
          setImportStatus({ type: 'success', message: 'Import successful!' });
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err: any) {
        setImportStatus({ type: 'error', message: err.message || 'Import failed.' });
        setTimeout(() => setImportStatus(null), 5000);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This will clear all local changes.")) {
      localStorage.removeItem('directory_staff');
      localStorage.removeItem('directory_dogs');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white/60 backdrop-blur-lg border-l border-border flex flex-col p-8 md:p-12 overflow-y-auto relative z-10 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-text-main mb-2">Settings</h1>
        <p className="text-text-sub mb-12">Manage your squad directory data and application preferences.</p>

        {importStatus && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl mb-6 font-bold text-center ${
              importStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {importStatus.message}
          </motion.div>
        )}

        <div className="space-y-6">
          <section className="bg-bg-app rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload size={20} className="text-primary" />
              Bulk Import
            </h2>
            <p className="text-xs text-text-sub mb-4">
              Upload an Excel (.xlsx) or CSV file with <strong>Type, Name, Role, Bio</strong> columns to bulk update your directory.
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-sm shadow-xl shadow-primary/20"
            >
              <Upload size={18} /> Select Import File
            </button>
          </section>

          <section className="bg-bg-app rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Download size={20} className="text-primary" />
              Bulk Export
            </h2>
            <p className="text-xs text-text-sub mb-4">Download your entire squad directory for reporting or local backups.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => handleBulkExport('xlsx')}
                className="flex items-center justify-center gap-2 p-3 bg-white border border-border rounded-xl hover:bg-green-50 hover:text-green-600 transition-all font-bold text-xs"
              >
                <FileSpreadsheet size={16} /> Excel Sheet (.xlsx)
              </button>
              <button 
                onClick={() => handleBulkExport('csv')}
                className="flex items-center justify-center gap-2 p-3 bg-white border border-border rounded-xl hover:bg-gray-100 transition-all font-bold text-xs"
              >
                <FileJson size={16} /> CSV Format
              </button>
            </div>
          </section>

          <section className="bg-bg-app rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <RefreshCcw size={20} className="text-primary" />
              Data Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-sm">Reset to Default</p>
                  <p className="text-xs text-text-sub">Restore original staff and dog data.</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-accent text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  Reset Data
                </button>
              </div>
            </div>
          </section>

          <section className="bg-bg-app rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Save size={20} className="text-primary" />
              Application Info
            </h2>
            <div className="space-y-2 text-sm text-text-sub">
              <div className="flex justify-between border-b border-border/30 py-2">
                <span>Version</span>
                <span className="font-mono">1.2.0</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-2">
                <span>Total Staff</span>
                <span className="font-mono">{staff.length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total Canine Team</span>
                <span className="font-mono">{dogs.length}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
