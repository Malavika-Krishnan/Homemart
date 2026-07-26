import React, { useState, useEffect } from 'react';
import { useApp, CATEGORIES } from '../context/AppContext';
import { X } from 'lucide-react';

const THUMBS = [
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=80&q=80',
];

export const AddItemModal = ({ isOpen, onClose, editItem }) => {
  const { currentUser, addItem, updateItem } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('produce');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [priority, setPriority] = useState('high');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(THUMBS[0]);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name); setCategory(editItem.category || 'produce');
      setQuantity(editItem.quantity || 1); setUnit(editItem.unit || 'pcs');
      setPriority(editItem.priority || 'high'); setPrice(editItem.price || '');
      setNotes(editItem.notes || ''); setImage(editItem.image || THUMBS[0]);
    } else {
      setName(''); setCategory('produce'); setQuantity(1); setUnit('pcs');
      setPriority('high'); setPrice(''); setNotes(''); setImage(THUMBS[0]);
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const data = { name: name.trim(), category, quantity: Number(quantity), unit, priority, price: Number(price) || 0, notes: notes.trim(), image };
    editItem ? updateItem({ ...editItem, ...data }) : addItem(data);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel anim-scale-in" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>{editItem ? 'Edit item' : 'Add grocery item'}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: '2px' }}>
              Adding as <strong>{currentUser?.name}</strong>
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* Name */}
          <div>
            <label className="label">Item name *</label>
            <input className="input" placeholder="e.g. Organic Avocados" value={name} onChange={e => setName(e.target.value)} required autoFocus />
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button
                  type="button" key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '0.3rem 0.7rem',
                    borderRadius: 'var(--radius-pill)',
                    border: category === cat.id ? '1px solid var(--ink)' : '1px solid var(--cream-border)',
                    background: category === cat.id ? 'var(--ink)' : 'var(--white)',
                    color: category === cat.id ? 'var(--white)' : 'var(--ink-secondary)',
                    fontSize: '0.78rem',
                    fontFamily: 'DM Sans, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  {cat.icon} {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Qty / Unit / Price row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            <div>
              <label className="label">Qty</label>
              <input type="number" min="1" className="input" value={quantity} onChange={e => setQuantity(e.target.value)} required />
            </div>
            <div>
              <label className="label">Unit</label>
              <select className="input" value={unit} onChange={e => setUnit(e.target.value)}>
                {['pcs', 'carton', 'loaf', 'jar', 'bottle', 'pack', 'kg', 'punnet'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Est. price (₹)</label>
              <input type="number" step="1" min="0" className="input" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="label">Priority</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[{ id: 'high', label: '🚨 Must have' }, { id: 'optional', label: '💡 Optional' }].map(p => (
                <button
                  type="button" key={p.id}
                  onClick={() => setPriority(p.id)}
                  style={{
                    flex: 1, padding: '0.45rem',
                    border: priority === p.id ? '1px solid var(--ink)' : '1px solid var(--cream-border)',
                    borderRadius: 'var(--radius-md)',
                    background: priority === p.id ? 'var(--cream-dark)' : 'var(--white)',
                    color: priority === p.id ? 'var(--ink)' : 'var(--ink-muted)',
                    fontSize: '0.82rem',
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: priority === p.id ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image picker */}
          <div>
            <label className="label">Product image</label>
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
              {THUMBS.map((t, i) => (
                <img key={i} src={t} alt="" onClick={() => setImage(t)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer', flexShrink: 0,
                    border: image === t ? '2px solid var(--ink)' : '1px solid var(--cream-border)',
                    opacity: image === t ? 1 : 0.55,
                    transition: 'all 150ms ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes (optional)</label>
            <input className="input" placeholder="Brand, size, or any preferences…" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', marginTop: '0.25rem' }}>
            {editItem ? 'Save changes' : 'Add to list'}
          </button>
        </form>
      </div>
    </div>
  );
};
