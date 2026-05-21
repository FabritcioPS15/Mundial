import { AppProvider } from './context/AppContext';
import PublicPage from './components/PublicPage';
import AdminPage from './admin/AdminPage';
import Toast from './components/Toast';

function Router() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  return isAdmin ? <AdminPage /> : <PublicPage />;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
      <Toast />
    </AppProvider>
  );
}
