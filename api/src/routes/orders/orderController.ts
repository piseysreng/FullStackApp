import { Request, Response } from "express";
import { db } from '../../db/index.js';
import { eq, inArray } from 'drizzle-orm';
import { orderItemsTable, ordersTable, productsTable } from "../../../src/db/oldSchema.js";
import { getAuth } from "@clerk/express";

export async function createOrder(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        const { items, shippingAddress, deliveryOption, paymentMethod } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'No User Id' });
        }



        // Calculate Sub Total
        const productIds = items.map((i: any) => i.productId);
        const dbProducts = await db
            .select()
            .from(productsTable)
            .where(inArray(productsTable.id, productIds));

        let subtotal = 0;

        items.forEach((cartItem: any) => {
            const product = dbProducts.find((p) => p.id === cartItem.productId);
            if (product) {
                // Ensure we use the DB price, not the frontend price
                subtotal += Number(product.price) * cartItem.quantity;
            }
        });

        // Calculate Discount Amount
        let discountAmount = 0;
        let appliedCouponId = null;

        // if (couponCode) {
        //     const [coupon] = await db
        //         .select()
        //         .from(couponsTable)
        //         .where(
        //             and(
        //                 eq(couponsTable.code, couponCode),
        //                 eq(couponsTable.isActive, true),
        //                 gte(couponsTable.expiryDate, new Date()) // Ensure not expired
        //             )
        //         );

        //     if (coupon) {
        //         appliedCouponId = coupon.id;
        //         if (coupon.discountType === 'percentage') {
        //             discountAmount = subtotal * (Number(coupon.discountValue) / 100);
        //         } else {
        //             discountAmount = Number(coupon.discountValue);
        //         }

        //         // Optional: Cap discount so it doesn't exceed subtotal
        //         discountAmount = Math.min(discountAmount, subtotal);
        //     }
        // }
        // Calculate Tax Amount
        const taxRate = 0.10;
        const taxAmount = (subtotal - discountAmount) * taxRate;
        // Calculate Shipping Amount
        let shippingAmount = 10;
        // Calculate Total Amount
        const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;


        // FIX 2: Dynamic Order Number (prevents Unique Constraint error)
        const generateTranId = () => {
            const timestamp = Date.now().toString(36).toUpperCase(); // ~8 chars (e.g., LZA1B2C)
            const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase(); // 8 chars
            const prefix = "TRN"; // 3 chars

            // Combine and slice to exactly 20 to be safe
            return `${prefix}${timestamp}${randomStr}`.substring(0, 20);
        };

        const uniqueOrderNumber = generateTranId();
        const clerkUserId = userId as string;
        const subTotalStr = subtotal.toFixed(2);
        const discountStr = discountAmount.toFixed(2);
        const taxStr = taxAmount.toFixed(2);
        const totalStr = totalAmount.toFixed(2);

        // Insert in Orders Table
        // --- START TRANSACTION ---
        const result = await db.transaction(async (tx) => {

            // 1. Insert the main Order
            const [newOrder] = await tx.insert(ordersTable).values({
                userId: userId as string,
                orderNumber: uniqueOrderNumber,
                subTotal: subtotal.toFixed(2),
                discountAmount: discountAmount.toFixed(2),
                taxAmount: taxAmount.toFixed(2),
                totalAmount: totalAmount.toFixed(2),
                shippingAddress: JSON.stringify(shippingAddress),
                billingAddress: 'Same as Shipping',
                status: 'PENDING',
            }).returning();

            // 2. Map your items to match the orderItemsTable schema
            const orderItemsData = items.map((cartItem: any) => {
                const product = dbProducts.find((p) => Number(p.id) === Number(cartItem.productId || cartItem.id));

                if (!product) {
                    throw new Error(`Product metadata not found for ID: ${cartItem.productId}`);
                }

                const price = Number(product.price);
                const qty = Number(cartItem.quantity) || 1;

                return {
                    orderId: newOrder.id,                  // Link to the order we just created
                    productId: product.id,                 // From dbProducts
                    productName: product.name,             // Required by your schema
                    sku: product.sku || "N/A",             // Required by your schema
                    priceAtPurchase: price.toFixed(2),     // Required decimal
                    quantity: qty,                         // integer
                    totalPrice: (price * qty).toFixed(2),  // Required decimal
                };
            });
            if (orderItemsData.length > 0) {
                await tx.insert(orderItemsTable).values(orderItemsData);
            }

            return newOrder;
        });
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            // orderId: result.id,           
            orderNumber: result.orderNumber 
        });
    } catch (error) {
        // Helpful Tip: Log the actual error so you can see why it failed!
        console.error("Database Error:", error);

        return res.status(400).json({
            message: 'Invalid Order Data',
            error: error instanceof Error ? error.message : error
        });
    }
};

// export async function listOrders(req: Request, res: Response) {
//     try {
//         const orders = await db.select().from(ordersTable);
//         res.json(orders);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };

// export async function getOrder (req: Request, res: Response) {
//     try {
//         const id = parseInt(req.params.id);
//         const orderWithItems = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).leftJoin(orderItemsTable,eq(ordersTable.id , orderItemsTable.orderId));
//         if (orderWithItems.length === 0) {
//             res.status(404).send('Order not found');
//         }
//         const mergedOrder = {
//             ...orderWithItems[0].orders,
//             items: orderWithItems.map((oi) => oi.order_items),
//         };

//         res.status(200).json(mergedOrder);

//     } catch (error) {
//         res.status(500).send(error);
//     }
// };

// export async function updateOrder (req: Request, res: Response) {
//     try {
//         const id = parseInt(req.params.id);
//         const [updatedOrder] = await db.update(ordersTable).set(req.body).where(eq(ordersTable.id, id)).returning();
//         if (!updatedOrder) {
//             res.status(404).send('Order not found');
//         } else {
//             res.status(202).json(updateOrder);
//         }
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };