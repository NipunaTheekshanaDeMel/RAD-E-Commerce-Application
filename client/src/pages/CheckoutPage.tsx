import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CartSummary from '../components/cart/CartSummary';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderApi } from '../services/api';

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleCheckout = async (formData: any) => {
    if (items.length === 0 || !user) return;
    
    setIsLoading(true);
    
    try {
      // Create order
      const order = {
        userId: user.id,
        items: items,
        total: getTotalPrice() + 10 + getTotalPrice() * 0.1, // Subtotal + shipping + tax
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };
      
      await orderApi.createOrder(order);
      
      // Show success message
      setIsSuccess(true);
      
      // Clear cart
      clearCart();
      
      // Redirect to success page after a delay
      setTimeout(() => {
        navigate('/account/orders');
      }, 3000);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <p className="text-gray-600 mb-6">
              You will be redirected to your orders page shortly.
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600">
              You need to add items to your cart before checking out.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
              </div>
            </div>
            
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutPage;