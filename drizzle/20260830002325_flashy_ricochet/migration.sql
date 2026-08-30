CREATE TYPE "user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "application_consents" (
	"app_id" text,
	"user_id" text,
	"scopes" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "application_consents_pkey" PRIMARY KEY("app_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "application_oauth2_configs" (
	"app_id" text PRIMARY KEY,
	"client_secret_enc" bytea NOT NULL,
	"allowed_callback_urls" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"homepage_url" text NOT NULL,
	"logo_asset_id" text,
	"background_asset_id" text,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" text PRIMARY KEY,
	"mime" text NOT NULL,
	"size" integer NOT NULL,
	"owner_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "logins" (
	"id" text PRIMARY KEY,
	"verifier_hash" bytea NOT NULL,
	"user_id" text NOT NULL,
	"verification_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signups" (
	"id" text PRIMARY KEY,
	"verifier_hash" bytea NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"date_of_birth" text NOT NULL,
	"verification_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_avatars" (
	"user_id" text PRIMARY KEY,
	"asset_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"is_last_name_first" boolean DEFAULT false NOT NULL,
	"email" text NOT NULL UNIQUE,
	"date_of_birth" text NOT NULL,
	"role" "user_role" DEFAULT 'user'::"user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oauth_access_tokens" (
	"id" text PRIMARY KEY,
	"secret_hash" bytea NOT NULL,
	"scopes" text NOT NULL,
	"app_id" text NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text,
	"refresh_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oauth_exchange_codes" (
	"code" text PRIMARY KEY,
	"scopes" text NOT NULL,
	"app_id" text NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oauth_refresh_tokens" (
	"id" text PRIMARY KEY,
	"secret_hash" bytea NOT NULL,
	"scopes" text NOT NULL,
	"app_id" text NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text,
	"auth_time" timestamp NOT NULL,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" ("email");--> statement-breakpoint
ALTER TABLE "application_consents" ADD CONSTRAINT "application_consents_app_id_applications_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_consents" ADD CONSTRAINT "application_consents_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_oauth2_configs" ADD CONSTRAINT "application_oauth2_configs_app_id_applications_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_logo_asset_id_assets_id_fkey" FOREIGN KEY ("logo_asset_id") REFERENCES "assets"("id");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_background_asset_id_assets_id_fkey" FOREIGN KEY ("background_asset_id") REFERENCES "assets"("id");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "logins" ADD CONSTRAINT "logins_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "logins" ADD CONSTRAINT "logins_verification_id_verifications_id_fkey" FOREIGN KEY ("verification_id") REFERENCES "verifications"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "signups" ADD CONSTRAINT "signups_verification_id_verifications_id_fkey" FOREIGN KEY ("verification_id") REFERENCES "verifications"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "user_avatars" ADD CONSTRAINT "user_avatars_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_avatars" ADD CONSTRAINT "user_avatars_asset_id_assets_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_app_id_applications_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_session_id_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_access_tokens" ADD CONSTRAINT "oauth_access_tokens_refresh_token_oauth_refresh_tokens_id_fkey" FOREIGN KEY ("refresh_token") REFERENCES "oauth_refresh_tokens"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_exchange_codes" ADD CONSTRAINT "oauth_exchange_codes_app_id_applications_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_exchange_codes" ADD CONSTRAINT "oauth_exchange_codes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_exchange_codes" ADD CONSTRAINT "oauth_exchange_codes_session_id_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_app_id_applications_id_fkey" FOREIGN KEY ("app_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_session_id_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE;