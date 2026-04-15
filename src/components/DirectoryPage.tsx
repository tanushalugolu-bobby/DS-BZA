import MemberCard from './MemberCard';
import { motion } from 'motion/react';
import { useDirectory } from '@/src/DirectoryContext';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DirectoryPageProps {
  title: string;
  subtitle: string;
  type: 'staff' | 'dogs';
}

export default function DirectoryPage({ title, subtitle, type }: DirectoryPageProps) {
  const navigate = useNavigate();
  const { staff, dogs, addMember } = useDirectory();
  const members = type === 'staff' ? staff : dogs;

  const handleAddMember = () => {
    const newId = addMember(type);
    navigate(`/${type}/${newId}`);
  };

  return (
    <div className="p-8 relative z-10">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">{title}</h1>
          <p className="text-sm text-text-sub mt-1">{subtitle}</p>
        </div>
        
        <button 
          onClick={handleAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:scale-105 transition-transform font-bold text-sm shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Add {type === 'staff' ? 'Staff' : 'Dog'}
        </button>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <MemberCard member={member} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}




