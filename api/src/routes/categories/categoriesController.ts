import { Request, Response } from "express";
import { db } from '../../db/index.js';
import { categoriesTable } from "../../db/oldSchema.js";
import { eq, like } from "drizzle-orm";

export async function listCategories(req: Request, res: Response) {
    try {
        const categories = await db.select().from(categoriesTable);
        res.json(categories);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getCatetoryById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const [product] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, Number(id)));
        if (!product) {
            res.status(404).send({ message: 'Category Not Found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createCategory(req: Request, res: Response) {
    try {
        const { name, ...otherData } = req.body;

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
                .from(categoriesTable)
                .where(eq(categoriesTable.slug, uniqueSlug))
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
            .insert(categoriesTable)
            .values({
                ...otherData,
                name,
                slug: uniqueSlug
            })
            .returning();

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateCategory(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const updatedFields = req.body;
        const [product] = await db.update(categoriesTable).set(updatedFields).where(eq(categoriesTable.id, Number(id))).returning();
        if (product) {
            res.json(product);
        } else {
            res.status(404).send({ Message: "Category  was not found" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteCategory(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const [deletedProduct] = await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(id))).returning();
        if (deletedProduct) {
            res.status(204).send();
        } else {
            res.status(404).send({ Message: "Category  was not found" });
        }

    } catch (error) {
        res.status(500).send(error);
    }
}