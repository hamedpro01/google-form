
import React, { useState } from 'react';

interface EmailStepProps {
  onSubmit: (email: string) => void;
  onForgotEmail: () => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ onSubmit, onForgotEmail }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Enter an email or phone number');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="relative group">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          className={`
            block w-full px-3.5 py-3.5 text-base text-[#202124] bg-white rounded-md border
            ${error ? 'border-[#d93025]' : 'border-[#dadce0]'}
            appearance-none focus:outline-none focus:ring-1
            ${error ? 'focus:border-[#d93025] focus:ring-[#d93025]' : 'focus:border-[#1a73e8] focus:ring-[#1a73e8]'}
            peer transition-all
          `}
          placeholder=" "
        />
        <label
          htmlFor="email"
          className={`
            absolute text-base 
            ${error ? 'text-[#d93025]' : 'text-[#5f6368]'}
            duration-200 transform -translate-y-7 scale-75 top-4 z-10 origin-[0]
            bg-white px-1 peer-focus:px-1 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75
            peer-focus:-translate-y-7 start-3 transition-all
          `}
        >
          Email or phone
        </label>
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 px-1">
          <svg className="w-4 h-4 text-[#d93025]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p className="text-[#d93025] text-xs font-normal">{error}</p>
        </div>
      )}
      
      <div className="mt-3">
        <button 
          type="button" 
          onClick={onForgotEmail}
          className="text-[#1a73e8] hover:text-[#174ea6] text-sm font-semibold transition-colors"
        >
          Forgot email?
        </button>
      </div>

      <p className="text-sm text-[#5f6368] mt-10 leading-relaxed">
        Not your computer? Use a Private window to sign in. <a href="#" className="text-[#1a73e8] font-semibold">Learn more</a>
      </p>

      <div className="mt-10 flex justify-end items-center">
        <button
          type="submit"
          className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-medium py-2.5 px-6 rounded-md transition-all shadow-sm active:shadow-none"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default EmailStep;
