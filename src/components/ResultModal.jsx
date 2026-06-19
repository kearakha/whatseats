import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'

export default function ResultModal({ isOpen, onClose, result }) {
  return (
    <AnimatePresence>
      {isOpen && result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900 border border-white/10 particle-shadow"
          >
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center bubble-glow"
              >
                <Sparkles size={28} className="text-orange-500" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-500 text-sm uppercase tracking-widest mb-2"
              >
                Tonight&apos;s Dinner
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-semibold text-white mb-6"
              >
                {result.name}
              </motion.h2>

              <motion.button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <X size={16} />
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}