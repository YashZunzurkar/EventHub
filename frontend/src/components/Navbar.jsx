import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Sun, Moon, Calendar, LogOut, Shield } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = (val) => {
    const targetDark = val !== undefined ? val : !isDark;
    if (targetDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const navLinkStyle = (path) => `text-sm font-medium transition-colors ${
    isActive(path) 
      ? 'text-indigo-600 dark:text-white font-semibold' 
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
  }`;

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#06080F]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1E2742] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Calendar size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              EventHub
            </span>
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkStyle('/')}>Home</Link>
            <Link to="/events" className={navLinkStyle('/events')}>Events</Link>
            {user && (
              <Link to="/my-registrations" className={navLinkStyle('/my-registrations')}>
                My registrations
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={navLinkStyle('/admin')}>
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Theme Toggle Pill (Matches reference screenshot) */}
            <div className="flex items-center bg-slate-100 dark:bg-[#13192B] p-1 rounded-full border border-slate-200 dark:border-[#1E2742]">
              <button
                onClick={() => toggleTheme(false)}
                className={`p-1.5 rounded-full transition-all ${
                  !isDark 
                    ? 'bg-white text-amber-500 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
                title="Light Mode"
              >
                <Sun size={15} />
              </button>
              <button
                onClick={() => toggleTheme(true)}
                className={`p-1.5 rounded-full transition-all ${
                  isDark 
                    ? 'bg-[#1E2742] text-indigo-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-500'
                }`}
                title="Dark Mode"
              >
                <Moon size={15} />
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#13192B] border border-slate-200 dark:border-[#1E2742]"
                  title={user.email}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-bold uppercase">
                      Admin
                    </span>
                  )}
                </div>

                <button 
                  onClick={handleLogout} 
                  className="p-2 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link to="/register">
                  <Button size="sm" pill={false} className="px-5 py-2">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => toggleTheme(!isDark)}
              className="p-2 text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-slate-700 dark:text-slate-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#06080F] px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Home
          </Link>
          <Link 
            to="/events" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Events
          </Link>
          {user && (
            <Link 
              to="/my-registrations" 
              onClick={() => setIsOpen(false)} 
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              My registrations
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              onClick={() => setIsOpen(false)} 
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Admin Workspace
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-[#1E2742]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <Button 
                  onClick={() => { handleLogout(); setIsOpen(false); }} 
                  variant="outline" 
                  className="w-full text-rose-500"
                >
                  <LogOut size={16} className="mr-2" /> Log out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full">Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
