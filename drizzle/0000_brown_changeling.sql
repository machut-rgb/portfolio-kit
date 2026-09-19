CREATE TABLE `about` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`paragraphs` text NOT NULL,
	`quote` text,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`meta` text,
	`ip_hint` text,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`issuer` text NOT NULL,
	`year` text NOT NULL,
	`description` text NOT NULL,
	`icon` text,
	`url` text,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contact` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`heading` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contact_channels` (
	`id` text PRIMARY KEY NOT NULL,
	`icon` text NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`href` text,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`degree` text NOT NULL,
	`school` text NOT NULL,
	`location` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`note` text,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experience` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`org` text NOT NULL,
	`org_url` text,
	`location` text NOT NULL,
	`start` text NOT NULL,
	`end` text,
	`current` integer DEFAULT false NOT NULL,
	`bullets` text NOT NULL,
	`stack` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`data` blob NOT NULL,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`handle` text NOT NULL,
	`headline` text NOT NULL,
	`roles` text NOT NULL,
	`summary` text NOT NULL,
	`availability` text NOT NULL,
	`location` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`photo_src` text,
	`photo_alt` text,
	`photo_width` integer,
	`photo_height` integer,
	`resume` text,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`summary` text NOT NULL,
	`body` text,
	`highlights` text,
	`year` integer NOT NULL,
	`role` text,
	`tags` text NOT NULL,
	`links` text,
	`featured` integer DEFAULT false NOT NULL,
	`status` text,
	`cover_src` text,
	`cover_alt` text,
	`cover_width` integer,
	`cover_height` integer,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`hits` integer DEFAULT 0 NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`variant` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`nav` integer DEFAULT false NOT NULL,
	`divider` integer DEFAULT false NOT NULL,
	`nav_label` text,
	`eyebrow` text,
	`title` text,
	`intro` text,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`user_agent` text,
	`ip_hint` text,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`data` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skill_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`icon` text,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skill_items` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`name` text NOT NULL,
	`level` integer,
	`note` text,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `skill_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	`icon` text NOT NULL,
	`handle` text,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`label` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `theme_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`data` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`failed_attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`created_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);