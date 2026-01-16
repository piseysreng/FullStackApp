export interface Category {
  id: number;
  name: string;
  image: string; // URL to the category cover image
}

/**
 * Represents the Product structure with 
 * a relational link to Category
 */
export type Product = {
  id: number;
  name: string;
  price: number;
  category_id: number; // Foreign key linking to Category.id
  quantity: number;    // Stock count
  kilos: number;       // Weight in kilograms
  favorites: boolean;  // User wishlist status
  image: string;       // URL to the product image
}

/**
 * The Root Object structure for your API response 
 * or local data file
 */
export type InventoryData = {
  categories: Category[];
  products: Product[];
}

export type CartItem = {
  id: number;
  quantity: number;
  price: number;
  maxQuantity: number;
}

export type OrderStatus = 'Pending' | 'Completed' | 'Shipped' | 'InTransit';

export type Orders = {
  order_id: number,
  customer_id: number,
  placed_at: string,
  confirmed_at: string,
  shipped_at: string,
  out_for_delivery_at: string,
  delivered_at: string,
  total_amount: number,
  total_quantity: number,
  current_status: string
}

export type OrdersItems = {
  id: number,
  order_id: number,
  product_id: number,
  product_quantity: number,
}