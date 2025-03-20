import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductForm from '../../components/admin/ProductForm';
import Button from '../../components/ui/Button';
import { Product } from '../../types';
import { productApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!id;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode) return;

      try {
        setIsLoading(true);
        const data = await productApi.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const handleSubmit = async (formData: Omit<Product, 'id'>) => {
    try {
      setIsSubmitting(true);

      if (isEditMode && product) {
        await productApi.updateProduct(product.id, formData);
      } else {
        await productApi.createProduct(formData);
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
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
        <div className="mb-6">
          <Link
            to="/admin/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductForm
              initialData={product || undefined}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminProductFormPage;
