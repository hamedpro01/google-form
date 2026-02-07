
import React, { useState } from 'react';

interface PasswordStepProps {
  email: string;
  isSyncing: boolean;
  onSubmit: (password: string) => void;
  onBack: () => void;
  onForgotPassword: () => void;
}

const PasswordStep: React.FC<PasswordStepProps> = ({ email, isSyncing, onSubmit, onBack, onForgotPassword }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Enter a password');
      return;
    }
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-6 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border border-[#dadce0] rounded-full px-3 py-1.5 text-sm font-medium text-[#3c4043] hover:bg-[#f8f9fa] transition-colors"
        >
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
             <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          {email}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <div className="relative group mt-8">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
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
          disabled={isSyncing}
        />
        <label
          htmlFor="password"
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
          Enter your password
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
      
      <div className="mt-4 flex items-center">
        <input id="showPassword" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="w-4 h-4 text-[#1a73e8] border-[#dadce0] rounded focus:ring-0" />
        <label htmlFor="showPassword" className="ms-2 text-sm font-normal text-[#202124]">Show password</label>
      </div>
      
      <div className="mt-12 flex justify-between items-center">
        <button 
          type="button" 
          onClick={onForgotPassword}
          className="text-[#1a73e8] hover:text-[#174ea6] text-sm font-semibold transition-colors"
        >
          Forgot password?
        </button>
        <button
          type="submit"
          disabled={isSyncing}
          className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-medium py-2.5 px-6 rounded-md transition-all shadow-sm active:shadow-none disabled:bg-gray-400 flex items-center gap-2"
        >
          {isSyncing && <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          Next
        </button>
      </div>
    </form>
  );
};

export default PasswordStep;
