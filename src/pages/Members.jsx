import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Search } from 'lucide-react';

// Di PlayerDetail.jsx, Home.jsx, Members.jsx, WarLog.jsx
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3002'  // Local dev
    : '/api';                   // Vercel production

const Members = () => {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/members`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setMembers(data.data.items || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch (role) {
            case 'leader': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'coLeader': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getRoleLabel = (role) => {
        if (role === 'coLeader') return 'Co-Leader';
        if (role === 'admin') return 'Elder';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

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
            <div className="bg-white sticky top-0 z-10 border-b border-slate-200 px-4 py-4 shadow-sm">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Users className="w-6 h-6 text-yellow-500" />
                        Members
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {members.length}/50
                        </span>
                    </h1>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search member..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                </div>
            </div>

            {/* Member List */}
            <div className="max-w-md mx-auto px-4 py-4 space-y-3">
                {filtered.map((member, idx) => (
                    <Link
                        to={`/player/${member.tag.replace('#', '')}`}
                        className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            {/* Rank */}
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                {idx + 1}
                            </div>

                            {/* Avatar Placeholder */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-lg border-2 border-white shadow-sm">
                                {member.name.charAt(0)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800 truncate">{member.name}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRoleColor(member.role)}`}>
                                        {getRoleLabel(member.role)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        TH{member.townHallLevel}
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                                        <Trophy className="w-3 h-3" />
                                        {member.trophies}
                                    </span>
                                </div>
                            </div>

                            {/* Donations */}
                            <div className="text-right">
                                <div className="text-xs text-slate-400 mb-0.5">Donations</div>
                                <div className="text-sm font-bold text-green-600">{member.donations || 0}</div>
                                <div className="text-[10px] text-slate-400">Received: {member.donationsReceived || 0}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Members;