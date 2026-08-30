import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate('/login');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'U';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-orange-500 text-xl leading-none">⚡</span>
          <span className="text-xl font-bold text-slate-800 leading-none">CareerCraft</span>
        </Link>

        {/* Center search bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full text-sm px-4 py-2 border border-gray-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
          />
          <button className="bg-teal-700 text-white px-4 rounded-r-full hover:bg-teal-800 transition">
            🔍
          </button>
        </div>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 shrink-0 ml-auto">
          <Link to="/" className="leading-none hover:text-slate-900 transition">Home</Link>
          <Link to="/about" className="leading-none hover:text-slate-900 transition">About</Link>
          <Link to="/contact" className="leading-none hover:text-slate-900 transition">Contact</Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4 shrink-0 pl-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-md leading-none hover:bg-teal-800 transition"
              >
                Dashboard
              </Link>

              {/* Avatar with dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-bold hover:bg-teal-800 transition"
                >
                  {initial}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-1 text-sm">
                    <div className="px-4 py-2 text-gray-500 border-b truncate">{user?.email}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-md leading-none hover:bg-teal-800 transition"
              >
                Build Resume
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 leading-none hover:text-slate-900 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;