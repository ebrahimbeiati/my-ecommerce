import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Guest table - stores guest session information
 * Used to track anonymous users before they sign up/sign in
 */
export const guests = pgTable("guest", {
	id: uuid("id").primaryKey().defaultRandom(),
	sessionToken: text("session_token").notNull().unique(),
	createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = typeof guests.$inferInsert;

