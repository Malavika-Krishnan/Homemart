import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Users, History, ShoppingCart, Plus, Share2, LogOut, Check, Menu, X } from 'lucide-react';

export const Header = ({ onOpenFamilyModal, onOpenAddModal, onOpenHistoryModal, onOpenProfileModal }) => {
  const { currentUser, familySpace, groceryItems, setIsShoppingMode, logout, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = groceryItems.filter(i => !i.purchased).length;

  const handleShare = () => {
    const link = `${window.location.origin}/?join=${familySpace.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    showToast('Invite link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--cream-border)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'var(--ink)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingBag size={16} color="var(--cream)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem', color: 'var(--ink)' }}>
              HomeMart
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: '1px' }}>
              {familySpace.name}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button onClick={handleShare} className="btn btn-ghost btn-sm" title="Copy shareable invite link">
            {copied ? <Check size={14} color="var(--sage)" /> : <Share2 size={14} />}
            {copied ? 'Copied' : 'Share invite'}
          </button>

          <button onClick={onOpenFamilyModal} className="btn btn-ghost btn-sm">
            <Users size={14} />
            Members ({familySpace.members.length})
          </button>

          <button onClick={onOpenHistoryModal} className="btn btn-ghost btn-sm">
            <History size={14} />
            History
          </button>

          <button onClick={onOpenAddModal} className="btn btn-primary btn-sm">
            <Plus size={14} />
            Add item
          </button>

          {currentUser?.role === 'admin' && (
            <button onClick={() => setIsShoppingMode(true)} className="btn btn-sage btn-sm">
              <ShoppingCart size={14} />
              Shop · {pendingCount}
            </button>
          )}

          {/* User profile avatar pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
            <button
              onClick={onOpenProfileModal}
              title="Edit Profile"
              style={{
                padding: 0, border: '2px solid var(--cream-border)',
                borderRadius: '50%', cursor: 'pointer', background: 'none',
                transition: 'all 150ms ease', display: 'flex', alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--sage)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--cream-border)'}
            >
              <img src={currentUser?.avatar} alt={currentUser?.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            </button>
            <button onClick={logout} className="btn btn-ghost btn-icon btn-sm" title="Log out">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={onOpenAddModal} className="btn btn-primary btn-sm">
            <Plus size={14} />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-ghost btn-icon btn-sm">
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="hide-desktop" style={{
          background: 'var(--white)',
          borderTop: '1px solid var(--cream-border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <button onClick={() => { handleShare(); setMobileMenuOpen(false); }} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <Share2 size={14} /> Share invite
          </button>
          <button onClick={() => { onOpenFamilyModal(); setMobileMenuOpen(false); }} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <Users size={14} /> Members
          </button>
          <button onClick={() => { onOpenHistoryModal(); setMobileMenuOpen(false); }} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <History size={14} /> History
          </button>
          {currentUser?.role === 'admin' && (
            <button onClick={() => { setIsShoppingMode(true); setMobileMenuOpen(false); }} className="btn btn-sage" style={{ justifyContent: 'flex-start' }}>
              <ShoppingCart size={14} /> Shopping mode · {pendingCount} items
            </button>
          )}
          <hr className="divider" />
          <button onClick={logout} className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--ink-muted)' }}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </header>
  );
};
