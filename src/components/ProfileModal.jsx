import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Mail, Shield, Trash2, Save, Check } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
];

export const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, deleteProfile, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [title, setTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setAvatar(currentUser.avatar || AVATAR_OPTIONS[0]);
      setTitle(currentUser.title || '');
      setConfirmDelete(false);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), avatar, title: title.trim() });
    onClose();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteProfile();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel anim-scale-in" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem', maxWidth: '440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Edit User Profile</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm"><X size={16} /></button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Avatar selector */}
          <div>
            <label className="label">Profile Avatar</label>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <img src={avatar} alt="Current Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--sage)' }} />
              <div style={{ flex: 1, display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
                {AVATAR_OPTIONS.map((url, idx) => (
                  <button
                    key={idx} type="button" onClick={() => setAvatar(url)}
                    style={{
                      padding: 0, border: avatar === url ? '2px solid var(--ink)' : '2px solid transparent',
                      borderRadius: '50%', cursor: 'pointer', background: 'none', flexShrink: 0
                    }}
                  >
                    <img src={url} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="label">Full Name *</label>
            <input
              type="text" className="input" required
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="label">Email Address</label>
            <input
              type="email" className="input" readOnly disabled
              value={email} style={{ background: 'var(--cream-dark)', cursor: 'not-allowed', color: 'var(--ink-muted)' }}
            />
          </div>

          {/* Title / Role Badge */}
          <div>
            <label className="label">Title / Role</label>
            <input
              type="text" className="input"
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 👑 Family Admin"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', pt: '1rem', borderTop: '1px solid var(--cream-border)' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Save size={14} /> Save Profile
            </button>
            <button
              type="button" onClick={handleDelete}
              className="btn btn-ghost"
              style={{ color: confirmDelete ? 'var(--white)' : 'var(--red-soft)', borderColor: 'var(--red-soft)', background: confirmDelete ? 'var(--red-soft)' : 'transparent' }}
            >
              <Trash2 size={14} /> {confirmDelete ? 'Confirm Delete?' : 'Delete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
