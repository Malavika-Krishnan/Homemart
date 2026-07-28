import React from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from './ItemCard';
import { Plus, CheckCircle2, ShoppingBag } from 'lucide-react';

export const GroceryList = ({ priorityFilter, onEditItem, onOpenAddModal }) => {
  const { groceryItems, activeCategory, searchQuery, activeFilterMember } = useApp();

  const filtered = groceryItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.addedBy.name.toLowerCase().includes(q) && !(item.notes || '').toLowerCase().includes(q)) return false;
    }
    if (activeFilterMember !== 'all' && item.addedBy.id !== activeFilterMember) return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    return true;
  });

  const needed = filtered.filter(i => !i.purchased);
  const done = filtered.filter(i => i.purchased);

  if (filtered.length === 0) {
    return (
      <div style={{
        border: '1px dashed var(--cream-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
      }}>
        <ShoppingBag size={28} color="var(--ink-light)" style={{ margin: '0 auto 0.75rem' }} />
        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.3rem' }}>
          {searchQuery ? 'No matching items' : 'Your list is empty'}
        </p>
        <p style={{ fontSize: '0.83rem', color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>
          {searchQuery ? `Try adjusting your search or filters` : 'Start adding groceries your family needs'}
        </p>
        <button onClick={onOpenAddModal} className="btn btn-primary btn-sm">
          <Plus size={14} /> Add first item
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Needed */}
      {needed.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--ink-secondary)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              To buy · {needed.length}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {needed.map(item => (
              <div key={item.id} className="anim-fade-up">
                <ItemCard item={item} onEdit={onEditItem} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Purchased */}
      {done.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={15} color="var(--sage)" />
            <h3 style={{ fontSize: '0.95rem', color: 'var(--ink-secondary)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              In cart · {done.length}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {done.map(item => (
              <div key={item.id}>
                <ItemCard item={item} onEdit={onEditItem} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
