// src/components/ClanCard.jsx
import React from 'react';

const ClanCard = ({ clanData }) => {
    if (!clanData) return null;

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-amber-500/20 shadow-xl">
            {/* Clan Header */}
            <div className="flex items-center mb-6">
                <div className="relative">
                    <img
                        src={clanData.badgeUrls?.large}
                        alt="Clan Badge"
                        className="w-20 h-20 rounded-xl border-3 border-amber-500/30"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-3 border-gray-900">
                        {clanData.clanLevel}
                    </div>
                </div>

                <div className="ml-4">
                    <h2 className="text-2xl font-bold text-white">{clanData.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-amber-600/20 text-amber-400 text-xs px-3 py-1 rounded-full">
                            <i className="ri-user-star-fill mr-1"></i> {clanData.owner?.name || 'Nana'}
                        </span>
                        <span className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                            {clanData.tag}
                        </span>
                        <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                            <i className="ri-map-pin-fill mr-1"></i> {clanData.location?.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-6">
                <p className="text-gray-300 whitespace-pre-line text-sm">{clanData.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBox
                    icon="ri-team-fill"
                    value={clanData.members}
                    label="Members"
                    color="text-blue-400"
                />
                <StatBox
                    icon="ri-trophy-fill"
                    value={clanData.clanPoints?.toLocaleString()}
                    label="Clan Points"
                    color="text-amber-400"
                />
                <StatBox
                    icon="ri-sword-fill"
                    value={clanData.warWins}
                    label="War Wins"
                    color="text-red-400"
                />
                <StatBox
                    icon="ri-medal-fill"
                    value={clanData.warWinStreak}
                    label="Win Streak"
                    color="text-green-400"
                />
            </div>
        </div>
    );
};

const StatBox = ({ icon, value, label, color }) => (
    <div className="bg-gray-900/50 rounded-lg p-3 text-center">
        <div className={`text-xl mb-1 ${color}`}>
            <i className={icon}></i>
        </div>
        <div className="text-lg font-bold text-white">{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
    </div>
);

export default ClanCard;