import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Product } from '../../types';
import { formatPrice, truncateText } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };
  
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <Link to={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
          <button
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2">
            <span className="text-sm text-blue-600">{product.category}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">
            {truncateText(product.description, 60)}
          </p>
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0">
        <Button
          fullWidth
          onClick={handleAddToCart}
          className="group-hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;