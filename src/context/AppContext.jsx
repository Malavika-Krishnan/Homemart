import React, { createContext, useContext, useState, useEffect } from 'react';
import { CREDENTIAL_STORE, USERS } from './data.js';

// Re-export data constants so existing imports from AppContext still work.
export { CREDENTIAL_STORE, USERS, CATEGORIES } from './data.js';

const AppContext = createContext();

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
  const [initialJoinCode, _setInitialJoinCode] = useState(() => {
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

  // ─── Backend API helper ──────────────────────────────────────────────────
  const API_BASE = 'http://localhost:5000/api/v1';

  const getAuthToken = () => {
    return localStorage.getItem('homemart_token') || '';
  };

  // Sync with backend on load / auth change
  useEffect(() => {
    const token = getAuthToken();
    if (currentUser && token) {
      // Fetch family profile and items from real backend if available
      fetch(`${API_BASE}/families`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setFamilySpace({
              name: data.data.name,
              code: data.data.inviteCode,
              createdDate: new Date(data.data.createdAt).toISOString().split('T')[0],
              admin: data.data.ownerId,
              members: data.data.members || []
            });
          }
        })
        .catch(err => console.log('Backend sync offline/fallback mode active'));
    }
  }, [currentUser]);

  // ─── Authentication ─────────────────────────────────────────────────────────
  const authenticateUser = async (email, password) => {
    const normalised = email.trim().toLowerCase();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalised, password })
      });
      const data = await res.json();
      if (data.success && data.data) {
        localStorage.setItem('homemart_token', data.data.token);
        const user = {
          id: data.data.user._id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role === 'ADMIN' ? 'admin' : 'member',
          title: data.data.user.role === 'ADMIN' ? '👑 Family Admin' : '👨‍👩‍👧‍👦 Family Member',
          avatar: data.data.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          badgeColor: data.data.user.role === 'ADMIN' ? '#4CAF50' : '#2196F3',
          familyId: data.data.user.familyId
        };
        setCurrentUser(user);
        showToast(`Welcome back, ${user.name.split(' ')[0]} 👋`);
        return null;
      }
    } catch (e) {
      console.log('Backend auth fallback to local store');
    }

    // Fallback to local store
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
    return null;
  };

  const loginUser = (user) => {
    setCurrentUser(user);
    showToast(`Logged in as ${user.name} 👋`);
  };

  const logout = () => {
    localStorage.removeItem('homemart_token');
    setCurrentUser(null);
    showToast('Logged out of HomeMart space', 'info');
  };

  // Helper to validate password constraint: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const validatePasswordConstraint = (pw) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(pw)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    }
    return null;
  };

  const getShareableInviteLink = () => {
    const code = familySpace?.code || '';
    return `${window.location.origin}/?join=${code}`;
  };

  const createFamilySpace = async ({ adminName, adminEmail, familyName, avatar, password = 'Password123!' }) => {
    const passErr = validatePasswordConstraint(password);
    if (passErr) {
      showToast(passErr, 'warning');
    }

    let token = getAuthToken();
    let userId = `user-${Date.now()}`;

    try {
      // 1. Register with backend
      const regRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminName, email: adminEmail, password })
      });
      const regData = await regRes.json();
      if (regData.success) {
        token = regData.data.token;
        localStorage.setItem('homemart_token', token);
        userId = regData.data.user._id;
      }

      // 2. Create family in backend
      const famRes = await fetch(`${API_BASE}/families/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: familyName })
      });
      const famData = await famRes.json();

      if (famData.success) {
        const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
        const newAdmin = {
          id: userId,
          name: adminName,
          role: 'admin',
          title: '👑 Family Admin',
          avatar: avatar || defaultAvatar,
          badgeColor: '#4CAF50',
          email: adminEmail,
          familyId: famData.data._id
        };

        const newSpace = {
          id: famData.data._id,
          name: famData.data.name,
          code: famData.data.inviteCode,
          createdDate: new Date().toISOString().split('T')[0],
          admin: newAdmin,
          members: [newAdmin]
        };

        // Reset grocery items to empty list for new family space
        setGroceryItems([]);
        setShoppingHistory([]);
        setFamilySpace(newSpace);
        setCurrentUser(newAdmin);
        showToast(`Created family space "${familyName}"! Invite Code: ${famData.data.inviteCode} 🎉`);
        return;
      }
    } catch (e) {
      console.log('Backend family creation fallback');
    }

    // Fallback mode: Clear pre-existing items for new family
    const newCode = `FAM-${Math.floor(100000 + Math.random() * 900000)}`;
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    const newAdmin = {
      id: userId,
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

    setGroceryItems([]);
    setShoppingHistory([]);
    setFamilySpace(newSpace);
    setCurrentUser(newAdmin);
    showToast(`Created family space "${familyName}"! Share code ${newCode} with family. 🎉`);
  };

  const joinFamilySpace = async ({ code, memberName, memberEmail, avatar, password = 'Password123!' }) => {
    let token = getAuthToken();
    let userId = `user-${Date.now()}`;

    try {
      const regRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: memberName, email: memberEmail, password })
      });
      const regData = await regRes.json();
      if (regData.success) {
        token = regData.data.token;
        localStorage.setItem('homemart_token', token);
        userId = regData.data.user._id;
      }

      const joinRes = await fetch(`${API_BASE}/families/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode: code })
      });
      const joinData = await joinRes.json();

      if (joinData.success) {
        const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
        const newMember = {
          id: userId,
          name: memberName,
          role: 'member',
          title: '👨‍👩‍👧‍👦 Family Member',
          avatar: avatar || defaultAvatar,
          badgeColor: '#2196F3',
          email: memberEmail,
          familyId: joinData.data._id
        };

        setFamilySpace({
          id: joinData.data._id,
          name: joinData.data.name,
          code: joinData.data.inviteCode,
          createdDate: new Date().toISOString().split('T')[0],
          admin: joinData.data.ownerId,
          members: joinData.data.members || []
        });

        setCurrentUser(newMember);
        showToast(`Joined family space "${joinData.data.name}" as ${memberName}! 👋`);
        return;
      }
    } catch (e) {
      console.log('Backend join fallback');
    }

    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    const newMember = {
      id: userId,
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

  const removeMember = async (memberId) => {
    const member = familySpace.members.find(m => m.id === memberId || m._id === memberId);
    const updatedMembers = familySpace.members.filter(m => m.id !== memberId && m._id !== memberId);
    setFamilySpace(prev => ({
      ...prev,
      members: updatedMembers
    }));
    showToast(`Removed ${member?.name || 'member'} from family space`);

    const token = getAuthToken();
    if (token && familySpace.id) {
      try {
        await fetch(`${API_BASE}/families/${familySpace.id}/members/${memberId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.log('Backend remove member fallback');
      }
    }
  };

  const updateProfile = async ({ name, avatar, title }) => {
    const updatedUser = { ...currentUser, name, avatar, title };
    setCurrentUser(updatedUser);
    setFamilySpace(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === currentUser?.id || m.email === currentUser?.email ? updatedUser : m)
    }));
    showToast('Profile updated successfully! ✨');

    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/users/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name, avatar, title })
        });
      } catch (e) {
        console.log('Backend profile update fallback');
      }
    }
  };

  const deleteProfile = async () => {
    const token = getAuthToken();
    showToast('Profile deleted', 'info');
    if (token) {
      try {
        await fetch(`${API_BASE}/users/profile`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.log('Backend profile delete fallback');
      }
    }
    logout();
  };
  const addItem = async (newItem) => {
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

    const token = getAuthToken();
    if (token) {
      try {
        // Ensure a shopping list exists first, or create default list
        const listsRes = await fetch(`${API_BASE}/lists`, { headers: { Authorization: `Bearer ${token}` } });
        const listsData = await listsRes.json();
        let listId = listsData.data?.[0]?._id;

        if (!listId) {
          const createListRes = await fetch(`${API_BASE}/lists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: 'Family Grocery List' })
          });
          const createListData = await createListRes.json();
          listId = createListData.data?._id;
        }

        if (listId) {
          const catMap = { produce: 'Produce', dairy: 'Dairy', bakery: 'Bakery', pantry: 'Pantry', beverages: 'Beverages', household: 'Household' };
          await fetch(`${API_BASE}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              listId,
              name: newItem.name,
              category: catMap[newItem.category] || 'Other',
              quantity: Number(newItem.quantity) || 1,
              unit: newItem.unit || 'pcs',
              priority: newItem.priority === 'high' ? 'HIGH' : 'MEDIUM'
            })
          });
        }
      } catch (e) {
        console.log('Backend item sync fallback');
      }
    }
  };

  const updateItem = async (updatedItem) => {
    setGroceryItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    showToast(`Updated "${updatedItem.name}"`);

    const token = getAuthToken();
    if (token && updatedItem.id && !updatedItem.id.startsWith('item-')) {
      try {
        await fetch(`${API_BASE}/items/${updatedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: updatedItem.name,
            quantity: Number(updatedItem.quantity) || 1,
            unit: updatedItem.unit
          })
        });
      } catch (e) {
        console.log('Backend update fallback');
      }
    }
  };

  const deleteItem = async (itemId) => {
    const itemToDelete = groceryItems.find(i => i.id === itemId);
    setGroceryItems(prev => prev.filter(item => item.id !== itemId));
    showToast(`Removed "${itemToDelete?.name || 'Item'}" from the list`);

    const token = getAuthToken();
    if (token && itemId && !itemId.startsWith('item-')) {
      try {
        await fetch(`${API_BASE}/items/${itemId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.log('Backend delete fallback');
      }
    }
  };

  const togglePurchased = async (itemId) => {
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

    const token = getAuthToken();
    if (token && itemId && !itemId.startsWith('item-')) {
      try {
        await fetch(`${API_BASE}/items/${itemId}/toggle-purchase`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.log('Backend toggle purchase fallback');
      }
    }
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
      removeMember,
      updateProfile,
      deleteProfile,
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
      getShareableInviteLink,
      validatePasswordConstraint,
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

// ─── Hook ────────────────────────────────────────────────────────────────────
const useApp = () => useContext(AppContext);
// eslint-disable-next-line react/only-export-components
export { useApp };
