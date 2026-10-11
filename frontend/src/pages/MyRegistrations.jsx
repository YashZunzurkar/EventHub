import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import EventCard from '../components/EventCard';
import { Ticket, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get('/registrations/me');
        setRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in pb-24">
      
      {/* Page Header */}
      <div className="mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
          YOUR TICKETS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          My Registrations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Events you have signed up for. Show up, connect, and enjoy!
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="h-[390px] rounded-2xl bg-slate-100 dark:bg-[#0F1424] border border-slate-200/60 dark:border-[#1E2742] animate-pulse"
            />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 bg-white dark:bg-[#0F1424] rounded-2xl border border-slate-200/80 dark:border-[#1E2742] shadow-sm max-w-xl mx-auto p-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
            <Ticket size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No registrations yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
            You haven't registered for any events yet. Explore upcoming gatherings and claim your first pass!
          </p>
          <Link to="/events">
            <Button size="md" className="gap-2 shadow-lg shadow-indigo-600/25">
              <span>Explore events</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        /* Registrations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.filter(reg => reg.event).map((reg) => (
            <EventCard key={reg._id} event={reg.event} />
          ))}
        </div>
      )}

    </div>
  );
};

export default MyRegistrations;
