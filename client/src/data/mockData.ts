import { Product, User, Order } from '../types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@mobileshop.com',
    role: 'ADMIN',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER',
  },
];

// Mock products
export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Apple \'s latest flagship phone with A17 Pro chip and advanced camera system.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484bce71?q=80&w=2070&auto=format&fit=crop',
    category: 'Apple',
    stock: 50,
    featured: true,
    specs: {
      display: '6.1-inch Super Retina XDR',
      processor: 'A17 Pro chip',
      camera: '48MP main camera',
      battery: 'Up to 23 hours video playback',
      storage: '128GB, 256GB, 512GB, 1TB',
    },
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung \'s premium smartphone with S Pen support and powerful camera capabilities.',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1707227156456-e5211d14a0ef?q=80&w=2071&auto=format&fit=crop',
    category: 'Samsung',
    stock: 35,
    featured: true,
    specs: {
      display: '6.8-inch Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      camera: '200MP main camera',
      battery: '5,000mAh',
      storage: '256GB, 512GB, 1TB',
    },
  },
  {
    id: '3',
    name: 'Google Pixel 8',
    description: 'Google\'s flagship phone with exceptional camera quality and pure Android experience.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1696446702183-be6c3e3d5c81?q=80&w=2070&auto=format&fit=crop',
    category: 'Google',
    stock: 25,
    specs: {
      display: '6.2-inch OLED',
      processor: 'Google Tensor G3',
      camera: '50MP main camera',
      battery: '4,575mAh',
      storage: '128GB, 256GB',
    },
  },
  {
    id: '4',
    name: 'OnePlus 12',
    description: 'Flagship killer with Hasselblad camera system and lightning-fast charging.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1678911820864-e5a2b4e80e1a?q=80&w=2070&auto=format&fit=crop',
    category: 'OnePlus',
    stock: 20,
    specs: {
      display: '6.7-inch AMOLED LTPO',
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP main camera',
      battery: '5,400mAh',
      storage: '256GB, 512GB',
    },
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra',
    description: 'Premium smartphone with Leica optics and powerful performance.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop',
    category: 'Xiaomi',
    stock: 15,
    specs: {
      display: '6.73-inch AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP main camera',
      battery: '5,000mAh',
      storage: '256GB, 512GB, 1TB',
    },
  },
  {
    id: '6',
    name: 'iPhone SE (2022)',
    description: 'Affordable iPhone with powerful A15 Bionic chip in a compact design.',
    price: 429,
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=2070&auto=format&fit=crop',
    category: 'Apple',
    stock: 40,
    specs: {
      display: '4.7-inch Retina HD',
      processor: 'A15 Bionic chip',
      camera: '12MP main camera',
      battery: 'Up to 15 hours video playback',
      storage: '64GB, 128GB, 256GB',
    },
  },
];

// Mock orders
export const orders: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 2 },
    ],
    total: 2397,
    status: 'delivered',
    createdAt: '2023-12-15T10:30:00Z',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
    },
  },
];

// Mock authentication functions
export const mockAuth = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (email: string, password: string) => {
    // For demo purposes, accept any password for these emails
    const user = users.find((u) => u.email === email);
    if (user) {
      // Create a mock token
      const token = `mock_token_${user.id}_${user.role}`;
      return { user, token };
    }
    throw new Error('Invalid credentials');
  },

  register: (name: string, email: string, password: string) => {
    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: `${users.length + 1}`,
      name,
      email,
      role: 'USER',
    };

    users.push(newUser);

    // Create a mock token
    const token = `mock_token_${newUser.id}_${newUser.role}`;
    return { user: newUser, token };
  },
};

// Mock product API
export const mockProductApi = {
  getProducts: () => {
    return Promise.resolve(products);
  },

  getProduct: (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return Promise.reject(new Error('Product not found'));
    }
    return Promise.resolve(product);
  },

  createProduct: (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `${products.length + 1}`,
    };
    products.push(newProduct);
    return Promise.resolve(newProduct);
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Product not found'));
    }

    products[index] = { ...products[index], ...updates };
    return Promise.resolve(products[index]);
  },

  deleteProduct: (id: string) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Product not found'));
    }

    const deleted = products.splice(index, 1)[0];
    return Promise.resolve(deleted);
  },
};

// Mock order API
export const mockOrderApi = {
  getOrders: (userId?: string) => {
    if (userId) {
      return Promise.resolve(orders.filter((o) => o.userId === userId));
    }
    return Promise.resolve(orders);
  },

  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: `${orders.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    orders.push(newOrder);
    return Promise.resolve(newOrder);
  },

  updateOrderStatus: (id: string, status: Order['status']) => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Order not found'));
    }

    orders[index].status = status;
    return Promise.resolve(orders[index]);
  },
};
