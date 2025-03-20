import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut,  Package, Home, Smartphone } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MobileShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
              Products
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/account" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/products"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <Smartphone className="h-5 w-5" />
                <span>Products</span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({getTotalItems()})</span>
              </Link>

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>My Account</span>
                  </Link>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button fullWidth>Register</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
