import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// ─── Private credential store ───────────────────────────────────────────────
// In a real app these would be hashed server-side. Here we validate client-side
// for demonstration purposes. Each entry maps email → { password, userId }.
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
  { id: 'all', name: 'All Items', icon: '🧺', color: '#FFF8EE' },
  { id: 'produce', name: 'Fresh Produce', icon: '🥑', color: '#E8F5E9' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', color: '#FFF8E1' },
  { id: 'bakery', name: 'Bakery & Grains', icon: '🍞', color: '#EFEBE9' },
  { id: 'pantry', name: 'Organic Pantry', icon: '🍯', color: '#FFF3E0' },
  { id: 'beverages', name: 'Beverages & Juices', icon: '🧃', color: '#E0F2F1' },
  { id: 'household', name: 'Eco Household', icon: '🌿', color: '#F3E5F5' }
];

const INITIAL_GROCERY_ITEMS = [
  {
    id: 'item-1',
    name: 'Organic Hass Avocados',
    category: 'produce',
    quantity: 4,
    unit: 'pcs',
    addedBy: USERS[2],
    priority: 'high',
    price: 80,
    purchased: false,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
    notes: 'Pick slightly firm ones for weekend salad',
    dateAdded: '2026-07-25'
  },
  {
    id: 'item-2',
    name: 'Whole Wheat Bread',
    category: 'bakery',
    quantity: 1,
    unit: 'loaf',
    addedBy: USERS[0],
    priority: 'high',
    price: 45,
    purchased: false,
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80',
    notes: 'Brown bread from local bakery',
    dateAdded: '2026-07-25'
  },
  {
    id: 'item-3',
    name: 'Amul Fresh Milk 1L',
    category: 'dairy',
    quantity: 2,
    unit: 'cartons',
    addedBy: USERS[1],
    priority: 'high',
    price: 55,
    purchased: false,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
    notes: 'Full cream Amul',
    dateAdded: '2026-07-26'
  },
  {
    id: 'item-4',
    name: 'Raw Wildflower Honey',
    category: 'pantry',
    quantity: 1,
    unit: 'jar',
    addedBy: USERS[2],
    priority: 'optional',
    price: 220,
    purchased: false,
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    notes: 'Unfiltered 500g glass jar',
    dateAdded: '2026-07-24'
  },
  {
    id: 'item-5',
    name: 'Farm Fresh Eggs (12 pcs)',
    category: 'dairy',
    quantity: 1,
    unit: 'carton',
    addedBy: USERS[0],
    priority: 'high',
    price: 90,
    purchased: true,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=400&q=80',
    notes: 'Free range desi eggs',
    dateAdded: '2026-07-23'
  },
  {
    id: 'item-6',
    name: 'Fresh Strawberries',
    category: 'produce',
    quantity: 2,
    unit: 'punnets',
    addedBy: USERS[3],
    priority: 'high',
    price: 120,
    purchased: false,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80',
    notes: 'Sweet Mahabaleshwar punnets',
    dateAdded: '2026-07-26'
  },
  {
    id: 'item-7',
    name: 'Real Activ Orange Juice',
    category: 'beverages',
    quantity: 2,
    unit: 'bottles',
    addedBy: USERS[1],
    priority: 'optional',
    price: 75,
    purchased: false,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
    notes: '1L tetra pack, no added sugar',
    dateAdded: '2026-07-26'
  },
  {
    id: 'item-8',
    name: 'Mustard Oil 1L',
    category: 'pantry',
    quantity: 1,
    unit: 'bottle',
    addedBy: USERS[0],
    priority: 'high',
    price: 150,
    purchased: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    notes: 'Patanjali cold pressed mustard oil',
    dateAdded: '2026-07-22'
  }
];

const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    date: '2026-07-19',
    tripTitle: 'Mid-July Grocery Run',
    shopper: 'Priya Sharma',
    itemCount: 9,
    totalSpent: 820,
    items: [
      { name: 'Bananas 1 dozen', price: 40, quantity: 1, addedBy: 'Sneha Sharma' },
      { name: 'Mother Dairy Curd 400g', price: 38, quantity: 2, addedBy: 'Arjun Sharma' },
      { name: 'Aashirvaad Atta 5kg', price: 265, quantity: 1, addedBy: 'Priya Sharma' },
      { name: 'Kissan Mixed Fruit Jam', price: 110, quantity: 1, addedBy: 'Rohan Sharma' }
    ]
  }
];

