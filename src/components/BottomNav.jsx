import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();

    const menus = [
        { path: '/', label: 'Home', icon: 'ri-home-5-line' },
        { path: '/members', label: 'Members', icon: 'ri-team-line' },
        { path: '/wars', label: 'Wars', icon: 'ri-sword-line' },
        { path: '/capital', label: 'Capital', icon: 'ri-bank-line' },
        { path: '/others', label: 'Others', icon: 'ri-grid-line' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-lg">
            <div className="max-w-md mx-auto flex justify-around items-center h-16">
                {menus.map((menu) => {
                    const isActive =
                        location.pathname === menu.path ||
                        (menu.path !== '/' && location.pathname.startsWith(menu.path));

                    return (
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive
                                    ? 'text-yellow-600'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <i
                                className={`${menu.icon} text-[20px] ${isActive ? 'font-bold' : ''
                                    }`}
                            />
                            <span className="text-[10px] font-medium">{menu.label}</span>
                        </Link>
                    );
                })}
            </div>
            <div className="h-safe-area-inset-bottom bg-white" />
        </nav>
    );
};

export default BottomNav;
