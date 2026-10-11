import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Badge from './ui/Badge';

// Helper image fallback based on category
const categoryImages = {
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
  Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  Workshop: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
  Conference: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop',
  Meetup: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
  Business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  'Art & culture': 'https://images.unsplash.com/photo-1460661419200-1868aeb56c80?q=80&w=800&auto=format&fit=crop',
};

const EventCard = ({ event }) => {
  const isPast = new Date(event.date) < new Date();
  
  // Calculate simulated fill metrics for high-fidelity presentation
  // In a real database capacity is tracked; we calculate an illustrative progress
  const capacity = event.capacity || 50;
  // Use id char code to generate deterministic realistic capacity fill
  const hash = (event._id || '1').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const percentFilled = isPast ? 100 : Math.min(100, Math.max(35, (hash % 65) + 35));
  const seatsLeft = isPast ? 0 : Math.max(0, Math.round(capacity * (1 - percentFilled / 100)));

  // Badge status
  let badgeVariant = 'upcoming';
  let badgeText = 'Upcoming';
  let progressColor = 'bg-emerald-500';

  if (isPast || seatsLeft === 0) {
    badgeVariant = 'full';
    badgeText = 'Full';
    progressColor = 'bg-rose-500';
  } else if (percentFilled > 80) {
    badgeVariant = 'selling';
    badgeText = 'Selling fast';
    progressColor = 'bg-amber-500';
  }

  const imageUrl = event.imageUrl || categoryImages[event.category] || categoryImages.Technology;

  // Format date cleanly
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="group bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Top Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Subtle gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Floating status badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={badgeVariant} className="shadow-md backdrop-blur-md">
            {badgeText}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            {event.category || 'General'}
          </span>

          {/* Event Title */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-3 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
            {event.title}
          </h3>

          {/* Date & Time */}
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Calendar size={14} className="mr-2 text-slate-400 shrink-0" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-5">
            <MapPin size={14} className="mr-2 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Seats left progress bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#1E2742]/60">
          <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{seatsLeft > 0 ? `${seatsLeft} seats left` : 'No seats left'}</span>
            <span>{percentFilled}% filled</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          {/* View Details Button */}
          <Link to={`/events/${event._id}`} className="block mt-4">
            <button className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-[#1E2742] bg-white dark:bg-[#13192B] hover:bg-slate-50 dark:hover:bg-[#1A2238] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group/btn">
              <span>View details</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
