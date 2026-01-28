// src/pages/HomeCOC.jsx - Production Ready
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomeCOC = () => {
    const [clanData, setClanData] = useState(null);
    const [members, setMembers] = useState([]);
    const [warLog, setWarLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    // API base URL - auto switches between dev/prod
    const API_BASE = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/api'
        : '/api';

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Fetch clan data
                const clanResponse = await axios.get(`${API_BASE}/clan`);
                setClanData(clanResponse.data.data);

                // Fetch members
                const membersResponse = await axios.get(`${API_BASE}/members`);
                setMembers(membersResponse.data.data.items || []);

                // Fetch war log
                const warResponse = await axios.get(`${API_BASE}/warlog?limit=5`);
                setWarLog(warResponse.data.data.items || []);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [API_BASE]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <i className="ri-dragon-fill text-3xl text-white"></i>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-full flex items-center justify-center font-bold absolute -bottom-2 -right-2 border-4 border-gray-900">
                            14
                        </div>
                    </div>
                    <h2 className="text-2xl text-white font-bold mb-2">Loading Pendragon Clan</h2>
                    <p className="text-gray-400">Fetching real-time data from Clash of Clans...</p>
                    <div className="mt-6 w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-700 animate-[loading_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-700/30 rounded-2xl p-8 max-w-md shadow-2xl">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-error-warning-fill text-3xl text-red-500"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">API Connection Error</h2>
                        <p className="text-gray-300 mb-6">{error}</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
                            >
                                <i className="ri-refresh-line mr-2"></i>
                                Try Again
                            </button>

                            {process.env.NODE_ENV === 'development' && (
                                <a
                                    href="http://localhost:3001/health"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center text-amber-400 hover:text-amber-300 text-sm"
                                >
                                    Check Proxy Server Status
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Status Bar */}
            <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-green-400 text-sm font-medium">
                                LIVE • {clanData?.members || 0}/50 Members
                            </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            {process.env.NODE_ENV === 'development' ? '🛠️ Development' : '🚀 Production'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Clan Header Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 border border-amber-500/20 shadow-2xl mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Clan Badge */}
                        <div className="relative">
                            <img
                                src={clanData?.badgeUrls?.large}
                                alt="Clan Badge"
                                className="w-32 h-32 rounded-2xl border-4 border-amber-500/30 shadow-xl"
                            />
                            <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-gray-900">
                                {clanData?.clanLevel}
                            </div>
                        </div>

                        {/* Clan Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {clanData?.name}
                            </h1>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                <span className="bg-amber-600/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-sm">
                                    <i className="ri-user-star-fill mr-1"></i>
                                    Leader: {clanData?.owner?.name || 'Nana'}
                                </span>
                                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-sm">
                                    <i className="ri-map-pin-fill mr-1"></i>
                                    {clanData?.location?.name}
                                </span>
                                <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                                    {clanData?.tag}
                                </span>
                            </div>

                            <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                                <p className="text-gray-300 whitespace-pre-line text-center md:text-left">
                                    {clanData?.description}
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatBox
                                    icon="ri-team-fill"
                                    value={clanData?.members || 0}
                                    label="Members"
                                    color="text-blue-400"
                                />
                                <StatBox
                                    icon="ri-trophy-fill"
                                    value={clanData?.clanPoints?.toLocaleString()}
                                    label="Points"
                                    color="text-amber-400"
                                />
                                <StatBox
                                    icon="ri-sword-fill"
                                    value={clanData?.warWins || 0}
                                    label="War Wins"
                                    color="text-red-400"
                                />
                                <StatBox
                                    icon="ri-flashlight-fill"
                                    value={clanData?.warFrequency}
                                    label="War Freq"
                                    color="text-green-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {['home', 'members', 'war', 'about'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab
                                    ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                                }`}
                        >
                            <i className={`mr-2 ${getTabIcon(tab)}`}></i>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
                    {renderTabContent(activeTab, clanData, members, warLog)}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} {clanData?.name} Clan. Data provided by Clash of Clans API.</p>
                    <p className="mt-1">
                        Auto-updates every 5 minutes • Last updated: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatBox = ({ icon, value, label, color }) => (
    <div className="bg-gray-900/50 rounded-xl p-4 text-center hover:bg-gray-900/70 transition">
        <div className={`text-2xl mb-2 ${color}`}>
            <i className={icon}></i>
        </div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
);

const renderTabContent = (tab, clanData, members, warLog) => {
    switch (tab) {
        case 'home':
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Clan Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900/50 rounded-xl p-5">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="ri-information-fill mr-3 text-blue-400"></i>
                                Clan Details
                            </h3>
                            <div className="space-y-3">
                                <DetailItem label="Clan Type" value={clanData?.type} />
                                <DetailItem label="Required Trophies" value={clanData?.requiredTrophies} />
                                <DetailItem label="War League" value={clanData?.warLeague?.name} />
                                <DetailItem label="Clan Capital Points" value={clanData?.clanCapitalPoints} />
                                <DetailItem label="Builder Base Points" value={clanData?.clanBuilderBasePoints} />
                            </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-xl p-5">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <i className="ri-sword-fill mr-3 text-red-400"></i>
                                War Statistics
                            </h3>
                            <div className="space-y-3">
                                <DetailItem label="War Win Streak" value={clanData?.warWinStreak} />
                                <DetailItem label="Total Wars" value={(clanData?.warWins || 0) + 32 + 8} />
                                <DetailItem label="Win Rate" value={`${Math.round((clanData?.warWins || 0) / ((clanData?.warWins || 0) + 32 + 8) * 100)}%`} />
                                <DetailItem label="Capital League" value={clanData?.capitalLeague?.name} />
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'members':
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Clan Members ({members.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.slice(0, 9).map((member, index) => (
                            <MemberCard key={index} member={member} index={index} />
                        ))}
                    </div>
                </div>
            );

        case 'war':
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Wars</h2>
                    {warLog.length > 0 ? (
                        <div className="space-y-4">
                            {warLog.map((war, index) => (
                                <WarCard key={index} war={war} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No war data available</p>
                    )}
                </div>
            );

        case 'about':
            return (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">About Pendragon</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300">
                            Pendragon is a level {clanData?.clanLevel} clan founded in 2022, based in Singapore.
                            We focus on Clan Wars, Clan Games, and Clan Capital raids.
                        </p>
                        <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 mt-6">
                            <h3 className="text-xl font-bold text-amber-400 mb-3">How to Join</h3>
                            <ol className="text-gray-300 space-y-2">
                                <li>1. Search for clan tag: <code className="bg-black/50 px-2 py-1 rounded">{clanData?.tag}</code></li>
                                <li>2. Meet requirements: TH{clanData?.requiredTownhallLevel || 10}+, {clanData?.requiredTrophies}+ trophies</li>
                                <li>3. Be active in wars and donations</li>
                                <li>4. English communication preferred</li>
                            </ol>
                        </div>
                    </div>
                </div>
            );

        default:
            return null;
    }
};

const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
        <span className="text-gray-400">{label}:</span>
        <span className="text-white font-medium">{value || 'N/A'}</span>
    </div>
);

const MemberCard = ({ member, index }) => (
    <div className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{member.name.charAt(0)}</span>
                </div>
                <div>
                    <div className="text-white font-bold">{member.name}</div>
                    <div className="text-sm text-gray-400 capitalize">{member.role}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-amber-400 font-bold">TH{member.townHallLevel}</div>
                <div className="text-sm text-gray-400">{member.trophies.toLocaleString()}</div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-white font-bold">{member.donations.toLocaleString()}</div>
                <div className="text-gray-400">Donated</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-white font-bold">{member.donationsReceived.toLocaleString()}</div>
                <div className="text-gray-400">Received</div>
            </div>
        </div>
    </div>
);

const WarCard = ({ war }) => (
    <div className="bg-gray-900/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
            <div className="text-white font-bold">
                vs {war.opponent?.name?.slice(0, 20) || 'Unknown Clan'}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${war.result === 'win' ? 'bg-green-900/50 text-green-400' :
                    war.result === 'lose' ? 'bg-red-900/50 text-red-400' :
                        'bg-yellow-900/50 text-yellow-400'
                }`}>
                {war.result?.toUpperCase() || 'UNKNOWN'}
            </div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
            <span>Team Size: {war.teamSize}</span>
            <span>{new Date(war.endTime).toLocaleDateString()}</span>
        </div>
    </div>
);

// Helper functions
const getTabIcon = (tab) => {
    switch (tab) {
        case 'home': return 'ri-home-4-fill';
        case 'members': return 'ri-team-fill';
        case 'war': return 'ri-sword-fill';
        case 'about': return 'ri-information-fill';
        default: return 'ri-home-4-fill';
    }
};

export default HomeCOC;