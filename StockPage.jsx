import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, stockAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowDown, ArrowUp, Settings2, Search, Package } from 'lucide-react';
import Modal from '../components/common/Modal';
import { Table, Th, Td } from '../components/common/Table';
import { PageLoader, EmptyState } from '../components/common/UI';
import toast from 'react-hot-toast';

function StockForm({ type, products, onSubmit, loading }) {
  const [form, setForm] = useState({ productId: '', quantity: '', unitPrice: '', reference: '', notes: '', reason: '', newQuantity: '' });
  const selectedProduct = products?.find(p => p._id === form.productId);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedProduct && (
        <div className="p-3 bg-slate-50 rounded-xl text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Current Stock:</span>
            <span className="font-semibold">{selectedProduct.currentStock} {selectedProduct.unit}</span>
          </div>
          {type !== 'adjust' && (
            <div className="flex justify-between mt-1">
              <span className="text-slate-500">Min Level:</span>
              <span className="font-medium">{selectedProduct.minStockLevel}</span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="label">Product *</label>
        <select className="input" required value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}>
          <option value="">Select a product...</option>
          {(products || []).map(p => <option key={p._id} value={p._id}>{p.name} (SKU: {p.sku}) — Stock: {p.currentStock}</option>)}
        </select>
      </div>

      {type === 'adjust' ? (
        <div>
          <label className="label">New Quantity *</label>
          <input className="input" type="number" min="0" required value={form.newQuantity}
            onChange={e => setForm(f => ({ ...f, newQuantity: e.target.value }))} placeholder="Enter new stock quantity" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantity *</label>
              <input className="input" type="number" min="1" required value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="label">Unit Price</label>
              <input className="input" type="number" min="0" step="0.01" value={form.unitPrice}
                onChange={e => setForm(f => ({ ...f, unitPrice: e.target.value }))} placeholder="Auto from product" />
            </div>
          </div>
          <div>
            <label className="label">Reference / PO Number</label>
            <input className="input" value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="e.g. PO-2024-001" />
          </div>
          {type === 'out' && (
            <div>
              <label className="label">Reason</label>
              <select className="input" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}>
                <option value="">Select reason...</option>
                <option value="sale">Sale</option>
                <option value="damage">Damage/Loss</option>
                <option value="transfer">Transfer</option>
                <option value="return">Return</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
        </>
      )}

      <div>
        <label className="label">Notes</label>
        <textarea className="input resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
      </div>

      <button type="submit" disabled={loading} className={`w-full justify-center ${type === 'in' ? 'btn-success' : type === 'out' ? 'btn-danger' : 'btn-primary'} btn`}>
        {loading ? 'Processing...' : type === 'in' ? 'Confirm Stock In' : type === 'out' ? 'Confirm Stock Out' : 'Apply Adjustment'}
      </button>
    </form>
  );
}

export default function StockPage() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // 'in' | 'out' | 'adjust'
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => productsAPI.getAll({ search, limit: 100, status: 'active' }).then(r => r.data)
  });

  const stockInMutation = useMutation({
    mutationFn: (d) => stockAPI.stockIn(d),
    onSuccess: () => { qc.invalidateQueries(['products']); setModal(null); toast.success('Stock added successfully'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Stock in failed')
  });

  const stockOutMutation = useMutation({
    mutationFn: (d) => stockAPI.stockOut(d),
    onSuccess: () => { qc.invalidateQueries(['products']); setModal(null); toast.success('Stock removed successfully'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Stock out failed')
  });

  const adjustMutation = useMutation({
    mutationFn: (d) => stockAPI.adjust(d),
    onSuccess: () => { qc.invalidateQueries(['products']); setModal(null); toast.success('Stock adjusted successfully'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Adjustment failed')
  });

  const handleStockIn = (form) => stockInMutation.mutate({ productId: form.productId, quantity: form.quantity, unitPrice: form.unitPrice || undefined, reference: form.reference, notes: form.notes });
  const handleStockOut = (form) => stockOutMutation.mutate({ productId: form.productId, quantity: form.quantity, unitPrice: form.unitPrice || undefined, reference: form.reference, reason: form.reason, notes: form.notes });
  const handleAdjust = (form) => adjustMutation.mutate({ productId: form.productId, newQuantity: form.newQuantity, notes: form.notes });

  const products = data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Stock Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage incoming and outgoing stock</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setModal('in')} className="btn-success">
            <ArrowDown size={16} /> Stock In
          </button>
          <button onClick={() => setModal('out')} className="btn-danger">
            <ArrowUp size={16} /> Stock Out
          </button>
          {isAdmin && (
            <button onClick={() => setModal('adjust')} className="btn-secondary">
              <Settings2 size={16} /> Adjust
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="card py-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" placeholder="Search products..." />
        </div>
      </div>

      {/* Stock overview table */}
      <div className="card p-0">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Current Stock Levels</h2>
        </div>
        {isLoading ? <PageLoader /> : !products.length ? (
          <EmptyState icon={Package} title="No products found" />
        ) : (
          <Table>
            <thead className="border-b border-slate-100">
              <tr>
                <Th>Product</Th><Th>SKU</Th><Th>Category</Th>
                <Th>Stock</Th><Th>Min Level</Th><Th>Status</Th><Th>Value</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(p => {
                const pct = p.maxStockLevel > 0 ? Math.min(100, (p.currentStock / p.maxStockLevel) * 100) : 0;
                const isLow = p.currentStock > 0 && p.currentStock <= p.minStockLevel;
                const isOut = p.currentStock === 0;
                return (
                  <tr key={p._id} className="hover:bg-slate-50/50">
                    <Td>
                      <div>
                        <p className="font-medium text-slate-800">{p.name}</p>
                        {p.location && <p className="text-xs text-slate-400">{p.location}</p>}
                      </div>
                    </Td>
                    <Td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{p.sku}</span></Td>
                    <Td className="text-slate-600">{p.category}</Td>
                    <Td>
                      <div>
                        <span className={`font-bold ${isOut ? 'text-red-500' : isLow ? 'text-amber-600' : 'text-slate-800'}`}>
                          {p.currentStock}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">{p.unit}</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5">
                          <div className={`h-full rounded-full transition-all ${isOut ? 'bg-red-400' : isLow ? 'bg-amber-400' : 'bg-emerald-400'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Td>
                    <Td className="text-slate-500">{p.minStockLevel}</Td>
                    <Td>
                      {isOut ? <span className="badge-red">Out of Stock</span> :
                       isLow ? <span className="badge-yellow">Low Stock</span> :
                       <span className="badge-green">In Stock</span>}
                    </Td>
                    <Td className="font-medium text-slate-700">${(p.currentStock * p.costPrice).toFixed(2)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>

      <Modal isOpen={modal === 'in'} onClose={() => setModal(null)} title="Stock In" size="md">
        <StockForm type="in" products={products} onSubmit={handleStockIn} loading={stockInMutation.isPending} />
      </Modal>
      <Modal isOpen={modal === 'out'} onClose={() => setModal(null)} title="Stock Out" size="md">
        <StockForm type="out" products={products} onSubmit={handleStockOut} loading={stockOutMutation.isPending} />
      </Modal>
      <Modal isOpen={modal === 'adjust'} onClose={() => setModal(null)} title="Adjust Stock" size="md">
        <StockForm type="adjust" products={products} onSubmit={handleAdjust} loading={adjustMutation.isPending} />
      </Modal>
    </div>
  );
}
