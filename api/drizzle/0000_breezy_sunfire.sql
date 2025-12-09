-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(225),
	"price" double precision NOT NULL,
	"quantity" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "clerkusers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clerkusers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "clerkusers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"password" varchar(225) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"twoFactorsSecret" varchar(225),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(225) NOT NULL,
	"provider" varchar(255) DEFAULT 'login',
	"providerId" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

*/