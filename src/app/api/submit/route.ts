import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dbUri = process.env.DB_URI;

    if (!dbUri) {
      throw new Error('DB_URI environment variable is not defined.');
    }

    const client = new MongoClient(dbUri);

    try {
      await client.connect();
      const database = client.db('say-love-app'); // Ganti dengan nama database Anda
      const collection = database.collection('feedbacks'); // Ganti dengan nama koleksi Anda

      await collection.insertOne(data);

      return new Response(JSON.stringify({ message: 'Data saved successfully!' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Something went wrong:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong!' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
