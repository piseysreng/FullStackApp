import { pgTable, integer, varchar, text, doublePrecision, unique, boolean, timestamp, decimal, uuid, PgColumn, foreignKey, check, pgEnum, index, jsonb, primaryKey } from "drizzle-orm/pg-core"
import { InferSelectModel, InferInsertModel, ColumnBaseConfig, ColumnDataType, relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// USERS
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).unique(),
  email: varchar({ length: 255 }).unique(),
  username: varchar({ length: 255 }),
  firstName: varchar({ length: 255 }),
  lastName: varchar({ length: 255 }),
  avatar: varchar({ length: 255 }).notNull().default('https://ui-avatars.com/api/?name=User&background=random'),
  role: varchar({ length: 255 }).default('user').notNull(),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export const usersRelations = relations(usersTable, ({ many }) => ({
  reviews: many(productReviewsTable),
  favoritedBy: many(productFavoritesTable),
  orderItems: many(ordersTable),
  transactions: many(transactionsTable),
  carts: many(cartsTable),
  paymentMethods: many(paymentMethodsTable),
  activityLogs: many(activityLogsTable),
}));
export type UsersType = InferSelectModel<typeof usersTable>;
export type NewUsersType = InferInsertModel<typeof usersTable>;

// PRODUCTS
export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sku: varchar({ length: 255 }),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }),
  description: text(),
  price: doublePrecision().notNull(),
  stockQuantity: integer().default(0),
  featureImage: varchar({ length: 255 }).notNull().default('https://placehold.co/600x400?text=No+Image+Available'),
  galleryImages: varchar({ length: 255 }).array().notNull().default([]),
  ratingAvg: decimal({ precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer().notNull().default(0),
  favoriteCount: integer().notNull().default(0),
  isPublished: boolean().notNull().default(false),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export const productsRelations = relations(productsTable, ({ many }) => ({
  attributes: many(productAttributeValueTable),
  reviews: many(productReviewsTable),
  favoritedBy: many(productFavoritesTable),
  orderItems: many(orderItemsTable),
  cartItems: many(cartItemsTable),
  categories: many(productsToCategories),
}));
export type ProductsType = InferSelectModel<typeof productsTable>;
export type NewProductsType = InferInsertModel<typeof productsTable>;


// CATEGORIES
export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: text("image")
    .notNull()
    .default("https://placehold.co/400x400?text=Category+Image"),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: "categories_parent_id_fkey"
  }).onDelete("set null"),
]);
export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  parent: one(categoriesTable, {
    fields: [categoriesTable.parentId],
    references: [categoriesTable.id],
    relationName: "category_hierarchy",
  }),
  children: many(categoriesTable, {
    relationName: "category_hierarchy",
  }),
  products: many(productsToCategories),
}));
export type Category = InferSelectModel<typeof categoriesTable>;
export type NewCategory = InferInsertModel<typeof categoriesTable>;




// PRODUCT-CATEGORY-RELATIONS
export const productsToCategories = pgTable("products_to_categories", {
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: 'cascade' }),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.productId, t.categoryId] }),
}));
export const productsToCategoriesRelations = relations(productsToCategories, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [productsToCategories.categoryId],
    references: [categoriesTable.id],
  }),
  product: one(productsTable, {
    fields: [productsToCategories.productId],
    references: [productsTable.id],
  }),
}));

// HOW TO USE
// const product = await db.query.productsTable.findFirst({
//     where: (products, { eq }) => eq(products.slug, 'my-product-slug'),
//     with: {
//         categories: {
//             with: {
//                 category: true // Gets the actual Category details
//             }
//         },
//         attributes: true,
//         reviews: {
//             limit: 5
//         }
//     }
// });


// PRODUCT ATTRIBUTES
export const productAttributesTable = pgTable("product_attributes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
});
export type ProductAttributeType = InferSelectModel<typeof productAttributesTable>;
export type NewProductAttributeType = InferInsertModel<typeof productAttributesTable>;


