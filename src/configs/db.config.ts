import mongoose from 'mongoose';

async function connectToMongoDb(dbName: string): Promise<void> {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT } =
    process.env;
  const authOptions: {
    auth?: {
      username: string;
      password: string;
    };
  } = {};

  if (MONGO_USERNAME && MONGO_PASSWORD) {
    authOptions.auth = {
      username: MONGO_USERNAME as string,
      password: MONGO_PASSWORD as string,
    };
  }
  const mongoUri = `mongodb://${MONGO_HOST}:${MONGO_PORT as string}/?serverSelectionTimeoutMS=3000&directConnection=true`;
  await mongoose.connect(mongoUri, {
    dbName,
    serverSelectionTimeoutMS: 3000,
    ...authOptions,
  });
}

export default connectToMongoDb;
