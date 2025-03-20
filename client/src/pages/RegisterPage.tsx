import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Smartphone } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Smartphone className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {registerError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {registerError}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              fullWidth
            />
            
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              fullWidth
            />
            
            <Button type="submit" fullWidth>
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;