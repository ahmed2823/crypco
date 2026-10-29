import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const propertyStatus = pgEnum("property_status", [
  "draft",
  "open",
  "funded",
  "closed",
]);

export const investmentOrderStatus = pgEnum("investment_order_status", [
  "pending_kyc",
  "pending_payment",
  "payment_processing",
  "confirmed",
  "cancelled",
  "failed",
]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  countryCode: text("country_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const propertiesTable = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    location: text("location").notNull(),
    kind: text("kind").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url"),
    priceAed: numeric("price_aed", { precision: 14, scale: 2 }).notNull(),
    minimumAed: numeric("minimum_aed", { precision: 12, scale: 2 }).notNull(),
    annualYieldPercent: numeric("annual_yield_percent", { precision: 5, scale: 2 }),
    fundedPercent: numeric("funded_percent", { precision: 5, scale: 2 }).default("0").notNull(),
    bedrooms: integer("bedrooms").default(0).notNull(),
    bathrooms: integer("bathrooms").default(0).notNull(),
    areaSqFt: numeric("area_sq_ft", { precision: 8, scale: 2 }),
    status: propertyStatus("status").default("draft").notNull(),
    isDemo: boolean("is_demo").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("properties_status_idx").on(table.status),
    check("properties_price_positive", sql`${table.priceAed} > 0`),
    check("properties_minimum_positive", sql`${table.minimumAed} > 0`),
    check(
      "properties_funding_range",
      sql`${table.fundedPercent} >= 0 AND ${table.fundedPercent} <= 100`,
    ),
  ],
);

export const investmentOrdersTable = pgTable(
  "investment_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => propertiesTable.id),
    amountAed: numeric("amount_aed", { precision: 12, scale: 2 }).notNull(),
    status: investmentOrderStatus("status").default("pending_kyc").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    paymentProviderReference: text("payment_provider_reference"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("investment_orders_user_idempotency_idx").on(table.userId, table.idempotencyKey),
    index("investment_orders_user_created_idx").on(table.userId, table.createdAt),
    check("investment_orders_amount_positive", sql`${table.amountAed} > 0`),
  ],
);

export const propertyFavoritesTable = pgTable(
  "property_favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => propertiesTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.propertyId] })],
);
