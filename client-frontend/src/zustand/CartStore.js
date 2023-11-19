import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useCartStore = create((set) => ({
  checkoutIsLoading: false,
  cartItems: [],
  setCartItems: (newCartItems) => set({ cartItems: newCartItems }),
  newCartItem: null,
  setNewCartItem: (newCartItem) => set({ newCartItem: newCartItem }),
  getCartItems: async () => {
    try {
      const response = await AxiosConnect.get(
        `/gleek/cart/getCartItemsByClientId`
      );
      const data = response.data;
      const combinedDataArray = data.map((item) => ({
        ...item.cartItem,
        isItemStillAvailable: item.isItemStillAvailable,
      }));
      //console.log(combinedDataArray);
      set({ cartItems: combinedDataArray });
    } catch (error) {
      console.error(error);
    }
  },
  addToCartLoading: false,
  setAddToCartLoading: (newSetAddToCartLoading) =>
    set({ addToCartLoading: newSetAddToCartLoading }),
  addToCart: async (cartItemData) => {
    try {
      set({ addToCartLoading: false });
      const response = await AxiosConnect.post(
        `/gleek/cart/addCartItem`,
        cartItemData
      );
      console.log(response.data.data);
      set({ newCartItem: response.data.data });
      setTimeout(() => {
        set({ addToCartLoading: false });
      }, 500);
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteCartItem: async (cartId) => {
    try {
      const response = await AxiosConnect.delete(
        `/gleek/cart/deleteCartItem/${cartId}`
      );
      return true;
    } catch (error) {
      throw error;
    }
  },
  cartItemsToCheckOut: [],
  setCartItemsToCheckout: (newCartItemsToCheckOut) =>
    set({ cartItemsToCheckOut: newCartItemsToCheckOut }),
  checkout: async (cartItemsToCheckOut) => {
    try {
      set({ checkoutIsLoading: true });
      const response = await AxiosConnect.post(
        `/gleek/booking/createBookings`,
        cartItemsToCheckOut
      );
      // console.log(response.data.data);
      // set({ newCartItem: response.data.data });
      // setTimeout(() => {
      //   set({ addToCartLoading: false });
      // }, 500);
      set({ cartItemsToCheckOut: [] });
      set({ checkoutIsLoading: false });
      return true;
    } catch (error) {
      set({ checkoutIsLoading: false });
      throw error;
    }
  },
}));

export default useCartStore;
