import React, { createContext, useContext, useState, useEffect } from 'react';
import { staff as initialStaff, dogs as initialDogs, Member } from './data';

interface DirectoryContextType {
  staff: Member[];
  dogs: Member[];
  isLoaded: boolean;
  updateMember: (type: 'staff' | 'dogs', updatedMember: Member) => void;
  addMember: (type: 'staff' | 'dogs') => string;
  deleteMember: (type: 'staff' | 'dogs', id: string) => void;
  bulkImportMembers: (data: { staff: Member[], dogs: Member[] }) => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Member[]>([]);
  const [dogs, setDogs] = useState<Member[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedStaff = localStorage.getItem('directory_staff');
    const savedDogs = localStorage.getItem('directory_dogs');

    const normalize = (list: Member[], typePrefix: string) => {
      return list.map((m, idx) => ({
        ...m,
        pfNumber: m.pfNumber || `24409813${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        documents: m.documents || [],
        details: m.details || [],
        image: m.image || `https://picsum.photos/seed/${m.id}/600/800`
      }));
    };

    if (savedStaff) {
      setStaff(normalize(JSON.parse(savedStaff), 's'));
    } else {
      setStaff(normalize(initialStaff, 's'));
    }

    if (savedDogs) {
      setDogs(normalize(JSON.parse(savedDogs), 'd'));
    } else {
      setDogs(normalize(initialDogs, 'd'));
    }
    
    setIsLoaded(true);
  }, []);

  const bulkImportMembers = (data: { staff: Member[], dogs: Member[] }) => {
    if (data.staff.length > 0) {
      setStaff(data.staff);
      localStorage.setItem('directory_staff', JSON.stringify(data.staff));
    }
    if (data.dogs.length > 0) {
      setDogs(data.dogs);
      localStorage.setItem('directory_dogs', JSON.stringify(data.dogs));
    }
  };

  const updateMember = (type: 'staff' | 'dogs', updatedMember: Member) => {
    if (type === 'staff') {
      const newStaff = staff.map(m => m.id === updatedMember.id ? updatedMember : m);
      setStaff(newStaff);
      localStorage.setItem('directory_staff', JSON.stringify(newStaff));
    } else {
      const newDogs = dogs.map(m => m.id === updatedMember.id ? updatedMember : m);
      setDogs(newDogs);
      localStorage.setItem('directory_dogs', JSON.stringify(newDogs));
    }
  };

  const addMember = (type: 'staff' | 'dogs') => {
    const newId = `${type === 'staff' ? 's' : 'd'}${Date.now()}`;
    const newMember: Member = {
      id: newId,
      name: `New ${type === 'staff' ? 'Staff' : 'Dog'}`,
      pfNumber: `24409813${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      role: 'New Role',
      bio: 'New biography entry...',
      image: `https://picsum.photos/seed/${newId}/600/800`,
      documents: [],
      details: [
        { label: 'Joined', value: new Date().getFullYear().toString() }
      ]
    };

    if (type === 'staff') {
      const newStaff = [...staff, newMember];
      setStaff(newStaff);
      localStorage.setItem('directory_staff', JSON.stringify(newStaff));
    } else {
      const newDogs = [...dogs, newMember];
      setDogs(newDogs);
      localStorage.setItem('directory_dogs', JSON.stringify(newDogs));
    }
    return newId;
  };

  const deleteMember = (type: 'staff' | 'dogs', id: string) => {
    if (type === 'staff') {
      const newStaff = staff.filter(m => m.id !== id);
      setStaff(newStaff);
      localStorage.setItem('directory_staff', JSON.stringify(newStaff));
    } else {
      const newDogs = dogs.filter(m => m.id !== id);
      setDogs(newDogs);
      localStorage.setItem('directory_dogs', JSON.stringify(newDogs));
    }
  };

  return (
    <DirectoryContext.Provider value={{ staff, dogs, isLoaded, updateMember, addMember, deleteMember, bulkImportMembers }}>
      {children}
    </DirectoryContext.Provider>
  );
}



export function useDirectory() {
  const context = useContext(DirectoryContext);
  if (context === undefined) {
    throw new Error('useDirectory must be used within a DirectoryProvider');
  }
  return context;
}
