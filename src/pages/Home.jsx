import React, { useState, useEffect } from 'react';
import { Trophy, Users, Star, Swords, Clock, TrendingUp } from 'lucide-react';

const API_BASE = 'http://localhost:3002';

const Home = () => {
    const [clanData, setClanData] = useState(null);
    const [currentWar, setCurrentWar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clanRes, warRes] = await Promise.all([
                    fetch(`${API_BASE}/clan`).then(r => r.json()),
                    fetch(`${API_BASE}/currentwar`).then(r => r.json()).catch(() => null)
                ]);

                if (clanRes.success) setClanData(clanRes.data);
                if (warRes?.success) setCurrentWar(warRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white pt-12 pb-8 px-4 rounded-b-[2rem] shadow-lg">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-3xl font-black mb-1 tracking-tight">{clanData?.name || 'Pendragon'}</h1>
                    <p className="text-yellow-100 font-medium opacity-90">{clanData?.tag || '#2Y29VCP89'}</p>

                    <div className="flex justify-center gap-6 mt-6">
                        <div className="text-center">
                            <div className="bg-white/20 backdrop-blur rounded-lg p-2 mb-1">
                                <Trophy className="w-5 h-5 mx-auto" />
                            </div>
                            <p className="text-2xl font-bold">{clanData?.clanLevel}</p>
                            <p className="text-xs opacity-80">Level</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/20 backdrop-blur rounded-lg p-2 mb-1">
                                <Users className="w-5 h-5 mx-auto" />
                            </div>
                            <p className="text-2xl font-bold">{clanData?.members}</p>
                            <p className="text-xs opacity-80">Members</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/20 backdrop-blur rounded-lg p-2 mb-1">
                                <Star className="w-5 h-5 mx-auto" />
                            </div>
                            <p className="text-2xl font-bold">{clanData?.warWins}</p>
                            <p className="text-xs opacity-80">War Wins</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-6 space-y-6">
                {/* Description Card */}
                {clanData?.description && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                            About Clan
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                            {clanData.description}
                        </p>
                    </div>
                )}

                {/* Current War Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Swords className="w-5 h-5 text-red-500" />
                            Current War
                        </h3>
                        {currentWar?.state === 'inWar' && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                LIVE
                            </span>
                        )}
                    </div>

                    <div className="p-4">
                        {!currentWar || currentWar.state === 'notInWar' ? (
                            <div className="text-center py-8 text-slate-400">
                                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No active war right now</p>
                                <p className="text-xs mt-1">Check back later or view war log</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* War Header */}
                                <div className="flex justify-between items-center text-center">
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 truncate">{currentWar.clan?.name}</p>
                                        <p className="text-3xl font-black text-yellow-500 mt-1">{currentWar.clan?.stars}</p>
                                        <p className="text-xs text-slate-500">{currentWar.clan?.destructionPercentage}%</p>
                                    </div>
                                    <div className="px-4">
                                        <span className="text-2xl font-bold text-slate-300">VS</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 truncate">{currentWar.opponent?.name}</p>
                                        <p className="text-3xl font-black text-red-500 mt-1">{currentWar.opponent?.stars}</p>
                                        <p className="text-xs text-slate-500">{currentWar.opponent?.destructionPercentage}%</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-yellow-500 transition-all"
                                        style={{ width: `${currentWar.clan?.destructionPercentage || 0}%` }}
                                    />
                                </div>

                                {/* Team Size & Remaining */}
                                <div className="flex justify-between text-sm text-slate-600 pt-2 border-t border-slate-100">
                                    <span>Size: {currentWar.teamSize} vs {currentWar.teamSize}</span>
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        {currentWar.clan?.attacks || 0} attacks made
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                        <p className="text-yellow-600 text-xs font-bold uppercase mb-1">War Streak</p>
                        <p className="text-2xl font-black text-slate-800">{clanData?.warWinStreak || 0}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-blue-600 text-xs font-bold uppercase mb-1">Required Trophies</p>
                        <p className="text-2xl font-black text-slate-800">{clanData?.requiredTrophies || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;