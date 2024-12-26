// // import { Server } from 'socket.io';
// // import type { NextApiRequest, NextApiResponse } from 'next';

// // const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
// //   if (!res.socket.server.io) {
// //     const io = new Server(res.socket.server);
// //     res.socket.server.io = io;

// //     io.on('connection', socket => {
// //       console.log('Client connected');
      
// //       socket.on('new-reaction', (reaction) => {
// //         socket.broadcast.emit('reaction-received', reaction);
// //       });
// //     });
// //   }
// //   res.end();
// // };

// // export default ioHandler;

// // export const config = {
// //   api: {
// //     bodyParser: false
// //   }
// // };

// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import { NextApiRequest } from 'next';
// import { NextResponse } from 'next/server';

// const ioHandler = (req: NextApiRequest, res: any) => {
//   if (!res.socket.server.io) {
//     console.log('Setting up Socket.io');
//     const path = '/api/socket';
//     const httpServer = res.socket.server as any;
//     const io = new Server(httpServer, {
//       path: path,
//       addTrailingSlash: false,
//     });

//     io.on('connection', socket => {
//       console.log('Socket connected');

//       socket.on('new-reaction', data => {
//         console.log('New reaction:', data);
//         socket.broadcast.emit('reaction-received', data);
//       });

//       socket.on('disconnect', () => {
//         console.log('Socket disconnected');
//       });
//     });

//     res.socket.server.io = io;
//   }
//   return NextResponse.json({ success: true });
// }

// export const GET = ioHandler;
// export const POST = ioHandler;




import { NextRequest, NextResponse } from 'next/server';
import { initSocket } from '@/lib/socket';

export async function GET(request: NextRequest) {
  try {
    // @ts-ignore - Next.js doesn't expose the server type properly
    const server = request.socket.server;
    const io = initSocket(server);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize socket' },
      { status: 500 }
    );
  }
}