import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

const CartSummary: React.FC = () => {
  const { items, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      
      <Button
        fullWidth
        className="mt-6"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>We accept</p>
        <div className="flex justify-center space-x-2 mt-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Visa</span>
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Mastercard</span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">PayPal</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;