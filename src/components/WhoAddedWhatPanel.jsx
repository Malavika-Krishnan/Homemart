import React from 'react';
import { useApp } from '../context/AppContext';
import { PieChart } from 'lucide-react';

export const WhoAddedWhatPanel = () => {
  const { groceryItems, familySpace, activeFilterMember, setActiveFilterMember } = useApp();

  const total = groceryItems.length;
  const stats = familySpace.members.map(m => {
    const items = groceryItems.filter(i => i.addedBy.id === m.id);
    return {
      member: m,
      count: items.length,
      spend: items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0),
      pct: total > 0 ? Math.round((items.length / total) * 100) : 0,
    };
  }).filter(s => s.count > 0);

  if (stats.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <PieChart size={14} color="var(--ink-muted)" />
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
          Who added what
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
        {stats.map(s => {
          const active = activeFilterMember === s.member.id;
          return (
            <button
              key={s.member.id}
              onClick={() => setActiveFilterMember(active ? 'all' : s.member.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '0.85rem 1rem',
                background: active ? 'var(--ink)' : 'var(--white)',
                border: `1px solid ${active ? 'var(--ink)' : 'var(--cream-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                minWidth: '130px',
                textAlign: 'left',
                transition: 'all 150ms ease',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={s.member.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: active ? 'var(--white)' : 'var(--ink)' }}>
                  {s.member.name.split(' ')[0]}
                </span>
              </div>

              <div className="progress-track" style={{ background: active ? 'rgba(255,255,255,0.2)' : 'var(--cream-dark)' }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: active ? '#FFFFFF' : 'var(--sage)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', color: active ? 'rgba(255,255,255,0.7)' : 'var(--ink-light)' }}>
                  {s.count} {s.count === 1 ? 'item' : 'items'}
                </span>
                <span style={{ fontSize: '0.72rem', color: active ? 'rgba(255,255,255,0.8)' : 'var(--sage-dark)', fontWeight: 500 }}>
                  ₹{s.spend.toFixed(0)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
