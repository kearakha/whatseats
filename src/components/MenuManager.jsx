import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Loader2, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'
import MenuItem from './MenuItem'

export default function MenuManager({ menus, loading, onAdd, onDelete }) {
  const [inputValue, setInputValue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || submitting) return

    if (inputValue.trim().length < 2) {
      setError('Min 2 characters')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await onAdd(inputValue.trim())
      setInputValue('')
    } catch (err) {
      setError(err.message || 'Failed to add')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Utensils size={16} className="text-white/70" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Menu List</h3>
            <p className="text-slate-500 text-xs">{menus.length} items</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Add menu name..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (error) setError('')
            }}
            className={cn(
              "w-full px-4 py-3 pr-10",
              "bg-white/5 border border-white/10 rounded-xl",
              "text-white placeholder:text-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/30",
              "transition-all duration-200",
              error ? "border-red-400/50" : ""
            )}
          />
          {error && (
            <p className="absolute -bottom-5 left-0 text-xs text-red-400">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !inputValue.trim()}
          className={cn(
            "px-5 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm",
            "hover:bg-orange-600 transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "particle-shadow-hover"
          )}
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Plus size={18} />
          )}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-10 gap-3">
          <Loader2 className="animate-spin text-slate-500" size={20} />
          <span className="text-slate-500 text-sm">Loading...</span>
        </div>
      ) : menus.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-white/10"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <Utensils size={20} className="text-white/30" />
          </div>
          <p className="text-slate-500 text-sm mb-1">No menus yet</p>
          <p className="text-slate-600 text-xs">Add your first menu above</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-hide"
        >
          <AnimatePresence mode="popLayout">
            {menus.map((menu, index) => (
              <MenuItem
                key={menu.id}
                menu={menu}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}