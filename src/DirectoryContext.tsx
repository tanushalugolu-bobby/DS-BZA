import React, { createContext, useContext, useState, useEffect } from 'react';
import { staff as initialStaff, dogs as initialDogs, Member } from './data';

interface DirectoryContextType {
  staff: Member[];
  dogs: Member[];
  updateMember: (type: 'staff' | 'dogs', updatedMember: Member) => void;
  addMember: (type: 'staff' | 'dogs') => string;
  deleteMember: (type: 'staff' | 'dogs', id: string) => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Member[]>([]);
  const [dogs, setDogs] = useState<Member[]>([]);

  useEffect(() => {
    const savedStaff = localStorage.getItem('directory_staff');
    const savedDogs = localStorage.getItem('directory_dogs');

    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    } else {
      setStaff(initialStaff);
    }

    if (savedDogs) {
      setDogs(JSON.parse(savedDogs));
    } else {
      setDogs(initialDogs);
    }
  }, []);

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
      role: 'New Role',
      bio: 'New biography entry...',
      image: `https://picsum.photos/seed/${newId}/600/800`,
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
    <DirectoryContext.Provider value={{ staff, dogs, updateMember, addMember, deleteMember }}>
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
