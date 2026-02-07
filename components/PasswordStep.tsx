
import React, { useState } from 'react';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface PasswordStepProps {
  email: string;
  onSubmit: (password: string) => void;
  onBack: () => void;
  onForgotPassword: () => void;
}

const PasswordStep: React.FC<PasswordStepProps> = ({ email, onSubmit, onBack, onForgotPassword }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Enter a password');
      return;
    }
    setError('');
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border border-neutral-600 rounded-full px-3 py-1 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {email}
        </button>
      </div>
      <h2 className="text-2xl font-light text-neutral-200 mb-2">Welcome</h2>
      
      <div className="relative group mt-6">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
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
          htmlFor="password"
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
          Enter your password
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-2 px-1">{error}</p>}
      
      <div className="mt-4 flex items-center">
        <input id="showPassword" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-500 rounded focus:ring-blue-600 focus:ring-2" />
        <label htmlFor="showPassword" className="ms-2 text-sm font-medium text-neutral-300">Show password</label>
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <button 
          type="button" 
          onClick={onForgotPassword}
          className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
        >
          Forgot password?
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

export default PasswordStep;
