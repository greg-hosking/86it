import mongodb from 'mongodb';

export default async function withDB(func, res) {
  const MongoClient = mongodb.MongoClient;
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db('86itDB');
    return await func(db);
  } catch (err) {
    return res
      .send(500)
      .json({ message: `Error connecting to MongoDB: ${err}` });
  } finally {
    client.close();
  }
}
