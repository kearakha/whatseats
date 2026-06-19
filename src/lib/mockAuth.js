const STORAGE_KEY_USER = 'rdp_mock_user'
const STORAGE_KEY_MENUS = 'rdp_mock_menus'

export const mockAuth = {
  getSession: () => {
    const user = localStorage.getItem(STORAGE_KEY_USER)
    return { data: { session: user ? { user: JSON.parse(user) } : null } }
  },

  onAuthStateChange: (callback) => {
    const handler = () => {
      const user = localStorage.getItem(STORAGE_KEY_USER)
      callback('AUTH_STATE_CHANGE', user ? JSON.parse(user) : null)
    }
    window.addEventListener('storage', handler)
    return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handler) } } }
  },

  signUp: async (email, password) => {
    const existing = localStorage.getItem(STORAGE_KEY_USER)
    if (existing) {
      throw new Error('User already exists. Please sign in instead.')
    }
    const user = { id: crypto.randomUUID(), email, password }
    const session = { user }
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session))
    return { data: { session }, error: null }
  },

  signInWithPassword: async (email, password) => {
    const stored = localStorage.getItem(STORAGE_KEY_USER)
    if (!stored) {
      throw new Error('No user found. Please sign up first.')
    }
    const session = JSON.parse(stored)
    if (session.user.email !== email || session.user.password !== password) {
      throw new Error('Invalid email or password')
    }
    return { data: { session }, error: null }
  },

  signOut: async () => {
    localStorage.removeItem(STORAGE_KEY_USER)
    return { error: null }
  }
}

export const mockDb = {
  getMenus: (userId) => {
    const menus = JSON.parse(localStorage.getItem(STORAGE_KEY_MENUS) || '[]')
    return menus.filter(m => m.user_id === userId)
  },

  addMenu: (userId, name) => {
    const menus = JSON.parse(localStorage.getItem(STORAGE_KEY_MENUS) || '[]')
    const newMenu = {
      id: crypto.randomUUID(),
      user_id: userId,
      name,
      created_at: new Date().toISOString()
    }
    menus.push(newMenu)
    localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(menus))
    return newMenu
  },

  deleteMenu: (menuId) => {
    const menus = JSON.parse(localStorage.getItem(STORAGE_KEY_MENUS) || '[]')
    const filtered = menus.filter(m => m.id !== menuId)
    localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(filtered))
  }
}