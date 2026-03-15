import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Terminal, Lock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import TacticalBackground from '../components/TacticalBackground';

export default function TeamLogin() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3002/teams/login', {
        teamName,
        password,
      });
      
      localStorage.setItem('teamName', response.data.teamName);
      localStorage.setItem('teamData', JSON.stringify(response.data));
      navigate('/competition');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed - Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020502] text-[#39ff14] font-mono flex items-center justify-center p-4 scanlines crt-flicker relative overflow-hidden">
      <TacticalBackground />
      
      <div className="z-10 w-full max-w-md bg-black/80 backdrop-blur-md border-2 border-[#39ff14]/50 shadow-[0_0_50px_rgba(57,255,20,0.15)] relative">
        {/* HUD Corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#39ff14] opacity-70"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#39ff14] opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#39ff14] opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#39ff14] opacity-70"></div>

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-[#39ff14] animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 tracking-widest text-glow">
            CLASS WARS
          </h1>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Terminal className="w-4 h-4 text-[#39ff14]/70" />
            <p className="text-[#39ff14]/70 text-center text-sm tracking-[0.3em]">
              OPERATIVE AUTHENTICATION
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border-2 border-red-500 text-red-400 px-4 py-3 mb-6 flex items-start gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold tracking-wider mb-1">ACCESS DENIED</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name Input */}
            <div>
              <label className="block text-sm font-bold text-[#39ff14]/90 mb-2 tracking-widest">
                OPERATIVE CALLSIGN
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border-2 border-[#39ff14]/50 focus:border-[#39ff14] focus:shadow-[0_0_20px_rgba(57,255,20,0.3)] text-white placeholder-[#39ff14]/30 outline-none transition-all font-mono"
                  placeholder="Enter team designation..."
                  required
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-[#39ff14]/90 mb-2 tracking-widest">
                SECURITY CLEARANCE CODE
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#39ff14]/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/60 border-2 border-[#39ff14]/50 focus:border-[#39ff14] focus:shadow-[0_0_20px_rgba(57,255,20,0.3)] text-white placeholder-[#39ff14]/30 outline-none transition-all font-mono"
                  placeholder="Enter access code..."
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#001a00] border-2 border-[#39ff14] text-[#39ff14] py-4 hover:bg-[#39ff14] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg tracking-widest shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <Terminal className="w-5 h-5" />
                    [ INITIATE MISSION ]
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-[#39ff14] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </form>

          {/* Admin Link */}
          <div className="mt-8 pt-6 border-t border-[#39ff14]/30 text-center">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-[#39ff14]/70 hover:text-[#39ff14] text-sm tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto group"
            >
              <Lock className="w-4 h-4 group-hover:animate-pulse" />
              COMMAND CENTER ACCESS →
            </button>
          </div>

          {/* Status Bar */}
          <div className="mt-6 text-center text-xs text-[#39ff14]/50 tracking-[0.2em]">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-pulse"></span>
              SECURE CONNECTION ESTABLISHED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
