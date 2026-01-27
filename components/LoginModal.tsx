
import React, { useState } from 'react';
import { LoginStep } from '../types';
import EmailStep from './EmailStep';
import PasswordStep from './PasswordStep';
import GoogleLogo from './icons/GoogleLogo';

const LoginModal: React.FC = () => {
  const [step, setStep] = useState<LoginStep>(LoginStep.EMAIL);
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep(LoginStep.PASSWORD);
  };

  const handlePasswordSubmit = (password: string) => {
    // In a real app, you would send the email and password to a server.
    // For this simulation, we'll just log it and show a success message.
    console.log('--- Form Submission ---');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('-----------------------');

    // Store the email in localStorage to persist the data
    try {
      localStorage.setItem('userEmail', email);
      console.log('Email saved to localStorage.');
    } catch (error) {
      console.error('Failed to save email to localStorage:', error);
    }
    
    setStep(LoginStep.SUCCESS);
  };

  const handleGoBack = () => {
    setEmail('');
    setStep(LoginStep.EMAIL);
  };

  const renderStep = () => {
    switch (step) {
      case LoginStep.EMAIL:
        return <EmailStep onSubmit={handleEmailSubmit} />;
      case LoginStep.PASSWORD:
        return <PasswordStep email={email} onSubmit={handlePasswordSubmit} onBack={handleGoBack} />;
      case LoginStep.SUCCESS:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Login Successful!</h2>
            <p className="text-neutral-400">Account verified</p>
            <p className="text-sm text-neutral-500 mt-4">Your email has been saved for future sessions.</p>
            <p className="text-sm text-neutral-500 mt-1">Check the console for submitted data.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm rounded-2xl w-full max-w-md mx-auto border border-neutral-700 shadow-2xl shadow-blue-500/10">
      <div className="px-4 py-5 sm:px-8 sm:py-8">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2">
            <GoogleLogo />
            <span className="text-2xl font-bold tracking-tighter text-neutral-200">YouTube</span>
          </div>
          <h1 className="text-xl font-medium text-neutral-300 mt-4">
            Please sign in to continue
          </h1>
        </div>
        <div className="mt-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
