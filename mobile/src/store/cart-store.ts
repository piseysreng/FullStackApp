import { create } from "zustand";

type CartItemType = {
    id: number;
    quantity: number;
    price: number;
    maxQuantity: number;
}

type DeliveryOption = {
    title: string;
    price: number;
}

// Added Shipping Type
type ShippingDetails = {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
}

type CartState = {
    items: CartItemType[];
    delivery: DeliveryOption;
    shippingDetails: ShippingDetails; // Store the form data
    addItem: (item: CartItemType) => void;
    removeItem: (id: number) => void;
    incrementItem: (id: number) => void;
    decrementItem: (id: number) => void;
    setDelivery: (option: DeliveryOption) => void;
    setShippingDetails: (details: ShippingDetails) => void; // Update form data
    getTotalPrice: () => string;
    getSubtotal: () => string;
    getItemCount: () => number;
    resetCart: () => void;
};

const initialDelivery: DeliveryOption = { title: 'Standard Delivery', price: 3 };
const initialShipping: ShippingDetails = {
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    zipCode: '12000',
    city: 'Phnom Penh',
    country: 'Cambodia'
};

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    delivery: initialDelivery,
    shippingDetails: initialShipping,

    setDelivery: (option: DeliveryOption) => set({ delivery: option }),
    
    setShippingDetails: (details: ShippingDetails) => set({ shippingDetails: details }),

    addItem: (item: CartItemType) => {
        const existingItem = get().items.find(i => i.id === item.id);
        if (existingItem) {
            set((state) => ({
                items: state.items.map((i) =>
                    i.id === item.id 
                    ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQuantity) } 
                    : i
                )
            }));
        } else {
            set((state) => ({ items: [...state.items, item] }));
        }
    },

    removeItem: (id: number) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),

    incrementItem: (id: number) => set((state) => ({
        items: state.items.map(item =>
            item.id === id && item.quantity < item.maxQuantity
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ),
    })),

    decrementItem: (id: number) => set((state) => ({
        items: state.items.map(item =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        )
    })),

    getTotalPrice: () => {
        const { items, delivery } = get();
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
        return (subtotal + delivery.price).toFixed(2);
    },

    getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    },

    getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
    },

    resetCart: () => set({ items: [], delivery: initialDelivery, shippingDetails: initialShipping }),
}));