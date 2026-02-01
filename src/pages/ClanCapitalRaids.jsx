import React, { useState, useEffect } from 'react';

export default function ClanCapitalRaids() {
    const [raidData, setRaidData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRaidIndex, setActiveRaidIndex] = useState(0);
    const [sortConfig, setSortConfig] = useState({
        key: 'capitalResourcesLooted',
        direction: 'desc'
    });

    useEffect(() => {
        fetchRaidData();
    }, []);

    const fetchRaidData = async () => {
        try {
            const response = await fetch('http://localhost:3002/capital/raids');
            if (!response.ok) {
                throw new Error('Failed to fetch raid data');
            }
            const data = await response.json();
            if (data.success && data.data.items.length > 0) {
                setRaidData(data.data.items);
            } else {
                setError('No raid data available');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSortedMembers = () => {
        if (!raidData[activeRaidIndex]?.members) return [];

        return [...raidData[activeRaidIndex].members].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortConfig.direction === 'desc' ? bVal - aVal : aVal - bVal;
            }
            return 0;
        });
    };

    const calculateAttackEfficiency = (member) => {
        const totalPossibleAttacks = member.attackLimit + member.bonusAttackLimit;
        return totalPossibleAttacks > 0 ? (member.attacks / totalPossibleAttacks) * 100 : 0;
    };

    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 100) return 'text-green-500';
        if (efficiency >= 80) return 'text-yellow-500';
        if (efficiency >= 60) return 'text-orange-500';
        return 'text-red-500';
    };

    const getRaidStatusBadge = (state) => {
        switch (state) {
            case 'ongoing':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Ongoing</span>;
            case 'ended':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">Ended</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">{state}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading raid data...</p>
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
                            onClick={fetchRaidData}
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

    if (raidData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <i className="ri-inbox-line text-2xl text-gray-500"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Raid Data</h2>
                        <p className="text-gray-600">No capital raid data available to display.</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentRaid = raidData[activeRaidIndex];
    const sortedMembers = getSortedMembers();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <i className="ri-sword-fill text-blue-500"></i>
                                Clan Capital Raids
                            </h1>
                            <p className="text-gray-600 mt-2">Track your clan's capital raid performance</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <i className="ri-calendar-line text-gray-500"></i>
                                    <span className="font-medium text-gray-700">
                                        {raidData.length} Raid{raidData.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Raid Selection Tabs */}
                    <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                        {raidData.map((raid, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveRaidIndex(index)}
                                className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${activeRaidIndex === index
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-100'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Week {raidData.length - index}</span>
                                        {getRaidStatusBadge(raid.state)}
                                    </div>
                                    <span className="text-sm opacity-80">
                                        {formatDate(raid.startTime).split(',')[0]}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Current Raid Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700 mb-1">Capital Loot</p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {currentRaid.capitalTotalLoot?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <i className="ri-treasure-map-fill text-xl text-blue-600"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700 mb-1">Total Attacks</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {currentRaid.totalAttacks || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <i className="ri-sword-fill text-xl text-green-600"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700 mb-1">Districts Destroyed</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {currentRaid.enemyDistrictsDestroyed || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <i className="ri-fire-fill text-xl text-purple-600"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-700 mb-1">Raid Members</p>
                                    <p className="text-2xl font-bold text-amber-900">
                                        {currentRaid.members?.length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <i className="ri-team-fill text-xl text-amber-600"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Raid Members</h2>
                                <p className="text-gray-600 text-sm">
                                    {(sortedMembers.length || 0)} member{sortedMembers.length !== 1 ? 's' : ''} participated
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                    <i className="ri-sort-desc text-gray-500"></i>
                                    <span className="text-sm font-medium text-gray-700">
                                        Sort: {sortConfig.key.replace(/([A-Z])/g, ' $1')} ({sortConfig.direction})
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <i className="ri-information-line"></i>
                                    Click headers to sort
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-6 text-left">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                            Member
                                            <i className={`ri-arrow-${sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? 'up' : 'down') : 'up-down'}s-line`}></i>
                                        </button>
                                    </th>
                                    <th className="py-4 px-6 text-left">
                                        <button
                                            onClick={() => handleSort('attacks')}
                                            className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                            Attacks Used
                                            <i className={`ri-arrow-${sortConfig.key === 'attacks' ? (sortConfig.direction === 'asc' ? 'up' : 'down') : 'up-down'}s-line`}></i>
                                        </button>
                                    </th>
                                    <th className="py-4 px-6 text-left">
                                        <button
                                            onClick={() => handleSort('attackLimit')}
                                            className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                            Attack Limit
                                            <i className={`ri-arrow-${sortConfig.key === 'attackLimit' ? (sortConfig.direction === 'asc' ? 'up' : 'down') : 'up-down'}s-line`}></i>
                                        </button>
                                    </th>
                                    <th className="py-4 px-6 text-left">
                                        <button
                                            onClick={() => handleSort('bonusAttackLimit')}
                                            className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                            Bonus Attacks
                                            <i className={`ri-arrow-${sortConfig.key === 'bonusAttackLimit' ? (sortConfig.direction === 'asc' ? 'up' : 'down') : 'up-down'}s-line`}></i>
                                        </button>
                                    </th>
                                    <th className="py-4 px-6 text-left">
                                        <button
                                            onClick={() => handleSort('capitalResourcesLooted')}
                                            className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                            Resources Looted
                                            <i className={`ri-arrow-${sortConfig.key === 'capitalResourcesLooted' ? (sortConfig.direction === 'asc' ? 'up' : 'down') : 'up-down'}s-line`}></i>
                                        </button>
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-gray-700">
                                        Efficiency
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedMembers.map((member, index) => {
                                    const efficiency = calculateAttackEfficiency(member);
                                    const efficiencyColor = getEfficiencyColor(efficiency);

                                    return (
                                        <tr
                                            key={member.tag}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                        {member.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{member.name || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-500 font-mono">{member.tag || 'No Tag'}</div>
                                                    </div>
                                                    {index < 3 && (
                                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                                                            #{index + 1}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-gray-900">{member.attacks || 0}</span>
                                                    <i className="ri-sword-line text-gray-500"></i>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-700">{member.attackLimit || 0}</span>
                                                    <i className="ri-shield-line text-gray-500"></i>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-700">{member.bonusAttackLimit || 0}</span>
                                                    <i className="ri-star-line text-yellow-500"></i>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <i className="ri-coins-line text-yellow-500"></i>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {(member.capitalResourcesLooted || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${efficiency >= 100 ? 'bg-green-500' :
                                                                    efficiency >= 80 ? 'bg-yellow-500' :
                                                                        efficiency >= 60 ? 'bg-orange-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${Math.min(efficiency, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`font-bold ${efficiencyColor}`}>
                                                        {efficiency.toFixed(0)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{sortedMembers.length}</span> members
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>100%+ Efficiency</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span>80-99% Efficiency</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Below 60%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p className="flex items-center justify-center gap-2">
                        <i className="ri-information-line"></i>
                        Data loaded from Clan Capital Raids API • Last updated: {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}