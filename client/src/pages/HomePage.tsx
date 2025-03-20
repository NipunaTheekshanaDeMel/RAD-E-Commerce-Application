import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/products/ProductGrid';
import Button from '../components/ui/Button';
import { Product } from '../types';
import { productApi } from '../services/api';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productApi.getProducts();
        setFeaturedProducts(products.filter((p: { featured: never; }) => p.featured));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Discover the Latest Mobile Technology
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Explore our collection of premium smartphones from top brands at competitive prices.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/products?category=featured">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Featured
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2081&auto=format&fit=crop"
                alt="Latest smartphones"
                className="rounded-lg shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                <p className="text-gray-600">
                  Free shipping on all orders over $100
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  100% secure payment processing
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Headphones className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Dedicated support team available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Stay updated with the latest products, exclusive offers, and tech news.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:rounded-r-none"
              />
              <Button className="sm:rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Top Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-sm">
              <span className="text-xl font-semibold text-gray-800">Apple</span>
            </div>
            <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-sm">
              <span className="text-xl font-semibold text-gray-800">Samsung</span>
            </div>
            <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-sm">
              <span className="text-xl font-semibold text-gray-800">Google</span>
            </div>
            <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-sm">
              <span className="text-xl font-semibold text-gray-800">OnePlus</span>
            </div>
            <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-sm">
              <span className="text-xl font-semibold text-gray-800">Xiaomi</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
