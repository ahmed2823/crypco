ALTER TABLE "favorites" RENAME TO "legacy_recipe_favorites";--> statement-breakpoint
CREATE TYPE "public"."investment_order_status" AS ENUM('pending_kyc', 'pending_payment', 'payment_processing', 'confirmed', 'cancelled', 'failed');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('draft', 'open', 'funded', 'closed');--> statement-breakpoint
CREATE TABLE "investment_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"property_id" uuid NOT NULL,
	"amount_aed" numeric(12, 2) NOT NULL,
	"status" "investment_order_status" DEFAULT 'pending_kyc' NOT NULL,
	"idempotency_key" text NOT NULL,
	"payment_provider_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "investment_orders_amount_positive" CHECK ("investment_orders"."amount_aed" > 0)
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"kind" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"price_aed" numeric(14, 2) NOT NULL,
	"minimum_aed" numeric(12, 2) NOT NULL,
	"annual_yield_percent" numeric(5, 2),
	"funded_percent" numeric(5, 2) DEFAULT '0' NOT NULL,
	"bedrooms" integer DEFAULT 0 NOT NULL,
	"bathrooms" integer DEFAULT 0 NOT NULL,
	"area_sq_ft" numeric(8, 2),
	"status" "property_status" DEFAULT 'draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug"),
	CONSTRAINT "properties_price_positive" CHECK ("properties"."price_aed" > 0),
	CONSTRAINT "properties_minimum_positive" CHECK ("properties"."minimum_aed" > 0),
	CONSTRAINT "properties_funding_range" CHECK ("properties"."funded_percent" >= 0 AND "properties"."funded_percent" <= 100)
);
--> statement-breakpoint
CREATE TABLE "property_favorites" (
	"user_id" text NOT NULL,
	"property_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "property_favorites_user_id_property_id_pk" PRIMARY KEY("user_id","property_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"country_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "investment_orders" ADD CONSTRAINT "investment_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_orders" ADD CONSTRAINT "investment_orders_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_favorites" ADD CONSTRAINT "property_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_favorites" ADD CONSTRAINT "property_favorites_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "investment_orders_user_idempotency_idx" ON "investment_orders" USING btree ("user_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "investment_orders_user_created_idx" ON "investment_orders" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "properties_status_idx" ON "properties" USING btree ("status");