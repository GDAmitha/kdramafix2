import { pusher } from '@/lib/pusher-server'; // If using JavaScript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const socketId = data.socket_id;
  const channel = data.channel_name;
  const username = data.username; // You'll need to pass this from the client

  const authResponse = pusher.authorizeChannel(socketId, channel, {
    user_id: username,
    user_info: {
      username: username
    }
  });

  return NextResponse.json(authResponse);
}