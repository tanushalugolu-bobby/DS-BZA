import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Users, Dog, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { useDirectory } from '@/src/DirectoryContext';
import { useState } from 'react';

export default function Sidebar() {
  const { staff, dogs } = useDirectory();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { to: "/staff", icon: Users, label: "Staff Members", count: staff.length },
    { to: "/dogs", icon: Dog, label: "Canine Team", count: dogs.length },
    { to: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-2 bg-white/80 backdrop-blur-md border border-border rounded-xl md:hidden shadow-lg text-primary"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 w-[240px] bg-white/80 backdrop-blur-xl border-r border-border h-screen flex flex-col p-6 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-primary mb-12">
          <div className="w-6 h-6 bg-primary rounded-md" />
          <span>Dog Squad</span>
        </div>
        
        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors group",
                isActive ? "bg-accent text-primary" : "text-text-sub hover:bg-bg-app"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors",
                  "bg-border-gray text-text-main group-hover:bg-primary/10 group-active:bg-primary group-active:text-white"
                )}>
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border/50">
          <p className="text-[10px] text-text-sub uppercase tracking-widest font-bold mb-4">Support</p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-text-sub cursor-pointer hover:bg-bg-app transition-colors">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
              ?
            </div>
            <span>Help Center</span>
          </div>
        </div>
      </aside>
    </>
  );
}


