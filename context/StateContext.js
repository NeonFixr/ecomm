import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);
    const [updated, setUpdated] = useState([]);
  
    let foundProduct;
    let index;
    //Функция которая добавляет товар в корзину, либо обновляет его
    // если такой товар уже существует
    const onAdd = (product, quantity) => {
      const checkProductInCart = cartItems.find(
        (item) => item._id === product._id
      );
  
      setTotalPrice(
        (prevTotalPrice) => prevTotalPrice + product.price * quantity
      );
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
  
      if (checkProductInCart) {
        const updatedCartItems = cartItems.map((cartProduct) => {
          if (cartProduct._id === product._id)
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity,
            };
        });
  
        setCartItems(updatedCartItems);
        setUpdated(updatedCartItems);
      } else {
        product.quantity = quantity;
        setCartItems([...cartItems, { ...product }]);
        console.log('cartItemsonAdd', cartItems);
      }
      toast.success(`${qty} ${product.name} added to cart.`);
    };
  
    const onRemove = (product) => {
      foundProduct = cartItems.find((item) => item._id === product._id);
      const newCartItems = cartItems.filter((item) => item._id !== product._id);
  
      setTotalPrice(
        (prevTotalPrice) =>
          prevTotalPrice - foundProduct.price * foundProduct.quantity
      );
      setTotalQuantities(
        (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
      );
  
      setCartItems(newCartItems);
    };
  
    const toggleCartItemQuantity = (id, value) => {
      foundProduct = cartItems.find((item) => item._id === id);
      index = cartItems.findIndex((product) => product._id === id);
  
      if (value === 'inc') {
        setCartItems(
          cartItems.map((item, i) =>
            i === index
              ? { ...foundProduct, quantity: foundProduct.quantity + 1 }
              : item
          )
        );
        setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
      } else if (value === 'dec') {
        if (foundProduct.quantity > 1) {
          setCartItems(
            cartItems.map((item, i) =>
              i === index
                ? { ...foundProduct, quantity: foundProduct.quantity - 1 }
                : item
            )
          );
          setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
          setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
        }
      }
    };
  
    
    const incQty = () => {
      setQty((prevQty) => prevQty + 1);
    };
    
    const decQty = () => {
      setQty((prevQty) => {
        if (prevQty - 1 < 1) return 1;
  
        return prevQty - 1;
      });
    };
    return (
      <Context.Provider
        value={{
          showCart,
          setShowCart,
          cartItems,
          totalPrice,
          totalQuantities,
          qty,
          updated,
          incQty,
          decQty,
          onAdd,
          toggleCartItemQuantity,
          onRemove,
          setCartItems,
          setTotalPrice,
          setTotalQuantities,
        }}
      >
        {children}
      </Context.Provider>
    );
  };
  
  export const useStateContext = () => useContext(Context);