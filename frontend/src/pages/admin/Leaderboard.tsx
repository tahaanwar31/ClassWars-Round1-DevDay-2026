import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, Medal, Award, Target, Shield, Skull, Clock, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

interface RoundStats {
  maxLevelReached: number;
  totalPoints: number;
  bestPoints: number;
  sessionsPlayed: number;
  lastUpdated: string;
}

interface CombinedEntry {
  teamName: string;
  round1: RoundStats;
  round2: RoundStats;
  // Round 2 display points: 10 per level cleared (max 30)
  round2DisplayPoints: number;
  // Combined score for overall ranking
  combinedLevel: number;  // round1 level * 1000 + round2 display points
  combinedPoints: number; // round1 totalPoints + round2 display points
}

const R2_POINTS_PER_LEVEL = 10;
const R2_MAX_LEVELS = 3;

export default function Leaderboard() {
  const [round1Data, setRound1Data] = useState<any[]>([]);
  const [round2Data, setRound2Data] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'combined' | 'round1' | 'round2'>('combined');

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [r1, r2] = await Promise.all([
        api.get('/admin/leaderboard?roundKey=round1'),
        api.get('/admin/leaderboard?roundKey=round2'),
      ]);
      setRound1Data(r1.data || []);
      setRound2Data(r2.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Build combined entries
  const buildCombined = (): CombinedEntry[] => {
    const teamMap = new Map<string, CombinedEntry>();

    for (const t of round1Data) {
      teamMap.set(t.teamName, {
        teamName: t.teamName,
        round1: {
          maxLevelReached: t.maxLevelReached || 0,
          totalPoints: t.totalPoints || 0,
          bestPoints: t.bestPoints || 0,
          sessionsPlayed: t.sessionsPlayed || 0,
          lastUpdated: t.lastUpdated || '',
        },
        round2: {
          maxLevelReached: 0, totalPoints: 0, bestPoints: 0, sessionsPlayed: 0, lastUpdated: '',
        },
        round2DisplayPoints: 0,
        combinedLevel: 0,
        combinedPoints: 0,
      });
    }

    for (const t of round2Data) {
      const r2Points = Math.min(t.maxLevelReached || 0, R2_MAX_LEVELS) * R2_POINTS_PER_LEVEL;
      const existing = teamMap.get(t.teamName);
      if (existing) {
        existing.round2 = {
          maxLevelReached: t.maxLevelReached || 0,
          totalPoints: t.totalPoints || 0,
          bestPoints: t.bestPoints || 0,
          sessionsPlayed: t.sessionsPlayed || 0,
          lastUpdated: t.lastUpdated || '',
        };
        existing.round2DisplayPoints = r2Points;
      } else {
        teamMap.set(t.teamName, {
          teamName: t.teamName,
          round1: { maxLevelReached: 0, totalPoints: 0, bestPoints: 0, sessionsPlayed: 0, lastUpdated: '' },
          round2: {
            maxLevelReached: t.maxLevelReached || 0,
            totalPoints: t.totalPoints || 0,
            bestPoints: t.bestPoints || 0,
            sessionsPlayed: t.sessionsPlayed || 0,
            lastUpdated: t.lastUpdated || '',
          },
          round2DisplayPoints: r2Points,
          combinedLevel: 0,
          combinedPoints: 0,
        });
      }
    }

    const entries = [...teamMap.values()];
    for (const e of entries) {
      // Combined: Round 1 level is primary, Round 2 points as secondary
      e.combinedLevel = e.round1.maxLevelReached;
      e.combinedPoints = e.round1.totalPoints + e.round2DisplayPoints;
    }

    // Sort: Round 1 level (desc) → Round 2 points (desc) → Round 1 total points (desc) → time (asc)
    entries.sort((a, b) => {
      if (b.round1.maxLevelReached !== a.round1.maxLevelReached) {
        return b.round1.maxLevelReached - a.round1.maxLevelReached;
      }
      if (b.round2DisplayPoints !== a.round2DisplayPoints) {
        return b.round2DisplayPoints - a.round2DisplayPoints;
      }
      if (b.round1.totalPoints !== a.round1.totalPoints) {
        return b.round1.totalPoints - a.round1.totalPoints;
      }
      const aTime = a.round1.lastUpdated ? new Date(a.round1.lastUpdated).getTime() : Infinity;
      const bTime = b.round1.lastUpdated ? new Date(b.round1.lastUpdated).getTime() : Infinity;
      return aTime - bTime;
    });

    return entries;
  };

  const combined = buildCombined();

  const getRankIcon = (i: number) => {
    if (i === 0) return <Trophy className="w-7 h-7 text-yellow-400" />;
    if (i === 1) return <Medal className="w-7 h-7 text-gray-400" />;
    if (i === 2) return <Award className="w-7 h-7 text-orange-500" />;
    return <span className="text-lg font-black text-white/30">#{i + 1}</span>;
  };

  const getRankGlow = (i: number) => {
    if (i === 0) return 'border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]';
    if (i === 1) return 'border-gray-400/30';
    if (i === 2) return 'border-orange-500/30';
    return 'border-white/8';
  };

  if (loading && combined.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ff6600]/60 tracking-[0.3em] text-sm animate-pulse">LOADING LEADERBOARD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.15em] text-white">LEADERBOARD</h1>
          <p className="text-[11px] tracking-[0.15em] text-white/30 mt-1">Live ranking — auto-refreshes every 10s</p>
        </div>
        <div className="flex gap-2">
          {(['combined', 'round1', 'round2'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 text-[10px] font-bold tracking-[0.2em] border transition ${
                view === v
                  ? 'border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600]'
                  : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
              }`}
            >
              {v === 'combined' ? 'COMBINED' : v === 'round1' ? 'ROUND 1' : 'ROUND 2'}
            </button>
          ))}
          <button
            onClick={fetchAll}
            className="px-3 py-2 border border-white/10 text-white/30 hover:border-[#ff6600]/40 hover:text-[#ff6600] transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* COMBINED VIEW */}
      {view === 'combined' && (
        <div className="space-y-3">
          {combined.length === 0 ? (
            <div className="border border-white/10 bg-black/40 p-8 text-center text-white/20 text-sm">
              No teams have played yet
            </div>
          ) : (
            combined.map((entry, i) => (
              <div
                key={entry.teamName}
                className={`border bg-black/60 p-4 flex items-center gap-4 transition-all hover:bg-black/80 ${getRankGlow(i)}`}
              >
                {/* Rank */}
                <div className="w-10 shrink-0 flex justify-center">
                  {getRankIcon(i)}
                </div>

                {/* Team name + stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className={`font-black tracking-[0.12em] text-sm ${i < 3 ? 'text-white' : 'text-white/60'}`}>
                      {entry.teamName}
                    </span>
                    {i === 0 && <span className="text-[8px] tracking-[0.2em] text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 bg-yellow-400/5">LEADING</span>}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-[10px] tracking-wider">
                    <span className="flex items-center gap-1 text-[#39ff14]/60">
                      <Target className="w-3 h-3" />
                      R1 LVL {entry.round1.maxLevelReached}
                    </span>
                    <span className="flex items-center gap-1 text-[#ff6600]/60">
                      <Shield className="w-3 h-3" />
                      R2 {entry.round2DisplayPoints}/{R2_MAX_LEVELS * R2_POINTS_PER_LEVEL} PTS
                    </span>
                  </div>
                </div>

                {/* R1 Level badge */}
                <div className="shrink-0 text-center border border-[#39ff14]/15 bg-[#39ff14]/5 px-3 py-2">
                  <div className="text-[8px] tracking-[0.2em] text-[#39ff14]/40 mb-0.5">R1 LEVEL</div>
                  <div className="text-lg font-black text-[#39ff14]">{entry.round1.maxLevelReached}</div>
                </div>

                {/* R2 Points badge */}
                <div className="shrink-0 text-center border border-[#ff6600]/15 bg-[#ff6600]/5 px-3 py-2">
                  <div className="text-[8px] tracking-[0.2em] text-[#ff6600]/40 mb-0.5">R2 POINTS</div>
                  <div className="text-lg font-black text-[#ff6600]">{entry.round2DisplayPoints}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ROUND 1 VIEW */}
      {view === 'round1' && (
        <div className="space-y-3">
          {round1Data.length === 0 ? (
            <div className="border border-white/10 bg-black/40 p-8 text-center text-white/20 text-sm">
              No teams have played Round 1 yet
            </div>
          ) : (
            round1Data.map((entry: any, i: number) => (
              <div
                key={entry.teamName}
                className={`border bg-black/60 p-4 flex items-center gap-4 transition-all hover:bg-black/80 ${getRankGlow(i)}`}
              >
                <div className="w-10 shrink-0 flex justify-center">{getRankIcon(i)}</div>
                <div className="flex-1 min-w-0">
                  <span className={`font-black tracking-[0.12em] text-sm ${i < 3 ? 'text-white' : 'text-white/60'}`}>
                    {entry.teamName}
                  </span>
                  <div className="flex items-center gap-4 mt-1 text-[10px] tracking-wider text-white/30">
                    <span>Sessions: {entry.sessionsPlayed || 0}</span>
                    <span>Best: {entry.bestPoints || 0} pts</span>
                  </div>
                </div>
                <div className="shrink-0 text-center border border-[#39ff14]/15 bg-[#39ff14]/5 px-4 py-2">
                  <div className="text-[8px] tracking-[0.2em] text-[#39ff14]/40 mb-0.5">LEVEL</div>
                  <div className="text-xl font-black text-[#39ff14]">{entry.maxLevelReached || 0}</div>
                </div>
                <div className="shrink-0 text-center px-4 py-2">
                  <div className="text-[8px] tracking-[0.2em] text-white/20 mb-0.5">POINTS</div>
                  <div className="text-xl font-black text-white/70">{entry.totalPoints || 0}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ROUND 2 VIEW */}
      {view === 'round2' && (
        <div className="space-y-3">
          {round2Data.length === 0 ? (
            <div className="border border-white/10 bg-black/40 p-8 text-center text-white/20 text-sm">
              No teams have played Round 2 yet
            </div>
          ) : (
            round2Data.map((entry: any, i: number) => {
              const displayPts = Math.min(entry.maxLevelReached || 0, R2_MAX_LEVELS) * R2_POINTS_PER_LEVEL;
              return (
                <div
                  key={entry.teamName}
                  className={`border bg-black/60 p-4 flex items-center gap-4 transition-all hover:bg-black/80 ${getRankGlow(i)}`}
                >
                  <div className="w-10 shrink-0 flex justify-center">{getRankIcon(i)}</div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-black tracking-[0.12em] text-sm ${i < 3 ? 'text-white' : 'text-white/60'}`}>
                      {entry.teamName}
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-[10px] tracking-wider text-white/30">
                      <span className="flex items-center gap-1">
                        <Skull className="w-3 h-3 text-[#ff6600]/40" />
                        Levels cleared: {entry.maxLevelReached || 0}/{R2_MAX_LEVELS}
                      </span>
                      <span>Sessions: {entry.sessionsPlayed || 0}</span>
                    </div>
                  </div>
                  {/* Level indicators */}
                  <div className="shrink-0 flex gap-1">
                    {[1, 2, 3].map(lvl => (
                      <div
                        key={lvl}
                        className={`w-8 h-8 flex items-center justify-center text-[10px] font-black border ${
                          (entry.maxLevelReached || 0) >= lvl
                            ? 'border-[#ff6600]/50 bg-[#ff6600]/15 text-[#ff6600]'
                            : 'border-white/8 bg-black text-white/10'
                        }`}
                      >
                        L{lvl}
                      </div>
                    ))}
                  </div>
                  <div className="shrink-0 text-center border border-[#ff6600]/15 bg-[#ff6600]/5 px-4 py-2">
                    <div className="text-[8px] tracking-[0.2em] text-[#ff6600]/40 mb-0.5">POINTS</div>
                    <div className="text-xl font-black text-[#ff6600]">{displayPts}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* RANKING RULES */}
      <div className="border border-white/8 bg-black/40 p-4">
        <div className="text-[9px] font-bold tracking-[0.25em] text-white/30 mb-3">RANKING RULES</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-white/25 leading-5">
          <div>
            <div className="text-[#39ff14]/50 font-bold mb-1 tracking-[0.15em]">ROUND 1</div>
            <div>Primary: Highest level reached</div>
            <div>Secondary: Total points scored</div>
            <div>Tie-break: Who reached it first</div>
          </div>
          <div>
            <div className="text-[#ff6600]/50 font-bold mb-1 tracking-[0.15em]">ROUND 2</div>
            <div>{R2_POINTS_PER_LEVEL} points per level cleared</div>
            <div>Max: {R2_MAX_LEVELS} levels = {R2_MAX_LEVELS * R2_POINTS_PER_LEVEL} points</div>
            <div>Tie-break: Who reached it first</div>
          </div>
        </div>
      </div>
    </div>
  );
}
