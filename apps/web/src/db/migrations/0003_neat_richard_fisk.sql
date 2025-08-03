ALTER TABLE "Accounts" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Accounts" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;