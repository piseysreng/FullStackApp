import { createInsertSchema } from "drizzle-zod";
import { categoriesTable, productsTable } from "./../db/oldSchema";

export const CreateProductSchema = createInsertSchema(productsTable);
export const UpdateProductSchema = createInsertSchema(productsTable).partial();


export const CreateCategorySchema = createInsertSchema(categoriesTable).omit({slug: true});
export const UpdateCategorySchema = createInsertSchema(categoriesTable).partial();