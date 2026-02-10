import { InferInsertModel } from "drizzle-orm";
import { createCategorySchema, createProductSchema, NewCreateProductSchema, updateCategorySchema, updateProductSchema } from "../schemas/schema.js";
import * as z from "zod"
import { productsTable } from "../db/schema.js";
import { db } from "../db/index.js";




// Relationship Type

export type ProductWithRelations = Awaited<ReturnType<typeof getProductWithRelationsQuery>>;
async function getProductWithRelationsQuery() {
  return await db.query.productsTable.findFirst({
    with: {
      categories: {
        with: {
          category: true
        }
      },
      orderItems: {
        with: {
          order: true
        }
      }
    }
  });
}

// ACTIONS TYPE
export type CreateProductType = z.infer<typeof createProductSchema>;
export type NewCreateProductType = z.infer<typeof NewCreateProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;

export type CreateCategoryType = z.infer<typeof createCategorySchema>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;