import React from 'react';
import { Trophy, Star, Shield, Swords } from 'lucide-react';

const ClanCard = ({ data, currentWar }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clan Info */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                        <Shield className="w-6 h-6" /> Clan Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Name</span>
                            <span className="font-semibold">{data.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Level</span>
                            <span className="font-semibold text-yellow-400">{data.clanLevel}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Members</span>
                            <span className="font-semibold">{data.members}/50</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">War Wins</span>
                            <span className="font-semibold text-green-400">{data.warWins}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">War Win Streak</span>
                            <span className="font-semibold text-orange-400">{data.warWinStreak}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Location</span>
                            <span className="font-semibold">{data.location?.name || 'International'}</span>
                        </div>
                    </div>
                </div>

                {/* War Status */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
                        <Swords className="w-6 h-6" /> War Status
                    </h2>
                    {currentWar ? (
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-slate-800 rounded-lg">
                                <p className="text-lg font-bold">{currentWar.state === 'inWar' ? '🔥 Currently in War!' : `State: ${currentWar.state}`}</p>
                                {currentWar.teamSize && (
                                    <p className="text-slate-400 mt-2">Team Size: {currentWar.teamSize} vs {currentWar.teamSize}</p>
                                )}
                            </div>
                            {currentWar.clan && currentWar.opponent && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                                        <p className="font-bold text-blue-400">Us</p>
                                        <p className="text-2xl font-bold">{currentWar.clan.stars} ⭐</p>
                                        <p className="text-sm text-slate-400">{currentWar.clan.destructionPercentage}%</p>
                                    </div>
                                    <div className="text-center p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                                        <p className="font-bold text-red-400">Enemy</p>
                                        <p className="text-2xl font-bold">{currentWar.opponent.stars} ⭐</p>
                                        <p className="text-sm text-slate-400">{currentWar.opponent.destructionPercentage}%</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <p>No active war</p>
                            <p className="text-sm mt-2">Check back later or view War Log</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {data.description && (
                <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-lg mb-2 text-slate-300">Description</h3>
                    <p className="text-slate-400 whitespace-pre-line">{data.description}</p>
                </div>
            )}
        </div>
    );
};

export default ClanCard;