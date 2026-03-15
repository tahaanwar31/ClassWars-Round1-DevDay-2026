import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Shield, Lock, Construction, ChevronRight, Target, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import TacticalBackground from '../components/TacticalBackground';
import api from '../api/axios';

interface RoundInfo {
  roundKey: string;
  roundName: string;
  status: string;
  underConstruction: boolean;
  startTime: string | null;
  endTime: string | null;
  playWindowStart: string | null;
  playWindowEnd: string | null;
  rules: string[];
  enabled: boolean;
  canEnter: boolean;
  availabilityLabel: string;
}

interface CompetitionData {
  generalRules: string[];
  rounds: RoundInfo[];
}

export default function CompetitionLobby() {
  const navigate = useNavigate();
  const [competitionData, setCompetitionData] = useState<CompetitionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const storedTeamName = localStorage.getItem('teamName');
    if (!storedTeamName) {
      navigate('/');
      return;
    }
    setTeamName(storedTeamName);
    fetchCompetitionData();
  }, [navigate]);

  const fetchCompetitionData = async () => {
    try {
      const response = await api.get('/competition/rounds');
      setCompetitionData(response.data);
    } catch (error) {
      console.error('Failed to fetch competition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterRound = (roundKey: string) => {
    if (roundKey === 'round1') {
      navigate('/competition/round1');
    } else if (roundKey === 'round2') {
      navigate('/competition/round2');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (round: RoundInfo) => {
    if (round.underConstruction) {
      return (
        <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-500 text-xs font-bold tracking-widest flex items-center gap-2">
          <Construction className="w-4 h-4" />
          UNDER CONSTRUCTION
        </span>
      );
    }
    
    if (round.canEnter) {
      return (
        <span className="px-3 py-1 bg-[#39ff14]/20 border border-[#39ff14] text-[#39ff14] text-xs font-bold tracking-widest animate-pulse">
          {round.availabilityLabel.toUpperCase()}
        </span>
      );
    }
    
    return (
      <span className="px-3 py-1 bg-gray-500/20 border border-gray-500 text-gray-500 text-xs font-bold tracking-widest">
        {round.availabilityLabel.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020502] text-[#39ff14] font-mono flex items-center justify-center">
        <div className="text-2xl animate-pulse">LOADING COMPETITION DATA...</div>
      </div>
    );
  }

  if (!competitionData) {
    return (
      <div className="min-h-screen bg-[#020502] text-[#39ff14] font-mono flex items-center justify-center">
        <div className="text-2xl text-red-500">FAILED TO LOAD COMPETITION DATA</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020502] text-[#39ff14] font-mono p-4 md:p-8 scanlines crt-flicker relative overflow-hidden">
      <TacticalBackground />
      
      <div className="z-10 relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12 text-[#39ff14] animate-pulse" />
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-glow">CLASS WARS</h1>
                <p className="text-sm md:text-base text-[#39ff14]/70 tracking-[0.2em] mt-1">COMPETITION SELECTION</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#39ff14]/70 tracking-widest">OPERATIVE</p>
              <p className="text-lg md:text-xl font-bold text-white">{teamName}</p>
            </div>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-transparent via-[#39ff14] to-transparent"></div>
        </motion.div>

        {/* Rounds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
          {competitionData.rounds.map((round, index) => (
            <motion.div
              key={round.roundKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-black/80 backdrop-blur-md border-2 p-6 md:p-8 relative overflow-hidden ${
                round.canEnter && !round.underConstruction
                  ? 'border-[#39ff14] shadow-[0_0_30px_rgba(57,255,20,0.2)] hover:shadow-[0_0_50px_rgba(57,255,20,0.4)]'
                  : 'border-[#39ff14]/30'
              } transition-all duration-300`}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#39ff14] opacity-50"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#39ff14] opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#39ff14] opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#39ff14] opacity-50"></div>

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-[#39ff14]" />
                  <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-white">{round.roundName}</h2>
                </div>
                {getStatusBadge(round)}
              </div>

              {/* Timing Info */}
              {(round.playWindowStart || round.playWindowEnd || round.startTime || round.endTime) && (
                <div className="mb-6 space-y-2 text-sm">
                  {round.playWindowStart && (
                    <div className="flex items-center gap-2 text-[#39ff14]/80">
                      <Clock className="w-4 h-4" />
                      <span className="tracking-wider">PLAY OPENS: {formatDate(round.playWindowStart)}</span>
                    </div>
                  )}
                  {round.playWindowEnd && (
                    <div className="flex items-center gap-2 text-[#39ff14]/80">
                      <Clock className="w-4 h-4" />
                      <span className="tracking-wider">PLAY CLOSES: {formatDate(round.playWindowEnd)}</span>
                    </div>
                  )}
                  {round.startTime && !round.playWindowStart && (
                    <div className="flex items-center gap-2 text-[#39ff14]/80">
                      <Clock className="w-4 h-4" />
                      <span className="tracking-wider">START: {formatDate(round.startTime)}</span>
                    </div>
                  )}
                  {round.endTime && !round.playWindowEnd && (
                    <div className="flex items-center gap-2 text-[#39ff14]/80">
                      <Clock className="w-4 h-4" />
                      <span className="tracking-wider">END: {formatDate(round.endTime)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Rules */}
              <div className="mb-6">
                <h3 className="text-sm text-[#39ff14]/70 tracking-widest mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  MISSION PARAMETERS
                </h3>
                <ul className="space-y-2">
                  {round.rules.map((rule, idx) => (
                    <li key={idx} className="text-sm text-white/90 flex items-start gap-2">
                      <span className="text-[#39ff14] mt-1">▸</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                {round.canEnter && !round.underConstruction ? (
                  <button
                    onClick={() => handleEnterRound(round.roundKey)}
                    className="w-full px-6 py-4 bg-[#001a00] border-2 border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-all duration-300 uppercase tracking-widest font-bold flex items-center justify-center gap-3 group shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)]"
                  >
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                    ENTER COMPETITION
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full px-6 py-4 bg-black/50 border-2 border-gray-500/50 text-gray-500/50 cursor-not-allowed uppercase tracking-widest font-bold flex items-center justify-center gap-3"
                  >
                    {round.underConstruction ? (
                      <>
                        <Construction className="w-5 h-5" />
                        COMING SOON
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        {round.availabilityLabel.toUpperCase()}
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* General Rules Section */}
        {competitionData.generalRules && competitionData.generalRules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/80 backdrop-blur-md border-2 border-[#39ff14]/50 p-6 md:p-8 relative overflow-hidden mb-12"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#39ff14] opacity-30"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#39ff14] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#39ff14] opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#39ff14] opacity-30"></div>

            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-[#39ff14]" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-white">GENERAL RULES</h2>
            </div>

            <div className="space-y-3">
              {competitionData.generalRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3 text-white/90">
                  <span className="text-[#39ff14] font-bold mt-1">{idx + 1}.</span>
                  <span className="text-base leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={() => {
              localStorage.removeItem('teamName');
              localStorage.removeItem('teamData');
              navigate('/');
            }}
            className="px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-300 uppercase tracking-widest font-bold"
          >
            DISCONNECT
          </button>
        </motion.div>
      </div>
    </div>
  );
}
