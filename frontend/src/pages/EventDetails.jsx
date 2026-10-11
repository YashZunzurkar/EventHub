import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Clock, 
  Ticket 
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

const categoryImages = {
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
  Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
  Workshop: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop',
  Conference: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1600&auto=format&fit=crop',
  Meetup: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600&auto=format&fit=crop',
  Business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
  'Art & culture': 'https://images.unsplash.com/photo-1460661419200-1868aeb56c80?q=80&w=1600&auto=format&fit=crop',
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
      
      if (user) {
        const regRes = await api.get('/registrations/me');
        const registered = regRes.data.some(reg => reg.event?._id === id);
        setIsRegistered(registered);
      }
    } catch (err) {
      setError('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActionLoading(true); 
    setError(''); 
    setSuccess('');
    try {
      await api.post(`/events/${id}/register`);
      setIsRegistered(true);
      setSuccess('🎉 Ticket secured! You are registered for this event.');
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    setActionLoading(true); 
    setError(''); 
    setSuccess('');
    try {
      await api.delete(`/events/${id}/register`);
      setIsRegistered(false);
      setSuccess('Registration cancelled successfully.');
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unregister');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-80 bg-slate-100 dark:bg-[#0F1424] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-100 dark:bg-[#0F1424] rounded-2xl" />
          <div className="h-80 bg-slate-100 dark:bg-[#0F1424] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-24 max-w-md mx-auto px-4 animate-fade-in">
        <AlertCircle size={40} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Event Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">This event may have been cancelled or removed.</p>
        <Button onClick={() => navigate('/events')} variant="secondary">Back to Events</Button>
      </div>
    );
  }

  const isPast = new Date(event.date) < new Date();
  const capacity = event.capacity || 50;
  const hash = (event._id || '1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const percentFilled = isPast ? 100 : Math.min(100, Math.max(35, (hash % 65) + 35));
  const seatsLeft = isPast ? 0 : Math.max(0, Math.round(capacity * (1 - percentFilled / 100)));

  const bannerImage = event.imageUrl || categoryImages[event.category] || categoryImages.Technology;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to events</span>
      </button>

      {/* Hero Image Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-[#1E2742] bg-slate-950 mb-10 shadow-2xl">
        <img
          src={bannerImage}
          alt={event.title}
          className="w-full h-72 sm:h-96 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-transparent to-black/30" />

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <Badge variant="primary" className="backdrop-blur-md shadow-md">
            {event.category}
          </Badge>
          <Badge 
            variant={isPast ? 'full' : 'upcoming'} 
            className="backdrop-blur-md shadow-md"
          >
            {isPast ? 'Past Event' : 'Upcoming Event'}
          </Badge>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Details & Venue */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* About Section */}
          <div className="p-8 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              About this event
            </h2>
            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {event.description}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Date and Time
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {formattedDate}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formattedTime}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Location
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {event.venue}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  In-person gathering
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Sticky Booking Widget Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] shadow-xl space-y-6">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                REGISTRATION
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {isPast ? 'Event Finished' : isRegistered ? 'Ticket Confirmed' : 'Reserve Your Spot'}
              </h3>
            </div>

            {/* Status alerts */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 border border-rose-200 dark:border-rose-900/50">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* Capacity meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{seatsLeft} seats left</span>
                <span>{percentFilled}% full</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    isPast ? 'bg-slate-400' : percentFilled > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              {isPast ? (
                <div className="text-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold">
                  This event took place in the past.
                </div>
              ) : isRegistered ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>You're attending!</span>
                  </div>
                  <Button 
                    onClick={handleUnregister}
                    disabled={actionLoading}
                    variant="danger"
                    size="md"
                    className="w-full text-xs"
                  >
                    {actionLoading ? 'Cancelling...' : 'Cancel Registration'}
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleRegister}
                  disabled={actionLoading || seatsLeft === 0}
                  size="lg"
                  className="w-full shadow-lg shadow-indigo-600/30 gap-2 font-bold"
                >
                  <Ticket size={18} />
                  <span>{actionLoading ? 'Registering...' : 'Register for Free'}</span>
                </Button>
              )}
            </div>

            {/* Footnote */}
            <p className="text-[11px] text-slate-400 text-center">
              Free cancellation anytime • Instant ticket confirmation
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};

export default EventDetails;
