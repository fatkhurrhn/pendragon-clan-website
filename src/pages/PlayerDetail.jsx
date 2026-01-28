import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Trophy, Star, Zap, Home, Shield, Target,
    Sword, Sparkles, Award, ChevronDown, ChevronUp,
    Users, Building2, Crown, Flame
} from 'lucide-react';

const API_BASE = 'http://localhost:3002';

const PlayerDetail = () => {
    const { tag } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedSections, setExpandedSections] = useState({
        heroes: true,
        troops: false,
        spells: false,
        achievements: false
    });

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/player/${tag}`);
                const data = await response.json();

                if (!data.success) throw new Error(data.error || 'Failed to fetch');
                setPlayer(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (tag) fetchPlayer();
    }, [tag]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 pb-24">
                <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="max-w-md mx-auto px-4 py-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="max-w-md mx-auto px-4 py-12 text-center text-red-500">
                    Error: {error}
                </div>
            </div>
        );
    }

    if (!player) return null;

    // Filter data
    const homeTroops = player.troops?.filter(t => t.village === 'home' && !t.name.startsWith('Super')) || [];
    const superTroops = player.troops?.filter(t => t.name.startsWith('Super')) || [];
    const builderTroops = player.troops?.filter(t => t.village === 'builderBase') || [];
    const homeSpells = player.spells?.filter(s => s.village === 'home') || [];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <h1 className="font-bold text-lg text-slate-800 truncate">{player.name}</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-4 space-y-4">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-yellow-400 to-orange-500"></div>

                    <div className="relative pt-12">
                        {player.clan?.badgeUrls?.medium && (
                            <img
                                src={player.clan.badgeUrls.medium}
                                alt="Clan"
                                className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-lg bg-white mb-3 object-contain"
                            />
                        )}

                        <h2 className="text-2xl font-black text-slate-800 mb-1">{player.name}</h2>
                        <p className="text-slate-500 font-mono text-sm mb-2 bg-slate-100 inline-block px-3 py-1 rounded-full">
                            {player.tag}
                        </p>

                        {player.role && (
                            <span className="block text-xs font-bold text-yellow-600 uppercase tracking-wider mb-3">
                                {player.role === 'admin' ? 'Elder' : player.role === 'coLeader' ? 'Co-Leader' : player.role}
                            </span>
                        )}

                        <div className="flex justify-center gap-2 flex-wrap">
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> TH{player.townHallLevel}
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                                XP {player.expLevel}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs font-bold uppercase">Home</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{player.trophies}</p>
                        <p className="text-xs text-slate-400">Best: {player.bestTrophies}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Building2 className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-bold uppercase">Builder</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{player.builderBaseTrophies || 0}</p>
                        <p className="text-xs text-slate-400">BH{player.builderHallLevel || '-'}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Star className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-bold uppercase">War Stars</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{player.warStars || 0}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-bold uppercase">Donations</span>
                        </div>
                        <p className="text-xl font-black text-slate-800">{player.donations || 0}</p>
                        <p className="text-xs text-slate-400">Received: {player.donationsReceived || 0}</p>
                    </div>
                </div>

                {/* Clan Info */}
                {player.clan && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <Users className="w-4 h-4 text-yellow-500" />
                            Current Clan
                        </h3>
                        <div className="flex items-center gap-3">
                            <img
                                src={player.clan.badgeUrls?.small}
                                alt=""
                                className="w-12 h-12 object-contain"
                            />
                            <div className="flex-1">
                                <p className="font-bold text-slate-800">{player.clan.name}</p>
                                <p className="text-xs text-slate-500">{player.clan.tag} • Level {player.clan.clanLevel}</p>
                            </div>
                        </div>
                        {player.clanCapitalContributions > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm">
                                <span className="text-slate-500">Capital Contributions</span>
                                <span className="font-bold text-slate-800">{player.clanCapitalContributions.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* League Info */}
                {player.leagueTier && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                        {player.leagueTier.iconUrls?.small && (
                            <img src={player.leagueTier.iconUrls.small} alt="" className="w-10 h-10" />
                        )}
                        <div>
                            <p className="text-xs text-slate-500 uppercase">League</p>
                            <p className="font-bold text-slate-800">{player.leagueTier.name}</p>
                        </div>
                        {player.builderBaseLeague && (
                            <div className="ml-auto text-right">
                                <p className="text-xs text-slate-500 uppercase">Builder</p>
                                <p className="font-bold text-slate-800 text-sm">{player.builderBaseLeague.name}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* War Preference */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Sword className="w-4 h-4 text-red-500" />
                        War Preference
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${player.warPreference === 'in'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {player.warPreference === 'in' ? 'OPTED IN' : 'OPTED OUT'}
                    </span>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {[
                        { id: 'heroes', label: 'Heroes', icon: Crown },
                        { id: 'troops', label: 'Troops', icon: Target },
                        { id: 'spells', label: 'Spells', icon: Sparkles },
                        { id: 'achievements', label: 'Achievements', icon: Award },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-white text-slate-600 border border-slate-200'
                                }`}
                        >
                            <tab.icon className="w-3 h-3" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Heroes Section */}
                {activeTab === 'heroes' && (
                    <div className="space-y-2">
                        {player.heroes?.map(hero => (
                            <div key={hero.name} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                            <Crown className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{hero.name}</p>
                                            <p className="text-xs text-slate-500">{hero.village === 'builderBase' ? 'Builder Base' : 'Home Village'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-slate-800">Lvl {hero.level}</p>
                                        <p className="text-xs text-slate-400">Max: {hero.maxLevel}</p>
                                    </div>
                                </div>

                                {/* Equipment */}
                                {hero.equipment?.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Equipment</p>
                                        {hero.equipment.map(eqp => (
                                            <div key={eqp.name} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded">
                                                <span className="text-slate-700">{eqp.name}</span>
                                                <span className="font-bold text-yellow-600">Lvl {eqp.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Troops Section */}
                {activeTab === 'troops' && (
                    <div className="space-y-4">
                        {/* Home Troops */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-sm text-slate-700">
                                Home Village Troops ({homeTroops.length})
                            </div>
                            <div className="p-3 grid grid-cols-2 gap-2">
                                {homeTroops.map(troop => (
                                    <div key={troop.name} className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                                        <span className="text-slate-700 truncate">{troop.name}</span>
                                        <span className="font-bold text-yellow-600 text-xs">Lv{troop.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Super Troops */}
                        {superTroops.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-3 bg-yellow-50 border-b border-yellow-100 font-bold text-sm text-yellow-800">
                                    Super Troops ({superTroops.length})
                                </div>
                                <div className="p-3 grid grid-cols-2 gap-2">
                                    {superTroops.map(troop => (
                                        <div key={troop.name} className="flex justify-between items-center p-2 bg-yellow-50/50 rounded text-sm">
                                            <span className="text-slate-700 truncate">{troop.name}</span>
                                            <span className="font-bold text-yellow-600 text-xs">Lv{troop.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Builder Troops */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-3 bg-orange-50 border-b border-orange-100 font-bold text-sm text-orange-800">
                                Builder Base Troops ({builderTroops.length})
                            </div>
                            <div className="p-3 grid grid-cols-2 gap-2">
                                {builderTroops.map(troop => (
                                    <div key={troop.name} className="flex justify-between items-center p-2 bg-orange-50/30 rounded text-sm">
                                        <span className="text-slate-700 truncate">{troop.name}</span>
                                        <span className="font-bold text-orange-600 text-xs">Lv{troop.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Spells Section */}
                {activeTab === 'spells' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {homeSpells.map(spell => (
                                <div key={spell.name} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{spell.name}</p>
                                        <p className="text-xs text-blue-600">Level {spell.level}/{spell.maxLevel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements Section */}
                {activeTab === 'achievements' && (
                    <div className="space-y-2">
                        {player.achievements?.map((ach, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-sm mb-1">{ach.name}</p>
                                        <p className="text-xs text-slate-500 mb-2">{ach.info}</p>
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-yellow-500 h-full rounded-full"
                                                style={{ width: `${Math.min((ach.value / ach.target) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {ach.value.toLocaleString()} / {ach.target.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="ml-3 flex flex-col items-center">
                                        <Award className={`w-5 h-5 ${ach.stars === 3 ? 'text-yellow-500' : ach.stars === 2 ? 'text-slate-400' : 'text-orange-400'}`} />
                                        <span className="text-[10px] font-bold text-slate-400 mt-1">{ach.stars}★</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Labels */}
                {player.labels?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                        {player.labels.map(label => (
                            <div key={label.id} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                {label.iconUrls?.small && (
                                    <img src={label.iconUrls.small} alt="" className="w-4 h-4" />
                                )}
                                <span className="text-xs font-medium text-slate-600">{label.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerDetail;