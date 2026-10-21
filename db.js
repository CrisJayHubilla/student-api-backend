// db.js
const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    // Clear the cached promise if the connection fails so a later request can retry
    cached.promise.catch(() => {
      cached.promise = null;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectToDatabase;
