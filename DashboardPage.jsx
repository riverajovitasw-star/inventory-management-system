import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI, transactionsAPI } from '../services/api';
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign, ArrowLeftRight, BarChart3, RefreshCw } from 'lucide-react';
import { PageLoader, StatCard } from '../components/common/UI';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => analyticsAPI.getDashboard().then(r => r.data.data),
    refetchInterval: 60000
  });

  const { data: movementData, isLoading: movementLoading } = useQuery({
    queryKey: ['stock-movement'],
    queryFn: () => analyticsAPI.getStockMovement({ days: 14 }).then(r => r.data.data)
  });

  const { data: txData } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => transactionsAPI.getAll({ limit: 8 }).then(r => r.data.data)
  });

  if (statsLoading) return <PageLoader />;

  const stats = statsData || {};

  const chartData = (movementData || []).map(d => ({
    date: format(parseISO(d.date), 'MMM d'),
    'Stock In': d.stock_in,
    'Stock Out': d.stock_out
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your inventory system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.products?.total ?? 0} icon={Package} color="blue"
          subtitle={`${stats.products?.active ?? 0} active`} />
        <StatCard title="Low Stock Items" value={stats.products?.lowStock ?? 0} icon={AlertTriangle} color="yellow"
          subtitle="Needs reorder" />
        <StatCard title="Out of Stock" value={stats.products?.outOfStock ?? 0} icon={TrendingDown} color="red"
          subtitle="Immediate action needed" />
        <StatCard title="Inventory Value" icon={DollarSign} color="green"
          value={`$${(stats.inventory?.totalValue ?? 0).toLocaleString()}`}
          subtitle={`$${(stats.inventory?.monthlyRevenue ?? 0).toLocaleString()} this month`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Transactions Today" value={stats.transactions?.today ?? 0} icon={ArrowLeftRight} color="purple"
          subtitle={`${stats.transactions?.todayIn ?? 0} in / ${stats.transactions?.todayOut ?? 0} out`} />
        <StatCard title="This Week" value={stats.transactions?.week ?? 0} icon={BarChart3} color="blue"
          subtitle="Total transactions" />
        <StatCard title="This Month" value={stats.transactions?.month ?? 0} icon={TrendingUp} color="green"
          subtitle="Total transactions" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-700 mb-4">Stock Movement — Last 14 Days</h3>
          {movementLoading ? <PageLoader /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b63f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b63f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="Stock In" stroke="#3b63f6" fill="url(#inGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Stock Out" stroke="#f43f5e" fill="url(#outGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent transactions */}
        <div className="card">
          <h3 className="font-semibold text-slate-700 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {(txData || []).slice(0, 6).map(tx => (
              <div key={tx._id} className="flex items-center gap-3 py-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'stock_in' ? 'bg-emerald-50' : tx.type === 'stock_out' ? 'bg-red-50' : 'bg-amber-50'
                }`}>
                  {tx.type === 'stock_in' ? <TrendingUp size={14} className="text-emerald-600" /> :
                   tx.type === 'stock_out' ? <TrendingDown size={14} className="text-red-500" /> :
                   <RefreshCw size={14} className="text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{tx.product?.name}</p>
                  <p className="text-xs text-slate-400">{tx.performedBy?.name} · {format(new Date(tx.createdAt), 'MMM d, HH:mm')}</p>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'stock_in' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'stock_in' ? '+' : '-'}{tx.quantity}
                </span>
              </div>
            ))}
            {(!txData || txData.length === 0) && <p className="text-sm text-slate-400 text-center py-4">No transactions yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
