import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { 
  BarChart2, 
  Calendar, 
  Users, 
  Ticket, 
  Plus, 
  Search, 
  Trash2, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  X,
  ShieldCheck,
  ShieldAlert,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, totalUsers: 0 });
  const [events, setEvents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'events' | 'users'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    category: 'Technology',
    imageUrl: '',
  });

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes, requestsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/events'),
        api.get('/admin/requests'),
      ]);
      setStats(statsRes.data);
      setEvents(eventsRes.data);
      setPendingRequests(requestsRes.data.pendingRequests || []);
      setAllUsers(requestsRes.data.allUsers || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/events', formData);
      setSuccess('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        date: '',
        venue: '',
        capacity: '',
        category: 'Technology',
        imageUrl: '',
      });
      setShowCreateModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.delete(`/events/${id}`);
        setSuccess('Event removed successfully.');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        alert('Error deleting event');
      }
    }
  };

  const handleApproveRequest = async (userId) => {
    try {
      const res = await api.post(`/admin/requests/${userId}/approve`);
      setSuccess(res.data.message);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert('Failed to approve request');
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const res = await api.post(`/admin/requests/${userId}/reject`);
      setSuccess(res.data.message);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert('Failed to decline request');
    }
  };

  // Mock bar chart heights for visualization
  const monthlyData = [
    { month: 'Jan', height: '40%' },
    { month: 'Feb', height: '60%' },
    { month: 'Mar', height: '55%' },
    { month: 'Apr', height: '80%' },
    { month: 'May', height: '70%' },
    { month: 'Jun', height: '95%' },
  ];

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06080F] text-slate-800 dark:text-slate-200 transition-colors flex">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 border-r border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0A0D17] p-5 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-6">
          
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              ADMIN WORKSPACE
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 dark:bg-[#13192B] text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0F1424] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 size={16} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'events'
                  ? 'bg-indigo-50 dark:bg-[#13192B] text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0F1424] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar size={16} />
              <span>Manage events</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'bg-indigo-50 dark:bg-[#13192B] text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0F1424] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} />
                <span>Access & Users</span>
              </div>
              {pendingRequests.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-[#1E2742]">
          <Link
            to="/events"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to EventHub</span>
          </Link>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0F1424] border border-slate-200/60 dark:border-[#1E2742]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Master Administrator
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400 shrink-0" />
          </div>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-grow p-6 sm:p-10 max-w-7xl overflow-y-auto">
        
        {/* Top Bar with Search & Quick Key */}
        <div className="flex justify-between items-center pb-8 border-b border-slate-200/80 dark:border-[#1E2742] mb-8">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, requests or attendees..."
              className="w-full pl-10 pr-12 py-2 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0F1424] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">
              ⌘ K
            </span>
          </div>

          <div className="flex md:hidden">
            <Link to="/events" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Header Greeting & Action Button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {todayFormatted}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Good morning, {user?.name?.split(' ')[0] || 'Admin'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Here's what's happening with your events today.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            size="md"
            className="gap-2 shadow-lg shadow-indigo-600/25 shrink-0"
          >
            <Plus size={16} />
            <span>Create event</span>
          </Button>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 animate-slide-up">
            <CheckCircle2 size={16} />
            <p>{success}</p>
          </div>
        )}

        {/* TAB 1: USERS & ACCESS REQUESTS TAB */}
        {activeTab === 'users' ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* Pending Requests Section */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert size={18} className="text-amber-500" />
                    <span>Pending Admin Access Requests</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review and approve attendees who requested organizer permissions.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  {pendingRequests.length} Pending
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-[#13192B] rounded-xl border border-dashed border-slate-200 dark:border-[#1E2742]">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    No pending requests!
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    All admin access requests have been reviewed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div 
                      key={req._id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-slate-50/50 dark:bg-[#13192B] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {req.name ? req.name.substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {req.name}
                            </h4>
                            <span className="text-[11px] text-slate-400">({req.email})</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic bg-white dark:bg-[#0F1424] p-2 rounded-lg border border-slate-200/60 dark:border-[#1E2742]">
                            "{req.adminRequestReason || 'Requested access to manage events'}"
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Requested on: {new Date(req.adminRequestDate || req.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleRejectRequest(req._id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2742] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-500 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <UserX size={14} />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => handleApproveRequest(req._id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-colors"
                        >
                          <UserCheck size={14} />
                          <span>Approve Admin</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Users Directory */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                User Directory & Roles
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2742] text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="pb-3 font-semibold">Name & Email</th>
                      <th className="pb-3 font-semibold">Current Role</th>
                      <th className="pb-3 font-semibold">Request Status</th>
                      <th className="pb-3 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2742]/60">
                    {allUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-[#13192B]/50 transition-colors">
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {u.email}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin' 
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                              : 'bg-slate-100 dark:bg-[#13192B] text-slate-600 dark:text-slate-400'
                          }`}>
                            {u.role === 'admin' ? 'Administrator' : 'Attendee'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="text-slate-500 capitalize text-xs">
                            {u.adminRequestStatus || 'none'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* TAB 2 & 3: DASHBOARD & EVENTS */
          <>
            {/* 3. METRIC CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total events</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    +12%
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {stats.totalEvents || events.length}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">vs. last month</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Registrations</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    +18%
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {stats.totalRegistrations || 128}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">vs. last month</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming events</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    +3
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {events.filter(e => new Date(e.date) >= new Date()).length}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">vs. last month</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active users</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    +6%
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {stats.totalUsers || 42}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">vs. last month</span>
              </div>

            </div>

            {/* 4. CHARTS & UPCOMING EVENTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Registrations overview
                    </h3>
                    <span className="text-xs text-slate-400">Last 6 months</span>
                  </div>
                  <span className="text-xs text-slate-500 border border-slate-200 dark:border-[#1E2742] px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#13192B]">
                    Last 6 months
                  </span>
                </div>

                <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4">
                  {monthlyData.map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div 
                        className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-indigo-700 to-indigo-500 opacity-80 group-hover:opacity-100 group-hover:scale-y-105 origin-bottom transition-all"
                        style={{ height: d.height }}
                      />
                      <span className="text-[11px] font-semibold text-slate-400">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Upcoming events
                      </h3>
                      <span className="text-xs text-slate-400">Next 30 days</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('events')} 
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {events.slice(0, 3).map((ev) => {
                      const evDate = new Date(ev.date);
                      return (
                        <div 
                          key={ev._id} 
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#13192B] border border-transparent hover:border-slate-200/60 dark:hover:border-[#1E2742] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#13192B] border border-indigo-200/50 dark:border-indigo-800/40 text-center flex flex-col justify-center shrink-0">
                              <span className="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                                {evDate.toLocaleDateString(undefined, { month: 'short' })}
                              </span>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">
                                {evDate.getDate()}
                              </span>
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {ev.title}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                {ev.capacity} capacity
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button 
                  onClick={() => setShowCreateModal(true)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                >
                  + Add new event
                </Button>
              </div>

            </div>

            {/* 5. RECENT EVENTS / MANAGE EVENTS TABLE */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Manage Events
                  </h3>
                  <span className="text-xs text-slate-400">Total {events.length} active events</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2742] text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="pb-3 font-semibold">Event Title</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Date & Venue</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2742]/60">
                    {events.map((ev) => {
                      const isPast = new Date(ev.date) < new Date();
                      return (
                        <tr key={ev._id} className="hover:bg-slate-50/50 dark:hover:bg-[#13192B]/50 transition-colors">
                          <td className="py-3.5 pr-4">
                            <span className="font-bold text-slate-900 dark:text-white block truncate max-w-xs">
                              {ev.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {ev.capacity} seats capacity
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <Badge variant="primary">{ev.category}</Badge>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="text-slate-800 dark:text-slate-300 block">
                              {new Date(ev.date).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                              {ev.venue}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 size={12} />
                              <span>{isPast ? 'Completed' : 'Live'}</span>
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDelete(ev._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </main>

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0F1424] border border-slate-200 dark:border-[#1E2742] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Create a new event
                </h3>
                <p className="text-xs text-slate-500">
                  Publish an event for your community.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Event Title
                </label>
                <Input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Future of Product 2025" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell people what makes this event special..."
                  required
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#0D1220] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Sports">Sports</option>
                    <option value="Business">Business</option>
                    <option value="Art & culture">Art & culture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Capacity (Seats)
                  </label>
                  <Input 
                    type="number"
                    name="capacity" 
                    value={formData.capacity} 
                    onChange={handleChange} 
                    placeholder="100" 
                    required 
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Date and Time
                </label>
                <Input 
                  type="datetime-local"
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Venue / Location
                </label>
                <Input 
                  name="venue" 
                  value={formData.venue} 
                  onChange={handleChange} 
                  placeholder="The Glasshouse, NYC or Online" 
                  required 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Banner Image URL (Optional)
                  </label>
                  <span className="text-[10px] text-slate-400">Auto-assigned if empty</span>
                </div>
                <Input 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange} 
                  placeholder="Paste an image link from Unsplash, Pexels, etc." 
                />
                {formData.imageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden h-28 border border-slate-200 dark:border-[#1E2742]">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => e.target.style.display = 'none'} 
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={actionLoading}
                  className="w-full shadow-md shadow-indigo-600/30"
                >
                  {actionLoading ? 'Publishing...' : 'Publish Event'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
