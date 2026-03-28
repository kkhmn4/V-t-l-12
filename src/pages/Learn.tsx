import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { initUserProgress, updateTimeSpent } from '../lib/db';
import { logout } from '../lib/firebase';
import Stage1 from '../components/learn/Stage1';
import Stage2 from '../components/learn/Stage2';
import Stage3 from '../components/learn/Stage3';
import Stage4 from '../components/learn/Stage4';

const Learn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (user) {
      initUserProgress(user.uid, user.displayName || 'Học sinh', user.email || '');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (user) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        updateTimeSpent(user.uid, timeSpent);
      }
    };
  }, [user, startTime]);

  const navItems = [
    { path: '/learn/stage-1', label: 'Thí nghiệm tán xạ', icon: 'science' },
    { path: '/learn/stage-2', label: 'Cấu trúc hạt nhân', icon: 'hub' },
    { path: '/learn/stage-3', label: 'Kích thước & Lực', icon: 'settings_ethernet' },
    { path: '/learn/stage-4', label: 'Đồng vị', icon: 'layers' },
  ];

  return (
    <div className="bg-[#fbf9f8] font-body text-on-surface selection:bg-primary-fixed min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-white/70 backdrop-blur-xl shadow-[0_32px_64px_rgba(69,95,136,0.05)]">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-[#455f88] font-headline tracking-tight">Cấu Trúc Hạt Nhân</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="font-headline font-medium tracking-tight text-[#455f88] hover:text-[#ad2c00] transition-colors duration-300">Thư viện</a>
          <a href="#" className="font-headline font-medium tracking-tight text-[#455f88] hover:text-[#ad2c00] transition-colors duration-300">Tài liệu</a>
          <a href="#" className="font-headline font-medium tracking-tight text-[#455f88] hover:text-[#ad2c00] transition-colors duration-300">Hướng dẫn</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#ad2c00]/5 transition-colors duration-300">
            <span className="material-symbols-outlined text-secondary">settings</span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#ad2c00]/5 transition-colors duration-300">
            <span className="material-symbols-outlined text-secondary">help</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden">
            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`} alt="User profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-16">
        {/* Side Navigation Bar (25%) */}
        <aside className="hidden lg:flex w-[25%] bg-[#f6f3f2] fixed h-[calc(100vh-4rem)] flex-col pt-12 pb-8 px-6 overflow-y-auto z-40">
          <div className="mb-10">
            <h2 className="font-headline text-xl font-extrabold text-[#455f88] mb-1">Hạt Nhân</h2>
            <p className="font-label text-xs uppercase tracking-wider text-secondary opacity-70">Phòng thí nghiệm ảo</p>
          </div>
          <nav className="flex-grow space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-4 p-4 rounded-r-full transition-all group ${
                    isActive 
                      ? 'active-nav-gradient text-white shadow-lg transform translate-x-1 font-semibold' 
                      : 'text-[#455f88] opacity-70 hover:opacity-100 hover:translate-x-1'
                  }`}
                >
                  <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {item.icon}
                  </span>
                  <span className="font-label text-sm uppercase tracking-wider text-left">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto pt-8 border-t border-secondary/10 space-y-2">
            <button className="w-full flex items-center gap-4 p-4 text-[#455f88] opacity-70 hover:opacity-100 transition-all">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label text-sm uppercase tracking-wider">Cài đặt</span>
            </button>
            <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-error opacity-70 hover:opacity-100 transition-all">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label text-sm uppercase tracking-wider">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area (75%) */}
        <main className="w-full lg:ml-[25%] lg:w-[75%] min-h-full">
          <Routes>
            <Route path="stage-1" element={<Stage1 />} />
            <Route path="stage-2" element={<Stage2 />} />
            <Route path="stage-3" element={<Stage3 />} />
            <Route path="stage-4" element={<Stage4 />} />
            <Route path="/" element={<Navigate to="stage-1" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Learn;
