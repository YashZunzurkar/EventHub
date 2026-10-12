import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

interface IEvent {
  title: string;
  description: string;
  category: string;
  date: Date;
  venue: string;
  capacity: number;
  imageUrl: string;
}

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  category: { type: String, required: true },
  capacity: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

const sampleEvents: IEvent[] = [
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

const seedEvents = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    // Count existing events
    const existingCount = await Event.countDocuments();
    console.log(`Current event count in database: ${existingCount}`);

    if (existingCount === 0) {
      console.log('Inserting initial showcase events...');
      const created = await Event.insertMany(sampleEvents);
      console.log(`🎉 Successfully seeded ${created.length} showcase events into MongoDB Atlas!`);
    } else {
      console.log('Events already present. Inserting any sample events if needed...');
      // Insert if not already matching by title
      for (const ev of sampleEvents) {
        const exists = await Event.findOne({ title: ev.title });
        if (!exists) {
          await Event.create(ev);
          console.log(`+ Added: "${ev.title}"`);
        } else {
          console.log(`• Already exists: "${ev.title}"`);
        }
      }
      console.log('🎉 Seeding check complete!');
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

seedEvents();
