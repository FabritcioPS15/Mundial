import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import PublicPage from './components/PublicPage';
import AdminPage from './admin/AdminPage';
import Toast from './components/Toast';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/*" element={<PublicPage />} />
        </Routes>
      </BrowserRouter>
      <Toast />
    </AppProvider>
  );
}
