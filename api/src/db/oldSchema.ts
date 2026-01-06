import { pgTable, integer, varchar, text, doublePrecision, unique, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const productsTable = pgTable("products", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    image: varchar({ length: 225 }),
    price: doublePrecision().notNull(),
    quantity: integer().default(0),
});

export const userTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).unique(),
    clerkId: varchar({ length: 255 }).unique(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    role: varchar({ length: 255 }).default('user'),
});
