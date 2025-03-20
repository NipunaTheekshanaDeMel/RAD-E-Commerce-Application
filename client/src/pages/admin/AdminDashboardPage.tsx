import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, ShoppingBag, Users, DollarSign, Package } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Order, Product } from '../../types';
import { orderApi } from '../../services/api';
import { productApi } from '../../services/api';
import { authApi } from '../../services/api';
import { formatPrice } from '../../lib/utils';

const AdminDashboardPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: [] as Order[],
        lowStockProducts: [] as Product[],
        ordersByStatus: {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        }
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // Fetch orders
                const orders = await orderApi.getOrders();

                // Fetch products
                const products = await productApi.getProducts();

                // Fetch users (assuming you have a userApi similar to productApi)
                // @ts-ignore
                const users: string | any[][] = await authApi.getUsers();

                // Calculate total revenue
                const revenue = orders.reduce((total: any, order: { total: any; }) => total + order.total, 0);

                // Get low stock products (less than 5 in stock)
                const lowStock = products.filter((product: { stock: number; }) => product.stock < 5);

                // Count orders by status
                const ordersByStatus = {
                    pending: orders.filter((order: { status: string; }) => order.status === 'pending').length,
                    processing: orders.filter((order: { status: string; }) => order.status === 'processing').length,
                    shipped: orders.filter((order: { status: string; }) => order.status === 'shipped').length,
                    delivered: orders.filter((order: { status: string; }) => order.status === 'delivered').length,
                    cancelled: orders.filter((order: { status: string; }) => order.status === 'cancelled').length
                };

                // Get recent orders (last 5)
                const recentOrders = [...orders]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5);

                setStats({
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    totalProducts: products.length,
                    totalUsers: users.length,
                    recentOrders,
                    lowStockProducts: lowStock,
                    ordersByStatus
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-16 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex space-x-4">
                        <Link
                            to="/admin/products/new"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add New Product
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold">{stats.totalOrders}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold">{stats.totalProducts}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                        <div className="rounded-full bg-orange-100 p-3 mr-4">
                            <Users className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Recent Orders</h2>
                            <Link
                                to="/admin/orders"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                                            <Link to={`/admin/orders/${order.id}`}>#{order.id.slice(0, 8)}</Link>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : order.status === 'shipped'
                                        ? 'bg-blue-100 text-blue-800'
                                        : order.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatPrice(order.total)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Orders by Status */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Orders by Status</h2>
                            <div className="text-gray-500">
                                <PieChart className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-500">Pending</span>
                                    <span className="text-sm font-medium">{stats.ordersByStatus.pending}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                stats.totalOrders
                                                    ? (stats.ordersByStatus.pending / stats.totalOrders) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-500">Processing</span>
                                    <span className="text-sm font-medium">{stats.ordersByStatus.processing}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                stats.totalOrders
                                                    ? (stats.ordersByStatus.processing / stats.totalOrders) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-500">Shipped</span>
                                    <span className="text-sm font-medium">{stats.ordersByStatus.shipped}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                stats.totalOrders
                                                    ? (stats.ordersByStatus.shipped / stats.totalOrders) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-500">Delivered</span>
                                    <span className="text-sm font-medium">{stats.ordersByStatus.delivered}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                stats.totalOrders
                                                    ? (stats.ordersByStatus.delivered / stats.totalOrders) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-500">Cancelled</span>
                                    <span className="text-sm font-medium">{stats.ordersByStatus.cancelled}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-red-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                stats.totalOrders
                                                    ? (stats.ordersByStatus.cancelled / stats.totalOrders) * 100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Low Stock Products */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Low Stock Products</h2>
                        <Link
                            to="/admin/products"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Manage Products
                        </Link>
                    </div>

                    {stats.lowStockProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {stats.lowStockProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={product.image}
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            product.stock === 0
                                ? 'bg-red-100 text-red-800'
                                : product.stock < 3
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock} left
                        </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/admin/products/edit/${product.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Update Stock
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            All products have sufficient stock levels.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboardPage;
