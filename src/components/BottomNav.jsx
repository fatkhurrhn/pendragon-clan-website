import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Swords, Castle, Grid3X3 } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const menus = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/members', label: 'Members', icon: Users },
        { path: '/wars', label: 'Wars', icon: Swords },
        { path: '/capital', label: 'Capital', icon: Castle },
        { path: '/others', label: 'Others', icon: Grid3X3 },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-lg">
            <div className="max-w-md mx-auto flex justify-around items-center h-16">
                {menus.map((menu) => {
                    const isActive = location.pathname === menu.path ||
                        (menu.path !== '/home' && location.pathname.startsWith(menu.path));
                    const Icon = menu.icon;

                    return (
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-yellow-600' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-[10px] font-medium">{menu.label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Safe area spacer for iOS */}
            <div className="h-safe-area-inset-bottom bg-white" />
        </nav>
    );
};

export default BottomNav;