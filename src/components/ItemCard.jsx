import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Edit2, Trash2, AlertCircle } from 'lucide-react';

export const ItemCard = ({ item, onEdit }) => {
  const { currentUser, togglePurchased, deleteItem } = useApp();

  const isMine = item.addedBy.id === currentUser?.id;
  const isAdmin = currentUser?.role === 'admin';
  const canModify = isAdmin || isMine;
  const done = item.purchased;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.85rem 1rem',
        background: done ? 'var(--cream)' : 'var(--white)',
        border: '1px solid var(--cream-border)',
        borderRadius: 'var(--radius-md)',
        transition: 'all 150ms ease',
        opacity: done ? 0.7 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => togglePurchased(item.id)}
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '6px',
          border: done ? 'none' : '1.5px solid var(--cream-border)',
          background: done ? 'var(--sage)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 200ms var(--ease-bounce)',
        }}
        aria-label={done ? 'Mark as needed' : 'Mark as purchased'}
      >
        {done && <Check size={13} color="white" strokeWidth={3} />}
      </button>

      {/* Thumbnail */}
      <img
        src={item.image}
        alt={item.name}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-sm)',
          objectFit: 'cover',
          flexShrink: 0,
          filter: done ? 'grayscale(40%)' : 'none',
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: done ? 'var(--ink-muted)' : 'var(--ink)',
            textDecoration: done ? 'line-through' : 'none',
          }}>
            {item.name}
          </span>
          {item.priority === 'high' && !done && (
            <span className="tag tag-red" style={{ fontSize: '0.68rem' }}>
              <AlertCircle size={9} /> must have
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
            {item.quantity} {item.unit}
          </span>
          {item.price > 0 && (
            <>
              <span style={{ color: 'var(--cream-border)' }}>·</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--sage-dark)', fontWeight: 500 }}>
                ₹{(item.price * item.quantity).toFixed(0)}
              </span>
            </>
          )}
          <span style={{ color: 'var(--cream-border)' }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src={item.addedBy.avatar} alt="" style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-light)' }}>
              {item.addedBy.name.split(' ')[0]}
              {isMine && <span style={{ color: 'var(--sage)' }}> (you)</span>}
            </span>
          </div>
          {item.notes && (
            <>
              <span style={{ color: 'var(--cream-border)' }}>·</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--ink-light)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                {item.notes}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      {canModify && (
        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
          <button
            onClick={() => onEdit(item)}
            className="btn btn-ghost btn-icon btn-sm"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => deleteItem(item.id)}
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'transparent',
              color: 'var(--ink-light)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              display: 'flex',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red-soft)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-light)'; }}
            title="Remove"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
