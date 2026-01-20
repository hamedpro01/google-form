
import React, { useState } from 'react';

interface EmailStepProps {
  onSubmit: (email: string) => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Enter an email or phone number');
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
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
            block w-full px-3.5 py-4 text-sm text-white bg-transparent rounded-md border
            ${error ? 'border-red-500' : 'border-neutral-600'}
            appearance-none focus:outline-none focus:ring-0
            ${error ? 'focus:border-red-500' : 'focus:border-blue-500'}
            peer transition-colors
          `}
          placeholder=" "
        />
        <label
          htmlFor="email"
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
          Email or phone
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-2 px-1">{error}</p>}
      
      <div className="mt-3">
        <button type="button" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
          Forgot email?
        </button>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button type="button" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
          Create account
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

export default EmailStep;
