import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext.jsx";
import { Loader2, CheckCircle } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { signIn, signUp, continueAsGuest } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await signIn(email, password);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="absolute inset-0 bg-gradient-radial from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-500 font-bold text-xl">R</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            Random Dinner Picker
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400 text-sm"
          >
            <CheckCircle size={16} />
            {successMsg}
          </motion.div>
        )}

        {localError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {localError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/30 transition-all"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-4 relative flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-600 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={continueAsGuest}
          className="mt-4 w-full py-3 bg-white/5 border border-white/10 text-slate-300 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm"
        >
          Continue as Guest
        </button>

        <p className="mt-2 text-center text-slate-600 text-xs">
          Your list saves locally — login anytime to sync it
        </p>

        <div className="mt-6 text-center">
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