export const AppProvider = ({ children }) => {
  // Extract ?join=CODE parameter if present
  const [initialJoinCode, setInitialJoinCode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('join') || null;
  });

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('homemart_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [familySpace, setFamilySpace] = useState(() => {
    const saved = localStorage.getItem('homemart_family');
    return saved ? JSON.parse(saved) : {
      name: 'Sharma Family Pantry',
      code: 'HM-SHARMA-2026',
      createdDate: '2026-01-10',
      admin: USERS[0],
      members: USERS
    };
  });

  const [groceryItems, setGroceryItems] = useState(() => {
    const saved = localStorage.getItem('homemart_items');
    return saved ? JSON.parse(saved) : INITIAL_GROCERY_ITEMS;
  });

  const [shoppingHistory, setShoppingHistory] = useState(() => {
    const saved = localStorage.getItem('homemart_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterMember, setActiveFilterMember] = useState('all');
  const [isShoppingMode, setIsShoppingMode] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('homemart_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('homemart_family', JSON.stringify(familySpace));
  }, [familySpace]);

  useEffect(() => {
    localStorage.setItem('homemart_items', JSON.stringify(groceryItems));
  }, [groceryItems]);

  useEffect(() => {
    localStorage.setItem('homemart_history', JSON.stringify(shoppingHistory));
  }, [shoppingHistory]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Authentication ─────────────────────────────────────────────────────────
  // Validates email + password against the private credential store.
  // Returns null on success, or an error string on failure.
  const authenticateUser = (email, password) => {
    const normalised = email.trim().toLowerCase();
    const record = CREDENTIAL_STORE[normalised];

    if (!record) {
      return 'No account found with this email address.';
    }
    if (record.password !== password) {
      return 'Incorrect password. Please try again.';
    }

    const user = USERS.find(u => u.id === record.userId);
    if (!user) return 'Account error — please contact your admin.';

    setCurrentUser(user);
    showToast(`Welcome back, ${user.name.split(' ')[0]} 👋`);
    return null; // success
  };

  const loginUser = (user) => {
    setCurrentUser(user);
    showToast(`Logged in as ${user.name} 👋`);
  };


  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out of HomeMart space', 'info');
  };

  const createFamilySpace = ({ adminName, adminEmail, familyName, avatar }) => {
    const newCode = `HM-${familyName.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    const newAdmin = {
      id: `user-${Date.now()}`,
      name: adminName,
      role: 'admin',
      title: '👑 Family Admin',
      avatar: avatar || defaultAvatar,
      badgeColor: '#4CAF50',
      email: adminEmail
    };

    const newSpace = {
      name: familyName,
      code: newCode,
      createdDate: new Date().toISOString().split('T')[0],
      admin: newAdmin,
      members: [newAdmin]
    };

    setFamilySpace(newSpace);
    setCurrentUser(newAdmin);
    showToast(`Created family space "${familyName}"! Share code ${newCode} with family. 🎉`);
  };

  const joinFamilySpace = ({ code, memberName, memberEmail, avatar }) => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    const newMember = {
      id: `user-${Date.now()}`,
      name: memberName,
      role: 'member',
      title: '👨‍👩‍👧‍👦 Family Member',
      avatar: avatar || defaultAvatar,
      badgeColor: '#2196F3',
      email: memberEmail
    };

    setFamilySpace(prev => ({
      ...prev,
      members: [...prev.members.filter(m => m.name !== memberName), newMember]
    }));

    setCurrentUser(newMember);
    showToast(`Joined family space "${familySpace.name}" as ${memberName}! 👋`);
  };


  // Item Management
  const addItem = (newItem) => {
    const itemWithMeta = {
      ...newItem,
      id: `item-${Date.now()}`,
      addedBy: currentUser,
      purchased: false,
      dateAdded: new Date().toISOString().split('T')[0],
      image: newItem.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
    };
    setGroceryItems(prev => [itemWithMeta, ...prev]);
    showToast(`Added "${newItem.name}" to the family grocery list!`);
  };

  const updateItem = (updatedItem) => {
    setGroceryItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    showToast(`Updated "${updatedItem.name}"`);
  };

  const deleteItem = (itemId) => {
    const itemToDelete = groceryItems.find(i => i.id === itemId);
    setGroceryItems(prev => prev.filter(item => item.id !== itemId));
    showToast(`Removed "${itemToDelete?.name || 'Item'}" from the list`);
  };

  const togglePurchased = (itemId) => {
    setGroceryItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextStatus = !item.purchased;
        if (nextStatus) {
          showToast(`Marked "${item.name}" as purchased! 🛒`);
        }
        return { ...item, purchased: nextStatus };
      }
      return item;
    }));
  };

  const completeShoppingTrip = (tripTitle = 'Weekly Family Grocery Trip') => {
    const purchasedItems = groceryItems.filter(i => i.purchased);
    if (purchasedItems.length === 0) {
      showToast('No items marked as purchased to complete!', 'warning');
      return;
    }

    const totalSpent = purchasedItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);

    const newTrip = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tripTitle,
      shopper: currentUser.name,
      itemCount: purchasedItems.length,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      items: purchasedItems.map(i => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        addedBy: i.addedBy.name
      }))
    };

    setShoppingHistory(prev => [newTrip, ...prev]);
    setGroceryItems(prev => prev.filter(i => !i.purchased));
    setIsShoppingMode(false);
    showToast(`Shopping trip completed! ${purchasedItems.length} items moved to history. 🎉`);
  };

  const readdHistoryItems = (historyTrip) => {
    const newItems = historyTrip.items.map((hItem, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      name: hItem.name,
      category: 'pantry',
      quantity: hItem.quantity || 1,
      unit: 'pcs',
      addedBy: currentUser,
      priority: 'high',
      price: hItem.price || 4.50,
      purchased: false,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      notes: `Re-added from trip: ${historyTrip.tripTitle}`,
      dateAdded: new Date().toISOString().split('T')[0]
    }));

    setGroceryItems(prev => [...newItems, ...prev]);
    showToast(`Re-added ${newItems.length} items from "${historyTrip.tripTitle}"!`);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(null);
    setFamilySpace({
      name: 'Sharma Family Pantry',
      code: 'HM-SHARMA-2026',
      createdDate: '2026-01-10',
      admin: USERS[0],
      members: USERS
    });
    setGroceryItems(INITIAL_GROCERY_ITEMS);
    setShoppingHistory(INITIAL_HISTORY);
    showToast('Demo data reset. Please sign in again.', 'info');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      initialJoinCode,
      authenticateUser,
      loginUser,
      logout,
      createFamilySpace,
      joinFamilySpace,
      familySpace,
      groceryItems,
      shoppingHistory,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      activeFilterMember,
      setActiveFilterMember,
      isShoppingMode,
      setIsShoppingMode,
      toast,
      showToast,
      addItem,
      updateItem,
      deleteItem,
      togglePurchased,
      completeShoppingTrip,
      readdHistoryItems,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
