import { pgTable, serial, text, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";

export const products = pgTable(
	"products",
	{
		id: serial("id").primaryKey(),
		slug: text("slug").notNull().unique(),
		title: text("title").notNull(),
		description: text("description"),
		brand: text("brand").notNull(),
		priceCents: integer("price_cents").notNull(),
		currency: text("currency").notNull().default("USD"),
		imageUrl: text("image_url"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		brandIdx: index("products_brand_idx").on(table.brand),
		slugIdx: index("products_slug_idx").on(table.slug),
	})
);

export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;