// PRODUCT ATTRIBUTE VALUES
export const productAttributeValueTable = pgTable("product_attribute_value", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  attributeId: integer("attribute_id").notNull().references(() => productAttributesTable.id, { onDelete: "cascade" }),
  value: varchar({ length: 255 }).notNull(),
});
export const productAttributeValueRelations = relations(productAttributeValueTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [productAttributeValueTable.productId],
    references: [productsTable.id],
  }),
}));
export type ProductAttributeValueType = InferSelectModel<typeof productAttributeValueTable>;
export type NewProductAttributeValue = InferInsertModel<typeof productAttributeValueTable>;


// PRODUCT REVIEWS
export const productReviewsTable = pgTable("product_reviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  check("rating_check", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
]);
export const productReviewsRelations = relations(productReviewsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [productReviewsTable.productId],
    references: [productsTable.id],
  }),
  user: one(usersTable, {
    fields: [productReviewsTable.userId],
    references: [usersTable.id],
  }),
}));
export type ProductReviewType = InferSelectModel<typeof productReviewsTable>;
export type NewProductReviewType = InferInsertModel<typeof productReviewsTable>;


// PRODUCT FAVORITTES
export const productFavoritesTable = pgTable("product_favorites", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  unique("unique_user_favorite").on(table.userId, table.productId),
]);
export const favoritesRelations = relations(productFavoritesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [productFavoritesTable.userId],
    references: [usersTable.id],
  }),
  product: one(productsTable, {
    fields: [productFavoritesTable.productId],
    references: [productsTable.id],
  }),
}));
export type ProductFavoriteType = InferSelectModel<typeof productFavoritesTable>;
export type NewProductFavoriteType = InferInsertModel<typeof productFavoritesTable>;


// ORDERS
export const orderStatusEnum = pgEnum("order_status", ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]);
export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => usersTable.clerkId),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  subTotal: decimal("sub_total", { precision: 10, scale: 2 }).notNull().default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  status: orderStatusEnum("status").notNull().default("PENDING"),
  shippingAddress: text("shipping_address").notNull(),
  billingAddress: text("billing_address").notNull(),
  shippingMethodId: uuid("shipping_method_id"),
  couponId: uuid("coupon_id"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  items: many(orderItemsTable),
  transactions: many(transactionsTable),
  history: many(orderHistoryTable)
}));
export type OrderType = InferSelectModel<typeof ordersTable>;
export type NewOrderType = InferInsertModel<typeof ordersTable>;



// ORDER ITEMS
export const orderItemsTable = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 255 }).notNull(),
  priceAtPurchase: decimal("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});
export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));
export type OrderItem = InferSelectModel<typeof orderItemsTable>;
export type NewOrderItem = InferInsertModel<typeof orderItemsTable>;



// SHIPPING METHODS
export const shippingMethodsTable = pgTable("shipping_methods", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  carrierName: varchar("carrier_name", { length: 255 }).notNull(),
  baseCost: decimal("base_cost", { precision: 10, scale: 2 }).notNull().default("0.00"),
  freeShippingThreshold: decimal("free_shipping_threshold", { precision: 10, scale: 2 }),
  minDays: integer("min_days").notNull(),
  maxDays: integer("max_days").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export type ShippingMethod = InferSelectModel<typeof shippingMethodsTable>;
export type NewShippingMethod = InferInsertModel<typeof shippingMethodsTable>;



// COUPON CODES
export const discountTypeEnum = pgEnum("discount_type", ["PERCENTAGE", "FIXED_AMOUNT"]);
export const couponsTable = pgTable("coupons", {
  id: uuid().primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export type CouponsType = InferSelectModel<typeof couponsTable>;
export type NewCouponsType = InferInsertModel<typeof couponsTable>;



// TRANSACTIONS
export const paymentGatewayEnum = pgEnum("payment_gateway", ["STRIPE", "PAYPAL", "BANK_TRANSFER", "COD"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["PENDING", "COMPLETED", "FAILED", "REFUNDED"]);
export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  paymentGateway: paymentGatewayEnum("payment_gateway").notNull(),
  gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }).unique(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  status: transactionStatusEnum("status").notNull().default("PENDING"),
  paymentMethodDetails: text("payment_method_details"), // "Visa **** 4242"
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [transactionsTable.orderId],
    references: [ordersTable.id],
  }),
  user: one(usersTable, {
    fields: [transactionsTable.userId],
    references: [usersTable.id],
  }),
}));
export type TransactionsType = InferSelectModel<typeof transactionsTable>;
export type NewTransactionsType = InferInsertModel<typeof transactionsTable>;


