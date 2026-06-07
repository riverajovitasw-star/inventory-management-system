import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-brand-500 ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={32} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><Icon size={24} className="text-slate-400" /></div>}
      <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function StatCard({ title, value, icon: Icon, color = 'blue', subtitle, trend }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    yellow: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  return (
    <div className="stat-card">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
