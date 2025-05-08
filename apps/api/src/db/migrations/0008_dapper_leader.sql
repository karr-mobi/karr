ALTER TABLE "Trips" DROP CONSTRAINT "Trips_account_Accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_account_Profile_id_fk" FOREIGN KEY ("account") REFERENCES "public"."Profile"("id") ON DELETE no action ON UPDATE no action;