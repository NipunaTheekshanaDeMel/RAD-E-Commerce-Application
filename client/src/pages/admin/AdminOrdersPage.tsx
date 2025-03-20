import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import OrderTable from '../../components/admin/OrderTable';
import { Order } from '../../types';
import { orderApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const AdminOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(id, status);
      setOrders(
        orders.map((order) => (order.id === id ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
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
          <h1 className="text-2xl font-bold">Manage Orders</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
            <p className="text-gray-600">
              There are no orders in the system yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <OrderTable
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminOrdersPage;
