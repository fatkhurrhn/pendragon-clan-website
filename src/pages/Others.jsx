import React from 'react';
import { Grid3X3, Settings, HelpCircle, Info, ExternalLink } from 'lucide-react';

const Others = () => {
    const menuItems = [
        { icon: Settings, label: 'Settings', desc: 'App preferences' },
        { icon: HelpCircle, label: 'Help & Support', desc: 'Get assistance' },
        { icon: Info, label: 'About', desc: 'App information' },
        { icon: ExternalLink, label: 'Open CoC', desc: 'Launch game' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="bg-white border-b border-slate-200 px-4 py-4">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Grid3X3 className="w-6 h-6 text-slate-600" />
                        Others
                    </h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-4 space-y-2">
                {menuItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={idx}
                            className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.99] transition-transform text-left"
                        >
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <Icon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">{item.label}</h3>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </button>
                    );
                })}

                <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-xs text-yellow-800 text-center">
                        Pendragon Clan App v1.0<br />
                        Built with ⚔️ by Fatkhurrhn
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Others;