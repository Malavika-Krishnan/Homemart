import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WelcomePage } from './components/WelcomePage';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { WhoAddedWhatPanel } from './components/WhoAddedWhatPanel';
import { CategoryFilter } from './components/CategoryFilter';
import { GroceryList } from './components/GroceryList';
import { AddItemModal } from './components/AddItemModal';
import { FamilyModal } from './components/FamilyModal';
import { ProfileModal } from './components/ProfileModal';
import { ShoppingModeModal } from './components/ShoppingModeModal';
import { ShoppingHistoryModal } from './components/ShoppingHistoryModal';
import { ToastNotification } from './components/OrganicDividers';

// ─── Page transition wrapper ────────────────────────────────────────────────
const Page = ({ children, animKey }) => (
  <div
    key={animKey}
    style={{
      animation: 'revealUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
      minHeight: '100vh',
    }}
  >
    {children}
  </div>
);

// ─── Main app (after login) ─────────────────────────────────────────────────
const MainApp = () => {
  const { isShoppingMode, setIsShoppingMode } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');

  const openEdit = (item) => { setEditItem(item); setAddOpen(true); };
  const openAdd  = () => { setEditItem(null); setAddOpen(true); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cream)' }}>
      <Header
        onOpenFamilyModal={() => setFamilyOpen(true)}
        onOpenAddModal={openAdd}
        onOpenHistoryModal={() => setHistoryOpen(true)}
        onOpenProfileModal={() => setProfileOpen(true)}
      />

      <main style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        <StatsOverview />
        <WhoAddedWhatPanel />
        <CategoryFilter priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} />
        <GroceryList priorityFilter={priorityFilter} onEditItem={openEdit} onOpenAddModal={openAdd} />
      </main>

      <footer style={{ borderTop: '1px solid var(--cream-border)', padding: '1.5rem', textAlign: 'center', background: 'var(--white)' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-light)' }}>
          HomeMart · Collaborative family grocery management
        </p>
      </footer>

      <AddItemModal isOpen={addOpen} onClose={() => setAddOpen(false)} editItem={editItem} />
      <FamilyModal isOpen={familyOpen} onClose={() => setFamilyOpen(false)} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <ShoppingHistoryModal isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      <ShoppingModeModal isOpen={isShoppingMode} onClose={() => setIsShoppingMode(false)} />
    </div>
  );
};

// ─── Root — controls page flow ──────────────────────────────────────────────
const Root = () => {
  const { currentUser, initialJoinCode } = useApp();

  // If user arrives with an invite link, skip welcome and go to join screen
  const [page, setPage] = useState(initialJoinCode ? 'login' : 'welcome');

  // Once logged in, show main app
  if (currentUser) {
    return (
      <Page animKey="app">
        <MainApp />
      </Page>
    );
  }

  if (page === 'login') {
    return (
      <Page animKey="login">
        <LoginPage
          initialJoinCode={initialJoinCode}
          onBack={() => setPage('welcome')}
        />
      </Page>
    );
  }

  // Welcome / landing
  return (
    <Page animKey="welcome">
      <WelcomePage onGetStarted={() => setPage('login')} />
    </Page>
  );
};

// ─── App entry ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <ToastNotification />
      <Root />
    </AppProvider>
  );
}
