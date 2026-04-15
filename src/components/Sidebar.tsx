import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Users, Dog, Settings } from 'lucide-react';
import { useDirectory } from '@/src/DirectoryContext';

export default function Sidebar() {
  const { staff, dogs } = useDirectory();
  
  return (
    <aside className="w-[220px] bg-white/80 backdrop-blur-xl border-r border-border h-screen flex flex-col p-6 sticky top-0 z-20">
      <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-primary mb-12">
        <div className="w-6 h-6 bg-primary rounded-md" />
        <span>KinnHub</span>
      </div>
      
      <nav className="flex-grow space-y-2">
        <NavLink 
          to="/staff" 
          className={({ isActive }) => cn(
            "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
            isActive ? "bg-accent text-primary" : "text-text-sub hover:bg-bg-app"
          )}
        >
          <div className="flex items-center gap-3">
            <Users size={18} />
            <span>Staff Members</span>
          </div>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[11px] font-bold",
            "bg-border-gray text-text-main group-active:bg-primary group-active:text-white"
          )}>
            {staff.length}
          </span>
        </NavLink>
        
        <NavLink 
          to="/dogs" 
          className={({ isActive }) => cn(
            "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
            isActive ? "bg-accent text-primary" : "text-text-sub hover:bg-bg-app"
          )}
        >
          <div className="flex items-center gap-3">
            <Dog size={18} />
            <span>Canine Team</span>
          </div>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[11px] font-bold",
            "bg-border-gray text-text-main"
          )}>
            {dogs.length}
          </span>
        </NavLink>
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-sub cursor-pointer hover:bg-bg-app transition-colors">
          <Settings size={18} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
}


