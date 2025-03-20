import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input';
import Button from '../ui/Button';

const checkoutSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(16),
  cardName: z.string().min(3, 'Name on card is required'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string().min(3, 'CVV must be 3 digits').max(3),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            fullWidth
          />
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            fullWidth
          />
          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
            fullWidth
            className="md:col-span-2"
          />
          <Input
            label="City"
            {...register('city')}
            error={errors.city?.message}
            fullWidth
          />
          <Input
            label="Postal Code"
            {...register('postalCode')}
            error={errors.postalCode?.message}
            fullWidth
          />
          <Input
            label="Country"
            {...register('country')}
            error={errors.country?.message}
            fullWidth
            className="md:col-span-2"
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Card Number"
            {...register('cardNumber')}
            error={errors.cardNumber?.message}
            fullWidth
            className="md:col-span-2"
            placeholder="1234 5678 9012 3456"
          />
          <Input
            label="Name on Card"
            {...register('cardName')}
            error={errors.cardName?.message}
            fullWidth
            className="md:col-span-2"
          />
          <Input
            label="Expiry Date"
            {...register('expiryDate')}
            error={errors.expiryDate?.message}
            fullWidth
            placeholder="MM/YY"
          />
          <Input
            label="CVV"
            {...register('cvv')}
            error={errors.cvv?.message}
            fullWidth
            type="password"
            maxLength={3}
          />
        </div>
      </div>
      
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        className="mt-6"
      >
        Complete Order
      </Button>
      
      <p className="text-sm text-gray-500 text-center mt-4">
        This is a demo checkout. No real payment will be processed.
      </p>
    </form>
  );
};

export default CheckoutForm;