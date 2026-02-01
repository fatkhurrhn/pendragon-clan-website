import React, { useState, useEffect } from 'react';

export default function ClanCurrentWar() {
    const [warData, setWarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [refreshInterval, setRefreshInterval] = useState(null);

    useEffect(() => {
        fetchCurrentWarData();

        // Auto refresh setiap 30 detik
        const interval = setInterval(() => {
            fetchCurrentWarData();
        }, 30000);

        setRefreshInterval(interval);

        return () => {
            if (refreshInterval) clearInterval(refreshInterval);
        };
    }, []);

    useEffect(() => {
        if (warData?.data?.state === 'warEnded' || warData?.data?.state === 'inWar') {
            // Update countdown setiap detik
            const timer = setInterval(() => {
                updateTimeLeft();
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [warData]);

    const fetchCurrentWarData = async () => {
        try {
            const response = await fetch('http://localhost:3002/currentwar');
            const data = await response.json();

            if (data.success) {
                setWarData(data);
                updateTimeLeft();
            } else {
                setError('Failed to fetch current war data');
            }
        } catch (err) {
            setError('Error fetching current war data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateTimeLeft = () => {
        if (!warData?.data?.endTime) {
            setTimeLeft('');
            return;
        }

        const endTime = new Date(warData.data.endTime);
        const now = new Date();
        const diffMs = endTime - now;

        if (diffMs <= 0) {
            setTimeLeft('War ended');
            return;
        }

        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        setTimeLeft(`${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`);
    };

    const getWarStateInfo = (state) => {
        switch (state) {
            case 'notInWar':
                return {
                    title: 'Not in War',
                    description: 'Clan is currently not in war',
                    icon: 'ri-sword-line',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    borderColor: 'border-gray-300'
                };
            case 'preparation':
                return {
                    title: 'Preparation Day',
                    description: 'Preparing for war',
                    icon: 'ri-tools-line',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    borderColor: 'border-blue-300'
                };
            case 'inWar':
                return {
                    title: 'War in Progress',
                    description: 'Battle is ongoing',
                    icon: 'ri-sword-fill',
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    borderColor: 'border-red-300'
                };
            case 'warEnded':
                return {
                    title: 'War Ended',
                    description: 'Waiting for results',
                    icon: 'ri-flag-line',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    borderColor: 'border-green-300'
                };
            default:
                return {
                    title: 'Unknown',
                    description: 'Unknown war state',
                    icon: 'ri-question-line',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    borderColor: 'border-gray-300'
                };
        }
    };

    const getFormattedDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const handleRefresh = () => {
        fetchCurrentWarData();
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading current war data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
            <div className="text-center text-red-500">
                <i className="ri-error-warning-line text-4xl mb-4"></i>
                <p>{error}</p>
                <button
                    onClick={fetchCurrentWarData}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                    <i className="ri-refresh-line mr-2"></i>
                    Retry
                </button>
            </div>
        </div>
    );

    if (!warData) return null;

    const { state, clan, opponent, teamSize, startTime, endTime } = warData.data;
    const stateInfo = getWarStateInfo(state);
    const isInWar = state === 'inWar' || state === 'preparation' || state === 'warEnded';

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <i className={`${stateInfo.icon} mr-3 ${stateInfo.color}`}></i>
                                Current War
                            </h1>
                            <p className="text-gray-600 mt-2">Real-time war status and statistics</p>
                        </div>

                        <div className="mt-4 md:mt-0 flex space-x-4">
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center"
                            >
                                <i className="ri-refresh-line mr-2"></i>
                                Refresh
                            </button>
                            <div className="text-sm text-gray-500">
                                Auto-refresh every 30s
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* War Status Banner */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className={`rounded-xl p-6 mb-6 border ${stateInfo.bgColor} ${stateInfo.borderColor}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center">
                            <i className={`${stateInfo.icon} text-3xl mr-4 ${stateInfo.color}`}></i>
                            <div>
                                <h2 className={`text-2xl font-bold ${stateInfo.color}`}>{stateInfo.title}</h2>
                                <p className="text-gray-700">{stateInfo.description}</p>
                            </div>
                        </div>

                        {isInWar && timeLeft && (
                            <div className="mt-4 md:mt-0">
                                <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
                                    <div className="text-3xl font-bold text-gray-900 font-mono">{timeLeft}</div>
                                    {state === 'inWar' && (
                                        <div className="text-xs text-red-600 mt-1">
                                            <i className="ri-alarm-warning-line mr-1"></i>
                                            Attacks are live!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* War Timeline */}
                    {isInWar && (
                        <div className="mt-6 pt-6 border-t border-gray-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-600">Start Time</div>
                                    <div className="font-medium">{getFormattedDate(startTime)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-600">End Time</div>
                                    <div className="font-medium">{getFormattedDate(endTime)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-600">Team Size</div>
                                    <div className="font-medium">{teamSize || 'N/A'} vs {teamSize || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* War Comparison */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Our Clan */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center mb-6">
                                <img
                                    src={clan.badgeUrls.medium}
                                    alt="Our clan badge"
                                    className="w-16 h-16 mr-4"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl">Our Clan</h3>
                                    <div className="mt-1">
                                        <span className="text-sm font-medium px-2 py-1 bg-red-100 text-red-800 rounded">
                                            Level {clan.clanLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-gray-900">{clan.stars}</div>
                                        <div className="text-sm text-gray-600">Stars</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-gray-900">{clan.destructionPercentage}%</div>
                                        <div className="text-sm text-gray-600">Destruction</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Attacks Used</span>
                                        <span className="font-medium">{clan.attacks}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{ width: `${Math.min((clan.attacks / (teamSize * 2)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {state === 'inWar' && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <i className="ri-sword-fill text-blue-600 mr-2"></i>
                                            <span className="text-sm font-medium text-blue-700">War attacks are active</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* VS Center */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-white">VS</span>
                            </div>

                            {state === 'inWar' && (
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {clan.stars} - {opponent.stars}
                                    </div>
                                    <div className="text-sm text-gray-600">Current Score</div>
                                </div>
                            )}

                            <div className="mt-6">
                                <div className="flex items-center justify-center space-x-2 text-gray-600">
                                    <i className="ri-time-line"></i>
                                    <span>Updated just now</span>
                                </div>
                            </div>
                        </div>

                        {/* Opponent Clan */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center mb-6">
                                <img
                                    src={opponent.badgeUrls.medium}
                                    alt="Opponent clan badge"
                                    className="w-16 h-16 mr-4"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl">Opponent</h3>
                                    <div className="mt-1">
                                        <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                            Level {opponent.clanLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-gray-900">{opponent.stars}</div>
                                        <div className="text-sm text-gray-600">Stars</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-gray-900">{opponent.destructionPercentage}%</div>
                                        <div className="text-sm text-gray-600">Destruction</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Attacks Used</span>
                                        <span className="font-medium">{opponent.attacks}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{ width: `${Math.min((opponent.attacks / (teamSize * 2)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {state === 'inWar' && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <i className="ri-sword-fill text-red-600 mr-2"></i>
                                            <span className="text-sm font-medium text-red-700">Enemy attacks are active</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center">
                        <i className="ri-bar-chart-line mr-2 text-blue-500"></i>
                        War Statistics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{clan.attacks}</div>
                            <div className="text-sm text-gray-600">Our Attacks</div>
                            <div className="mt-2 text-xs text-blue-600">
                                {Math.round((clan.attacks / (teamSize * 2)) * 100)}% efficiency
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{opponent.attacks}</div>
                            <div className="text-sm text-gray-600">Their Attacks</div>
                            <div className="mt-2 text-xs text-blue-600">
                                {Math.round((opponent.attacks / (teamSize * 2)) * 100)}% efficiency
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                                {clan.destructionPercentage > opponent.destructionPercentage ? '+' : ''}
                                {(clan.destructionPercentage - opponent.destructionPercentage).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Destruction Diff</div>
                            <div className={`mt-2 text-xs ${clan.destructionPercentage > opponent.destructionPercentage ? 'text-green-600' : 'text-red-600'}`}>
                                {clan.destructionPercentage > opponent.destructionPercentage ? 'Ahead' : 'Behind'}
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{clan.stars - opponent.stars}</div>
                            <div className="text-sm text-gray-600">Star Difference</div>
                            <div className={`mt-2 text-xs ${clan.stars > opponent.stars ? 'text-green-600' : 'text-red-600'}`}>
                                {clan.stars > opponent.stars ? 'Winning' : 'Losing'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Based on State */}
                {state === 'notInWar' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <i className="ri-information-line text-2xl text-yellow-600 mr-4"></i>
                            <div>
                                <h4 className="font-bold text-yellow-800">Ready for War?</h4>
                                <p className="text-yellow-700 mt-1">The clan is currently not in war. Start a new war or wait for the next war search.</p>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 flex items-center">
                                <i className="ri-sword-line mr-2"></i>
                                Start War Search
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                                <i className="ri-group-line mr-2"></i>
                                View War Roster
                            </button>
                        </div>
                    </div>
                )}

                {state === 'preparation' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <i className="ri-alarm-warning-line text-2xl text-blue-600 mr-4"></i>
                            <div>
                                <h4 className="font-bold text-blue-800">Preparation Phase</h4>
                                <p className="text-blue-700 mt-1">
                                    War starts in {timeLeft}. Prepare your attacks and arrange your war bases.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center">
                                <i className="ri-shield-line mr-2"></i>
                                View Base Layouts
                            </button>
                            <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center">
                                <i className="ri-team-line mr-2"></i>
                                Check War Lineup
                            </button>
                        </div>
                    </div>
                )}

                {state === 'inWar' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <i className="ri-sword-fill text-2xl text-red-600 mr-4"></i>
                            <div>
                                <h4 className="font-bold text-red-800">War in Progress!</h4>
                                <p className="text-red-700 mt-1">
                                    Attacks are live! Use your attacks strategically to maximize stars and destruction.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center">
                                <i className="ri-sword-line mr-2"></i>
                                Report Attack
                            </button>
                            <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center">
                                <i className="ri-chat-3-line mr-2"></i>
                                War Chat
                            </button>
                            <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center">
                                <i className="ri-eye-line mr-2"></i>
                                View Enemy Bases
                            </button>
                        </div>
                    </div>
                )}

                {state === 'warEnded' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <i className="ri-flag-fill text-2xl text-green-600 mr-4"></i>
                            <div>
                                <h4 className="font-bold text-green-800">War Ended</h4>
                                <p className="text-green-700 mt-1">
                                    The war has ended. Final results will be available shortly.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center">
                                <i className="ri-medal-line mr-2"></i>
                                View Results
                            </button>
                            <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center">
                                <i className="ri-award-line mr-2"></i>
                                War Summary
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center">
                            <i className="ri-refresh-line mr-1"></i>
                            <span>Auto-refresh: Enabled</span>
                        </div>
                        <div className="flex items-center">
                            <i className="ri-time-line mr-1"></i>
                            <span>Last updated: {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <p className="mt-2">War data updates automatically every 30 seconds</p>
                </div>
            </div>
        </div>
    );
}