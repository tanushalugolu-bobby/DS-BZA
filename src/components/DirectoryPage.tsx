import MemberCard from './MemberCard';
import { motion, AnimatePresence } from 'motion/react';
import { useDirectory } from '@/src/DirectoryContext';
import { Plus, Download, FileJson, Table, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { exportToCSV, exportToXLSX } from '../lib/exportUtils';

interface DirectoryPageProps {
  title: string;
  subtitle: string;
  type: 'staff' | 'dogs';
}

export default function DirectoryPage({ title, subtitle, type }: DirectoryPageProps) {
  const navigate = useNavigate();
  const { staff, dogs, addMember } = useDirectory();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const members = type === 'staff' ? staff : dogs;

  const handleAddMember = () => {
    const newId = addMember(type);
    navigate(`/${type}/${newId}`);
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    const fileName = `${type}_directory_${newDate().toISOString().split('T')[0]}`;
    const dataForExport = members.map(m => ({
      'PF Number': m.pfNumber,
      Name: m.name,
      Role: m.role,
      Bio: m.bio,
      ...Object.fromEntries(m.details.map(d => [d.label, d.value]))
    }));

    if (format === 'csv') exportToCSV(dataForExport, fileName);
    else if (format === 'xlsx') exportToXLSX(dataForExport, fileName);
    
    setShowExportOptions(false);
  };

  // Helper because newDate is not safe in some contexts, but let's use standard Date
  const newDate = () => new Date();

  return (
    <div className="p-4 md:p-8 relative z-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main pr-12 md:pr-0">{title}</h1>
          <p className="text-sm text-text-sub mt-1 font-medium">{subtitle}</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-border rounded-xl hover:bg-bg-app transition-all font-bold text-sm shadow-sm w-full justify-center"
            >
              <Download size={18} /> Export
            </button>
            
            <AnimatePresence>
              {showExportOptions && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowExportOptions(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <button 
                      onClick={() => handleExport('xlsx')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-bg-app transition-colors text-left font-medium"
                    >
                      <FileSpreadsheet size={16} className="text-green-600" /> Excel (.xlsx)
                    </button>
                    <button 
                      onClick={() => handleExport('csv')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-bg-app transition-colors text-left font-medium border-t border-border/30"
                    >
                      <FileJson size={16} className="text-gray-600" /> CSV Format
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleAddMember}
            className="flex-1 sm:flex-none flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:scale-105 transition-transform font-bold text-sm shadow-xl shadow-primary/20 justify-center"
          >
            <Plus size={18} /> Add {type === 'staff' ? 'Staff' : 'Dog'}
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <MemberCard member={member} type={type} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}




