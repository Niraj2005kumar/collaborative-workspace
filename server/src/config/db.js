const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collaborative_workspace';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.warn('DNS SRV resolution failed. Retrying with Google/Cloudflare public DNS...');
      try {
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB connected: ${conn.connection.host} (via public DNS fallback)`);
        return;
      } catch (retryError) {
        console.error('MongoDB connection failed after DNS fallback:', retryError.message);
      }
    }
    console.warn('Continuing without MongoDB. Set MONGO_URI to a reachable MongoDB instance.');
  }
};

module.exports = connectDB;
