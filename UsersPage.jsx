import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Users, ShieldCheck, User } from 'lucide-react';
import { Table, Th, Td } from '../components/common/Table';
import Modal from '../components/common/Modal';
import { PageLoader, EmptyState } from '../components/common/UI';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'staff' };

function UserForm({ form, setForm, onSubmit, loading, isEdit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Full Name *</label>
        <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
      </div>
      <div>
        <label className="label">Email Address *</label>
        <input className="input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
      </div>
      {!isEdit && (
        <div>
          <label className="label">Password *</label>
          <input className="input" type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" />
        </div>
      )}
      <div>
        <label className="label">Role *</label>
        <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {isEdit && (
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isActive" checked={form.isActive !== false} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
          <label htmlFor="isActive" className="text-sm text-slate-700">Active account</label>
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
      </button>
    </form>
  );
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll().then(r => r.data.data)
  });

  const createMutation = useMutation({
    mutationFn: (d) => usersAPI.create(d),
    onSuccess: () => { qc.invalidateQueries(['users']); setShowCreate(false); setForm(EMPTY_FORM); toast.success('User created'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create user')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersAPI.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['users']); setEditUser(null); toast.success('User updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update user')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => usersAPI.delete(id),
    onSuccess: () => { qc.invalidateQueries(['users']); setDeleteTarget(null); toast.success('User deactivated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to deactivate user')
  });

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, role: u.role, isActive: u.isActive });
  };

  const users = data || [];
  const admins = users.filter(u => u.role === 'admin').length;
  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} total · {admins} admin · {activeCount} active</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setShowCreate(true); }} className="btn-primary">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="card p-0">
        {isLoading ? <PageLoader /> : !users.length ? (
          <EmptyState icon={Users} title="No users found" />
        ) : (
          <Table>
            <thead className="border-b border-slate-100">
              <tr>
                <Th>User</Th><Th>Email</Th><Th>Role</Th>
                <Th>Status</Th><Th>Last Login</Th><Th>Joined</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-50/50">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${u.role === 'admin' ? 'bg-brand-100' : 'bg-slate-100'}`}>
                        <span className={`text-xs font-bold ${u.role === 'admin' ? 'text-brand-700' : 'text-slate-600'}`}>
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{u.name}</p>
                        {u._id === currentUser._id && <span className="text-xs text-brand-500 font-medium">You</span>}
                      </div>
                    </div>
                  </Td>
                  <Td className="text-slate-600">{u.email}</Td>
                  <Td>
                    {u.role === 'admin'
                      ? <span className="badge-blue flex w-fit items-center gap-1"><ShieldCheck size={11} /> Admin</span>
                      : <span className="badge-gray flex w-fit items-center gap-1"><User size={11} /> Staff</span>}
                  </Td>
                  <Td>
                    {u.isActive
                      ? <span className="badge-green">Active</span>
                      : <span className="badge-red">Inactive</span>}
                  </Td>
                  <Td className="text-slate-500 text-xs">
                    {u.lastLogin ? format(new Date(u.lastLogin), 'MMM d, yyyy HH:mm') : 'Never'}
                  </Td>
                  <Td className="text-slate-500 text-xs">
                    {format(new Date(u.createdAt), 'MMM d, yyyy')}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      {u._id !== currentUser._id && (
                        <button onClick={() => setDeleteTarget(u)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New User" size="sm">
        <UserForm form={form} setForm={setForm} isEdit={false} loading={createMutation.isPending}
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} />
      </Modal>

      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User" size="sm">
        <UserForm form={form} setForm={setForm} isEdit={true} loading={updateMutation.isPending}
          onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: editUser._id, data: form }); }} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Deactivate User" size="sm">
        <p className="text-slate-600 mb-4">Deactivate <strong>{deleteTarget?.name}</strong>? They will no longer be able to log in.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => deleteMutation.mutate(deleteTarget._id)} disabled={deleteMutation.isPending} className="btn-danger flex-1 justify-center">
            {deleteMutation.isPending ? 'Deactivating...' : 'Deactivate'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
