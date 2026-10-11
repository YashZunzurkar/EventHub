import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Mail, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-2xl space-y-6">
        
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
            ACCOUNT RECOVERY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/50 animate-slide-up">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 animate-slide-up">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 gap-2 font-bold shadow-lg shadow-indigo-600/25"
            >
              <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-[#1E2742] text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Back to login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
