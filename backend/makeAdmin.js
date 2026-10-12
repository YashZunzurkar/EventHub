const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address.');
    console.log('Usage: node makeAdmin.js <user-email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management');
    console.log("This is database url :", process.env.MONGO_URI )
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Success! ${email} has been promoted to Admin.`);
    console.log('You can now log in and access the Admin Dashboard.');
    
  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

makeAdmin();
