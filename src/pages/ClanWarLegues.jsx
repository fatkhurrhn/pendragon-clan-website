import React, { useState, useEffect } from 'react';

export default function WarLeagues() {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterTier, setFilterTier] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWarLeagues();
    }, []);

    const fetchWarLeagues = async () => {
        try {
            const response = await fetch('http://localhost:3002/warleagues');
            if (!response.ok) {
                throw new Error('Failed to fetch war leagues data');
            }
            const data = await response.json();
            if (data.success && data.data.items.length > 0) {
                setLeagues(data.data.items);
            } else {
                setError('No war leagues data available');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getLeagueColor = (leagueName) => {
        if (leagueName.includes('Unranked')) return 'bg-gray-100 border-gray-300';
        if (leagueName.includes('Bronze')) return 'bg-amber-100 border-amber-300';
        if (leagueName.includes('Silver')) return 'bg-gray-200 border-gray-400';
        if (leagueName.includes('Gold')) return 'bg-yellow-100 border-yellow-300';
        if (leagueName.includes('Crystal')) return 'bg-purple-100 border-purple-300';
        if (leagueName.includes('Master')) return 'bg-blue-100 border-blue-300';
        if (leagueName.includes('Champion')) return 'bg-red-100 border-red-300';
        return 'bg-gray-50 border-gray-200';
    };

    const getLeagueIcon = (leagueName) => {
        if (leagueName.includes('Unranked')) return 'ri-shield-line';
        if (leagueName.includes('Bronze')) return 'ri-medal-line';
        if (leagueName.includes('Silver')) return 'ri-trophy-line';
        if (leagueName.includes('Gold')) return 'ri-award-line';
        if (leagueName.includes('Crystal')) return 'ri-diamond-line';
        if (leagueName.includes('Master')) return 'ri-crown-line';
        if (leagueName.includes('Champion')) return 'ri-star-line';
        return 'ri-sword-line';
    };

    const getLeagueIconColor = (leagueName) => {
        if (leagueName.includes('Unranked')) return 'text-gray-500';
        if (leagueName.includes('Bronze')) return 'text-amber-600';
        if (leagueName.includes('Silver')) return 'text-gray-600';
        if (leagueName.includes('Gold')) return 'text-yellow-600';
        if (leagueName.includes('Crystal')) return 'text-purple-600';
        if (leagueName.includes('Master')) return 'text-blue-600';
        if (leagueName.includes('Champion')) return 'text-red-600';
        return 'text-gray-500';
    };

    const getLeagueTier = (leagueName) => {
        if (leagueName.includes('Unranked')) return 'unranked';
        if (leagueName.includes('Bronze')) return 'bronze';
        if (leagueName.includes('Silver')) return 'silver';
        if (leagueName.includes('Gold')) return 'gold';
        if (leagueName.includes('Crystal')) return 'crystal';
        if (leagueName.includes('Master')) return 'master';
        if (leagueName.includes('Champion')) return 'champion';
        return 'other';
    };

    const getRomanNumeral = (num) => {
        const romanNumerals = ['I', 'II', 'III'];
        return romanNumerals[num - 1] || num;
    };

    const filteredLeagues = leagues.filter(league => {
        const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTier = filterTier === 'all' || getLeagueTier(league.name) === filterTier;
        return matchesSearch && matchesTier;
    });

    const bronzeLeagues = leagues.filter(l => getLeagueTier(l.name) === 'bronze');
    const silverLeagues = leagues.filter(l => getLeagueTier(l.name) === 'silver');
    const goldLeagues = leagues.filter(l => getLeagueTier(l.name) === 'gold');
    const crystalLeagues = leagues.filter(l => getLeagueTier(l.name) === 'crystal');
    const masterLeagues = leagues.filter(l => getLeagueTier(l.name) === 'master');
    const championLeagues = leagues.filter(l => getLeagueTier(l.name) === 'champion');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading war leagues...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <i className="ri-error-warning-line text-2xl text-red-500"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={fetchWarLeagues}
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                        >
                            <i className="ri-refresh-line"></i>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (leagues.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <i className="ri-inbox-line text-2xl text-gray-500"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No League Data</h2>
                        <p className="text-gray-600">No war league data available to display.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <i className="ri-sword-fill text-red-500"></i>
                                War Leagues
                            </h1>
                            <p className="text-gray-600 mt-2">All Clash of Clans War Leagues Ranking System</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <i className="ri-trophy-line text-yellow-500"></i>
                                    <span className="font-medium text-gray-700">
                                        {leagues.length} Leagues
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-medium text-amber-700 mb-1">Bronze</div>
                                <div className="text-lg font-bold text-amber-800">{bronzeLeagues.length}</div>
                            </div>
                        </div>
                        <div className="bg-gray-100 border border-gray-300 rounded-xl p-3">
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-medium text-gray-700 mb-1">Silver</div>
                                <div className="text-lg font-bold text-gray-800">{silverLeagues.length}</div>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-medium text-yellow-700 mb-1">Gold</div>
                                <div className="text-lg font-bold text-yellow-800">{goldLeagues.length}</div>
                            </div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-medium text-purple-700 mb-1">Crystal</div>
                                <div className="text-lg font-bold text-purple-800">{crystalLeagues.length}</div>
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-medium text-blue-700 mb-1">Master</div>
                                <div className="text-lg font-bold text-blue-800">{masterLeagues.length}</div>
                            </div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-medium text-red-700 mb-1">Champion</div>
                                <div className="text-lg font-bold text-red-800">{championLeagues.length}</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                            <div className="flex flex-col items-center">
                                <div className="text-xs font-medium text-gray-700 mb-1">Unranked</div>
                                <div className="text-lg font-bold text-gray-800">1</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Search leagues..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterTier('all')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterTier === 'all'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <i className="ri-filter-line"></i>
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterTier('bronze')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterTier === 'bronze'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                        }`}
                                >
                                    <i className="ri-medal-line"></i>
                                    Bronze
                                </button>
                                <button
                                    onClick={() => setFilterTier('silver')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterTier === 'silver'
                                            ? 'bg-gray-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <i className="ri-trophy-line"></i>
                                    Silver
                                </button>
                                <button
                                    onClick={() => setFilterTier('gold')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterTier === 'gold'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        }`}
                                >
                                    <i className="ri-award-line"></i>
                                    Gold
                                </button>
                                <button
                                    onClick={() => setFilterTier('crystal')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterTier === 'crystal'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        }`}
                                >
                                    <i className="ri-diamond-line"></i>
                                    Crystal
                                </button>
                                <button
                                    onClick={() => setFilterTier('master')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterTier === 'master'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                >
                                    <i className="ri-crown-line"></i>
                                    Master
                                </button>
                                <button
                                    onClick={() => setFilterTier('champion')}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filterTier === 'champion'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        }`}
                                >
                                    <i className="ri-star-line"></i>
                                    Champion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* League Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredLeagues.map((league, index) => {
                        const leagueColor = getLeagueColor(league.name);
                        const leagueIcon = getLeagueIcon(league.name);
                        const leagueIconColor = getLeagueIconColor(league.name);
                        const leagueTier = getLeagueTier(league.name);
                        const leagueNumber = parseInt(league.name.match(/\d+/)?.[0]) || 0;

                        return (
                            <div
                                key={league.id}
                                className={`border-2 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${leagueColor}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${leagueColor.replace('border', 'border-2')}`}>
                                                <i className={`${leagueIcon} text-2xl ${leagueIconColor}`}></i>
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    {leagueTier.charAt(0).toUpperCase() + leagueTier.slice(1)}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-900">{league.name}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="flex items-center gap-2">
                                                <i className="ri-hashtag text-gray-400"></i>
                                                <span className="text-sm font-mono text-gray-600">ID: {league.id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="ri-sort-number-desc text-gray-400"></i>
                                                <span className="text-sm text-gray-600">Rank #{index + 1}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${leagueTier === 'unranked' ? 'bg-gray-200 text-gray-700' : 'bg-white border border-gray-300 text-gray-700'}`}>
                                                Tier {leagueNumber > 0 ? getRomanNumeral(leagueNumber) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className={`text-3xl font-black ${leagueIconColor}`}>
                                            {19 - index}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Position</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">League Progress</span>
                                        <span className="font-semibold text-gray-700">
                                            {Math.round(((19 - index) / 19) * 100)}% to Champion
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${leagueTier === 'champion' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                    leagueTier === 'master' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                                        leagueTier === 'crystal' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                                                            leagueTier === 'gold' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                                leagueTier === 'silver' ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                                                                    leagueTier === 'bronze' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                                                        'bg-gradient-to-r from-gray-300 to-gray-400'
                                                }`}
                                            style={{ width: `${((19 - index) / 19) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* League Info */}
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <i className="ri-arrow-up-line text-green-500"></i>
                                            <span className="text-sm font-medium text-gray-700">Promotion</span>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {leagueTier === 'champion' ? 'Top League' :
                                                leagueNumber === 1 ? `To ${leagueTier} ${leagueNumber + 1}` :
                                                    leagueNumber === 3 ? `To ${getNextTier(leagueTier)} III` :
                                                        `Win matches to advance`}
                                        </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <i className="ri-team-line text-blue-500"></i>
                                            <span className="text-sm font-medium text-gray-700">Clans</span>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {leagueTier === 'champion' ? 'Top 0.1%' :
                                                leagueTier === 'master' ? 'Top 1%' :
                                                    leagueTier === 'crystal' ? 'Top 5%' :
                                                        leagueTier === 'gold' ? 'Top 15%' :
                                                            leagueTier === 'silver' ? 'Top 30%' :
                                                                leagueTier === 'bronze' ? 'Beginner Level' :
                                                                    'Unranked'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-information-line text-blue-500"></i>
                        League Tier Legend
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                                <i className="ri-medal-line text-amber-600"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Bronze</div>
                                <div className="text-sm text-gray-600">Beginner Level</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                                <i className="ri-trophy-line text-gray-600"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Silver</div>
                                <div className="text-sm text-gray-600">Intermediate</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center">
                                <i className="ri-award-line text-yellow-600"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Gold</div>
                                <div className="text-sm text-gray-600">Advanced</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                                <i className="ri-diamond-line text-purple-600"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Crystal</div>
                                <div className="text-sm text-gray-600">Expert</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                                <i className="ri-crown-line text-blue-600"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Master</div>
                                <div className="text-sm text-gray-600">Elite</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center">
                                <i className="ri-star-line text-red-600"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Champion</div>
                                <div className="text-sm text-gray-600">Legendary</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                                <i className="ri-shield-line text-gray-500"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Unranked</div>
                                <div className="text-sm text-gray-600">Starting Point</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-blue-500 border-2 border-gray-300 flex items-center justify-center">
                                <i className="ri-trophy-fill text-white"></i>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Progress</div>
                                <div className="text-sm text-gray-600">Track advancement</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p className="flex items-center justify-center gap-2">
                        <i className="ri-information-line"></i>
                        War League data from Clash of Clans API • Total {leagues.length} leagues available
                    </p>
                </div>
            </div>
        </div>
    );
}

// Helper function for next tier
function getNextTier(currentTier) {
    switch (currentTier) {
        case 'bronze': return 'Silver';
        case 'silver': return 'Gold';
        case 'gold': return 'Crystal';
        case 'crystal': return 'Master';
        case 'master': return 'Champion';
        default: return 'Higher';
    }
}