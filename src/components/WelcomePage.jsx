import React, { useEffect, useRef, useState } from 'react';
import { ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';

// ─── Scroll reveal hook ────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, []);
}

// ─── Mouse spotlight hook ──────────────────────────────────────────────────
function useSpotlight(sectionRef) {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [sectionRef]);
  return pos;
}

// ─── Data ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🛒', title: 'One shared list', desc: 'Everyone adds to the same list. No more duplicate texts or forgotten items.' },
  { icon: '👑', title: 'Admin controls',   desc: 'The family admin manages members, invites, and handles the shopping trip.' },
  { icon: '🔒', title: 'Private accounts', desc: 'Each member has their own login. Only you can see and edit your profile.' },
  { icon: '📊', title: 'Track contributions', desc: "See who added what and how much each person's items cost in ₹." },
  { icon: '🛍️', title: 'Shopping mode',   desc: 'A distraction-free checklist view for the admin on shopping day.' },
  { icon: '📜', title: 'History & re-order', desc: 'Every trip is saved. Re-add last month\'s items with a single tap.' },
];

const STEPS = [
  { num: '01', title: 'Admin creates a family space', desc: 'Sign up as admin, set a family name, and get a unique invite code.' },
  { num: '02', title: 'Members join with invite code', desc: 'Each member joins using the invite link or code shared by admin.' },
  { num: '03', title: 'Everyone adds their groceries',  desc: 'Throughout the week, anyone adds items they need to the shared list.' },
  { num: '04', title: 'Admin shops, everyone sees',     desc: 'On shopping day the admin checks off items and marks the trip complete.' },
];

const TICKER_ITEMS = [
  '🥑 Avocados', '🍞 Bread', '🥛 Amul Milk', '🥚 Desi Eggs', '🍅 Tomatoes',
  '🍯 Honey', '🧅 Onions', '🍋 Lemons', '🫚 Mustard Oil', '🥦 Broccoli',
  '🍇 Grapes', '🧈 Butter', '🍚 Basmati Rice', '🧄 Garlic', '🍓 Strawberries',
  '🫙 Pickle', '🥜 Peanuts', '🍌 Bananas', '🥕 Carrots', '🧃 Juice',
];

const FLOATING = [
  { e: '🥑', t: '12%', l: '5%',   cls: 'float-slow',   sz: '2.2rem', d: '0s' },
  { e: '🍎', t: '7%',  r: '7%',   cls: 'float-medium', sz: '2.4rem', d: '0.8s' },
  { e: '🥛', t: '70%', l: '3%',   cls: 'float-fast',   sz: '2rem',   d: '0.3s' },
  { e: '🍯', t: '74%', r: '4%',   cls: 'float-slow',   sz: '2.1rem', d: '1.1s' },
  { e: '🍞', t: '36%', l: '2%',   cls: 'float-medium', sz: '1.8rem', d: '0.6s' },
  { e: '🥦', t: '44%', r: '3%',   cls: 'float-fast',   sz: '1.9rem', d: '1.4s' },
  { e: '🍓', t: '57%', l: '8%',   cls: 'float-slow',   sz: '1.7rem', d: '0.2s' },
  { e: '🧄', t: '23%', r: '2%',   cls: 'float-medium', sz: '1.8rem', d: '0.9s' },
  { e: '🍌', t: '50%', l: '12%',  cls: 'float-fast',   sz: '1.6rem', d: '1.6s' },
  { e: '🥕', t: '18%', r: '11%',  cls: 'float-slow',   sz: '1.7rem', d: '0.5s' },
];

