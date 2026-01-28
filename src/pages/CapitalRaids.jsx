import React from 'react';
import { Castle, Wrench } from 'lucide-react';

const CapitalRaids = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="bg-white border-b border-slate-200 px-4 py-4">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Castle className="w-6 h-6 text-purple-500" />
                        Capital Raids
                    </h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-12 text-center">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Under Construction</h2>
                    <p className="text-slate-500 text-sm">
                        Capital raid seasons data will be available here soon.
                        <br /><br />
                        This feature is coming in the next update!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CapitalRaids;