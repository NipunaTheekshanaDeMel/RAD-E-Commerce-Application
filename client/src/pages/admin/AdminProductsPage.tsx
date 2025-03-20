import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import ProductTable from '../../components/admin/ProductTable';
import { Product } from '../../types';
import { productApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const AdminProductsPage: React.FC = () => {
  const { user } = useAuthStore();
  useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Link to="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Link to="/admin/products/new">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ProductTable products={products} onDelete={handleDeleteProduct} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProductsPage;
