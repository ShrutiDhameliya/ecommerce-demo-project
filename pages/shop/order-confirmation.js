import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomerLayout from '../../components/layouts/CustomerLayout';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/shop');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch order');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        router.push('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <CustomerLayout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </CustomerLayout>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <CustomerLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Order Confirmed!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Thank you for your purchase. Your order has been received.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Typography variant="body1">
                Order Number: #{order.id}
              </Typography>
              <Typography variant="body1">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                Total: ${order.total.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.address}
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => router.push('/shop')}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/orders')}
              >
                View Orders
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </CustomerLayout>
  );
}

// Make this page dynamic to prevent static generation
export const getServerSideProps = async () => {
  return {
    props: {}
  };
};