const Ticker = () => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow: 'hidden', background: 'var(--ink)', padding: '0.75rem 0', position: 'relative' }}>
      <div style={{
        display: 'flex', gap: '2.5rem', width: 'max-content',
        animation: 'tickerScroll 28s linear infinite',
      }}>
        {items.map((item, i) => (
          <span key={i} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', fontWeight: 400, letterSpacing: '0.02em' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Main WelcomePage ──────────────────────────────────────────────────────
export const WelcomePage = ({ onGetStarted }) => {
  useScrollReveal();

  const heroRef = useRef(null);
  const spotlight = useSpotlight(heroRef);

  return (
    <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>

      {/* ── HERO ──────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '6rem 1.5rem 4rem',
          overflow: 'hidden',
        }}
      >
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(var(--cream-border) 1px, transparent 1px), linear-gradient(90deg, var(--cream-border) 1px, transparent 1px)`,
          backgroundSize: '52px 52px', opacity: 0.55,
        }} />

        {/* Mouse spotlight */}
        <div style={{
          position: 'absolute', zIndex: 1, pointerEvents: 'none',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,143,113,0.12) 0%, transparent 70%)',
          transform: `translate(${spotlight.x - 300}px, ${spotlight.y - 300}px)`,
          transition: 'transform 0.08s linear',
          top: 0, left: 0,
        }} />

        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,151,42,0.08) 0%, transparent 70%)', zIndex: 0, animation: 'orbPulse 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-8%', left: '-8%', width: '440px', height: '440px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,143,113,0.08) 0%, transparent 70%)', zIndex: 0, animation: 'orbPulse 10s ease-in-out infinite 2s' }} />

        {/* Floating groceries */}
        {FLOATING.map((f, i) => (
          <div key={i} className={f.cls} style={{ position: 'absolute', top: f.t, left: f.l, right: f.r, fontSize: f.sz, animationDelay: f.d, zIndex: 2, userSelect: 'none', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.09))' }}>
            {f.e}
          </div>
        ))}

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '660px' }}>
          {/* Badge */}
          <div style={{ animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--white)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-pill)', padding: '0.4rem 1rem 0.4rem 0.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--ink)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={15} color="var(--cream)" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>HomeMart</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sage)', animation: 'pulse-dot 2s ease-in-out infinite', display: 'inline-block' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--sage-dark)', fontWeight: 500 }}>Family Grocery App</span>
            </div>
          </div>

          {/* Headline with word-by-word stagger */}
          <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', lineHeight: 1.08, marginBottom: '1.5rem' }}>
            {['Grocery', 'shopping,'].map((w, i) => (
              <span key={i} style={{ display: 'inline-block', animation: `revealUp 0.6s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.1}s both`, marginRight: '0.3em' }}>{w}</span>
            ))}
            <br />
            <span className="shimmer-text" style={{ animation: 'revealUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.32s both, shimmer 4s linear 0.9s infinite', display: 'inline-block' }}>
              together
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--ink-secondary)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 2.25rem', animation: 'revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.38s both' }}>
            One private grocery list for the whole family. Everyone adds what they need — the admin shops, everyone stays in the loop.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', animation: 'revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both' }}>
            <button onClick={onGetStarted}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--ink)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.65rem 1.6rem', height: '42px', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, cursor: 'pointer', transition: 'all 220ms ease', boxShadow: '0 4px 18px rgba(26,23,20,0.2)', alignSelf: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,23,20,0.24)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(26,23,20,0.2)'; }}
            >
              Get started <ArrowRight size={16} />
            </button>
            <button onClick={onGetStarted}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--white)', color: 'var(--ink)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-md)', padding: '0.65rem 1.4rem', height: '42px', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, cursor: 'pointer', transition: 'all 200ms ease', alignSelf: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream-dark)'; e.currentTarget.style.borderColor = '#C0BAB2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--cream-border)'; }}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <Ticker />

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section style={{ padding: '5.5rem 1.5rem', background: 'var(--cream)', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '0.5rem' }}>Why HomeMart</p>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', marginBottom: '0.6rem' }}>Built for Indian families</h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>Simple, fast, and private. Everything your family needs for a smooth monthly grocery run.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div style={{ background: 'var(--white)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', height: '100%', transition: 'all 220ms ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = '#D0CAC1'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--cream-border)'; }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.85rem' }}>{f.icon}</div>
                  <h3 style={{ fontSize: '0.98rem', marginBottom: '0.4rem', fontFamily: 'DM Serif Display, serif' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ padding: '3.5rem 1.5rem', background: 'var(--cream)', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '0.5rem' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)' }}>Four steps to a smoother shop</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STEPS.map((s, i) => (
              <div key={i} className={i % 2 === 0 ? 'reveal-left' : 'reveal-right'} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', padding: '1.5rem 1.75rem', background: 'var(--white)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-lg)', transition: 'all 200ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D0CAC1'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-border)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: '44px', height: '44px', flexShrink: 0, background: 'var(--cream)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Serif Display, serif', fontSize: '1rem', color: 'var(--ink-muted)' }}>
                    {s.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', marginBottom: '0.3rem', fontFamily: 'DM Serif Display, serif' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ───────────────────────────────────────── */}
      <section style={{ padding: '3.5rem 1.5rem', background: 'var(--cream)', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', marginBottom: '0.5rem' }}>Two types of accounts</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>Each login is private — no one can access another person's account.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '👑', title: 'Family Admin', bg: 'var(--gold-light)', border: 'var(--gold-border)', accent: 'var(--gold)', cls: 'reveal-left', perks: ['Creates the private family space', 'Shares invite code with members', 'Views the complete combined list', 'Marks items as purchased', 'Manages members and shopping history'] },
              { icon: '👤', title: 'Family Member', bg: 'var(--sage-light)', border: '#C8DBC9', accent: 'var(--sage)', cls: 'reveal-right', perks: ['Joins with an invite code', 'Uploads their own profile photo', 'Adds groceries they need', 'Edits or removes their own items', 'Sees when items are purchased'] },
            ].map((role, i) => (
              <div key={i} className={role.cls} style={{ transitionDelay: `${i * 0.15}s` }}>
                <div style={{ background: role.bg, border: `1px solid ${role.border}`, borderRadius: 'var(--radius-lg)', padding: '1.75rem', height: '100%', transition: 'all 220ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{role.icon}</span>
                    <h3 style={{ fontSize: '1.05rem', fontFamily: 'DM Serif Display, serif' }}>{role.title}</h3>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {role.perks.map((p, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                        <CheckCircle2 size={14} color={role.accent} style={{ marginTop: '2px', flexShrink: 0 }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: 'var(--cream)', position: 'relative', overflow: 'hidden', zIndex: 3 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,143,113,0.07) 0%, transparent 70%)', zIndex: 0, animation: 'orbPulse 7s ease-in-out infinite' }} />
        <div className="reveal" style={{ maxWidth: '520px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>🛍️</div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', marginBottom: '0.75rem' }}>Ready to shop smarter?</h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '2rem' }}>
            Create your family space in under a minute. Share the invite code and everyone's in.
          </p>
          <button onClick={onGetStarted}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--ink)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius-md)', padding: '1rem 2.4rem', fontSize: '1rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, cursor: 'pointer', transition: 'all 220ms ease', boxShadow: '0 4px 20px rgba(26,23,20,0.18)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,23,20,0.26)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,23,20,0.18)'; }}
          >
            <ShoppingBag size={18} /> Start your family space
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{ background: 'var(--ink)', padding: '2rem 1.5rem', textAlign: 'center', position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.15)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={12} color="rgba(255,255,255,0.8)" />
          </div>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}>HomeMart</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Family grocery management</p>
      </footer>
    </div>
  );
};
