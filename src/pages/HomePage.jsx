import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext.jsx";
import { useMenuList } from "@/hooks";
import { SpinWheel } from "@/components";
import { MenuManager } from "@/components";
import { ResultModal } from "@/components";
import { NavBar } from "@/components";
import { Sparkles, X, Loader2 } from "lucide-react";

function GuestAuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        onClose();
      } else {
        await signUp(email, password);
        setSuccessMsg("Account created! You can now sign in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm p-8 rounded-3xl bg-slate-900 border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            {isLogin ? "Sign in to sync" : "Create account"}
          </h2>
          <p className="text-slate-400 text-sm">
            Your guest list will be saved to your account
          </p>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {successMsg}
          </div>
        )}
        {localError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/30 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/30 transition-all"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing...
              </>
            ) : isLogin ? (
              "Sign In & Sync"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setLocalError("");
              setSuccessMsg("");
            }}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const { user, signOut, isGuest } = useAuth();
  const { menus, loading, addMenu, deleteMenu } = useMenuList(user?.id);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSpinComplete = (selectedMenu) => {
    setResult(selectedMenu);
    setShowResult(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 bg-gradient-radial from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10">
        <NavBar user={user} onSignOut={signOut} />

        {isGuest && (
          <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-3 text-center">
            <span className="text-orange-300 text-sm">
              Guest mode — list saves locally.{" "}
              <button
                onClick={() => setShowAuthModal(true)}
                className="underline text-orange-400 hover:text-orange-200 transition-colors"
              >
                Sign in
              </button>{" "}
              to sync across devices.
            </span>
          </div>
        )}

        <main className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300 group cursor-pointer"
            >
              <Sparkles
                size={14}
                className="text-orange-500 group-hover:text-orange-400 transition-colors"
              />
              <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                Can&apos;t decide?
              </span>
            </motion.button>

            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-6 mb-2">
              Spin the Wheel
            </h2>
            <p className="text-slate-500 text-sm">
              Let fate decide your dinner tonight
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-full p-8 rounded-3xl particle-shadow-hover bg-slate-900/60 border border-white/5 backdrop-blur-sm transition-all duration-300">
                <SpinWheel
                  menus={menus}
                  onSpinComplete={handleSpinComplete}
                  disabled={loading || menus.length === 0}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl particle-shadow-hover bg-slate-900/60 border border-white/5 backdrop-blur-sm transition-all duration-300"
            >
              <MenuManager
                menus={menus}
                loading={loading}
                onAdd={addMenu}
                onDelete={deleteMenu}
              />
            </motion.div>
          </div>
        </main>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={handleCloseResult}
        result={result}
      />

      <AnimatePresence>
        {showAuthModal && (
          <GuestAuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
