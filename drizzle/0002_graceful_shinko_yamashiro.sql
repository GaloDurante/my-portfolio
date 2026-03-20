ALTER TABLE `users` RENAME TO `user`;--> statement-breakpoint
DROP TABLE `profiles`;--> statement-breakpoint
DROP TABLE `project_technologies`;--> statement-breakpoint
DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `user` ADD `title` text;--> statement-breakpoint
ALTER TABLE `user` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `user` ADD `short_bio` text;--> statement-breakpoint
ALTER TABLE `user` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `user` ADD `avatar_public_id` text;--> statement-breakpoint
ALTER TABLE `user` ADD `location` text;--> statement-breakpoint
ALTER TABLE `user` ADD `website` text;--> statement-breakpoint
ALTER TABLE `user` ADD `github` text;--> statement-breakpoint
ALTER TABLE `user` ADD `linkedin` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `role`;--> statement-breakpoint
DROP INDEX `technologies_slug_unique`;--> statement-breakpoint
ALTER TABLE `technologies` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `technologies` DROP COLUMN `color`;--> statement-breakpoint
ALTER TABLE `projects` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `projects` ADD `technologies` text;