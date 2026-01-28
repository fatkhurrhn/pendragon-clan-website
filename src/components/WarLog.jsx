import React from 'react';
import { Trophy, Sword, Star, Percent } from 'lucide-react';

const WarLog = ({ wars }) => {
    if (!wars || wars.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <Sword className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent wars found</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Recent Wars ({wars.length})
            </h2>

            <div className="space-y-4">
                {wars.slice(0, 10).map((war, idx) => {
                    const isWin = war.result === 'win';
                    const isLoss = war.result === 'loss';
                    const bgColor = isWin ? 'bg-green-900/20 border-green-500/30' :
                        isLoss ? 'bg-red-900/20 border-red-500/30' :
                            'bg-yellow-900/20 border-yellow-500/30';

                    return (
                        <div key={idx} className={`p-4 rounded-xl border ${bgColor}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className={`text-lg font-bold ${isWin ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-yellow-400'
                                        }`}>
                                        {war.result?.toUpperCase() || 'DRAW'}
                                    </span>
                                    <span className="text-slate-400 text-sm ml-2">
                                        vs {war.opponent?.name || 'Unknown'}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {war.teamSize} vs {war.teamSize}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-slate-900/50 p-3 rounded">
                                    <div className="text-xs text-slate-400 mb-1">Stars</div>
                                    <div className="font-bold text-lg flex items-center justify-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        {war.clan.stars} - {war.opponent.stars}
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 p-3 rounded">
                                    <div className="text-xs text-slate-400 mb-1">Destruction</div>
                                    <div className="font-bold text-lg flex items-center justify-center gap-1">
                                        <Percent className="w-4 h-4 text-blue-400" />
                                        {war.clan.destructionPercentage}% - {war.opponent.destructionPercentage}%
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 p-3 rounded">
                                    <div className="text-xs text-slate-400 mb-1">Attacks</div>
                                    <div className="font-bold text-lg">
                                        {war.clan.attacks} / {war.teamSize * 2}
                                    </div>
                                </div>
                            </div>

                            {war.endTime && (
                                <div className="mt-3 text-xs text-slate-500 text-right">
                                    Ended: {new Date(war.endTime).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WarLog;