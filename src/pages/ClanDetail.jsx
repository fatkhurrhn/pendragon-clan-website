
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ClanDetail() {
    const { tag } = useParams();
    const [clan, setClan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [members, setMembers] = useState([]);
    const [warLog, setWarLog] = useState([]);
    const [currentWar, setCurrentWar] = useState(null);

    useEffect(() => {
        if (tag) {
            fetchClanData();
        }
    }, [tag]);

    const fetchClanData = async () => {
        try {
            setLoading(true);
            const encodedTag = encodeURIComponent(`#${tag}`);

            // Fetch clan info
            const clanResponse = await fetch(`http://localhost:3002/clans/search?name=${encodedTag}`);
            const clanData = await clanResponse.json();

            if (clanData.success && clanData.data.items?.length > 0) {
                const foundClan = clanData.data.items.find(c =>
                    c.tag.replace('#', '') === tag.replace('#', '')
                );

                if (foundClan) {
                    setClan(foundClan);

                    // Fetch additional data
                    fetchMembers(foundClan.tag);
                    fetchWarLog(foundClan.tag);
                    fetchCurrentWar(foundClan.tag);
                } else {
                    setError('Clan not found');
                }
            } else {
                setError('Clan not found');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (clanTag) => {
        try {
            const response = await fetch(`http://localhost:3002/members?tag=${encodeURIComponent(clanTag)}`);
            const data = await response.json();
            if (data.success) {
                setMembers(data.data.items || []);
            }
        } catch (err) {
            console.error('Failed to fetch members:', err);
        }
    };

    const fetchWarLog = async (clanTag) => {
        try {
            const response = await fetch(`http://localhost:3002/warlog?tag=${encodeURIComponent(clanTag)}`);
            const data = await response.json();
            if (data.success) {
                setWarLog(data.data.items || []);
            }
        } catch (err) {
            console.error('Failed to fetch war log:', err);
        }
    };

    const fetchCurrentWar = async (clanTag) => {
        try {
            const response = await fetch(`http://localhost:3002/currentwar?tag=${encodeURIComponent(clanTag)}`);
            const data = await response.json();
            if (data.success) {
                setCurrentWar(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch current war:', err);
        }
    };

    const getWarFrequencyColor = (frequency) => {
        switch (frequency) {
            case 'always': return 'bg-red-100 text-red-800 border-red-300';
            case 'moreThanOncePerWeek': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'oncePerWeek': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'lessThanOncePerWeek': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'never': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getClanLevelColor = (level) => {
        if (level >= 20) return 'bg-gradient-to-r from-purple-500 to-pink-500';
        if (level >= 15) return 'bg-gradient-to-r from-blue-500 to-purple-500';
        if (level >= 10) return 'bg-gradient-to-r from-green-500 to-blue-500';
        if (level >= 5) return 'bg-gradient-to-r from-yellow-500 to-green-500';
        return 'bg-gradient-to-r from-gray-500 to-gray-700';
    };

    const getWarResultColor = (result) => {
        switch (result) {
            case 'win': return 'text-green-600 bg-green-100 border-green-300';
            case 'lose': return 'text-red-600 bg-red-100 border-red-300';
            case 'tie': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
            default: return 'text-gray-600 bg-gray-100 border-gray-300';
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading clan data...</p>
                </div>
            </div>
        );
    }

    if (error || !clan) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <i className="ri-error-warning-line text-2xl text-red-500"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Clan Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'Clan data could not be loaded'}</p>
                        <Link
                            to="/clans"
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                        >
                            <i className="ri-arrow-left-line"></i>
                            Back to Clan Search
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        to="/clans"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <i className="ri-arrow-left-line"></i>
                        Back to Search
                    </Link>
                </div>

                {/* Clan Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Clan Badge and Basic Info */}
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <img
                                    src={clan.badgeUrls.large}
                                    alt={clan.name}
                                    className="w-24 h-24"
                                />

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h1 className="text-3xl font-bold text-gray-900">{clan.name}</h1>
                                        <div className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getClanLevelColor(clan.clanLevel)}`}>
                                            Level {clan.clanLevel}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-hashtag text-gray-400"></i>
                                            <span className="font-mono text-gray-700">{clan.tag}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-map-pin-line text-gray-400"></i>
                                            <span className="text-gray-700">{clan.location?.name || 'International'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-team-line text-gray-400"></i>
                                            <span className="text-gray-700">{clan.members}/50 Members</span>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getWarFrequencyColor(clan.warFrequency)}`}>
                                            {clan.warFrequency.replace(/([A-Z])/g, ' $1')}
                                        </div>
                                    </div>

                                    <div className="text-gray-600 mb-4">
                                        <p className="flex items-start gap-2">
                                            <i className="ri-chat-quote-line text-gray-400 mt-1"></i>
                                            <span>{clan.description || 'No description available'}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {clan.isFamilyFriendly && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                                                <i className="ri-home-heart-line"></i>
                                                Family Friendly
                                            </span>
                                        )}
                                        {clan.isWarLogPublic && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
                                                <i className="ri-eye-line"></i>
                                                Public War Log
                                            </span>
                                        )}
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                                            <i className="ri-group-line"></i>
                                            {clan.type === 'inviteOnly' ? 'Invite Only' : 'Open'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="md:w-80">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-trophy-line text-blue-500"></i>
                                        <div className="text-xs font-medium text-blue-700">Clan Points</div>
                                    </div>
                                    <div className="text-xl font-bold text-blue-900">{formatNumber(clan.clanPoints)}</div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-sword-line text-green-500"></i>
                                        <div className="text-xs font-medium text-green-700">War Wins</div>
                                    </div>
                                    <div className="text-xl font-bold text-green-900">{clan.warWins}</div>
                                </div>

                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-fire-line text-purple-500"></i>
                                        <div className="text-xs font-medium text-purple-700">War Streak</div>
                                    </div>
                                    <div className="text-xl font-bold text-purple-900">{clan.warWinStreak}</div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-award-line text-amber-500"></i>
                                        <div className="text-xs font-medium text-amber-700">War Ties</div>
                                    </div>
                                    <div className="text-xl font-bold text-amber-900">{clan.warTies || 0}</div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-skull-line text-red-500"></i>
                                        <div className="text-xs font-medium text-red-700">War Losses</div>
                                    </div>
                                    <div className="text-xl font-bold text-red-900">{clan.warLosses || 0}</div>
                                </div>

                                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-line-chart-line text-indigo-500"></i>
                                        <div className="text-xs font-medium text-indigo-700">Win Rate</div>
                                    </div>
                                    <div className="text-xl font-bold text-indigo-900">
                                        {clan.warWins + (clan.warLosses || 0) + (clan.warTies || 0) > 0
                                            ? Math.round((clan.warWins / (clan.warWins + (clan.warLosses || 0) + (clan.warTies || 0))) * 100)
                                            : 0}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex overflow-x-auto gap-1 mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-dashboard-line"></i>
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'members' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-team-line"></i>
                        Members ({members.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('wars')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'wars' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-sword-line"></i>
                        Wars ({warLog.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('currentwar')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'currentwar' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-alarm-warning-line"></i>
                        Current War
                    </button>
                    <button
                        onClick={() => setActiveTab('labels')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'labels' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-price-tag-3-line"></i>
                        Labels
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Clan Requirements */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <i className="ri-settings-3-line text-blue-500"></i>
                                    Clan Requirements
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <i className="ri-door-line text-gray-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">Join Type</div>
                                                <div className="text-sm text-gray-600">{clan.type === 'inviteOnly' ? 'Invite Only' : 'Anyone Can Join'}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{clan.type === 'inviteOnly' ? 'Closed' : 'Open'}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <i className="ri-trophy-line text-yellow-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">Required Trophies</div>
                                                <div className="text-sm text-gray-600">Minimum trophies to join</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{clan.requiredTrophies || 0}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <i className="ri-shield-line text-green-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">Required Builder Trophies</div>
                                                <div className="text-sm text-gray-600">For Builder Base</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{clan.requiredBuilderBaseTrophies || 0}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <i className="ri-building-2-line text-purple-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">Required Town Hall Level</div>
                                                <div className="text-sm text-gray-600">Minimum TH level to join</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{clan.requiredTownhallLevel || 'Any'}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <i className="ri-chat-3-line text-red-600"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">War Frequency</div>
                                                <div className="text-sm text-gray-600">How often clan wars</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">
                                                {clan.warFrequency.replace(/([A-Z])/g, ' $1')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clan Statistics */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <i className="ri-bar-chart-line text-green-500"></i>
                                    Clan Statistics
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-sm text-gray-600 mb-1">Total Wars</div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {clan.warWins + (clan.warLosses || 0) + (clan.warTies || 0)}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {clan.warWins + (clan.warLosses || 0) + (clan.warTies || 0) > 0
                                                    ? Math.round((clan.warWins / (clan.warWins + (clan.warLosses || 0) + (clan.warTies || 0))) * 100)
                                                    : 0}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">Members Progress</span>
                                                <span className="font-medium text-gray-900">{clan.members}/50 ({Math.round((clan.members / 50) * 100)}%)</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${clan.members >= 45 ? 'bg-green-500' : clan.members >= 35 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${(clan.members / 50) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">Donations per Member</span>
                                                <span className="font-medium text-gray-900">
                                                    {clan.donationsPerWeek ? Math.round(clan.donationsPerWeek / clan.members) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${clan.donationsPerWeek ? Math.min((clan.donationsPerWeek / clan.members) / 100, 100) : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Clan Members</h3>
                                        <p className="text-gray-600 text-sm">
                                            {members.length} member{members.length !== 1 ? 's' : ''} • Sorted by role
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <i className="ri-information-line"></i>
                                        Click on member to view details
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="py-4 px-6 text-left font-semibold text-gray-700">Member</th>
                                            <th className="py-4 px-6 text-left font-semibold text-gray-700">Role</th>
                                            <th className="py-4 px-6 text-left font-semibold text-gray-700">Trophies</th>
                                            <th className="py-4 px-6 text-left font-semibold text-gray-700">Donations</th>
                                            <th className="py-4 px-6 text-left font-semibold text-gray-700">Received</th>
                                            <th className="py-4 px-6 text-left font-semibold text-gray-700">Town Hall</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {members.map((member, index) => (
                                            <tr key={member.tag} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <Link to={`/player/${member.tag.replace('#', '')}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                                {member.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{member.name}</div>
                                                                <div className="text-sm text-gray-500 font-mono">{member.tag}</div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${member.role === 'leader' ? 'bg-red-100 text-red-800 border-red-300' :
                                                            member.role === 'coLeader' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                                                'bg-blue-100 text-blue-800 border-blue-300'
                                                        }`}>
                                                        {member.role === 'leader' ? 'Leader' :
                                                            member.role === 'coLeader' ? 'Co-Leader' : 'Member'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <i className="ri-trophy-line text-yellow-500"></i>
                                                        <span className="font-medium text-gray-900">{member.trophies}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <i className="ri-hand-heart-line text-green-500"></i>
                                                        <span className="font-medium text-gray-900">{member.donations}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <i className="ri-hand-heart-fill text-blue-500"></i>
                                                        <span className="font-medium text-gray-900">{member.donationsReceived}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-medium">
                                                        TH{member.townHallLevel}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'wars' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <i className="ri-sword-line text-red-500"></i>
                                    War History
                                    <span className="text-sm font-normal text-gray-600">({warLog.length} wars recorded)</span>
                                </h3>
                                {warLog.length > 0 && (
                                    <div className="text-sm text-gray-600">
                                        Last updated: {new Date(warLog[0].endTime).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            {warLog.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <i className="ri-shield-line text-3xl text-gray-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No War Log Available</h3>
                                    <p className="text-gray-600 mb-6">
                                        {clan.isWarLogPublic
                                            ? 'This clan has not participated in any recorded wars yet'
                                            : 'This clan has a private war log'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {warLog.slice(0, 10).map((war, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="font-bold text-gray-900 mb-2">War #{warLog.length - index}</div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <i className="ri-calendar-line"></i>
                                                            {new Date(war.endTime).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <i className="ri-team-line"></i>
                                                            {war.teamSize} vs {war.teamSize}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <div className="font-bold text-lg text-gray-900">{war.clan.stars}</div>
                                                        <div className="text-xs text-gray-600">Stars</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-bold text-lg text-gray-900">{war.clan.destructionPercentage.toFixed(1)}%</div>
                                                        <div className="text-xs text-gray-600">Destruction</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className={`text-lg font-bold ${war.result === 'win' ? 'text-green-600' :
                                                                war.result === 'lose' ? 'text-red-600' : 'text-yellow-600'
                                                            }`}>
                                                            {war.result === 'win' ? 'WIN' : war.result === 'lose' ? 'LOSS' : 'DRAW'}
                                                        </div>
                                                        <div className="text-xs text-gray-600">Result</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Clan vs Opponent */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <img src={war.clan.badgeUrls.small} alt={war.clan.name} className="w-8 h-8" />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{war.clan.name}</div>
                                                            <div className="text-xs text-gray-600">Level {war.clan.clanLevel}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">{war.clan.stars}★</div>
                                                        <div className="text-xs text-gray-600">{war.clan.attacks} attacks</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <img src={war.opponent.badgeUrls.small} alt={war.opponent.name} className="w-8 h-8" />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{war.opponent.name}</div>
                                                            <div className="text-xs text-gray-600">Level {war.opponent.clanLevel}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">{war.opponent.stars}★</div>
                                                        <div className="text-xs text-gray-600">{war.opponent.attacks} attacks</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'currentwar' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <i className="ri-alarm-warning-line text-red-500"></i>
                                Current War Status
                            </h3>

                            {!currentWar || currentWar.state === 'notInWar' ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                        <i className="ri-peace-line text-3xl text-green-500"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Not in War</h3>
                                    <p className="text-gray-600">This clan is currently not participating in a war</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm text-blue-700 mb-1">War State</div>
                                                <div className="text-xl font-bold text-blue-900">
                                                    {currentWar.state === 'preparation' ? 'Preparation Day' :
                                                        currentWar.state === 'inWar' ? 'War Day' :
                                                            currentWar.state === 'warEnded' ? 'War Ended' : currentWar.state}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-blue-700 mb-1">War Size</div>
                                                <div className="text-xl font-bold text-blue-900">{currentWar.teamSize} vs {currentWar.teamSize}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-blue-700 mb-1">Start Time</div>
                                                <div className="font-medium text-blue-900">
                                                    {new Date(currentWar.startTime).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* War Progress */}
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        {/* Our Clan */}
                                        <div className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={clan.badgeUrls.small} alt={clan.name} className="w-10 h-10" />
                                                    <div>
                                                        <div className="font-bold text-gray-900">{clan.name}</div>
                                                        <div className="text-xs text-gray-600">Level {clan.clanLevel}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">{currentWar.clan.stars}★</div>
                                                    <div className="text-sm text-gray-600">{currentWar.clan.destructionPercentage.toFixed(1)}%</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Attacks Used:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {currentWar.clan.attacks}/{currentWar.teamSize * 2}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500"
                                                        style={{ width: `${(currentWar.clan.attacks / (currentWar.teamSize * 2)) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Opponent Clan */}
                                        <div className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={currentWar.opponent.badgeUrls.small} alt={currentWar.opponent.name} className="w-10 h-10" />
                                                    <div>
                                                        <div className="font-bold text-gray-900">{currentWar.opponent.name}</div>
                                                        <div className="text-xs text-gray-600">Level {currentWar.opponent.clanLevel}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">{currentWar.opponent.stars}★</div>
                                                    <div className="text-sm text-gray-600">{currentWar.opponent.destructionPercentage.toFixed(1)}%</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Attacks Used:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {currentWar.opponent.attacks}/{currentWar.teamSize * 2}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-red-500"
                                                        style={{ width: `${(currentWar.opponent.attacks / (currentWar.teamSize * 2)) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* War Timeline */}
                                    {currentWar.state === 'inWar' && (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <i className="ri-time-line text-yellow-600"></i>
                                                <div className="font-medium text-yellow-800">War Day in Progress</div>
                                            </div>
                                            <p className="text-sm text-yellow-700">
                                                The war is currently active. Members can attack until the war ends.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'labels' && clan.labels && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <i className="ri-price-tag-3-line text-green-500"></i>
                                Clan Labels
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {clan.labels.map((label, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col items-center text-center">
                                            <img
                                                src={label.iconUrls.medium}
                                                alt={label.name}
                                                className="w-16 h-16 mb-3"
                                            />
                                            <div className="font-medium text-gray-900">{label.name}</div>
                                            <div className="text-sm text-gray-600 mt-1">Clan Label</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-share-line text-blue-500"></i>
                        Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={fetchClanData}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <i className="ri-refresh-line"></i>
                            Refresh Data
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                            <i className="ri-copy-line"></i>
                            Copy Clan Tag
                        </button>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                            <i className="ri-share-fill"></i>
                            Share Clan
                        </button>
                        <a
                            href={`https://link.clashofclans.com/?action=OpenClanProfile&tag=${clan.tag.replace('#', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                        >
                            <i className="ri-external-link-line"></i>
                            Open in Game
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p className="flex items-center justify-center gap-2">
                        <i className="ri-information-line"></i>
                        Clan data loaded from Clash of Clans API • Last updated: {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}