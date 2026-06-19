import { Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function MenuItem({ menu, onDelete }) {
  return (
    <motion.div
      className={cn(
        "flex items-center justify-between px-4 py-3 gap-3",
        "bg-white/5 rounded-xl",
        "border border-transparent",
        "hover:bg-white/10 hover:border-white/10",
        "transition-all duration-200 cursor-default",
        "group"
      )}
      whileHover={{ x: 2 }}
    >
      <span className="text-white text-sm flex-1 break-words leading-relaxed">{menu.name}</span>

      <button
        onClick={() => onDelete(menu.id)}
        className={cn(
          "p-1.5 rounded-lg shrink-0",
          "text-white/30 hover:text-red-400 hover:bg-red-400/10",
          "transition-all duration-200",
          "opacity-0 group-hover:opacity-100"
        )}
        title="Delete menu"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}