import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  User as UserIcon, 
  CheckCircle2,
  X,
  SendHorizontal,
  Clock
} from 'lucide-react';
import Button from '../components/ui/Button';

const Login = () => {
  const [roleTab, setRoleTab] = useState('user'); // 'user' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [requestStatus, setRequestStatus] = useState('none'); // 'none' | 'pending' | 'rejected'
  const [loading, setLoading] = useState(false);

  // Request Access modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqEmail, setReqEmail] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [reqMsg, setReqMsg] = useState('');
  const [reqError, setReqError] = useState('');
  const [reqLoading, setReqLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');
    setRequestStatus('none');
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password,
        expectedRole: roleTab // 'user' or 'admin'
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

      // Route based on role
      if (roleTab === 'admin' || response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/events');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      const status = err.response?.data?.requestStatus || 'none';
      setError(errMsg);
      setRequestStatus(status);
      if (err.response?.data?.email) {
        setReqEmail(err.response.data.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setReqLoading(true);
    setReqError('');
    setReqMsg('');
    try {
      const res = await api.post('/auth/request-admin', {
        email: reqEmail || email,
        reason: reqReason
      });
      setReqMsg(res.data.message);
      setRequestStatus('pending');
      setTimeout(() => {
        setShowRequestModal(false);
      }, 3500);
    } catch (err) {
      setReqError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
      
      {/* Left 50%: Visual Showcase & Testimonial */}
      <div className="hidden lg:flex lg:col-span-6 relative overflow-hidden bg-slate-950 p-12 lg:p-16 flex-col justify-between">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop"
          alt="Concert Experience"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-indigo-950/70 to-indigo-900/60 mix-blend-multiply" />

        <div className="relative z-10 space-y-6">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200">
            ✨ Built for real connection
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] max-w-md">
            Welcome back to what matters.
          </h2>
          <p className="text-base text-indigo-100/90 max-w-md leading-relaxed">
            Your next inspiring talk, unforgettable show, or favorite community is waiting.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 dark:bg-[#0F1424]/80 backdrop-blur-xl border border-white/15 dark:border-[#1E2742] p-6 rounded-2xl max-w-lg shadow-2xl">
          <div className="flex gap-1 text-amber-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <p className="text-white text-sm font-medium leading-relaxed italic mb-3">
            "EventHub has become my shortcut to the best things happening in the city."
          </p>
          <span className="text-xs text-indigo-200/90 font-semibold tracking-wide">
            — Maya L., Brooklyn
          </span>
        </div>
      </div>

      {/* Right 50%: Login Form Card */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white dark:bg-[#06080F] transition-colors">
        <div className="w-full max-w-md space-y-7">
          
          {/* Role Switcher Tabs */}
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-[#0F1424] border border-slate-200 dark:border-[#1E2742] grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => { setRoleTab('user'); setError(''); setRequestStatus('none'); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                roleTab === 'user'
                  ? 'bg-white dark:bg-[#1E2742] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserIcon size={14} />
              <span>User Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setRoleTab('admin'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                roleTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Header */}
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
              {roleTab === 'admin' ? 'ADMINISTRATOR ACCESS' : 'MEMBER ACCESS'}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {roleTab === 'admin' ? 'Admin Workspace' : 'Good to see you again'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              {roleTab === 'admin' 
                ? 'Sign in with approved administrator credentials.' 
                : 'Enter your details to access your account.'
              }
            </p>
          </div>

          {/* Error Banner with Request CTA */}
          {error && (
            <div className={`p-4 rounded-xl text-xs border space-y-2.5 animate-slide-up ${
              requestStatus === 'pending' 
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
            }`}>
              <div className="flex items-start gap-2.5">
                {requestStatus === 'pending' ? <Clock size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                <p className="font-semibold leading-relaxed">{error}</p>
              </div>

              {/* Show Request Admin Access Button if not admin */}
              {roleTab === 'admin' && requestStatus !== 'pending' && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setReqEmail(email);
                      setShowRequestModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <SendHorizontal size={13} />
                    <span>Request Admin Access from Administrator</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleTab === 'admin' ? 'admin@example.com' : 'alex@example.com'}
                  required
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-[#1E2742] text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 gap-2 font-bold shadow-lg ${
                roleTab === 'admin' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30' : 'shadow-indigo-600/25'
              }`}
            >
              <span>{loading ? 'Authenticating...' : roleTab === 'admin' ? 'Log in to Admin Workspace' : 'Log in'}</span>
              {!loading && <ArrowRight size={16} />}
            </Button>

          </form>

          {/* Bottom Actions */}
          <div className="pt-2 text-center space-y-2">
            {roleTab === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  setReqEmail(email);
                  setShowRequestModal(true);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1.5"
              >
                <ShieldCheck size={14} />
                <span>Need event organizer access? Request Approval</span>
              </button>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              New to EventHub?{' '}
              <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Create an attendee account
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* REQUEST ADMIN ACCESS MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0F1424] border border-slate-200 dark:border-[#1E2742] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Request Admin Privileges
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Subject to administrator review & approval
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {reqError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold">
                {reqError}
              </div>
            )}
            {reqMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{reqMsg}</span>
              </div>
            )}

            {!reqMsg && (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Why do you want Admin access? (Optional)
                  </label>
                  <textarea
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    placeholder="e.g. I am an organizer hosting weekly developer meetups..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowRequestModal(false)}
                    className="w-full text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={reqLoading}
                    className="w-full text-xs shadow-md shadow-indigo-600/30"
                  >
                    {reqLoading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
