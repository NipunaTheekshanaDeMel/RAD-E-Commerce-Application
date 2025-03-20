import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';

const CartPage: React.FC = () => {
  const { items, clearCart } = useCartStore();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          Your Shopping Cart
        </h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Cart Items ({items.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link to="/products">
                    <Button variant="outline" className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
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

export default CartPage;