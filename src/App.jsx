import { useAuth } from "@/context/AuthContext.jsx";
import { AuthPage, HomePage } from "@/pages";

function App() {
  const { user, loading, isGuest } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user || isGuest ? <HomePage /> : <AuthPage />;
}

export default App;
