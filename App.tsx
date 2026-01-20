
import React, { useState } from 'react';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen w-full font-sans">
      {/* Background simulating a YouTube page */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="https://picsum.photos/800/1200?blur=5"
          alt="Blurred background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Login Modal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <LoginModal />
      </div>
    </div>
  );
};

export default App;
