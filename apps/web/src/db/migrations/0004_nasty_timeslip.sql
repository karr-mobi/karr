ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_profile_Profile_id_fk";
--> statement-breakpoint
ALTER TABLE "Accounts" ALTER COLUMN "remoteId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_provider_remoteId_pk" PRIMARY KEY("provider","remoteId");--> statement-breakpoint
ALTER TABLE "Profile" ADD COLUMN "accountProvider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Profile" ADD COLUMN "accountRemoteId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "profile_account_fk" FOREIGN KEY ("accountProvider","accountRemoteId") REFERENCES "public"."Accounts"("provider","remoteId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Accounts" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "Accounts" DROP COLUMN "profile";