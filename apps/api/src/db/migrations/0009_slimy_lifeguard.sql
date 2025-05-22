ALTER TABLE "Trips" RENAME COLUMN "account" TO "driver";--> statement-breakpoint
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_account_Profile_id_fk";
--> statement-breakpoint
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_driver_Profile_id_fk" FOREIGN KEY ("driver") REFERENCES "public"."Profile"("id") ON DELETE no action ON UPDATE no action;