import React, { useState, useEffect } from 'react';
import {
    RiGroupLine,
    RiTrophyLine,
    RiShieldLine,
    RiMapPinLine,
    RiGlobalLine,
    RiSwordLine,
    RiHeartLine,
    RiStarLine,
    RiBuildingLine,
    RiChat1Line,
    RiMedalLine,
    RiCalendarLine,
    RiShieldFlashLine,
    RiFireLine,
    RiTreasureMapLine,
    RiUserLine,
    RiHomeLine,
    RiArrowUpLine,
    RiArrowDownLine,
    RiGitBranchLine,
    RiVipCrownLine,
    RiShieldUserLine,
    RiUser3Line,
    RiSettings3Line
} from 'react-icons/ri';

export default function ClanHome() {
    const [clanData, setClanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'clanRank', direction: 'asc' });

    useEffect(() => {
        fetchClanData();
    }, []);

    const fetchClanData = async () => {
        try {
            const response = await fetch('http://localhost:3002/clan');
            const data = await response.json();
            if (data.success) {
                setClanData(data.data);
            } else {
                setError('Failed to fetch clan data');
            }
        } catch (err) {
            setError('Error fetching clan data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedMembers = () => {
        if (!clanData?.memberList) return [];

        const sorted = [...clanData.memberList].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle nested properties
            if (sortConfig.key === 'donations') {
                aValue = a.donations;
                bValue = b.donations;
            }
            if (sortConfig.key === 'trophies') {
                aValue = a.trophies;
                bValue = b.trophies;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'leader': return <RiVipCrownLine className="text-yellow-500" />;
            case 'admin': return <RiShieldUserLine className="text-blue-500" />;
            default: return <RiUser3Line className="text-gray-500" />;
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading clan data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center text-red-500">
                <RiSettings3Line className="text-4xl mx-auto mb-4" />
                <p>{error}</p>
            </div>
        </div>
    );

    if (!clanData) return null;

    const sortedMembers = getSortedMembers();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-4">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Clan Badge */}
                        <div className="flex-shrink-0">
                            <img
                                src={clanData.badgeUrls.large}
                                alt="Clan Badge"
                                className="w-32 h-32 md:w-40 md:h-40"
                            />
                        </div>

                        {/* Clan Info */}
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{clanData.name}</h1>
                                    <p className="text-gray-600">{clanData.tag}</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${clanData.type === 'open'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        <RiGroupLine className="mr-2" />
                                        {clanData.type.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                                    {clanData.description}
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <RiTrophyLine className="text-blue-500 text-xl mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-600">Clan Level</p>
                                            <p className="text-2xl font-bold">{clanData.clanLevel}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <RiUserLine className="text-green-500 text-xl mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-600">Members</p>
                                            <p className="text-2xl font-bold">{clanData.members}/50</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <RiSwordLine className="text-purple-500 text-xl mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-600">War Wins</p>
                                            <p className="text-2xl font-bold">{clanData.warWins}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <RiFireLine className="text-yellow-500 text-xl mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-600">Win Streak</p>
                                            <p className="text-2xl font-bold">{clanData.warWinStreak}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center text-gray-600">
                                    <RiMapPinLine className="mr-2" />
                                    <span>{clanData.location.name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <RiMedalLine className="mr-2" />
                                    <span>Capital League: {clanData.capitalLeague.name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <RiShieldLine className="mr-2" />
                                    <span>War League: {clanData.warLeague.name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <RiCalendarLine className="mr-2" />
                                    <span>War Frequency: {clanData.warFrequency}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clan Capital Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <RiBuildingLine className="mr-3 text-blue-500" />
                        Clan Capital
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Capital Hall Level {clanData.clanCapital.capitalHallLevel}</h3>
                                    <p className="text-gray-600">Total Points: {clanData.clanCapitalPoints}</p>
                                </div>
                                <RiTreasureMapLine className="text-3xl text-blue-500" />
                            </div>

                            <div className="space-y-2">
                                {clanData.clanCapital.districts.map((district, index) => (
                                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                                        <span className="font-medium">{district.name}</span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            Level {district.districtHallLevel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-semibold mb-3 flex items-center">
                                    <RiGlobalLine className="mr-2" />
                                    Clan Labels
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {clanData.labels.map((label, index) => (
                                        <div key={index} className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                                            <img src={label.iconUrls.small} alt={label.name} className="w-6 h-6 mr-2" />
                                            <span>{label.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-semibold mb-3">Requirements</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Minimum Town Hall:</span>
                                        <span className="font-medium">Level {clanData.requiredTownhallLevel}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trophies Required:</span>
                                        <span className="font-medium">{clanData.requiredTrophies}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">War Log:</span>
                                        <span className={`font-medium ${clanData.isWarLogPublic ? 'text-green-600' : 'text-red-600'}`}>
                                            {clanData.isWarLogPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <RiGroupLine className="mr-3 text-blue-500" />
                            Clan Members ({clanData.members})
                        </h2>

                        <div className="mt-4 md:mt-0">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Sort by:</span>
                                <select
                                    onChange={(e) => handleSort(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={sortConfig.key}
                                >
                                    <option value="clanRank">Rank</option>
                                    <option value="name">Name</option>
                                    <option value="trophies">Trophies</option>
                                    <option value="donations">Donations</option>
                                    <option value="townHallLevel">Town Hall</option>
                                    <option value="expLevel">XP Level</option>
                                </select>
                                <span className="text-gray-500">
                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">#</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Member</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">TH</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Trophies</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Donations</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Received</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedMembers.map((member, index) => (
                                    <tr key={member.tag} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${member.clanRank < member.previousClanRank
                                                        ? 'bg-green-100 text-green-800'
                                                        : member.clanRank > member.previousClanRank
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {member.clanRank}
                                                    {member.clanRank < member.previousClanRank && (
                                                        <RiArrowUpLine className="ml-1 text-xs" />
                                                    )}
                                                    {member.clanRank > member.previousClanRank && (
                                                        <RiArrowDownLine className="ml-1 text-xs" />
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 mr-3">
                                                    {member.playerHouse?.elements?.[0] ? (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200"></div>
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.tag}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                {getRoleIcon(member.role)}
                                                <span className="ml-2 capitalize">{member.role}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <RiHomeLine className="text-gray-500 mr-2" />
                                                <span className="font-semibold">TH{member.townHallLevel}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <RiTrophyLine className="text-yellow-500 mr-2" />
                                                <span>{member.trophies.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <RiHeartLine className="text-green-500 mr-2" />
                                                <span>{member.donations.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <RiStarLine className="text-blue-500 mr-2" />
                                                <span>{member.donationsReceived.toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {clanData.memberList.reduce((sum, member) => sum + member.donations, 0).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Total Donations</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {Math.round(clanData.memberList.reduce((sum, member) => sum + member.trophies, 0) / clanData.members).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Avg Trophies</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {Math.round(clanData.memberList.reduce((sum, member) => sum + member.townHallLevel, 0) / clanData.members * 10) / 10}
                                </div>
                                <div className="text-sm text-gray-600">Avg Town Hall</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Clan data fetched from Clash of Clans API</p>
                    <p className="mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}