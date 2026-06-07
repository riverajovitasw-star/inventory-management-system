import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../services/api';
import { PageLoader } from '../components/common/UI';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';

const COLORS = ['#3b63f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function AnalyticsPage() {
  const [movementDays, setMovementDays] = useState(30);

  const { data: movement, isLoading: ml } = useQuery({
    queryKey: ['stock-movement', movementDays],
    queryFn: () => analyticsAPI.getStockMovement({ days: movementDays }).then(r => r.data.data)
  });

  const { data: topOut } = useQuery({
    queryKey: ['top-products', 'stock_out'],
    queryFn: () => analyticsAPI.getTopProducts({ type: 'stock_out', limit: 8 }).then(r => r.data.data)
  });

  const { data: topIn } = useQuery({
    queryKey: ['top-products', 'stock_in'],
    queryFn: () => analyticsAPI.getTopProducts({ type: 'stock_in', limit: 8 }).then(r => r.data.data)
  });

  const { data: categoryData } = useQuery({
    queryKey: ['category-breakdown'],
    queryFn: () => analyticsAPI.getCategoryBreakdown().then(r => r.data.data)
  });

  const chartData = (movement || []).map(d => ({
    date: format(parseISO(d.date), 'MMM d'),
    'Stock In': d.stock_in,
    'Stock Out': d.stock_out,
    'Revenue': d.valueOut
  }));

  const pieData = (categoryData || []).map(c => ({ name: c._id, value: Math.round(c.totalValue) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Inventory insights and trends</p>
      </div>

      {/* Stock movement */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-semibold text-slate-700">Stock Movement</h3>
          <div className="flex gap-2">
            {[7, 14, 30, 60].map(d => (
              <button key={d} onClick={() => setMovementDays(d)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${movementDays === d ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {d}d
              </button>
            ))}
          </div>
        </div>
        {ml ? <PageLoader /> : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b63f6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3b63f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="Stock In" stroke="#3b63f6" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="Stock Out" stroke="#ef4444" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Value Breakdown */}
        <div className="card">
          <h3 className="font-semibold text-slate-700 mb-4">Inventory Value by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Value']} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Sold Products */}
        <div className="card">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-red-500" /> Top Outgoing Products (30d)
          </h3>
          <div className="space-y-3">
            {(topOut || []).slice(0, 6).map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{p.product?.name}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div className="bg-red-400 h-full rounded-full" style={{ width: `${(p.totalQty / (topOut[0]?.totalQty || 1)) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{p.totalQty} units</span>
              </div>
            ))}
            {(!topOut || topOut.length === 0) && <p className="text-sm text-slate-400 text-center py-4">No data yet</p>}
          </div>
        </div>
      </div>

      {/* Top incoming */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-500" /> Top Restocked Products (30d)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={(topIn || []).map(p => ({ name: p.product?.name?.slice(0, 15), qty: p.totalQty }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="qty" fill="#10b981" radius={[6, 6, 0, 0]} name="Units In" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category table */}
      {categoryData && categoryData.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Package size={16} className="text-slate-400" /> Category Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Category</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Products</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Total Stock</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Inventory Value</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Avg Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categoryData.map((c, i) => (
                  <tr key={c._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-medium text-slate-800">{c._id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{c.count}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{c.totalStock.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">${Math.round(c.totalValue).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-500">${c.avgPrice?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
