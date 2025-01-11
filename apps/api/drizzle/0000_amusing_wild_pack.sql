CREATE TABLE "Accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"blocked" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"user" uuid NOT NULL,
	CONSTRAINT "Accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "SpecialStatus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	CONSTRAINT "SpecialStatus_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "UserPrefs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"autoBook" boolean DEFAULT true,
	"defaultPlaces" integer,
	"smoke" boolean DEFAULT false,
	"music" boolean DEFAULT true,
	"pets" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"nickname" text,
	"phone" text,
	"bio" text,
	"prefs" uuid NOT NULL,
	"specialStatus" text,
	CONSTRAINT "Users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_user_Users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Users" ADD CONSTRAINT "Users_prefs_UserPrefs_id_fk" FOREIGN KEY ("prefs") REFERENCES "public"."UserPrefs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Users" ADD CONSTRAINT "Users_specialStatus_SpecialStatus_title_fk" FOREIGN KEY ("specialStatus") REFERENCES "public"."SpecialStatus"("title") ON DELETE no action ON UPDATE no action;