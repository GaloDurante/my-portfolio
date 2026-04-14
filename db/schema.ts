import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),

  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),

  name: text("name"),
  title: text("title"),
  bio: text("bio"),
  shortBio: text("short_bio"),
  avatar: text("avatar"),
  avatarPublicId: text("avatar_public_id"),
  location: text("location"),
  website: text("website"),
  github: text("github"),
  linkedin: text("linkedin"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),

  description: text("description"),
  shortDescription: text("short_description"),

  thumbnail: text("thumbnail"),
  images: text("images", { mode: "json" }),

  technologies: text("technologies", { mode: "json" }),

  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),

  featured: integer("featured", { mode: "boolean" }).notNull().default(false),

  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),

  order: integer("order").notNull().default(0),

  startDate: text("start_date"),
  endDate: text("end_date"),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const technologies = sqliteTable("technologies", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  slug: text("slug").notNull(),

  icon: text("icon"),
  iconUrl: text("icon_url"),

  category: text("category", {
    enum: ["language", "framework", "tool", "other"],
  }).notNull(),

  description: text("description"),

  order: integer("order").notNull().default(0),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const userRelations = relations(user, ({ many }) => ({
  projects: many(projects),
  technologies: many(technologies),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(user, {
    fields: [projects.userId],
    references: [user.id],
  }),
}));

export const technologiesRelations = relations(technologies, ({ one }) => ({
  user: one(user, {
    fields: [technologies.userId],
    references: [user.id],
  }),
}));