// ORDER HISTORIES
export const orderHistoryTable = pgTable("order_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull(),
  changedBy: varchar("changed_by", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const orderHistoryRelations = relations(orderHistoryTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderHistoryTable.orderId],
    references: [ordersTable.id],
  }),
}));
export type OrderHistory = InferSelectModel<typeof orderHistoryTable>;
export type NewOrderHistory = InferInsertModel<typeof orderHistoryTable>;




// CART & CART ITEMS
export const cartsTable = pgTable("carts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  totalItems: integer("total_items").notNull().default(0),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("cart_session_idx").on(table.sessionId),
  index("cart_user_idx").on(table.userId),
]);
export const cartItemsTable = pgTable("cart_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cartId: integer("cart_id").notNull().references(() => cartsTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export const cartsRelations = relations(cartsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [cartsTable.userId],
    references: [usersTable.id],
  }),
  items: many(cartItemsTable),
}));
export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartsTable, {
    fields: [cartItemsTable.cartId],
    references: [cartsTable.id],
  }),
  product: one(productsTable, {
    fields: [cartItemsTable.productId],
    references: [productsTable.id],
  }),
}));
export type CartType = InferSelectModel<typeof cartsTable>;
export type NewCartType = InferInsertModel<typeof cartsTable>;
export type CartItemType = InferSelectModel<typeof cartItemsTable>;
export type NewCartItemType = InferInsertModel<typeof cartItemsTable>;


// PAYMENT METHODS
export const paymentProviderEnum = pgEnum("payment_provider", ["STRIPE", "PAYPAL"]);
export const paymentMethodsTable = pgTable("payment_methods", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  provider: paymentProviderEnum("provider").notNull(),
  providerPaymentMethodId: varchar("provider_payment_method_id", { length: 255 }).notNull().unique(),
  cardBrand: varchar("card_brand", { length: 50 }).notNull(), // e.g., "visa"
  last4: varchar("last4", { length: 4 }).notNull(),
  expMonth: integer("exp_month").notNull(),
  expYear: integer("exp_year").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
export const paymentMethodsRelations = relations(paymentMethodsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [paymentMethodsTable.userId],
    references: [usersTable.id],
  }),
}));
export type PaymentMethodsType = InferSelectModel<typeof paymentMethodsTable>;
export type NewPaymentMethodsType = InferInsertModel<typeof paymentMethodsTable>;



// ACTIVITY LOGS
export const logStatusEnum = pgEnum("log_status", ["SUCCESS", "FAILURE"]);
export const activityLogsTable = pgTable("activity_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(), // e.g., 'UPDATE_PRODUCT'
  entityType: varchar("entity_type", { length: 50 }).notNull(), // e.g., 'Order'
  entityId: varchar("entity_id", { length: 255 }), // UUID or ID of the affected item
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  ipAddress: varchar("ip_address", { length: 45 }), // Supports IPv6 lengths
  userAgent: text("user_agent"),
  status: logStatusEnum("status").notNull().default("SUCCESS"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("log_user_idx").on(table.userId),
  index("log_action_idx").on(table.action),
  index("log_entity_idx").on(table.entityType, table.entityId),
]);
export const activityLogsRelations = relations(activityLogsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [activityLogsTable.userId],
    references: [usersTable.id],
  }),
}));
export type ActivityLog = InferSelectModel<typeof activityLogsTable>;
export type NewActivityLog = InferInsertModel<typeof activityLogsTable>;