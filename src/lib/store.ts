import { IProduct } from "@/models/Product";
import { IUser } from "@/models/User";
import { create } from "zustand";

export type storeState = {
  user: IUser | null;
  cart: IProduct[] 
   removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;

  // computed values
  cartTotal: () => number;
  setUser: (user: IUser|null) => void;
  setCart: (product: IProduct, qty: number) => void;
  loadCart: (cartItems: { product: IProduct; quantity: number }[]) => void;
};

export const useDashStore = create<storeState>((set,get) => ({
  user: null,
  cart: [],
  setUser: (user: IUser|null) => set(() => ({ user })),
  setCart: (product: IProduct, qty: number) =>
  set((state) => {
    const existing = state.cart.find((item) => item._id === product._id);

    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity:  qty }
            : item
        ),
      };
    }

    return {
      cart: [...state.cart, { ...product, quantity: qty }],
    };
  }),
   removeItem: (id: string) =>
    set((state) => ({
      cart: state.cart.filter((item) => String(item._id) !== id),
    })),

  // Update quantity (not add — overwrite)
  updateQuantity: (id:string, qty:number) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      ),
    })),
loadCart: (cartItems) =>
    set(() => ({
      cart: cartItems.map((item) => ({
        ...item.product,        // product data
        quantity: item.quantity // quantity from DB
      })),
    })),
  // Clear entire cart
  clearCart: () => set({ cart: [] }),

  // Computed: total cost
 cartTotal: () => {
    return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, 


}));
