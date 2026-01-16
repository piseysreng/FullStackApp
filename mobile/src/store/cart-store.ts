
import { create } from "zustand";


type CartItemType = {
    id: number;
    quantity: number;
    price: number;
    maxQuantity: number;
}

type CartState = {
    items: CartItemType[];
    addItem: (item: CartItemType) => void;
    removeItem: (id: number) => void;
    incrementItem: (id: number) => void;
    decrementItem: (id: number) => void;
    getTotalPrice: () => String;
    getItemCount: () => number;
    resetCart: () => void;
};

const inintialCartItems: CartItemType[] = [];

export const useCartStore = create<CartState>((set, get) => ({
    items: inintialCartItems,
    addItem: (item: CartItemType) => {
        const existingItem = get().items.find(i => i.id === item.id);
        // If already have the same ID Item
        if (existingItem) {
            // set((state) => ({
            //     items: state.items.map(
            //         (i) => (
            //             // Condition If the Same ID
            //             i.id === item.id ?
            //                 // If True
            //                 {
            //                     // First Step: Ungroup the Items
            //                     ...i,
            //                     // Second Step: Change the Quantity of the Same ID
            //                     // But Need Make Sure that the Quantity not more than Max Quantity in Stock
            //                     quantity: Math.min(i.quantity + item.quantity, i.maxQuantity)
            //                 }
            //                 // If False return Items
            //                 :
            //                 i
            //         )
            //     )
            // }));
            // If don't have a new ID Item
        } else {
            // Add The New Item inside the Existing Array
            set((state) => ({ items: [...state.items, item] }))
        }
    },
    removeItem: (id: number) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),
    incrementItem: (id: number) => set((state) => {
        //  const product = PRODUCTS.find(p => p.id === id);
        //  if(!product) return state;
        return {
            items: state.items.map(item =>
                item.id === id && item.quantity < item.maxQuantity
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            ),
        };
    }),
    decrementItem: (id: number) => set((state) => ({
        items: state.items.map(item =>
            item.id === id && item.quantity > 1
                ? {
                    ...item,
                    quantity: item.quantity - 1
                }
                : item
        )
    })),
    getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    },
    getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
    },
    resetCart: () => set({ items: inintialCartItems }),
}));