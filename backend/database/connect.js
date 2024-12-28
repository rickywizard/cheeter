import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connection to database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDatabase;
