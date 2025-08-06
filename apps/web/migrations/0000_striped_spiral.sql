CREATE TABLE "Accounts" (
	"provider" text NOT NULL,
	"remoteId" text NOT NULL,
	"email" text NOT NULL,
	"blocked" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"role" text DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Accounts_provider_remoteId_pk" PRIMARY KEY("provider","remoteId"),
	CONSTRAINT "Accounts_provider_email_unique" UNIQUE("provider","email")
);
--> statement-breakpoint
CREATE TABLE "Profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"nickname" text,
	"phone" text,
	"bio" text,
	"avatar" text,
	"prefs" uuid NOT NULL,
	"accountProvider" text NOT NULL,
	"accountRemoteId" text NOT NULL,
	"specialStatus" text,
	CONSTRAINT "Profile_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "Settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inserted_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "SpecialStatus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	CONSTRAINT "SpecialStatus_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "Trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"departure" date NOT NULL,
	"price" integer NOT NULL,
	"createdAt" date DEFAULT now(),
	"updatedAt" date DEFAULT now(),
	"driver" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserPrefs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"autoBook" boolean DEFAULT true,
	"defaultPlaces" integer DEFAULT 3,
	"smoke" boolean DEFAULT false,
	"music" boolean DEFAULT true,
	"pets" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_prefs_UserPrefs_id_fk" FOREIGN KEY ("prefs") REFERENCES "public"."UserPrefs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_specialStatus_SpecialStatus_title_fk" FOREIGN KEY ("specialStatus") REFERENCES "public"."SpecialStatus"("title") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "profile_account_fk" FOREIGN KEY ("accountProvider","accountRemoteId") REFERENCES "public"."Accounts"("provider","remoteId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_driver_Profile_id_fk" FOREIGN KEY ("driver") REFERENCES "public"."Profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."trips_view" AS (select "Trips"."id", "Trips"."from", "Trips"."to", "Trips"."departure", "Trips"."price", "Trips"."driver", "Profile"."firstName", "Profile"."lastName", "Profile"."nickname", "Profile"."avatar", "Profile"."accountProvider", "Profile"."accountRemoteId" from "Trips" left join "Profile" on "Trips"."driver" = "Profile"."id");