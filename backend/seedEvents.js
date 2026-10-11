const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const sampleEvents = [
  {
    title: 'Future of Product 2026',
    description: 'Join top product leaders, founders, and designers for an immersive full-day conference exploring the intersection of AI, design systems, and rapid prototyping.',
    category: 'Technology',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
    venue: 'The Glasshouse, NYC',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Midnight City Sessions',
    description: 'An intimate live music experience showcasing emerging indie artists, electronic producers, and immersive stage visuals.',
    category: 'Music',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20), // 20 days from now
    venue: 'Elsewhere, Brooklyn',
    capacity: 250,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Design Systems Workshop',
    description: 'A deep-dive masterclass into architecting scalable component libraries, token management, and modern React design tokens with hands-on practice.',
    category: 'Workshop',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 24), // 24 days from now
    venue: 'Newlab, Brooklyn',
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Global Tech Summit 2026',
    description: 'Connecting the world\'s most innovative software engineers, cloud architects, and tech visionaries for keynote presentations and workshops.',
    category: 'Conference',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
    venue: 'Javits Center, NYC',
    capacity: 500,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Founders & Venture Mixer',
    description: 'An evening of curated networking for early-stage startup founders, angel investors, and venture capitalists in a relaxed lounge atmosphere.',
    category: 'Business',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 42),
    venue: 'SoHo House, Manhattan',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Contemporary Art & Digital Media Expo',
    description: 'Exploring generative media, interactive projection mapping, and contemporary sculpture from leading international digital creators.',
    category: 'Art & culture',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 48),
    venue: 'Pioneer Works, Red Hook',
    capacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1460661419200-1868aeb56c80?q=80&w=1200&auto=format&fit=crop',
  },
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management');
    console.log('Connected to MongoDB for seeding...');

    // Check existing events count
    const count = await Event.countDocuments();
    if (count < 3) {
      console.log('Populating initial showcase events...');
      await Event.insertMany(sampleEvents);
      console.log(`✅ Successfully seeded ${sampleEvents.length} events!`);
    } else {
      console.log(`Database already has ${count} events.`);
    }
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedEvents();
