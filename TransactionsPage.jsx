import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsAPI } from '../services/api';
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw, Filter } from 'lucide-react';
import { Table, Th, Td, Pagination } from '../components/common/Table';
import { PageLoader, EmptyState } from '../components/common/UI';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', type, startDate, endDate, page],
    queryFn: () => transactionsAPI.getAll({ type, startDate, endDate, page, limit: 20 }).then(r => r.data),
    keepPreviousData: true
  });

  const typeBadge = (t) => {
    if (t === 'stock_in') return <span className="badge-green flex items-center gap-1"><TrendingUp size={11} /> Stock In</span>;
    if (t === 'stock_out') return <span className="badge-red flex items-center gap-1"><TrendingDown size={11} /> Stock Out</span>;
    return <span className="badge-yellow flex items-center gap-1"><RefreshCw size={11} /> Adjustment</span>;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Transaction History</h1>
        <p className="text-slate-500 text-sm mt-0.5">{data?.pagination?.total ?? 0} total transactions</p>
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-slate-400" />
          <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">All Types</option>
            <option value="stock_in">Stock In</option>
            <option value="stock_out">Stock Out</option>
            <option value="adjustment">Adjustment</option>
          </select>
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} className="input w-auto" />
            <span className="text-slate-400 text-sm">to</span>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} className="input w-auto" />
          </div>
          {(type || startDate || endDate) && (
            <button onClick={() => { setType(''); setStartDate(''); setEndDate(''); setPage(1); }}
              className="text-sm text-brand-600 hover:underline">Clear filters</button>
          )}
        </div>
      </div>

      <div className="card p-0">
        {isLoading ? <PageLoader /> : !data?.data?.length ? (
          <EmptyState icon={ArrowLeftRight} title="No transactions found" description="Transactions will appear here when stock movements occur" />
        ) : (
          <>
            <Table>
              <thead className="border-b border-slate-100">
                <tr>
                  <Th>Date & Time</Th><Th>Product</Th><Th>Type</Th>
                  <Th>Qty</Th><Th>Stock Change</Th><Th>Total Value</Th>
                  <Th>Reference</Th><Th>By</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.data.map(tx => (
                  <tr key={tx._id} className="hover:bg-slate-50/50">
                    <Td>
                      <p className="text-slate-700 whitespace-nowrap">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</p>
                      <p className="text-xs text-slate-400">{format(new Date(tx.createdAt), 'HH:mm')}</p>
                    </Td>
                    <Td>
                      <p className="font-medium text-slate-800">{tx.product?.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{tx.product?.sku}</p>
                    </Td>
                    <Td>{typeBadge(tx.type)}</Td>
                    <Td>
                      <span className={`font-semibold ${tx.type === 'stock_in' ? 'text-emerald-600' : tx.type === 'stock_out' ? 'text-red-500' : 'text-amber-600'}`}>
                        {tx.type === 'stock_in' ? '+' : tx.type === 'stock_out' ? '-' : '~'}{tx.quantity}
                      </span>
                    </Td>
                    <Td className="text-slate-500 text-xs whitespace-nowrap">{tx.previousStock} → {tx.newStock}</Td>
                    <Td className="font-medium text-slate-700">
                      {tx.totalValue ? `$${tx.totalValue.toFixed(2)}` : '—'}
                    </Td>
                    <Td className="text-slate-500 text-xs">{tx.reference || '—'}</Td>
                    <Td>
                      <p className="text-slate-700 text-sm">{tx.performedBy?.name}</p>
                      <span className={`text-xs font-medium capitalize ${tx.performedBy?.role === 'admin' ? 'text-brand-600' : 'text-slate-400'}`}>
                        {tx.performedBy?.role}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="px-6 py-3">
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
