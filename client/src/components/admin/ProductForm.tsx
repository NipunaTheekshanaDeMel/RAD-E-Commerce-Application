import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Product } from '../../types';

const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  image: z.string().url('Must be a valid URL'),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().int().nonnegative('Stock must be a positive number'),
  featured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          image: initialData.image,
          category: initialData.category,
          stock: initialData.stock,
          featured: initialData.featured || false,
        }
      : {
          featured: false,
        },
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Product Name"
        {...register('name')}
        error={errors.name?.message}
        fullWidth
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          type="number"
          step="0.01"
          {...register('price')}
          error={errors.price?.message}
          fullWidth
        />
        
        <Input
          label="Stock"
          type="number"
          {...register('stock')}
          error={errors.stock?.message}
          fullWidth
        />
        
        <Input
          label="Category"
          {...register('category')}
          error={errors.category?.message}
          fullWidth
        />
        
        <Input
          label="Image URL"
          {...register('image')}
          error={errors.image?.message}
          fullWidth
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          {...register('featured')}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured Product
        </label>
      </div>
      
      <Button type="submit" isLoading={isLoading}>
        {initialData ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

export default ProductForm;