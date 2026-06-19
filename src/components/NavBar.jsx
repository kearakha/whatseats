import { motion } from 'framer-motion'
import { LogOut, User } from 'lucide-react'

export default function NavBar({ user, onSignOut }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-6 py-4 mx-4 mt-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm particle-shadow"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center bubble-glow">
            <span className="text-orange-500 font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="font-semibold text-white leading-tight">Random Dinner</h1>
            <p className="text-slate-500 text-xs">Picker</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <User size={14} className="text-slate-400" />
            <span className="text-sm text-slate-300 max-w-32 truncate">{user?.email}</span>
          </div>

          <motion.button
            onClick={onSignOut}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            title="Sign out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}