// src/components/MemberList.jsx
import React from 'react';

const MemberList = ({ members }) => {
    if (!members || members.length === 0) {
        return (
            <div className="text-center py-8">
                <i className="ri-user-search-line text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">No members data available</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Clan Members ({members.length}/50)</h3>
                <span className="text-sm text-gray-400">Top {Math.min(members.length, 15)} shown</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {members.slice(0, 15).map((member, index) => (
                    <MemberItem key={index} member={member} rank={index + 1} />
                ))}
            </div>

            {/* Role Summary */}
            <div className="mt-6 grid grid-cols-4 gap-3">
                <RoleSummary
                    role="leader"
                    count={members.filter(m => m.role?.toLowerCase() === 'leader').length}
                    color="bg-amber-500/20"
                    textColor="text-amber-400"
                />
                <RoleSummary
                    role="coLeader"
                    count={members.filter(m => m.role?.toLowerCase() === 'coleader').length}
                    color="bg-red-500/20"
                    textColor="text-red-400"
                />
                <RoleSummary
                    role="elder"
                    count={members.filter(m => m.role?.toLowerCase() === 'elder').length}
                    color="bg-green-500/20"
                    textColor="text-green-400"
                />
                <RoleSummary
                    role="member"
                    count={members.filter(m => !['leader', 'coleader', 'elder'].includes(m.role?.toLowerCase())).length}
                    color="bg-blue-500/20"
                    textColor="text-blue-400"
                />
            </div>
        </div>
    );
};

const MemberItem = ({ member, rank }) => {
    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'leader': return 'ri-crown-fill text-amber-400';
            case 'coleader': return 'ri-star-fill text-red-400';
            case 'elder': return 'ri-medal-fill text-green-400';
            default: return 'ri-user-fill text-blue-400';
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'leader': return 'bg-amber-500/10';
            case 'coleader': return 'bg-red-500/10';
            case 'elder': return 'bg-green-500/10';
            default: return 'bg-blue-500/10';
        }
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg ${getRoleColor(member.role)} hover:opacity-90 transition`}>
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-3">
                    <span className="text-gray-400 text-sm font-bold">#{rank}</span>
                </div>

                <div>
                    <div className="flex items-center">
                        <i className={`${getRoleIcon(member.role)} mr-2`}></i>
                        <span className="text-white font-medium">{member.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{member.role}</div>
                </div>
            </div>

            <div className="text-right">
                <div className="flex items-center justify-end">
                    <i className="ri-building-2-fill text-gray-400 mr-1 text-sm"></i>
                    <span className="text-white font-bold">TH{member.townHallLevel}</span>
                </div>
                <div className="flex items-center justify-end mt-1">
                    <i className="ri-trophy-fill text-amber-400 mr-1 text-sm"></i>
                    <span className="text-gray-300 text-sm">{member.trophies.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

const RoleSummary = ({ role, count, color, textColor }) => (
    <div className={`${color} rounded-lg p-3 text-center`}>
        <div className={`text-lg font-bold ${textColor}`}>{count}</div>
        <div className="text-xs text-gray-400 capitalize">{role}</div>
    </div>
);

export default MemberList;