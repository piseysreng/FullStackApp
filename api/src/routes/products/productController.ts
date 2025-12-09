import { Request, Response } from "express";
import { db } from '../../db/index.js';
import { productsTable } from "../../db/oldSchema.js";
import { eq } from "drizzle-orm";

export async function listProducts(req: Request, res: Response) {
    try {
        const products = await db.select().from(productsTable);
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
}

// export async function getProductById(req: Request, res: Response) {
//     try {
//         const {id} = req.params;
//         const [product] = await db.select().from(productsTable).where(eq(productsTable.id,Number(id)));
//         if (!product) {
//             res.status(404).send({message: 'Product Not Found'});
//         } else {
//             res.json(product);
//         }
//     } catch (error) {
//         res.status(500).send(error);
//     }
// }

// export async function createProduct(req: Request, res: Response) {
//     try {
//         const [product] = await db.insert(productsTable).values(req.body).returning();
//         res.status(201).json(product);
//     } catch (error) {
//         res.status(500).send(error);
//     }

// }

// export async function updateProduct(req: Request, res: Response) {
//     try {
//         const id = Number(req.params.id);
//         const updatedFields = req.body;
//         const [product] = await db.update(productsTable).set(updatedFields).where(eq(productsTable.id, id)).returning();
//         if (product) {
//             res.json(product);
//         }else {
//             res.status(404).send({Message: "Product  was not found"});
//         }
//     } catch (error) {
//         res.status(500).send(error);
//     }
// }
// export async function deleteProduct(req: Request, res: Response) {
//     try {
//         const id = Number(req.params.id);
//         const [deletedProduct] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
//         if (deletedProduct) {
//             res.status(204).send();
//         }else {
//             res.status(404).send({Message: "Product  was not found"});
//         }

//     } catch (error) {
//         res.status(500).send(error);
//     }
// }