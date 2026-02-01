import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ClanSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        minMembers: '',
        maxMembers: '',
        minClanLevel: '',
        minClanPoints: '',
        warFrequency: ''
    });
    const [pagination, setPagination] = useState({
        limit: 20,
        after: null,
        before: null
    });

    const warFrequencies = [
        { value: '', label: 'Any' },
        { value: 'always', label: 'Always' },
        { value: 'moreThanOncePerWeek', label: 'More than once/week' },
        { value: 'oncePerWeek', label: 'Once/week' },
        { value: 'lessThanOncePerWeek', label: 'Less than once/week' },
        { value: 'never', label: 'Never' },
        { value: 'unknown', label: 'Unknown' }
    ];

    const handleSearch = async (direction = 'next') => {
        if (!searchTerm.trim()) {
            setError('Please enter a clan name to search');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                name: searchTerm,
                limit: pagination.limit
            });

            // Add filters
            if (filters.minMembers) params.append('minMembers', filters.minMembers);
            if (filters.maxMembers) params.append('maxMembers', filters.maxMembers);
            if (filters.minClanLevel) params.append('minClanLevel', filters.minClanLevel);
            if (filters.minClanPoints) params.append('minClanPoints', filters.minClanPoints);
            if (filters.warFrequency) params.append('warFrequency', filters.warFrequency);

            // Add pagination cursors
            if (direction === 'next' && pagination.after) {
                params.append('after', pagination.after);
            } else if (direction === 'prev' && pagination.before) {
                params.append('before', pagination.before);
            }

            const response = await fetch(`http://localhost:3002/clans/search?${params}`);
            if (!response.ok) {
                throw new Error('Failed to search clans');
            }

            const data = await response.json();
            if (data.success) {
                setSearchResults(data.data.items || []);
                setPagination(prev => ({
                    ...prev,
                    after: data.data.paging?.cursors?.after || null,
                    before: data.data.paging?.cursors?.before || null
                }));
            } else {
                setSearchResults([]);
            }
        } catch (err) {
            setError(err.message);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, after: null, before: null }));
        handleSearch();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            minMembers: '',
            maxMembers: '',
            minClanLevel: '',
            minClanPoints: '',
            warFrequency: ''
        });
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

    const getWarFrequencyLabel = (frequency) => {
        switch (frequency) {
            case 'always': return 'Always';
            case 'moreThanOncePerWeek': return 'More than once/week';
            case 'oncePerWeek': return 'Once/week';
            case 'lessThanOncePerWeek': return 'Less than once/week';
            case 'never': return 'Never';
            default: return 'Unknown';
        }
    };

    const getClanLevelColor = (level) => {
        if (level >= 20) return 'bg-gradient-to-r from-purple-500 to-pink-500';
        if (level >= 15) return 'bg-gradient-to-r from-blue-500 to-purple-500';
        if (level >= 10) return 'bg-gradient-to-r from-green-500 to-blue-500';
        if (level >= 5) return 'bg-gradient-to-r from-yellow-500 to-green-500';
        return 'bg-gradient-to-r from-gray-500 to-gray-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <i className="ri-search-line text-blue-500"></i>
                                Clan Search
                            </h1>
                            <p className="text-gray-600 mt-2">Search for Clash of Clans clans around the world</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <i className="ri-arrow-left-line"></i>
                                Back
                            </Link>
                        </div>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Enter clan name..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-search-line"></i>
                                            Search Clans
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Advanced Filters */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <i className="ri-filter-line"></i>
                                        Advanced Filters
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                    >
                                        <i className="ri-close-line"></i>
                                        Clear Filters
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Members
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={filters.minMembers}
                                            onChange={(e) => handleFilterChange('minMembers', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Members
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={filters.maxMembers}
                                            onChange={(e) => handleFilterChange('maxMembers', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Clan Level
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="25"
                                            value={filters.minClanLevel}
                                            onChange={(e) => handleFilterChange('minClanLevel', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Clan Points
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={filters.minClanPoints}
                                            onChange={(e) => handleFilterChange('minClanPoints', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            War Frequency
                                        </label>
                                        <select
                                            value={filters.warFrequency}
                                            onChange={(e) => handleFilterChange('warFrequency', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {warFrequencies.map((freq) => (
                                                <option key={freq.value} value={freq.value}>
                                                    {freq.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Results */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <i className="ri-error-warning-line text-red-500 text-xl"></i>
                            <div>
                                <h4 className="font-medium text-red-800">Search Error</h4>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-medium text-gray-700">Searching clans...</p>
                        <p className="text-gray-500 text-sm">This may take a few seconds</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <>
                        <div className="mb-6 flex justify-between items-center">
                            <div className="text-lg font-semibold text-gray-900">
                                Found {searchResults.length} clans
                            </div>
                            <div className="text-sm text-gray-600">
                                Showing {pagination.limit} per page
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {searchResults.map((clan, index) => (
                                <Link
                                    key={clan.tag}
                                    to={`/clan/${clan.tag.replace('#', '')}`}
                                    className="block"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-shadow duration-300 h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={clan.badgeUrls.small}
                                                    alt={clan.name}
                                                    className="w-14 h-14"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{clan.name}</h3>
                                                    <div className="text-sm text-gray-600 font-mono">{clan.tag}</div>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getClanLevelColor(clan.clanLevel)}`}>
                                                Lvl {clan.clanLevel}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <i className="ri-team-line"></i>
                                                    Members
                                                </div>
                                                <div className="font-semibold text-gray-900">
                                                    {clan.members}/50
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <i className="ri-trophy-line"></i>
                                                    Points
                                                </div>
                                                <div className="font-semibold text-gray-900">
                                                    {clan.clanPoints.toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <i className="ri-sword-line"></i>
                                                    War Wins
                                                </div>
                                                <div className="font-semibold text-gray-900">
                                                    {clan.warWins}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <i className="ri-award-line"></i>
                                                    War Streak
                                                </div>
                                                <div className="font-semibold text-green-600">
                                                    {clan.warWinStreak}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getWarFrequencyColor(clan.warFrequency)}`}>
                                                {getWarFrequencyLabel(clan.warFrequency)}
                                            </span>
                                            {clan.isWarLogPublic && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                                                    Public War Log
                                                </span>
                                            )}
                                            {clan.isFamilyFriendly && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                                    Family Friendly
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                View Details
                                                <i className="ri-arrow-right-line"></i>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {(pagination.before || pagination.after) && (
                            <div className="flex justify-center gap-4 mb-8">
                                {pagination.before && (
                                    <button
                                        onClick={() => handleSearch('prev')}
                                        disabled={loading}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <i className="ri-arrow-left-line"></i>
                                        Previous
                                    </button>
                                )}
                                {pagination.after && (
                                    <button
                                        onClick={() => handleSearch('next')}
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        Next
                                        <i className="ri-arrow-right-line"></i>
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                ) : searchTerm && !loading && !error ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <i className="ri-search-eye-line text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No clans found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : null}

                {/* Tips */}
                {!searchTerm && !loading && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="ri-lightbulb-line text-yellow-500"></i>
                            Search Tips
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="ri-search-2-line text-blue-500"></i>
                                    <div className="font-medium text-blue-800">Partial Names</div>
                                </div>
                                <p className="text-sm text-blue-700">Search works with partial clan names (e.g., "dragon" finds "Pendragon")</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="ri-filter-line text-green-500"></i>
                                    <div className="font-medium text-green-800">Use Filters</div>
                                </div>
                                <p className="text-sm text-green-700">Refine results by members, level, points, and war frequency</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="ri-eye-line text-purple-500"></i>
                                    <div className="font-medium text-purple-800">View Details</div>
                                </div>
                                <p className="text-sm text-purple-700">Click on any clan card to see detailed information and statistics</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p className="flex items-center justify-center gap-2">
                        <i className="ri-information-line"></i>
                        Clan data provided by Clash of Clans Official API
                    </p>
                </div>
            </div>
        </div>
    );
}