import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Get all reactions
// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("kdramafix");
    
//     const reactions = await db
//       .collection("reactions")
//       .find({})
//       .sort({ timestamp: 1 })
//       .toArray();

//     return NextResponse.json(reactions);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
//   }
// }


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kdramafix");
    
    const reactions = await db.collection("reactions").find({}).toArray();
    return NextResponse.json(reactions || []); // Always return an array

  } catch (e) {
    console.error(e);
    return NextResponse.json([]); // Return empty array on error
  }
}

// Save a new reaction
export async function POST(request: Request) {
  try {
    const reaction = await request.json();
    const client = await clientPromise;
    const db = client.db("kdramafix");
    
    const result = await db.collection("reactions").insertOne(reaction);
    
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 });
  }
}