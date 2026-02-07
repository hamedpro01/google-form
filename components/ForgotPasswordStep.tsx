
import React, { useState } from 'react';

interface ForgotPasswordStepProps {
  email: string;
  onBack: () => void;
}

const ForgotPasswordStep: React.FC<ForgotPasswordStepProps> = ({ email, onBack }) => {
  const [recoveryInfo, setRecoveryInfo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryInfo) {
      setError('Enter your phone number or recovery email');
      return;
    }
    alert(`Verification code sent to your recovery method for account: ${email}`);
    onBack();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-6 flex justify-center">
        <div className="flex items-center gap-2 border border-[#dadce0] rounded-full px-3 py-1.5 text-sm font-medium text-[#3c4043]">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
             <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          {email}
        </div>
      </div>

      <div className="relative group mt-8">
        <input
          type="text"
          id="recoveryInfo"
          value={recoveryInfo}
          onChange={(e) => {
            setRecoveryInfo(e.target.value);
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
          htmlFor="recoveryInfo"
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
          Recovery phone or email
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
      
      <p className="text-sm text-[#5f6368] mt-8 leading-relaxed">
        Google will send a verification code to this phone number or email address. Standard rates apply.
      </p>

      <div className="mt-10 flex justify-between items-center">
        <button 
          type="button" 
          onClick={onBack}
          className="text-[#1a73e8] hover:text-[#174ea6] text-sm font-semibold transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white font-medium py-2 px-6 rounded-md transition-all shadow-sm active:shadow-none"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordStep;
