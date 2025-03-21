import mongoose from 'mongoose';
import config from './env';

class Database {
  private static instance: Database;
  private constructor() {
    this.connect();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async connect() {
    try {
      await mongoose.connect(config.MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  }
}

export default Database.getInstance();
