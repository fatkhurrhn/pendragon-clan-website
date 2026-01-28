import React, { useState, useEffect } from 'react';
import { Trophy, Sword, Calendar } from 'lucide-react';

const API_BASE = 'http://localhost:3002';

const WarLog = () => {
    const [wars, setWars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/warlog`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setWars(data.data.items || []);
            })
            .finally(() => setLoading(false));
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
            <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Sword className="w-6 h-6 text-red-500" />
                        War Log
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {wars.length}
                        </span>
                    </h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-4 space-y-3">
                {wars.map((war, idx) => {
                    const isWin = war.result === 'win';
                    const isDraw = war.result === 'draw';
                    const resultColor = isWin ? 'text-green-600 bg-green-50 border-green-200' :
                        isDraw ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                            'text-red-600 bg-red-50 border-red-200';

                    return (
                        <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${resultColor} uppercase`}>
                                    {war.result || 'Unknown'}
                                </div>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {war.endTime ? new Date(war.endTime).toLocaleDateString() : 'Unknown date'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <div className="text-left">
                                    <p className="font-bold text-slate-800 text-sm">Our Clan</p>
                                    <p className="text-2xl font-black text-yellow-500">{war.clan.stars} ⭐</p>
                                    <p className="text-xs text-slate-500">{war.clan.destructionPercentage}%</p>
                                </div>
                                <div className="px-3">
                                    <span className="text-xs font-bold text-slate-300">VS</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800 text-sm truncate max-w-[100px]">
                                        {war.opponent.name}
                                    </p>
                                    <p className="text-2xl font-black text-slate-400">{war.opponent.stars} ⭐</p>
                                    <p className="text-xs text-slate-500">{war.opponent.destructionPercentage}%</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                                <span>Team Size: {war.teamSize}</span>
                                <span>Attacks: {war.clan.attacks || 0}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WarLog;