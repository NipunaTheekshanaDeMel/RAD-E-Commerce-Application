import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, CreditCard, Settings } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { orderApi } from '../services/api';
import { Order } from '../types';
import { formatPrice } from '../lib/utils';

const AccountPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const userOrders = await orderApi.getOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
          <p className="mb-6">Please log in to view your account.</p>
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <span className="mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                </span>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/account"
                  className="flex items-center space-x-2 p-2 rounded-md bg-blue-50 text-blue-700"
                >
                  <User className="h-5 w-5" />
                  <span>Account Overview</span>
                </Link>
                <Link
                  to="/account/orders"
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  to="/account/payment"
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Methods</span>
                </Link>
                <Link
                  to="/account/settings"
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 rounded-md text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <p className="text-gray-600">Name: {user.name}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">
                    Role: {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Edit Profile
                  </Button>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Default Shipping Address</h3>
                  <p className="text-gray-600">No address saved yet.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Add Address
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link
                  to="/account/orders"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't placed any orders yet.
                  </p>
                  <Link to="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 3).map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{order.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatPrice(order.total)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/account/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
