import mongodb from 'mongodb';
import config from './env.js';

const MongoClient = mongodb.MongoClient;
const uri = config.db.uri;

export default async function withDB(func, res) {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db('86itDB');
    return await func(db);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error connecting to MongoDB: ${err}` });
  } finally {
    client.close();
  }
}
