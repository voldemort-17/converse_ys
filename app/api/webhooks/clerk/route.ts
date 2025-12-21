import { prisma } from '@/lib/client';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req, {signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET});

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data);
    if(evt.type === "user.created"){
      try {
        await prisma.user.create({
          data: {
            id: id as string,
            username: evt.data.username ?? `${evt.data.first_name ?? ""}${evt.data.last_name ?? ""}`.trim() ?? `user_${evt.data.id}`,
            avatar: evt.data.image_url || "/AvatarImage.jpg",
            cover: "/CoverImage.jpg"
          }
        })
        return new Response("User is created Successfully !", {status: 201})
      } catch (error) {
        console.log('error', error)
        return new Response("Failed to create the user!", {status: 500})
      }
    }
    if(evt.type === "user.updated"){
      try {
        await prisma.user.update({
          where: {
            id: evt.data.id
          },
          data: {
            username: evt.data.username ?? `${evt.data.first_name ?? ""}${evt.data.last_name ?? ""}`.trim() ?? `user_${evt.data.id}`,
            avatar: evt.data.image_url || "/AvatarImage.jpg"
          }
        });
        return new Response("User is Updated Successfully !", {status: 201})
      } catch (error) {
        console.log('error', error)
        return new Response("Failed to update the user!", {status: 500})
      }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}