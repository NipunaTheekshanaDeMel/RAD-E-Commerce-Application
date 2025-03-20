import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/products/ProductGrid';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Product } from '../types';
import { productApi } from '../services/api';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 500000,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await productApi.getProducts();
        setProducts(allProducts);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(allProducts.map((p: { category: any; }) => p.category))
        );
        // @ts-ignore
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (categoryParam) {
      if (categoryParam.toLowerCase() === 'featured') {
        result = result.filter((p) => p.featured);
      } else {
        result = result.filter(
          (p) => p.category.toLowerCase() === categoryParam.toLowerCase()
        );
      }
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    setFilteredProducts(result);
  }, [products, categoryParam, searchQuery, priceRange]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;

    if (search) {
      searchParams.set('search', search);
    } else {
      searchParams.delete('search');
    }

    setSearchParams(searchParams);
  };

  const handleCategoryClick = (category: string) => {
    if (categoryParam === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange({ min: 0, max: 2000 });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Mobile Filter Toggle */}
          <div className="w-full md:hidden mb-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Sidebar Filters */}
          <div
            className={`w-full md:w-64 md:block ${
              showFilters ? 'block' : 'hidden'
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      name="search"
                      placeholder="Search products..."
                      defaultValue={searchQuery}
                      fullWidth
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  <div
                    className={`cursor-pointer px-2 py-1 rounded ${
                      categoryParam === 'featured'
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleCategoryClick('featured')}
                  >
                    Featured
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category}
                      className={`cursor-pointer px-2 py-1 rounded ${
                        categoryParam === category
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>LKR{priceRange.min}</span>
                    <span>LKR{priceRange.max}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="100"
                    value={priceRange.max}
                    onChange={(e) =>
                      handlePriceChange(priceRange.min, parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                fullWidth
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {categoryParam
                  ? categoryParam === 'featured'
                    ? 'Featured Products'
                    : `${categoryParam} Products`
                  : 'All Products'}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} products found
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search query.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
