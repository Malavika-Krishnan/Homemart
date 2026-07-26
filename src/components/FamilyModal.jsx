import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, Shield, UserX, UserPlus } from 'lucide-react';

export const FamilyModal = ({ isOpen, onClose }) => {
  const { currentUser, familySpace, showToast } = useApp();
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  const handleCopy = () => {
    navigator.clipboard.writeText(familySpace.code);
    setCopied(true);
    showToast('Invite code copied');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    showToast(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel anim-scale-in" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Family space</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm"><X size={16} /></button>
        </div>

        {/* Invite code */}
        <div style={{
          background: 'var(--cream)',
          border: '1px solid var(--cream-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Invite code</p>
            <p style={{ fontSize: '1.2rem', fontFamily: 'DM Serif Display, serif', letterSpacing: '0.06em', color: 'var(--ink)' }}>{familySpace.code}</p>
          </div>
          <button onClick={handleCopy} className="btn btn-ghost btn-sm">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Email invite (admin only) */}
        {isAdmin && (
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="email" className="input" style={{ flex: 1 }}
              placeholder="Invite by email…"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <UserPlus size={14} /> Invite
            </button>
          </form>
        )}

        <hr className="divider" style={{ margin: '0 0 1rem' }} />

        {/* Members list */}
        <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Members ({familySpace.members.length})
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {familySpace.members.map(m => {
            const isSelf = m.id === currentUser?.id;
            const mAdmin = m.role === 'admin';
            return (
              <div key={m.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                background: isSelf ? 'var(--cream)' : 'var(--white)',
                border: '1px solid var(--cream-border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <img src={m.avatar} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {m.name}
                    {isSelf && <span style={{ fontSize: '0.7rem', color: 'var(--ink-muted)' }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{m.email}</div>
                </div>
                {mAdmin
                  ? <span className="tag tag-gold" style={{ fontSize: '0.68rem' }}><Shield size={9} /> admin</span>
                  : <span className="tag tag-muted" style={{ fontSize: '0.68rem' }}>member</span>}
                {isAdmin && !mAdmin && (
                  <button onClick={() => showToast(`Simulated removing ${m.name}`)} className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--ink-light)' }} title="Remove member">
                    <UserX size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
