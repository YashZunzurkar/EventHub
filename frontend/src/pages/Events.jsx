import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import EventCard from '../components/EventCard';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Code, 
  Music, 
  Trophy, 
  Briefcase, 
  Palette, 
  Ticket, 
  CheckCircle2, 
  ChevronDown,
  CalendarDays
} from 'lucide-react';
import Button from '../components/ui/Button';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Technology', icon: Code, count: '120+ events' },
    { name: 'Music', icon: Music, count: '94+ events' },
    { name: 'Sports', icon: Trophy, count: '62+ events' },
    { name: 'Workshops', icon: Sparkles, count: '86+ events' },
    { name: 'Business', icon: Briefcase, count: '73+ events' },
    { name: 'Art & culture', icon: Palette, count: '51+ events' },
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (category) query.append('category', category);
      
      const response = await api.get(`/events?${query.toString()}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
    const el = document.getElementById('events-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in pb-20">
      
      {/* 1. HERO SECTION (Exact match to reference screenshots) */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & Search Widget */}
            <div className="lg:col-span-7 space-y-6 lg:pr-6">
              
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>Your next experience starts here</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Discover and join events that{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  matter.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Meet your people, learn something new, and make memories at handpicked events near you.
              </p>

              {/* Search Widget */}
              <form 
                onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-[#0F1424] border border-slate-200 dark:border-[#1E2742] p-2 rounded-2xl shadow-xl dark:shadow-indigo-500/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl transition-all"
              >
                {/* Search Input */}
                <div className="relative flex-grow flex items-center">
                  <Search size={18} className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search events, topics, or venues"
                    className="w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="sm:border-l border-slate-200 dark:border-[#1E2742] sm:pl-3 relative flex items-center">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Filter events by category"
                    className="w-full sm:w-auto py-2 pr-8 pl-2 bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="" className="dark:bg-[#0F1424] dark:text-white">All categories</option>
                    <option value="Technology" className="dark:bg-[#0F1424] dark:text-white">Technology</option>
                    <option value="Music" className="dark:bg-[#0F1424] dark:text-white">Music</option>
                    <option value="Workshop" className="dark:bg-[#0F1424] dark:text-white">Workshop</option>
                    <option value="Conference" className="dark:bg-[#0F1424] dark:text-white">Conference</option>
                    <option value="Meetup" className="dark:bg-[#0F1424] dark:text-white">Meetup</option>
                    <option value="Business" className="dark:bg-[#0F1424] dark:text-white">Business</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 text-slate-400 pointer-events-none" />
                </div>

                {/* Search Button */}
                <Button 
                  type="submit" 
                  variant="dark"
                  size="sm"
                  className="px-6 py-2.5 rounded-xl shrink-0"
                >
                  Search
                </Button>
              </form>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="#events-section">
                  <Button size="md" className="gap-2 px-6">
                    <span>Browse events</span>
                    <ArrowRight size={16} />
                  </Button>
                </a>
                <Link to="/register">
                  <Button variant="secondary" size="md" className="px-6">
                    Create account
                  </Button>
                </Link>
              </div>

              {/* Social Proof Avatars */}
              <div className="flex items-center gap-3 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#06080F] bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
                    ML
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#06080F] bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">
                    SK
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#06080F] bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#06080F] bg-slate-800 text-[10px] font-bold text-white flex items-center justify-center">
                    +
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Join <span className="font-bold text-slate-900 dark:text-white">10,000+</span> curious people
                </p>
              </div>

            </div>

            {/* Right Column: Hero Showcase Event Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Soft purple glow blob behind card */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-purple-500/10 rounded-full blur-3xl -z-10" />
              
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-[#1E2742] bg-slate-900">
                {/* Showcase Concert Image */}
                <img
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop"
                  alt="Featured Concert"
                  className="w-full h-[430px] object-cover"
                />
                
                {/* Floating Date Badge (Top-Left) */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#0F1424]/95 backdrop-blur-md border border-slate-200/60 dark:border-[#1E2742] rounded-2xl px-3.5 py-2 text-center shadow-lg">
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                    JUN
                  </span>
                  <span className="block text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    14
                  </span>
                </div>

                {/* Floating Attendance Badge (Bottom-Right) */}
                <div className="absolute bottom-5 right-5 bg-white/95 dark:bg-[#0F1424]/95 backdrop-blur-md border border-slate-200/60 dark:border-[#1E2742] rounded-2xl p-3.5 shadow-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      328 attending
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    Only 24 seats left
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* 2. STATS STRIP (Exact match to reference screenshots) */}
      <section className="border-y border-slate-200/80 dark:border-[#1E2742] bg-slate-50/50 dark:bg-[#080B14] py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-[#1E2742]">
            
            <div className="text-center pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                500<span className="text-indigo-600 dark:text-indigo-400">+</span>
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Curated events
              </p>
            </div>

            <div className="text-center pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                10k<span className="text-indigo-600 dark:text-indigo-400">+</span>
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Active members
              </p>
            </div>

            <div className="text-center pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                50<span className="text-indigo-600 dark:text-indigo-400">+</span>
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Categories
              </p>
            </div>

            <div className="text-center pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                4.9<span className="text-indigo-600 dark:text-indigo-400">/5</span>
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Community rating
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* 3. HANDPICKED FOR YOU - EVENTS GRID */}
      <section id="events-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
              HANDPICKED FOR YOU
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Events worth showing up for
            </h2>
          </div>

          <button 
            onClick={() => { setSearch(''); setCategory(''); }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>View all events</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-[390px] rounded-2xl bg-slate-100 dark:bg-[#0F1424] border border-slate-200/60 dark:border-[#1E2742] animate-pulse"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-slate-50 dark:bg-[#0F1424] rounded-2xl border border-slate-200/80 dark:border-[#1E2742]">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
              <CalendarDays size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No events match your search
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Try adjusting your category filter or search keywords.
            </p>
            <Button 
              onClick={() => { setSearch(''); setCategory(''); }} 
              size="sm"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

      </section>


      {/* 4. EXPLORE YOUR INTERESTS - CATEGORY CARDS (From Screenshot 2) */}
      <section id="categories" className="py-16 bg-slate-50/50 dark:bg-[#080B14] border-y border-slate-200/80 dark:border-[#1E2742] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
              EXPLORE YOUR INTERESTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              There's something for everyone
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = category.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setCategory(isSelected ? '' : cat.name);
                    const el = document.getElementById('events-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 group relative flex flex-col justify-between h-36 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                      : 'bg-white dark:bg-[#0F1424] hover:bg-slate-50 dark:hover:bg-[#13192B] border-slate-200/80 dark:border-[#1E2742]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform'
                    }`}>
                      <IconComp size={18} />
                    </div>
                    <ArrowRight 
                      size={14} 
                      className={`transition-all duration-200 ${
                        isSelected 
                          ? 'text-white' 
                          : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                      }`} 
                    />
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold truncate ${
                      isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                    }`}>
                      {cat.name}
                    </h4>
                    <span className={`text-[11px] block mt-0.5 ${
                      isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {cat.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>


      {/* 5. SIMPLE BY DESIGN - 3 STEP WORKFLOW (From Screenshot 3) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
            SIMPLE BY DESIGN
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            From discovery to front row
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div 
            onClick={() => {
              const el = document.getElementById('events-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-center space-y-4 p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="relative w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search size={24} />
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm">
                01
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Find your event
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Search by interest, date, or location and discover something exciting.
            </p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => {
              const el = document.getElementById('events-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-center space-y-4 p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="relative w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ticket size={24} />
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm">
                02
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Save your spot
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Register in a few clicks. Your ticket lands right in your inbox.
            </p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => {
              const el = document.getElementById('events-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-center space-y-4 p-6 rounded-2xl bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-[#1E2742] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="relative w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm">
                03
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Show up & enjoy
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We'll send a reminder. You bring the energy and make it memorable.
            </p>
          </div>

        </div>

      </section>


      {/* 6. CALL TO ACTION BANNER (From Screenshot 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-8 sm:p-12 lg:p-16 text-white shadow-2xl shadow-indigo-600/20">
          
          {/* Subtle background circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-40 -top-20 w-60 h-60 rounded-full bg-violet-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/25">
                Built for connection
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Your next great story starts with one event.
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base">
                Join thousands discovering what's happening around them.
              </p>
            </div>

            <Link to="/register" className="shrink-0">
              <Button 
                variant="white" 
                size="lg" 
                className="gap-2 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-indigo-700"
              >
                <span>Get started free</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Events;
