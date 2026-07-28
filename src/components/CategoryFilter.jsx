import React from 'react';
import { useApp, CATEGORIES, USERS } from '../context/AppContext';
import { Search, X } from 'lucide-react';

export const CategoryFilter = ({ priorityFilter, setPriorityFilter }) => {
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, activeFilterMember, setActiveFilterMember, groceryItems } = useApp();

  const getCount = (catId) => catId === 'all' ? groceryItems.length : groceryItems.filter(i => i.category === catId).length;

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Search bar */}
      <div style={{ position: 'relative' }}>
        <Search size={15} color="var(--ink-light)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          className="input"
          style={{ paddingLeft: '2.4rem', paddingRight: searchQuery ? '2.4rem' : '1rem' }}
          placeholder="Search items or family members…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-light)', padding: '0.25rem', display: 'flex' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
        {/* Category pills */}
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                border: active ? '1px solid var(--ink)' : '1px solid var(--cream-border)',
                borderRadius: 'var(--radius-pill)',
                background: active ? 'var(--ink)' : 'var(--white)',
                color: active ? 'var(--white)' : 'var(--ink-secondary)',
                fontSize: '0.8rem',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: active ? 500 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{cat.icon}</span>
              {cat.name}
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({getCount(cat.id)})</span>
            </button>
          );
        })}

        <div style={{ width: '1px', height: '20px', background: 'var(--cream-border)', flexShrink: 0 }} />

        {/* Priority filter */}
        {[{ id: 'all', label: 'All' }, { id: 'high', label: '🚨 Must have' }].map(p => (
          <button
            key={p.id}
            onClick={() => setPriorityFilter(p.id)}
            style={{
              padding: '0.35rem 0.85rem',
              border: priorityFilter === p.id ? '1px solid var(--sage)' : '1px solid var(--cream-border)',
              borderRadius: 'var(--radius-pill)',
              background: priorityFilter === p.id ? 'var(--sage-light)' : 'var(--white)',
              color: priorityFilter === p.id ? 'var(--sage-dark)' : 'var(--ink-secondary)',
              fontSize: '0.8rem',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: priorityFilter === p.id ? 500 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            {p.label}
          </button>
        ))}

        <div style={{ width: '1px', height: '20px', background: 'var(--cream-border)', flexShrink: 0 }} />

        {/* Member filter */}
        {[{ id: 'all', name: 'Everyone' }, ...USERS].map(u => {
          const active = activeFilterMember === u.id;
          return (
            <button
              key={u.id}
              onClick={() => setActiveFilterMember(active ? 'all' : u.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0.75rem',
                border: active ? '1px solid var(--ink)' : '1px solid var(--cream-border)',
                borderRadius: 'var(--radius-pill)',
                background: active ? 'var(--cream-dark)' : 'var(--white)',
                color: active ? 'var(--ink)' : 'var(--ink-muted)',
                fontSize: '0.78rem',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: active ? 500 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease',
              }}
            >
              {u.avatar && <img src={u.avatar} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} />}
              {u.name.split(' ')[0] || u.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
