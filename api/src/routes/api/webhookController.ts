import { Request, Response } from "express";
import { verifyWebhook } from '@clerk/express/webhooks'
import { db } from '../../db/index.js';
import { usersTable } from "../../db/oldSchema.js";

export async function clerkRegisterUser(req: Request, res: Response) {
    try {
        const evt = await verifyWebhook(req)
        const { id } = evt.data
        const eventType = evt.type        
        if (evt.type === 'user.created') {
            // Check if Email exit
            // Create User in Database (clerkID, email)
            try {
                const [user] = await db.insert(usersTable).values({
                    clerkId: evt.data.id,
                    email: evt.data.email_addresses[0].email_address
                }).returning();
                res.status(201).json({message: "Create User Successfully"});
            } catch (error) {
                res.status(500).send(error);
            }
        }
        // Check Event if user.deleted >> Change Status
        return res.send('Webhook received')
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return res.status(400).send('Error verifying webhook')
    }
}