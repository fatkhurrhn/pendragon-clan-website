import React, { useState, useEffect } from 'react';

export default function ClanWarLog() {
    const [warLogData, setWarLogData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterResult, setFilterResult] = useState('all');
    const [filterTeamSize, setFilterTeamSize] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'endTime', direction: 'desc' });
    const [stats, setStats] = useState(null);
    const [selectedWar, setSelectedWar] = useState(null);

    useEffect(() => {
        fetchWarLogData();
    }, []);

    const fetchWarLogData = async () => {
        try {
            const response = await fetch('http://localhost:3002/warlog');
            const data = await response.json();
            if (data.success) {
                setWarLogData(data.data);
                calculateStats(data.data.items);
            } else {
                setError('Failed to fetch war log data');
            }
        } catch (err) {
            setError('Error fetching war log data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (wars) => {
        if (!wars) return;

        const validWars = wars.filter(war => war.result !== null);
        const totalWars = validWars.length;
        const wins = validWars.filter(war => war.result === 'win').length;
        const losses = validWars.filter(war => war.result === 'lose').length;
        const ties = validWars.filter(war => war.result === 'tie').length;
        const winRate = totalWars > 0 ? ((wins / totalWars) * 100).toFixed(1) : 0;

        const totalStars = validWars.reduce((sum, war) => sum + war.clan.stars, 0);
        const totalDestruction = validWars.reduce((sum, war) => sum + war.clan.destructionPercentage, 0);
        const avgStars = totalWars > 0 ? (totalStars / totalWars).toFixed(1) : 0;
        const avgDestruction = totalWars > 0 ? (totalDestruction / totalWars).toFixed(1) : 0;

        const currentStreak = calculateStreak(validWars);
        const bestStreak = calculateBestStreak(validWars);

        setStats({
            totalWars,
            wins,
            losses,
            ties,
            winRate,
            avgStars,
            avgDestruction,
            currentStreak,
            bestStreak
        });
    };

    const calculateStreak = (wars) => {
        if (!wars || wars.length === 0) return { type: 'none', count: 0 };

        let streak = 1;
        let type = wars[0].result;

        for (let i = 1; i < wars.length; i++) {
            if (wars[i].result === type) {
                streak++;
            } else {
                break;
            }
        }

        return { type, count: streak };
    };

    const calculateBestStreak = (wars) => {
        if (!wars || wars.length === 0) return { type: 'none', count: 0 };

        let bestStreak = 0;
        let currentStreak = 0;
        let currentType = wars[0].result;

        wars.forEach(war => {
            if (war.result === currentType) {
                currentStreak++;
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                }
            } else {
                currentType = war.result;
                currentStreak = 1;
            }
        });

        return { type: 'win', count: bestStreak };
    };

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getResultColor = (result) => {
        switch (result) {
            case 'win': return 'text-green-600 bg-green-100';
            case 'lose': return 'text-red-600 bg-red-100';
            case 'tie': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getResultIcon = (result) => {
        switch (result) {
            case 'win': return <i className="ri-trophy-fill"></i>;
            case 'lose': return <i className="ri-close-circle-fill"></i>;
            case 'tie': return <i className="ri-equal-fill"></i>;
            default: return <i className="ri-question-fill"></i>;
        }
    };

    const getFormattedDate = (dateString) => {
        try {
            // Parse string format "20260201T002315.000Z"
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            const hour = dateString.substring(9, 11);
            const minute = dateString.substring(11, 13);

            // Format tanggal yang lebih mudah dibaca
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthName = months[parseInt(month) - 1];

            // Format waktu 12 jam
            let hour12 = parseInt(hour);
            const ampm = hour12 >= 12 ? 'PM' : 'AM';
            hour12 = hour12 % 12 || 12; // Convert 0 to 12

            return `${day} ${monthName} ${year} ${hour12}:${minute} ${ampm}`;
        } catch (error) {
            return dateString;
        }
    };

    const getFormattedTimeAgo = (dateString) => {
        try {
            // Parse string format "20260201T002315.000Z"
            const year = parseInt(dateString.substring(0, 4));
            const month = parseInt(dateString.substring(4, 6)) - 1; // Bulan 0-indexed
            const day = parseInt(dateString.substring(6, 8));
            const hour = parseInt(dateString.substring(9, 11));
            const minute = parseInt(dateString.substring(11, 13));
            const second = parseInt(dateString.substring(13, 15));

            // Buat date object
            const warDate = new Date(year, month, day, hour, minute, second);
            const now = new Date();
            const diffMs = now - warDate;
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffDays === 0) {
                if (diffHours === 0) {
                    if (diffMinutes === 0) return 'Just now';
                    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
                }
                return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            }

            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;

            return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
        } catch (error) {
            return dateString;
        }
    };

    const getFilteredAndSortedWars = () => {
        if (!warLogData?.items) return [];

        let filtered = warLogData.items.filter(war => {
            const matchesResult = filterResult === 'all' || war.result === filterResult;
            const matchesTeamSize = filterTeamSize === 'all' || war.teamSize.toString() === filterTeamSize;
            return matchesResult && matchesTeamSize;
        });

        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle endTime sorting
            if (sortConfig.key === 'endTime') {
                aValue = new Date(a.endTime);
                bValue = new Date(b.endTime);
            }

            // Handle teamSize sorting
            if (sortConfig.key === 'teamSize') {
                aValue = parseInt(a.teamSize);
                bValue = parseInt(b.teamSize);
            }

            // Handle result sorting
            if (sortConfig.key === 'result') {
                const order = { win: 3, tie: 2, lose: 1, null: 0 };
                aValue = order[a.result] || 0;
                bValue = order[b.result] || 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading war log data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
            <div className="text-center text-red-500">
                <i className="ri-error-warning-line text-4xl mb-4"></i>
                <p>{error}</p>
            </div>
        </div>
    );

    if (!warLogData) return null;

    const filteredWars = getFilteredAndSortedWars();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="ri-sword-fill mr-3 text-red-500"></i>
                        War Log
                        <span className="ml-4 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                            {warLogData.items?.length || 0} Wars
                        </span>
                    </h1>
                    <p className="text-gray-600 mt-2">Complete history of clan wars</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Wars</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.totalWars || 0}</p>
                            </div>
                            <i className="ri-history-line text-3xl text-gray-400"></i>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Win Rate</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.winRate || 0}%</p>
                            </div>
                            <i className="ri-trophy-line text-3xl text-green-400"></i>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">W/L/T</p>
                                <div className="flex space-x-2 mt-1">
                                    <span className="text-sm font-medium text-green-600">{stats?.wins || 0}W</span>
                                    <span className="text-sm font-medium text-red-600">{stats?.losses || 0}L</span>
                                    <span className="text-sm font-medium text-yellow-600">{stats?.ties || 0}T</span>
                                </div>
                            </div>
                            <i className="ri-bar-chart-line text-3xl text-blue-400"></i>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Stars</p>
                                <p className="text-2xl font-bold text-purple-600">{stats?.avgStars || 0}</p>
                            </div>
                            <i className="ri-star-line text-3xl text-purple-400"></i>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Current Streak</p>
                                <p className={`text-2xl font-bold ${stats?.currentStreak?.type === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats?.currentStreak?.count || 0} {stats?.currentStreak?.type || 'none'}
                                </p>
                            </div>
                            <i className="ri-fire-line text-3xl text-orange-400"></i>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                                <div className="flex space-x-2">
                                    {['all', 'win', 'lose', 'tie'].map(result => (
                                        <button
                                            key={result}
                                            onClick={() => setFilterResult(result)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${filterResult === result
                                                    ? 'bg-red-100 text-red-700 border border-red-300'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {result === 'all' ? 'All Results' : result}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                                <div className="flex space-x-2">
                                    {['all', '5', '10', '15', '20', '25', '30', '40', '45'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setFilterTeamSize(size)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium ${filterTeamSize === size
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {size === 'all' ? 'All Sizes' : `${size}v${size}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                onChange={(e) => handleSort(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={sortConfig.key}
                            >
                                <option value="endTime">Date</option>
                                <option value="result">Result</option>
                                <option value="teamSize">Team Size</option>
                                <option value="clan.stars">Stars</option>
                                <option value="clan.destructionPercentage">Destruction</option>
                            </select>
                            <button
                                onClick={() => handleSort(sortConfig.key)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredWars.length} of {warLogData.items?.length} wars
                        {filterResult !== 'all' && ` with result: ${filterResult}`}
                        {filterTeamSize !== 'all' && ` with team size: ${filterTeamSize}v${filterTeamSize}`}
                    </div>
                </div>

                {/* War Log Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Result
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Opponent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Destruction
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        XP Earned
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredWars.map((war, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedWar(war)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{getFormattedDate(war.endTime)}</div>
                                            <div className="text-xs text-gray-500">{getFormattedTimeAgo(war.endTime)}</div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getResultColor(war.result)}`}>
                                                <span className="mr-2">{getResultIcon(war.result)}</span>
                                                <span className="capitalize">{war.result || 'Unknown'}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{war.teamSize}v{war.teamSize}</div>
                                            <div className="text-xs text-gray-500">
                                                {war.attacksPerMember} attack{war.attacksPerMember > 1 ? 's' : ''} each
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        src={war.opponent.badgeUrls?.small || 'https://api-assets.clashofclans.com/badges/70/H39b_-WLZGtZVWQ0hqTkE-Tn2AaQnQWy_Iz4yBlvL0M.png'}
                                                        alt="Opponent badge"
                                                        className="h-10 w-10 rounded-full"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{war.opponent.name || 'Unknown Clan'}</div>
                                                    <div className="text-xs text-gray-500">Level {war.opponent.clanLevel || '?'}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-900">{war.clan.stars}</div>
                                                    <div className="text-xs text-gray-500">Stars</div>
                                                </div>
                                                <div className="mx-3 text-gray-400">
                                                    <i className="ri-sword-line"></i>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-900">{war.opponent.stars}</div>
                                                    <div className="text-xs text-gray-500">Stars</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>Us:</span>
                                                    <span className="font-medium">{war.clan.destructionPercentage.toFixed(1)}%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Them:</span>
                                                    <span className="font-medium">{war.opponent.destructionPercentage?.toFixed(1) || '0'}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full ${getProgressColor(war.clan.destructionPercentage)}`}
                                                        style={{ width: `${Math.min(war.clan.destructionPercentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-lg font-bold ${war.expEarned > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                {war.expEarned > 0 ? `+${war.expEarned}` : war.expEarned}
                                            </div>
                                            <div className="text-xs text-gray-500">XP</div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedWar(war);
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <i className="ri-eye-line"></i>
                                                <span className="ml-1">View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredWars.length === 0 && (
                        <div className="text-center py-12">
                            <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
                            <p className="text-gray-500">No wars found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* War Details Modal */}
            {selectedWar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">War Details</h2>
                                    <p className="text-gray-600">{getFormattedDate(selectedWar.endTime)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedWar(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>

                            {/* War Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <i className="ri-information-line mr-2"></i>
                                        War Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Result</span>
                                            <span className={`font-medium capitalize ${getResultColor(selectedWar.result)} px-3 py-1 rounded-full text-sm`}>
                                                {getResultIcon(selectedWar.result)} {selectedWar.result || 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Team Size</span>
                                            <span className="font-medium">{selectedWar.teamSize}v{selectedWar.teamSize}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Attacks Per Member</span>
                                            <span className="font-medium">{selectedWar.attacksPerMember}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Battle Modifier</span>
                                            <span className="font-medium capitalize">{selectedWar.battleModifier}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">XP Earned</span>
                                            <span className={`font-bold ${selectedWar.expEarned > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                                {selectedWar.expEarned > 0 ? `+${selectedWar.expEarned}` : selectedWar.expEarned}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <i className="ri-calendar-line mr-2"></i>
                                        Time Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">End Time</span>
                                            <span className="font-medium">{getFormattedDate(selectedWar.endTime)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time Ago</span>
                                            <span className="font-medium">{getFormattedTimeAgo(selectedWar.endTime)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clan Comparison */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-900 mb-6 text-center text-xl">War Comparison</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Our Clan */}
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                                        <div className="flex items-center mb-6">
                                            <img
                                                src={selectedWar.clan.badgeUrls.medium}
                                                alt="Our clan badge"
                                                className="w-16 h-16 mr-4"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{selectedWar.clan.name}</h4>
                                                <p className="text-gray-600">{selectedWar.clan.tag}</p>
                                                <div className="mt-1">
                                                    <span className="text-sm font-medium px-2 py-1 bg-red-200 text-red-800 rounded">
                                                        Level {selectedWar.clan.clanLevel}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">{selectedWar.clan.stars}</div>
                                                <div className="text-sm text-gray-600">Stars</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">{selectedWar.clan.destructionPercentage.toFixed(1)}%</div>
                                                <div className="text-sm text-gray-600">Destruction</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">{selectedWar.clan.attacks}</div>
                                                <div className="text-sm text-gray-600">Attacks Used</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">{selectedWar.teamSize * 2}</div>
                                                <div className="text-sm text-gray-600">Max Attacks</div>
                                            </div>
                                        </div>

                                        {/* Attack Efficiency */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Attack Efficiency</span>
                                                <span>{((selectedWar.clan.attacks / (selectedWar.teamSize * 2)) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-green-500"
                                                    style={{ width: `${(selectedWar.clan.attacks / (selectedWar.teamSize * 2)) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Opponent Clan */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                        <div className="flex items-center mb-6">
                                            <img
                                                src={selectedWar.opponent.badgeUrls?.medium || 'https://api-assets.clashofclans.com/badges/200/H39b_-WLZGtZVWQ0hqTkE-Tn2AaQnQWy_Iz4yBlvL0M.png'}
                                                alt="Opponent clan badge"
                                                className="w-16 h-16 mr-4"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{selectedWar.opponent.name || 'Unknown Clan'}</h4>
                                                <p className="text-gray-600">{selectedWar.opponent.tag || '#??????'}</p>
                                                <div className="mt-1">
                                                    <span className="text-sm font-medium px-2 py-1 bg-blue-200 text-blue-800 rounded">
                                                        Level {selectedWar.opponent.clanLevel || '?'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">{selectedWar.opponent.stars || 0}</div>
                                                <div className="text-sm text-gray-600">Stars</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">{selectedWar.opponent.destructionPercentage?.toFixed(1) || 0}%</div>
                                                <div className="text-sm text-gray-600">Destruction</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">-</div>
                                                <div className="text-sm text-gray-600">Attacks Used</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 text-center">
                                                <div className="text-3xl font-bold text-gray-900">-</div>
                                                <div className="text-sm text-gray-600">Max Attacks</div>
                                            </div>
                                        </div>

                                        {/* Destruction Comparison */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Destruction Difference</span>
                                                <span className={`font-bold ${selectedWar.clan.destructionPercentage > (selectedWar.opponent.destructionPercentage || 0) ? 'text-green-600' : 'text-red-600'}`}>
                                                    {selectedWar.clan.destructionPercentage - (selectedWar.opponent.destructionPercentage || 0) > 0 ? '+' : ''}
                                                    {(selectedWar.clan.destructionPercentage - (selectedWar.opponent.destructionPercentage || 0)).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${selectedWar.clan.destructionPercentage > (selectedWar.opponent.destructionPercentage || 0) ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{
                                                        width: `${Math.max(selectedWar.clan.destructionPercentage, selectedWar.opponent.destructionPercentage || 0)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Winner Declaration */}
                                <div className="mt-8 text-center">
                                    <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${getResultColor(selectedWar.result)}`}>
                                        <span className="mr-3 text-2xl">{getResultIcon(selectedWar.result)}</span>
                                        <span className="capitalize">
                                            {selectedWar.result === 'win' ? 'Victory!' :
                                                selectedWar.result === 'lose' ? 'Defeat' :
                                                    selectedWar.result === 'tie' ? 'Draw' : 'Unknown Result'}
                                        </span>
                                        <span className="ml-3">
                                            {selectedWar.clan.stars} - {selectedWar.opponent.stars || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-8 pt-6 border-t">
                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-600">
                                        <i className="ri-information-line mr-1"></i>
                                        War ID: {selectedWar.endTime}
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => setSelectedWar(null)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
                                            <i className="ri-share-line mr-2"></i>
                                            Share War
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}