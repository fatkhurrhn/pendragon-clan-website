// src/components/WarLog.jsx
import React from 'react';

const WarLog = ({ wars }) => {
    if (!wars || wars.length === 0) {
        return (
            <div className="text-center py-8">
                <i className="ri-sword-line text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">No war data available</p>
                <p className="text-gray-500 text-sm mt-2">Clan might be in preparation day</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Recent Wars</h3>
                <div className="text-sm text-gray-400">
                    Showing {wars.length} {wars.length === 1 ? 'war' : 'wars'}
                </div>
            </div>

            <div className="space-y-4">
                {wars.map((war, index) => (
                    <WarCard key={index} war={war} />
                ))}
            </div>

            {/* War Statistics */}
            <div className="mt-8 bg-gray-900/50 rounded-xl p-4">
                <h4 className="text-lg font-bold text-white mb-3">War Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                    <StatItem
                        label="Wins"
                        value={wars.filter(w => w.result === 'win').length}
                        color="text-green-400"
                    />
                    <StatItem
                        label="Losses"
                        value={wars.filter(w => w.result === 'lose').length}
                        color="text-red-400"
                    />
                    <StatItem
                        label="Draws"
                        value={wars.filter(w => w.result === 'tie' || !w.result).length}
                        color="text-yellow-400"
                    />
                </div>
            </div>
        </div>
    );
};

const WarCard = ({ war }) => {
    const getResultColor = (result) => {
        switch (result) {
            case 'win': return 'bg-green-900/30 border-green-700/50 text-green-400';
            case 'lose': return 'bg-red-900/30 border-red-700/50 text-red-400';
            case 'tie': return 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400';
            default: return 'bg-gray-800 border-gray-700 text-gray-400';
        }
    };

    const getResultIcon = (result) => {
        switch (result) {
            case 'win': return 'ri-sword-fill';
            case 'lose': return 'ri-shield-cross-fill';
            case 'tie': return 'ri-scales-fill';
            default: return 'ri-question-fill';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <div className="text-white font-bold mb-1">vs {war.opponent?.name || 'Unknown Clan'}</div>
                    <div className="text-sm text-gray-400">
                        <i className="ri-team-fill mr-1"></i>
                        Team Size: {war.teamSize}
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-full border ${getResultColor(war.result)}`}>
                    <div className="flex items-center">
                        <i className={`${getResultIcon(war.result)} mr-2`}></i>
                        <span className="font-bold">{war.result?.toUpperCase() || 'UNKNOWN'}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                    <i className="ri-calendar-line mr-1"></i>
                    {formatDate(war.endTime)}
                </div>
                <div>
                    {war.clan?.stars !== undefined && war.opponent?.stars !== undefined && (
                        <span className="text-white">
                            {war.clan.stars} - {war.opponent.stars} Stars
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ label, value, color }) => (
    <div className="text-center">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
);

export default WarLog;