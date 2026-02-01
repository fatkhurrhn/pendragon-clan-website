import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ClanListMembers() {
    const [membersData, setMembersData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'clanRank', direction: 'asc' });
    const [roleFilter, setRoleFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMembersData();
    }, []);

    const fetchMembersData = async () => {
        try {
            const response = await fetch('http://localhost:3002/members');
            const data = await response.json();
            if (data.success) {
                setMembersData(data.data);
            } else {
                setError('Failed to fetch members data');
            }
        } catch (err) {
            setError('Error fetching members data: ' + err.message);
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

    // Fungsi untuk mendapatkan role display name
    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'leader': return 'Leader';
            case 'admin': return 'Senior'; // Ubah admin menjadi senior
            default: return 'Member';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'leader': return <i className="ri-crown-fill text-yellow-500"></i>;
            case 'admin': return <i className="ri-shield-user-fill text-blue-500"></i>; // Tetap pakai icon shield untuk senior
            default: return <i className="ri-user-fill text-gray-500"></i>;
        }
    };

    const getLeagueIcon = (league) => {
        if (!league?.iconUrls?.small) {
            return <i className="ri-trophy-line text-gray-400"></i>;
        }
        return <img src={league.iconUrls.small} alt={league.name} className="w-6 h-6" />;
    };

    const getSortedAndFilteredMembers = () => {
        if (!membersData?.items) return [];

        let filtered = membersData.items.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.tag.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || member.role === roleFilter;
            return matchesSearch && matchesRole;
        });

        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle different data types
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    const getMemberStats = () => {
        if (!membersData?.items) return null;

        const members = membersData.items;
        const totalDonations = members.reduce((sum, m) => sum + m.donations, 0);
        const totalReceived = members.reduce((sum, m) => sum + m.donationsReceived, 0);
        const avgTrophies = Math.round(members.reduce((sum, m) => sum + m.trophies, 0) / members.length);
        const avgTH = (members.reduce((sum, m) => sum + m.townHallLevel, 0) / members.length).toFixed(1);

        const roleCounts = {
            leader: members.filter(m => m.role === 'leader').length,
            admin: members.filter(m => m.role === 'admin').length,
            member: members.filter(m => m.role === 'member').length
        };

        return { totalDonations, totalReceived, avgTrophies, avgTH, roleCounts };
    };

    const stats = getMemberStats();
    const filteredMembers = getSortedAndFilteredMembers();

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading members data...</p>
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

    if (!membersData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <i className="ri-team-line mr-3 text-blue-500"></i>
                        Clan Members
                        <span className="ml-4 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            {membersData.items?.length || 0} Members
                        </span>
                    </h1>
                    <p className="text-gray-600 mt-2">Detailed overview of all clan members</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Donations</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.totalDonations?.toLocaleString()}</p>
                            </div>
                            <i className="ri-heart-3-fill text-3xl text-green-100 bg-green-500 p-2 rounded-lg"></i>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Trophies</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats?.avgTrophies?.toLocaleString()}</p>
                            </div>
                            <i className="ri-trophy-fill text-3xl text-yellow-100 bg-yellow-500 p-2 rounded-lg"></i>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Town Hall</p>
                                <p className="text-2xl font-bold text-purple-600">{stats?.avgTH}</p>
                            </div>
                            <i className="ri-home-4-fill text-3xl text-purple-100 bg-purple-500 p-2 rounded-lg"></i>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Roles Distribution</p>
                                <div className="flex space-x-2 mt-1">
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        <i className="ri-crown-fill mr-1"></i>
                                        {stats?.roleCounts?.leader}
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        <i className="ri-shield-user-fill mr-1"></i>
                                        {stats?.roleCounts?.admin}
                                    </span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                        <i className="ri-user-fill mr-1"></i>
                                        {stats?.roleCounts?.member}
                                    </span>
                                </div>
                            </div>
                            <i className="ri-group-fill text-3xl text-blue-100 bg-blue-500 p-2 rounded-lg"></i>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Search members by name or tag..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Filter by:</span>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="leader">Leaders</option>
                                    <option value="admin">Seniors</option> {/* Ubah menjadi Senior */}
                                    <option value="member">Members</option>
                                </select>
                            </div>

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
                                    <option value="builderBaseTrophies">Builder Base</option>
                                    <option value="donations">Donations</option>
                                    <option value="townHallLevel">Town Hall</option>
                                    <option value="expLevel">Experience</option>
                                </select>
                                <button
                                    onClick={() => handleSort(sortConfig.key)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members List */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Town Hall
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trophies
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Donations
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMembers.map((member) => (
                                    <tr
                                        key={member.tag}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                        onClick={() => navigate(`/player/${encodeURIComponent(member.tag)}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold">
                                                    #{member.clanRank}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {member.playerHouse?.elements?.[0] ? (
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center">
                                                            <i className="ri-home-3-line text-white"></i>
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                            <i className="ri-user-line text-white"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{member.name}</div>
                                                    <div className="text-sm text-gray-500">{member.tag}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getRoleIcon(member.role)}
                                                <span className="ml-2 text-sm text-gray-900">
                                                    {getRoleDisplayName(member.role)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    TH{member.townHallLevel}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    Lvl {member.expLevel}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getLeagueIcon(member.league)}
                                                <span className="ml-2 font-medium">{member.trophies.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-sm">
                                                    <i className="ri-heart-3-line text-green-500 mr-1"></i>
                                                    <span className="font-medium">{member.donations.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <i className="ri-star-line text-blue-500 mr-1"></i>
                                                    <span>{member.donationsReceived.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Link
                                                    to={`/player/${encodeURIComponent(member.tag)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <i className="ri-eye-line mr-1"></i>
                                                    View Profile
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Results Info */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{filteredMembers.length}</span> of <span className="font-medium">{membersData.items?.length}</span> members
                                {searchTerm && ` for "${searchTerm}"`}
                                {roleFilter !== 'all' && ` in ${getRoleDisplayName(roleFilter)}s`}
                            </div>
                            <div className="mt-2 sm:mt-0">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Previous</span>
                                        <i className="ri-arrow-left-s-line"></i>
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        2
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Next</span>
                                        <i className="ri-arrow-right-s-line"></i>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}