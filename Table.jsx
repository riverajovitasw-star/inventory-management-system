import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = '' }) {
  return <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${className}`}>{children}</th>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-slate-700 ${className}`}>{children}</td>;
}

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">Showing {start}–{end} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="btn btn-secondary p-2 disabled:opacity-40">
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(5, pages) }, (_, i) => {
          let p;
          if (pages <= 5) p = i + 1;
          else if (page <= 3) p = i + 1;
          else if (page >= pages - 2) p = pages - 4 + i;
          else p = page - 2 + i;
          return (
            <button key={p} onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {p}
            </button>
          );
        })}
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages} className="btn btn-secondary p-2 disabled:opacity-40">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
