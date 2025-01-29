CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" text NOT NULL,
	"external_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"status" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"auto_generated_email" text,
	"personnel_number" text,
	"pin_login_enabled" boolean DEFAULT false NOT NULL,
	"user_name_slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
