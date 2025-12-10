import { Request, Response } from "express";
import { verifyWebhook } from '@clerk/express/webhooks'
import { db } from '../../db/index.js';
import { eq } from "drizzle-orm";
import { userTable } from "../../db/oldSchema.js";

export async function clerkRegisterUser(req: Request, res: Response) {
    try {
        const evt = await verifyWebhook(req)

        // Do something with payload
        // For this guide, log payload to console
        const { id } = evt.data
        const eventType = evt.type
        // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        // console.log('Webhook payload:', evt.data)
        if (evt.type === 'user.created') {
            // Create User in Database
            try {
                const [user] = await db.insert(userTable).values({
                    clerkId: evt.data.id
                }).returning();
                res.status(201).json({message: "Create User Successfully"});
            } catch (error) {
                res.status(500).send(error);
            }
        }
        return res.send('Webhook received')
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return res.status(400).send('Error verifying webhook')
    }
}