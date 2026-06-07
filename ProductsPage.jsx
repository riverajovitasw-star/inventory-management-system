import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit2, Trash2, Package, Filter, ChevronDown } from 'lucide-react';
import { Table, Th, Td, Pagination } from '../components/common/Table';
import Modal from '../components/common/Modal';
import { PageLoader, EmptyState } from '../components/common/UI';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', sku: '', category: '', description: '', unit: 'pcs',
  costPrice: '', sellingPrice: '', currentStock: '', minStockLevel: 10,
  maxStockLevel: 1000, supplier: '', location: ''
};

function ProductForm({ form, setForm, onSubmit, loading, isEdit }) {
  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: () => productsAPI.getCategories().then(r => r.data.data) });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Product Name *</label>
          <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Wireless Mouse" />
        </div>
        <div>
          <label className="label">SKU *</label>
          <input className="input" required value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value.toUpperCase() }))} placeholder="e.g. MOU-001" />
        </div>
        <div>
          <label className="label">Category *</label>
          <input className="input" required list="categories-list" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Electronics" />
          <datalist id="categories-list">{(catData || []).map(c => <option key={c} value={c} />)}</datalist>
        </div>
        <div>
          <label className="label">Cost Price *</label>
          <input className="input" type="number" min="0" step="0.01" required value={form.costPrice} onChange={e => setForm(f => ({ ...f, costPrice: e.target.value }))} placeholder="0.00" />
        </div>
        <div>
          <label className="label">Selling Price *</label>
          <input className="input" type="number" min="0" step="0.01" required value={form.sellingPrice} onChange={e => setForm(f => ({ ...f, sellingPrice: e.target.value }))} placeholder="0.00" />
        </div>
        {!isEdit && (
          <div>
            <label className="label">Initial Stock</label>
            <input className="input" type="number" min="0" value={form.currentStock} onChange={e => setForm(f => ({ ...f, currentStock: e.target.value }))} placeholder="0" />
          </div>
        )}
        <div>
          <label className="label">Unit</label>
          <input className="input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="pcs, kg, ltr..." />
        </div>
        <div>
          <label className="label">Min Stock Level</label>
          <input className="input" type="number" min="0" value={form.minStockLevel} onChange={e => setForm(f => ({ ...f, minStockLevel: e.target.value }))} />
        </div>
        <div>
          <label className="label">Supplier</label>
          <input className="input" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Supplier name" />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Warehouse location" />
        </div>
        <div className="col-span-2">
          <label className="label">Description</label>
          <textarea className="input resize-none" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description..." />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, category, statusFilter, page],
    queryFn: () => productsAPI.getAll({ search, category, status: statusFilter, page, limit: 15 }).then(r => r.data),
    keepPreviousData: true
  });

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: () => productsAPI.getCategories().then(r => r.data.data) });

  const createMutation = useMutation({
    mutationFn: (d) => productsAPI.create(d),
    onSuccess: () => { qc.invalidateQueries(['products']); setShowCreateModal(false); setForm(EMPTY_FORM); toast.success('Product created'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create product')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['products']); setEditProduct(null); toast.success('Product updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update product')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productsAPI.delete(id),
    onSuccess: () => { qc.invalidateQueries(['products']); setDeleteTarget(null); toast.success('Product deactivated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete product')
  });

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({ name: product.name, sku: product.sku, category: product.category, description: product.description || '', unit: product.unit, costPrice: product.costPrice, sellingPrice: product.sellingPrice, minStockLevel: product.minStockLevel, maxStockLevel: product.maxStockLevel, supplier: product.supplier || '', location: product.location || '' });
  };

  const stockStatusBadge = (product) => {
    const s = product.stockStatus;
    if (s === 'out_of_stock') return <span className="badge-red">Out of Stock</span>;
    if (s === 'low_stock') return <span className="badge-yellow">Low Stock</span>;
    return <span className="badge-green">In Stock</span>;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data?.pagination?.total ?? 0} total products</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setForm(EMPTY_FORM); setShowCreateModal(true); }} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input pl-9" placeholder="Search products, SKU..." />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">All Categories</option>
            {(catData || []).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">All Status</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0">
        {isLoading ? <PageLoader /> : !data?.data?.length ? (
          <EmptyState icon={Package} title="No products found" description="Try adjusting your filters or add a new product" />
        ) : (
          <>
            <Table>
              <thead className="border-b border-slate-100">
                <tr>
                  <Th>Product</Th><Th>SKU</Th><Th>Category</Th>
                  <Th>Stock</Th><Th>Status</Th><Th>Cost</Th><Th>Price</Th>
                  {isAdmin && <Th>Actions</Th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.data.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <Td>
                      <div>
                        <p className="font-medium text-slate-800">{p.name}</p>
                        {p.supplier && <p className="text-xs text-slate-400">{p.supplier}</p>}
                      </div>
                    </Td>
                    <Td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{p.sku}</span></Td>
                    <Td><span className="text-slate-600">{p.category}</span></Td>
                    <Td>
                      <span className={`font-semibold ${p.currentStock === 0 ? 'text-red-500' : p.currentStock <= p.minStockLevel ? 'text-amber-600' : 'text-slate-800'}`}>
                        {p.currentStock}
                      </span>
                      <span className="text-slate-400 text-xs ml-1">{p.unit}</span>
                    </Td>
                    <Td>{stockStatusBadge(p)}</Td>
                    <Td className="text-slate-600">${p.costPrice.toFixed(2)}</Td>
                    <Td className="font-medium text-slate-800">${p.sellingPrice.toFixed(2)}</Td>
                    {isAdmin && (
                      <Td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteTarget(p)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </Td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="px-6 pb-4 pt-2">
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Product" size="lg">
        <ProductForm form={form} setForm={setForm} isEdit={false} loading={createMutation.isPending}
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Edit Product" size="lg">
        <ProductForm form={form} setForm={setForm} isEdit={true} loading={updateMutation.isPending}
          onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: editProduct._id, data: form }); }} />
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Deactivate Product" size="sm">
        <p className="text-slate-600 mb-4">Are you sure you want to deactivate <strong>{deleteTarget?.name}</strong>? This will hide it from the active inventory.</p>
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
