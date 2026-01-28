import React, { useState, useEffect } from 'react';
import ClanCard from '../components/ClanCard';
import MemberList from '../components/MemberList';
import WarLog from '../components/WarLog';
import { Shield, Sword, Users, Trophy } from 'lucide-react';

// API URL config - otomatis detect local vs production
const API_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3002'  // Proxy lokal
    : '/api';                  // Vercel serverless functions

const HomeCOC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [clanData, setClanData] = useState(null);
    const [members, setMembers] = useState([]);
    const [warLog, setWarLog] = useState([]);
    const [currentWar, setCurrentWar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Fetch paralel
                const [clanRes, membersRes, warRes] = await Promise.all([
                    fetch(`${API_BASE}/clan`).then(r => r.json()),
                    fetch(`${API_BASE}/members`).then(r => r.json()),
                    fetch(`${API_BASE}/warlog`).then(r => r.json())
                ]);

                if (clanRes.success) setClanData(clanRes.data);
                if (membersRes.success) setMembers(membersRes.data.items || []);
                if (warRes.success) setWarLog(warRes.data.items || []);

                // Fetch current war terpisah (kadang error kalau tidak sedang war)
                try {
                    const warRes = await fetch(`${API_BASE}/currentwar`);
                    const warData = await warRes.json();
                    if (warData.success) setCurrentWar(warData.data);
                } catch (e) {
                    console.log('No active war');
                }

            } catch (err) {
                setError('Failed to fetch clan data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold">Loading Pendragon Clan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <header className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Shield className="w-10 h-10 text-yellow-500" />
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        PENDRAGON
                    </h1>
                    <Sword className="w-10 h-10 text-yellow-500" />
                </div>
                <p className="text-slate-400 text-lg">Clan Tag: #2Y29VCP89</p>
                {clanData && (
                    <div className="mt-4 flex justify-center gap-6 text-sm">
                        <span className="flex items-center gap-1 text-yellow-400">
                            <Trophy className="w-4 h-4" /> Level {clanData.clanLevel}
                        </span>
                        <span className="flex items-center gap-1 text-blue-400">
                            <Users className="w-4 h-4" /> {clanData.members}/50
                        </span>
                        <span className="text-green-400">War Wins: {clanData.warWins}</span>
                    </div>
                )}
            </header>

            {/* Navigation */}
            <nav className="flex justify-center gap-2 mb-8 flex-wrap">
                {[
                    { id: 'overview', label: 'Overview', icon: Shield },
                    { id: 'members', label: 'Members', icon: Users },
                    { id: 'warlog', label: 'War Log', icon: Sword },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/25'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content */}
            <main className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
                {activeTab === 'overview' && clanData && <ClanCard data={clanData} currentWar={currentWar} />}
                {activeTab === 'members' && <MemberList members={members} />}
                {activeTab === 'warlog' && <WarLog wars={warLog} />}
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center text-slate-500 text-sm">
                <p>© 2024 Pendragon Clan. Clash of Clans Fan Website.</p>
                <p className="mt-1">Built with ⚔️ for #2Y29VCP89</p>
            </footer>
        </div>
    );
};

export default HomeCOC;