
import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);

  // Listen for a custom event to trigger the hidden admin panel
  useEffect(() => {
    const handleToggleAdmin = () => setIsAdminView(prev => !prev);
    window.addEventListener('toggle-admin', handleToggleAdmin);
    return () => window.removeEventListener('toggle-admin', handleToggleAdmin);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen w-full font-sans">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {isAdminView ? (
          <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-300">
            <AdminPanel onBack={() => setIsAdminView(false)} />
          </div>
        ) : (
          <LoginModal />
        )}
      </div>
    </div>
  );
};

export default App;
