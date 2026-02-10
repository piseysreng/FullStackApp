// import { categories, products } from "@/drizzle/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { categoriesTable, productsTable } from "../db/schema";

// PRODUCTS
export const createProductSchema = createInsertSchema(productsTable, {
  name: (schema) => schema.min(1, "Name is required"),
  price: (schema) => schema.gt(0, "Price must be greater than 0"),
  featureImage: z
    .instanceof(File)
    .refine((file) => file.size <= 1 * 1024 * 1024, "Max size is 1MB")
    .nullable()
    .optional(),
  galleryImages: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= 2 * 1024 * 1024),
      "Each gallery image must be under 2MB"
    )
    .optional(),
}).omit({
  ratingAvg: true,
  reviewCount: true,
  favoriteCount: true,
  createdAt: true,
  updatedAt: true,
  slug: true
}).extend({
  categories: z.array(z.number()).min(1, "Select at least one category"),

});


// export const NewCreateProductSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   // sku: z.string().optional(),
//   // description: z.string().optional(),
//   // price: z.coerce.number().min(0.01, "Price must be greater than 0"),
//   // stockQuantity: z.coerce.number().int().min(0).default(0),
//   featureImage: z
//     .instanceof(File)
//     .refine((file) => file.size <= 1 * 1024 * 1024, "Max size is 1MB")
//     .nullable()
//     .optional(),
//   // Array of strings for additional image URLs
//   // galleryImages: z.array(z.string().url("Invalid image URL")).default([]),
//   // isPublished: z.boolean().default(false),
//   categories: z.array(z.number()).min(1, "Select at least one category"),
// });


export const NewCreateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  featureImage: z
    .instanceof(File)
    .refine((file) => file.size <= 1 * 1024 * 1024, "Max size is 1MB")
    .nullable()
    .optional(),
  categories: z.array(z.number()).min(1, "Select at least one category"),
  galleryImages: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= 2 * 1024 * 1024),
      "Each gallery image must be under 2MB"
    )
    .optional(),
});

// export const createProductSchema = baseInsertSchema.omit({
//   ratingAvg: true,
//   reviewCount: true,
//   favoriteCount: true,
//   createdAt: true,
//   updatedAt: true,
//   slug: true,
// }).extend({
//   // Override fields to accept Form UI types
//   name: z.string().min(1, "Name is required"),
//   price: z.preprocess((val) => Number(val), z.number().gt(0, "Price must be > 0")),
//   stockQuantity: z.preprocess((val) => Number(val), z.number().min(0)),

//   // Custom union to allow File objects or Strings (URLs)
//   featureImage: z.custom<File | string | null>().optional(),
//   galleryImages: z.array(z.custom<File | string>()).optional().default([]),

//   categories: z.array(z.number()).min(1, "Select a category"),
//   isPublished: z.boolean().default(false),
// });

export const updateProductSchema = createInsertSchema(productsTable, {
  name: (schema) => schema.min(1, "Name is required"),
  price: (schema) => schema.gt(0, "Price must be greater than 0"),
  featureImage: z
    .union([
      z.instanceof(File)
        .refine((file) => file.size <= 1 * 1024 * 1024, "Max size is 1MB"),
      z.string(),
      z.null(),
      z.undefined()
    ])
    .optional(),
  galleryImages: z
    .array(
      z.union([
        // Validate new file uploads
        z.instanceof(File)
          .refine((file) => file.size <= 2 * 1024 * 1024, "Max size is 2MB per image"),
        // Allow existing image URLs
        z.string()
      ])
    )
    .optional(),
}).omit({
  ratingAvg: true,
  reviewCount: true,
  favoriteCount: true,
  createdAt: true,
  updatedAt: true,
  slug: true
}).extend({
  categories: z.array(z.number()),
});



// CATEGORIES
export const createCategorySchema = createInsertSchema(categoriesTable, {
  name: (schema) => schema.min(1, "Name is required"),
  image: z
    .instanceof(File, { message: "Please select an image file" })
    .refine((file) => !file || file.size <= 1 * 1024 * 1024, "Max size is 1MB")
    .nullable()
}).omit({
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCategorySchema = createInsertSchema(categoriesTable, {
  name: (schema) => schema.min(1, "Name is required"),
  image: z
    .instanceof(File, { message: "Please select an image file" })
    .refine((file) => !file || file.size <= 1 * 1024 * 1024, "Max size is 1MB")
    // .refine((file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    .nullable() // Allows the initial null state
}).omit({
  slug: true,
  createdAt: true,
  updatedAt: true,
});
