import { createContext, useReducer } from "react";

// create a context object and simply only spread data to components
const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

// reducer function as an input for useReducer()
function cartReducer(state, action) {
  // action is an object
  if (action.type === "ADD_ITEM") {
    // ... update the state to add a meal item
    const updatedItems = [...state.items]; // create a copy based on the old array

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id // true if the item found in the array
    );

    // check if the added meal is already in the cart
    if (existingCartItemIndex > -1) {
      // > -1 means the item already exists in the cart
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem, // spread all the properties of the existing item
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem; // reinsert the updated item
    } else {
      // push the new item onto the copied array
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    console.log(updatedItems);

    return { ...state, items: updatedItems }; // return an updated state with new object
  }

  if (action.type === "REMOVE_ITEM") {
    // ... remove an item from the state
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items]; // create a new array based on the old items

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1); // remove the certain item from the array
    } else {
      // reduct the item quantity when the quantity is > 1
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state; // return unchanged state
}

// contextProvider makes the context available and handle the actual data and state management
export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({
      type: "ADD_ITEM",
      item,
    });
  }

  function removeItem(id) {
    dispatchCartAction({
      type: "REMOVE_ITEM",
      id,
    });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  console.log(cartContext);

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
