ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_user_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Accounts" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Accounts" DROP COLUMN "user";