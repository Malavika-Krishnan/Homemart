import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, RefreshCw, ShoppingBag } from 'lucide-react';

export const ShoppingHistoryModal = ({ isOpen, onClose }) => {
  const { shoppingHistory, readdHistoryItems } = useApp();
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel anim-scale-in" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem', maxWidth: '580px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Shopping history</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm"><X size={16} /></button>
        </div>

        {shoppingHistory.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', border: '1px dashed var(--cream-border)', borderRadius: 'var(--radius-md)' }}>
            <ShoppingBag size={24} color="var(--ink-light)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>No shopping trips yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '65vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {shoppingHistory.map(trip => (
              <div key={trip.id} style={{
                border: '1px solid var(--cream-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}>
                {/* Trip header */}
                <div style={{
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  background: 'var(--white)',
                }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.2rem' }}>{trip.tripTitle}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={11} /> {trip.date} · {trip.shopper}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    <span className="tag tag-sage">₹{trip.totalSpent.toFixed(0)}</span>
                    <button onClick={() => readdHistoryItems(trip)} className="btn btn-ghost btn-sm">
                      <RefreshCw size={12} /> Re-order
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div style={{ background: 'var(--cream)', borderTop: '1px solid var(--cream-border)', padding: '0.65rem 1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {trip.items.map((it, i) => (
                      <span key={i} className="tag tag-muted" style={{ fontSize: '0.72rem' }}>
                        {it.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
