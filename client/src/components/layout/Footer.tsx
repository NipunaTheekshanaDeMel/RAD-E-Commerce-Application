import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">MobileShop</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for premium mobile phones and accessories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Apple" className="text-gray-400 hover:text-white transition-colors">
                  Apple
                </Link>
              </li>
              <li>
                <Link to="/products?category=Samsung" className="text-gray-400 hover:text-white transition-colors">
                  Samsung
                </Link>
              </li>
              <li>
                <Link to="/products?category=Google" className="text-gray-400 hover:text-white transition-colors">
                  Google
                </Link>
              </li>
              <li>
                <Link to="/products?category=OnePlus" className="text-gray-400 hover:text-white transition-colors">
                  OnePlus
                </Link>
              </li>
              <li>
                <Link to="/products?category=Xiaomi" className="text-gray-400 hover:text-white transition-colors">
                  Xiaomi
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-gray-400">
                  123 Tech Street, Digital City, 10001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">info@mobileshop.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MobileShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;