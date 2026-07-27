import React, { useState, useRef } from 'react';
import { useApp, CREDENTIAL_STORE } from '../context/AppContext';
import { ShoppingBag, Eye, EyeOff, ChevronDown, ChevronUp, AlertCircle, ArrowLeft, Camera, X } from 'lucide-react';

export const LoginPage = ({ initialJoinCode, onBack }) => {
  const { authenticateUser, createFamilySpace, joinFamilySpace } = useApp();

  // 'signin' | 'signup' | 'join'
  const [mode, setMode] = useState(initialJoinCode ? 'join' : 'signin');

  // Sign in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showCreds, setShowCreds] = useState(false);

  // Create account (admin/member)
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newShowPass, setNewShowPass] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [accountType, setAccountType] = useState('admin');
  const [joinCode, setJoinCode] = useState(initialJoinCode || '');
  const [signupError, setSignupError] = useState('');

  // Profile photo
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  const avatarInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSignupError('Photo must be under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarDataUrl(ev.target.result);
      setAvatarPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
    setAvatarDataUrl(null);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  // Join
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');

  const locked = attempts >= 5;

  const handleSignIn = (e) => {
    e.preventDefault();
    if (locked) return;
    setAuthError('');

    const error = authenticateUser(email.trim(), password);
    if (error) {
      setAttempts(prev => prev + 1);
      setAuthError(error);
      setPassword('');
    }
    // On success authenticateUser sets currentUser and the app redirects automatically
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setSignupError('');
    if (!newName.trim() || !newEmail.trim() || !newPass.trim()) return;

    if (accountType === 'admin') {
      if (!familyName.trim()) { setSignupError('Please enter a family space name.'); return; }
      createFamilySpace({ adminName: newName.trim(), adminEmail: newEmail.trim(), familyName: familyName.trim(), avatar: avatarDataUrl });
    } else {
      if (!joinCode.trim()) { setSignupError('Please enter an invite code.'); return; }
      joinFamilySpace({ code: joinCode.trim().toUpperCase(), memberName: newName.trim(), memberEmail: newEmail.trim(), avatar: avatarDataUrl });
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCode.trim() || !joinName.trim()) return;
    joinFamilySpace({ code: joinCode.trim().toUpperCase(), memberName: joinName.trim(), memberEmail: joinEmail.trim(), avatar: avatarDataUrl });
  };

  // Accounts shown in the hint (email + masked password)
  const credList = Object.entries(CREDENTIAL_STORE).map(([em, { password: pw }]) => ({
    email: em,
    maskedPass: pw,
    name: em.split('@')[0].charAt(0).toUpperCase() + em.split('@')[0].slice(1),
  }));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '44px', height: '44px',
            background: 'var(--ink)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.85rem',
          }}>
            <ShoppingBag size={20} color="var(--cream)" />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>HomeMart</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
            Family grocery, together.
          </p>
        </div>

        {/* Back to home */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink-muted)', fontSize: '0.8rem',
              fontFamily: 'DM Sans, sans-serif',
              padding: '0', marginBottom: '1.25rem',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
          >
            <ArrowLeft size={14} /> Back to home
          </button>
        )}

        {/* Mode tabs — only when not coming from invite link */}
        {!initialJoinCode && (
          <div style={{
            display: 'flex',
            background: 'var(--cream-dark)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px',
            marginBottom: '1.25rem',
            gap: '2px',
          }}>
            {[
              { id: 'signin', label: 'Sign in' },
              { id: 'signup', label: 'Create account' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setMode(t.id); setAuthError(''); setSignupError(''); setAttempts(0); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.83rem',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: mode === t.id ? 600 : 400,
                  background: mode === t.id ? 'var(--white)' : 'transparent',
                  color: mode === t.id ? 'var(--ink)' : 'var(--ink-muted)',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  boxShadow: mode === t.id ? 'var(--shadow-xs)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* ── SIGN IN ──────────────────────────────── */}
        {mode === 'signin' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.95rem', fontFamily: 'DM Serif Display, serif', marginBottom: '0.2rem' }}>
              Welcome back
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
              Sign in to your HomeMart account.
            </p>

            {locked && (
              <div style={{
                background: 'var(--red-light)', color: 'var(--red-soft)',
                border: '1px solid #F5C6C6', borderRadius: 'var(--radius-sm)',
                padding: '0.7rem 0.9rem', marginBottom: '1rem',
                fontSize: '0.82rem', display: 'flex', gap: '0.5rem', alignItems: 'center',
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                Too many failed attempts. Refresh the page to try again.
              </div>
            )}

            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label className="label">Email address</label>
                <input
                  type="email" className="input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setAuthError(''); }}
                  required autoFocus
                  disabled={locked}
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input"
                    style={{ paddingRight: '2.8rem' }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                    required
                    disabled={locked}
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-light)', display: 'flex', padding: '0.2rem' }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Attempt counter */}
              {attempts > 0 && !locked && (
                <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', textAlign: 'right', marginTop: '-0.4rem' }}>
                  {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining
                </p>
              )}

              {/* Error */}
              {authError && (
                <div style={{
                  background: 'var(--red-light)', color: 'var(--red-soft)',
                  border: '1px solid #F5C6C6', borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.85rem', fontSize: '0.8rem',
                  display: 'flex', gap: '0.5rem', alignItems: 'center',
                }}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} />
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={locked}
                style={{ width: '100%', padding: '0.72rem', marginTop: '0.1rem', opacity: locked ? 0.5 : 1 }}
              >
                Sign in
              </button>
            </form>

            {/* Collapsible credentials reference */}
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--cream-border)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowCreds(!showCreds)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Demo credentials
                </span>
                {showCreds ? <ChevronUp size={13} color="var(--ink-light)" /> : <ChevronDown size={13} color="var(--ink-light)" />}
              </button>

              {showCreds && (
                <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {credList.map(c => (
                    <button
                      key={c.email}
                      type="button"
                      onClick={() => { setEmail(c.email); setPassword(c.maskedPass); setAuthError(''); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 0.7rem',
                        background: 'var(--cream)',
                        border: '1px solid var(--cream-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 150ms ease',
                        width: '100%',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--cream-dark)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--cream)'}
                      title="Click to auto-fill credentials"
                    >
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '1px' }}>
                          {c.email}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                          {c.maskedPass}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--sage)', fontWeight: 500 }}>Fill →</span>
                    </button>
                  ))}
                  <p style={{ fontSize: '0.7rem', color: 'var(--ink-light)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    Click any row to auto-fill the form above.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CREATE ACCOUNT ──────────────────────── */}
        {mode === 'signup' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.95rem', fontFamily: 'DM Serif Display, serif', marginBottom: '0.2rem' }}>
              Create account
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>
              Set up your HomeMart profile.
            </p>

            {/* Account type */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.1rem' }}>
              {[
                { id: 'admin', label: '👑 Admin', desc: 'Create & manage family space' },
                { id: 'member', label: '👤 Member', desc: 'Join with an invite code' },
              ].map(t => (
                <button
                  key={t.id} type="button"
                  onClick={() => setAccountType(t.id)}
                  style={{
                    flex: 1, padding: '0.65rem 0.6rem',
                    border: accountType === t.id ? '1.5px solid var(--ink)' : '1px solid var(--cream-border)',
                    borderRadius: 'var(--radius-md)',
                    background: accountType === t.id ? 'var(--cream-dark)' : 'var(--white)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.15rem' }}>{t.label}</div>
                  <div style={{ fontSize: '0.69rem', color: 'var(--ink-muted)', lineHeight: 1.3 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              {/* ── Avatar uploader ── */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem', padding: '1rem', background: 'var(--cream)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-md)' }}>
                <div
                  style={{ position: 'relative', width: '76px', height: '76px', cursor: 'pointer' }}
                  onClick={() => avatarInputRef.current?.click()}
                  title="Upload profile photo"
                >
                  {/* Circle */}
                  <div style={{
                    width: '76px', height: '76px', borderRadius: '50%',
                    background: avatarPreview ? 'transparent' : 'var(--cream-dark)',
                    border: `2px dashed ${avatarPreview ? 'var(--sage)' : 'var(--cream-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    transition: 'border-color 200ms ease, transform 200ms ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.borderColor = 'var(--sage)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = avatarPreview ? 'var(--sage)' : 'var(--cream-border)'; }}
                  >
                    {avatarPreview
                      ? <img src={avatarPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Camera size={22} color="var(--ink-light)" />
                    }
                  </div>

                  {/* Camera badge */}
                  {!avatarPreview && (
                    <div style={{ position: 'absolute', bottom: '0', right: '0', width: '22px', height: '22px', background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--white)' }}>
                      <Camera size={10} color="white" />
                    </div>
                  )}

                  {/* Clear button */}
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearAvatar(); }}
                      style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', background: 'var(--ink)', borderRadius: '50%', border: '2px solid var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <X size={9} color="white" />
                    </button>
                  )}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.15rem' }}>
                    {avatarPreview ? 'Photo selected ✓' : 'Profile photo'}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--ink-muted)' }}>
                    {avatarPreview ? 'Click the × to remove' : 'Tap to upload (optional)'}
                  </p>
                </div>

                {/* Hidden file input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>

              <div>
                <label className="label">Full name</label>
                <input className="input" placeholder="Your full name" value={newName} onChange={e => setNewName(e.target.value)} required autoFocus />
              </div>
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" placeholder="you@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={newShowPass ? 'text' : 'password'} className="input"
                    style={{ paddingRight: '2.8rem' }}
                    placeholder="Create a strong password"
                    value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6}
                  />
                  <button type="button" onClick={() => setNewShowPass(!newShowPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-light)', display: 'flex', padding: '0.2rem' }}>
                    {newShowPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {accountType === 'admin' ? (
                <div>
                  <label className="label">Family space name</label>
                  <input className="input" placeholder="e.g. The Sharma Family Pantry" value={familyName} onChange={e => setFamilyName(e.target.value)} required />
                </div>
              ) : (
                <div>
                  <label className="label">Invite code</label>
                  <input
                    className="input" style={{ letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}
                    placeholder="HM-XXXX-0000"
                    value={joinCode} onChange={e => setJoinCode(e.target.value)} required
                  />
                </div>
              )}

              {signupError && (
                <div style={{ background: 'var(--red-light)', color: 'var(--red-soft)', border: '1px solid #F5C6C6', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.85rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={13} /> {signupError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.72rem', marginTop: '0.1rem' }}>
                {accountType === 'admin' ? 'Create family space' : 'Join family space'}
              </button>
            </form>
          </div>
        )}

        {/* ── JOIN via invite link ─────────────────── */}
        {mode === 'join' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.95rem', fontFamily: 'DM Serif Display, serif', marginBottom: '0.2rem' }}>
              You're invited!
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
              Enter your details to join the family space.
            </p>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="label">Invite code</label>
                <input
                  className="input" style={{ letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}
                  value={joinCode} onChange={e => setJoinCode(e.target.value)} required
                />
              </div>
              <div>
                <label className="label">Your full name</label>
                <input className="input" placeholder="Your name" value={joinName} onChange={e => setJoinName(e.target.value)} required autoFocus />
              </div>
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" placeholder="you@email.com" value={joinEmail} onChange={e => setJoinEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-sage" style={{ width: '100%', padding: '0.72rem', marginTop: '0.1rem' }}>
                Join family space
              </button>
            </form>
          </div>
        )}

        {/* Footer link */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--ink-light)', marginTop: '1.25rem' }}>
          {mode === 'signin'
            ? <>New admin? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--sage)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}>Create a family space</button></>
            : <>Already have an account? <button onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', color: 'var(--sage)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}>Sign in</button></>
          }
        </p>
      </div>
    </div>
  );
};
