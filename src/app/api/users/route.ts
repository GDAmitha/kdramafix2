// import { NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';

// // Get active users
// export async function GET() {
//     try {
//       const client = await clientPromise;
//       const db = client.db("kdramafix");
      
//       const users = await db
//         .collection("users")
//         .find({ lastActive: { $gt: new Date(Date.now() - 5 * 60 * 1000) } })
//         .toArray();
  
//       console.log('Found users:', users); // Add this log
//       return NextResponse.json(users || []); // Return empty array if users is null/undefined
//     } catch (e) {
//       console.error('Detailed error:', e);
//       return NextResponse.json([]); // Return empty array instead of error object
//     }
//   }

// // Update user activity
// export async function POST(request: Request) {
//   try {
//     const { username } = await request.json();
//     const client = await clientPromise;
//     const db = client.db("kdramafix");
    
//     const result = await db.collection("users").updateOne(
//       { username },
//       { 
//         $set: { 
//           username,
//           lastActive: new Date() 
//         } 
//       },
//       { upsert: true }
//     );
    
//     return NextResponse.json(result);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  console.log('GET /api/users called');
  try {
    const client = await clientPromise;
    console.log('MongoDB connected');
    
    const db = client.db("kdramafix");
    console.log('Database selected');
    
    const users = await db
      .collection("users")
      .find({ lastActive: { $gt: new Date(Date.now() - 5 * 60 * 1000) } })
      .toArray();

    console.log('Users found:', users);

    if (!users) {
      console.log('No users found, returning empty array');
      return NextResponse.json([]);
    }

    return NextResponse.json(users);
  } catch (e) {
    console.error('Detailed error in GET /api/users:', e);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  console.log('POST /api/users called');
  try {
    const { username } = await request.json();
    console.log('Received username:', username);

    const client = await clientPromise;
    console.log('MongoDB connected');

    const db = client.db("kdramafix");
    
    const result = await db.collection("users").updateOne(
      { username },
      { 
        $set: { 
          username,
          lastActive: new Date() 
        } 
      },
      { upsert: true }
    );
    
    console.log('Update result:', result);
    return NextResponse.json(result);
  } catch (e) {
    console.error('Detailed error in POST /api/users:', e);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}