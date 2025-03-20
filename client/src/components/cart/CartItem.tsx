import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;
  
  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };
  
  const handleRemove = () => {
    removeItem(product.id);
  };
  
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{product.name}</h3>
          <p className="ml-4">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleDecrement}
              className="p-1 text-gray-600 hover:text-gray-900"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 py-1 text-gray-900">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-1 text-gray-600 hover:text-gray-900"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;