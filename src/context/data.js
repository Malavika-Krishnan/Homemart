// ─── Static data & hooks extracted from AppContext ──────────────────────────
// Kept here so AppContext.jsx only exports a component (AppProvider),
// satisfying the react/only-export-components rule for Vite fast-refresh.

// ─── Private credential store ────────────────────────────────────────────────
export const CREDENTIAL_STORE = {
  'admin@homemart.in':  { password: 'Priya@123',  userId: 'user-admin' },
  'arjun@homemart.in':  { password: 'Arjun@123',  userId: 'user-david' },
  'sneha@homemart.in':  { password: 'Sneha@123',  userId: 'user-sarah' },
  'rohan@homemart.in':  { password: 'Rohan@123',  userId: 'user-leo'   },
};

export const USERS = [
  {
    id: 'user-admin',
    name: 'Priya Sharma',
    role: 'admin',
    title: '👑 Family Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    badgeColor: '#4CAF50',
    email: 'admin@homemart.in'
  },
  {
    id: 'user-david',
    name: 'Arjun Sharma',
    role: 'member',
    title: '👨 Dad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    badgeColor: '#2196F3',
    email: 'arjun@homemart.in'
  },
  {
    id: 'user-sarah',
    name: 'Sneha Sharma',
    role: 'member',
    title: '👧 Daughter',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    badgeColor: '#9C27B0',
    email: 'sneha@homemart.in'
  },
  {
    id: 'user-leo',
    name: 'Rohan Sharma',
    role: 'member',
    title: '👦 Son',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    badgeColor: '#FF9800',
    email: 'rohan@homemart.in'
  }
];

export const CATEGORIES = [
  { id: 'all',       name: 'All Items',           icon: '🧺', color: '#FFF8EE' },
  { id: 'produce',   name: 'Fresh Produce',        icon: '🥑', color: '#E8F5E9' },
  { id: 'dairy',     name: 'Dairy & Eggs',         icon: '🥛', color: '#FFF8E1' },
  { id: 'bakery',    name: 'Bakery & Grains',      icon: '🍞', color: '#EFEBE9' },
  { id: 'pantry',    name: 'Organic Pantry',       icon: '🍯', color: '#FFF3E0' },
  { id: 'beverages', name: 'Beverages & Juices',   icon: '🧃', color: '#E0F2F1' },
  { id: 'household', name: 'Eco Household',        icon: '🌿', color: '#F3E5F5' },
];
