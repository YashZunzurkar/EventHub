import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Star 
} from 'lucide-react';
import Button from '../components/ui/Button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password
      });

      login(
        { 
          _id: response.data._id, 
          name: response.data.name, 
          email: response.data.email, 
          role: response.data.role 
        }, 
        response.data.token
      );

      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
      
      {/* Left 50%: Visual Showcase & Testimonial */}
      <div className="hidden lg:flex lg:col-span-6 relative overflow-hidden bg-slate-950 p-12 lg:p-16 flex-col justify-between">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop"
          alt="Community Meetup"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-indigo-950/70 to-indigo-900/60 mix-blend-multiply" />

        <div className="relative z-10 space-y-6">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200">
            ✨ Unlock new experiences
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] max-w-md">
            Join the community shaping the future.
          </h2>
          <p className="text-base text-indigo-100/90 max-w-md leading-relaxed">
            Reserve tickets, save favorite meetups, or connect with organizers near you.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 dark:bg-[#0F1424]/80 backdrop-blur-xl border border-white/15 dark:border-[#1E2742] p-6 rounded-2xl max-w-lg shadow-2xl">
          <div className="flex gap-1 text-amber-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <p className="text-white text-sm font-medium leading-relaxed italic mb-3">
            "I've met co-founders and lifelong friends at events discovered right here on EventHub."
          </p>
          <span className="text-xs text-indigo-200/90 font-semibold tracking-wide">
            — David K., San Francisco
          </span>
        </div>
      </div>

      {/* Right 50%: Register Form Card */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white dark:bg-[#06080F] transition-colors">
        <div className="w-full max-w-md space-y-7">
          
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
              CREATE ACCOUNT
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Start your journey
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Join thousands discovering extraordinary experiences.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/50 animate-slide-up">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 gap-2 font-bold shadow-lg shadow-indigo-600/25 mt-3"
            >
              <span>{loading ? 'Registering...' : 'Create Account'}</span>
              {!loading && <ArrowRight size={16} />}
            </Button>

          </form>

          {/* Organizer Note */}
          <div className="pt-2 text-center space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Want to host and organize events?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Request Admin Access on the login page
              </Link>
            </p>
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Log in instead
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;
