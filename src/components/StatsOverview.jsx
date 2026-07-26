import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, CheckCircle2, DollarSign, Users, Plus, Zap } from 'lucide-react';

const PRESETS = [
  { name: 'Avocados', category: 'produce', icon: '🥑', qty: 3, unit: 'pcs', price: 60 },
  { name: 'Bread', category: 'bakery', icon: '🍞', qty: 1, unit: 'loaf', price: 45 },
  { name: 'Milk', category: 'dairy', icon: '🥛', qty: 2, unit: 'cartons', price: 55 },
  { name: 'Eggs', category: 'dairy', icon: '🥚', qty: 1, unit: 'carton', price: 80 },
  { name: 'Honey', category: 'pantry', icon: '🍯', qty: 1, unit: 'jar', price: 120 },
  { name: 'Strawberries', category: 'produce', icon: '🍓', qty: 2, unit: 'punnets', price: 90 },
];

export const StatsOverview = () => {
  const { groceryItems, familySpace, addItem } = useApp();

  const total = groceryItems.length;
  const purchased = groceryItems.filter(i => i.purchased).length;
  const pending = total - purchased;
  const progress = total > 0 ? Math.round((purchased / total) * 100) : 0;
  const budget = groceryItems.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);

  const stats = [
    { label: 'Items needed', value: pending, sub: `${total} total`, icon: ShoppingCart },
    { label: 'Progress', value: `${progress}%`, sub: `${purchased} purchased`, progress: true },
    { label: 'Est. budget', value: `₹${budget.toFixed(0)}`, sub: 'across all items', icon: DollarSign },
    { label: 'Contributors', value: familySpace.members.length, sub: 'family members', icon: Users },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Stat Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1px',
        background: 'var(--cream-border)',
        border: '1px solid var(--cream-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '1.25rem',
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'var(--white)',
            padding: '1.25rem 1.5rem',
          }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>
              {stat.label}
            </p>

            {stat.progress ? (
              <>
                <p style={{ fontSize: '1.5rem', fontFamily: 'DM Serif Display, serif', color: 'var(--ink)', marginBottom: '0.5rem' }}>{stat.value}</p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-light)', marginTop: '0.35rem' }}>{stat.sub}</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.5rem', fontFamily: 'DM Serif Display, serif', color: 'var(--ink)', marginBottom: '0.1rem' }}>{stat.value}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-light)' }}>{stat.sub}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Quick Presets */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
        scrollbarWidth: 'none',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--ink-light)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Zap size={12} /> Quick add:
        </span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => addItem({ name: p.name, category: p.category, quantity: p.qty, unit: p.unit, priority: 'high', price: p.price, notes: '' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              background: 'var(--white)',
              border: '1px solid var(--cream-border)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              color: 'var(--ink-secondary)',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream-dark)'; e.currentTarget.style.borderColor = '#D0CAC1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--cream-border)'; }}
          >
            <span>{p.icon}</span>
            {p.name}
            <Plus size={11} strokeWidth={2.5} color="var(--sage)" />
          </button>
        ))}
      </div>
    </div>
  );
};
