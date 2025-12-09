ALTER TABLE "clerkusers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "clerkusers" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerkId" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "twoFactorsSecret";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "provider";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "providerId";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId");