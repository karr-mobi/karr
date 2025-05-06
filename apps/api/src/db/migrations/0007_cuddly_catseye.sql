ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_phone_unique";--> statement-breakpoint
ALTER TABLE "Profile" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "Accounts" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_phone_unique" UNIQUE("phone");