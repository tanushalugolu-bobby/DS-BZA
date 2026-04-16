/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DirectoryPage from './components/DirectoryPage';
import MemberDetailsPage from './components/MemberDetailsPage';
import Settings from './components/Settings';
import LiveWallpaper from './components/LiveWallpaper';
import CustomCursor from './components/CustomCursor';
import { DirectoryProvider } from './DirectoryContext';

export default function App() {
  return (
    <DirectoryProvider>
      <Router>
        <div className="flex bg-transparent min-h-screen relative cursor-none md:cursor-auto">
          <CustomCursor />
          <LiveWallpaper />
          <Sidebar />
          <div className="flex-1 flex flex-col relative z-10 w-full overflow-x-hidden">
            <main className="flex-grow pt-16 md:pt-0">
              <Routes>
                <Route path="/" element={<Navigate to="/staff" replace />} />
                <Route 
                  path="/staff" 
                  element={
                    <DirectoryPage 
                      title="Staff Directory" 
                      subtitle="Medical Personnel" 
                      type="staff"
                    />
                  } 
                />
                <Route 
                  path="/dogs" 
                  element={
                    <DirectoryPage 
                      title="Canine Directory" 
                      subtitle="Canine Unit" 
                      type="dogs"
                    />
                  } 
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/:type/:id" element={<MemberDetailsPage />} />
              </Routes>
            </main>
            
            <footer className="py-8 px-8 border-t border-border/50 text-left">
              <p className="text-[11px] text-text-sub uppercase tracking-widest font-medium">
                © 2026 KinnHub • Version 1.2.0
              </p>
            </footer>
          </div>
        </div>
      </Router>
    </DirectoryProvider>
  );
}






