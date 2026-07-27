import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowLeft, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShoppingModeModal = ({ isOpen, onClose }) => {
  const { groceryItems, togglePurchased, completeShoppingTrip } = useApp();
  if (!isOpen) return null;

  const needed = groceryItems.filter(i => !i.purchased);
  const done = groceryItems.filter(i => i.purchased);
  const total = groceryItems.length;
  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
  const cartTotal = done.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);

  const handleFinish = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#6B8F71', '#C9972A', '#FAF8F5'] });
    completeShoppingTrip('Weekly grocery run');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--cream)', zIndex: 200, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--cream-border)', padding: '1rem 1.5rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm"><ArrowLeft size={16} /></button>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Shopping mode</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink)' }}>{needed.length} items remaining</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>Cart: <strong style={{ color: 'var(--sage-dark)' }}>₹{cartTotal.toFixed(0)}</strong></span>
            <button
              onClick={handleFinish}
              disabled={done.length === 0}
              className="btn btn-sage btn-sm"
              style={{ opacity: done.length === 0 ? 0.4 : 1 }}
            >
              <Check size={14} /> Finish ({done.length})
            </button>
          </div>
        </div>

        {/* Progress */}
        <div style={{ maxWidth: '720px', margin: '0.75rem auto 0' }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--sage)' }} />
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--ink-light)', marginTop: '0.25rem', textAlign: 'right' }}>{pct}% complete</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%', padding: '1.5rem' }}>
        {needed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-border)', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={32} color="var(--sage)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.15rem', color: 'var(--ink)' }}>All items picked up!</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginTop: '0.25rem' }}>Tap Finish to complete your trip.</p>
          </div>
        )}

        {needed.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>To pick up</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {needed.map(item => (
                <div
                  key={item.id}
                  onClick={() => togglePurchased(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.1rem',
                    background: 'var(--white)',
                    border: '1px solid var(--cream-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
                >
                  <div style={{ width: '26px', height: '26px', border: '1.5px solid var(--cream-border)', borderRadius: '8px', flexShrink: 0 }} />
                  <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--ink)' }}>{item.name}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>{item.quantity} {item.unit} · added by {item.addedBy.name.split(' ')[0]}</p>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--sage-dark)', fontWeight: 500 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {done.length > 0 && (
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>In cart</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {done.map(item => (
                <div
                  key={item.id}
                  onClick={() => togglePurchased(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.75rem 1.1rem',
                    background: 'var(--sage-light)',
                    border: '1px solid #C8DBC9',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    opacity: 0.75,
                  }}
                >
                  <div style={{ width: '26px', height: '26px', background: 'var(--sage)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={13} color="white" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.88rem', color: 'var(--sage-dark)', textDecoration: 'line-through', flex: 1 }}>{item.name} ({item.quantity} {item.unit})</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--sage)' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
