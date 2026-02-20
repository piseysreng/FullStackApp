import { Request, Response } from "express";
import { verifyWebhook } from '@clerk/express/webhooks'
import { db } from '../../db/index.js';
import { usersTable } from "../../db/oldSchema.js";

export async function clerkRegisterUser(req: Request, res: Response) {
    try {
        const evt = await verifyWebhook(req);
        const { id } = evt.data;
        const eventType = evt.type;

        if (eventType === 'user.created') {
            try {
                const [user] = await db.insert(usersTable).values({
                    clerkId: id,
                    email: evt.data.email_addresses?.[0]?.email_address || "",
                    username: evt.data.username ?? null,
                    firstName: evt.data.first_name ?? "",
                    lastName: evt.data.last_name ?? "",
                    avatar: evt.data.image_url ?? "",
                }).returning();

                // ADD RETURN HERE to stop execution
                return res.status(201).json({ message: "Create User Successfully", user });
            } catch (error) {
                console.error("Database Insert Error:", error);
                // ADD RETURN HERE
                return res.status(500).json({ error: "Failed to create user in database" });
            }
        }

        // Handle other event types here (e.g., user.deleted)
        if (eventType === 'user.deleted') {
            // Logic for deletion...
            return res.status(200).json({ message: "User deleted" });
        }

        // Default response for events you aren't handling yet
        return res.status(200).send('Webhook received');

    } catch (err) {
        console.error('Error verifying webhook:', err);
        // Ensure we only send an error if the headers haven't been sent yet
        if (!res.headersSent) {
            return res.status(400).send('Error verifying webhook');
        }
    }
}