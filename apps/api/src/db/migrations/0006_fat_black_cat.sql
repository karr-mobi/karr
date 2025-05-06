ALTER TABLE "Users" RENAME TO "Profile";--> statement-breakpoint
ALTER TABLE "Accounts" RENAME COLUMN "user" TO "profile";--> statement-breakpoint
ALTER TABLE "Profile" DROP CONSTRAINT "Users_phone_unique";--> statement-breakpoint
ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_user_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Profile" DROP CONSTRAINT "Users_prefs_UserPrefs_id_fk";
--> statement-breakpoint
ALTER TABLE "Profile" DROP CONSTRAINT "Users_specialStatus_SpecialStatus_title_fk";
--> statement-breakpoint
ALTER TABLE "Trips" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Trips" ALTER COLUMN "account" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "UserPrefs" ALTER COLUMN "defaultPlaces" SET DEFAULT 3;--> statement-breakpoint
ALTER TABLE "Accounts" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Accounts" ADD COLUMN "remoteId" text;--> statement-breakpoint
ALTER TABLE "Accounts" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "Profile" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_profile_Profile_id_fk" FOREIGN KEY ("profile") REFERENCES "public"."Profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_prefs_UserPrefs_id_fk" FOREIGN KEY ("prefs") REFERENCES "public"."UserPrefs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_specialStatus_SpecialStatus_title_fk" FOREIGN KEY ("specialStatus") REFERENCES "public"."SpecialStatus"("title") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Accounts" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "Accounts" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "Profile" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_phone_unique" UNIQUE("phone");