import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {user?.role === 'admin' && isAdminPage && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${isAdminPage ? 240 : 0}px)` },
            marginTop: '64px', // Height of AppBar
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
} 