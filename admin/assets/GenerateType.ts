export interface User {
    id: string;
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    stockQuantity: number;
    categoryId: string[];
    featureImage: string;
    galleryImages: string[];
    ratingAvg: number;     // e.g., 4.5
    reviewCount: number;   // e.g., 128
    favoriteCount: number; // Total number of users who favorited this
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Relation:
    attributes?: ProductAttributeValue[];
    reviews?: ProductReview[];
    favoritedBy?: Favorite[];
    orderItems?: OrderItem[];
    logs?: ActivityLog[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  // Self-reference for nesting
  parentId: string | null; // If null, it's a Top-Level Category
}

// Defines the Attribute type (e.g., "Color", "Size", "Brand")
export interface Attribute {
    id: string;
    name: string; // e.g., "Color"
    slug: string; // e.g., "color"
}

// The link between a Product and its specific Attribute value
export interface ProductAttributeValue {
    id: string;
    productId: string;
    attributeId: string;
    value: string; // e.g., "Nike", "Large", or "#FF0000"
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;        // Typically an integer 1-5
  comment?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;    // Reference to the User who liked the product
  productId: string; // Reference to the Product being favorited
  createdAt: Date;   // Useful for sorting "Recently Favorited"
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string; // e.g., "ORD-2026-1001"
  
  // Financials
  subTotal: number;       // Total price before discount
  discountAmount: number; // The money saved (e.g., $15.00)
  taxAmount: number;
  totalAmount: number;    // Final price (subTotal - discountAmount + tax + shipping)



  
  
  // Tracking
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  
  // Logistics
  shippingAddress: string;
  billingAddress: string;

  shippingMethodId: string;
  shippingMethod?: ShippingMethod;
  // Tracking (Derived from ShippingMethod during checkout)
  estimatedDeliveryDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;

  // Relations
  items: OrderItem[];
  transactions: Transaction[];
  history: OrderHistory[];
  couponId?: string;      // Reference to the Coupon used
  coupon?: Coupon;
  logs?: ActivityLog[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  
  // Snapshot Data (crucial for history)
  productName: string; 
  sku: string;
  priceAtPurchase: number; 
  
  // Quantity
  quantity: number;
  
  // Total for this line (priceAtPurchase * quantity)
  totalPrice: number;
}

export interface ShippingMethod {
  id: string;
  name: string;        // e.g., "Standard Shipping", "Express Delivery"
  carrierName: string; // e.g., "FedEx", "DHL", "Local Courier"
  
  // Pricing
  baseCost: number;    // The price the customer pays
  freeShippingThreshold?: number; // e.g., Free if order > $100
  
  // Delivery Window
  minDays: number;     // e.g., 3
  maxDays: number;     // e.g., 5
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;          // e.g., "SAVE20", "WINTER2026"
  description?: string;
  
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number; // e.g., 20 (for 20%) or 50 (for $50)
  
  // Constraints
  minOrderAmount?: number; // Coupon only works if total > $100
  maxDiscount?: number;    // Cap the discount (e.g., 10% off up to $50)
  usageLimit?: number;     // Total times this coupon can be used globally
  usedCount: number;       // Current usage count
  
  // Validity
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  
  // Payment Details
  paymentGateway: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'COD';
  gatewayTransactionId: string; // The ID provided by Stripe/PayPal
  
  // Financials
  amount: number;
  currency: string; // e.g., 'USD'
  
  // Status Tracking
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  
  // Metadata
  paymentMethodDetails?: string; // e.g., "Visa ending in 4242"
  errorMessage?: string; // Log failure reasons here
  
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  
  // The status it changed TO
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  
  // Optional: Who made the change (System, Admin ID, or User ID)
  changedBy?: string; 
  
  // Optional: Note for the customer (e.g., "Package left at front door")
  notes?: string;
  
  createdAt: Date; // This is your "Date Record"
}


export interface Cart {
  id: string;
  userId?: string;       // Optional for guests
  sessionId: string;    // UUID stored in browser cookies/localStorage
  
  // Totals can be calculated dynamically or stored for performance
  totalItems: number;
  totalPrice: number;
  
  createdAt: Date;
  updatedAt: Date;

  // Relations
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  
  quantity: number;
  
  // Note: We don't "lock" the price here like we do in OrderItem. 
  // If the Product price changes, the cart reflects the new price.
  
  createdAt: Date;
  updatedAt: Date;

  // Relation:
  product?: Product; 
}


export interface PaymentMethod {
  id: string;
  userId: string;
  
  // Provider Data
  provider: 'STRIPE' | 'PAYPAL';
  providerPaymentMethodId: string; // The token from the provider (e.g., pm_123...)
  
  // Card Display Details (Safe to store)
  cardBrand: string;  // e.g., "Visa", "MasterCard"
  last4: string;      // e.g., "4242"
  expMonth: number;
  expYear: number;
  
  // Status
  isDefault: boolean; // Used to auto-select this card on the next checkout
  
  createdAt: Date;
  updatedAt: Date;
}


export interface ActivityLog {
  id: string;
  userId: string;       // Who did it
  action: string;       // e.g., 'LOGIN', 'UPDATE_PRODUCT', 'PLACE_ORDER'
  entityType: string;   // e.g., 'Product', 'Order', 'User'
  entityId?: string;    // The ID of the specific item changed
  
  // The "What" - storing changes
  oldData?: any;        // JSON snapshot before the change
  newData?: any;        // JSON snapshot after the change
  
  // Context
  ipAddress?: string;   // For security tracking
  userAgent?: string;   // Browser/Device info
  status: 'SUCCESS' | 'FAILURE';
  errorMessage?: string; 
  
  createdAt: Date;      // When it happened
}


// user --
// product --
// product_attribute (size,) --
// category --
// sub_category --
// brand --
// order --
// order_items --
// transactions --
// payment_methods --
// delivery
// delivery_items
// review --
// coupon_code -
// audit_logs
// cart: store temperory before checkout -
// favorites -
// wishlist -
// customer_activities_logs