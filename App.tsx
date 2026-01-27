
import React, { useState } from 'react';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen w-full font-sans">
      {/* Login Modal is now centered on a solid background */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <LoginModal />
      </div>
    </div>
  );
};

export default App;
