CREATE TYPE "public"."rsvp_status" AS ENUM('accepted', 'declined');--> statement-breakpoint
CREATE TABLE "households" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(12) NOT NULL,
	"search_name" varchar(80) NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"max_adults" integer DEFAULT 1 NOT NULL,
	"max_kids" integer DEFAULT 0 NOT NULL,
	"cap_confirmed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "households_code_unique" UNIQUE("code"),
	CONSTRAINT "households_searchName_unique" UNIQUE("search_name")
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"status" text NOT NULL,
	"adults_attending" integer DEFAULT 0 NOT NULL,
	"kids_attending" integer DEFAULT 0 NOT NULL,
	"dietary_notes" varchar(280),
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rsvps_householdId_unique" UNIQUE("household_id")
);
--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;