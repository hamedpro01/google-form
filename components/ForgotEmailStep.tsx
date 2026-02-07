
import React, { useState } from 'react';

interface ForgotEmailStepProps {
  onBack: () => void;
}

const ForgotEmailStep: React.FC<ForgotEmailStepProps> = ({ onBack }) => {
  const [recoveryInfo, setRecoveryInfo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryInfo) {
      setError('Enter your phone number or recovery email');
      return;
    }
    // Simulation: just show a success alert and go back
    alert('Recovery instructions sent if the account exists.');
    onBack();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="relative group">
        <input
          type="text"
          id="recoveryInfo"
          value={recoveryInfo}
          onChange={(e) => {
            setRecoveryInfo(e.target.value);
            if (error) setError('');
          }}
          className={`
            block w-full px-3.5 py-4 text-sm text-white bg-transparent rounded-md border
            ${error ? 'border-red-500' : 'border-neutral-600'}
            appearance-none focus:outline-none focus:ring-0
            ${error ? 'focus:border-red-500' : 'focus:border-blue-500'}
            peer transition-colors
          `}
          placeholder=" "
        />
        <label
          htmlFor="recoveryInfo"
          className={`
            absolute text-sm 
            ${error ? 'text-red-500' : 'text-neutral-400'}
            duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]
            bg-neutral-900/80 px-2 peer-focus:px-2 
            ${error ? 'peer-focus:text-red-500' : 'peer-focus:text-blue-500'}
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75
            peer-focus:-translate-y-4 start-1 transition-all
          `}
        >
          Phone number or recovery email
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-2 px-1">{error}</p>}
      
      <div className="mt-8 flex justify-between items-center">
        <button 
          type="button" 
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ForgotEmailStep;
