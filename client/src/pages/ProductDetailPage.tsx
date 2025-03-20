import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { productApi } from '../services/api';
import { useCartStore } from '../store/cartStore';
import ProductGrid from '../components/products/ProductGrid';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const productData = await productApi.getProduct(id);
        setProduct(productData);

        // Fetch related products (same category)
        const allProducts = await productApi.getProducts();
        const related = allProducts
          .filter(
            (p: { category: never; id: never; }) =>
              p.category === productData.category && p.id !== productData.id
          )
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link
                    to="/products"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-blue-600 font-medium">{product.category}</span>
              <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            </div>

            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center">
              {product.stock > 0 ? (
                <>
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-gray-900">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={product.stock <= quantity}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                fullWidth
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="group relative"
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                fullWidth
                className="flex items-center justify-center"
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Share */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <span className="text-gray-700">Share:</span>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specifications'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Specifications
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'description' ? (
              <div className="prose max-w-none">
                <p>{product.description}</p>
                <p>
                  Experience the future of mobile technology with the {product.name}.
                  This cutting-edge device combines sleek design with powerful performance,
                  making it the perfect companion for work and play.
                </p>
                <p>
                  Whether you're capturing stunning photos, gaming on the go, or
                  multitasking between apps, the {product.name} delivers a seamless
                  and responsive experience that will exceed your expectations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.specs ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="border-b pb-2">
                        <span className="font-medium text-gray-700">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </span>{' '}
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No specifications available for this product.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
