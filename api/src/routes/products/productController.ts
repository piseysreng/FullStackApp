import { Request, Response } from "express";
import { db } from '../../db/index.js';
import { productsTable, productsToCategories } from "../../db/oldSchema.js";
import { eq, exists, and } from "drizzle-orm";

export async function listProducts(req: Request, res: Response) {
    try {
        const { category_id } = req.query;

        const products = await db.query.productsTable.findMany({
            where: (products, { exists, and, eq }) => {
                if (!category_id) return undefined;
                
                return exists(
                    db.select()
                      .from(productsToCategories)
                      .where(
                        and(
                          eq(productsToCategories.productId, products.id),
                          eq(productsToCategories.categoryId, Number(category_id))
                        )
                      )
                );
            },
            with: {
                categories: {
                    with: {
                        category: true 
                    }
                }
            }
        });

        const flattenedProducts = products.map(product => ({
            ...product,
            categories: product.categories.map(pc => pc.category)
        }));

        res.json(flattenedProducts);
    } catch (error) {
        // This is the most important part for debugging!
        console.error("DATABASE ERROR:", error); 
        res.status(500).json({ 
            message: "Error fetching products",
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
}

export async function getProductById(req: Request, res: Response) {
    // try {
    //     const { id } = req.params;
    //     const [product] = await db.select().from(productsTable).where(eq(productsTable.id, Number(id)));
    //     if (!product) {
    //         res.status(404).send({ message: 'Product Not Found' });
    //     } else {
    //         res.json(product);
    //     }
    // } catch (error) {
    //     res.status(500).send(error);
    // }

    try {
        const { id } = req.params;

        const product = await db.query.productsTable.findFirst({
            where: (products, { eq }) => eq(products.id, Number(id)),
            with: {
                categories: {
                    with: {
                        category: true, // Fetches the actual category data
                    },
                },
            },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        // Optional: Flatten the categories so the frontend gets a simple array
        const formattedProduct = {
            ...product,
            categories: product.categories.map((pc) => pc.category),
        };

        // Remove the join-table bridge from the final response if you want it clean
        delete (formattedProduct as any).productToCategories;

        res.json(formattedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const { name, categories, ...otherData } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required to generate a slug" });
        }

        // 1. Generate Base Slug
        let slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')     // Remove special characters
            .replace(/[\s_-]+/g, '-')     // Replace spaces and underscores with a hyphen
            .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens

        // 2. Check for Uniqueness
        let uniqueSlug = slug;
        let counter = 1;
        let isUnique = false;

        while (!isUnique) {
            const [existing] = await db
                .select()
                .from(productsTable)
                .where(eq(productsTable.slug, uniqueSlug))
                .limit(1);

            if (!existing) {
                isUnique = true;
            } else {
                uniqueSlug = `${slug}-${counter}`;
                counter++;
            }
        }

        // 3. Insert with the unique slug
        const [product] = await db
            .insert(productsTable)
            .values({
                ...otherData,
                name,
                slug: uniqueSlug
            })
            .returning();



        // 4. Check if there is Category ID

        if (categories.length > 0) {
            const junctionValues = categories.map((catId: number) => ({
                productId: product.id,
                categoryId: catId,
            }));

            // 3. Insert into the junction table
            await db.insert(productsToCategories).values(junctionValues);
        }

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateProduct(req: Request, res: Response) {
    // try {
    //     const id = req.params.id;
    //     const updatedFields = req.body;
    //     const [product] = await db.update(productsTable).set(updatedFields).where(eq(productsTable.id, Number(id))).returning();
    //     if (product) {
    //         res.json(product);
    //     } else {
    //         res.status(404).send({ Message: "Product  was not found" });
    //     }
    // } catch (error) {
    //     res.status(500).send(error);
    // }
    try {
        const id = Number(req.params.id);
        const { categories, ...updatedFields } = req.body;

        const result = await db.transaction(async (tx) => {
            // 1. Update the main product table
            const [updatedProduct] = await tx
                .update(productsTable)
                .set(updatedFields)
                .where(eq(productsTable.id, id))
                .returning();

            if (!updatedProduct) {
                return null;
            }

            // 2. Handle Category updates only if categoryIds was provided in the request
            if (categories !== undefined) {
                // Delete all existing relations for this product
                await tx
                    .delete(productsToCategories)
                    .where(eq(productsToCategories.productId, id));

                // If there are new categories, insert them
                if (categories.length > 0) {
                    const newRelations = categories.map((catId : number) => ({
                        productId: id,
                        categoryId: catId,
                    }));
                    await tx.insert(productsToCategories).values(newRelations);
                }
            }

            return updatedProduct;
        });

        if (result) {
            res.json(result);
        } else {
            res.status(404).send({ Message: "Product was not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const [deletedProduct] = await db.delete(productsTable).where(eq(productsTable.id, Number(id))).returning();
        if (deletedProduct) {
            res.status(204).send();
        } else {
            res.status(404).send({ Message: "Product  was not found" });
        }

    } catch (error) {
        res.status(500).send(error);
    }
}