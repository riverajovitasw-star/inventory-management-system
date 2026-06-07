import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ArrowLeftRight, BarChart3,
  Users, ScrollText, LogOut, Menu, X, Boxes, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/stock', icon: Boxes, label: 'Stock' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const adminNavItems = [
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/logs', icon: ScrollText, label: 'Activity Logs' },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
          <Boxes size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-800 text-lg tracking-tight">InvenTrack</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Main</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto text-brand-400" />}
              </>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mt-5 mb-3">Admin</p>
            {adminNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to} to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    {label}
                    {isActive && <ChevronRight size={14} className="ml-auto text-brand-400" />}
                  </>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
            <span className="text-brand-700 text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white shadow-xl flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-100">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-700">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center">
              <Boxes size={12} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">InvenTrack</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
