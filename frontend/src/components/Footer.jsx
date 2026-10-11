import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Button from './ui/Button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-white dark:bg-[#06080F] border-t border-slate-200/80 dark:border-[#1E2742] transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <Calendar size={18} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EventHub
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
              Bringing people together through experiences that matter.
            </p>
          </div>

          {/* Discover Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/events" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Browse events
                </Link>
              </li>
              <li>
                <a href="#categories" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <Link to="/events" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Popular this week
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider">
              Stay in the loop
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Fresh events, delivered weekly.
            </p>
            {subscribed ? (
              <p className="text-xs font-semibold text-emerald-500">
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0F1424] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <Button type="submit" size="sm" className="px-4 shrink-0">
                  Join
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom divider & copyright */}
        <div className="mt-14 pt-8 border-t border-slate-100 dark:border-[#1E2742] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} EventHub, Inc.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-700 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
