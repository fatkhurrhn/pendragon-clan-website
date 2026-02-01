import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PlayerDetail() {
    const { tag } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAllTroops, setShowAllTroops] = useState(false);
    const [showAllHeroes, setShowAllHeroes] = useState(false);
    const [showAllAchievements, setShowAllAchievements] = useState(false);

    useEffect(() => {
        if (tag) {
            fetchPlayerData();
        }
    }, [tag]);

    const fetchPlayerData = async () => {
        try {
            // Encode the tag for URL
            const encodedTag = encodeURIComponent(tag);
            const response = await fetch(`http://localhost:3002/player/${encodedTag}`);
            if (!response.ok) {
                throw new Error('Failed to fetch player data');
            }
            const data = await response.json();
            if (data.success) {
                setPlayer(data.data);
            } else {
                setError('Player data not found');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getTownHallColor = (level) => {
        const colors = [
            'bg-gray-100 text-gray-800', // 1
            'bg-gray-200 text-gray-800', // 2
            'bg-green-100 text-green-800', // 3
            'bg-green-200 text-green-800', // 4
            'bg-blue-100 text-blue-800', // 5
            'bg-blue-200 text-blue-800', // 6
            'bg-purple-100 text-purple-800', // 7
            'bg-purple-200 text-purple-800', // 8
            'bg-orange-100 text-orange-800', // 9
            'bg-orange-200 text-orange-800', // 10
            'bg-red-100 text-red-800', // 11
            'bg-red-200 text-red-800', // 12
            'bg-pink-100 text-pink-800', // 13
            'bg-pink-200 text-pink-800', // 14
            'bg-indigo-100 text-indigo-800', // 15
            'bg-indigo-200 text-indigo-800', // 16
        ];
        return colors[level - 1] || colors[0];
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'leader': return 'bg-red-100 text-red-800 border-red-300';
            case 'co-leader': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'elder': return 'bg-green-100 text-green-800 border-green-300';
            case 'member': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getWarPreferenceColor = (preference) => {
        return preference === 'in'
            ? 'bg-green-100 text-green-800 border-green-300'
            : 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getAchievementProgressColor = (value, target) => {
        const percentage = (value / target) * 100;
        if (percentage >= 100) return 'bg-green-500';
        if (percentage >= 75) return 'bg-yellow-500';
        if (percentage >= 50) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const formatNumber = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const getTroopLevelColor = (level, maxLevel) => {
        const percentage = (level / maxLevel) * 100;
        if (percentage >= 100) return 'bg-gradient-to-r from-green-400 to-green-600';
        if (percentage >= 80) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        if (percentage >= 60) return 'bg-gradient-to-r from-orange-400 to-orange-600';
        if (percentage >= 40) return 'bg-gradient-to-r from-red-400 to-red-600';
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    };

    const getHeroLevelColor = (level, maxLevel) => {
        const percentage = (level / maxLevel) * 100;
        if (percentage >= 80) return 'bg-gradient-to-r from-purple-500 to-pink-500';
        if (percentage >= 60) return 'bg-gradient-to-r from-blue-500 to-purple-500';
        if (percentage >= 40) return 'bg-gradient-to-r from-green-500 to-blue-500';
        if (percentage >= 20) return 'bg-gradient-to-r from-yellow-500 to-green-500';
        return 'bg-gradient-to-r from-gray-500 to-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading player data...</p>
                </div>
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <i className="ri-error-warning-line text-2xl text-red-500"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Player Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'Player data could not be loaded'}</p>
                        <Link
                            to="/members"
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                        >
                            <i className="ri-arrow-left-line"></i>
                            Back to Players
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const visibleTroops = showAllTroops ? player.troops : player.troops?.slice(0, 12);
    const visibleHeroes = showAllHeroes ? player.heroes : player.heroes?.slice(0, 4);
    const visibleAchievements = showAllAchievements ? player.achievements : player.achievements?.slice(0, 10);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        to="/members"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <i className="ri-arrow-left-line"></i>
                        Back to Players
                    </Link>
                </div>

                {/* Player Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Player Avatar and Basic Info */}
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${getTownHallColor(player.townHallLevel)}`}>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">TH{player.townHallLevel}</div>
                                        {player.townHallWeaponLevel > 0 && (
                                            <div className="text-xs mt-1">Giga {player.townHallWeaponLevel}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
                                        <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRoleColor(player.role)}`}>
                                            {player.role || 'Member'}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getWarPreferenceColor(player.warPreference)}`}>
                                            <i className={`ri-${player.warPreference === 'in' ? 'sword' : 'shield'}-line mr-1`}></i>
                                            War {player.warPreference === 'in' ? 'Opted In' : 'Opted Out'}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-user-star-line text-blue-500"></i>
                                            <span className="text-gray-700">Level {player.expLevel}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-trophy-line text-yellow-500"></i>
                                            <span className="text-gray-700">{player.trophies} Trophies</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-star-line text-purple-500"></i>
                                            <span className="text-gray-700">{player.warStars} War Stars</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-git-repository-line text-green-500"></i>
                                            <span className="text-gray-700">{player.achievements?.length || 0} Achievements</span>
                                        </div>
                                    </div>

                                    <div className="text-gray-600">
                                        <div className="flex items-center gap-2 mb-1">
                                            <i className="ri-hashtag text-gray-400"></i>
                                            <span className="font-mono">{player.tag}</span>
                                        </div>
                                        {player.clan && (
                                            <div className="flex items-center gap-2">
                                                <i className="ri-team-line text-gray-400"></i>
                                                <span>Member of </span>
                                                <span className="font-semibold text-gray-800">{player.clan.name}</span>
                                                <span className="text-sm text-gray-500">(Level {player.clan.level})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="md:w-64">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-hand-heart-line text-blue-500"></i>
                                        <div className="text-xs font-medium text-blue-700">Donations</div>
                                    </div>
                                    <div className="text-xl font-bold text-blue-900">{formatNumber(player.donations)}</div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-hand-heart-fill text-green-500"></i>
                                        <div className="text-xs font-medium text-green-700">Received</div>
                                    </div>
                                    <div className="text-xl font-bold text-green-900">{formatNumber(player.donationsReceived)}</div>
                                </div>

                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-bank-line text-purple-500"></i>
                                        <div className="text-xs font-medium text-purple-700">Capital Contr.</div>
                                    </div>
                                    <div className="text-xl font-bold text-purple-900">{formatNumber(player.clanCapitalContributions)}</div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="ri-sword-line text-amber-500"></i>
                                        <div className="text-xs font-medium text-amber-700">Attack Wins</div>
                                    </div>
                                    <div className="text-xl font-bold text-amber-900">{player.attackWins}</div>
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
                        onClick={() => setActiveTab('troops')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'troops' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-sword-line"></i>
                        Troops
                    </button>
                    <button
                        onClick={() => setActiveTab('heroes')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'heroes' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-crown-line"></i>
                        Heroes
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'achievements' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-trophy-line"></i>
                        Achievements
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'stats' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <i className="ri-bar-chart-line"></i>
                        Statistics
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Clan Info */}
                            {player.clan && (
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <i className="ri-team-line text-blue-500"></i>
                                        Clan Information
                                    </h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={player.clan.badgeUrls.small}
                                            alt={player.clan.name}
                                            className="w-16 h-16"
                                        />
                                        <div>
                                            <div className="font-bold text-gray-900">{player.clan.name}</div>
                                            <div className="text-sm text-gray-600">Level {player.clan.level}</div>
                                            <div className="text-sm font-mono text-gray-500">{player.clan.tag}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">League:</span>
                                            <span className="font-medium text-gray-900">
                                                {player.leagueTier?.name || 'Unranked'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Builder Base:</span>
                                            <span className="font-medium text-gray-900">
                                                {player.builderBaseLeague?.name || 'Unranked'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Labels */}
                            {player.labels && player.labels.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <i className="ri-price-tag-3-line text-green-500"></i>
                                        Player Labels
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {player.labels.map((label, index) => (
                                            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
                                                <img src={label.iconUrls.small} alt={label.name} className="w-5 h-5" />
                                                <span className="text-sm font-medium text-gray-800">{label.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Player House */}
                            {player.playerHouse && (
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <i className="ri-home-line text-purple-500"></i>
                                        Player House
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {player.playerHouse.elements.map((element, index) => (
                                            <div key={index} className="px-3 py-2 bg-gray-100 rounded-lg">
                                                <div className="text-xs text-gray-500 capitalize">{element.type}</div>
                                                <div className="text-sm font-medium text-gray-800">ID: {element.id}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* League Info */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="ri-trophy-line text-yellow-500"></i>
                                    League Rankings
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Home Village</span>
                                            <span className="font-medium text-gray-900">{player.trophies} / {player.bestTrophies}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                style={{ width: `${(player.trophies / player.bestTrophies) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Builder Base</span>
                                            <span className="font-medium text-gray-900">{player.builderBaseTrophies} / {player.bestBuilderBaseTrophies}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                                                style={{ width: `${(player.builderBaseTrophies / player.bestBuilderBaseTrophies) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attack/Defense Stats */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="ri-sword-line text-red-500"></i>
                                    Battle Stats
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{player.attackWins}</div>
                                        <div className="text-sm text-gray-600">Attack Wins</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{player.defenseWins}</div>
                                        <div className="text-sm text-gray-600">Defense Wins</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{player.warStars}</div>
                                        <div className="text-sm text-gray-600">War Stars</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{player.warStars * 3}</div>
                                        <div className="text-sm text-gray-600">War Attacks</div>
                                    </div>
                                </div>
                            </div>

                            {/* Builder Base */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="ri-hammer-line text-amber-500"></i>
                                    Builder Base
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Builder Hall Level</span>
                                        <span className="font-bold text-gray-900">Level {player.builderHallLevel}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Current Trophies</span>
                                        <span className="font-bold text-yellow-600">{player.builderBaseTrophies}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Best Trophies</span>
                                        <span className="font-bold text-yellow-600">{player.bestBuilderBaseTrophies}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">League</span>
                                        <span className="font-medium text-gray-900">{player.builderBaseLeague?.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'troops' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <i className="ri-sword-line text-blue-500"></i>
                                    Troops & Spells
                                    <span className="text-sm font-normal text-gray-600">
                                        ({player.troops?.length || 0} troops, {player.spells?.length || 0} spells)
                                    </span>
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowAllTroops(!showAllTroops)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <i className={showAllTroops ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                        {showAllTroops ? "Show Less" : "Show All"}
                                    </button>
                                </div>
                            </div>

                            {/* Troops Grid */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="ri-sword-fill text-red-500"></i>
                                    Troops ({player.troops?.length || 0})
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {visibleTroops?.map((troop, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                    <i className="ri-user-line text-gray-500"></i>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{troop.name}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{troop.village}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Level:</span>
                                                    <span className="font-bold text-gray-900">{troop.level}/{troop.maxLevel}</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getTroopLevelColor(troop.level, troop.maxLevel)}`}
                                                        style={{ width: `${(troop.level / troop.maxLevel) * 100}%` }}
                                                    ></div>
                                                </div>
                                                {troop.superTroopIsActive && (
                                                    <div className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-center">
                                                        <i className="ri-flashlight-line mr-1"></i>
                                                        Active
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!showAllTroops && player.troops?.length > 12 && (
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={() => setShowAllTroops(true)}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <i className="ri-arrow-down-line"></i>
                                            Load More ({player.troops.length - 12} hidden)
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Spells Grid */}
                            {player.spells && player.spells.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <i className="ri-magic-line text-purple-500"></i>
                                        Spells ({player.spells.length})
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {player.spells.map((spell, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                                        <i className="ri-magic-line text-purple-500"></i>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{spell.name}</div>
                                                        <div className="text-xs text-gray-500">Spell</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600">Level:</span>
                                                        <span className="font-bold text-gray-900">{spell.level}/{spell.maxLevel}</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                                                            style={{ width: `${(spell.level / spell.maxLevel) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'heroes' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <i className="ri-crown-line text-yellow-500"></i>
                                    Heroes & Equipment
                                    <span className="text-sm font-normal text-gray-600">
                                        ({player.heroes?.length || 0} heroes, {player.heroEquipment?.length || 0} equipment)
                                    </span>
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowAllHeroes(!showAllHeroes)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <i className={showAllHeroes ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                        {showAllHeroes ? "Show Less" : "Show All"}
                                    </button>
                                </div>
                            </div>

                            {/* Heroes Grid */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="ri-crown-fill text-yellow-500"></i>
                                    Heroes ({player.heroes?.length || 0})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {visibleHeroes?.map((hero, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-lg ${getHeroLevelColor(hero.level, hero.maxLevel)} flex items-center justify-center`}>
                                                        <i className="ri-crown-line text-white text-xl"></i>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{hero.name}</div>
                                                        <div className="text-sm text-gray-600 capitalize">{hero.village}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">{hero.level}/{hero.maxLevel}</div>
                                                    <div className="text-xs text-gray-500">Level</div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-medium text-gray-900">
                                                        {Math.round((hero.level / hero.maxLevel) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getHeroLevelColor(hero.level, hero.maxLevel)}`}
                                                        style={{ width: `${(hero.level / hero.maxLevel) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Equipment */}
                                            {hero.equipment && hero.equipment.length > 0 && (
                                                <div className="mt-4">
                                                    <div className="text-sm font-medium text-gray-700 mb-2">Equipment:</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {hero.equipment.map((eq, eqIndex) => (
                                                            <div key={eqIndex} className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
                                                                <div className="font-medium text-gray-800">{eq.name}</div>
                                                                <div className="text-gray-600">Lvl {eq.level}/{eq.maxLevel}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {!showAllHeroes && player.heroes?.length > 4 && (
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={() => setShowAllHeroes(true)}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <i className="ri-arrow-down-line"></i>
                                            Load More ({player.heroes.length - 4} hidden)
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Hero Equipment */}
                            {player.heroEquipment && player.heroEquipment.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <i className="ri-tools-line text-gray-500"></i>
                                        Hero Equipment ({player.heroEquipment.length})
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {player.heroEquipment.map((equipment, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
                                                <div className="text-center">
                                                    <div className="font-medium text-gray-900 mb-1">{equipment.name}</div>
                                                    <div className="text-sm text-gray-600">Level {equipment.level}/{equipment.maxLevel}</div>
                                                    <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-400 to-green-400"
                                                            style={{ width: `${(equipment.level / equipment.maxLevel) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{equipment.village}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'achievements' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <i className="ri-trophy-line text-yellow-500"></i>
                                    Achievements
                                    <span className="text-sm font-normal text-gray-600">
                                        ({player.achievements?.length || 0} total)
                                    </span>
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-bold text-green-600">
                                            {player.achievements?.filter(a => a.stars === 3).length || 0}
                                        </span> Completed •
                                        <span className="font-bold text-yellow-600 mx-2">
                                            {player.achievements?.filter(a => a.stars === 2).length || 0}
                                        </span> In Progress
                                    </div>
                                    <button
                                        onClick={() => setShowAllAchievements(!showAllAchievements)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <i className={showAllAchievements ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                        {showAllAchievements ? "Show Less" : "Show All"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {visibleAchievements?.map((achievement, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="font-bold text-gray-900 mb-1">{achievement.name}</div>
                                                <div className="text-sm text-gray-600 mb-2">{achievement.info}</div>
                                                {achievement.completionInfo && (
                                                    <div className="text-xs text-gray-500 italic">{achievement.completionInfo}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex mb-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`ri-star-${i < achievement.stars ? 'fill' : 'line'} ${i < achievement.stars ? 'text-yellow-500' : 'text-gray-300'
                                                                } text-lg`}
                                                        ></i>
                                                    ))}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatNumber(achievement.value)} / {formatNumber(achievement.target)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium text-gray-900">
                                                    {achievement.target > 0
                                                        ? Math.round((achievement.value / achievement.target) * 100)
                                                        : 100}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getAchievementProgressColor(achievement.value, achievement.target)}`}
                                                    style={{
                                                        width: `${achievement.target > 0
                                                            ? Math.min((achievement.value / achievement.target) * 100, 100)
                                                            : 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!showAllAchievements && player.achievements?.length > 10 && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={() => setShowAllAchievements(true)}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <i className="ri-arrow-down-line"></i>
                                        Load More ({player.achievements.length - 10} hidden)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Resource Stats */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <i className="ri-coins-line text-yellow-500"></i>
                                    Resource Statistics
                                </h3>
                                <div className="space-y-4">
                                    {player.achievements?.filter(a =>
                                        a.name.includes('Gold') || a.name.includes('Elixir') || a.name.includes('Dark')
                                    ).map((achievement, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-700 font-medium">{achievement.name}</span>
                                                <span className="font-bold text-gray-900">{formatNumber(achievement.value)}</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getAchievementProgressColor(achievement.value, achievement.target)}`}
                                                    style={{
                                                        width: `${Math.min((achievement.value / achievement.target) * 100, 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 text-right">
                                                Target: {formatNumber(achievement.target)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Battle Stats */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <i className="ri-sword-line text-red-500"></i>
                                    Battle Statistics
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {player.achievements?.filter(a =>
                                        a.name.includes('Destroy') || a.name.includes('War') || a.name.includes('Attack')
                                    ).slice(0, 8).map((achievement, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                                            <div className="text-sm font-medium text-gray-700 mb-1">{achievement.name}</div>
                                            <div className="flex items-end justify-between">
                                                <div className="text-2xl font-bold text-gray-900">{formatNumber(achievement.value)}</div>
                                                <div className="text-xs text-gray-500">/{formatNumber(achievement.target)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                            <i className="ri-copy-line"></i>
                            Copy Player Tag
                        </button>
                        <button
                            onClick={fetchPlayerData}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <i className="ri-refresh-line"></i>
                            Refresh Data
                        </button>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                            <i className="ri-share-fill"></i>
                            Share Profile
                        </button>
                        <Link
                            to={`/clan/${player.clan?.tag?.replace('#', '')}`}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                        >
                            <i className="ri-team-line"></i>
                            View Clan
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p className="flex items-center justify-center gap-2">
                        <i className="ri-information-line"></i>
                        Player data loaded from Clash of Clans API • Last updated: {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}