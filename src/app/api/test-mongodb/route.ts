// // import { NextResponse } from 'next/server';
// // import clientPromise from '@/lib/mongodb';

// // export async function GET() {
// //   try {
// //     console.log('Testing MongoDB connection...');
// //     const client = await clientPromise;
// //     const db = client.db("kdramafix");
    
// //     // Try to perform a simple operation
// //     const testCollection = db.collection('test');
// //     const testDoc = { test: true, timestamp: new Date() };
    
// //     // Insert a test document
// //     console.log('Inserting test document...');
// //     const insertResult = await testCollection.insertOne(testDoc);
// //     console.log('Insert result:', insertResult);
    
// //     // Read it back
// //     console.log('Reading test document...');
// //     const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
// //     console.log('Found document:', foundDoc);
    
// //     // Delete it
// //     console.log('Cleaning up test document...');
// //     await testCollection.deleteOne({ _id: insertResult.insertedId });
    
// //     return NextResponse.json({
// //       success: true,
// //       message: "MongoDB connection test successful",
// //       testResults: {
// //         inserted: insertResult,
// //         found: foundDoc
// //       }
// //     });
// //   } catch (e) {
// //     console.error('MongoDB test failed:', e);
// //     return NextResponse.json({
// //       success: false,
// //       error: e.message,
// //       fullError: e
// //     }, { status: 500 });
// //   }
// // }


// import { NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';

// export async function GET() {
//   try {
//     console.log('Testing MongoDB connection...');
//     const client = await clientPromise;
//     const db = client.db("kdramafix");
    
//     // Test reactions collection
//     const reactionsCollection = db.collection('reactions');
//     const testReaction = {
//       type: 'test-reaction',
//       timestamp: 0,
//       userId: 'test-user',
//       username: 'Test User',
//       createdAt: new Date(),
//     };
    
//     // Insert test reaction
//     console.log('Inserting test reaction...');
//     const insertResult = await reactionsCollection.insertOne(testReaction);
//     console.log('Insert result:', insertResult);
    
//     // Read it back
//     console.log('Reading test reaction...');
//     const foundReaction = await reactionsCollection.findOne({ _id: insertResult.insertedId });
//     console.log('Found reaction:', foundReaction);
    
//     // Delete test data
//     console.log('Cleaning up test reaction...');
//     await reactionsCollection.deleteOne({ _id: insertResult.insertedId });
    
//     return NextResponse.json({
//       success: true,
//       message: "MongoDB reactions collection test successful",
//       testResults: {
//         inserted: insertResult,
//         found: foundReaction
//       }
//     });
//   } catch (error: any) { // Type the error as any or use a more specific type
//     console.error('MongoDB test failed:', error);
//     return NextResponse.json({
//       success: false,
//       error: error.message || 'Unknown error occurred',
//       fullError: error
//     }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    // Set a timeout for the operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 8000) // 8 second timeout
    })

    const connectionPromise = async () => {
      const client = await clientPromise
      const db = client.db("your_database_name")
      
      // Quick test query
      const result = await db.command({ ping: 1 })
      return { success: true, message: "Connected successfully!", result }
    }

    // Race between timeout and connection
    const response = await Promise.race([connectionPromise(), timeoutPromise])

    return NextResponse.json(response)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    )
  }
}