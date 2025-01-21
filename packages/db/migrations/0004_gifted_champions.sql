CREATE TABLE "Trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"departure" date NOT NULL,
	"price" numeric NOT NULL,
	"createdAt" date NOT NULL,
	"updatedAt" date NOT NULL,
	"account" uuid
);
--> statement-breakpoint
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_account_Accounts_id_fk" FOREIGN KEY ("account") REFERENCES "public"."Accounts"("id") ON DELETE no action ON UPDATE no action;