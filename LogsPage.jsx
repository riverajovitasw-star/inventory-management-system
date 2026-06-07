import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logsAPI } from '../services/api';
import { ScrollText, Filter } from 'lucide-react';
import { Table, Th, Td, Pagination } from '../components/common/Table';
import { PageLoader, EmptyState } from '../components/common/UI';
import { format } from 'date-fns';

const ACTION_COLORS = {
  CREATE_PRODUCT: 'badge-green',
  UPDATE_PRODUCT: 'badge-blue',
  DELETE_PRODUCT: 'badge-red',
  STOCK_IN: 'badge-green',
  STOCK_OUT: 'badge-red',
  STOCK_ADJUST: 'badge-yellow',
  LOGIN: 'badge-blue',
  REGISTER: 'badge-green',
  CREATE_USER: 'badge-green',
  UPDATE_USER: 'badge-blue',
  DELETE_USER: 'badge-red',
};

export default function LogsPage() {
  const [entity, setEntity] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['logs', entity, action, page],
    queryFn: () => logsAPI.getAll({ entity, action, page, limit: 30 }).then(r => r.data),
    keepPreviousData: true
  });

  const logs = data?.data || [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Activity Logs</h1>
        <p className="text-slate-500 text-sm mt-0.5">Full audit trail of all system actions</p>
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-slate-400" />
          <select value={entity} onChange={e => { setEntity(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">All Entities</option>
            <option value="User">User</option>
            <option value="Product">Product</option>
          </select>
          <select value={action} onChange={e => { setAction(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="REGISTER">Register</option>
            <option value="CREATE_PRODUCT">Create Product</option>
            <option value="UPDATE_PRODUCT">Update Product</option>
            <option value="DELETE_PRODUCT">Delete Product</option>
            <option value="STOCK_IN">Stock In</option>
            <option value="STOCK_OUT">Stock Out</option>
            <option value="STOCK_ADJUST">Stock Adjust</option>
            <option value="CREATE_USER">Create User</option>
            <option value="UPDATE_USER">Update User</option>
            <option value="DELETE_USER">Delete User</option>
          </select>
          {(entity || action) && (
            <button onClick={() => { setEntity(''); setAction(''); setPage(1); }} className="text-sm text-brand-600 hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="card p-0">
        {isLoading ? <PageLoader /> : !logs.length ? (
          <EmptyState icon={ScrollText} title="No logs found" description="Activity logs will appear here as users interact with the system" />
        ) : (
          <>
            <Table>
              <thead className="border-b border-slate-100">
                <tr>
                  <Th>Timestamp</Th>
                  <Th>User</Th>
                  <Th>Action</Th>
                  <Th>Entity</Th>
                  <Th>Details</Th>
                  <Th>IP Address</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50/50">
                    <Td>
                      <p className="text-slate-700 text-xs whitespace-nowrap">
                        {format(new Date(log.createdAt), 'MMM d, yyyy')}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {format(new Date(log.createdAt), 'HH:mm:ss')}
                      </p>
                    </Td>
                    <Td>
                      {log.user ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700">{log.user.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{log.user.role}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">System</span>
                      )}
                    </Td>
                    <Td>
                      <span className={ACTION_COLORS[log.action] || 'badge-gray'}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-slate-600 text-sm">{log.entity}</span>
                    </Td>
                    <Td>
                      {log.details ? (
                        <div className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-lg max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </Td>
                    <Td>
                      <span className="text-xs text-slate-400 font-mono">{log.ipAddress || '—'}</span>
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
