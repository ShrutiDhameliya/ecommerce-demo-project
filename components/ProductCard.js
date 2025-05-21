import { AddShoppingCart, RemoveShoppingCart } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const router = useRouter();

  const handleCartAction = () => {
    if (isInCart(product.id)) {
      router.push('/cart');
    } else {
      addToCart(product);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Button
            variant={isInCart(product.id) ? "outlined" : "contained"}
            color="primary"
            startIcon={isInCart(product.id) ? <RemoveShoppingCart /> : <AddShoppingCart />}
            onClick={handleCartAction}
          >
            {isInCart(product.id) ? 'Go to Cart' : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 