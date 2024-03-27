import mongoose from 'mongoose';

export async function connectToDB() {
  const MONGODB_URI = `${process.env.DB_URL}?retryWrites=true&w=majority`;
  let client;
  try {
    client = await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.log(error + ' Db connection failed!');
    throw error;
  }
  return client;
}
