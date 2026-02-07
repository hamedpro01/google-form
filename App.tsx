
import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Check for URL parameter ?mode=admin
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
      setIsAdminView(true);
    }

    // Listen for the hidden click-trigger event
    const handleToggleAdmin = () => setIsAdminView(prev => !prev);
    window.addEventListener('toggle-admin', handleToggleAdmin);
    
    return () => window.removeEventListener('toggle-admin', handleToggleAdmin);
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#202124] min-h-screen w-full font-sans selection:bg-blue-100">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {isAdminView ? (
          <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-300">
            <AdminPanel onBack={handleCloseAdmin} />
          </div>
        ) : (
          <LoginModal />
        )}
      </div>
    </div>
  );
};

export default App;
