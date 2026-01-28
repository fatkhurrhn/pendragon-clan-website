import React, { useState } from 'react';
import { Trophy, Star, Shield, ArrowUpDown } from 'lucide-react';

const MemberList = ({ members }) => {
    const [sortBy, setSortBy] = useState('trophies');
    const [sortDesc, setSortDesc] = useState(true);

    const sortedMembers = [...members].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'role') {
            const roleOrder = { leader: 4, coLeader: 3, admin: 2, member: 1 };
            valA = roleOrder[a.role] || 0;
            valB = roleOrder[b.role] || 0;
        }

        return sortDesc ? valB - valA : valA - valB;
    });

    const getRoleColor = (role) => {
        switch (role) {
            case 'leader': return 'text-yellow-400 font-bold';
            case 'coLeader': return 'text-purple-400';
            case 'admin': return 'text-blue-400';
            default: return 'text-slate-400';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'coLeader': return 'Co-Leader';
            case 'admin': return 'Elder';
            default: return role.charAt(0).toUpperCase() + role.slice(1);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-400" />
                    Members ({members.length})
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setSortBy('trophies'); setSortDesc(!sortDesc); }}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-sm"
                    >
                        <Trophy className="w-3 h-3" /> Trophies <ArrowUpDown className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => { setSortBy('role'); setSortDesc(true); }}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-sm"
                    >
                        <Star className="w-3 h-3" /> Role
                    </button>
                </div>
            </div>

            <div className="grid gap-3">
                {sortedMembers.map((member, index) => (
                    <div
                        key={member.tag}
                        className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                        <span className="text-slate-500 font-mono w-8">#{index + 1}</span>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{member.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded bg-slate-800 ${getRoleColor(member.role)}`}>
                                    {getRoleLabel(member.role)}
                                </span>
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                                TH{member.townHallLevel} • Donated: {member.donations} • Received: {member.donationsReceived}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                                <Trophy className="w-4 h-4" />
                                {member.trophies}
                            </div>
                            <div className="text-xs text-slate-500">{member.league?.name || 'Unranked'}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberList;